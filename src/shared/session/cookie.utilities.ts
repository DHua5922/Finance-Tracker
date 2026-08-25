export default function convertTimeToMaxAge(
  timeStr: string,
): number | undefined {
  const match = timeStr.match(/^(\d+)([mhd])$/);
  if (!match) return undefined;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  return value * multipliers[unit];
}
