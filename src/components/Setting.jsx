import React from "react";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

const Setting = () => {
  const addEvent = () => {
    alert('Clicked!');
  }

  return (
    <div className="setting">
      <form action="#"></form>
      <a onClick={addEvent}><EditCalendarOutlinedIcon className={"calender-icon"} /></a>
      <a href="#"><DeleteIcon className={"delete-icon"} /></a>
      <a href="#"><SettingsRoundedIcon className={"setting-icon"}/></a>
    </div>
  );
};

export default Setting;
