import express from "express";
import { ListDocuments, MoveDocument } from '../controllers/documentController';

const router = express.Router();

router.get("/list/:projectId", ListDocuments);
router.post("/move/:sourceProjectId/:destinationProjectId", MoveDocument)

export default router;
