// ════════════════════════════════════════════════
// TIME UTILITIES
// ════════════════════════════════════════════════

// Convert "14:30" or "14:30:00" → "2:30 PM"
export function format12Hour(time24) {
  if (!time24) return ''
  const parts = String(time24).split(':')
  const hour = parseInt(parts[0])
  const minute = parts[1] || '00'
  if (isNaN(hour)) return time24
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return hour12 + ':' + minute + ' ' + period
}