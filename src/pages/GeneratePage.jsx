import { useState } from "react";

const facilityOptions = ["美術館", "博物館", "建築物"];

function GeneratePage({ onAdd }) {
  const [name, setName] = useState("");
  const [feature, setFeature] = useState("");
  const [region, setRegion] = useState("東京");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ← エラーメッセージ用

  async function handleGenerate() {
    // 入力チェック：施設名が選択されていない場合は生成しない
    if (!name.trim()) {
      setError("施設名を選択してください。");
      return;
    }

    setLoading(true);
    setError(""); // 前回のエラーを消す

    try {
      const prompt = `あなたは施設紹介のコピーライターです。
次の施設の紹介文を、${region}を対象地域として、100文字程度で書いてください。
施設名:${name}
日付:${feature}`;

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      // 200番台“以外”は失敗として扱う
      if (!res.ok) {
        throw new Error(`APIエラー（ステータス:${res.status}）`);
      }

      const data = await res.json();
      const text = data.choices[0].message.content;

      const newItem = {
        id: Date.now(),
        name: name,
        body: text,
        status: "下書き",
      };

      onAdd(newItem);
    } catch (e) {
      console.error(e); // 開発者向け：詳しい内容はコンソールへ
      setError("生成に失敗しました。少し時間をおいて、もう一度お試しください。");
    } finally {
      setLoading(false); // 成功でも失敗でも、必ずローディング解除
    }
  }

  return (
    <div>
      <h2>生成する</h2>

      <label>施設名</label>
      <select value={name} onChange={(e) => setName(e.target.value)}>
        <option value="">選択してください</option>
        {facilityOptions.map((facility) => (
          <option key={facility} value={facility}>
            {facility}
          </option>
        ))}
      </select>

      <label>日付</label>
      <input
        type="date"
        value={feature}
        onChange={(e) => setFeature(e.target.value)}
      />

      <label>地区</label>
      <select value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="東京">東京</option>
        <option value="神奈川">神奈川</option>
        <option value="関西">関西</option>
        <option value="その他">その他</option>
      </select>

      <button onClick={handleGenerate} disabled={loading || !name.trim()}>
        {loading ? "生成中…" : "生成する"}
      </button>

      {error && (
        <p style={{ color: "#dc2626", marginTop: 12 }}>⚠️ {error}</p>
      )}

      <p style={{ color: "#6b7280", marginTop: 12 }}>
        生成すると「ダッシュボード」に追加されます。
      </p>
    </div>
  );
}

export default GeneratePage;