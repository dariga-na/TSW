import React, { useState } from "react";
import "./Setting.css";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";
const backendURL = "http://localhost:5001";
const frontendURL = "http://localhost:3000";

export default function Setting(props) {
  const [gradientLeft, setGradientLeft] = useState(props.gradientLeft);
  const [gradientRight, setGradientRight] = useState(props.gradientRight);
  const [mainTheme, setMainTheme] = useState(props.mainTheme);
  const [selectFont, setSelectFont] = useState(props.selectFont);

  // ＝＝＝設定変更を保存＝＝＝
  const settingChange = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${backendURL}/api/settings/gradient_left`, {
        color: gradientLeft,
      });
    } catch (error) {
      console.error("Error put Font:", error);
    }
    try {
      await axios.put(`${backendURL}/api/settings/gradient_right`, {
        color: gradientRight,
      });
    } catch (error) {
      console.error("Error put Font:", error);
    }
    try {
      await axios.put(`${backendURL}/api/settings/theme`, { color: mainTheme });
    } catch (error) {
      console.error("Error put Theme:", error);
    }
    try {
      await axios.put(`${backendURL}/api/settings/font`, { color: selectFont });
    } catch (error) {
      console.error("Error put Font:", error);
    }
    window.location.href = `${frontendURL}`;
  };

  return (
    <form className="setting-wrapper" onSubmit={settingChange}>
      <div className="background-container">
        <h3>背景</h3>
        <div className="colorPicker-container">
          <div>
            <div className="input-container">
              <p>左上</p>
              <input
                type="color"
                value={gradientLeft}
                onChange={(e) => setGradientLeft(e.target.value)}
              />
            </div>
            <div className="input-container">
              <p>右下</p>
              <input
                type="color"
                value={gradientRight}
                onChange={(e) => setGradientRight(e.target.value)}
              />
            </div>
          </div>
          <div
            className="preview-box"
            style={{
              background: `linear-gradient(-20deg, ${gradientRight} 0%, ${gradientLeft} 100%)`,
            }}
          ></div>
        </div>
      </div>
      <div className="mainColor-container">
        <h3>テーマ</h3>
        <FormControl>
          <RadioGroup
            row
            name="themes-group"
            defaultValue={mainTheme}
            value={mainTheme}
            onChange={(e) => setMainTheme(e.target.value)}
            className="radioGroup"
          >
            {/* 白 */}
            <FormControlLabel
              value="white"
              control={
                <Radio
                  sx={{
                    color: "#fff",
                    "&.Mui-checked": { color: "#fff" },
                  }}
                />
              }
            />
            {/* グレー */}
            <FormControlLabel
              value="gray"
              control={
                <Radio
                  sx={{
                    color: "#000",
                    "&.Mui-checked": { color: "#000" },
                  }}
                />
              }
            />
            {/* ピンク */}
            <FormControlLabel
              value="pink"
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
              value="purple"
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
              value="blue"
              control={
                <Radio
                  sx={{
                    color: "#93c9ff",
                    "&.Mui-checked": { color: "#93c9ff" },
                  }}
                />
              }
            />
            {/* 緑 */}
            <FormControlLabel
              value="green"
              control={
                <Radio
                  sx={{
                    color: "#89ff89",
                    "&.Mui-checked": { color: "#89ff89" },
                  }}
                />
              }
            />
            {/* オレンジ */}
            <FormControlLabel
              value="orange"
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
      </div>
      <div className="fontColor-container">
        <h3>文字</h3>
        <FormControl>
          <RadioGroup
            row
            name="fonts-group"
            defaultValue={selectFont}
            value={selectFont}
            onChange={(e) => setSelectFont(e.target.value)}
            className="radioGroup"
          >
            {/* 白 */}
            <FormControlLabel
              value="white"
              control={
                <Radio
                  sx={{
                    color: "#fff",
                    "&.Mui-checked": { color: "#fff" },
                  }}
                />
              }
            />
            {/* 黒 */}
            <FormControlLabel
              value="black"
              control={
                <Radio
                  sx={{
                    color: "#000",
                    "&.Mui-checked": { color: "#000" },
                  }}
                />
              }
            />
          </RadioGroup>
        </FormControl>
      </div>
      <button type="submit" className="setting-btn">
        保存
      </button>
    </form>
  );
}
