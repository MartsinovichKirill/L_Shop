import { createApp } from "./app.js";
import { env } from "./env.js";
import { initDataFiles } from "./storage/initData.js";

async function main(): Promise<void> {
  await initDataFiles();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
