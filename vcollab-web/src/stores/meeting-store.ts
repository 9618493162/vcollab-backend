import { create } from 'zustand'
import { participants as seedParticipants, type Participant } from '@/lib/mock-data'

export type ViewMode = 'speaker' | 'gallery'
export type SidePanel = 'none' | 'participants' | 'chat' | 'notes' | 'ai' | 'polls' | 'whiteboard' | 'captions'

export interface FloatingReaction {
  id: number
  emoji: string
  from: string
}

interface MeetingState {
  viewMode: ViewMode
  micOn: boolean
  camOn: boolean
  sharingScreen: boolean
  handRaised: boolean
  captionsOn: boolean
  recording: boolean
  backgroundBlur: boolean
  noiseSuppression: boolean
  pinnedId: string | null
  activePanel: SidePanel
  participants: Participant[]
  reactions: FloatingReaction[]
  elapsedSec: number

  setViewMode: (m: ViewMode) => void
  toggleMic: () => void
  toggleCam: () => void
  toggleScreen: () => void
  toggleHand: () => void
  toggleCaptions: () => void
  toggleRecording: () => void
  toggleBlur: () => void
  toggleNoise: () => void
  setPanel: (p: SidePanel) => void
  pin: (id: string | null) => void
  pushReaction: (emoji: string, from?: string) => void
  removeReaction: (id: number) => void
  raiseHandFor: (id: string) => void
  lowerHandFor: (id: string) => void
  muteFor: (id: string) => void
  tick: () => void
}

let reactionId = 0

export const useMeetingStore = create<MeetingState>((set) => ({
  viewMode: 'speaker',
  micOn: true,
  camOn: true,
  sharingScreen: false,
  handRaised: false,
  captionsOn: true,
  recording: false,
  backgroundBlur: false,
  noiseSuppression: true,
  pinnedId: null,
  activePanel: 'none',
  participants: seedParticipants,
  reactions: [],
  elapsedSec: 14 * 60 + 22,

  setViewMode: (viewMode) => set({ viewMode }),
  toggleMic: () => set((s) => ({ micOn: !s.micOn })),
  toggleCam: () => set((s) => ({ camOn: !s.camOn })),
  toggleScreen: () => set((s) => ({ sharingScreen: !s.sharingScreen })),
  toggleHand: () =>
    set((s) => ({
      handRaised: !s.handRaised,
      participants: s.participants.map((p) => (p.isSelf ? { ...p, isHandRaised: !s.handRaised } : p)),
    })),
  toggleCaptions: () => set((s) => ({ captionsOn: !s.captionsOn })),
  toggleRecording: () => set((s) => ({ recording: !s.recording })),
  toggleBlur: () => set((s) => ({ backgroundBlur: !s.backgroundBlur })),
  toggleNoise: () => set((s) => ({ noiseSuppression: !s.noiseSuppression })),
  setPanel: (p) => set((s) => ({ activePanel: s.activePanel === p ? 'none' : p })),
  pin: (pinnedId) => set({ pinnedId }),
  pushReaction: (emoji, from = 'You') =>
    set((s) => ({ reactions: [...s.reactions.slice(-14), { id: ++reactionId, emoji, from }] })),
  removeReaction: (id) => set((s) => ({ reactions: s.reactions.filter((r) => r.id !== id) })),
  raiseHandFor: (id) =>
    set((s) => ({ participants: s.participants.map((p) => (p.id === id ? { ...p, isHandRaised: true } : p)) })),
  lowerHandFor: (id) =>
    set((s) => ({ participants: s.participants.map((p) => (p.id === id ? { ...p, isHandRaised: false } : p)) })),
  muteFor: (id) =>
    set((s) => ({ participants: s.participants.map((p) => (p.id === id ? { ...p, isMuted: true } : p)) })),
  tick: () => set((s) => ({ elapsedSec: s.elapsedSec + 1 })),
}))

export function formatElapsed(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
