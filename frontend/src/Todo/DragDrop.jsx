import { Button, Fab, TextField } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import EditIcon from "@mui/icons-material/Edit";
import { Task } from "./Task";
import axios from "axios";
const backendURL = "http://localhost:5001";

export const DragDrop = memo(function DragDrop() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const ItemTypes = {
    BOX: "box",
  };

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

  // タスク内D&D
  const findTask = useCallback(
    (id) => {
      const task = tasks.filter((t) => `${t.id}` === id)[0];
      return {
        task,
        index: tasks.indexOf(task),
      };
    },
    [tasks]
  );

  const moveTask = useCallback(
    async (id, atIndex) => {
      try {
        const { task, index } = findTask(id);
        const response = await axios.put(`${backendURL}/api/put_task/${id}`, {
          index: atIndex,
        });
        if (response.status === 200) {
          setTasks(
            update(tasks, {
              $splice: [
                [index, 1],
                [atIndex, 0, task],
              ],
            })
          );
        } else {
          console.error("Update request failed:", response);
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    [findTask, tasks, setTasks]
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.BOX }));

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
  const changeBoard = useCallback(async (id, targetBoard) => {
    try {
      const response = await axios.put(`${backendURL}/api/put_task/${id}`, {
        board: targetBoard,
      });
      if (response.status === 200) {
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) =>
            task.id === id ? { ...task, board: targetBoard } : task
          );
          return updatedTasks;
        });
      } else {
        console.error("Update request failed:", response);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }, []);

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  return (
    <>
      <div className="task-board">
        <div className="task" ref={dropL}>
          <p>今週の課題</p>
          <div className="task-area" ref={drop}>
            {tasks
              .filter((task) => task.board === "L")
              .map((filteredTask) => (
                <Task
                  key={filteredTask.id}
                  id={`${filteredTask.id}`}
                  board={filteredTask.board}
                  text={filteredTask.text}
                  changeBoard={changeBoard}
                  moveTask={moveTask}
                  findTask={findTask}
                />
              ))}
          </div>
        </div>
        <div className="task" ref={dropR}>
          <p>買うものリスト</p>
          <div className="task-area" ref={drop}>
            {tasks
              .filter((task) => task.board === "R")
              .map((filteredTask) => (
                <Task
                  key={filteredTask.id}
                  id={`${filteredTask.id}`}
                  board={filteredTask.board}
                  text={filteredTask.text}
                  changeBoard={changeBoard}
                  moveTask={moveTask}
                  findTask={findTask}
                />
              ))}
          </div>
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
});
