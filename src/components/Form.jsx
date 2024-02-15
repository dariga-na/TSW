import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ja } from "date-fns/locale/ja";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { format } from "date-fns";

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const onSubmit = (data) => {
    if(start===null) {
      console.log("開始を入力してください");
    } else {
    data.start = format(start, 'yyyy-MM-dd HH:mm');
    data.end = format(end, 'yyyy-MM-dd HH:mm');
    console.log(data);
  }
  };

  return (
    <div className="form">
      <h3>スケジュール登録</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <div className="startRow">
            <DateTimePicker
            label="開始"
            value={start}
            onChange={(newDate) => setStart(newDate)}
             />
            <DateTimePicker
            label="終了"
            value={end}
            onChange={(newDate) => setEnd(newDate)}/>
          </div>
        </LocalizationProvider>
        <TextField
          label="内容"
          helperText={errors.title?.message}
          type="text"
          {...register("title", { required: "入力してください" })}
        />
        <button type="submit" className="submit-btn">
          登録
        </button>
      </form>
    </div>
  );
};

export default Form;
