// データ直書き
// ボード間をreact-dndで実装完了
// ボード内上下移動は未実装

import { Button, Fab, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import EditIcon from "@mui/icons-material/Edit";
import Task from "./Task";

export default function DragDrop() {
  const [text, setText] = useState("");
  const ItemTypes = {
    BOX: "box",
  };

  const [tasks, setTasks] = useState([
    {
      _id: "65ec2a559a9bf7911f10af0d",
      id: "1709976149140",
      board: "R",
      index: 1,
      text: "①",
      __v: 0,
    },
    {
      _id: "65ec2f889a9bf7911f10e6e1",
      id: "1709977480136",
      board: "R",
      index: 2,
      text: "②",
      __v: 0,
    },
    {
      _id: "65ec37fa9a9bf7911f1159ec",
      id: "1709979642597",
      board: "L",
      index: 1,
      text: "③",
      __v: 0,
    },
    {
      _id: "65ec37fa9a9bf7911f1169e2",
      id: "1709979642547",
      board: "R",
      index: 3,
      text: "④",
      __v: 0,
    },
    {
      _id: "65ec37fa9a9bf7911f1153e6",
      id: "1709979643597",
      board: "L",
      index: 2,
      text: "⑤",
      __v: 0,
    },
  ]);

  // タスクを削除
  const deleteTask = () => {};

  // ボードにドロップできるようにする設定
  const [{ isOverL }, dropL] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item) => changeBoard(item.id, "L"),
    collect: (monitor) => ({
      isOverL: !!monitor.isOver(),
    }),
  }));

  const [{ isOverR }, dropR] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item) => changeBoard(item.id, "R"),
    collect: (monitor) => ({
      isOverR: !!monitor.isOver(),
    }),
  }));

  // ドロップしたタスクのデータを変更する
  const changeBoard = useCallback((id, targetBoard) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, board: targetBoard } : task
      );
      return updatedTasks;
    });
  }, []);

  // タスクを同じボード内で順序変更
  const moveTask = {};

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  return (
    <>
      <div className="task-board">
        <div className="task" ref={dropL}>
          <p>今週の課題</p>
          {tasks
            .filter((task) => task.board === "L")
            .map((filteredTask, index) => (
              <Task
                key={filteredTask.id}
                id={filteredTask.id}
                board={filteredTask.board}
                index={index}
                text={filteredTask.text}
                changeBoard={changeBoard}
                moveTask={moveTask}
              />
            ))}
        </div>
        <div className="task" ref={dropR}>
          <p>買うものリスト</p>
          {tasks
            .filter((task) => task.board === "R")
            .map((filteredTask, index) => (
              <Task
                key={filteredTask.id}
                id={filteredTask.id}
                board={filteredTask.board}
                index={index}
                text={filteredTask.text}
                changeBoard={changeBoard}
                moveTask={moveTask}
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
      <Fab size="small" color="secondary" aria-label="edit">
        <EditIcon />
      </Fab>
      <Button className="btn" onClick={deleteTask}>
        タスクを削除
      </Button>
    </>
  );
}
