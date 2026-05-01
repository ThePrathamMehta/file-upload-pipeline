import { Router } from "express";
import mediaRouter from "./media.routes"

const router = Router();

router.use("/media", mediaRouter);

export default router;