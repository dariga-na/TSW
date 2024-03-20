import "./Schedule.css";
import Form from "./Form.jsx";
import EditForm from "./EditForm.jsx";
import TodayList from "./TodayList.jsx";
import React, { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import axios from "axios";
const backendURL = "http://localhost:5001";

export default function Calender(props) {
  // 全てのイベントを取得し、カレンダーに表示させる
  const [data, setData] = useState([]);
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/allevents`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [data]);

  // カレンダー本体、隠れBOX
  const calenderElement = document.querySelector(".calender-body");
  const infoElement = document.querySelector(".eventInfo-container");
  const editElement = document.querySelector(".eventEdit-wrapper");
  const confirmDeleteElement = document.querySelector(
    ".confirmDelete-container"
  );

  // ①
  // イベントをクリックしてデータを取得、一時保存する
  const handleEventSelect = async (info) => {
    const id = info.event.id;

    try {
      const response = await axios.get(`${backendURL}/api/eventinfo/${id}`);
      setEventData(response.data[0]);
      calenderElement.classList.add("opacity-low");
      infoElement.classList.add("visible");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // イベントデータを詳細表示
  useEffect(() => {
    document.querySelector(".eventInfo-container").style.background =
      eventData.color;
    document.querySelector(".eventTitle").textContent = `${eventData.title}`;

    // 正規表現を使用してendデータ判別
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (datePattern.test(eventData.end)) {
      document.querySelector(".eventDate").innerHTML = `<p>${
        eventData.start
      }</p><p>${format(subDays(eventData.end, 1), "yyyy-MM-dd")}</p>`;
    } else {
      document.querySelector(
        ".eventDate"
      ).innerHTML = `<p>${eventData.start}</p><p>${eventData.end}</p>`;
    }
  }, [eventData]);

  // イベント表示を閉じるボタン
  const closeInfo = () => {
    infoElement.classList.remove("visible");
    calenderElement.classList.remove("opacity-low");
    if (confirmDeleteElement.classList.contains("visible")) {
      confirmDeleteElement.classList.remove("visible");
    }
  };

  // ②
  // イベント削除ボタン
  const confirmDelete = () => {
    confirmDeleteElement.classList.add("visible");
    confirmDeleteElement.style.background = eventData.color;
  };

  // 削除キャンセルボタン
  const deleteCancel = () => {
    confirmDeleteElement.classList.remove("visible");
  };

  // 削除OKボタン
  const deleteEvent = async () => {
    try {
      await axios.delete(`${backendURL}/api/eventinfo/${eventData.id}`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    confirmDeleteElement.classList.remove("visible");
    closeInfo();
  };

  // ③
  // 日付セルをクリックしてイベントを追加する
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
  };

  // ④
  // イベント編集ボタンでフォーム切り替え、現データを編集画面に共有する
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editStart, setEditStart] = useState(null);
  const [editEnd, setEditEnd] = useState(null);
  const confirmEdit = () => {
    infoElement.classList.remove("visible");
    editElement.classList.add("visible");

    const { id, title, color, start, end } = eventData;
    setEditId(id);
    setEditTitle(title);
    setEditColor(color);
    setEditStart(start);
    setEditEnd(end);
  };

  return (
    <>
      <div className="schedule-wrapper">
        <div className="calender-body">
          <FullCalendar
            locale={"ja"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "dayGridMonth,timeGridWeek,today",
              center: "title",
              end: "prev,next",
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
                titleFormat: { year: "numeric", month: "2-digit" },
              },
              timeGridWeek: {
                titleFormat: { year: "numeric" },
              },
            }}
            fixedWeekCount={false}
            firstDay={1}
            slotDuration={"00:30:00"}
            scrollTime={"08:00:00"}
            allDayContent={""}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: false,
            }}
            eventDisplay={"block"}
            displayEventEnd={true}
            events={data}
            select={handleDateSelect}
            selectable={true}
            selectMirror={true}
            eventClick={handleEventSelect}
          />
        </div>

        {/* ＝＝＝以下はユーザーアクションで表示される隠れBOX＝＝＝ */}

        {/* ①イベントクリックで表示される詳細BOX */}
        <div className="eventInfo-container">
          <div className="position-relative">
            <CloseRoundedIcon className="close-btn" onClick={closeInfo} />
            <h3 className="eventTitle"></h3>
          </div>
          <div className="eventDate"></div>
          <div className="eventInfo-btnContainer">
            <EditRoundedIcon onClick={confirmEdit} />
            <DeleteIcon onClick={confirmDelete} />
          </div>
        </div>

        {/* ②イベント詳細のごみ箱クリックで表示される確認BOX */}
        <div className="confirmDelete-container">
          <p>このイベントを削除しますか？</p>
          <div>
            <button onClick={deleteCancel}>キャンセル</button>
            <button onClick={deleteEvent}>OK</button>
          </div>
        </div>

        {/* ③イベント詳細の鉛筆クリックで表示される編集BOX */}
        <Form
          selectStart={selectedDates.selectStart}
          selectEnd={selectedDates.selectEnd}
        />

        {/* ④日付セル選択してイベント追加するフォーム */}
        <EditForm
          editId={editId}
          editTitle={editTitle}
          editColor={editColor}
          editStart={editStart}
          editEnd={editEnd}
        />
      </div>
      {/* 別表示のため.schedule-wrapperから外す */}
      <TodayList data={data} handleEventSelect={handleEventSelect} />
    </>
  );
}
