import { spawn } from "node:child_process";

const tasks = [
  ["dev:web", "web"],
  ["dev:api", "api"]
];

const children = tasks.map(([script, name]) => {
  const child = spawn("npm", ["run", script], {
    stdio: "inherit",
    shell: true,
    env: process.env
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      for (const c of children) {
        if (!c.killed) c.kill();
      }
      process.exit(code);
    }
  });

  return child;
});

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
