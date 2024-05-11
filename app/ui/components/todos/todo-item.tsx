import React, { useState } from "react";
import { TodoItemProps } from "@/app/lib/types";

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  editTodo,
  isColored,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.todo);

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  const handleSaveButtonClick = () => {
    editTodo(todo.id, editedText);
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleCancelEdit = () => {
    setEditedText(todo.todo);
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center ">
      <span className="pl-2 flex-grow">
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="border border-none rounded-l-lg px-2 focus:outline-none text-black"
          />
        ) : (
          editedText
        )}
      </span>
      {isEditing ? (
        <div className="flex items-center">
          <button
            onClick={handleSaveButtonClick}
            className={`w-[4.5rem] h-[3rem] hover:bg-activeCTA border border-l border-[#E98E70] rounded-l-lg`}
          >
            Save
          </button>
          <button
            onClick={handleCancelEdit}
            className={`w-[4.5rem] h-[3rem] bg-background hover:bg-activeCTA border border-l border-[#E98E70] rounded-r-lg`}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <button
            onClick={() => onDelete(todo.id)}
            className={`${
              isColored
                ? "bg-[#5cb399] border-[#539d87] hover:bg-[#56a990]"
                : "bg-background border-[#E98E70] hover:bg-activeCTA"
            } w-[4.5rem] h-[3rem] border border-l rounded-l-lg`}
          >
            Delete
          </button>
          <button
            onClick={handleEditButtonClick}
            className={`${
              isColored
                ? "bg-[#5cb399] border-[#539d87] hover:bg-[#56a990]"
                : "bg-background border-[#E98E70] hover:bg-activeCTA"
            } w-[4.5rem] h-[3rem] border border-l rounded-r-lg`}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
