import { useEffect, useState } from "react";

type Note = { key: number; title: string; summary: string };
export const useGetNotesData = (): Array<Note> => {
  const [notes, setNotes] = useState<Array<Note>>([]);
  useEffect(() => {
    const localNotes = localStorage.getItem("Notes")
      ? JSON.parse(localStorage.getItem("Notes") || "[]")
      : [];
    console.log("Local Notes in hook:", localNotes);
    if (localNotes.length > 0) {
      setNotes(localNotes);
    }
  }, []);

  return notes;
};
