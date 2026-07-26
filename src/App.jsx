import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import GeneratePage from "./pages/GeneratePage";
import EditPage from "./pages/EditPage";

function App() {
  const [contents, setContents] = useState(() => {
    const saved = localStorage.getItem("contents");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("contents", JSON.stringify(contents));
  }, [contents]);

  function addContent(newItem) {
    setContents((prev) => [newItem, ...prev]);
  }
// 緑が AI で書き換えたもの。赤が旧コード。AI が良い感じに直してくれる。クルードとかだと、「指示ないですけど書き換えても良いですか？」と聞いてくれる。
  function updateContent(id, changes) {
    setContents((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)));
  }

  function deleteContent(id) {
    // 誤クリックでの消失を防ぐ確認（OKで削除／キャンセルで何もしない）
    if (!confirm("このコンテンツを削除しますか？")) return;
    setContents((prev) => prev.filter((c) => c.id !== id));
  }
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <h1>AI ショップ管理画面</h1>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={<DashboardPage contents={contents} onDelete={deleteContent} />}
        />
        <Route path="/generate" element={<GeneratePage onAdd={addContent} />} />
        <Route
          path="/edit/:id"
          element={<EditPage contents={contents} onUpdate={updateContent} />}
        />
      </Routes>
    </div>
  );
}

export default App;
