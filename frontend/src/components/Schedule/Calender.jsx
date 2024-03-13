import "./Schedule.css";
import Form from "./Form.jsx";
import EditForm from "./EditForm.jsx";
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
const backendURL = "http://localhost:8001";

export default function Calender(props) {
  // 全てのイベントを取得し、カレンダーに表示させる
  const [data, setData] = useState([]);

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
  const calenderElement = document.querySelector(".body");
  const infoElement = document.querySelector(".infoContainer");
  const editElement = document.querySelector(".editContainer");

  // ①
  // イベントをクリックして詳細表示する
  const handleEventSelect = async (info) => {
    calenderElement.classList.add("hidden");
    infoElement.classList.add("visible");
    const id = info.event.id;

    try {
      const response = await axios.get(`${backendURL}/api/eventinfo/${id}`);
      const eventData = response.data[0];

      document.querySelector(".infoContainer").style.background =
        eventData.color;

      document.querySelector(
        ".eventTitle h3"
      ).textContent = `${eventData.title}`;

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

      document
        .querySelector(".edit-btn")
        .addEventListener("click", () => confirmEdit(eventData));
      document
        .querySelector(".delete-btn")
        .addEventListener("click", () => confirmDelete(id, eventData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // イベント表示を閉じるボタン
  const closeInfo = () => {
    infoElement.classList.remove("visible");
    calenderElement.classList.remove("hidden");
  };

  // ②
  // イベント削除ボタン
  const confirmDelete = (id, eventData) => {
    document.querySelector(".confirm-delete").classList.add("visible");
    document.querySelector(".confirm-delete").style.background =
      eventData.color;
    document
      .querySelector(".cancel-btn")
      .addEventListener("click", () => deleteCancel());
    document
      .querySelector(".confirm-btn")
      .addEventListener("click", () => deleteEvent(id));
  };

  // 削除キャンセルボタン
  const deleteCancel = () => {
    document.querySelector(".confirm-delete").classList.remove("visible");
  };

  // 削除OKボタン
  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${backendURL}/api/eventinfo/${id}`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    document.querySelector(".confirm-delete").classList.remove("visible");
    closeInfo();
  };

  // ③
  // イベント編集ボタンでフォーム切り替え、現データを編集画面に共有する
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editStart, setEditStart] = useState(null);
  const [editEnd, setEditEnd] = useState(null);
  const confirmEdit = (eventData) => {
    infoElement.classList.remove("visible");
    editElement.classList.add("visible");

    const { id, title, color, start, end } = eventData;
    setEditId(id);
    setEditTitle(title);
    setEditColor(color);
    setEditStart(start);
    setEditEnd(end);
  };

  // ④
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
          eventMouseEnter={function (info) {}}
          eventMouseLeave={function (info) {}}
        />
      </div>

      {/* ＝＝＝＝以下はユーザーアクションで表示される隠れBOX＝＝＝＝ */}

      {/* ①イベントクリックで表示される詳細BOX */}
      <div className="infoContainer">
        <div onClick={closeInfo} className="close-btn">
          <CloseRoundedIcon />
        </div>
        <div className="eventTitle">
          <h3></h3>
        </div>
        <div className="info-contents">
          <div className="eventDate"></div>
          <div className="eventform-btn">
            <EditRoundedIcon className="edit-btn" />
            <DeleteIcon className="delete-btn" />
          </div>
        </div>
      </div>

      {/* ②イベント詳細のごみ箱クリックで表示される確認BOX */}
      <div className="confirm-delete">
        <p>このイベントを削除しますか？</p>
        <div>
          <button className="cancel-btn">キャンセル</button>
          <button className="confirm-btn">OK</button>
        </div>
      </div>

      {/* ③イベント詳細の鉛筆クリックで表示される編集BOX */}
      <EditForm
        editId={editId}
        editTitle={editTitle}
        editColor={editColor}
        editStart={editStart}
        editEnd={editEnd}
      />

      {/* ④日付セル選択してイベント追加するフォーム */}
      <Form
        selectStart={selectedDates.selectStart}
        selectEnd={selectedDates.selectEnd}
      />
    </>
  );
}
