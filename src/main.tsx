import { createRoot } from "react-dom/client";
import AustraliaGame from "../(V9.4) australia-game-with-ai.tsx";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root");
}

createRoot(root).render(<AustraliaGame />);
