const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Auction = require('../models/Auction');
const Vehicle = require('../models/Vehicle');

// Load environment variables
dotenv.config({ path: './config.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const resetData = async () => {
    try {
        await connectDB();

        console.log('Resetting auction data...');

        // Delete all auctions
        const auctionResult = await Auction.deleteMany({});
        console.log(`Deleted ${auctionResult.deletedCount} auctions`);

        // Reset all vehicles to available status
        const vehicleResult = await Vehicle.updateMany(
            {},
            {
                status: 'available',
                isActive: true
            }
        );
        console.log(`Reset ${vehicleResult.modifiedCount} vehicles to available status`);

        console.log('Database reset successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Reset error:', error);
        process.exit(1);
    }
};

// Run the reset function
resetData(); 