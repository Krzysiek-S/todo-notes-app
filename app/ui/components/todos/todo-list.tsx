import React from "react";

import TodoItem from "./todo-item";
import { TodoListProps } from "@/app/lib/types";

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  editTodo,
  isColored,
}) => {
  return (
    <div className="sm:space-y-8 space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="rounded-lg ring-1 ring-slate-900/5 shadow-primary sm:shadow-none bg-primary text-white"
        >
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            editTodo={editTodo}
            isColored={isColored}
          />
        </div>
      ))}
    </div>
  );
};

export default TodoList;
