import { supabaseClient } from "./supabaseClient";

export const getTodos = async ({ userId, token }) => {
  const supabase = await supabaseClient(token);
  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching todos:", error.message);
    return [];
  }

  return todos;
};

// Updated postTodo function to accept todoText
export const postTodo = async ({ userId, token, todoText }) => {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("todos")
    .insert({
      user_id: userId,
      todo: todoText,
      // Add other fields as needed
    })
    .select();

  if (error) {
    console.error("Error posting todo:", error.message);
    return null;
  }

  return data;
};

export const updateTodo = async ({ userId, token, todoId, updatedTodo }) => {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("todos")
    .update(updatedTodo)
    .eq("user_id", userId)
    .eq("id", todoId)
    .select();

  if (error) {
    console.error("Error updating todo:", error.message);
    return null;
  }

  return data;
};

// Function to delete a todo
export const deleteTodo = async ({ userId, token, todoId }) => {
  const supabase = await supabaseClient(token);
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("user_id", userId)
    .eq("id", todoId);

  if (error) {
    console.error("Error deleting todo:", error.message);
    return false;
  }

  return true;
};

export const saveNotePosition = async (noteId, x, y, token) => {
  try {
    const supabase = await supabaseClient(token);
    const { error } = await supabase.from("note_positions").insert({
      note_id: noteId,
      x,
      y,
    });
    if (error) {
      console.error("Error saving note position:", error.message);
    }
  } catch (error) {
    console.error("Error saving note position:", error.message);
  }
};

export const updateNotePosition = async ({ noteId, x, y, token }) => {
  const supabase = await supabaseClient(token);
  const { error } = await supabase
    .from("note_positions")
    .insert(
      [{ note_id: noteId, x, y }],
      { onConflict: ['note_id'], returning: 'minimal' }
    );

  if (error) {
    console.error("Error updating note position:", error.message);
    return false;
  }

  return true;
};

export const getNotePosition = async ({noteId, token}) => {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("note_positions")
    .select("x, y")
    .eq("note_id", noteId);

  if (error) {
    throw new Error(`Error fetching note position: ${error.message}`);
  }

  if (data && data.length > 0) {
    return { x: data[0].x, y: data[0].y };
  }

  return null;
};