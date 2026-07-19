import { useState } from "react";
import ContentCard from "./components/ContentCard";

function App() {
  const [name, setName] = useState("美術館");
  const [feature, setFeature] = useState("");
  const [tone, setTone] = useState("やさしい");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState([]); // 生成物のリスト

  async function handleGenerate() {
    setLoading(true);
    setResult("");

    // 入力から「お願い文」を組み立てる
//     const prompt = `あなたは美術館・博物館・建築が好きな人です。
// オススメの施設を、${tone}のエリアで教えてください。200文字程度でお願いします。
// 施設のタイプ:${name}
// 展示物:${feature}`;


    let prompt = "";
    if (name === "美術館") {
      prompt = `あなたは美術館が好きです。オススメの施設名と特徴を、${tone}のエリアで教えてください。200文字程度でお願いします。
      施設のタイプ:${name}
    展示物:${feature}`;
    } else if (name === "博物館") {
      prompt = `あなたは博物館が好きです。オススメの施設名と特徴を、${tone}のエリアで教えてください。200文字程度でお願いします。
      施設のタイプ:${name}
    展示物:${feature}`;
    } else if (name === "建築") {
      prompt = `あなたは建築が好きです。オススメの施設名と特徴を、${tone}のエリアで教えてください。200文字程度でお願いします。
      施設のタイプ:${name}
      展示物:${feature}`;
    }

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
      <h2>美術館・博物館案内</h2>

      <label>施設のタイプ</label>
      <select value={name} onChange={(e) => setName(e.target.value)}>
        <option value="美術館">美術館</option>
        <option value="博物館">博物館</option>
        <option value="建築">建築</option>
      </select>
      <div></div>
      {/* <label>商品名</label>
      <input value={name} onChange={(e) => setName(e.target.value)} /> */}
      <label>展示物</label>
      <input value={feature} onChange={(e) => setFeature(e.target.value)} />
      <div></div>

      <label>開催地</label>
      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        <option value="関東近郊">関東近郊</option>
        <option value="関西近郊">関西近郊</option>
        <option value="四国">四国</option>
        <option value="その他">その他</option>
      </select>
      <div></div>
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