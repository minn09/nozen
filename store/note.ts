import { create } from "zustand";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NoteState {
  notes: Record<string, Note>;
  newNote: () => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: {},
  newNote: () => {
    const id = crypto.randomUUID();

    const untitledCount = Object.values(get().notes).filter((n) =>
      n.title.startsWith("untitled-"),
    ).length;

    const newNote: Note = {
      id,
      title: `untitled-${untitledCount}`,
      content: "",
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      notes: { ...state.notes, [id]: newNote },
    }));
  },

  updateNote: (id, content) => {
    set((state) => ({
      notes: {
        ...state.notes,
        [id]: {
          ...state.notes[id],
          content,
        },
      },
    }));
  },

  deleteNote: (id) => {
    set((state) => {
      const newNotes = { ...state.notes };
      delete newNotes[id];
      return { notes: newNotes };
    });
  },
}));
