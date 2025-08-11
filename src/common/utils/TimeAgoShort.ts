import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInYears
} from 'date-fns'

export function timeAgoShort(date: Date) {
  const now = new Date();

  const years = differenceInYears(now, date);
  if (years >= 1) return `${years}a`;

  const days = differenceInDays(now, date);
  if (days >= 1) return `${days}d`;

  const hours = differenceInHours(now, date);
  if (hours >= 1) return `${hours}h`;

  const mins = differenceInMinutes(now, date);
  return `${mins}m`;
}
