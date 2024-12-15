import { useEffect, useState, useMemo, useCallback } from "react";

interface CountdownTimerProps {
  eventDate: string;
  eventTime: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({
  eventDate,
  eventTime,
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [error, setError] = useState<string>("");

  const targetDate = useMemo(() => {
    try {
      const dateMatch = eventDate.match(/\d{2}\.\d{2}\.\d{4}/);
      if (!dateMatch) throw new Error("Ungültiges Datum");

      const [day, month, year] = dateMatch[0].split(".").map(Number);
      const isoDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      const timeMatch = eventTime.match(/T(\d{2}:\d{2}:\d{2})/);
      if (!timeMatch) throw new Error("Ungültige Zeit");

      return new Date(`${isoDate}T${timeMatch[1]}`);
    } catch (error) {
      setError("Ungültiges Datum/Zeit");
      return null;
    }
  }, [eventDate, eventTime]);

  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return;

    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (isNaN(diff) || diff < 0) {
      setError("Event bereits gestartet");
      return;
    }

    setTimeLeft({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    });
  }, [targetDate]);

  useEffect(() => {
    if (!targetDate) return;

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate, calculateTimeLeft]);

  if (error) return <span>{error}</span>;

  return (
    <span>
      {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
    </span>
  );
};
