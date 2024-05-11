export interface Todo {
    id: number;
    todo: string;
  }

  export interface Note {
    id: number;
    todo: string;
  }
  
  export interface TodoListProps {
    todos: Todo[];
    onDelete: (id: number) => void;
    editTodo: (id: number, text: string) => void;
    isColored: boolean;
  }

  
  export interface TodoItemProps {
    todo: Todo;
    onDelete: (id: number) => void;
    editTodo: (id: number, text: string) => void;
    isColored: boolean;
  }

  export interface NotesListProps {
    notes: Note[];
    onDelete: (id: number) => void;
    editTodo: (id: number, text: string) => void;
    isColored: boolean;
    inputRef: React.RefObject<HTMLTextAreaElement>;
    inputText?: string;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error: string;
    handleAddTodo: () => Promise<void>
  }

  export interface NoteItemProps {
    note: Note;
    onDelete: (id: number) => void;
    editTodo: (id: number, text: string) => void;
    isColored: boolean;
  }

  export interface SwitchLightProps {
    onClick: () => void;
  }
  
  