import { createRoot } from "react-dom/client";
import AustraliaGame from "@standalone/game";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root");
}

createRoot(root).render(<AustraliaGame />);
