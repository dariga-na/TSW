import { memo } from "react";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
const ItemTypes = { TASK: "task" };

export const Task = memo(function Task({ id, text, moveTask, findTask }) {
  // 指定したタスクをドラッグできるようにする
  const originalIndex = findTask(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TASK,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();

        if (!didDrop) {
          moveTask(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveTask]
  );

  // タスクエリアにドロップできるようにする
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.TASK,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          const { index: overIndex } = findTask(id);
          moveTask(draggedId, overIndex);
        }
      },
    }),
    [findTask, moveTask]
  );

  // ドラッグ中に配置予定の場所が空くように見せる
  const opacity = isDragging ? 0 : 1;

  return (
    <div
      ref={(node) => drag(drop(node))}
      key={id}
      className="task"
      style={{ opacity }}
    >
      {text}
    </div>
  );
});
