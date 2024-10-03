import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  getKanbanData,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../../../utils/requests";
import { KanbanColumn, KanbanCard } from "@/app/lib/types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TodoModal from "./todoModal"; // Import the modal component
import styles from "./styles.module.css";

const Kanban: React.FC<{ isColored: boolean }> = ({ isColored }) => {
  const { data: session } = useSession();
  const [board, setBoard] = useState<KanbanColumn[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session?.supabaseAccessToken) {
      const fetchKanbanData = async () => {
        try {
          const token = session.supabaseAccessToken;
          const userId = session.user.id;
          if (token && userId) {
            const todos = await getTodos({ userId, token });
            const columns: KanbanColumn[] = [
              { title: "To Do", cards: [] },
              { title: "In Progress", cards: [] },
              { title: "Done", cards: [] },
            ];
            todos.forEach((todo: KanbanCard) => {
              if (todo.status === "To Do") {
                columns[0].cards.push(todo);
              } else if (todo.status === "In Progress") {
                columns[1].cards.push(todo);
              } else if (todo.status === "Done") {
                columns[2].cards.push(todo);
              }
            });
            setBoard(columns);
          }
        } catch (error: any) {
          console.error("Error fetching Kanban data:", error.message);
        }
      };
      fetchKanbanData();
    }
  }, [session]);

  const handleDragEnd = async (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedBoard = [...board];
    const [movedCard] = updatedBoard[source.droppableId].cards.splice(
      source.index,
      1
    );
    updatedBoard[destination.droppableId].cards.splice(
      destination.index,
      0,
      movedCard
    );
    setBoard(updatedBoard);

    if (session) {
      const token = session.supabaseAccessToken;
      const userId = session.user.id;

      if (source.droppableId === destination.droppableId) {
        const updatedColumnTodos = updatedBoard[destination.droppableId].cards;

        for (let i = 0; i < updatedColumnTodos.length; i++) {
          const todo = updatedColumnTodos[i];
          await updateTodo({
            userId,
            token,
            todoId: todo.id,
            updatedTodo: { position: i },
          });
        }
      } else {
        const newStatus = updatedBoard[destination.droppableId].title;
        movedCard.status = newStatus as "To Do" | "In Progress" | "Done";

        await updateTodo({
          userId,
          token,
          todoId: movedCard.id,
          updatedTodo: { status: newStatus, position: destination.index },
        });

        const updatedDestinationColumn =
          updatedBoard[destination.droppableId].cards;
        for (let i = 0; i < updatedDestinationColumn.length; i++) {
          const todo = updatedDestinationColumn[i];
          if (todo.id !== movedCard.id) {
            await updateTodo({
              userId,
              token,
              todoId: todo.id,
              updatedTodo: { position: i },
            });
          }
        }

        const updatedSourceColumn = updatedBoard[source.droppableId].cards;
        for (let i = 0; i < updatedSourceColumn.length; i++) {
          const todo = updatedSourceColumn[i];
          await updateTodo({
            userId,
            token,
            todoId: todo.id,
            updatedTodo: { position: i },
          });
        }
      }
    }
  };

  // Open the modal when a todo is clicked
  const handleEditTodo = (card: KanbanCard) => {
    setIsEditing(card.id);
    setEditText(card.todo);
    setShowModal(true); // Show the modal
  };

  const handleSaveEdit = async () => {
    // Update the todo and close the modal
    if (isEditing !== null) {
      try {
        const token = session?.supabaseAccessToken;
        const userId = session?.user?.id;
        if (token && userId) {
          await updateTodo({
            userId,
            token,
            todoId: isEditing,
            updatedTodo: { todo: editText },
          });
          setBoard((prevBoard) =>
            prevBoard.map((column) => ({
              ...column,
              cards: column.cards.map((todo) =>
                todo.id === isEditing ? { ...todo, todo: editText } : todo
              ),
            }))
          );
          setShowModal(false); // Close the modal
        }
      } catch (error: any) {
        console.error("Error saving edited todo:", error.message);
      }
    }
  };

  const handleDeleteTodo = async () => {
    // Delete the todo and close the modal
    if (isEditing !== null) {
      try {
        const token = session?.supabaseAccessToken;
        const userId = session?.user?.id;
        if (token && userId) {
          await deleteTodo({
            userId,
            token,
            todoId: isEditing,
          });
          setBoard((prevBoard) =>
            prevBoard.map((column) => ({
              ...column,
              cards: column.cards.filter((todo) => todo.id !== isEditing),
            }))
          );
          setShowModal(false); // Close the modal
        }
      } catch (error: any) {
        console.error("Error deleting todo:", error.message);
      }
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={`${styles.kanbanBoard}`}>
          {board.map((column, columnIndex) => (
            <Droppable droppableId={`${columnIndex}`} key={columnIndex}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${
                    isColored
                      ? "border border-2 border-[#56a68e] bg-[#5cb399]"
                      : "border border-[#E98E70] bg-[#ffa382]"
                  } ${snapshot.isDraggingOver ? styles.isDraggingOver : ""} ${
                    styles.kanbanColumn
                  } shadow-xl`}
                >
                  <h3 className={styles.columnHeader}>{column.title}</h3>
                  <div className={`${styles.kanbanItems}`}>
                    {column.cards.map((card, cardIndex) => (
                      <Draggable
                        draggableId={`${card.id}`}
                        index={cardIndex}
                        key={card.id}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleEditTodo(card)}
                            className={`${
                              isColored ? "bg-primary" : "bg-[#b52b40]"
                            } ${
                              snapshot.isDragging
                                ? isColored
                                  ? styles.isDragging
                                  : styles.isDragging2
                                : ""
                            } ${styles.kanbanItem}`}
                          >
                            <span className="">{card.todo}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <TodoModal
          editText={editText}
          setEditText={setEditText}
          handleSaveEdit={handleSaveEdit}
          handleDeleteTodo={handleDeleteTodo}
          handleCloseModal={() => setShowModal(false)}
          isColored={isColored}
        />
      )}
    </div>
  );
};

export default Kanban;
