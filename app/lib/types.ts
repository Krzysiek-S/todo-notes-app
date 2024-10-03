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
    activeNoteId: number | null;
  setActiveNote: (id: number) => void;
  noteOrder: number[];
  setNoteOrder: (order: number[] | ((prevOrder: number[]) => number[])) => void;
  getZIndex: (id: number) => number;
  }

  export interface NoteItemProps {
    note: Note;
    onDelete: (id: number) => void;
    editTodo: (id: number, text: string) => void;
    isColored: boolean;
    activeNoteId: number | null;
  setActiveNote: (id: number) => void;
  noteOrder: number[];
  setNoteOrder: (order: number[] | ((prevOrder: number[]) => number[])) => void;
  getZIndex: (id: number) => number;
  }

  export interface SwitchLightProps {
    onClick: () => void;
  }
  
  export interface KanbanCard {
    id: number;
    
    todo: string;
    status: "To Do" | "In Progress" | "Done";
  }
  
  export interface KanbanColumn {


    title: string;
    cards: KanbanCard[];
  }
  
  export interface KanbanBoard {
    columns: KanbanColumn[];
    todo: string;
  }
  
  // Interfejs props dla komponentu Kanban
  export interface KanbanProps {
    isColored: boolean;
  }

  export interface StripeCustomer {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      stripeCustomerId?: string | null;  // Dodaj stripeCustomerId tutaj
    };
  }