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

export default function Form(props) {
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    if (props.selectStart) {
      setStartDate(props.selectStart);
    }
    if (props.selectEnd) {
      setEndDate(subDays(props.selectEnd, 1));
    }
  }, [props.selectStart, props.selectEnd]);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { title: "", color: "white" },
  });

  const onSubmit = (data) => {
    if (!startDate) {
      console.log("開始を入力してください");
    } else {
      if (startTime) {
        data.start = `${format(startDate, "yyyy-MM-dd")} ${format(
          startTime,
          "HH:mm"
        )}`;
      } else {
        data.start = `${format(startDate, "yyyy-MM-dd")}`;
      }
      
      if (endDate === startDate && !endTime) {
        data.end ="";
      } else if (endTime) {
        data.end = `${format(endDate, "yyyy-MM-dd")} ${format(
          endTime, "HH:mm")}`;
      } else  {
        data.end = `${format(addDays(endDate, 1), "yyyy-MM-dd")}`;
      }

      const addData = async () => {
        try {
          await axios.post("http://localhost:8001/api/v1/event", data);
        } catch (error) {
          console.error("Error add data:", error);
        }
      };

      addData();
      closeForm();
    }
  };

  const closeForm = () => {
    const calenderElement = document.querySelector(".body");
    const formElement = document.querySelector(".formContainer");

    calenderElement.classList.remove("hidden");
    formElement.classList.remove("visible");

    setStartDate(null);
    setStartTime(null);
    setEndDate(null);
    setEndTime(null);
    reset();
  };

  return (
    <div className="formContainer">
      <div onClick={closeForm} className="close-btn">
        <CloseRoundedIcon />
      </div>
      <h3>New Event</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="formArea">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <div className="dateArea">
            <DatePicker
              label="Start"
              sx={{ width: 200 }}
              value={startDate}
              onChange={(newStartDate) => {
                setStartDate(newStartDate);
                setEndDate(newStartDate);
              }}
              onError={(newError) => setError(newError)}
              slotProps={{
                textField: {
                  size: "small",
                  helperText: errorMessage,
                },
                field: { clearable: true },
              }}
              name="startDate"
            />
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
              sx={{ width: 200 }}
              value={endDate}
              onChange={(newEndDate) => setEndDate(newEndDate)}
              slotProps={{
                textField: { size: "small" },
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
          helperText={errors.title?.message}
          type="text"
          name="title"
          {...register("title", { required: "内容を入力してください" })}
          className="textField"
        />
        <FormControl>
          <FormLabel>Color</FormLabel>
          <RadioGroup row defaultValue="white" name="radio-buttons-group">
            <FormControlLabel
              {...register("color")}
              type="radio"
              value="white"
              control={<Radio />}
              label="白 "
            />
            <FormControlLabel
              {...register("color")}
              type="radio"
              value="#ffc68e"
              control={<Radio />}
              label="オレンジ"
            />
            <FormControlLabel
              {...register("color")}
              type="radio"
              value="#b2ffff"
              control={<Radio />}
              label="青"
            />
            <FormControlLabel
              {...register("color")}
              type="radio"
              value="#ffffa8"
              control={<Radio />}
              label="黄"
            />
            <FormControlLabel
              {...register("color")}
              type="radio"
              value="#c9ff93"
              control={<Radio />}
              label="緑"
            />
            <FormControlLabel
              {...register("color")}
              type="radio"
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
