"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
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

interface IsColored {
  isColored: boolean;
  className: string;
}

const Notes: React.FC<IsColored> = ({ isColored }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string>("");
  const { userId, getToken } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = await getToken({ template: "supabase" });
        const todosData = await getTodos({ userId, token });
        setNotes(todosData);
      } catch (error: any) {
        console.error("Error fetching todos:", error.message);
      }
    };

    fetchNotes();
  }, [userId, getToken]);

  const handleAddTodo = async () => {
    try {
      if (!inputText.trim()) {
        setError("Please enter a task");
        return;
      }
      const token = await getToken({ template: "supabase" });
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

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error: any) {
      console.error("Error adding todo:", error.message);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const token = await getToken({ template: "supabase" });
      await deleteTodo({
        userId,
        token,
        todoId: id,
      });
      setNotes((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error: any) {
      console.error("Error deleting todo:", error.message);
    }
  };

  const handleEditTodo = async (id: number, text: string) => {
    try {
      const token = await getToken({ template: "supabase" });
      const updatedTodos = await updateTodo({
        userId,
        token,
        todoId: id,
        updatedTodo: { todo: text },
      });

      const updatedTodo = updatedTodos
        ? updatedTodos.find((todo) => todo.id === id)
        : null;

      setNotes((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? { ...todo, todo: updatedTodo ? updatedTodo.todo : text }
            : todo
        )
      );
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
    <div
      // className={`${
      //   isColored ? "border border-[#5cb399]" : "border border-[#E98E70]"
      // } text-center rounded-2xl p-[20px]`}
      className={`text-center rounded-2xl p-[20px]`}
    >
      {/* <textarea
          rows={8}
          cols={30}
          placeholder="Type a note..."
          ref={inputRef}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        ></textarea>
        <div className="note-footer">
          <small>200 remaining</small>
        </div> */}
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
      />
    </div>
  );
};

export default Notes;
