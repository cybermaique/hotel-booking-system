// layers/design-system/nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const layerDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  components: {
    dirs: [
      { path: resolve(layerDir, "components/atoms"), prefix: "Atom" },
      { path: resolve(layerDir, "components/molecules"), prefix: "Molecule" },
      { path: resolve(layerDir, "components/organisms"), prefix: "Organism" },
    ],
  },
});
