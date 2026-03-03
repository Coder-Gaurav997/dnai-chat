import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";

interface ShortcutsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ["Alt", "N"], description: "New Chat" },
  { keys: ["Alt", "/"], description: "Focus Input" },
  { keys: ["Alt", "E"], description: "Export Chat" },
  { keys: ["Alt", ","], description: "Toggle Sidebar" },
  { keys: ["Alt", "K"], description: "Shortcuts Panel" },
  { keys: ["Alt", "T"], description: "Toggle Theme" },
  { keys: ["Alt", "M"], description: "Cycle Model" },
  { keys: ["Esc"], description: "Close Dialogs" },
  { keys: ["Enter"], description: "Send Message" },
  { keys: ["Shift", "Enter"], description: "New Line" },
];

const ShortcutsPanel = ({ isOpen, onClose }: ShortcutsPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed top-16 right-4 w-72 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-accent" />
                <span className="text-sm font-display font-semibold text-foreground">Keyboard Shortcuts</span>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shortcuts List */}
            <div className="p-3 space-y-1.5 max-h-80 overflow-y-auto scrollbar-none">
              {SHORTCUTS.map((shortcut) => (
                <div
                  key={shortcut.description}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-xs text-foreground">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd
                        key={key}
                        className="min-w-[24px] h-5 px-1.5 flex items-center justify-center rounded-md bg-secondary border border-border text-[10px] font-mono font-semibold text-muted-foreground"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShortcutsPanel;
