import express from "express";
import { ListProjects, ListDocTypes } from '../controllers/projectController';

const router = express.Router();

router.get("/list", ListProjects);
router.get("/doctype/:projectId", ListDocTypes);

export default router;
