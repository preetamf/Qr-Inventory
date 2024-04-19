import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid'; //for qr generation


const inventorySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        partNumber: {
            type: String,
            required: true
        },
        dateReceived: {
            type: Date,
            required: true
        },
        dateDispatch: {
            type: Date
        },
        balanceItems: {
            type: Number,
            required: true,
            default: 0
        },
        component: {
            type: String,
            enum: ['C1', 'C2', 'C3', 'C4', 'C5'],
            required: true
        },
        qrIdentifier: {
            type: String,
            unique: true,
            required: true,
            default: uuidv4,
        }
    }
)

export const InventoryItem = mongoose.model("InventoryItem", inventorySchema )