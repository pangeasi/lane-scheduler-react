import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-onboarding"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  managerHead: (head) => `
    ${head}
    <base href="/lane-scheduler-react/">
  `,
  viteFinal: async (config) => {
    // Configurar base para GitHub Pages
    if (process.env.NODE_ENV === "production") {
      config.base = "/lane-scheduler-react/";
    }

    // Optimizaciones para producción
    if (process.env.NODE_ENV === "production") {
      config.build = {
        ...config.build,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          ...config.build?.rollupOptions,
          output: {
            ...config.build?.rollupOptions?.output,
            manualChunks: {
              vendor: ["react", "react-dom"],
              storybook: ["@storybook/react", "@storybook/addon-docs"],
            },
          },
        },
      };
    }

    return config;
  },
};
export default config;
