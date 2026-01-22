import { useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Focus, User } from "lucide-react";

type Status = "focus" | "open";

export const TableTent = () => {
  const [status, setStatus] = useState<Status>("open");

  return (
    <div className={`bento-card transition-all duration-500 ${status === "open" ? "status-open" : "status-focus"}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
          status === "open" ? "bg-primary/30" : "bg-muted"
        }`}>
          {status === "open" ? (
            <Coffee className="w-5 h-5 text-primary" />
          ) : (
            <Focus className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-serif text-foreground">Your Status</h3>
          <p className="text-sm text-muted-foreground">Digital Table Tent</p>
        </div>
      </div>

      {/* Status Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStatus("focus")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
            status === "focus"
              ? "bg-muted text-foreground"
              : "bg-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Focus className="w-4 h-4 inline mr-2" />
          Focus Mode
        </button>
        <button
          onClick={() => setStatus("open")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
            status === "open"
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Coffee className="w-4 h-4 inline mr-2" />
          Open for Coffee
        </button>
      </div>

      {/* Current Status Display */}
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        {status === "open" ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary mx-auto mb-4 flex items-center justify-center"
            >
              <User className="w-8 h-8 text-primary" />
            </motion.div>
            <p className="text-foreground font-medium">You're visible!</p>
            <p className="text-sm text-muted-foreground">Others can invite you for coffee</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-muted border border-border mx-auto mb-4 flex items-center justify-center">
              <Focus className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">Deep work mode</p>
            <p className="text-sm text-muted-foreground">You're invisible to others</p>
          </>
        )}
      </motion.div>
    </div>
  );
};
