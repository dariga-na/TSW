import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ja } from "date-fns/locale/ja";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";



export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  
  const closeForm = () => {
    const calenderElement = document.querySelector(".body");
    const formElement = document.querySelector(".formContainer");

    calenderElement.classList.remove("hidden");
    formElement.classList.remove("visible");
  };
  
  const onSubmit = (data) => {
    if (start === null) {
      console.log("開始を入力してください");
    } else {
      data.start = `${format(start, "yyyy-MM-dd")} ${format(
        startTime,
        "HH:mm"
        )}`;
        data.end = `${format(end, "yyyy-MM-dd")} ${format(endTime, "HH:mm")}`;
        
        console.log(data);
        
        closeForm();
      }
    };

  return (
    <div className="formContainer">
      <div onClick={closeForm} className="close-btn">
        <CancelOutlinedIcon />
      </div>
      <h3>New Event</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="formArea">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <div className="dateArea">
            <DatePicker
              label="Start"
              value={start}
              onChange={(newDate) => setStart(newDate)}
              slotProps={{ textField: { size: "small" } }}
            />
            <FormControlLabel control={<Checkbox />} label="Allday" />
            <TimePicker
              label="Time"
              timeSteps={{ minutes: 10 }}
              value={startTime}
              onChange={(newTime) => setStartTime(newTime)}
              slotProps={{ textField: { size: "small" } }}
              className="timePicker"
            />
          </div>

          <div className="dateArea">
            <DatePicker
              label="End"
              value={end}
              onChange={(newDate) => setEnd(newDate)}
              slotProps={{ textField: { size: "small" } }}
            />
            <FormControlLabel control={<Checkbox />} label="Allday" />
            <TimePicker
              label="Time"
              timeSteps={{ minutes: 10 }}
              value={endTime}
              onChange={(newTime) => setEndTime(newTime)}
              slotProps={{ textField: { size: "small" } }}
              className="timePicker"
            />
          </div>
        </LocalizationProvider>
        <TextField
          label="Event"
          helperText={errors.title?.message}
          type="text"
          {...register("title", { required: "入力してください" })}
          className="textField"
        />
        <FormControl>
          <FormLabel>Color</FormLabel>
          <RadioGroup row defaultValue="white" name="radio-buttons-group">
            <FormControlLabel value="white" control={<Radio />} label="白" />
            <FormControlLabel value="red" control={<Radio />} label="赤" />
            <FormControlLabel value="blue" control={<Radio />} label="青" />
            <FormControlLabel value="yellow" control={<Radio />} label="黄" />
            <FormControlLabel value="green" control={<Radio />} label="緑" />
            <FormControlLabel value="purple" control={<Radio />} label="紫" />
          </RadioGroup>
        </FormControl>

        <button type="submit" className="submit-btn">
          登録
        </button>
      </form>
    </div>
  );
}
