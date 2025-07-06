import styles from "@/styles/modal.module.css";
import { useEffect, useRef, useState } from "react";
import { addNote, updateNote } from "@/libs/state/slices/notes";
import { isLoading } from "@/libs/state/slices/loading";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatResponse } from "@/libs/utils/generateChats";
import { generateSummary } from "@/libs/utils/generateSummary";
import { RootState } from "@/libs/state/store";

type Message = {
  role: string;
  parts: Array<{ text: string }>;
};

export const ChatModalWithInput = ({
  title,
  onClose,
  prevChat = [],
  flowType,
  prevKey,
}: {
  title: string;
  onClose: () => void;
  prevChat?: Message[];
  flowType?: "add" | "view";
  prevKey?: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    if (prevChat.length > 0) {
      setMessages(prevChat);
    }
  }, []);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const fetchSummary = async () => {
    const res = await generateSummary(messages);
    const resText = res?.response?.candidates?.[0]?.content?.parts?.[0]
      ?.text as string;
    const [summary, title] = resText
      ?.replaceAll("\n", "")
      ?.split(/Summary:|Title:/)
      ?.filter((str) => str);
    return { summary, title };
  };

  const handleFetchResponse = async (userMessage: string) => {
    const res = await fetchChatResponse({
      messages,
      userMessage,
    });
    setLoading(false);
    const aiMessage =
      res?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";
    setMessages((prev) => [
      ...prev,
      { role: "model", parts: [{ text: aiMessage }] },
    ]);
  };

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;
    setLoading(true);
    handleFetchResponse(trimmedInput);
    setMessages((prev) => [
      ...prev,
      { role: "user", parts: [{ text: trimmedInput }] },
    ]);
    setInput("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const updateNotesSummary = async (key?: string) => {
    dispatch(isLoading(true));
    const { summary, title } = await fetchSummary();
    const localNotes = localStorage.getItem("Notes")
      ? JSON.parse(localStorage.getItem("Notes") || "[]")
      : [];
    if (flowType === "add") {
      localStorage.setItem(
        "Notes",
        JSON.stringify([
          ...localNotes,
          {
            key: key,
            title,
            summary,
          },
        ])
      );
      dispatch(
        addNote([
          {
            title,
            summary,
            key,
          },
        ])
      );
    } else if (flowType === "view") {
      const filteredNotes = localNotes?.filter(
        (note: any) => note.key !== prevKey
      );
      localStorage.setItem(
        "Notes",
        JSON.stringify([
          ...filteredNotes,
          {
            key: prevKey,
            title,
            summary,
          },
        ])
      );
      dispatch(
        updateNote([
          {
            title,
            summary,
            key: prevKey,
          },
        ])
      );
    }
    dispatch(isLoading(false));
  };

  const onCloseModal = () => {
    if (flowType === "add" && messages.length > 0) {
      const key = window.crypto.randomUUID();
      updateNotesSummary(key);
      const localChats = localStorage.getItem("chats")
        ? JSON.parse(localStorage.getItem("chats") || "[]")
        : [];
      localStorage.setItem(
        "chats",
        JSON.stringify([
          ...localChats,
          {
            key,
            messages,
          },
        ])
      );
    } else if (flowType === "view") {
      updateNotesSummary();
      const localChats = localStorage.getItem("chats")
        ? JSON.parse(localStorage.getItem("chats") || "[]")
        : [];
      const filteredChats = localChats?.filter(
        (chat: any) => chat.key !== prevKey
      );
      localStorage.setItem(
        "chats",
        JSON.stringify([
          ...filteredChats,
          {
            key: prevKey,
            messages,
          },
        ])
      );
    }
    onClose();
  };

  const closeModal = (e: React.MouseEvent) => {
    if (modalRef.current === e.target) {
      onCloseModal();
    }
  };

  return (
    <div className={styles.chatModalContainer}>
      <div className={styles.chatModal} ref={modalRef} onClick={closeModal}>
        <div
          className={
            theme === "dark" ? styles.chatModalBodyDark : styles.chatModalBody
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>{title}</h2>
            <button
              onClick={onCloseModal}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          {messages.length === 0 && (
            <div
              key="no_message"
              style={{ color: "#888", overflowY: "hidden", margin: "0 auto" }}
              className={styles.temp}
            >
              No messages yet.
            </div>
          )}
          {messages.length > 0 && (
            <div
              style={{
                overflowY: "scroll",
                marginBottom: 16,
              }}
              className={styles.temp}
              ref={messageRef}
            >
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div
                    style={
                      theme === "dark"
                        ? {
                            backgroundColor: "#000",
                            padding: "8px 12px",
                            borderRadius: "20px",
                            marginBottom: 8,
                            maxWidth: "50%",
                            marginLeft: "auto",
                            width: "fit-content",
                            color: "#fff",
                          }
                        : {
                            backgroundColor: "#e0f7fa",
                            padding: "8px 12px",
                            borderRadius: "20px",
                            marginBottom: 8,
                            maxWidth: "50%",
                            marginLeft: "auto",
                            width: "fit-content",
                          }
                    }
                  >
                    {msg.parts[0].text}
                  </div>
                ) : (
                  <div
                    style={
                      theme === "dark"
                        ? {
                            backgroundColor: "#043764",
                            padding: "8px 12px",
                            borderRadius: "20px",
                            marginBottom: 8,
                            maxWidth: "50%",
                            width: "fit-content",
                          }
                        : {
                            backgroundColor: "#fff3e0",
                            padding: "8px 12px",
                            borderRadius: "20px",
                            marginBottom: 8,
                            maxWidth: "50%",
                            width: "fit-content",
                          }
                    }
                  >
                    {msg.parts[0].text}
                  </div>
                )
              )}
            </div>
          )}
          {loading && <div className={styles.loader}></div>}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className={
                theme === "dark" ? styles.chatInputDark : styles.chatInput
              }
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Type your message..."
              style={{ flex: 1 }}
            />
            <button className={styles.sendButton} onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
