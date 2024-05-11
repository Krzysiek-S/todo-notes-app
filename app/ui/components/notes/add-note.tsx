import Draggable from "react-draggable";

import { motion } from "framer-motion";

export const AddNote = ({
  inputRef,
  inputText,
  handleInputChange,
  handleKeyDown,
  error,
  handleAddTodo,
  isColored,
}: any) => {
  return (
    <Draggable>
      <div
        className={`${
          isColored
            ? "border border-[#54a38c] bg-[#5cb399]"
            : "border border-[#E98E70] bg-[#FFA384]"
        } rounded-md p-4 min-h-[170px] flex flex-col justify-between border border-red-700`}
      >
        <textarea
          className="border-none resize-none"
          rows={8}
          cols={10}
          placeholder="Type to add a note..."
          ref={inputRef}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        ></textarea>

        <div className="">
          <small>200 remaining...</small>
          <button onClick={handleAddTodo}>save</button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-red-500 text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    </Draggable>
  );
};
