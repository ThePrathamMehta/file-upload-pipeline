import express from "express";
import type { Request, Response, NextFunction, Application } from "express";
import globalRouter from "./routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "alive",
  });
});

app.use("/api",globalRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server Running on PORT",process.env.PORT!);
});
