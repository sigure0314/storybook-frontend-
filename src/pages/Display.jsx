import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const Display = () => {
  const [, setConnection] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [storyData, setStoryData] = useState([]);

  const roomId = new URLSearchParams(window.location.search).get("room") || "default";

  useEffect(() => {
    // 載入故事資料
    fetch("/data/story1.json")
      .then((res) => res.json())
      .then(setStoryData)
      .catch((err) => console.error("❌ 載入故事失敗：", err));

    // 建立 SignalR 連線
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://adminapi-vfos.onrender.com/storyhub?room=test`, {
      //.withUrl(`https://cold-bat-wxjw6j7v6vjfgqww-5000.app.github.dev/storyhub?room=test`, {
      //.withUrl(`https://localhost:5001/storyhub?room=test`, {
      //  .withUrl(`http://192.168.68.68:5000/storyhub?room=test`, {
        withCredentials: true // 要搭配 CORS 的 AllowCredentials
      })
      .withAutomaticReconnect()
      .build();
      

    newConnection
      .start()
      .then(() => {
        console.log("✅ 顯示端已連線");
        newConnection.on("PageChanged", (pageNumber) => {
          console.log("📥 接收到 PageChanged:", pageNumber);
          setCurrentPage(pageNumber);
        });
        setConnection(newConnection);
      })
      .catch((err) => {
        console.error("❌ SignalR 連線失敗：", err);
      });

    return () => {
      newConnection.stop();
    };
  }, [roomId]);

  const story = storyData[currentPage] || {};

  return (
    <div
      style={{
        backgroundColor: "#000",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {story.image ? (
        <img
          src={story.image}
          alt={`Page ${currentPage}`}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            borderRadius: 8,
            boxShadow: "0 0 40px rgba(255,255,255,0.3)",
          }}
        />
      ) : (
        <p style={{ color: "#fff" }}>載入中...</p>
      )}
    </div>
  );
};

export default Display;
