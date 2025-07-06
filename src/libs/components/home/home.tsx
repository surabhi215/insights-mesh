import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "@/libs/state/slices/theme";
import { RootState } from "@/libs/state/store";
import styles from "@/styles/Home.module.css";
import NotesContainer from "../notes/notes-container";
import { useEffect, useState } from "react";
import { ChatModalWithInput } from "../chat-modal/chat-modal";
import { useGetNotesData } from "@/libs/hooks/useGetNotesData";
import { addNote } from "@/libs/state/slices/notes";
import { ThemeSwitch } from "./theme-switch";

export const Home = () => {
  const theme = useSelector((state: RootState) => state.theme);
  const notes = useSelector((state: RootState) => state.notes);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const localNotes = useGetNotesData();
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleAddClick = () => {
    setShowModal(true);
  };
  useEffect(() => {
    const th = JSON.parse(
      localStorage.getItem("theme") || JSON.stringify("light")
    );
    if (th === "dark" && theme === "light") {
      handleThemeToggle();
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    dispatch(addNote(localNotes));
  }, [localNotes]);
  const handleCloseModal = () => {
    localStorage.setItem("Notes", JSON.stringify(notes));
    setShowModal(false);
  };
  return (
    <div className={styles[theme]}>
      <div
        style={{
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <ThemeSwitch onChange={handleThemeToggle} />
      </div>
      <section className={styles.header}>
        <span
          className={theme === "dark" ? styles.headingDark : styles.heading}
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          InsightsMesh
          <button
            onClick={handleAddClick}
            style={{
              background: theme === "dark" ? "#333" : "#333",
              color: theme === "dark" ? "#fff" : "#333",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              padding: "6px",
              marginLeft: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2em",
              transition: "background-color 0.2s, color 0.2s",
            }}
            aria-label="Add"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect
                x="9"
                y="4"
                width="2"
                height="12"
                fill={theme === "dark" ? "#fff" : "#fff"}
              />
              <rect
                x="4"
                y="9"
                width="12"
                height="2"
                fill={theme === "dark" ? "#fff" : "#fff"}
              />
            </svg>
          </button>
        </span>
        <span
          className={
            theme === "dark" ? styles.subHeadingDark : styles.subHeading
          }
        >
          All your chats in one platform!
        </span>
      </section>
      {showModal && (
        <ChatModalWithInput
          title="Summary"
          onClose={handleCloseModal}
          prevChat={[]}
          flowType="add"
        />
      )}
      {notes?.length > 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "85vw",
            margin: "44px auto",
            height: "70%",
            overflowX: "hidden",
          }}
          className={styles.scrollbar}
        >
          <div>
            <NotesContainer />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "85vw",
            margin: "44px auto",
          }}
        >
          No Notes
        </div>
      )}
    </div>
  );
};
