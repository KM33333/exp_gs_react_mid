import { useState } from "react";
import ContentCard from "./components/ContentCard";

function App() {
  const [name, setName] = useState("");
  const [feature, setFeature] = useState("");
  const [tone, setTone] = useState("やさしい");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState([]); // 生成物のリスト

  async function handleGenerate() {
    setLoading(true);
    setResult("");

    // 入力から「お願い文」を組み立てる
    const prompt = `あなたはECサイトのコピーライターです。
次の商品の説明文を、${tone}トーンで、100文字程度で書いてください。
商品名:${name}
特徴:${feature}`;

    const key = import.meta.env.VITE_GROQ_API_KEY;
    console.log("KEYある?", !!key, "／ gsk_で始まる?", key?.startsWith("gsk_"));

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.choices[0].message.content;
    // 新しい生成物を1件つくる
    const newItem = {
      id: Date.now(),      // 重複しない id（ミリ秒の数）
      name: name,
      body: text,
      status: "下書き",
    };

    console.log("status:", res.status, "body:", data);

    if (!res.ok) {
      setResult(
        "エラー " + res.status + "：" + (data.error?.message || "不明"),
      );
      setLoading(false);
      return;
    }
    setResult(data.choices[0].message.content);
    // 既存リストの先頭に追加（元の配列は壊さず、新しい配列を作る）
    setContents([newItem, ...contents]);
    setLoading(false);
  }

  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h1>医薬品説明</h1>

      <label>商品名</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>部位（カンマ区切りでOK）</label>
      <input value={feature} onChange={(e) => setFeature(e.target.value)} />

      <label>トーン</label>
      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        <option value="医薬品">医薬品</option>
        <option value="医薬部外品">医薬部外品</option>
        <option value="健康食品">健康食品</option>
      </select>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "生成中…" : "生成する"}
      </button>

      {/* <p style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>{result}</p> */}
      {/* / ...（App の中、return の中）.../ */}

      <h2>生成したコンテンツ（{contents.length}件）</h2>
      {contents.length === 0 ? (
        <p>まだありません。上のフォームから生成してみましょう。</p>
      ) : (
        contents.map((item) => (
          <ContentCard
            key={item.id}
            name={item.name}
            body={item.body}
            status={item.status}
          />
        ))
      )}
    </div>
    
  );
}



export default App;