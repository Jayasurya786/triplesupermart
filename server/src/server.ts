import { app } from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

async function bootstrap() {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
