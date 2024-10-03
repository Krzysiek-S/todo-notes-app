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
  const charLimit = 200;
  const charLeft = charLimit - inputText.length;
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
          rows={7}
          cols={10}
          placeholder="Type to add a note..."
          ref={inputRef}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          maxLength={200}
        ></textarea>

        <div className="flex justify-start items-center pt-4">
          <span className="mr-[10px]">{charLeft} left </span>
          <button
            onClick={handleAddTodo}
            className={`${
              isColored
                ? "border border-none bg-[#9b6754]"
                : "border border-[#E98E70] bg-[#9f4016]"
            } w-[4.5rem] h-[3rem] border border-l rounded-lg text-white hover:bg-[#A42E39] active:bg-activeCTA`}
          >
            save
          </button>
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
