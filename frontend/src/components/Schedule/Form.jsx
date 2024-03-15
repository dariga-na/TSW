import React, { useEffect, useMemo, useState } from "react";
import { ja } from "date-fns/locale/ja";
import { addDays, format, subDays } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axios from "axios";
const backendURL = "http://localhost:8001";

export default function Form(props) {
  // タイトルのエラー表示とデータ登録
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { title: "" },
  });

  // 日付を直接入力したときのエラー表示
  const [error, setError] = useState(null);
  const errorMessage = useMemo(() => {
    switch (error) {
      case "invalidDate": {
        return "有効な日付を入力してください";
      }
      default: {
        return "";
      }
    }
  }, [error]);

  // 日付定義
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [color, setColor] = useState("#fff");

  // カレンダー日付セルからイベント追加
  useEffect(() => {
    setStartDate(props.selectStart);
    setEndDate(subDays(props.selectEnd, 1));
  }, [props.selectStart, props.selectEnd]);

  // イベント追加ボタン(入力フォーム)からイベント追加
  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  // イベント登録ボタンで外部データ登録
  const onSubmit = async (data, event) => {
    data.id = format(new Date(), "yyyyMMddHHmmss");
    data.color = color;

    if (startDate === null) {
      document.querySelector(".startPicker p").textContent = "開始日は必須です";
    } else if (error) {
      event.preventDefault();
      return;
    } else {
      if (startTime) {
        data.start = `${format(startDate, "yyyy-MM-dd")} ${format(
          startTime,
          "HH:mm"
        )}`;
      } else {
        data.start = `${format(startDate, "yyyy-MM-dd")}`;
      }

      if (endDate.toString() === startDate.toString() && !endTime) {
        data.end = "";
      } else if (endTime) {
        data.end = `${format(endDate, "yyyy-MM-dd")} ${format(
          endTime,
          "HH:mm"
        )}`;
      } else {
        data.end = `${format(addDays(endDate, 1), "yyyy-MM-dd")}`;
      }

      try {
        await axios.post(`${backendURL}/api/addevent`, data);
        closeForm();
      } catch (error) {
        console.error("Error add data:", error);
      }
    }
  };

  // フォームを白紙に戻す
  const resetFormState = () => {
    setStartDate(null);
    setStartTime(null);
    setEndDate(null);
    setEndTime(null);
    setColor("#fff");
    setError(null);
    reset();
  };

  // イベント登録後、フォーム×クリックどちらも共通する動作
  const closeForm = () => {
    const calenderElement = document.querySelector(".calender-body");
    const formElement = document.querySelector(".eventForm-wrapper");

    calenderElement.classList.remove("opacity-low");
    formElement.classList.remove("visible");
    document.querySelector(".startPicker p").textContent = "";

    setTimeout(() => {
      resetFormState();
    }, 1000);
  };

  return (
    <div className="eventForm-wrapper">
      <div className="position-relative">
        <CloseRoundedIcon className="close-btn" onClick={closeForm} />
        <h3>New Event</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <div className="date-container">
            <div className="startPicker">
              <DatePicker
                label="Start"
                sx={{ width: 210 }}
                onChange={(newStartDate) => {
                  setStartDate(newStartDate);
                  setEndDate(newStartDate);
                }}
                value={startDate}
                onError={(newError) => setError(newError)}
                slotProps={{
                  textField: { size: "small", helperText: errorMessage },
                  field: { clearable: true },
                }}
              />
              <p></p>
            </div>
            <TimePicker
              sx={{ width: 140 }}
              timeSteps={{ minutes: 10 }}
              value={startTime}
              onChange={(newStartTime) => setStartTime(newStartTime)}
              slotProps={{
                textField: { size: "small" },
                field: { clearable: true },
              }}
              className="timePicker"
            />
          </div>
          <div className="date-container">
            <DatePicker
              label="End"
              sx={{ width: 210 }}
              value={endDate}
              onChange={(newEndDate) => {
                setEndDate(newEndDate);
              }}
              onError={(newError) => setError(newError)}
              slotProps={{
                textField: { size: "small", helperText: errorMessage },
                field: { clearable: true },
              }}
            />
            <TimePicker
              sx={{ width: 140 }}
              timeSteps={{ minutes: 10 }}
              value={endTime}
              onChange={(newEndTime) => setEndTime(newEndTime)}
              slotProps={{
                textField: { size: "small" },
                field: { clearable: true },
              }}
              className="timePicker"
            />
          </div>
        </LocalizationProvider>
        <TextField
          sx={{ width: 300 }}
          label="Event"
          type="text"
          name="title"
          // ↓枠が赤くなる
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register("title", { required: "内容を入力してください" })}
          className="textField"
        />
        <FormControl>
          <RadioGroup
            row
            name="radio-buttons-group"
            defaultValue="#fff"
            value={color}
            onChange={(newColor) => {
              setColor(newColor.target.value);
            }}
            className="radioGroup"
          >
            {/* 白 */}
            <FormControlLabel
              value="#fff"
              control={
                <Radio
                  sx={{
                    color: "#fff",
                    "&.Mui-checked": { color: "#fff" },
                  }}
                />
              }
            />
            {/* 赤 */}
            <FormControlLabel
              value="#ff8e8e"
              control={
                <Radio
                  sx={{
                    color: "#ff8e8e",
                    "&.Mui-checked": { color: "#ff8e8e" },
                  }}
                />
              }
            />
            {/* ピンク */}
            <FormControlLabel
              value="#ffbcff"
              control={
                <Radio
                  sx={{
                    color: "#ffbcff",
                    "&.Mui-checked": { color: "#ffbcff" },
                  }}
                />
              }
            />
            {/* 紫 */}
            <FormControlLabel
              value="#dbb7ff"
              control={
                <Radio
                  sx={{
                    color: "#dbb7ff",
                    "&.Mui-checked": { color: "#dbb7ff" },
                  }}
                />
              }
            />
            {/* 青 */}
            <FormControlLabel
              value="#93c9ff"
              control={
                <Radio
                  sx={{
                    color: "#93c9ff",
                    "&.Mui-checked": { color: "#93c9ff" },
                  }}
                />
              }
            />
            {/* 水色 */}
            <FormControlLabel
              value="#b2ffff"
              control={
                <Radio
                  sx={{
                    color: "#b2ffff",
                    "&.Mui-checked": { color: "#b2ffff" },
                  }}
                />
              }
            />
            {/* 緑 */}
            <FormControlLabel
              value="#89ff89"
              control={
                <Radio
                  sx={{
                    color: "#89ff89",
                    "&.Mui-checked": { color: "#89ff89" },
                  }}
                />
              }
            />
            {/* 黄緑 */}
            <FormControlLabel
              value="#d3ffa8"
              control={
                <Radio
                  sx={{
                    color: "#d3ffa8",
                    "&.Mui-checked": { color: "#d3ffa8" },
                  }}
                />
              }
            />
            {/* 黄 */}
            <FormControlLabel
              value="#ffffa8"
              control={
                <Radio
                  sx={{
                    color: "#ffffa8",
                    "&.Mui-checked": { color: "#ffffa8" },
                  }}
                />
              }
            />
            {/* オレンジ */}
            <FormControlLabel
              value="#ffc68e"
              control={
                <Radio
                  sx={{
                    color: "#ffc68e",
                    "&.Mui-checked": { color: "#ffc68e" },
                  }}
                />
              }
            />
          </RadioGroup>
        </FormControl>
        <button type="submit" className="submit-btn">
          登録
        </button>
      </form>
    </div>
  );
}
