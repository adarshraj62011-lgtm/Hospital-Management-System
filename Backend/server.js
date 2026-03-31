import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./database/connection.js";
import { ensureStorage } from "./database/store.js";

const port = process.env.PORT || 4000;

await connectDB();
await ensureStorage();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
