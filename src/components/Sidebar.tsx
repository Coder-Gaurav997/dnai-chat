import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Plus, Settings, Download } from "lucide-react";
import { AVAILABLE_MODELS, Model } from "@/lib/models";
import { ChatConfig } from "@/lib/config";
import ConfigPanel from "@/components/ConfigPanel";
import dnLogo from "@/assets/dn-logo.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: Model;
  onSelectModel: (model: Model) => void;
  onNewChat: () => void;
  config: ChatConfig;
  onConfigChange: (config: ChatConfig) => void;
  onExport: () => void;
  hasMessages: boolean;
}

const Sidebar = ({ isOpen, onClose, selectedModel, onSelectModel, onNewChat, config, onConfigChange, onExport, hasMessages }: SidebarProps) => {
  const [configOpen, setConfigOpen] = useState(false);

  return (
    <>
      <ConfigPanel
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
        config={config}
        onConfigChange={onConfigChange}
      />
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          />

          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <img src={dnLogo} alt="DarkNeuronAI" className="w-8 h-8 rounded-full" />
                <span className="font-display font-semibold text-foreground">DarkNeuronAI</span>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* New Chat */}
            <div className="p-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onNewChat(); onClose(); }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </motion.button>
              {hasMessages && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onClose(); onExport(); }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground"
                >
                  <Download className="w-4 h-4" />
                  Export Chat
                </motion.button>
              )}
            </div>

            {/* Model Selection */}
            <div className="px-3 pb-3 flex-1">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Cpu className="w-3.5 h-3.5" />
                Select Model
              </div>
              <div className="space-y-1">
                {AVAILABLE_MODELS.map((model) => (
                  <motion.button
                    key={model.id}
                    whileHover={{ x: 4 }}
                    onClick={() => onSelectModel(model)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                      selectedModel.id === model.id
                        ? "gradient-bg-subtle border border-primary/30 text-foreground"
                        : "hover:bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{model.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onClose(); setConfigOpen(true); }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground"
              >
                <Settings className="w-4 h-4 text-accent" />
                Configuration
              </motion.button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                <Cpu className="w-3.5 h-3.5" />
                Powered by DarkNeuronAI
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </>
  );
};

export default Sidebar;
