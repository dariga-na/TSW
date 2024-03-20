import React from "react";
import "./Todo.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDrop } from "./DragDrop";

export default function TodoPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragDrop />
    </DndProvider>
  );
}
