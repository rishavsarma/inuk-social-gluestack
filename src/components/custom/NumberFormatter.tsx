import { useEffect, useState } from "react";
import { Text } from "../ui/text";

export function AnimatedStatNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    let start: number;
    const duration = 900;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  const display =
    displayed >= 1000
      ? `${(displayed / 1000).toFixed(1).replace(".0", "")}k`
      : String(displayed);

  return (
    <Text className="text-[17px] font-bold text-foreground">{display}</Text>
  );
}
