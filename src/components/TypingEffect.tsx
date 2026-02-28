import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface TypingEffectProps {
  content: string;
  speed?: number;
}

const TypingEffect = ({ content, speed = 12 }: TypingEffectProps) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(content.slice(0, i));
      if (i >= content.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [content, speed, done]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed"
    >
      <ReactMarkdown>{displayed}</ReactMarkdown>
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-middle"
        />
      )}
    </motion.div>
  );
};

export default TypingEffect;
