export default function convertTimeToMaxAge(
  timeStr: string,
): number | undefined {
  const match = timeStr.match(/^(\d+)([mhd])$/);
  if (!match) return undefined;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    m: 60, // 1 minute = 60 seconds
    h: 60 * 60, // 1 hour = 3,600 seconds
    d: 60 * 60 * 24, // 1 day = 86,400 seconds
  };

  return value * multipliers[unit];
}
