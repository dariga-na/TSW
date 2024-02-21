import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import axios from "axios";

const TodayList = () => {
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


  return (
    <div className="today-list">
      <FullCalendar
        locale={"ja"}
        headerToolbar={false}
        plugins={[listPlugin]}
        initialView="listDay" //初期表示設定
        listDayFormat={{ month: 'numeric', day: 'numeric', weekday: 'narrow' }}
        noEventsContent={"予定がありません"}
        events={data} //イベント試し設定
        eventClick={function (info) {
          // info.jsEvent.preventDefault();
          alert(info.event.start + " : " + info.event.title);
        }}
      />
    </div>
  );
};

export default TodayList;
