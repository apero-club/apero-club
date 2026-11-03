import type { CSSProperties } from 'react';
import {
  ArrowLeft, ArrowRight, AudioLines, CalendarDays, ChevronRight, CircleCheck, Eye, BookOpen, Check, CircleHelp, Headphones, House, Lightbulb, Lock, MessagesSquare,
  Pause, PenLine, Play, RotateCcw, SkipBack, SkipForward, Sparkles, Star, Trophy, Turtle, Volume2, X,
  type LucideIcon,
} from 'lucide-react';

// Only the icons the app uses are bundled. Add new ones here.
const ICONS = {
  'arrow-left': ArrowLeft, 'arrow-right': ArrowRight, 'audio-lines': AudioLines, 'calendar-days': CalendarDays,
  'chevron-right': ChevronRight, 'circle-check': CircleCheck, eye: Eye, 'book-open': BookOpen, check: Check, 'circle-help': CircleHelp,
  headphones: Headphones, house: House, lightbulb: Lightbulb, lock: Lock, 'messages-square': MessagesSquare,
  pause: Pause, 'pen-line': PenLine, play: Play, 'rotate-ccw': RotateCcw, 'skip-back': SkipBack, 'skip-forward': SkipForward,
  sparkles: Sparkles, star: Star, trophy: Trophy, turtle: Turtle, 'volume-2': Volume2, x: X,
} satisfies Record<string, LucideIcon>;
export type IconName = keyof typeof ICONS;

/** Lucide icon by kebab-case name, 2.25 stroke by default (design system rule). */
export function Icon({ name, size = 24, strokeWidth = 2.25, color = 'currentColor', fill, style }: {
  name: IconName; size?: number; strokeWidth?: number; color?: string; fill?: string; style?: CSSProperties;
}) {
  const C = ICONS[name];
  return <C size={size} strokeWidth={strokeWidth} color={color} fill={fill ?? 'none'} aria-hidden="true" style={{ flexShrink: 0, display: 'block', ...style }} />;
}
