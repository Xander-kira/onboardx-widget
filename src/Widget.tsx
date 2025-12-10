import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type TourStep = {
  id: string;
  title: string;
  body: string;
};

export type WidgetProps = {
  steps: TourStep[];
  onEvent?: (e: 
    | { type: "widget_loaded"; timestamp: number }
    | { type: "tour_started"; step: number }
    | { type: "tour_completed" }
    | { type: "step_started"; step: number }
  ) => void;
};

export default function Widget({ steps, onEvent }: WidgetProps) {
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    onEvent?.({ type: "widget_loaded", timestamp: Date.now() });
  }, []);

  const startTour = () => {
    setIsIntroOpen(false);
    setIsTourOpen(true);
    onEvent?.({ type: "tour_started", step: 0 });
  };

  const next = () => {
    if (currentStep === steps.length - 1) {
      onEvent?.({ type: "tour_completed" });
      setIsTourOpen(false);
      return;
    }
    setCurrentStep((i) => i + 1);
    onEvent?.({ type: "step_started", step: currentStep + 1 });
  };

  return (
    <div className="fixed bottom-10 right-10 z-[999999]">
      {/* Floating bubble */}
      {!isIntroOpen && !isTourOpen && (
        <button
          onClick={() => setIsIntroOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-300 via-sky-400 to-indigo-500 shadow-xl flex items-center justify-center"
        >
          ✨
        </button>
      )}

      {/* Intro */}
      <AnimatePresence>
        {isIntroOpen && (
          <motion.div
            className="w-[300px] bg-slate-900 text-white p-4 rounded-xl shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-semibold text-sm">Bright product tours</h2>
            <p className="text-xs mt-1">Let’s do a quick tour.</p>

            <button
              onClick={startTour}
              className="mt-3 bg-amber-300 text-black px-3 py-1.5 rounded-full text-xs"
            >
              Start tour
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour */}
      <AnimatePresence>
        {isTourOpen && (
          <motion.div
            className="w-[320px] bg-slate-900 text-white p-4 rounded-xl shadow-xl mt-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[11px] text-amber-300">
              Step {currentStep + 1} of {steps.length}
            </p>

            <h2 className="font-semibold text-sm mt-1">
              {steps[currentStep].title}
            </h2>
            <p className="text-xs mt-1">{steps[currentStep].body}</p>

            <button
              onClick={next}
              className="mt-3 bg-amber-300 text-black px-3 py-1.5 rounded-full text-xs"
            >
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
