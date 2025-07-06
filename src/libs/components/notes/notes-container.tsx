import React, { useEffect, useState } from "react";
import { Notes } from "./notes";
import { useSelector } from "react-redux";
import { RootState } from "@/libs/state/store";
import styles from "@/styles/modal.module.css";
import { ChatModalWithInput } from "../chat-modal/chat-modal";

const NotesContainer = () => {
  const notes = useSelector((state: RootState) => state.notes);
  const loading = useSelector((state: RootState) => state.loading);
  const [showModal, setShowModal] = useState(false);
  const [prevChat, setPrevChat] = useState([]);
  const [prevKey, setPrevKey] = useState("");
  const [currTitle, setCurrTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const viewNote = (key: string, title: string) => {
    const localChats = localStorage.getItem("chats")
      ? JSON.parse(localStorage.getItem("chats") || "[]")
      : [];
    const chat = localChats?.filter((chat: any) => chat.key === key);
    setPrevChat(chat?.[0]?.messages || []);
    setPrevKey(key);
    setCurrTitle(title);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    localStorage.setItem("Notes", JSON.stringify(notes));
    setShowModal(false);
  };

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  return (
    <>
      {showModal && (
        <ChatModalWithInput
          title={currTitle}
          onClose={handleCloseModal}
          prevChat={prevChat}
          flowType="view"
          prevKey={prevKey}
        />
      )}
      {isLoading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "8px",
          }}
        >
          <div className={styles.loader}></div>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr) ) ",
          gap: "32px",
          width: "80vw",
        }}
      >
        {notes?.map((note, index) => (
          <div
            key={note.key}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "350px",
            }}
            onClick={viewNote.bind(null, note.key, note.title)}
          >
            <Notes key={note.key} title={note.title} summary={note.summary} />
          </div>
        ))}
      </div>
    </>
  );
};

export default NotesContainer;
