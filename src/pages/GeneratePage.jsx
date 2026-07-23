import { useState } from "react";
import ContentCard from "../components/ContentCard";

function GeneratePage({ onAdd }) {
  const [name, setName] = useState("美術館");
  const [feature, setFeature] = useState("");
  const [tone, setTone] = useState("やさしい");
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState([]); // ← いまは「このページだけ」のメモ

  async function handleGenerate() {
    setLoading(true);
    // const prompt = `あなたは美術館に行きたい人です。施設のタイプ${tone}と訪問予定日${name}と地区${feature}から、オススメの施設名を案内してください。また、訪問予定日${name}に特別展があれば教えてください。訪問予定日${name}に特別展がない場所を紹介することは問題はありません。ただし、地区${feature}内で開催していることを前提にしてください。3箇所の施設名と特徴を教えてください。各施設200文字程度でお願いします。`;

    let prompt = "";
    if (name === "美術館") {
      prompt = `あなたは美術館に行きたい人です。施設のタイプ${tone}と訪問予定日${name}と地区${feature}から、オススメの施設名を案内してください。また、訪問予定日${name}に特別展があれば教えてください。訪問予定日${name}に特別展がない場所を紹介することは問題はありません。ただし、地区${feature}内で開催していることを前提にしてください。3箇所の施設名と特徴を教えてください。各施設200文字程度でお願いします。`;
    } else if (name === "博物館") {
      prompt = `あなたは博物館に行きたい人です。施設のタイプ${tone}と訪問予定日${name}と地区${feature}から、オススメの施設名を案内してください。また、訪問予定日${name}に特別展があれば教えてください。訪問予定日${name}に特別展がない場所を紹介することは問題はありません。ただし、地区${feature}内で開催していることを前提にしてください。3箇所の施設名と特徴を教えてください。各施設200文字程度でお願いします。`;
    } else if (name === "建築") {
      prompt = `あなたは建築に行きたい人です。施設のタイプ${tone}と訪問予定日${name}と地区${feature}から、オススメの施設名を案内してください。また、訪問予定日${name}に特別展があれば教えてください。訪問予定日${name}に特別展がない場所を紹介することは問題はありません。ただし、地区${feature}内で開催していることを前提にしてください。3箇所の施設名と特徴を教えてください。各施設200文字程度でお願いします。`;
    }


    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      // 生成に失敗（キー違い・レート制限など）。落とさず知らせて止める
      alert("生成に失敗しました。\n" + (data.error?.message || ("エラー " + res.status)));
      setLoading(false);
      return;
    }
    const text = data.choices[0].message.content;

    const newItem = {
      id: Date.now(),
      name: name,
      body: text,
      status: "下書き",
    };
    onAdd(newItem);
    // setContents([newItem, ...contents]);
   
    setLoading(false);
  }

  return (
    <div>
      <h2>生成する</h2>

      {/* <label>商品名</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: Tシャツ" />

      <label>特徴（カンマ区切りでOK）</label>
      <input value={feature} onChange={(e) => setFeature(e.target.value)} placeholder="例: 夏用・軽い・白" />

      <label>トーン</label>
      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        <option value="やさしい">やさしい</option>
        <option value="かっこいい">かっこいい</option>
        <option value="ていねい">ていねい</option>
      </select> */}

      <label>施設のタイプ　</label>
      <select value={name} onChange={(e) => setName(e.target.value)}  style={{ height: "30px", margin: "6px" }}>
        <option value="美術館">美術館</option>
        <option value="博物館">博物館</option>
        <option value="建築">建築</option>
      </select>
      <div></div>

      {/* <label>施設のタイプ</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 美術館・博物館" /> */}

      <label>訪問予定日　</label>
      <input type="date"value={feature} onChange={(e) => setFeature(e.target.value)}  style={{ height: "30px", margin: "6px" }} />
      <div></div>

      <label>地区　</label>
      <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ height: "30px", margin: "6px" }}>
        <option value="東京">東京</option>
        <option value="神奈川">神奈川</option>
        <option value="関西">関西</option>
        <option value="東北">東北</option>
        <option value="四国">四国</option>
        <option value="その他">その他</option>
      </select>
      <div></div>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "生成中…" : "生成する"}
      </button>
      <p style={{ color: "#6b7280", marginTop: 12 }}>
        生成すると「ダッシュボード」に追加されます。
      </p>

    </div>
  );
}

export default GeneratePage;