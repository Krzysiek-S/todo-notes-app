"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  postTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from "../../../utils/requests";
import { Todo } from "@/app/lib/types";

import Draggable from "react-draggable";
import { motion } from "framer-motion";

import styles from "./styles.module.css";
import TodoList from "./todo-list";

interface IsColored {
  isColored: boolean;
}

const Todos: React.FC<IsColored> = ({ isColored }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const { userId, getToken } = useAuth();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = await getToken({ template: "supabase" });
        const todosData = await getTodos({ userId, token });
        setTodos(todosData);
      } catch (error: any) {
        console.error("Error fetching todos:", error.message);
      }
    };

    fetchTodos();
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

      setTodos((prevTodos) => [
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
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
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

      setTodos((prevTodos) =>
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <>
      {/* <Draggable> */}
      <div
        className={`${
          isColored
            ? "border border-[#5cb399] bg-[#5cb399]"
            : "border border-[#E98E70] bg-[#FFA384]"
        } flex flex-col text-center justify-between shadow-2xl rounded-3xl max-h-[480px] p-[50px]`}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="add a task"
          required
          className={`${styles.box} border-r border-l rounded-lg border-primary focus:outline-none w-[20rem] bg-[#E5FBFF] min-h-[40px] px-3`}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-red-500 text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
        <div
          className={`${
            isColored
              ? "bg-[#5cb399] scrollback-second"
              : "bg-[#FFA384] scrollback-first"
          } mt-[23px] mb-[16px] scrollback-first overflow-x-hidden`}
        >
          <TodoList
            todos={todos}
            onDelete={handleDeleteTodo}
            editTodo={handleEditTodo}
            isColored={isColored}
          />
        </div>
        <div className="mt-[10px]">
          <motion.button
            onClick={handleAddTodo}
            className={`${isColored ? styles.box2 : styles.box1} ${
              isColored
                ? "border border-none bg-[#9b6754]"
                : "border border-[#E98E70] bg-[#832800]"
            } font-bold border rounded-full w-[7rem] h-[2.7rem] text-white hover:bg-[#A42E39] active:bg-activeCTA`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Add Me!
          </motion.button>
        </div>
      </div>
      {/* </Draggable> */}
    </>
  );
};

export default Todos;
