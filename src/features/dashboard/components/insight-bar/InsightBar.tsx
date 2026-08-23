import styles from "./InsightBar.module.css";

export default function InsightBar({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  const displayedValue = Math.round(value);
  const barWidth = Math.min(100, Math.max(0, displayedValue));

  return (
    <div className={styles.insightItem}>
      <div className={styles.insightHeader}>
        <div>
          <h3>{label}</h3>
          <p>{description}</p>
        </div>

        <strong>{displayedValue}%</strong>
      </div>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={barWidth}
      >
        <span style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}
