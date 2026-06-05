export default function RiskBadge({ level }) {
  const styles = {
    HIGH: 'badge-high-risk',
    MEDIUM: 'badge-medium-risk',
    LOW: 'badge-low-risk',
  }

  return <span className={styles[level] || styles.LOW}>{level}</span>
}
