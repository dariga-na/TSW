import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ja } from "date-fns/locale/ja";
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
import { addDays, format, subDays } from "date-fns";
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
    const calenderElement = document.querySelector(".body");
    const formElement = document.querySelector(".formContainer");

    calenderElement.classList.remove("hidden");
    formElement.classList.remove("visible");
    document.querySelector(".startPicker p").textContent = "";

    setTimeout(() => {
      resetFormState();
    }, 1000);
  };

  return (
    <div className="formContainer">
      <div className="close-btn" onClick={closeForm}>
        <CloseRoundedIcon />
      </div>
      <h3>New Event</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="formArea">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <div className="dateArea">
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
              <p
                style={{
                  color: "rgb(211, 47, 47)",
                  fontSize: "12px",
                  fontWeight: "400",
                  paddingLeft: "0.9rem",
                }}
              ></p>
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
          <div className="dateArea">
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
              timeSteps={{ minutes: 10 }}
              value={endTime}
              onChange={(newEndTime) => setEndTime(newEndTime)}
              sx={{ width: 140 }}
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
          type="text"
          name="title"
          sx={{ width: 300 }}
          // ↓枠が赤くなる
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register("title", { required: "内容を入力してください" })}
          className="textField"
        />
        <FormControl>
          <FormLabel>Color</FormLabel>
          <RadioGroup
            row
            name="radio-buttons-group"
            defaultValue="#fff"
            value={color}
            onChange={(newColor) => {
              setColor(newColor.target.value);
            }}
          >
            <FormControlLabel value="#fff" control={<Radio />} label="白" />
            <FormControlLabel
              value="#ffc68e"
              control={<Radio />}
              label="オレンジ"
            />
            <FormControlLabel value="#b2ffff" control={<Radio />} label="青" />
            <FormControlLabel value="#ffffa8" control={<Radio />} label="黄" />
            <FormControlLabel value="#c9ff93" control={<Radio />} label="緑" />
            <FormControlLabel
              value="#ffbcff"
              control={<Radio />}
              label="ピンク"
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
