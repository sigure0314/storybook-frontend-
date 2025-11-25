import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const Controller = () => {
  const [connection, setConnection] = useState(null);
  const [connected, setConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [storyData, setStoryData] = useState([]);

  const roomId = new URLSearchParams(window.location.search).get("room") || "default";

  useEffect(() => {
    // 載入故事 JSON
    fetch("/data/story1.json")
      .then((res) => res.json())
      .then(setStoryData)
      .catch((err) => console.error("❌ 載入故事失敗：", err));

    // 初始化 SignalR 連線
    const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`https://adminapi-vfos.onrender.com/storyhub?room=${roomId}`,{
      //.withUrl(`https://cold-bat-wxjw6j7v6vjfgqww-5000.app.github.dev/storyhub?room=${roomId}`, {
      //.withUrl(`https://localhost:5001/storyhub?room=${roomId}`, {
      //.withUrl(`http://192.168.68.68:5000/storyhub?room=test`, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("✅ SignalR 已連線");
        setConnected(true);
        setConnection(newConnection);
      })
      .catch((err) => {
        console.error("❌ SignalR 連線失敗：", err);
      });

    return () => {
      newConnection.stop();
    };
  }, [roomId]);

  const changePage = (newPage) => {
    if (newPage >= 0 && newPage < storyData.length) {
      setCurrentPage(newPage);
      connection?.invoke("ChangePage", roomId, newPage)
        .then(() => console.log("📤 已發送頁數變更：", newPage))
        .catch((err) => console.error("❌ 傳送失敗：", err));
    }
  };

  const story = storyData[currentPage] || {};

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>📖 控制端頁面</h2>
      <p>房間代碼：<code>{roomId}</code></p>
      <p>連線狀態：{connected ? "🟢 已連線" : "🔴 未連線"}</p>

      <hr />

      {story.image && (
        <img
          src={story.image}
          alt={`Page ${currentPage}`}
          style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 10 }}
        />
      )}

      <p><strong>備註：</strong> {story.note || "（無備註）"}</p>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 0}>
          ⬅️ 上一頁
        </button>
        <span style={{ margin: "0 10px" }}>第 {currentPage + 1} / {storyData.length} 頁</span>
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage >= storyData.length - 1}
        >
          下一頁 ➡️
        </button>
      </div>
    </div>
  );
};

export default Controller;
