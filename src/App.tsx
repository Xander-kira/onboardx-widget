import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AnalyticsEventType =
  | "tour_started"
  | "tour_resumed"
  | "tour_completed"
  | "tour_skipped"
  | "tour_closed"
  | "step_started"
  | "step_completed";

type TourStep = {
  id: string;
  title: string;
  body: string;
};

type StoredState = {
  currentStep: number;
  completed: boolean;
};

const TOUR_ID = "welcome-tour";
const DEMO_USER_ID = "demo-user";
const STORAGE_KEY = "onboardx_tour_state";

const STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to your workspace",
    body: "This short 5-step tour will show you where everything lives so you can feel at home in seconds.",
  },
  {
    id: "nav",
    title: "Navigation & main sections",
    body: "Use the left sidebar to move between your dashboard, tours, analytics and settings. Think of it as your product’s main map.",
  },
  {
    id: "actions",
    title: "Create tours and see results",
    body: "The quick action cards help you add new tours, view performance and copy your embed code. Gold buttons are your primary actions.",
  },
  {
    id: "shortcuts",
    title: "Search, shortcuts & recent activity",
    body: "Use the search bar to jump straight to tours, products or customers, and use the cards below to review what’s been happening recently.",
  },
  {
    id: "finish",
    title: "You’re ready to explore",
    body: "That’s it for now. You can re-open this tour anytime from the glowing bubble in the corner if you need a quick refresher.",
  },
];

function persistState(state: StoredState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

function loadStoredState(): StoredState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (
      typeof parsed.currentStep === "number" &&
      parsed.currentStep >= 0 &&
      parsed.currentStep < STEPS.length
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function logEvent(type: AnalyticsEventType, stepIndex?: number) {
  const index =
    typeof stepIndex === "number"
      ? Math.max(0, Math.min(stepIndex, STEPS.length - 1))
      : 0;

  const step = STEPS[index];

  const payload = {
    tour_id: TOUR_ID,
    step_id: step?.id ?? null,
    step_index: index,
    event_type: type,
    user_id: DEMO_USER_ID,
  };

  // Simple console analytics (no backend)
  // This is what you saw in DevTools earlier.
  // In a real app, this is where you’d send to Supabase / Convex etc.
  // For HNG, console logging is enough.
  // eslint-disable-next-line no-console
  console.log("[OnboardX analytics]", {
    ...payload,
    timestamp: new Date().toISOString(),
  });
}

function App() {
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasProgress, setHasProgress] = useState(false);

  // Load saved progress from localStorage
  useEffect(() => {
    const stored = loadStoredState();
    if (stored && !stored.completed) {
      setCurrentStep(stored.currentStep);
      setHasProgress(true);
    }
  }, []);

  // Helpers
  const activeSteps = STEPS;
  const step = activeSteps[currentStep];
  const progressPercent = ((currentStep + 1) / activeSteps.length) * 100;

  const isNavHighlighted = step.id === "nav";
  const isActionsHighlighted = step.id === "actions";
  const isShortcutsHighlighted = step.id === "shortcuts";

  // Handlers
  const handleLauncherClick = () => {
    if (isIntroOpen || isTourOpen) return;

    if (hasProgress) {
      setIsTourOpen(true);
      logEvent("tour_resumed", currentStep);
      logEvent("step_started", currentStep);
      return;
    }

    setIsIntroOpen(true);
  };

  const startTour = () => {
    setIsIntroOpen(false);
    setIsTourOpen(true);
    setHasProgress(true);
    setCurrentStep(0);
    persistState({ currentStep: 0, completed: false });
    logEvent("tour_started", 0);
    logEvent("step_started", 0);
  };

  const handleSkip = () => {
    setIsTourOpen(false);
    logEvent("tour_skipped", currentStep);
    persistState({ currentStep, completed: false });
  };

  const handleClose = () => {
    setIsTourOpen(false);
    logEvent("tour_closed", currentStep);
    persistState({ currentStep, completed: false });
  };

  const handleNext = () => {
    const isLastStep = currentStep === activeSteps.length - 1;

    if (isLastStep) {
      logEvent("step_completed", currentStep);
      logEvent("tour_completed", currentStep);
      setIsTourOpen(false);
      setHasProgress(false);
      persistState({
        currentStep: activeSteps.length - 1,
        completed: true,
      });
      return;
    }

    const nextIndex = currentStep + 1;
    logEvent("step_completed", currentStep);
    setCurrentStep(nextIndex);
    logEvent("step_started", nextIndex);
    persistState({ currentStep: nextIndex, completed: false });
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    const prevIndex = currentStep - 1;
    setCurrentStep(prevIndex);
    logEvent("step_started", prevIndex);
    persistState({ currentStep: prevIndex, completed: false });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Fake host dashboard layout */}
      <div className="grid gap-6 md:grid-cols-[220px,1fr] max-w-5xl mx-auto">
        {/* Left nav */}
        <div
          className={`rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-4 ${
            isNavHighlighted
              ? "ring-2 ring-amber-300/80 shadow-[0_0_40px_rgba(251,191,36,0.4)]"
              : ""
          } transition-all duration-400 ease-out`}
        >
          <div className="h-8 w-24 rounded-full bg-slate-700/80" />
          <div className="space-y-2 text-xs">
            <div className="h-6 rounded-full bg-slate-800/80 w-3/4" />
            <div className="h-6 rounded-full bg-slate-800/60 w-2/3" />
            <div className="h-6 rounded-full bg-slate-800/60 w-4/5" />
            <div className="h-6 rounded-full bg-slate-800/40 w-1/2" />
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-4">
          {/* Top bar */}
          <div
            className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 ${
              isShortcutsHighlighted
                ? "ring-2 ring-sky-400/80 shadow-[0_0_40px_rgba(56,189,248,0.4)]"
                : ""
            } transition-all duration-400 ease-out`}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-300 to-sky-400" />
              <div>
                <p className="text-xs text-slate-400">Good afternoon</p>
                <p className="text-sm font-semibold text-white">
                  OnboardX Demo
                </p>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-2 md:max-w-md">
              <div className="flex flex-1 items-center gap-2 rounded-full bg-slate-950/60 px-3 py-1.5 border border-white/10">
                <div className="h-4 w-4 rounded-full bg-slate-600" />
                <input
                  disabled
                  className="flex-1 bg-transparent text-[11px] text-slate-400 outline-none"
                  placeholder="Search products, tours, customers..."
                />
              </div>
              <div className="hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80" />
            </div>
          </div>

          {/* Quick actions */}
          <div
            className={`grid gap-3 md:grid-cols-3 ${
              isActionsHighlighted
                ? "ring-2 ring-amber-300/80 rounded-2xl p-2 shadow-[0_0_40px_rgba(251,191,36,0.3)] bg-slate-900/40"
                : ""
            } transition-all duration-400 ease-out`}
          >
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-200">
                Add new tour
              </p>
              <p className="text-[11px] text-slate-400">
                Create a fresh onboarding flow with at least 5 steps.
              </p>
              <button className="rounded-full bg-amber-300 px-3 py-1.5 text-[11px] font-semibold text-slate-950">
                New tour
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-200">
                View analytics
              </p>
              <p className="text-[11px] text-slate-400">
                See how many users finish, skip or drop-off.
              </p>
              <div className="h-2 rounded-full bg-slate-800">
                <div className="h-full w-2/3 rounded-full bg-emerald-400" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-200">
                Copy embed code
              </p>
              <p className="text-[11px] text-slate-400">
                Grab the script tag for your docs or marketing site.
              </p>
              <div className="h-7 rounded-md bg-slate-800/70" />
            </div>
          </div>

          {/* Lower section */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-2">
              <div className="h-4 w-28 rounded-full bg-slate-700" />
              <div className="h-24 rounded-xl bg-slate-800/70" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-2">
              <div className="h-4 w-20 rounded-full bg-slate-700" />
              <div className="space-y-2">
                <div className="h-3 rounded-full bg-slate-800/80 w-5/6" />
                <div className="h-3 rounded-full bg-slate-800/60 w-2/3" />
                <div className="h-3 rounded-full bg-slate-800/40 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Launcher bubble */}
      <button
        onClick={handleLauncherClick}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-sky-400 to-indigo-500 shadow-xl shadow-sky-900/40 ring-2 ring-amber-300/60 hover:scale-105 transition-transform"
        aria-label="Open onboarding tour"
      >
        <span className="text-xl">✨</span>
      </button>

      {/* Resume chip */}
      {hasProgress && !isTourOpen && !isIntroOpen && (
        <div className="fixed bottom-24 right-6 rounded-full bg-slate-900/90 px-3 py-1 text-[11px] text-slate-200 border border-white/10">
          Resume tour from step {currentStep + 1}
        </div>
      )}

      {/* Intro card */}
      <AnimatePresence>
        {isIntroOpen && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-6 w-[320px] rounded-2xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl backdrop-blur"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-300 to-sky-400 flex items-center justify-center text-sm font-semibold text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.6)]"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                XO
              </motion.div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Quick tour
                </p>
                <p className="text-xs text-slate-300">
                  A friendly walkthrough of your main workspace.
                </p>
              </div>
            </div>

            <p className="mt-1 text-xs text-slate-300">
              Let&apos;s do a fast 5-step walkthrough so you know exactly where
              everything lives.
            </p>

            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={startTour}
                className="rounded-full bg-amber-300 px-3 py-1.5 text-[11px] font-semibold text-slate-950 hover:bg-amber-200"
              >
                Start tour
              </button>
              <button
                onClick={() => setIsIntroOpen(false)}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour card */}
      <AnimatePresence>
        {isTourOpen && (
          <motion.div
            key="tour"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-6 w-[340px] rounded-2xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl backdrop-blur"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-300 to-sky-400 flex items-center justify-center text-[11px] font-semibold text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.6)]"
                  animate={{ y: [0, -1.5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                >
                  XO
                </motion.div>

                <div>
                  <p className="text-[11px] font-semibold text-amber-300">
                    Step {currentStep + 1} of {activeSteps.length}
                  </p>
                  <p className="text-[10px] text-slate-400">OnboardX Guide</p>
                </div>
              </div>

              <button
                className="text-[11px] text-slate-400 hover:text-slate-200"
                onClick={handleSkip}
              >
                Skip tour
              </button>
            </div>

            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amber-300 transition-[width]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <h2 className="text-sm font-semibold text-white">{step.title}</h2>
            <p className="mt-1 text-xs text-slate-300">{step.body}</p>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`rounded-full border border-white/15 px-3 py-1.5 text-[11px] ${
                  currentStep === 0
                    ? "text-slate-500 opacity-60"
                    : "text-slate-200 hover:border-slate-100"
                }`}
              >
                Back
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={handleNext}
                  className="rounded-full bg-amber-300 px-3 py-1.5 text-[11px] font-semibold text-slate-950 hover:bg-amber-200"
                >
                  {currentStep === activeSteps.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
