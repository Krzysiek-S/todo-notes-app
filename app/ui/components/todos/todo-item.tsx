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
    <div className="flex justify-between items-center sm:flex-col">
      <span className="sm:mb-[13px] sm:mt-[13px] pl-2 flex-grow">
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="no-drag bg-primary text-center border border-none rounded-l-lg px-2 focus:outline-none"
          />
        ) : (
          editedText
        )}
      </span>
      {isEditing ? (
        <div className="flex items-center">
          <button
            onClick={handleSaveButtonClick}
            className={`${
              isColored
                ? "bg-[#62bca1] border-[#539d87] hover:bg-[#56a990]"
                : "bg-[#fe9775] border-[#E98E70] hover:bg-background"
            } w-[4.5rem] h-[3rem] border border-l rounded-l-lg`}
          >
            Save
          </button>
          <button
            onClick={handleCancelEdit}
            className={`${
              isColored
                ? "bg-[#62bca1] border-[#539d87] hover:bg-[#56a990]"
                : "bg-[#fe9775] border-[#E98E70] hover:bg-background"
            } w-[4.5rem] h-[3rem] border border-l rounded-r-lg`}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="sm:w-[100%] flex items-center">
          <button
            onClick={() => onDelete(todo.id)}
            className={`${
              isColored
                ? "bg-[#5cb399] border-[#539d87] hover:bg-[#56a990]"
                : "bg-background border-[#E98E70] hover:bg-activeCTA"
            } sm:w-[100%] w-[4.5rem] h-[3rem] border border-l rounded-l-lg`}
          >
            Delete
          </button>
          <button
            onClick={handleEditButtonClick}
            className={`${
              isColored
                ? "bg-[#5cb399] border-[#539d87] hover:bg-[#56a990]"
                : "bg-background border-[#E98E70] hover:bg-activeCTA"
            } sm:w-[100%] w-[4.5rem] h-[3rem] border border-l rounded-r-lg`}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
