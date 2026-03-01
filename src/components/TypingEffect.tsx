import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface TypingEffectProps {
  content: string;
  speed?: number;
}

const TypingEffect = ({ content, speed = 4 }: TypingEffectProps) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    let i = 0;
    const step = () => {
      // Reveal multiple chars per frame for speed
      const charsPerTick = Math.max(2, Math.ceil(content.length / 200));
      i = Math.min(i + charsPerTick, content.length);
      setDisplayed(content.slice(0, i));
      if (i >= content.length) {
        setDone(true);
      } else {
        timer = setTimeout(step, speed);
      }
    };
    let timer = setTimeout(step, speed);
    return () => clearTimeout(timer);
  }, [content, speed, done]);

  return (
    <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed">
      <ReactMarkdown>{displayed}</ReactMarkdown>
    </div>
  );
};

export default TypingEffect;
