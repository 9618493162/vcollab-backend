import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

// ── GlassCard ────────────────────────────────────────────────────────────────
export function GlassCard({
  className,
  children,
  hover = false,
}: {
  className?: string
  children: ReactNode
  hover?: boolean
}) {
  return (
    <div className={cn('glass rounded-2xl', hover && 'glass-hover cursor-pointer', className)}>
      {children}
    </div>
  )
}

// ── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// ── AvatarBubble ─────────────────────────────────────────────────────────────
export function AvatarBubble({
  initials,
  color,
  size = 'md',
  className,
}: {
  initials: string
  color: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-24 w-24 text-3xl',
  }
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white shrink-0 select-none',
        sizes[size],
        className,
      )}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
    >
      {initials}
    </div>
  )
}

export function AvatarStack({ avatars, max = 3 }: { avatars: { initials: string; color: string }[]; max?: number }) {
  const shown = avatars.slice(0, max)
  const extra = avatars.length - shown.length
  return (
    <div className="flex -space-x-2">
      {shown.map((a, i) => (
        <AvatarBubble key={i} initials={a.initials} color={a.color} size="xs" className="ring-2 ring-background" />
      ))}
      {extra > 0 && (
        <div className="h-6 w-6 rounded-full bg-white/10 ring-2 ring-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
          +{extra}
        </div>
      )}
    </div>
  )
}

// ── NetworkIndicator ─────────────────────────────────────────────────────────
export function NetworkIndicator({ quality, className }: { quality: 'excellent' | 'good' | 'fair' | 'poor'; className?: string }) {
  const bars = { excellent: 4, good: 3, fair: 2, poor: 1 }[quality]
  const color = { excellent: 'bg-emerald-400', good: 'bg-emerald-400', fair: 'bg-amber-400', poor: 'bg-rose-500' }[quality]
  return (
    <div className={cn('flex items-end gap-[2px] h-3.5', className)} title={`Network: ${quality}`}>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn('w-[3px] rounded-sm', i <= bars ? color : 'bg-white/15')}
          style={{ height: `${3 + i * 2.5}px` }}
        />
      ))}
    </div>
  )
}

// ── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string
  value: string | number
  delta?: string
  icon?: ReactNode
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold mt-1 tracking-tight">{value}</p>
          {delta && <p className="text-xs text-emerald-400 mt-1">{delta}</p>}
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

// ── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon: ReactNode
  title: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="h-14 w-14 rounded-2xl glass flex items-center justify-center text-muted-foreground mb-4">
        {icon}
      </div>
      <p className="font-medium">{title}</p>
      {hint && <p className="text-sm text-muted-foreground mt-1 max-w-xs">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ── Skeleton helpers ─────────────────────────────────────────────────────────
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <GlassCard className="p-5 space-y-3">
      <Skeleton className="h-4 w-1/3 bg-white/10" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 bg-white/5" style={{ width: `${85 - i * 15}%` }} />
      ))}
    </GlassCard>
  )
}
