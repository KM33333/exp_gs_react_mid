import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ContentCard from "../components/ContentCard";

function DashboardPage({ contents, onDelete, onToggleFavorite }) {
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");

  // 状態ごとの件数（Day2 宿題②「件数表示」の答え）
  const countBy = (s) => contents.filter((c) => c.status === s).length;

  const filteredContents = useMemo(() => {
    let result = [...contents];

    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.body.toLowerCase().includes(keyword),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (sortOrder === "oldest") {
      result = result.reverse();
    }

    return result;
  }, [contents, searchText, sortOrder, statusFilter]);

  return (
    <div>
      <h2>生成したコンテンツ（{contents.length}件）</h2>
      <p style={{ color: "#6b7280", fontSize: 13, margin: "4px 0 12px" }}>
        公開 {countBy("公開")} / 完成 {countBy("完成")} / 下書き{" "}
        {countBy("下書き")}
      </p>

      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}
      >
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="商品名や本文で検索"
          style={{
            flex: "1 1 220px",
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
          }}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
          }}
        >
          <option value="newest">新しい順</option>
          <option value="oldest">古い順</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
          }}
        >
          <option value="all">全て</option>
          <option value="公開">公開</option>
          <option value="完成">完成</option>
          <option value="下書き">下書き</option>
        </select>
      </div>

      {filteredContents.length === 0 ? (
        <p>条件に合う内容がありません。</p>
      ) : (
        filteredContents.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Link
              to={`/edit/${item.id}`}
              style={{ textDecoration: "none", color: "inherit", flex: 1 }}
            >
              <ContentCard
                name={item.name}
                body={item.body}
                status={item.status}
              />
            </Link>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #f59e0b",
                  borderRadius: 6,
                  background: item.favorite ? "#fef3c7" : "#fff",
                  color: item.favorite ? "#92400e" : "#f59e0b",
                  cursor: "pointer",
                }}
              >
                {item.favorite ? "★ お気に入り" : "☆ お気に入り"}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #ef4444",
                  borderRadius: 6,
                  background: "#fff",
                  color: "#ef4444",
                  cursor: "pointer",
                }}
              >
                削除
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardPage;
