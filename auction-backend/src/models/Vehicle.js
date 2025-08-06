const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    runNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    vin: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    make: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    trim: {
        type: String,
        trim: true
    },
    mileage: {
        type: Number,
        required: true,
        min: 0
    },
    mileageType: {
        type: String,
        enum: ['ACTUAL', 'EXEMPT', 'NOT_ACTUAL'],
        default: 'ACTUAL'
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    seller: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    startingBid: {
        type: Number,
        required: true,
        min: 0
    },
    bidIncrement: {
        type: Number,
        required: true,
        min: 1
    },
    reservePrice: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ['available', 'in_auction', 'sold', 'no_sale'],
        default: 'available'
    },
    condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor'],
        default: 'good'
    },
    features: [{
        type: String,
        trim: true
    }],
    // Additional vehicle specifications
    engine: {
        type: String,
        trim: true
    },
    transmission: {
        type: String,
        trim: true
    },
    drivetrain: {
        type: String,
        enum: ['FWD', 'RWD', 'AWD', '4WD'],
        trim: true
    },
    fuelType: {
        type: String,
        enum: ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid'],
        default: 'Gasoline'
    },
    fuelEconomy: {
        city: {
            type: Number,
            min: 0
        },
        highway: {
            type: Number,
            min: 0
        }
    },
    cylinders: {
        type: Number,
        min: 0
    },
    displacement: {
        type: String,
        trim: true
    },
    horsepower: {
        type: Number,
        min: 0
    },
    torque: {
        type: Number,
        min: 0
    },
    exteriorColor: {
        type: String,
        trim: true
    },
    interiorColor: {
        type: String,
        trim: true
    },
    bodyStyle: {
        type: String,
        enum: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Wagon', 'Hatchback', 'Van'],
        trim: true
    },
    doors: {
        type: Number,
        min: 2,
        max: 5
    },
    seats: {
        type: Number,
        min: 2,
        max: 15
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
vehicleSchema.index({ status: 1, isActive: 1 });
vehicleSchema.index({ runNumber: 1 });
vehicleSchema.index({ vin: 1 });

// Virtual for full vehicle name
vehicleSchema.virtual('fullName').get(function () {
    return `${this.year} ${this.make} ${this.model} ${this.trim}`.trim();
});

module.exports = mongoose.model('Vehicle', vehicleSchema); 