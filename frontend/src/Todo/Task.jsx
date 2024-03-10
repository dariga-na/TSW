import { memo } from "react";
import React from "react";
import { useDrag, useDrop } from "react-dnd";

export const Task = memo(function Task({ id, text, moveTask, findTask }) {
  const ItemTypes = {
    BOX: "box",
  };
  const originalIndex = findTask(id).index;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
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

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          const { index: overIndex } = findTask(id);
          moveTask(draggedId, overIndex);
        }
      },
    }),
    [findTask, moveTask]
  );

  const opacity = isDragging ? 0 : 1;

  return (
    <div
      ref={(node) => drag(drop(node))}
      key={id}
      className="box"
      style={{ opacity }}
    >
      {text}
    </div>
  );
});
