import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-onboarding"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  viteFinal: async (config, { configType }) => {
    // Configure base for GitHub Pages only in build
    if (configType === "PRODUCTION") {
      config.base = "/lane-scheduler-react/";
    }

    return config;
  },
};
export default config;
