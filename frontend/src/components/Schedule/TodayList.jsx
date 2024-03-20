import React from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

export default function TodayList(props) {
  return (
    <div className="today-list">
      <FullCalendar
        locale={"ja"}
        headerToolbar={false}
        plugins={[listPlugin]}
        initialView="listDay" //初期表示設定
        listDayFormat={{ month: "numeric", day: "numeric", weekday: "narrow" }}
        noEventsContent={"予定がありません"}
        noEventsClassNames={"noEventInfo"}
        events={props.data}
        eventClick={props.handleEventSelect}
      />
    </div>
  );
}
