const Vehicle = require('../models/Vehicle');

// @desc    Get all available vehicles
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({
            isActive: true
        }).sort({ runNumber: 1 });

        res.json(vehicles);
    } catch (error) {
        console.error('Get vehicles error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json(vehicle);
    } catch (error) {
        console.error('Get vehicle by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create vehicle (Admin only)
// @route   POST /api/vehicles
// @access  Private (Admin)
const createVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();

        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Create vehicle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update vehicle (Admin only)
// @route   PUT /api/vehicles/:id
// @access  Private (Admin)
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json(vehicle);
    } catch (error) {
        console.error('Update vehicle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete vehicle (Admin only)
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Delete vehicle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
}; 