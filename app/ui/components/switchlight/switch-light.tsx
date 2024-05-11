"use client";
import React from "react";

interface SwitchLightProps {
  handleButtonClick: () => void;
}

export const SwitchLight: React.FC<SwitchLightProps> = ({
  handleButtonClick,
}) => {
  return (
    <>
      <div>
        <button
          onClick={handleButtonClick}
          className="border-[5px] border-red-500 width-[500px] height-[500px]"
        >
          button
        </button>
      </div>
    </>
  );
};
