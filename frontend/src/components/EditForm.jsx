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
      document.querySelector(".startDatePicker p").textContent =
        "開始日は必須です";
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
    const calenderElement = document.querySelector(".body");
    const editElement = document.querySelector(".editContainer");

    calenderElement.classList.remove("hidden");
    editElement.classList.remove("visible");
    document.querySelector(".startDatePicker p").textContent = "";

    setTimeout(() => {
      resetFormState();
    }, 1000);
  };

  return (
    <div className="editContainer">
      <div className="close-btn" onClick={closeEdit}>
        <CloseRoundedIcon />
      </div>
      <h3>編集</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="formArea">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <div className="dateArea">
            <div className="startDatePicker">
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
          <FormLabel>Color</FormLabel>
          <RadioGroup
            row
            name="radio-buttons-group"
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
          保存
        </button>
      </form>
    </div>
  );
}
