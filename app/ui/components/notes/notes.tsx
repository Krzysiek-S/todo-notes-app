"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  postTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from "../../../utils/requests";
import { Note } from "@/app/lib/types";
import Draggable from "react-draggable";
import styles from "./styles.module.css";
import NotesList from "./notes-list";
import { DefaultSession } from "next-auth";

interface IsColored {
  isColored: boolean;
  activeNoteId: number | null;
  setActiveNote: (id: number) => void;
  noteOrder: number[];
  setNoteOrder: (order: number[] | ((prevOrder: number[]) => number[])) => void;
  getZIndex: (id: number) => number;
}
const Notes: React.FC<IsColored> = ({
  isColored,
  activeNoteId,
  setActiveNote,
  noteOrder,
  setNoteOrder,
  getZIndex,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string>("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.supabaseAccessToken) {
      const fetchNotes = async () => {
        try {
          const token = session?.supabaseAccessToken;
          const userId = session?.user?.id;
          if (token && userId) {
            const todosData = await getTodos({ userId, token });
            setNotes(todosData);
          }
        } catch (error: any) {
          console.error("Error fetching todos:", error.message);
        }
      };

      fetchNotes();
    }
  }, [session, status]);

  const handleAddTodo = async () => {
    try {
      if (!inputText.trim()) {
        setError("Please enter a task");
        return;
      }
      const token = session?.supabaseAccessToken;
      const userId = session?.user?.id;
      if (token && userId) {
        await postTodo({
          userId,
          token,
          todoText: inputText.trim(),
        });
        setNotes((prevTodos) => [
          ...prevTodos,
          { id: Date.now(), todo: inputText.trim() },
        ]);
        setInputText("");
        setError("");
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error: any) {
      console.error("Error adding todo:", error.message);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const token = session?.supabaseAccessToken;
      const userId = session?.user?.id;
      if (token && userId) {
        await deleteTodo({
          userId,
          token,
          todoId: id,
        });
        setNotes((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
    } catch (error: any) {
      console.error("Error deleting todo:", error.message);
    }
  };

  const handleEditTodo = async (id: number, text: string) => {
    try {
      const token = session?.supabaseAccessToken;
      const userId = session?.user?.id;
      if (token && userId) {
        const updatedTodos = await updateTodo({
          userId,
          token,
          todoId: id,
          updatedTodo: { todo: text },
        });
        setNotes((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, todo: text } : todo
          )
        );
      }
    } catch (error: any) {
      console.error("Error updating todo:", error.message);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <div className={`text-center rounded-2xl p-[20px]`}>
      <NotesList
        notes={notes}
        onDelete={handleDeleteTodo}
        editTodo={handleEditTodo}
        isColored={isColored}
        inputRef={inputRef}
        inputText={inputText}
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        error={error}
        handleAddTodo={handleAddTodo}
        activeNoteId={activeNoteId}
        setActiveNote={setActiveNote}
        noteOrder={noteOrder}
        setNoteOrder={setNoteOrder}
        getZIndex={getZIndex}
      />
    </div>
  );
};

export default Notes;
