import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDrop } from "./DragDrop";

export default function Todo() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="todo">
        <DragDrop />
      </div>
    </DndProvider>
  );
}
