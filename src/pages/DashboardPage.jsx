import { Link } from "react-router-dom";
import ContentCard from "../components/ContentCard";

// function DashboardPage が関数、({ contents }) は引数。return 以降は、引数の表示方法
function DashboardPage({ contents }) {
  return (
    <div>
      <h2>生成したコンテンツ（{contents.length}件）</h2>
      <h3>公開{contents.filter(c => c.status === "公開").length}件 / 完成{contents.filter(c => c.status === "完成").length}件 / 下書き{contents.filter(c => c.status === "下書き").length}件</h3>
      {contents.length === 0 ? (
        <p>まだありません。「生成する」から作ってみましょう。</p>
      ) : (
        contents.map((item) => (
          <Link
            key={item.id}
            to={`/edit/${item.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
          <ContentCard

            name={item.name}
            body={item.body}
            status={item.status}
          />
          </Link>
        ))
      )}
    </div>
  );
}

export default DashboardPage;