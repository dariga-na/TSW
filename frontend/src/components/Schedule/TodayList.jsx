import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import axios from "axios";

export default function TodayList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8001/api/allevents");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEventMouseEnter = (mouseEnterInfo) => {
    // マウスがイベントに入ったときの処理をここに記述
    console.log("Mouse entered event:", mouseEnterInfo.event);
  };

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
        events={data}
        eventMouseEnter={handleEventMouseEnter}
      />
    </div>
  );
}
