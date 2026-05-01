import { Router } from "express";
import mediaRouter from "./media.routes"

const router = Router();

router.post("/media", mediaRouter);

export default router;