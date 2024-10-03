import { CreateSupabaseClient  } from "./supabaseClient";

export const getTodos = async ({ userId, token }) => {
  const supabase = await CreateSupabaseClient (token);
  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true }); 

  if (error) {
    console.error("Error fetching todos:", error.message);
    return [];
  }

  return todos.map(todo => ({
    id: todo.id,
    todo: todo.todo,
    status: todo.status || "To Do",
  }));
};

// Updated postTodo function to accept todoText
export const postTodo = async ({ userId, token, todoText }) => {
  const supabase = await CreateSupabaseClient (token);
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
  const supabase = await CreateSupabaseClient(token);
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
  const supabase = await CreateSupabaseClient(token);
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
    const supabase = await CreateSupabaseClient(token);
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
  const supabase = await CreateSupabaseClient(token);
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
  const supabase = await CreateSupabaseClient(token);
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

export const getKanbanData = async ({ userId, token }) => {
  const supabase = await CreateSupabaseClient(token);
  
  // Fetch the Kanban structure
  const { data: kanbanData, error } = await supabase
    .from('kanban')
    .select('columns')
    .eq('user_id', userId)
    .single()
    .order('position', { ascending: true });
  
  if (error) {
    console.error('Error fetching Kanban data:', error);
    return [];
  }
  
  const columns = kanbanData.columns || [];
  
  // Fetch todos for this user
  const { data: todos, todosError } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId);
  
  if (todosError) {
    console.error('Error fetching todos:', todosError);
    return [];
  }
  
  // Map todo data to corresponding columns
  columns.forEach(column => {
    column.cards = todos.filter(todo => column.cards.includes(todo.id));
  });
  
  return columns;
};


export const updateKanbanData = async ({ userId, token, columns }) => {
  const supabase = await CreateSupabaseClient(token);

  const { data, error } = await supabase
    .from('kanban')
    .update({ columns })
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('Error updating Kanban data:', error);
    return null;
  }

  return data;
};
