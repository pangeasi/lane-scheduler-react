import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    docs: {
      description: {
        component:
          "Lane Scheduler React - A flexible, drag-and-drop scheduler component for React with full TypeScript support.",
      },
    },
  },
};

export default preview;
