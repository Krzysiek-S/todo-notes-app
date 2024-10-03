import React from "react";

import NoteItem from "./note-item";
import { AddNote } from "./add-note";
import { NotesListProps } from "@/app/lib/types";
import Draggable from "react-draggable";

import styles from "./styles.module.css";

const NotesList: React.FC<NotesListProps> = ({
  notes,
  onDelete,
  editTodo,
  isColored,
  inputRef,
  inputText,
  handleInputChange,
  handleKeyDown,
  error,
  handleAddTodo,
  activeNoteId,
  setActiveNote,
  noteOrder,
  setNoteOrder,
  getZIndex,
}) => {
  return (
    <div className=" grid auto-rows-fr sm:grid-cols-2 md:grid-cols-4 gap-7">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onDelete={onDelete}
          editTodo={editTodo}
          isColored={isColored}
          activeNoteId={activeNoteId}
          setActiveNote={setActiveNote}
          noteOrder={noteOrder}
          setNoteOrder={setNoteOrder}
          getZIndex={getZIndex}
        />
      ))}
      <AddNote
        inputRef={inputRef}
        inputText={inputText}
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        error={error}
        handleAddTodo={handleAddTodo}
        isColored={isColored}
      />
    </div>
  );
};

export default NotesList;
