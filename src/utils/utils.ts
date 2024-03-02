export function formatDuration(duration?: number) {
  if (duration) {
    return new Date(duration * 1000).toISOString().substring(15, 19);
  }
}
