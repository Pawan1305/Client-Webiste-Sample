const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getItems, getItem, createItem, updateItem, deleteItem, updateStock } = require('../controllers/itemController');

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
router.patch('/:id/stock', protect, updateStock);

module.exports = router;
