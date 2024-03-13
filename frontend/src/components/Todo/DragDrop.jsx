import React, { memo, useCallback, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import { Task } from "./Task";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SwitchAccessShortcutAddRoundedIcon from "@mui/icons-material/SwitchAccessShortcutAddRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import axios from "axios";
import { DeleteBox } from "./DeleteBox";
const backendURL = "http://localhost:5001";

export const DragDrop = memo(function DragDrop() {
  const [tasks, setTasks] = useState([]);
  const [newText, setNewText] = useState("");
  const [leftLabel, setLeftLabel] = useState("");
  const [rightLabel, setRightLabel] = useState("");
  const ItemTypes = { TASK: "task" };

  // ＝＝＝外部データ取得＝＝＝
  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskRes = await axios.get(`${backendURL}/api/tasks/all`);
        setTasks(taskRes.data);
        const labelRes = await axios.get(`${backendURL}/api/labels/all`);
        setLeftLabel(labelRes.data.find((item) => item.id === "left")?.text);
        setRightLabel(labelRes.data.find((item) => item.id === "right")?.text);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // ＝＝＝フォームの開閉操作＝＝＝
  const [LLformOpen, setLLformOpen] = useState(false);
  const [LRformOpen, setLRformOpen] = useState(false);
  const [TLformOpen, setTLformOpen] = useState(false);
  const [TRformOpen, setTRformOpen] = useState(false);
  const LLclassName = LLformOpen ? "visible" : "";
  const LRclassName = LRformOpen ? "visible" : "";
  const TLclassName = TLformOpen ? "visible" : "";
  const TRclassName = TRformOpen ? "visible" : "";

  // フォームを開いたら他のフォームを閉じる、編集途中の場合クリアする
  const handleFormOpen = (formName) => {
    setLLformOpen(formName === "LL" ? true : false);
    setLRformOpen(formName === "LR" ? true : false);
    setTLformOpen(formName === "TL" ? true : false);
    setTRformOpen(formName === "TR" ? true : false);
    if (formName === "LL") {
      setNewText(leftLabel);
    }
    if (formName === "LR") {
      setNewText(rightLabel);
    }
  };

  // タスクエリアをクリックするとフォームが閉じる、編集途中の場合クリアする
  const closeForm = () => {
    setLLformOpen(false);
    setLRformOpen(false);
    setTLformOpen(false);
    setTRformOpen(false);
    setNewText("");
  };

  // ＝＝＝ラベルタイトルを編集＝＝＝
  const editLabelL = async () => {
    setLeftLabel(newText);
    try {
      await axios.put(`${backendURL}/api/labels/left`, { text: newText });
    } catch (error) {
      console.error("Error add data:", error);
    }
    closeForm();
  };

  const editLabelR = async () => {
    setRightLabel(newText);
    try {
      await axios.put(`${backendURL}/api/labels/right`, {
        text: newText,
      });
    } catch (error) {
      console.error("Error add data:", error);
    }
    closeForm();
  };

  // ＝＝＝新しいタスクをデータベースに追加＝＝＝
  const addTaskL = async () => {
    const newTask = {
      id: new Date().getTime(),
      board: "L",
      text: newText,
    };
    try {
      await axios.post(`${backendURL}/api/tasks/add`, newTask);
      const updatedTasks = await axios.get(`${backendURL}/api/tasks/all`);
      setTasks(updatedTasks.data);
      setNewText("");
    } catch (error) {
      console.error("Error add data:", error);
    }
    closeForm();
  };

  const addTaskR = async () => {
    const newTask = {
      id: new Date().getTime(),
      board: "R",
      text: newText,
    };
    try {
      await axios.post(`${backendURL}/api/tasks/add`, newTask);
      const updatedTasks = await axios.get(`${backendURL}/api/tasks/all`);
      setTasks(updatedTasks.data);
      setNewText("");
    } catch (error) {
      console.error("Error add data:", error);
    }
    closeForm();
  };

  // ＝＝＝タスクを削除 子コンポーネント(DeleteBox.jsx)に渡す＝＝＝
  const deleteTask = useCallback(async (id) => {
    try {
      await axios.delete(`${backendURL}/api/tasks/${id}`);
      const updatedTasks = await axios.get(`${backendURL}/api/tasks/all`);
      setTasks(updatedTasks.data);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }, []);

  // ＝＝＝タスクの上下移動(Task.jsx内で設定)を更新保存する＝＝＝
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
        const response = await axios.put(`${backendURL}/api/tasks/${id}`, {
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

  // ＝＝＝タスクをボード間で左右移動＝＝＝
  // ボードエリアにタスクをドロップできるようにする
  const [{ canDropL, isOverL }, dropL] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item) => changeBoard(item.id, "L"),
    collect: (monitor) => ({
      isOverL: monitor.isOver(),
      canDropL: monitor.canDrop(),
    }),
  }));

  const [{ canDropR, isOverR }, dropR] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item) => changeBoard(item.id, "R"),
    collect: (monitor) => ({
      isOverR: monitor.isOver(),
      canDropR: monitor.canDrop(),
    }),
  }));

  const isActiveL = canDropL && isOverL;
  const isActiveR = canDropR && isOverR;
  const boardStyleL = {
    backgroundColor: isActiveL ? "rgba(255, 255, 255, 0.1)" : "",
    borderRadius: isActiveL ? "1rem" : "",
  };
  const boardStyleR = {
    backgroundColor: isActiveR ? "rgba(255, 255, 255, 0.1)" : "",
    borderRadius: isActiveR ? "1rem" : "",
  };

  // タスクの配置ボードを更新保存する
  const changeBoard = useCallback(async (id, targetBoard) => {
    try {
      const response = await axios.put(`${backendURL}/api/tasks/${id}`, {
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

  return (
    <div className="todo-wrapper">
      <div className="left-board">
        <div className="droppable-area" ref={dropL} style={boardStyleL}>
          <div className="label-area">
            <p>{leftLabel}</p>
            <div className={`label-form ${LLclassName}`}>
              <input
                onChange={(event) => {
                  setNewText(event.target.value);
                }}
                value={newText}
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editLabelL();
                  }
                }}
              />
              <button onClick={editLabelL}>
                <AutorenewRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
          </div>
          <div className="task-area" onClick={closeForm}>
            <div className="task-container">
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
        </div>
        <div className="edit-area">
          <div className="todoBtn-container">
            <button
              onClick={() => {
                handleFormOpen("LL");
              }}
            >
              <BookmarkBorderRoundedIcon />
            </button>
            <button
              onClick={() => {
                handleFormOpen("TL");
              }}
            >
              <AddRoundedIcon />
            </button>
            <div style={{ overflow: "hidden", clear: "both" }}>
              <DeleteBox deleteTask={deleteTask} />
            </div>
          </div>
          <div className={`task-form ${TLclassName}`}>
            <input
              onChange={(event) => {
                setNewText(event.target.value);
              }}
              value={newText}
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTaskL();
                }
              }}
            />
            <button onClick={addTaskL}>
              <SwitchAccessShortcutAddRoundedIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="right-board">
        <div className="droppable-area" ref={dropR} style={boardStyleR}>
          <div className="label-area">
            <p>{rightLabel}</p>
            <div className={`label-form ${LRclassName}`}>
              <input
                onChange={(newText) => {
                  setNewText(newText.target.value);
                }}
                value={newText}
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editLabelR();
                  }
                }}
              />
              <button onClick={editLabelR}>
                <AutorenewRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
          </div>
          <div className="task-area" onClick={closeForm}>
            <div className="task-container">
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
        <div className="edit-area">
          <div className="todoBtn-container">
            <button
              onClick={() => {
                handleFormOpen("LR");
              }}
            >
              <BookmarkBorderRoundedIcon />
            </button>
            <button
              onClick={() => {
                handleFormOpen("TR");
              }}
            >
              <AddRoundedIcon />
            </button>
            <div style={{ overflow: "hidden", clear: "both" }}>
              <DeleteBox deleteTask={deleteTask} />
            </div>
          </div>
          <div className={`task-form ${TRclassName}`}>
            <input
              onChange={(newText) => {
                setNewText(newText.target.value);
              }}
              value={newText}
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTaskR();
                }
              }}
            />
            <button onClick={addTaskR}>
              <SwitchAccessShortcutAddRoundedIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
