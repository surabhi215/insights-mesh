import { RootState } from "@/libs/state/store";
import styles from "@/styles/notes.module.css";
import { useSelector } from "react-redux";

export const Notes = ({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) => {
  const theme = useSelector((state: RootState) => state.theme);
  return (
    <div
      className={
        theme === "dark" ? styles.notesContainerDark : styles.notesContainer
      }
    >
      <div
        className={theme === "dark" ? styles.notesTitleDark : styles.notesTitle}
      >
        {title}
      </div>
      <div className={styles.notesContent}>{summary}</div>
    </div>
  );
};
