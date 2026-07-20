// Auth check - redirect to login if not authenticated
if (!isAuthenticated()) { 
    window.location.href = 'login.html'; 
}

// Global variables
let webrtcManager;
let socket;
let localStream;
let isAudioEnabled = true;
let isVideoEnabled = true;
let isSidebarOpen = true;
let currentTab = 'chat';
let messageCount = 0;
let filesShared = 0;
let meetingStartTime = Date.now();
let sharedFiles = [];
let isHandRaised = false;
let isRecording = false;
let currentLayout = 'grid'; // 'grid' or 'speaker'
let pinnedParticipant = null;
let isBackgroundBlurred = false;
let virtualBackground = null;
let captionsEnabled = false;
let noiseCancellationEnabled = false;
let mediaRecorder = null;
let recordedChunks = [];

const userData = getUserData();
const meetingId = localStorage.getItem('currentMeetingId');

// Validate meeting ID
if (!meetingId) {
    alert('No meeting ID found. Please create or join a meeting first.');
    window.location.href = 'dashboard.html';
}

const userId = userData ? userData.id : null;

// Validate user ID
if (!userId) {
    alert('User not authenticated. Please login first.');
    window.location.href = 'login.html';
}

// Display meeting info
document.getElementById('meetingCodeDisplay').textContent = `Code: ${meetingId}`;

// Start meeting timer
updateMeetingTime();
setInterval(updateMeetingTime, 1000);

// Initialize Socket.IO
socket = io('https://vcollab-backend-production.up.railway.app');

socket.on('connect', () => {
    console.log('Connected to server');
    
    // Join room
    socket.emit('join-room', meetingId, userId);
    
    // Initialize WebRTC
    initializeMedia();
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Initialize media and WebRTC
async function initializeMedia() {
    try {
        webrtcManager = new WebRTCManager(socket, meetingId, userId);
        
        // Set up callbacks
        webrtcManager.onRemoteStream = addRemoteVideo;
        webrtcManager.onPeerRemoved = removeRemoteVideo;
        
        // Get local stream
        localStream = await webrtcManager.initialize();
        
        // Display local video
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = localStream;
        
        // Setup socket listeners for WebRTC signaling
        webrtcManager.setupSocketListeners();
        
        console.log('Media initialized successfully');
    } catch (error) {
        console.error('Failed to initialize media:', error);
        alert('Unable to access camera or microphone. Please allow permissions and refresh.');
    }
}

// Add remote video
function addRemoteVideo(peerId, stream) {
    // Check if video already exists
    let videoWrapper = document.getElementById(`video-${peerId}`);
    
    if (!videoWrapper) {
        const videoGrid = document.getElementById('videoGrid');
        
        videoWrapper = document.createElement('div');
        videoWrapper.className = 'video-wrapper';
        videoWrapper.id = `video-${peerId}`;
        
        const video = document.createElement('video');
        video.autoplay = true;
        video.playsinline = true;
        video.srcObject = stream;
        
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        overlay.innerHTML = `
            <span>🎤</span>
            <span>Participant ${peerId.substring(0, 6)}</span>
        `;
        
        videoWrapper.appendChild(video);
        videoWrapper.appendChild(overlay);
        videoGrid.appendChild(videoWrapper);
        
        updateParticipantCount();
    }
}

// Remove remote video
function removeRemoteVideo(peerId) {
    const videoWrapper = document.getElementById(`video-${peerId}`);
    if (videoWrapper) {
        videoWrapper.remove();
        updateParticipantCount();
    }
}

// Update participant count
function updateParticipantCount() {
    const videoGrid = document.getElementById('videoGrid');
    const count = videoGrid.children.length;
    document.getElementById('participantCount').textContent = `👤 ${count}`;
    document.getElementById('totalParticipants').textContent = count;
}

// Meeting time display
function updateMeetingTime() {
    const elapsed = Date.now() - meetingStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const timeStr = `${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    const durationStr = `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    
    document.getElementById('timeDisplay').textContent = timeStr;
    document.getElementById('meetingTime').textContent = timeStr;
    document.getElementById('meetingDuration').textContent = durationStr;
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebarPanel');
    isSidebarOpen = !isSidebarOpen;
    
    if (isSidebarOpen) {
        sidebar.classList.remove('hidden');
    } else {
        sidebar.classList.add('hidden');
    }
}

// Switch tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Hide all tabs
    document.getElementById('chatTab').style.display = 'none';
    document.getElementById('summaryTab').style.display = 'none';
    document.getElementById('filesTab').style.display = 'none';
    
    // Show chat input only for chat tab
    const chatInputArea = document.getElementById('chatInputArea');
    
    // Show selected tab
    if (tabName === 'chat') {
        document.getElementById('chatTab').style.display = 'block';
        chatInputArea.style.display = 'block';
    } else if (tabName === 'summary') {
        document.getElementById('summaryTab').style.display = 'block';
        chatInputArea.style.display = 'none';
        updateSummary();
    } else if (tabName === 'files') {
        document.getElementById('filesTab').style.display = 'block';
        chatInputArea.style.display = 'none';
    }
}

// Update summary with AI-like text
function updateSummary() {
    const messages = messageCount;
    const files = filesShared;
    const participants = document.getElementById('videoGrid').children.length;
    
    let summaryText = 'Meeting summary:\n\n';
    
    if (messages > 0) {
        summaryText += `• ${messages} message${messages > 1 ? 's' : ''} exchanged between participants\n`;
    }
    
    if (files > 0) {
        summaryText += `• ${files} file${files > 1 ? 's' : ''} shared during the meeting\n`;
    }
    
    if (participants > 1) {
        summaryText += `• Active discussion with ${participants} participants\n`;
    }
    
    const duration = Date.now() - meetingStartTime;
    const minutes = Math.floor(duration / 60000);
    if (minutes > 5) {
        summaryText += `• Productive ${minutes}-minute session\n`;
    }
    
    if (messages === 0 && files === 0) {
        summaryText = 'No activity yet. Meeting summary will be generated as participants interact.';
    }
    
    document.getElementById('aiSummary').textContent = summaryText;
    document.getElementById('messageCount').textContent = messageCount;
    document.getElementById('filesShared').textContent = filesShared;
}

// File upload handling
function handleFileUpload(event) {
    const files = event.target.files;
    
    for (let file of files) {
        const fileData = {
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
            uploadedBy: userData ? userData.fullName : 'You',
            timestamp: Date.now()
        };
        
        sharedFiles.push(fileData);
        filesShared++;
        
        // Broadcast file info to other participants
        socket.emit('file-shared', fileData, meetingId);
        
        // Display file locally
        displayFile(fileData);
        
        // Update summary
        document.getElementById('filesShared').textContent = filesShared;
    }
}

// Display file in list
function displayFile(fileData) {
    const filesList = document.getElementById('filesList');
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div class="file-icon">📄</div>
        <div class="file-info">
            <div class="file-name">${fileData.name}</div>
            <div class="file-meta">${fileData.size} • Shared by ${fileData.uploadedBy}</div>
        </div>
        <div class="file-actions">
            <button class="file-action-btn" onclick="downloadFile('${fileData.id}')">Download</button>
        </div>
    `;
    
    filesList.appendChild(fileItem);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Download file
function downloadFile(fileId) {
    const file = sharedFiles.find(f => f.id === fileId);
    if (file) {
        alert(`Downloading ${file.name}...`);
        // In real implementation, this would download the file
    }
}

// Receive shared file
socket.on('file-shared', (fileData) => {
    sharedFiles.push(fileData);
    filesShared++;
    displayFile(fileData);
    document.getElementById('filesShared').textContent = filesShared;
});

// Toggle audio
function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
    webrtcManager.toggleAudio(isAudioEnabled);
    
    const btn = document.getElementById('micBtn');
    btn.textContent = isAudioEnabled ? '🎤' : '🔇';
    btn.className = isAudioEnabled ? 'control-btn active' : 'control-btn';
}

// Toggle video
function toggleVideo() {
    isVideoEnabled = !isVideoEnabled;
    webrtcManager.toggleVideo(isVideoEnabled);
    
    const btn = document.getElementById('camBtn');
    btn.textContent = isVideoEnabled ? '📹' : '📵';
    btn.className = isVideoEnabled ? 'control-btn active' : 'control-btn';
}

// Share screen
async function shareScreen() {
    try {
        const screenStream = await webrtcManager.shareScreen();
        
        // Show screen in local video
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = screenStream;
        
        // When screen sharing stops, revert to camera
        screenStream.getVideoTracks()[0].onended = () => {
            localVideo.srcObject = localStream;
        };
    } catch (error) {
        console.error('Screen sharing error:', error);
        alert('Screen sharing cancelled or not supported.');
    }
}

// Send chat message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (messageText === '') return;
    
    const message = {
        sender: userData ? userData.fullName : 'Guest',
        senderId: userId,
        text: messageText,
        timestamp: new Date().toISOString()
    };
    
    // Send via Socket.IO
    socket.emit('send-message', message, meetingId);
    
    // Display locally
    displayMessage(message, true);
    
    // Increment message count
    messageCount++;
    
    // Clear input
    messageInput.value = '';
}

// Receive chat message
socket.on('receive-message', (message) => {
    if (message.senderId !== userId) {
        displayMessage(message, false);
        messageCount++;
    }
});

// Display chat message
function displayMessage(message, isSent) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    const time = new Date(message.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="chat-message-header">
            <span class="chat-sender">${message.sender}</span>
            <span class="chat-time">${time}</span>
        </div>
        <div class="chat-text">${message.text}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// End meeting
function endMeeting() {
    if (confirm('Are you sure you want to leave the meeting?')) {
        // Disconnect WebRTC
        if (webrtcManager) {
            webrtcManager.disconnect();
        }
        
        // Disconnect socket
        if (socket) {
            socket.disconnect();
        }
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (webrtcManager) {
        webrtcManager.disconnect();
    }
    if (socket) {
        socket.disconnect();
    }
});


// ==========================================
// ADVANCED FEATURES (Google Meet + Zoom)
// ==========================================

// 1. RAISE HAND
function toggleRaiseHand() {
    isHandRaised = !isHandRaised;
    const btn = document.getElementById('raiseHandBtn');
    
    if (isHandRaised) {
        btn.style.background = '#fbbc04';
        btn.style.color = '#000';
        socket.emit('hand-raised', { userId, userName: userData ? userData.fullName : 'Guest', raised: true }, meetingId);
        showNotification('✋ Hand raised');
    } else {
        btn.style.background = '#3c4043';
        btn.style.color = '#e8eaed';
        socket.emit('hand-raised', { userId, userName: userData ? userData.fullName : 'Guest', raised: false }, meetingId);
        showNotification('Hand lowered');
    }
}

socket.on('hand-raised', (data) => {
    if (data.raised) {
        showNotification(`✋ ${data.userName} raised their hand`);
    }
});

// 2. REACTIONS
let reactionsVisible = false;

function showReactions() {
    const popup = document.getElementById('reactionsPopup');
    reactionsVisible = !reactionsVisible;
    popup.style.display = reactionsVisible ? 'flex' : 'none';
}

function sendReaction(emoji) {
    // Broadcast reaction to all participants
    socket.emit('reaction-sent', { userId, emoji }, meetingId);
    
    // Show reaction locally
    animateReaction(emoji);
    
    // Hide popup
    showReactions();
}

function animateReaction(emoji) {
    const container = document.getElementById('reactionAnimations');
    const reaction = document.createElement('div');
    reaction.textContent = emoji;
    reaction.style.cssText = `
        position: absolute;
        font-size: 48px;
        left: ${Math.random() * 80}%;
        bottom: 0;
        animation: floatUp 3s ease-out forwards;
        pointer-events: none;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            50% { transform: translateY(-100px) scale(1.2); opacity: 1; }
            100% { transform: translateY(-200px) scale(0.8); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    container.appendChild(reaction);
    setTimeout(() => reaction.remove(), 3000);
}

socket.on('reaction-sent', (data) => {
    animateReaction(data.emoji);
});

// 3. PARTICIPANTS PANEL
function showParticipants() {
    const panel = document.getElementById('participantsPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    
    if (panel.style.display === 'block') {
        updateParticipantsList();
    }
}

function closeParticipants() {
    document.getElementById('participantsPanel').style.display = 'none';
}

function updateParticipantsList() {
    const list = document.getElementById('participantsList');
    const participants = [
        { name: 'You (Host)', id: userId, isHost: true }
    ];
    
    list.innerHTML = participants.map(p => `
        <div style="padding:12px; background:#2d2e30; border-radius:8px; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:32px; height:32px; border-radius:50%; background:#8ab4f8; display:flex; align-items:center; justify-content:center; color:#000; font-weight:500; font-size:14px;">
                    ${p.name.charAt(0)}
                </div>
                <div>
                    <div style="color:#e8eaed; font-size:14px; font-weight:500;">${p.name}</div>
                    ${p.isHost ? '<div style="color:#8ab4f8; font-size:12px;">Host</div>' : ''}
                </div>
            </div>
            ${p.isHost ? '' : `
                <div style="display:flex; gap:8px;">
                    <button onclick="muteParticipant('${p.id}')" style="padding:6px 12px; background:#3c4043; color:#e8eaed; border:none; border-radius:4px; font-size:12px; cursor:pointer;" title="Mute">🔇</button>
                    <button onclick="removeParticipant('${p.id}')" style="padding:6px 12px; background:#ea4335; color:#fff; border:none; border-radius:4px; font-size:12px; cursor:pointer;" title="Remove">✕</button>
                </div>
            `}
        </div>
    `).join('');
}

function muteParticipant(participantId) {
    socket.emit('mute-participant', { participantId }, meetingId);
    showNotification('Participant muted');
}

function removeParticipant(participantId) {
    if (confirm('Remove this participant from the meeting?')) {
        socket.emit('remove-participant', { participantId }, meetingId);
        showNotification('Participant removed');
    }
}

// 4. RECORDING
function toggleRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' }
        });
        
        // Combine screen and audio
        const audioContext = new AudioContext();
        const audioDestination = audioContext.createMediaStreamDestination();
        
        if (localStream) {
            const audioSource = audioContext.createMediaStreamSource(localStream);
            audioSource.connect(audioDestination);
        }
        
        const combinedStream = new MediaStream([
            ...displayStream.getVideoTracks(),
            ...audioDestination.stream.getAudioTracks()
        ]);
        
        mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: 'video/webm;codecs=vp9'
        });
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `meeting-recording-${Date.now()}.webm`;
            a.click();
            recordedChunks = [];
        };
        
        mediaRecorder.start();
        isRecording = true;
        
        document.getElementById('recordBtn').style.background = '#ea4335';
        document.getElementById('recordingIndicator').style.display = 'flex';
        
        showNotification('🔴 Recording started');
    } catch (error) {
        console.error('Recording error:', error);
        showNotification('Failed to start recording');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        isRecording = false;
        
        document.getElementById('recordBtn').style.background = '#3c4043';
        document.getElementById('recordingIndicator').style.display = 'none';
        
        showNotification('Recording stopped and saved');
    }
}

// 5. SETTINGS PANEL
function openSettings() {
    document.getElementById('settingsPanel').style.display = 'block';
    document.getElementById('settingsOverlay').style.display = 'block';
    loadDevices();
}

function closeSettings() {
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('settingsOverlay').style.display = 'none';
}

async function loadDevices() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const micSelect = document.getElementById('micSelect');
        const speakerSelect = document.getElementById('speakerSelect');
        const cameraSelect = document.getElementById('cameraSelect');
        
        micSelect.innerHTML = '';
        speakerSelect.innerHTML = '';
        cameraSelect.innerHTML = '';
        
        devices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `${device.kind} ${device.deviceId.substring(0, 8)}`;
            
            if (device.kind === 'audioinput') {
                micSelect.appendChild(option);
            } else if (device.kind === 'audiooutput') {
                speakerSelect.appendChild(option);
            } else if (device.kind === 'videoinput') {
                cameraSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading devices:', error);
    }
}

async function changeMicrophone() {
    const deviceId = document.getElementById('micSelect').value;
    try {
        const newStream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: deviceId } },
            video: isVideoEnabled
        });
        
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.stop());
        }
        
        localStream = newStream;
        updateLocalStreamForPeers();
        showNotification('Microphone changed');
    } catch (error) {
        console.error('Error changing microphone:', error);
    }
}

async function changeCamera() {
    const deviceId = document.getElementById('cameraSelect').value;
    try {
        const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } },
            audio: isAudioEnabled
        });
        
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.stop());
        }
        
        localStream = newStream;
        document.getElementById('localVideo').srcObject = newStream;
        updateLocalStreamForPeers();
        showNotification('Camera changed');
    } catch (error) {
        console.error('Error changing camera:', error);
    }
}

function changeSpeaker() {
    const deviceId = document.getElementById('speakerSelect').value;
    // Set audio output for all video elements
    document.querySelectorAll('video').forEach(video => {
        if (typeof video.setSinkId !== 'undefined') {
            video.setSinkId(deviceId).then(() => {
                showNotification('Speaker changed');
            }).catch(err => console.error('Error changing speaker:', err));
        }
    });
}

function updateLocalStreamForPeers() {
    if (webrtcManager && webrtcManager.peerConnections) {
        Object.values(webrtcManager.peerConnections).forEach(pc => {
            const senders = pc.getSenders();
            senders.forEach(sender => {
                if (sender.track) {
                    const newTrack = localStream.getTracks().find(t => t.kind === sender.track.kind);
                    if (newTrack) {
                        sender.replaceTrack(newTrack);
                    }
                }
            });
        });
    }
}

// 6. BACKGROUND BLUR
function toggleBackgroundBlur() {
    isBackgroundBlurred = !isBackgroundBlurred;
    const btn = document.getElementById('blurBtn');
    
    if (isBackgroundBlurred) {
        btn.textContent = 'Disable Background Blur';
        btn.style.background = '#34a853';
        applyBackgroundEffect('blur');
        showNotification('Background blur enabled');
    } else {
        btn.textContent = 'Enable Background Blur';
        btn.style.background = '#8ab4f8';
        removeBackgroundEffect();
        showNotification('Background blur disabled');
    }
}

function applyBackgroundEffect(type) {
    const video = document.getElementById('localVideo');
    
    if (type === 'blur') {
        video.style.filter = 'blur(0px)';
        video.parentElement.style.filter = 'blur(20px)';
        video.style.position = 'relative';
        video.style.zIndex = '2';
    }
}

function removeBackgroundEffect() {
    const video = document.getElementById('localVideo');
    video.style.filter = 'none';
    video.parentElement.style.filter = 'none';
}

// 7. VIRTUAL BACKGROUND
function selectVirtualBackground() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                virtualBackground = event.target.result;
                applyVirtualBackground();
                showNotification('Virtual background applied');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function applyVirtualBackground() {
    const video = document.getElementById('localVideo');
    if (virtualBackground) {
        video.parentElement.style.backgroundImage = `url(${virtualBackground})`;
        video.parentElement.style.backgroundSize = 'cover';
        video.parentElement.style.backgroundPosition = 'center';
        video.style.opacity = '0.8';
    }
}

// 8. CLOSED CAPTIONS
function toggleCaptions() {
    captionsEnabled = document.getElementById('captionsToggle').checked;
    const display = document.getElementById('captionsDisplay');
    
    if (captionsEnabled) {
        display.style.display = 'block';
        startSpeechRecognition();
        showNotification('Closed captions enabled');
    } else {
        display.style.display = 'none';
        stopSpeechRecognition();
        showNotification('Closed captions disabled');
    }
}

let recognition;

function startSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            document.getElementById('captionsDisplay').textContent = transcript;
        };
        
        recognition.start();
    } else {
        showNotification('Speech recognition not supported');
    }
}

function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

// 9. NOISE CANCELLATION
function toggleNoiseCancel() {
    noiseCancellationEnabled = document.getElementById('noiseCancelToggle').checked;
    
    if (noiseCancellationEnabled) {
        // Apply audio filters
        if (localStream) {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(localStream);
            const filter = audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 200;
            source.connect(filter);
            filter.connect(audioContext.destination);
        }
        showNotification('Noise cancellation enabled');
    } else {
        showNotification('Noise cancellation disabled');
    }
}

// 10. LAYOUT SWITCHING
function switchLayout() {
    currentLayout = currentLayout === 'grid' ? 'speaker' : 'grid';
    const btn = document.getElementById('layoutBtn');
    const grid = document.getElementById('videoGrid');
    
    if (currentLayout === 'speaker') {
        btn.textContent = '▦';
        grid.style.gridTemplateColumns = '1fr';
        grid.style.gridAutoRows = 'minmax(400px, 1fr)';
        showNotification('Speaker view');
    } else {
        btn.textContent = '🔳';
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        grid.style.gridAutoRows = 'minmax(200px, 1fr)';
        showNotification('Grid view');
    }
}

// 11. PIN/SPOTLIGHT VIDEO
function pinVideo(videoId) {
    if (pinnedParticipant === videoId) {
        pinnedParticipant = null;
        showNotification('Video unpinned');
    } else {
        pinnedParticipant = videoId;
        const videoElement = document.getElementById(videoId);
        if (videoElement) {
            videoElement.style.order = '-1';
            videoElement.style.gridColumn = 'span 2';
            videoElement.style.gridRow = 'span 2';
        }
        showNotification('Video pinned');
    }
}

// 12. FULLSCREEN
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        showNotification('Entered fullscreen');
    } else {
        document.exitFullscreen();
        showNotification('Exited fullscreen');
    }
}

// 13. MEETING INFO
function showMeetingInfo() {
    const info = `
Meeting ID: ${meetingId}
Duration: ${document.getElementById('meetingDuration').textContent}
Participants: ${document.getElementById('totalParticipants').textContent}
    `;
    alert(info);
}

// 14. NOTIFICATION SYSTEM
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9);
        backdrop-filter: blur(10px);
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize features on load
setTimeout(() => {
    showNotification('✅ All features loaded');
}, 1000);


// More Menu Toggle
function toggleMoreMenu() {
    const menu = document.getElementById('moreMenu');
    menu.classList.toggle('show');
}

// Close more menu when clicking outside
document.addEventListener('click', (e) => {
    const moreBtn = document.getElementById('moreBtn');
    const moreMenu = document.getElementById('moreMenu');
    
    if (moreBtn && moreMenu && !moreBtn.contains(e.target) && !moreMenu.contains(e.target)) {
        moreMenu.classList.remove('show');
    }
});

// Update button text when toggling features
function updateToggleText(elementId, activeText, inactiveText, isActive) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = isActive ? activeText : inactiveText;
    }
}

// Override existing functions to update menu text
const originalToggleRaiseHand = toggleRaiseHand;
toggleRaiseHand = function() {
    originalToggleRaiseHand();
    updateToggleText('raiseHandText', 'Lower hand', 'Raise hand', isHandRaised);
};

const originalToggleRecording = toggleRecording;
toggleRecording = function() {
    originalToggleRecording();
    updateToggleText('recordText', 'Stop recording', 'Start recording', isRecording);
};

const originalSwitchLayout = switchLayout;
switchLayout = function() {
    originalSwitchLayout();
    updateToggleText('layoutText', 'Grid view', 'Speaker view', currentLayout === 'speaker');
};

// Update captions toggle to work from menu
const originalToggleCaptions = toggleCaptions;
toggleCaptions = function() {
    const checkbox = document.getElementById('captionsToggle');
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
    }
    captionsEnabled = checkbox ? checkbox.checked : !captionsEnabled;
    
    const display = document.getElementById('captionsDisplay');
    
    if (captionsEnabled) {
        display.style.display = 'block';
        startSpeechRecognition();
        showNotification('Closed captions enabled');
        updateToggleText('captionsText', 'Turn off captions', 'Turn on captions', true);
    } else {
        display.style.display = 'none';
        stopSpeechRecognition();
        showNotification('Closed captions disabled');
        updateToggleText('captionsText', 'Turn off captions', 'Turn on captions', false);
    }
};
