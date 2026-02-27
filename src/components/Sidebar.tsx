import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Plus, Settings, RotateCcw } from "lucide-react";
import { AVAILABLE_MODELS, Model } from "@/lib/models";
import { ChatConfig, DEFAULT_CONFIG } from "@/lib/config";
import { Slider } from "@/components/ui/slider";
import dnLogo from "@/assets/dn-logo.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: Model;
  onSelectModel: (model: Model) => void;
  onNewChat: () => void;
  config: ChatConfig;
  onConfigChange: (config: ChatConfig) => void;
}

const Sidebar = ({ isOpen, onClose, selectedModel, onSelectModel, onNewChat, config, onConfigChange }: SidebarProps) => {
  const updateConfig = (partial: Partial<ChatConfig>) => {
    onConfigChange({ ...config, ...partial });
  };

  return (
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
            className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 flex flex-col overflow-y-auto"
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
            </div>

            {/* Model Selection */}
            <div className="px-3 pb-3">
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

            {/* Configuration */}
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Settings className="w-3.5 h-3.5" />
                Configuration
              </div>

              <div className="space-y-4 px-3">
                {/* System Persona */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">System Persona</label>
                  <textarea
                    value={config.systemPrompt}
                    onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none font-body"
                  />
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Creativity (Temp)</label>
                    <span className="text-xs font-mono text-accent">{config.temperature.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[config.temperature]}
                    onValueChange={([v]) => updateConfig({ temperature: v })}
                    min={0}
                    max={1.5}
                    step={0.1}
                  />
                </div>

                {/* Top P */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Focus (Top P)</label>
                    <span className="text-xs font-mono text-accent">{config.topP.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[config.topP]}
                    onValueChange={([v]) => updateConfig({ topP: v })}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>

                {/* Max Tokens */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Response Length</label>
                    <span className="text-xs font-mono text-accent">{config.maxTokens}</span>
                  </div>
                  <Slider
                    value={[config.maxTokens]}
                    onValueChange={([v]) => updateConfig({ maxTokens: v })}
                    min={16}
                    max={512}
                    step={16}
                  />
                </div>

                {/* Reset */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onConfigChange(DEFAULT_CONFIG)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium text-accent"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Defaults
                </motion.button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto p-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Settings className="w-3.5 h-3.5" />
                Powered by HuggingFace
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
