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
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axios from "axios";
const backendURL = "http://localhost:5001";

export default function EditForm(props) {
  // タイトルのエラー表示とデータ登録
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ title: props.editTitle });

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
  const [color, setColor] = useState("");

  // イベント詳細からデータ取得
  useEffect(() => {
    setValue("title", props.editTitle);
    setColor(props.editColor);
    setStartDate(props.editStart);

    // 正規表現を使用してendデータ判別
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (datePattern.test(props.editEnd)) {
      setEndDate(subDays(props.editEnd, 1));
    } else if (props.editEnd) {
      setEndDate(props.editEnd);
    } else {
      setEndDate(props.editStart);
    }
  }, [props.editId]);

  // 編集保存ボタンで外部データ上書き
  const onSubmit = async (data, event) => {
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
        await axios.put(`${backendURL}/api/eventinfo/${props.editId}`, data);
        closeEdit();
      } catch (error) {
        console.error("Error add data:", error);
      }
    }
  };

  // 編集途中でフォームを閉じてから再度開いたとき初期値に戻す
  const resetFormState = () => {
    setStartDate(props.editStart);
    setStartTime(null);

    // endデータ判別
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (datePattern.test(props.editEnd)) {
      setEndDate(subDays(props.editEnd, 1));
    } else if (props.editEnd) {
      setEndDate(props.editEnd);
    } else {
      setEndDate(props.editStart);
    }

    setEndTime(null);
    setColor(props.editColor);
    setError(null);
    reset({ title: props.editTitle });
  };

  // 編集保存後、フォーム×クリックどちらも共通する動作
  const closeEdit = () => {
    const calenderElement = document.querySelector(".calender-body");
    const editElement = document.querySelector(".eventEdit-wrapper");

    calenderElement.classList.remove("opacity-low");
    editElement.classList.remove("visible");
    document.querySelector(".startPicker p").textContent = "";

    setTimeout(() => {
      resetFormState();
    }, 1000);
  };

  return (
    <div className="eventEdit-wrapper">
      <div className="position-relative">
        <CloseRoundedIcon className="close-btn" onClick={closeEdit} />
        <h3>編集</h3>
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
          label="Event"
          InputLabelProps={{ shrink: true }}
          type="text"
          sx={{ width: 300 }}
          // ↓枠が赤くなる
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register("title", {
            required: "内容を入力してください",
          })}
          className="textField"
        />
        <FormControl>
          <RadioGroup
            row
            name="radio-buttons-group"
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
          保存
        </button>
      </form>
    </div>
  );
}
