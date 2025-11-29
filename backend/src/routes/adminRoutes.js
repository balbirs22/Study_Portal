import express from "express";
import { auth } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import upload from "../middleware/upload.js";
import {
  createBranch,
  deleteBranch,
} from "../controllers/branchController.js";
import {
  createYear,
  deleteYear,
} from "../controllers/yearController.js";
import {
  createSubject,
  deleteSubject,
} from "../controllers/subjectController.js";
import {
  uploadMaterial,
  uploadMultipleMaterials,
  getAllMaterials,
  deleteMaterial,
} from "../controllers/materialController.js";

const router = express.Router();

router.post("/branches", auth, isAdmin, createBranch);
router.delete("/branches/:id", auth, isAdmin, deleteBranch);

router.post("/years", auth, isAdmin, createYear);
router.delete("/years/:id", auth, isAdmin, deleteYear);

router.post("/subjects", auth, isAdmin, createSubject);
router.delete("/subjects/:id", auth, isAdmin, deleteSubject);

router.get("/materials", auth, isAdmin, getAllMaterials);
router.delete("/materials/:id", auth, isAdmin, deleteMaterial);

router.post(
  "/materials",
  auth,
  isAdmin,
  upload.single("file"),
  uploadMaterial
);

router.post(
  "/materials/multiple",
  auth,
  isAdmin,
  upload.array("files", 10),
  uploadMultipleMaterials
);


export default router;
