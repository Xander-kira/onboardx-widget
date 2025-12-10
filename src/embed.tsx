import { createRoot } from "react-dom/client";
import Widget from "./Widget";
import type { WidgetProps } from "./Widget";

declare global {
  interface Window {
    OnboardX?: {
      init: (config: WidgetProps) => void;
    };
  }
}

window.OnboardX = {
  init(config) {
    let container = document.getElementById("onboardx-root");
    if (!container) {
      container = document.createElement("div");
      container.id = "onboardx-root";
      document.body.appendChild(container);
    }

    const root = createRoot(container);
    root.render(<Widget {...config} />);
  },
};
