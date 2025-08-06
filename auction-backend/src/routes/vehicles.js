const express = require('express');
const {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/vehicles
// @desc    Get all available vehicles
// @access  Public
router.get('/', getVehicles);

// @route   GET /api/vehicles/:id
// @desc    Get vehicle by ID
// @access  Public
router.get('/:id', getVehicleById);

// @route   POST /api/vehicles
// @desc    Create vehicle (Admin only)
// @access  Private (Admin)
router.post('/', adminAuth, createVehicle);

// @route   PUT /api/vehicles/:id
// @desc    Update vehicle (Admin only)
// @access  Private (Admin)
router.put('/:id', adminAuth, updateVehicle);

// @route   DELETE /api/vehicles/:id
// @desc    Delete vehicle (Admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuth, deleteVehicle);

module.exports = router; 