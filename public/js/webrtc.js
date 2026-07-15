// WebRTC Configuration
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

class WebRTCManager {
    constructor(socket, roomId, userId) {
        this.socket = socket;
        this.roomId = roomId;
        this.userId = userId;
        this.peerConnections = {};
        this.localStream = null;
        this.remoteStreams = {};
    }

    async initialize() {
        // Get local media stream
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true
            });
            return this.localStream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    }

    setupSocketListeners() {
        // User connected to room
        this.socket.on('user-connected', (userId) => {
            console.log('User connected:', userId);
            // Create peer connection and send offer
            this.createPeerConnection(userId, true);
        });

        // Receive offer from peer
        this.socket.on('offer', async (offer, senderId) => {
            console.log('Received offer from:', senderId);
            await this.handleOffer(offer, senderId);
        });

        // Receive answer from peer
        this.socket.on('answer', async (answer, senderId) => {
            console.log('Received answer from:', senderId);
            await this.handleAnswer(answer, senderId);
        });

        // Receive ICE candidate
        this.socket.on('ice-candidate', async (candidate, senderId) => {
            console.log('Received ICE candidate from:', senderId);
            await this.handleIceCandidate(candidate, senderId);
        });

        // User disconnected
        this.socket.on('user-disconnected', (userId) => {
            console.log('User disconnected:', userId);
            this.removePeer(userId);
        });
    }

    createPeerConnection(peerId, isInitiator) {
        const peerConnection = new RTCPeerConnection(configuration);
        this.peerConnections[peerId] = peerConnection;

        // Add local stream tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, this.localStream);
            });
        }

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            console.log('Received remote track from:', peerId);
            if (event.streams && event.streams[0]) {
                this.remoteStreams[peerId] = event.streams[0];
                this.onRemoteStream(peerId, event.streams[0]);
            }
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket.emit('ice-candidate', {
                    candidate: event.candidate,
                    peerId: this.userId
                }, this.roomId);
            }
        };

        // Connection state change
        peerConnection.onconnectionstatechange = () => {
            console.log(`Connection state with ${peerId}:`, peerConnection.connectionState);
        };

        // If initiator, create and send offer
        if (isInitiator) {
            this.createOffer(peerId);
        }

        return peerConnection;
    }

    async createOffer(peerId) {
        try {
            const peerConnection = this.peerConnections[peerId];
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            
            this.socket.emit('offer', {
                offer: offer,
                peerId: this.userId
            }, this.roomId);
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    }

    async handleOffer(data, senderId) {
        try {
            // Create peer connection if it doesn't exist
            if (!this.peerConnections[senderId]) {
                this.createPeerConnection(senderId, false);
            }

            const peerConnection = this.peerConnections[senderId];
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

            // Create and send answer
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            this.socket.emit('answer', {
                answer: answer,
                peerId: this.userId
            }, this.roomId);
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }

    async handleAnswer(data, senderId) {
        try {
            const peerConnection = this.peerConnections[senderId];
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }

    async handleIceCandidate(data, senderId) {
        try {
            const peerConnection = this.peerConnections[senderId];
            if (peerConnection && data.candidate) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        } catch (error) {
            console.error('Error handling ICE candidate:', error);
        }
    }

    removePeer(peerId) {
        if (this.peerConnections[peerId]) {
            this.peerConnections[peerId].close();
            delete this.peerConnections[peerId];
        }
        if (this.remoteStreams[peerId]) {
            delete this.remoteStreams[peerId];
        }
        this.onPeerRemoved(peerId);
    }

    toggleAudio(enabled) {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = enabled;
            });
        }
    }

    toggleVideo(enabled) {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = enabled;
            });
        }
    }

    async shareScreen() {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: 'always' },
                audio: false
            });

            const videoTrack = screenStream.getVideoTracks()[0];

            // Replace video track in all peer connections
            Object.values(this.peerConnections).forEach(pc => {
                const sender = pc.getSenders().find(s => s.track?.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            });

            // When screen sharing stops, revert to camera
            videoTrack.onended = () => {
                this.stopScreenShare();
            };

            return screenStream;
        } catch (error) {
            console.error('Error sharing screen:', error);
            throw error;
        }
    }

    stopScreenShare() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            
            Object.values(this.peerConnections).forEach(pc => {
                const sender = pc.getSenders().find(s => s.track?.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            });
        }
    }

    disconnect() {
        // Stop local stream
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }

        // Close all peer connections
        Object.keys(this.peerConnections).forEach(peerId => {
            this.removePeer(peerId);
        });
    }

    // Callbacks to be overridden
    onRemoteStream(peerId, stream) {
        console.log('Remote stream received from:', peerId);
    }

    onPeerRemoved(peerId) {
        console.log('Peer removed:', peerId);
    }
}
