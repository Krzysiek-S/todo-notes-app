"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/app/ui/button";
import { Shiba } from "@/app/ui/shiba";
import { Main } from "./ui/components/main";
import { useRouter } from "next/navigation";
import styles from "./ui/components/todos/styles.module.css";
import SubscriptionPage from "./subscription/page";
import SubscriptionControls from "./ui/components/SubscriptionControls";

export default function Page() {
  const { data: session } = useSession();
  const [isColored, setColored] = useState(false);
  const [draggingMain, setDraggingMain] = useState(false);
  const [isDashboardChange, setIsDashboardChange] = useState(false);
  const [isKanban, setIsKanban] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Todos");
  const [isOn, setIsOn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null); // Dodana zmienna stanu do sprawdzania subskrypcji
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
  const router = useRouter();

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/subscription/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { isSubscribed, trialEndDate } = await res.json();
      console.log("Subscription status from API:", {
        isSubscribed,
        trialEndDate,
      });
      setIsSubscribed(isSubscribed);
      setTrialEndDate(trialEndDate ? new Date(trialEndDate) : null);
      console.log("Updated state:", { isSubscribed, trialEndDate });
    } catch (error) {
      console.log("Failed to fetch subscription status:", error);
    }
  }, [session]);
  // Pobranie statusu subskrypcji z backendu

  const currentDate = useMemo(() => new Date(), []);

  useEffect(() => {
    console.log("Checking trial end date:", {
      trialEndDate,
      currentDate,
      isSubscribed,
    });
    if (
      session &&
      !isSubscribed &&
      trialEndDate &&
      currentDate > trialEndDate
    ) {
      console.log("Trial ended, redirecting to subscription page.");
      router.push("/subscription"); // Przekierowanie na stronę subskrypcji po zakończeniu okresu próbnego
    }
  }, [session, isSubscribed, trialEndDate, currentDate, router]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

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
      sounds.lampTurn.volume = 0.6;
      if (isOn) {
        sounds.lampTurn.play();
      } else {
        sounds.lampTurnOff.play();
        sounds.lampTurn.pause();
        sounds.lampTurn.currentTime = 0;
      }
    }
  }, [isOn, sounds.lampTurn, sounds.lampTurnOff]);

  const handleButtonColored = () => {
    setColored((prevState) => !prevState);
    const audio = new Audio("/switch/sounds/light-sound.mp3");
    audio.play();
    console.log("COLOR: ", isColored);
  };

  const handleButtonClick = (component: any) => {
    setActiveComponent(component);
    const audio = new Audio("/switch/sounds/switch-light.mp3");
    audio.play();
  };

  const handleButtonDashboardClick = () => {
    setIsDashboardChange((prevState) => !prevState);
    const audio = new Audio("/switch/sounds/switch-light.mp3");
    audio.play();
    console.log("MUSIC: ", isColored);
  };

  const handleKanbanToggle = () => {
    setIsKanban((prevState) => !prevState); // Toggle between Kanban and Todos
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
    console.log("SWITCH:", isOn);
  };

  return (
    <div
      className={`${
        isColored
          ? "bg-[#5cb399] scrollback-second"
          : "bg-[#FFA384] scrollback-first"
      } h-[100vh] w-[100%] overflow-x-hidden relative`}
    >
      {session ? (
        isSubscribed || (trialEndDate && trialEndDate > currentDate) ? (
          <>
            {/* Content for subscribed users */}
            <div
              className={`${
                !isOn
                  ? ""
                  : `${styles.lightSource} fixed inset-0 z-50 pointer-events-none`
              } `}
            ></div>
            <div className="flex justify-around items-center relative z-10">
              <motion.button
                onClick={() => signOut()}
                className={` ${
                  isColored
                    ? "border border-none bg-[#6f6967]"
                    : "border border-[#E98E70] bg-[#6f6967]"
                } font-bold border rounded-full w-[5rem] h-[2.3rem] text-white text-[13px] p-[5px] mt-[14px] hover:bg-[#A42E39] active:bg-activeCTA`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Sign Out
              </motion.button>
              <span className="text-white">Welcome, {session?.user?.name}</span>
              <SubscriptionControls />
              <Button handleButtonColored={handleButtonColored} />
            </div>
            <Shiba
              handleMouseHover={handleMouseHover}
              handleShibaClick={handleShibaClick}
            />
            <div className="relative z-10">
              <div className="flex items-center ml-6 mb-[8px]">
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
                <div className="flex justify-around ml-[6rem] w-[15%]">
                  <button
                    className={`${
                      isColored
                        ? (styles.box4, "bg-[#74BDCB]")
                        : (styles.box3, "bg-[#74BDCB]")
                    } ml-[10%] w-[23px] h-[23px] active:border-[3.5px] border border-[#494544] border-[2px] bg-[#645f5d] rounded-full`}
                    onMouseDown={() => handleButtonClick("Todos")}
                  ></button>
                  <button
                    className={`${
                      isColored
                        ? (styles.box4, "bg-[#fbd8b0]")
                        : (styles.box3, "bg-[#fbd8b0]")
                    } ml-[10%] w-[23px] h-[23px] active:border-[3.5px] border border-[#494544] border-[2px] bg-[#645f5d] rounded-full`}
                    onMouseDown={() => handleButtonClick("Notes")}
                  ></button>
                  <button
                    className={`${
                      isColored
                        ? (styles.box4, "bg-[#c85250]")
                        : (styles.box3, "bg-[#c85250]")
                    } ml-[10%] w-[23px] h-[23px] active:border-[3.5px] border border-[#494544] border-[2px] bg-[#645f5d] rounded-full`}
                    onClick={() => handleButtonClick("Kanban")} // Toggle Kanban view
                  ></button>
                </div>
              </div>
              <Main
                isColored={isColored}
                isDashboardChange={isDashboardChange}
                isKanban={isKanban}
                activeComponent={activeComponent}
              />
            </div>
          </>
        ) : (
          <div>
            <SubscriptionPage
              onTrialStart={fetchSubscriptionStatus}
              trialEndDate={trialEndDate}
            />
          </div>
        )
      ) : (
        <div className=" h-[100%] border flex justify-center items-center">
          <motion.button
            onClick={() => signIn("github")}
            className="rounded-full h-[75px] px-3 py-0.5 bg-secondary"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Sign in
          </motion.button>
        </div>
      )}
    </div>
  );
}
