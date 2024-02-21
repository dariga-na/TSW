import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Form from "./Form.jsx";
import axios from "axios";

export default function Calender(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8001/api/v1/events');
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

  const [selectedDates, setSelectedDates] = useState({
    selectStart: null,
    selectEnd: null,
  });

  const handleDateSelect = (info) => {
    const { start, end } = info;
    setSelectedDates({
      selectStart: start,
      selectEnd: end,
    });
    props.addEvent();
    // const calendarApi = info.view.calendar;
    // calendarApi.unselect(); // 選択した部分の選択を解除
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
        eventClick={function (info) {
          // info.jsEvent.preventDefault();
          alert(info.event.start + " : " + info.event.title); 
          
        }}
        eventMouseEnter={function (info) {
        }}
        eventMouseLeave={function (info) {
        }}
      />
    </div>
    <Form selectStart={selectedDates.selectStart} selectEnd={selectedDates.selectEnd} />
    </>
  );
}
