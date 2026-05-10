export function formatViews(views: number | null | undefined): string {
  if (views == null) return '0';
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(views);
}

export function formatDuration(duration: string | null | undefined): string {
  if (!duration) return '';
  if (duration.includes(':')) return duration; // already formatted (YouTube)
  const secs = Math.round(parseFloat(duration));
  if (isNaN(secs)) return duration;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
