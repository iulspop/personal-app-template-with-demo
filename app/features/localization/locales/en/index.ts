import type { ResourceLanguage } from "i18next";

import auth from "./auth";
import todos from "./todos";
import translation from "./translation";

export default {
  auth,
  todos,
  translation,
} satisfies ResourceLanguage;
