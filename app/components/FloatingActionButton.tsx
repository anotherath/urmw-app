"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function FloatingActionButton() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <button
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 pointer-events-auto",
          isPressed ? "scale-90 bg-primary-dark shadow-primary/30" : "scale-100 bg-primary hover:bg-primary-dark shadow-primary/40 hover:-translate-y-1"
        )}
      >
        <Plus size={28} className={cn("transition-transform duration-300", isPressed && "rotate-90")} />
      </button>
    </div>
  );
}
