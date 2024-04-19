import { Router } from "express";
import {
    createInventoryItem,
    getAllInventoryItems,
    getInventoryItemById,
    updateInventoryItem,
    deleteInventoryItem
} from "../controllers/inventory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route for creating a new inventory item
router.route("/").post(verifyJWT, createInventoryItem);

// Route for getting all inventory items
router.route("/").get(getAllInventoryItems);

// Route for getting an inventory item by ID
router.route('/:id').get(getInventoryItemById);

// Route for updating an inventory item
router.route('/:id').put(verifyJWT, updateInventoryItem);

// Route for deleting an inventory item
router.route('/:id').delete(verifyJWT, deleteInventoryItem);

export default router;