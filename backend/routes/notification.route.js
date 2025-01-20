import express from 'express';
import { protectRoute } from "../middleware/protectRoute.js";
import { getNotifications, deleteNotifications, deleteNotificationById } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getNotifications);
router.delete("/delete", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteNotificationById);

export default router;
