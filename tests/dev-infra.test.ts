import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const gameFile = "(V9.4) australia-game-with-ai.tsx";

describe("standalone game module", () => {
  it("mounts the game through the @standalone/game alias in the Vite shell", () => {
    const main = readFileSync(join(root, "src", "main.tsx"), "utf8");
    expect(main).toContain("@standalone/game");
  });

  it("declares a React-only import surface", () => {
    const source = readFileSync(join(root, gameFile), "utf8");
    const imports = source.match(/^import .+ from .+;$/gm) ?? [];
    expect(imports).toHaveLength(1);
    expect(imports[0]).toMatch(/from ['"]react['"]/);
  });
});

describe("Vite shell", () => {
  it("mounts #root via main.tsx", () => {
    const html = readFileSync(join(root, "index.html"), "utf8");
    expect(html).toContain('id="root"');
    expect(html).toContain("/src/main.tsx");
  });
});
