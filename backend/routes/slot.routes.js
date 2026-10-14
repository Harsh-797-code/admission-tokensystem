import { Router } from "express";
import {
  createSlot,
  getSlots,
} from "../controllers/slot.controller.js";

const router = Router();

router.post("/", createSlot);
router.get("/", getSlots);

export default router;