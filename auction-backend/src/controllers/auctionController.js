const Auction = require('../models/Auction');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// @desc    Get current active auction
// @route   GET /api/auctions/current
// @access  Public
const getCurrentAuction = async (req, res) => {
    try {
        const auction = await Auction.findOne({
            status: 'active',
            isActive: true
        }).populate('vehicle');

        if (!auction) {
            return res.status(404).json({ message: 'No active auction found' });
        }

        res.json(auction);
    } catch (error) {
        console.error('Get current auction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Start auction (Admin only)
// @route   POST /api/auctions/start
// @access  Private (Admin)
const startAuction = async (req, res) => {
    try {
        const { vehicleId, duration = 300000 } = req.body; // 5 minutes default

        // Check if there's already an active auction
        const activeAuction = await Auction.findOne({
            status: 'active',
            isActive: true
        });

        if (activeAuction) {
            return res.status(400).json({
                message: 'There is already an active auction. Please end it first.'
            });
        }

        // Get vehicle
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        if (vehicle.status !== 'available') {
            return res.status(400).json({
                message: 'Vehicle is not available for auction'
            });
        }

        // Create auction
        const auction = new Auction({
            vehicle: vehicleId,
            currentBid: vehicle.startingBid,
            bidIncrement: vehicle.bidIncrement,
            status: 'active',
            startTime: new Date(),
            endTime: new Date(Date.now() + duration),
            duration,
            reservePrice: vehicle.reservePrice
        });

        await auction.save();

        // Update vehicle status
        vehicle.status = 'in_auction';
        await vehicle.save();

        // Populate vehicle data
        await auction.populate('vehicle');

        res.status(201).json(auction);
    } catch (error) {
        console.error('Start auction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Place bid
// @route   POST /api/auctions/bid
// @access  Private
const placeBid = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user._id;

        // Get current auction
        const auction = await Auction.findOne({
            status: 'active',
            isActive: true
        });

        if (!auction) {
            return res.status(404).json({ message: 'No active auction found' });
        }

        // Check if bid is valid
        const nextBidAmount = auction.currentBid + auction.bidIncrement;
        if (amount < nextBidAmount) {
            return res.status(400).json({
                message: `Minimum bid amount is $${nextBidAmount.toLocaleString()}`
            });
        }

        // Add bid
        await auction.addBid(userId, `${req.user.firstName} ${req.user.lastName}`, amount);

        // Process max bids
        await auction.processMaxBids();

        // Populate vehicle data
        await auction.populate('vehicle');

        res.json(auction);
    } catch (error) {
        console.error('Place bid error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Set max bid
// @route   POST /api/auctions/max-bid
// @access  Private
const setMaxBid = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user._id;

        // Get current auction
        const auction = await Auction.findOne({
            status: 'active',
            isActive: true
        });

        if (!auction) {
            return res.status(404).json({ message: 'No active auction found' });
        }

        // Check if max bid is valid
        const nextBidAmount = auction.currentBid + auction.bidIncrement;
        if (amount < nextBidAmount) {
            return res.status(400).json({
                message: `Maximum bid must be at least $${nextBidAmount.toLocaleString()}`
            });
        }

        // Add max bid
        await auction.addMaxBid(userId, `${req.user.firstName} ${req.user.lastName}`, amount);

        // Process max bids
        await auction.processMaxBids();

        // Populate vehicle data
        await auction.populate('vehicle');

        res.json(auction);
    } catch (error) {
        console.error('Set max bid error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    End auction (Admin only)
// @route   POST /api/auctions/end
// @access  Private (Admin)
const endAuction = async (req, res) => {
    try {
        const auction = await Auction.findOne({
            status: 'active',
            isActive: true
        });

        if (!auction) {
            return res.status(404).json({ message: 'No active auction found' });
        }

        // End auction
        auction.status = 'ended';
        auction.endTime = new Date();

        // Determine winner
        if (auction.currentBidder) {
            auction.winner = {
                user: auction.currentBidder,
                userName: auction.currentBidderName,
                finalBid: auction.currentBid,
                timestamp: new Date()
            };

            // Update vehicle status
            const vehicle = await Vehicle.findById(auction.vehicle);
            if (vehicle) {
                vehicle.status = 'sold';
                await vehicle.save();
            }
        } else {
            // No bids - mark as no sale
            const vehicle = await Vehicle.findById(auction.vehicle);
            if (vehicle) {
                vehicle.status = 'no_sale';
                await vehicle.save();
            }
        }

        await auction.save();

        // Populate vehicle data
        await auction.populate('vehicle');

        res.json(auction);
    } catch (error) {
        console.error('End auction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get auction history
// @route   GET /api/auctions/history
// @access  Private
const getAuctionHistory = async (req, res) => {
    try {
        const auctions = await Auction.find({
            status: 'ended',
            isActive: true
        })
            .populate('vehicle')
            .sort({ endTime: -1 })
            .limit(20);

        res.json(auctions);
    } catch (error) {
        console.error('Get auction history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getCurrentAuction,
    startAuction,
    placeBid,
    setMaxBid,
    endAuction,
    getAuctionHistory
}; 