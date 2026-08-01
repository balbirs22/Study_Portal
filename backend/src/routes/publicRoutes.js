import express from "express";
import { getBranches } from "../controllers/branchController.js";
import { getYears } from "../controllers/yearController.js";
import { getSubjects } from "../controllers/subjectController.js";
import { downloadMaterial, getMaterialsBySubject } from "../controllers/materialController.js";

const router = express.Router();

router.get("/branches", getBranches);
router.get("/years", getYears);
router.get("/subjects", getSubjects);
router.get("/materials", getMaterialsBySubject);
router.get("/materials/:id/download", downloadMaterial);

export default router;
