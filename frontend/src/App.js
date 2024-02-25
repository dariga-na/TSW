import "./App.css";
import Calender from "./components/Calender.jsx";
import TodayList from "./components/TodayList.jsx";
import Todo from "./components/Todo";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

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
        <div className="weather">ここに天気を入れる</div>
        <Todo />
      </div>
      <div className="rightSide">
        <div className="setting">
          <form action="#"></form>
          <a onClick={addEvent}>
            <EditCalendarOutlinedIcon />
          </a>
          <a href="#">
            <DeleteIcon />
          </a>
          <a href="#">
            <SettingsRoundedIcon />
          </a>
        </div>

        <div className="calender">
          <Calender addEvent={addEvent} />
        </div>
      </div>
    </div>
  );
}

export default App;
