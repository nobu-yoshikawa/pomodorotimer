import React, { useState, useRef } from "react";
import "./App.css";

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [seconds, setSeconds] = useState(WORK_MINUTES * 60);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        if (isWork) {
          setIsWork(false);
          setSeconds(BREAK_MINUTES * 60);
        } else {
          setIsWork(true);
          setSeconds(WORK_MINUTES * 60);
        }
        return prev;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const resetTimer = () => {
    stopTimer();
    setIsWork(true);
    setSeconds(WORK_MINUTES * 60);
  };

  React.useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  React.useEffect(() => {
    if (seconds === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setTimeout(() => startTimer(), 1000); // 自動で次のタイマーへ
    }
  }, [seconds]);

  return (
    <div className="pomodoro-container">
      <h1 className="pomodoro-title">ポモドーロタイマー</h1>
      <h2 className="pomodoro-mode">{isWork ? "作業時間" : "休憩時間"}</h2>
      <div className="pomodoro-timer">{formatTime(seconds)}</div>
      <div className="pomodoro-buttons">
        <button onClick={startTimer} disabled={isRunning}>スタート</button>
        <button onClick={stopTimer} disabled={!isRunning}>ストップ</button>
        <button onClick={resetTimer}>リセット</button>
      </div>
    </div>
  );
}
