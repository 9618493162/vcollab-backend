// ─────────────────────────────────────────────────────────────────────────────
// VCollab mock data layer — single source of truth for the demo experience.
// Everything is typed so pages/components share the same shapes.
// ─────────────────────────────────────────────────────────────────────────────

export type NetworkQuality = 'excellent' | 'good' | 'fair' | 'poor'

export interface Participant {
  id: string
  name: string
  initials: string
  color: string // tailwind-ish hex used for avatar background
  role: 'host' | 'co-host' | 'member' | 'guest'
  isMuted: boolean
  isVideoOn: boolean
  isHandRaised: boolean
  isSpeaking: boolean
  isScreenSharing?: boolean
  network: NetworkQuality
  isSelf?: boolean
}

export interface ChatMessage {
  id: string
  author: string
  initials: string
  color: string
  time: string
  text: string
  isSelf?: boolean
  isSystem?: boolean
  attachment?: { name: string; size: string; kind: 'doc' | 'image' | 'file' }
}

export interface Meeting {
  id: string
  title: string
  date: string // display string e.g. "Today"
  time: string // display string e.g. "10:00 – 10:45 AM"
  startsIn?: string // e.g. "in 25 min"
  durationMin: number
  participantCount: number
  avatars: { initials: string; color: string }[]
  status: 'live' | 'upcoming' | 'past'
  hasAISummary?: boolean
  hasRecording?: boolean
  isRecurring?: boolean
}

export interface AISummary {
  id: string
  meetingTitle: string
  date: string
  summary: string
  keyPoints: string[]
  actionItems: { text: string; owner: string; due: string; done: boolean }[]
  sentiment: 'positive' | 'neutral' | 'mixed'
}

export interface Notification {
  id: string
  kind: 'invite' | 'mention' | 'recording' | 'summary' | 'security' | 'task'
  title: string
  detail: string
  time: string
  unread: boolean
}

export interface TranscriptLine {
  id: string
  speaker: string
  color: string
  time: string
  text: string
  isAI?: boolean
}

export interface KanbanTask {
  id: string
  title: string
  owner: string
  ownerColor: string
  tag: string
  tagColor: string
  column: 'todo' | 'doing' | 'done'
  due?: string
}

export interface SharedFile {
  id: string
  name: string
  kind: 'doc' | 'sheet' | 'slides' | 'pdf' | 'image' | 'code' | 'zip'
  size: string
  modifiedBy: string
  modifiedAt: string
  version: number
  versions: { v: number; by: string; at: string; note: string }[]
}

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target: string
  ip: string
  location: string
  time: string
  severity: 'info' | 'warning' | 'critical'
}

export interface SessionDevice {
  id: string
  device: string
  os: string
  browser: string
  location: string
  lastActive: string
  isCurrent?: boolean
}

// ── Participants ────────────────────────────────────────────────────────────

export const currentUser = {
  name: 'Alex Chen',
  initials: 'AC',
  color: '#6366f1',
  email: 'alex@vcollab.io',
  plan: 'Pro',
  org: 'Nimbus Labs',
}

export const participants: Participant[] = [
  { id: 'self', name: 'You', initials: 'AC', color: '#6366f1', role: 'host', isMuted: false, isVideoOn: true, isHandRaised: false, isSpeaking: true, network: 'excellent', isSelf: true },
  { id: 'p1', name: 'Maya Rodriguez', initials: 'MR', color: '#ec4899', role: 'co-host', isMuted: false, isVideoOn: true, isHandRaised: false, isSpeaking: false, network: 'excellent' },
  { id: 'p2', name: 'James Park', initials: 'JP', color: '#14b8a6', role: 'member', isMuted: true, isVideoOn: true, isHandRaised: true, isSpeaking: false, network: 'good' },
  { id: 'p3', name: 'Sofia Novak', initials: 'SN', color: '#f59e0b', role: 'member', isMuted: false, isVideoOn: true, isHandRaised: false, isSpeaking: false, network: 'excellent', isScreenSharing: true },
  { id: 'p4', name: 'Liam O’Connor', initials: 'LO', color: '#8b5cf6', role: 'member', isMuted: true, isVideoOn: false, isHandRaised: false, isSpeaking: false, network: 'fair' },
  { id: 'p5', name: 'Aisha Bello', initials: 'AB', color: '#22d3ee', role: 'member', isMuted: false, isVideoOn: true, isHandRaised: false, isSpeaking: false, network: 'good' },
  { id: 'p6', name: 'Daniel Kim', initials: 'DK', color: '#f43f5e', role: 'member', isMuted: true, isVideoOn: true, isHandRaised: false, isSpeaking: false, network: 'poor' },
  { id: 'p7', name: 'Emma Fischer', initials: 'EF', color: '#84cc16', role: 'guest', isMuted: true, isVideoOn: false, isHandRaised: false, isSpeaking: false, network: 'good' },
]

// ── Meetings ────────────────────────────────────────────────────────────────

export const upcomingMeetings: Meeting[] = [
  {
    id: 'm1', title: 'Product Design Sync', date: 'Today', time: '10:00 – 10:45 AM', startsIn: 'in 18 min',
    durationMin: 45, participantCount: 8, status: 'upcoming', isRecurring: true,
    avatars: [{ initials: 'MR', color: '#ec4899' }, { initials: 'JP', color: '#14b8a6' }, { initials: 'SN', color: '#f59e0b' }],
  },
  {
    id: 'm2', title: 'Sprint Planning · Q3', date: 'Today', time: '1:30 – 2:30 PM', startsIn: 'in 3 h 48 min',
    durationMin: 60, participantCount: 12, status: 'upcoming', isRecurring: true,
    avatars: [{ initials: 'AB', color: '#22d3ee' }, { initials: 'DK', color: '#f43f5e' }, { initials: 'LO', color: '#8b5cf6' }],
  },
  {
    id: 'm3', title: 'Investor Update Call', date: 'Tomorrow', time: '9:00 – 9:30 AM',
    durationMin: 30, participantCount: 5, status: 'upcoming',
    avatars: [{ initials: 'EF', color: '#84cc16' }, { initials: 'MR', color: '#ec4899' }],
  },
  {
    id: 'm4', title: 'Design Systems Review', date: 'Fri, Jul 18', time: '3:00 – 4:00 PM',
    durationMin: 60, participantCount: 9, status: 'upcoming', isRecurring: true,
    avatars: [{ initials: 'JP', color: '#14b8a6' }, { initials: 'SN', color: '#f59e0b' }],
  },
]

export const recentMeetings: Meeting[] = [
  {
    id: 'r1', title: 'Growth Marketing Standup', date: 'Today', time: '9:00 – 9:15 AM',
    durationMin: 15, participantCount: 6, status: 'past', hasAISummary: true, hasRecording: true,
    avatars: [{ initials: 'AB', color: '#22d3ee' }, { initials: 'DK', color: '#f43f5e' }],
  },
  {
    id: 'r2', title: 'API Architecture Deep-Dive', date: 'Yesterday', time: '4:00 – 5:15 PM',
    durationMin: 75, participantCount: 10, status: 'past', hasAISummary: true, hasRecording: true,
    avatars: [{ initials: 'LO', color: '#8b5cf6' }, { initials: 'JP', color: '#14b8a6' }],
  },
  {
    id: 'r3', title: 'Customer Feedback Review', date: 'Yesterday', time: '11:00 – 11:45 AM',
    durationMin: 45, participantCount: 7, status: 'past', hasAISummary: true,
    avatars: [{ initials: 'MR', color: '#ec4899' }, { initials: 'EF', color: '#84cc16' }],
  },
  {
    id: 'r4', title: 'Weekly All-Hands', date: 'Mon, Jul 14', time: '2:00 – 3:00 PM',
    durationMin: 60, participantCount: 34, status: 'past', hasAISummary: true, hasRecording: true,
    avatars: [{ initials: 'SN', color: '#f59e0b' }, { initials: 'JP', color: '#14b8a6' }, { initials: 'DK', color: '#f43f5e' }],
  },
]

// ── Dashboard stats ─────────────────────────────────────────────────────────

export const weeklyUsage = [
  { day: 'Mon', hours: 4.5, meetings: 6 },
  { day: 'Tue', hours: 6.2, meetings: 8 },
  { day: 'Wed', hours: 3.8, meetings: 5 },
  { day: 'Thu', hours: 7.1, meetings: 9 },
  { day: 'Fri', hours: 5.4, meetings: 7 },
  { day: 'Sat', hours: 1.2, meetings: 2 },
  { day: 'Sun', hours: 0.5, meetings: 1 },
]

export const meetingHoursTrend = [
  { week: 'W24', hours: 22 }, { week: 'W25', hours: 26 }, { week: 'W26', hours: 24 },
  { week: 'W27', hours: 31 }, { week: 'W28', hours: 28.7 },
]

export const dashboardStats = {
  meetingHoursThisWeek: 28.7,
  meetingHoursDelta: '+12% vs last week',
  meetingsThisWeek: 38,
  aiSummariesReady: 12,
  pendingInvites: 3,
}

// ── AI ──────────────────────────────────────────────────────────────────────

export const aiSummaries: AISummary[] = [
  {
    id: 's1', meetingTitle: 'Growth Marketing Standup', date: 'Today · 9:00 AM',
    summary: 'The team reviewed week-2 experiment results. Paid social CTR improved 18% after the new creative batch; onboarding email drip underperformed and will be rewritten.',
    keyPoints: ['Paid social CTR up 18% WoW', 'Onboarding drip CTR at 0.9% — needs rewrite', 'Landing page A/B test reaches significance Friday'],
    actionItems: [
      { text: 'Rewrite onboarding email sequence', owner: 'Maya R.', due: 'Thu', done: false },
      { text: 'Ship new ad creative batch #4', owner: 'Daniel K.', due: 'Fri', done: true },
      { text: 'Prepare A/B readout for growth sync', owner: 'Aisha B.', due: 'Mon', done: false },
    ],
    sentiment: 'positive',
  },
  {
    id: 's2', meetingTitle: 'API Architecture Deep-Dive', date: 'Yesterday · 4:00 PM',
    summary: 'Decided to migrate the signaling layer to a regional mesh topology. Latency budget set at 80 ms p95. Media server autoscaling policy approved with a 2-week rollout.',
    keyPoints: ['Signaling layer → regional mesh', 'p95 latency budget: 80 ms', 'Autoscaling rollout in 2 weeks'],
    actionItems: [
      { text: 'Draft mesh topology RFC', owner: 'Liam O.', due: 'Jul 22', done: false },
      { text: 'Benchmark SFU vs mesh latency', owner: 'James P.', due: 'Jul 24', done: false },
    ],
    sentiment: 'neutral',
  },
  {
    id: 's3', meetingTitle: 'Weekly All-Hands', date: 'Mon · 2:00 PM',
    summary: 'Q2 numbers shared: ARR grew 22%, churn down to 2.1%. Company offsite confirmed for September. Hiring plan adds 6 engineers across platform and AI teams.',
    keyPoints: ['ARR +22% QoQ', 'Churn down to 2.1%', 'September offsite confirmed', '6 new eng hires approved'],
    actionItems: [
      { text: 'Publish Q2 board deck', owner: 'Alex C.', due: 'Jul 25', done: true },
      { text: 'Open eng requisitions', owner: 'Emma F.', due: 'Jul 21', done: false },
    ],
    sentiment: 'positive',
  },
]

export const transcriptSeed: TranscriptLine[] = [
  { id: 't1', speaker: 'Maya Rodriguez', color: '#ec4899', time: '10:02', text: 'The new onboarding flow dropped activation time from 14 minutes to 6. That is a huge win for self-serve.' },
  { id: 't2', speaker: 'James Park', color: '#14b8a6', time: '10:04', text: 'Agreed. Can we get the same treatment for the invite flow? It still has three redundant steps.' },
  { id: 't3', speaker: 'Sofia Novak', color: '#f59e0b', time: '10:06', text: 'I can pick that up. I will share a Figma prototype by Thursday and tag everyone for feedback.' },
  { id: 't4', speaker: 'AI Copilot', color: '#8b5cf6', time: '10:06', text: 'Action item captured: Sofia to share invite-flow prototype by Thursday.', isAI: true },
  { id: 't5', speaker: 'Aisha Bello', color: '#22d3ee', time: '10:08', text: 'While we are on flows — the billing page error rate spiked to 2.3% last night after the deploy.' },
]

export const aiChatSeed = [
  { id: 'a1', role: 'user' as const, text: 'What did we decide about the invite flow?' },
  { id: 'a2', role: 'ai' as const, text: 'At 10:06, Sofia volunteered to redesign the invite flow and remove the three redundant steps James flagged. She will share a Figma prototype by Thursday. Want me to create a task for it?' },
]

// ── Chat / notifications ────────────────────────────────────────────────────

export const chatSeed: ChatMessage[] = [
  { id: 'c1', author: 'Maya Rodriguez', initials: 'MR', color: '#ec4899', time: '10:01', text: 'Sharing the metrics deck in a sec 📊' },
  { id: 'c2', author: 'James Park', initials: 'JP', color: '#14b8a6', time: '10:02', text: 'Can someone drop the Figma link?' },
  { id: 'c3', author: 'Sofia Novak', initials: 'SN', color: '#f59e0b', time: '10:03', text: 'Here you go — v12 is the latest', attachment: { name: 'invite-flow-v12.fig', size: '4.2 MB', kind: 'doc' } },
  { id: 'c4', author: 'You', initials: 'AC', color: '#6366f1', time: '10:05', text: 'Got it, reviewing now 👍', isSelf: true },
  { id: 'c5', author: 'system', initials: '', color: '', time: '10:06', text: 'Daniel Kim’s connection is unstable', isSystem: true },
]

export const notifications: Notification[] = [
  { id: 'n1', kind: 'invite', title: 'Meeting invitation', detail: 'Maya invited you to “Design Systems Review”', time: '5 min ago', unread: true },
  { id: 'n2', kind: 'summary', title: 'AI summary ready', detail: 'Growth Marketing Standup recap is available', time: '22 min ago', unread: true },
  { id: 'n3', kind: 'mention', title: 'You were mentioned', detail: 'James mentioned you in Sprint Planning chat', time: '1 h ago', unread: true },
  { id: 'n4', kind: 'recording', title: 'Recording processed', detail: 'API Architecture Deep-Dive (1 h 15 min)', time: '3 h ago', unread: false },
  { id: 'n5', kind: 'security', title: 'New sign-in', detail: 'Chrome on Windows · Berlin, Germany', time: '8 h ago', unread: false },
  { id: 'n6', kind: 'task', title: 'Task assigned', detail: '“Draft mesh topology RFC” was assigned to Liam', time: '1 d ago', unread: false },
]

// ── Collaboration ───────────────────────────────────────────────────────────

export const kanbanTasks: KanbanTask[] = [
  { id: 'k1', title: 'Redesign invite flow prototype', owner: 'Sofia N.', ownerColor: '#f59e0b', tag: 'Design', tagColor: '#ec4899', column: 'doing', due: 'Thu' },
  { id: 'k2', title: 'Mesh topology RFC', owner: 'Liam O.', ownerColor: '#8b5cf6', tag: 'Platform', tagColor: '#6366f1', column: 'todo', due: 'Jul 22' },
  { id: 'k3', title: 'Rewrite onboarding drip', owner: 'Maya R.', ownerColor: '#ec4899', tag: 'Growth', tagColor: '#22d3ee', column: 'todo', due: 'Thu' },
  { id: 'k4', title: 'SFU vs mesh latency benchmark', owner: 'James P.', ownerColor: '#14b8a6', tag: 'Platform', tagColor: '#6366f1', column: 'doing', due: 'Jul 24' },
  { id: 'k5', title: 'Ship ad creative batch #4', owner: 'Daniel K.', ownerColor: '#f43f5e', tag: 'Growth', tagColor: '#22d3ee', column: 'done' },
  { id: 'k6', title: 'Q2 board deck', owner: 'Alex C.', ownerColor: '#6366f1', tag: 'Exec', tagColor: '#f59e0b', column: 'done' },
  { id: 'k7', title: 'Captions accuracy audit', owner: 'Aisha B.', ownerColor: '#22d3ee', tag: 'AI', tagColor: '#8b5cf6', column: 'todo', due: 'Jul 29' },
]

export const sharedFiles: SharedFile[] = [
  {
    id: 'f1', name: 'Q3 Product Roadmap', kind: 'doc', size: '1.2 MB', modifiedBy: 'Alex C.', modifiedAt: '12 min ago', version: 8,
    versions: [
      { v: 8, by: 'Alex C.', at: '12 min ago', note: 'Added AI roadmap section' },
      { v: 7, by: 'Maya R.', at: 'Yesterday', note: 'Updated timelines' },
      { v: 6, by: 'Alex C.', at: 'Mon', note: 'Q3 goals locked' },
    ],
  },
  {
    id: 'f2', name: 'invite-flow-v12.fig', kind: 'doc', size: '4.2 MB', modifiedBy: 'Sofia N.', modifiedAt: '47 min ago', version: 12,
    versions: [
      { v: 12, by: 'Sofia N.', at: '47 min ago', note: 'Removed redundant steps' },
      { v: 11, by: 'Sofia N.', at: 'Yesterday', note: 'New empty states' },
    ],
  },
  {
    id: 'f3', name: 'Metrics W28.dashboard', kind: 'sheet', size: '880 KB', modifiedBy: 'Aisha B.', modifiedAt: '2 h ago', version: 5,
    versions: [
      { v: 5, by: 'Aisha B.', at: '2 h ago', note: 'Added churn cohort' },
      { v: 4, by: 'Daniel K.', at: 'Tue', note: 'Paid social breakdown' },
    ],
  },
  {
    id: 'f4', name: 'All-Hands Deck Q2', kind: 'slides', size: '18 MB', modifiedBy: 'Alex C.', modifiedAt: 'Mon', version: 3,
    versions: [{ v: 3, by: 'Alex C.', at: 'Mon', note: 'Final' }],
  },
  {
    id: 'f5', name: 'signaling-mesh-spike.ts', kind: 'code', size: '24 KB', modifiedBy: 'James P.', modifiedAt: '3 h ago', version: 2,
    versions: [{ v: 2, by: 'James P.', at: '3 h ago', note: 'Region failover logic' }],
  },
  {
    id: 'f6', name: 'Brand Guidelines 2026', kind: 'pdf', size: '9.6 MB', modifiedBy: 'Emma F.', modifiedAt: 'Jul 10', version: 1,
    versions: [{ v: 1, by: 'Emma F.', at: 'Jul 10', note: 'Initial upload' }],
  },
]

export const sharedNotesSeed = `# Sprint Planning — shared notes

## Goals this sprint
- Ship invite-flow redesign (Sofia)
- Mesh signaling RFC approved (Liam)
- Onboarding drip rewrite (Maya)

## Decisions
1. Latency budget: **80 ms p95**
2. Autoscaling rollout: 2 weeks
3. Captions default ON for recorded meetings

## Open questions
- Do we keep the legacy SFU path for free tier?
- Who owns the captions accuracy audit?
`

// ── Security / enterprise ───────────────────────────────────────────────────

export const sessionDevices: SessionDevice[] = [
  { id: 'd1', device: 'MacBook Pro 16”', os: 'macOS 15.4', browser: 'Chrome 138', location: 'Berlin, DE', lastActive: 'Active now', isCurrent: true },
  { id: 'd2', device: 'iPhone 16 Pro', os: 'iOS 19', browser: 'VCollab App', location: 'Berlin, DE', lastActive: '2 h ago' },
  { id: 'd3', device: 'Windows Desktop', os: 'Windows 11', browser: 'Edge 138', location: 'Munich, DE', lastActive: 'Yesterday' },
  { id: 'd4', device: 'iPad Air', os: 'iPadOS 19', browser: 'Safari', location: 'Hamburg, DE', lastActive: 'Jul 9' },
]

export const auditLog: AuditLogEntry[] = [
  { id: 'al1', actor: 'alex@vcollab.io', action: 'meeting.lock', target: 'Product Design Sync', ip: '88.130.52.11', location: 'Berlin, DE', time: '10:14 AM', severity: 'info' },
  { id: 'al2', actor: 'maya@vcollab.io', action: 'user.role_change', target: 'james@vcollab.io → co-host', ip: '88.130.52.14', location: 'Berlin, DE', time: '9:58 AM', severity: 'warning' },
  { id: 'al3', actor: 'system', action: 'auth.login_failed (3x)', target: 'emma@vcollab.io', ip: '103.77.201.4', location: 'Singapore, SG', time: '8:41 AM', severity: 'critical' },
  { id: 'al4', actor: 'alex@vcollab.io', action: 'recording.download', target: 'API Deep-Dive.mp4', ip: '88.130.52.11', location: 'Berlin, DE', time: 'Yesterday', severity: 'info' },
  { id: 'al5', actor: 'liam@vcollab.io', action: 'file.share_external', target: 'mesh-spike.ts', ip: '88.130.60.2', location: 'Munich, DE', time: 'Yesterday', severity: 'warning' },
  { id: 'al6', actor: 'system', action: 'e2ee.enabled', target: 'All-hands room', ip: '—', location: '—', time: 'Mon', severity: 'info' },
]

export const adminAnalytics = {
  activeUsers: [
    { month: 'Feb', users: 184 }, { month: 'Mar', users: 221 }, { month: 'Apr', users: 267 },
    { month: 'May', users: 312 }, { month: 'Jun', users: 389 }, { month: 'Jul', users: 431 },
  ],
  minutesByTeam: [
    { team: 'Engineering', minutes: 12400 },
    { team: 'Design', minutes: 6300 },
    { team: 'Growth', minutes: 5800 },
    { team: 'Sales', minutes: 8600 },
    { team: 'Exec', minutes: 2100 },
  ],
  compliance: [
    { label: 'E2EE meetings', value: 68 },
    { label: 'Waiting room enforced', value: 94 },
    { label: 'Password protected', value: 81 },
    { label: 'Recordings encrypted', value: 100 },
  ],
}

export const teamChannels = [
  { id: 'ch1', name: 'engineering', members: 48, unread: 3, description: 'Platform, infra and releases' },
  { id: 'ch2', name: 'design', members: 16, unread: 0, description: 'Product & brand design' },
  { id: 'ch3', name: 'growth', members: 12, unread: 7, description: 'Marketing experiments' },
  { id: 'ch4', name: 'all-hands', members: 96, unread: 0, description: 'Company-wide updates' },
  { id: 'ch5', name: 'ai-research', members: 9, unread: 2, description: 'Transcription, summaries, NLU' },
]

export const orgWorkspaces = [
  { id: 'w1', name: 'Nimbus Labs HQ', members: 96, plan: 'Enterprise', primary: true },
  { id: 'w2', name: 'Nimbus Berlin', members: 41, plan: 'Business', primary: false },
  { id: 'w3', name: 'Client — Helios', members: 12, plan: 'Guest', primary: false },
]
