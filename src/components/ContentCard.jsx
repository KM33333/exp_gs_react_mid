import styles from "./ContentCard.module.css";

// className={styles.〇〇} は css の書き方で全てに適用。{〇〇}は特定の時だけ適用 

function ContentCard({ name, body, status }) {
  return (
    <div className={styles.card} data-status={status}>
      <div className={styles.head}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.status}>{status}</span>
      </div>
      <p className={styles.body}>{body}</p>
    </div>
  );
}

export default ContentCard;