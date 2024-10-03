import React, { useRef, useEffect } from "react";
import styles from "./modal.module.css";

interface ModalProps {
  editText: string;
  setEditText: (text: string) => void;
  handleSaveEdit: () => void;
  handleDeleteTodo: () => void;
  handleCloseModal: () => void;
  isColored: boolean;
}

const TodoModal: React.FC<ModalProps> = ({
  editText,
  setEditText,
  handleSaveEdit,
  handleDeleteTodo,
  handleCloseModal,
  isColored,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleCloseModal(); // Zamknij modal
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className={styles.modalOverlay}>
      <div
        ref={modalRef}
        className={`${styles.modalContent} ${
          isColored
            ? " border-[4px] border-[#4d9680] bg-[#5cb399]"
            : "border-[4px] border-[#E98E70] bg-[#FFA384]"
        }`}
      >
        <h2 className={styles.modalTitle}>Edit your task</h2>
        <textarea
          className={`${styles.modalTextarea} ${
            isColored
              ? " border-[2px] border-[#4d9680] "
              : "border-[2px] border-[#E98E70] "
          }`}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
        <div className={`${styles.modalActions} mb-2`}>
          <button
            className={`${styles.modalButtonSave} ${
              isColored
                ? "border border-[#53a089] bg-[#5cb399] hover:bg-[#56a990]"
                : "border border-[#E98E70] bg-[#FFA384] hover:bg-[#f49575]"
            }`}
            onClick={handleSaveEdit}
          >
            Save
          </button>
          <button
            className={`${styles.modalButtonDelete} ${
              isColored
                ? "border border-[#53a089] bg-[#5cb399] hover:bg-[#56a990]"
                : "border border-[#E98E70] bg-[#FFA384] hover:bg-[#f49575]"
            }`}
            onClick={handleDeleteTodo}
          >
            Delete
          </button>
          <button
            className={`${styles.modalButtonCancel} ${
              isColored
                ? "border border-[#53a089] bg-[#5cb399] hover:bg-[#56a990]"
                : "border border-[#E98E70] bg-[#FFA384] hover:bg-[#f49575]"
            }`}
            onClick={handleCloseModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;
