import { reactRouter } from "@react-router/dev/vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import devtoolsJson from "vite-plugin-devtools-json"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    !process.env.VITEST && !process.env.STORYBOOK && reactRouter(),
    devtoolsJson(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          include: ["app/**/*.test.ts"],
          name: "unit-tests",
        },
      },
      {
        extends: true,
        test: {
          fileParallelism: false,
          include: ["app/**/*.spec.ts"],
          name: "integration-tests",
          setupFiles: ["app/test/setup-server-test-environment.ts"],
        },
      },
      {
        extends: true,
        test: {
          environment: "happy-dom",
          include: ["app/**/*.test.tsx"],
          name: "react-happy-dom-tests",
          setupFiles: ["app/test/setup-browser-test-environment.ts"],
        },
      },
    ],
  },
})
