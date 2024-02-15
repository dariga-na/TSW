import "./App.css";
import Calender from "./components/Calender.jsx";
import Setting from "./components/Setting";
import TodayList from "./components/TodayList.jsx";
import Todo from "./components/Todo";
import Form from "./components/Form.jsx";

function App() {
  const currentDate = new Date();
  const fmt = new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "2-digit",
    weekday: "short",
  });

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
        <Setting />
        <div className="calender">
          <Calender />
          <Form />
        </div>
      </div>
    </div>
  );
}

export default App;
