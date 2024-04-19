import { InventoryItem } from '../models/inventory.model.js';
import QRCode from "qrcode"; // For QR code regeneration 

// Create inventory item
const createInventoryItem = async (req, res) => {
    try {
      const { component, name, partNumber, dateReceived, balanceItems } = req.body; // Changed quantity to balanceItems
  
      // Create new InventoryItem instance
      const newInventoryItem = new InventoryItem({
        component,
        name,
        partNumber,
        dateReceived,
        balanceItems, // Using balanceItems from the request body
      });
  
      // Save the new InventoryItem to the database
      const savedItem = await newInventoryItem.save();
  
      let qrCodeData;
      if (process.env.GENERATE_QR_ON_UPDATE) {
        // Generate QR code using the qrIdentifier from savedItem
        qrCodeData = await QRCode.toDataURL(savedItem.qrIdentifier);
      }
  
      res.status(201).json({
        message: 'Inventory item created successfully!',
        data: { ...savedItem._doc, qrCodeData }, // Include qrCodeData in the response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error while creating inventory' });
    }
  };

// Get all inventory items
const getAllInventoryItems = async (req, res) => {
  try {
    //find all items
    const inventoryItems = await InventoryItem.find();
    // If no inventoryItems are found, send a 404 error response
    if(inventoryItems.length === 0 ){
        return res.status(404).json({message : "Items not Found."})
    }
    res.status(200).json({ data: inventoryItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while finding inventoryitems' });
  }
};

// Get inventory item by ID
const getInventoryItemById = async (req, res) => {
  try {
    const inventoryItem = await InventoryItem.findById(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(200).json({ data: inventoryItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while finding inventoryitem' });
  }
};

// Update inventory item
const updateInventoryItem = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      // Validate allowed updates (excluding qrCode)
      const allowedUpdates = ['component', 'name', 'partNumber', 'dateReceived', 'balanceItems'];
      const isValidUpdate = Object.keys(updates).every((update) => allowedUpdates.includes(update));
      if (!isValidUpdate) {
        return res.status(400).json({ message: 'Invalid update fields' });
      }
  
      // Find and update the InventoryItem
      const updatedInventoryItem = await InventoryItem.findByIdAndUpdate(id, updates, {
        new: true, // Return the updated document
        runValidators: true // Validate the updated document against the schema
      });
  
      if (!updatedInventoryItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
  
      // Generate new QR code on update
      let qrCodeData;
      if (process.env.GENERATE_QR_ON_UPDATE) {
        // Generate QR code using the qrIdentifier from updatedInventoryItem
        qrCodeData = await QRCode.toDataURL(updatedInventoryItem.qrIdentifier);
      }
  
      res.status(200).json({
        message: 'Inventory item updated successfully!',
        data: { ...updatedInventoryItem._doc, qrCodeData },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedInventoryItem = await InventoryItem.findByIdAndDelete(id);
  
      if (!deletedInventoryItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
  
      res.status(200).json({ message: 'Inventory item deleted successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error})
    }
}

export {
    createInventoryItem,
    getAllInventoryItems,
    getInventoryItemById,
    updateInventoryItem,
    deleteInventoryItem
}