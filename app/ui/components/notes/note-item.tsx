import React, { useState, useEffect } from "react";
import { NoteItemProps } from "@/app/lib/types";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

import styles from "./styles.module.css";

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onDelete,
  editTodo,
  isColored,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.todo);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchNotePosition = () => {
      try {
        // Sprawdź, czy w localStorage istnieje zapisane położenie notatki
        const storedPosition = localStorage.getItem(`note_${note.id}_position`);
        if (storedPosition) {
          const { x, y } = JSON.parse(storedPosition);
          setPosition({ x, y });
        }
      } catch (error: any) {
        console.error("Error fetching note position:", error.message);
      }
    };

    fetchNotePosition();
  }, [note.id]);

  const handlePositionChange = (data: DraggableData) => {
    try {
      const { x, y } = data;
      // Zapisz położenie x i y notatki w localStorage
      localStorage.setItem(
        `note_${note.id}_position`,
        JSON.stringify({ x, y })
      );

      // Aktualizuj położenie notatki na ekranie
      setPosition({ x, y });
    } catch (error: any) {
      console.error("Error updating note position:", error.message);
    }
  };

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  const handleSaveButtonClick = () => {
    editTodo(note.id, editedText);
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleCancelEdit = () => {
    setEditedText(note.todo);
    setIsEditing(false);
  };

  return (
    <Draggable
      position={position}
      defaultPosition={{ x: position.x, y: position.y }}
      onStop={(e, data) => handlePositionChange(data)}
    >
      <div
        className={`${
          isColored
            ? "border border-[#54a38c] bg-[#5cb399]"
            : "border border-[#E98E70] bg-[#FFA384]"
        } handle shadow-2xl rounded-md p-4 flex flex-col justify-between items-center`}
      >
        {isEditing ? (
          <textarea
            rows={8}
            cols={30}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="border border-none rounded-l-lg px-2 focus:outline-none text-black"
          />
        ) : (
          editedText
        )}
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
              onClick={() => onDelete(note.id)}
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
              className={` ${
                isColored
                  ? "border border-none bg-[#9b6754]"
                  : "border border-[#E98E70] bg-[#9f4016]"
              } w-[4.5rem] h-[3rem] border border-l rounded-r-lg text-white hover:bg-[#A42E39] active:bg-activeCTA`}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </Draggable>
    // <div className="rounded-md p-4 min-h-[170px] border border-red-700">
    //   fsdfd
    //   <div className="noteFooter">
    //     <small>13/04/2222</small>
    //   </div>
    // </div>
  );
};

export default NoteItem;
