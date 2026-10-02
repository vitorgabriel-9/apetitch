import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDatabase } from "./config/database";
import restaurantRoutes from "./routes/restaurantRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/restaurants", restaurantRoutes);

const PORT = 3000;

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();