import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Copy, Check, User } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/lib/models";
import TypingEffect from "@/components/TypingEffect";
import dnLogo from "@/assets/dn-logo.png";

interface ChatMessageProps {
  message: ChatMessageType;
  index: number;
}

const ChatMessage = ({ message, index }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.03, ease: "easeOut" }}
      className={`group flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.03 + 0.05, type: "spring", stiffness: 300, damping: 18 }}
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
          isUser ? "bg-secondary" : "bg-card border border-border"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-secondary-foreground" />
        ) : (
          <img src={dnLogo} alt="DN" className="w-8 h-8 object-cover rounded-full" />
        )}
      </motion.div>

      {/* Message bubble */}
      <div className="relative max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "gradient-bg text-primary-foreground"
              : "bg-card text-card-foreground border border-border"
          }`}
        >
          {isUser ? (
            <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <TypingEffect content={message.content} speed={4} />
          )}
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1 rounded-md bg-muted/80 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
