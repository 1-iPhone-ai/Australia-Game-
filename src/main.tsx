import { createRoot } from "react-dom/client";
import AustraliaGame from "../(V10.1) australia-game-with-ai.tsx";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root");
}

createRoot(root).render(<AustraliaGame />);
