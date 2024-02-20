import React from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

const TodayList = () => {

  return (
    <div className="today-list">
      <FullCalendar
        locale={"ja"}
        headerToolbar={false}
        plugins={[listPlugin]}
        initialView="listDay" //初期表示設定
        listDayFormat={{ month: 'numeric', day: 'numeric', weekday: 'narrow' }}
        noEventsContent={"予定がありません"}
        events={[
          {
            title: "ランチ",
            start: "2024-02-01 12:00",
            backgroundColor: "red",
          },
          { title: "ゴミ出し", start: "2024-02-20" },
          { title: "病院", start: "2024-02-02 14:30" },
          { title: "学校", start: "2024-02-14" },
          { title: "仕事", start: "2024-02-14 19:00" },
        ]} //イベント試し設定
        eventClick={function (info) {
          // info.jsEvent.preventDefault();
          alert(info.event.start + " : " + info.event.title);
        }}
      />
    </div>
  );
};

export default TodayList;
