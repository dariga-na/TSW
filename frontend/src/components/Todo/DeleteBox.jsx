import { useDrop } from "react-dnd";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
const ItemTypes = { TASK: "task" };

export const DeleteBox = ({ deleteTask }) => {
  // ドロップ可能にする
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item) => handleDelete(item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  // 親コンポーネントで定義された deleteTask 関数を呼び出す
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // canDrop=ドラッグ始めたとき発動　isActive=ドロップ領域に入ったとき発動
  const isActive = canDrop && isOver;

  // ドラッグ中にスタイル変化させる
  const buttonStyle = {
    cursor: "auto",
    backgroundColor: isActive ? "rgb(81, 79, 79)" : "",
    width: isActive ? "5rem" : "",
    transition: isActive ? "0.2s" : "",
    borderRadius: isActive ? "2rem" : "",
    color: isActive ? "#fff" : "",
    fontSize: isActive ? "1.2rem" : "",
    display: isActive ? "flex" : "",
    alignItems: isActive ? "center" : "",
  };

  return (
    <>
      <button ref={drop} style={buttonStyle}>
        {isActive && <span style={{ margin: "auto" }}>Delete</span>}
        {!isActive && <DeleteRoundedIcon />}
      </button>
    </>
  );
};
