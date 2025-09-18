import { type Express } from "express";
import http from "http";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import feeRoutes from "./routes/fee.routes";

export async function registerRoutes(app: Express) {
  const server = http.createServer(app);

  // Enable CORS
  app.use(cors());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/fees', feeRoutes);

  // Default error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
  });

  return server;
}