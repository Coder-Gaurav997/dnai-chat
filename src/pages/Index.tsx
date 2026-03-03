import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Menu, Sparkles, Keyboard } from "lucide-react";
import { ChatMessage as ChatMessageType, AVAILABLE_MODELS, Model } from "@/lib/models";
import { ChatConfig, DEFAULT_CONFIG } from "@/lib/config";
import { generateResponse } from "@/lib/huggingface";
import ChatMessage from "@/components/ChatMessage";
import ChatInput, { ChatInputHandle } from "@/components/ChatInput";
import Sidebar from "@/components/Sidebar";
import ExportDialog from "@/components/ExportDialog";
import ThemeToggle from "@/components/ThemeToggle";
import BackgroundEffects from "@/components/BackgroundEffects";
import ShortcutsPanel from "@/components/ShortcutsPanel";
import dnLogo from "@/assets/dn-logo.png";

const Index = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(AVAILABLE_MODELS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  
  const [config, setConfig] = useState<ChatConfig>(DEFAULT_CONFIG);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputHandle>(null);

  const allSuggestions = [
    "Tell me a joke", "What can you do?", "Explain AI simply",
    "Write a short poem", "Fun fact please", "Motivate me today",
    "Summarize quantum physics", "Life advice please", "Make me laugh",
    "Define machine learning", "Inspire me now", "Roast me gently",
    "Explain black holes", "Give coding tips", "Tell a riddle",
  ];
  const [suggestions] = useState(() =>
    allSuggestions.sort(() => Math.random() - 0.5).slice(0, 3)
  );

  const isIntro = messages.length === 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setExportOpen(false);
        setShortcutsOpen(false);
        return;
      }
      if (e.altKey && e.key === "n") {
        e.preventDefault();
        handleNewChat();
      }
      if (e.altKey && e.key === "/") {
        e.preventDefault();
        chatInputRef.current?.focus();
      }
      if (e.altKey && e.key === "e") {
        e.preventDefault();
        if (messages.length > 0) setExportOpen(true);
      }
      if (e.altKey && e.key === ",") {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
      if (e.altKey && e.key === "k") {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        document.querySelector<HTMLButtonElement>('[aria-label="Toggle theme"]')?.click();
      }
      if (e.altKey && e.key === "m") {
        e.preventDefault();
        const currentIdx = AVAILABLE_MODELS.findIndex((m) => m.id === selectedModel.id);
        const nextIdx = (currentIdx + 1) % AVAILABLE_MODELS.length;
        setSelectedModel(AVAILABLE_MODELS[nextIdx]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [messages.length]);

  const handleSend = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const response = await generateResponse(selectedModel, history, config);
      const assistantMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error. The model might be loading — please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => setMessages([]);

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      <BackgroundEffects />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onNewChat={handleNewChat}
        config={config}
        onConfigChange={setConfig}
        onExport={() => setExportOpen(true)}
        hasMessages={messages.length > 0}
      />

      <ExportDialog
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        messages={messages}
      />

      <ShortcutsPanel
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-border/50"
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <img src={dnLogo} alt="DarkNeuronAI" className="w-7 h-7 rounded-full" />
          <span className="font-display font-semibold text-foreground text-sm">DarkNeuronAI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground font-medium">
            {selectedModel.name}
          </div>
          <ThemeToggle />
          <button
            onClick={() => setShortcutsOpen(true)}
            className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <LayoutGroup>
        <div className="flex-1 flex flex-col relative z-10 min-h-0">
          <AnimatePresence mode="wait">
            {isIntro ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col items-center justify-center px-4 gap-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 w-24 h-24 rounded-full gradient-bg opacity-20 blur-xl animate-pulse-glow" />
                   <motion.img
                    src={dnLogo}
                    alt="DarkNeuronAI"
                    className="w-24 h-24 relative z-10 rounded-full border-2 border-border"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  />
                </motion.div>

                <div className="text-center space-y-3">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-5xl font-display font-bold gradient-text"
                  >
                    Hey There!
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="text-lg text-muted-foreground font-body"
                  >
                    Ask me anything — powered by{" "}
                    <span className="gradient-text font-semibold">DarkNeuronAI</span>
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap justify-center gap-2 max-w-lg"
                >
                  {suggestions.map((suggestion, i) => (
                    <motion.button
                      key={suggestion}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      onClick={() => handleSend(suggestion)}
                      className="px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary text-sm text-secondary-foreground transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      {suggestion}
                    </motion.button>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="w-full px-4"
                >
                  <ChatInput ref={chatInputRef} onSend={handleSend} isLoading={isLoading} isIntro />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-none">
                  <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((msg, i) => (
                      <ChatMessage key={msg.id} message={msg} index={i} />
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-card border border-border flex items-center justify-center">
                          <img src={dnLogo} alt="DN" className="w-8 h-8 object-cover rounded-full" />
                        </div>
                        <div className="bg-card border border-border rounded-2xl px-4 py-3 flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-accent"
                              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="flex-shrink-0 px-4 py-4 border-t border-border/50 bg-background/80 backdrop-blur-xl">
                  <ChatInput ref={chatInputRef} onSend={handleSend} isLoading={isLoading} isIntro={false} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>

    </div>
  );
};

export default Index;
