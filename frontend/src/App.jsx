import "./App.css";
import Calender from "./Schedule/Calender.jsx";
import TodayList from "./Schedule/TodayList.jsx";
import Weather from "./Weather/Weather.jsx";
import WeatherForecastPage from "./Weather/WeatherForecastPage.jsx";
import TodoPage from "./Todo/TodoPage.jsx";
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
    const calenderElement = document.querySelector(".body");
    const formElement = document.querySelector(".formContainer");

    calenderElement.classList.add("hidden");
    formElement.classList.add("visible");
  };

  return (
    <div className="container">
      <div className="leftSide">
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
            <Route path="/weather_forecast" element={<WeatherForecastPage />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
      </div>
      <div className="rightSide">
        <div className="right-top">
          <div className="weather">
            <Weather />
          </div>
          <div className="icon">
            <button onClick={addEvent}>
              <EditCalendarOutlinedIcon />
            </button>
            <Link to="/">
              <button>
                <FormatListBulletedRoundedIcon />
              </button>
            </Link>
            <Link to="/weather_forecast">
              <button>
                <WbSunnyRoundedIcon />
              </button>
            </Link>
            <Link to="/setting">
              <button>
                <SettingsRoundedIcon />
              </button>
            </Link>
          </div>
        </div>
        <div className="calender">
          <Calender addEvent={addEvent} />
        </div>
      </div>
    </div>
  );
}

export default App;
