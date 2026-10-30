#!/usr/bin/env bash
# Idempotent Cloud Agent install for Aussie Adventure.
# The game is a single TSX file. This script adds a Vite + React runner when
# the repository checkout does not already contain one, then installs npm deps.
set -euo pipefail
cd /workspace

if [ ! -f package.json ]; then
  mkdir -p src
  cat > package.json << 'EOF'
{
  "name": "australia-game",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5173",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0 --port 5173"
  },
  "dependencies": {
    "react": "19.3.1",
    "react-dom": "19.3.1"
  },
  "devDependencies": {
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "@vitejs/plugin-react": "5.2.0",
    "typescript": "5.9.3",
    "vite": "7.3.7"
  }
}
EOF
  cat > vite.config.ts << 'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The game is one self-contained TSX module. Vite only mounts it.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});
EOF
  cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aussie Adventure</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF
  cat > src/main.tsx << 'EOF'
import { createRoot } from "react-dom/client";
import AustraliaGame from "../(V8.2) australia-game-with-ai.tsx";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root");
}

createRoot(root).render(<AustraliaGame />);
EOF
  cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": false,
    "skipLibCheck": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "types": ["vite/client"]
  },
  "include": ["src", "(V8.2) australia-game-with-ai.tsx"]
}
EOF
  if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
node_modules
dist
.DS_Store
EOF
  fi
fi

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
