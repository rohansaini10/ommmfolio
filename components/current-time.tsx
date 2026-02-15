"use client";

import { useEffect, useState } from "react";

const IST_TIME_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

const getCurrentIstTime = () => IST_TIME_FORMATTER.format(new Date());

type CurrentTimeProps = {
  className?: string;
};

export function CurrentTime({ className }: CurrentTimeProps) {
  const [time, setTime] = useState("00:00:00 am");

  useEffect(() => {
    setTime(getCurrentIstTime());
    const timerId = window.setInterval(() => {
      setTime(getCurrentIstTime());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return <h4 className={className}>{time}</h4>;
}
