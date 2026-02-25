import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ChatMessage as ChatMessageType } from "@/lib/models";
import dnLogo from "@/assets/dn-logo.png";

interface ChatMessageProps {
  message: ChatMessageType;
  index: number;
}

const ChatMessage = ({ message, index }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05 + 0.1, type: "spring", stiffness: 200 }}
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
          isUser ? "bg-secondary" : ""
        }`}
      >
        {isUser ? (
          <span className="text-sm font-display font-semibold text-secondary-foreground">U</span>
        ) : (
          <img src={dnLogo} alt="DN" className="w-8 h-8 object-cover" />
        )}
      </motion.div>

      {/* Message bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "gradient-bg text-primary-foreground"
            : "bg-card text-card-foreground border border-border"
        }`}
      >
        <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
