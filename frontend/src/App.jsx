import "./App.css";
import Calender from "./components/Schedule/Calender.jsx";
import TodayList from "./components/Schedule/TodayList.jsx";
import WeatherPage from "./components/Weather/WeatherPage.jsx";
import TodoPage from "./components/Todo/TodoPage.jsx";
import Setting from "./components/Setting.jsx";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import { Route, Routes, Link } from "react-router-dom";

function App() {
  const currentDate = new Date();
  const fmt = new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "2-digit",
    weekday: "short",
  });

  // イベント追加パネルを表示する
  const addEvent = () => {
    const calenderElement = document.querySelector(".calender-body");
    const formElement = document.querySelector(".eventForm-wrapper");

    calenderElement.classList.add("opacity-low");
    formElement.classList.add("visible");
  };

  return (
    <div className="main-wrapper">
      <div className="left-wrapper">
        <div className="left-top">
          <div className="today">
            <p>{currentDate.getFullYear() + "年"}</p>
            <h1>{fmt.format(currentDate)}</h1>
          </div>
          <TodayList />
        </div>
        <div className="link-page">
          <Routes>
            <Route path="/" element={<TodoPage />} />
            <Route path="/weather_forecast" element={<WeatherPage />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
      </div>
      <div className="right-wrapper">
        <div className="right-top">
          <button onClick={addEvent}>
            <EditCalendarOutlinedIcon />
          </button>
          <Link to="/">
            <FormatListBulletedRoundedIcon />
          </Link>
          <Link to="/weather_forecast">
            <WbSunnyRoundedIcon />
          </Link>
          <Link to="/setting">
            <SettingsRoundedIcon />
          </Link>
        </div>
        <Calender addEvent={addEvent} />
      </div>
    </div>
  );
}

export default App;
