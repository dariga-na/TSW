import "./App.css";
import Calender from "./components/Schedule/Calender.jsx";
import WeatherPage from "./components/Weather/Weather.jsx";
import TodoPage from "./components/Todo/Todo.jsx";
import SettingPage from "./components/Setting/Setting.jsx";
import NotepadPage from "./components/Notepad/Notepad.jsx";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import SubjectRoundedIcon from "@mui/icons-material/SubjectRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const backendURL = "http://localhost:5001";

function App() {
  // ＝＝＝今日の日付表示＝＝＝
  const currentDate = new Date();
  const fmt = new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "2-digit",
    weekday: "short",
  });

  // ＝＝＝設定の外部データを取得＝＝＝
  const [gradientLeft, setGradientLeft] = useState("");
  const [gradientRight, setGradientRight] = useState("");
  const [mainTheme, setMainTheme] = useState("");
  const [selectFont, setSelectFont] = useState("");

  // テーマカラー
  const themes = {
    // 白
    white: {
      "--dark-color": "rgb(190, 190, 190)",
      "--dark-opacity-color": "rgba(190, 190, 190, 0.9)",
      "--medium-dark-opacity-color": "rgba(210, 210, 210, 0.8)",
      "--medium-light-color": "rgb(240, 240, 240)",
      "--medium-light-opacity-color": "rgba(240, 240, 240, 0.7)",
      "--light-color": "rgb(255, 255, 255)",
      "--light-opacity-color": "rgba(255, 255, 255, 0.6)",
      "--theme-font-color": "rgb(80, 80, 80)",
    },
    // グレー
    gray: {
      "--dark-color": "rgb(70, 70, 70)",
      "--dark-opacity-color": "rgba(70, 70, 70, 0.9)",
      "--medium-dark-opacity-color": "rgba(130, 130, 130, 0.9)",
      "--medium-light-color": "rgb(180, 180, 180)",
      "--medium-light-opacity-color": "rgba(180, 180, 180, 0.8)",
      "--light-color": "rgb(220, 220, 220)",
      "--light-opacity-color": "rgba(220, 220, 220, 0.8)",
      "--theme-font-color": "rgb(255, 255, 255)",
    },
    // 紫
    purple: {
      "--dark-color": "rgb(150, 70, 180)",
      "--dark-opacity-color": "rgba(150, 70, 180, 0.9)",
      "--medium-dark-opacity-color": "rgba(190, 100, 215, 0.9)",
      "--medium-light-color": "rgb(210, 140, 230)",
      "--medium-light-opacity-color": "rgba(210, 140, 230, 0.8)",
      "--light-color": "rgb(230, 200, 250)",
      "--light-opacity-color": "rgba(230, 200, 250, 0.8)",
      "--theme-font-color": "rgb(255, 255, 255)",
    },
    // ピンク
    pink: {
      "--dark-color": "rgb(220, 120, 220)",
      "--dark-opacity-color": "rgba(220, 120, 220, 0.9)",
      "--medium-dark-opacity-color": "rgba(220, 140, 220, 0.9)",
      "--medium-light-color": "rgb(230, 180, 230)",
      "--medium-light-opacity-color": "rgba(230, 180, 230, 0.8)",
      "--light-color": "rgb(255, 220, 255)",
      "--light-opacity-color": "rgba(255, 220, 255, 0.8)",
      "--theme-font-color": "rgb(80, 80, 80)",
    },
    // 青
    blue: {
      "--dark-color": "rgb(90, 140, 200)",
      "--dark-opacity-color": "rgba(90, 140, 200, 0.9)",
      "--medium-dark-opacity-color": "rgba(100, 160, 200, 0.9)",
      "--medium-light-color": "rgb(160, 200, 220)",
      "--medium-light-opacity-color": "rgba(160, 200, 220, 0.8)",
      "--light-color": "rgb(220, 240, 255)",
      "--light-opacity-color": "rgba(220, 240, 255, 0.8)",
      "--theme-font-color": "rgb(255, 255, 255)",
    },
    // 緑
    green: {
      "--dark-color": "rgb(100, 180, 100)",
      "--dark-opacity-color": "rgba(100, 180, 100, 0.9)",
      "--medium-dark-opacity-color": "rgba(120, 200, 120, 0.9)",
      "--medium-light-color": "rgb(170, 220, 170)",
      "--medium-light-opacity-color": "rgba(170, 220, 170, 0.8)",
      "--light-color": "rgb(220, 255, 220)",
      "--light-opacity-color": "rgba(220, 255, 220, 0.8)",
      "--theme-font-color": "rgb(80, 80, 80)",
    },
    // オレンジ
    orange: {
      "--dark-color": "rgb(220, 150, 90)",
      "--dark-opacity-color": "rgba(220, 150, 90, 0.9)",
      "--medium-dark-opacity-color": "rgba(225, 185, 130, 0.9)",
      "--medium-light-color": "rgb(230, 230, 170)",
      "--medium-light-opacity-color": "rgba(230, 230, 170, 0.8)",
      "--light-color": "rgb(255, 255, 220)",
      "--light-opacity-color": "rgba(255, 255, 220, 0.8)",
      "--theme-font-color": "rgb(80, 80, 80)",
    },
  };

  // 選択フォント色
  const fonts = {
    white: { "--select-font-color": "rgb(255, 255, 255)" },
    black: { "--select-font-color": "rgb(0, 0, 0)" },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/settings/all`);
        setGradientLeft(
          response.data.find((data) => data.id === "gradient_left")?.color
        );
        setGradientRight(
          response.data.find((data) => data.id === "gradient_right")?.color
        );
        setMainTheme(response.data.find((data) => data.id === "theme")?.color);
        setSelectFont(response.data.find((data) => data.id === "font")?.color);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // ＝＝＝設定変更を反映する＝＝＝
  useEffect(() => {
    const root = document.documentElement;
    if (gradientLeft) {
      root.style.setProperty("--gradient-left", gradientLeft);
    }
    if (gradientRight) {
      root.style.setProperty("--gradient-right", gradientRight);
    }
    if (mainTheme) {
      Object.entries(themes[mainTheme]).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
    if (selectFont) {
      Object.entries(fonts[selectFont]).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, [gradientLeft, gradientRight, mainTheme, selectFont]);

  // ＝＝＝イベント追加パネル＝＝＝
  const addEvent = () => {
    const calenderElement = document.querySelector(".calender-body");
    const formElement = document.querySelector(".eventForm-wrapper");

    calenderElement.classList.add("opacity-low");
    formElement.classList.add("visible");
  };

  const openCreatorPage = () => {
    window.open("https://example.com", "_blank");
  };

  const openTSWIntroductionPage = () => {
    window.open("https://example.com", "_blank");
  };

  return (
    <div className="app">
      <div className="main-wrapper">
        <div className="left-wrapper">
          <div className="left-top">
            <div className="today">
              <p>{currentDate.getFullYear() + "年"}</p>
              <h1>{fmt.format(currentDate)}</h1>
            </div>
          </div>
          <div className="link-page">
            <Routes>
              <Route path="/" element={<TodoPage />} />
              <Route path="/weather_forecast" element={<WeatherPage />} />
              <Route path="/notepad" element={<NotepadPage />} />
              <Route
                path="/setting"
                element={
                  <SettingPage
                    gradientLeft={gradientLeft}
                    gradientRight={gradientRight}
                    mainTheme={mainTheme}
                    selectFont={selectFont}
                  />
                }
              />
            </Routes>
          </div>
        </div>
        <div className="right-wrapper">
          <div className="right-top">
            <button onClick={addEvent}>
              <EditCalendarOutlinedIcon />
            </button>
            <Link to="/">
              <FormatListNumberedRoundedIcon />
            </Link>
            <Link to="/weather_forecast">
              <WbSunnyRoundedIcon />
            </Link>
            <Link to="/notepad">
              <SubjectRoundedIcon />
            </Link>
            <Link to="/setting">
              <SettingsRoundedIcon />
            </Link>
            <div className="openPage-container">
              <button onClick={openCreatorPage}>about Creator</button>
              <button onClick={openTSWIntroductionPage}>about TSW</button>
            </div>
          </div>
          <Calender addEvent={addEvent} />
        </div>
      </div>
    </div>
  );
}

export default App;
