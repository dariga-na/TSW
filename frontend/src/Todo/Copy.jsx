// バックエンドからサーバー持ってくるパターン
// D&Dは全くできていないのでコピー要注意

import { Button, Fab, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import EditIcon from "@mui/icons-material/Edit";
import Task from "./Task";
import axios from "axios";
const backendURL = "http://localhost:5001";

export default function DragDrop() {
  // 全てのタスクを取得する
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/all_tasks`);
        setTasks(response.data);
        console.log("fetchData response.data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // タスクが更新されたらコンソールに出力
  useEffect(() => {
    console.log("Tasks array updated:", tasks);
  }, [tasks]);

  // タスクを追加
  const addTask = async () => {
    const newTask = {
      id: new Date().getTime(),
      board: "L",
      text: text,
    };
    try {
      await axios.post(`${backendURL}/api/add_task`, newTask);
      const updatedTasks = await axios.get(`${backendURL}/api/all_tasks`);
      setTasks(updatedTasks.data);
      setText("");
    } catch (error) {
      console.error("Error add data:", error);
    }
  };

  // タスクを削除
  const deleteTask = () => {};

  // ボードにドロップできるようにする設定
  const [{ isOverL }, dropL] = useDrop(() => ({
    accept: "box",
    drop: (item) => changeBoard(item.id, "L"),
    collect: (monitor) => ({
      isOverL: !!monitor.isOver(),
    }),
  }));

  const [{ isOverR }, dropR] = useDrop(() => ({
    accept: "box",
    drop: (item) => changeBoard(item.id, "R"),
    collect: (monitor) => ({
      isOverR: !!monitor.isOver(),
    }),
  }));

  // ドロップしたタスクのデータを変更する
  const changeBoard = async (id) => {
    console.log(tasks);
    try {
      console.log("changing Board");
      const foundTask = tasks.find((task) => task.id === id);

      if (foundTask) {
        console.log(id);
        if (foundTask.board === "L") {
          await axios.put(`${backendURL}/api/put_task/${id}`, {
            ...foundTask,
            board: "R",
          });
        } else {
          await axios.put(`${backendURL}/api/put_task/${id}`, {
            ...foundTask,
            board: "L",
          });
        }

        const updatedTasks = await axios.get(`${backendURL}/api/all_tasks`);
        setTasks(updatedTasks.data);
      } else {
        console.log("item data is nothing");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <>
      <div className="task-board">
        <div className="task" ref={dropL}>
          <p>今週の課題</p>
          {tasks
            .filter((task) => task.board === "L")
            .map((filteredTask) => (
              <Task
                key={filteredTask.id}
                id={filteredTask.id}
                board={filteredTask.board}
                text={filteredTask.text}
              />
            ))}
        </div>
        <div className="task" ref={dropR}>
          <p>買うものリスト</p>
          {tasks
            .filter((task) => task.board === "R")
            .map((filteredTask) => (
              <Task
                key={filteredTask.id}
                id={filteredTask.id}
                board={filteredTask.board}
                text={filteredTask.text}
              />
            ))}
        </div>
      </div>
      <TextField
        id="standard-basic"
        label="new task"
        variant="standard"
        onChange={(newText) => {
          setText(newText.target.value);
        }}
        value={text}
      />
      <Fab size="small" color="secondary" aria-label="edit" onClick={addTask}>
        <EditIcon />
      </Fab>
      <Button className="btn" onClick={deleteTask}>
        タスクを削除
      </Button>
    </>
  );
}
