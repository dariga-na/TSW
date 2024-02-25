import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Form from "./Form.jsx";
import axios from "axios";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { addDays, format } from "date-fns";

export default function Calender(props) {

  // 全てのイベントを取得し、カレンダーに表示させる
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/allevents');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // 日付セルをクリックしてイベントを追加する
  const [selectedDates, setSelectedDates] = useState({
    selectStart: null,
    selectEnd: null,
  });

  const handleDateSelect = (info) => {
    const { start, end } = info;
    setSelectedDates({
      selectStart: start,
      selectEnd: end
    })
    props.addEvent();
  };

  // イベントをクリックして詳細表示する
  const infoElement = document.querySelector(".infoContainer");
  const handleEventSelect = (info) => {
    infoElement.classList.add("visible");
    const id = info.event.id;
    const eventInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/api/eventinfo?id=${id}`);
        document.querySelector(".visible").style = `background:${response.data[0].color};`
        document.querySelector(".test").innerHTML=
        `<h3>${response.data[0].title}</h3>
        <p>start: ${response.data[0].start}</p>
        <p>end: ${response.data[0].end}</p>`;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    eventInfo();
  }
  // イベント表示を閉じるボタン
  const closeInfo = () => {
    infoElement.classList.remove("visible");
  };


  return (
    <>
      <div className="body">
        <FullCalendar
          locale={"ja"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          //初期表示設定
          initialView="dayGridMonth"
          titleFormat={{
            year: "numeric",
            month: "2-digit",
          }}
          //上部ボタン
          headerToolbar={{
            left: "",
            center: "prev,title,next",
            right: "today,dayGridMonth,timeGridWeek",
          }}
          buttonText={{
            dayGridMonth: "月",
            timeGridWeek: "週",
          }}
          views={{
            dayGridMonth: {
              dayCellContent: function (arg) {
                return arg.date.getDate();
              },
            },
          }}
          fixedWeekCount={false}
          firstDay={1}
          slotDuration={"00:30:00"}
          scrollTime={"08:00:00"}
          allDayContent={""}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false
          }}
          eventDisplay={"block"}
          displayEventEnd={true}
          events={data}
          select={handleDateSelect}
          selectable={true}
          selectMirror={true}
          eventClick={handleEventSelect}
          eventMouseEnter={function (info) {
          }}
          eventMouseLeave={function (info) {
          }}
        />
      </div>
      <div className="infoContainer">
        <div onClick={closeInfo} className="close-btn">
          <CloseRoundedIcon />
        </div>
        <div className="test"></div>
      </div>
      <Form selectStart={selectedDates.selectStart} selectEnd={selectedDates.selectEnd} />
    </>
  );
}
