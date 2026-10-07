import { defineConfig } from "@eloqnt/cli";

export default defineConfig({
  srcPath: ".",

  messages: {
    path: "./app/i18n/{locale}",
    locales: "infer",
    sourceLocale: "nl",
    format: "json",
  },
});
