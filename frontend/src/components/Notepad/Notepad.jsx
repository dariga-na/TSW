import React, { useEffect, useState } from "react";
import "./Notepad.css";
import axios from "axios";
const backendURL = "http://localhost:5001";

export default function Notepad() {
  const [memo, setMemo] = useState("");
  const [okMessage, setOkMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/notepads/all`);
        setMemo(response.data.find((data) => data.id === "note")?.text);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const noteSave = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${backendURL}/api/notepads/note`, {
        text: memo,
      });
      setOkMessage(true);
    } catch (error) {
      console.error("Error put Notepad:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setOkMessage(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [okMessage]);

  return (
    <form className="notepad-wrapper" onSubmit={noteSave}>
      <div className="save-container">
        {okMessage && <p className="visible">OK!</p>}
        <button type="submit" className="save-btn">
          保存
        </button>
      </div>
      <textarea value={memo} onChange={(e) => setMemo(e.target.value)} />
    </form>
  );
}
