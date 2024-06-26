// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";
import { SwitchLight } from "@/app/ui/components/switchlight/switch-light";
import Todos from "@/app/ui/components/todos/todos";
import Notes from "./ui/components/notes/notes";
import { Button } from "@/app/ui/button";
import { Shiba } from "@/app/ui/shiba";
import { Main } from "./ui/components/main";
import Light from "./ui/components/light";
import Draggable from "react-draggable";

import styles from "./ui/components/todos/styles.module.css";

export default function Page() {
  const { data: session, status } = useSession();
  const [isColored, setColored] = useState(false);
  const [draggingMain, setDraggingMain] = useState(false);
  const [isDashboardChange, setIsDashboardChange] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [sounds, setSounds] = useState<{
    lampTurn: HTMLAudioElement | null;
    lampTurnOff: HTMLAudioElement | null;
    lightSwitch: HTMLAudioElement | null;
    shiba1: HTMLAudioElement | null;
    shiba2: HTMLAudioElement | null;
  }>({
    lampTurn: null,
    lampTurnOff: null,
    lightSwitch: null,
    shiba1: null,
    shiba2: null,
  });

  useEffect(() => {
    setSounds((prevSounds) => ({
      ...prevSounds,
      lampTurn: new Audio("/switch/sounds/turnlamp1.mp3"),
      lampTurnOff: new Audio("/switch/sounds/turnofflamp1.mp3"),
      lightSwitch: new Audio("/switch/sounds/switch-light.mp3"),
      shiba1: new Audio("/shiba/1.mp3"),
      shiba2: new Audio("/shiba/2.mp3"),
    }));
  }, []);

  useEffect(() => {
    if (sounds.lampTurn && sounds.lampTurnOff) {
      sounds.lampTurn.volume = 0.9;
      if (isOn) {
        sounds.lampTurn.play();
      } else {
        sounds.lampTurnOff.play();
        sounds.lampTurn.pause();
        sounds.lampTurn.currentTime = 0;
      }
    }
  }, [isOn, sounds.lampTurn, sounds.lampTurnOff]);

  const handleButtonClick = () => {
    setColored((prevState) => !prevState);
    const audio = new Audio("/switch/sounds/light-sound.mp3");
    audio.play();
    console.log("COLOR: ", isColored);
  };

  const handleButtonDashboardClick = () => {
    setIsDashboardChange((prevState) => !prevState);
    const audio = new Audio("/switch/sounds/switch-light.mp3");
    audio.play();
    console.log("MUSIC: ", isColored);
  };

  const handleMouseHover = () => {
    const audio = new Audio("/shiba/1.mp3");
    audio.volume = 0.2;
    audio.play();
  };

  const handleShibaClick = () => {
    const audio = new Audio("/shiba/2.mp3");
    audio.volume = 0.7;
    audio.play();
  };

  const handleSwitchLamp = () => {
    setIsOn((prevIsOn) => !prevIsOn);
  };

  return (
    <div
      className={`${
        isColored
          ? "bg-[#5cb399] scrollback-second"
          : "bg-[#FFA384] scrollback-first"
      } h-[100vh] w-[100%] overflow-x-hidden relative`}
    >
      {status === "authenticated" ? (
        <>
          <div className="flex justify-between items-center relative z-10">
            Signed in as {session?.user?.email} <br />
            <div className="p-[20px]">
              <button onClick={() => signOut()}>Sign out</button>
            </div>
            <Button handleButtonClick={handleButtonClick} />
          </div>
          <Shiba
            handleMouseHover={handleMouseHover}
            handleShibaClick={handleShibaClick}
          />
          <div className="relative z-10">
            <div className="flex items-center ml-6">
              <div
                className={`${
                  isColored ? styles.box4 : styles.box3
                } relative flex items-center border-[#494544] border-[2px] bg-[#6f6967]
            w-[45px] h-[15px] rounded-full cursor-pointer`}
                onClick={handleSwitchLamp}
              >
                <input
                  type="checkbox"
                  id="lampSwitch"
                  className="absolute opacity-0"
                  checked={isOn}
                  readOnly
                />
                <label
                  htmlFor="lampSwitch"
                  className="block bg-[#645f5d] cursor-pointer border-[#494544] border-[2px] w-[23px] h-[23px]  rounded-full transition-transform"
                  style={{
                    transform: isOn ? "translateX(80%)" : "translateX(0)",
                  }}
                  onClick={handleSwitchLamp}
                ></label>
              </div>
              <button
                className={`${
                  isColored ? styles.box4 : styles.box3
                } ml-[10%] w-[23px] h-[23px] active:border-[3.5px] border border-[#494544] border-[2px] bg-[#645f5d] rounded-full`}
                onMouseDown={handleButtonDashboardClick}
              ></button>
            </div>
            <Main isColored={isColored} isDashboardChange={isDashboardChange} />
          </div>
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={() => signIn("discord")}>Sign in</button>
          <motion.button
            onClick={() => signIn()}
            className="rounded-full h-[75px] px-3 py-0.5 bg-secondary"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Sign in
          </motion.button>
        </>
      )}
    </div>
  );
}
