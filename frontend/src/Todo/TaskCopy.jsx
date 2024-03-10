// Copy2と組み合わせて使う
// ボード間のD&D実装完了

import React from "react";
import { useDrag, useDrop } from "react-dnd";

export default function Task({
  id,
  index,
  board,
  text,
  changeBoard,
  moveTask,
}) {
  const ItemTypes = {
    BOX: "box",
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { id: id, index: index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item) => moveTask(item.index, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

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
}
