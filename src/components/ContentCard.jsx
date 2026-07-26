import styles from "./ContentCard.module.css";

// ステータス → 色クラス（Day2 宿題①「色分け」の答え）
const statusClass = {
  "下書き": styles.draft,
  "完成": styles.done,
  "公開": styles.open,
};

function ContentCard({ name, body, status }) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.name}>{name}</h3>
        <span className={`${styles.status}${statusClass[status] || ""}`}>
          {status}
        </span>
      </div>
      <p className={styles.body}>{body}</p>
    </div>
  );
}

export default ContentCard;