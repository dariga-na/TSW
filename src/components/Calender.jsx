import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calender = () => {
  const handleDateSelect = (selectionInfo) => {
    console.log("selectionInfo: ", selectionInfo); // 選択した範囲の情報をconsoleに出力
    const calendarApi = selectionInfo.view.calendar;
    calendarApi.unselect(); // 選択した部分の選択を解除
  };

  return (
    <div className="body">
      <FullCalendar
        contentHeight={"auto"}
        locale={"ja"}
        plugins={[dayGridPlugin, interactionPlugin]}
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
          right: "today"
        }}
        buttonText={{
          dayGridMonth: "月"
        }}
        dayCellContent={function (arg) {
          return arg.date.getDate();
        }}
        fixedWeekCount={false}
        firstDay={1}
        //イベント試し設定
        events={[
          {
            title: "ランチ",
            start: "2024-02-01 12:00",
            backgroundColor: "red",
          },
          { title: "ゴミ出し", start: "2024-02-02" },
          { title: "ゴミ出し", start: "2024-02-02" },
          { title: "ゴミ出し", start: "2024-02-02" },
          { title: "病院", start: "2024-02-02 14:30" },
          { title: "学校", start: "2024-02-13" },
          { title: "仕事", start: "2024-02-13 19:00" },
          { title: "仕事", start: "2024-02-13 19:00" },
          { title: "仕事", start: "2024-02-13 19:00" },
        ]}
        select={handleDateSelect}
        selectable={true}
        selectMirror={true}
        eventClick={function (info) {
          // info.jsEvent.preventDefault();
          alert(info.event.start + " : " + info.event.title);
        }}
      />
    </div>
  );
};

export default Calender;
