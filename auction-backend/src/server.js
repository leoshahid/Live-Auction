const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const auctionRoutes = require('./routes/auctions');
const vehicleRoutes = require('./routes/vehicles');

// Import models
const Auction = require('./models/Auction');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3002",
        methods: ["GET", "POST"]
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3002",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Authenticate user
    socket.on('authenticate', async (token) => {
        try {
            console.log('WebSocket authenticate received:', token);
            console.log('Token type:', typeof token);
            console.log('Token length:', token ? token.length : 'null/undefined');

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');

            if (user && user.isActive) {
                connectedUsers.set(socket.id, user);
                socket.user = user;
                socket.join('auction-room');
                socket.emit('authenticated', { user });
                console.log(`User ${user.username} authenticated`);
            } else {
                socket.emit('auth_error', { message: 'Invalid token' });
            }
        } catch (error) {
            console.error('Socket authentication error:', error);
            socket.emit('auth_error', { message: 'Authentication failed' });
        }
    });

    // Join auction room
    socket.on('join_auction', () => {
        socket.join('auction-room');
        console.log('User joined auction room');
    });

    // Place bid
    socket.on('place_bid', async (data) => {
        console.log('Received place_bid event:', data);
        console.log('Socket user:', socket.user);

        try {
            if (!socket.user) {
                socket.emit('bid_error', { message: 'Not authenticated' });
                return;
            }

            const { amount } = data;
            const auction = await Auction.findOne({
                status: 'active',
                isActive: true
            });

            if (!auction) {
                socket.emit('bid_error', { message: 'No active auction found' });
                return;
            }

            // Check if bid is valid
            const nextBidAmount = auction.currentBid + auction.bidIncrement;
            if (amount < nextBidAmount) {
                socket.emit('bid_error', {
                    message: `Minimum bid amount is $${nextBidAmount.toLocaleString()}`
                });
                return;
            }

            // Add bid
            await auction.addBid(socket.user._id, `${socket.user.firstName} ${socket.user.lastName}`, amount);
            await auction.processMaxBids();
            await auction.populate('vehicle');

            // Broadcast to all users
            const updateData = {
                auction,
                bidder: `${socket.user.firstName} ${socket.user.lastName}`,
                amount
            };
            console.log('Broadcasting bid update:', updateData);
            io.to('auction-room').emit('bid_update', updateData);

            console.log(`Bid placed: $${amount} by ${socket.user.firstName} ${socket.user.lastName}`);
        } catch (error) {
            console.error('Place bid error:', error);
            socket.emit('bid_error', { message: 'Failed to place bid' });
        }
    });

    // Set max bid
    socket.on('set_max_bid', async (data) => {
        console.log('Received set_max_bid event:', data);
        console.log('Socket user:', socket.user);

        try {
            if (!socket.user) {
                socket.emit('max_bid_error', { message: 'Not authenticated' });
                return;
            }

            const { amount } = data;
            const auction = await Auction.findOne({
                status: 'active',
                isActive: true
            });

            if (!auction) {
                socket.emit('max_bid_error', { message: 'No active auction found' });
                return;
            }

            // Check if max bid is valid
            const nextBidAmount = auction.currentBid + auction.bidIncrement;
            if (amount < nextBidAmount) {
                socket.emit('max_bid_error', {
                    message: `Maximum bid must be at least $${nextBidAmount.toLocaleString()}`
                });
                return;
            }

            // Add max bid
            await auction.addMaxBid(socket.user._id, `${socket.user.firstName} ${socket.user.lastName}`, amount);
            await auction.processMaxBids();
            await auction.populate('vehicle');

            // Broadcast to all users
            io.to('auction-room').emit('max_bid_update', {
                auction,
                bidder: `${socket.user.firstName} ${socket.user.lastName}`,
                amount
            });

            console.log(`Max bid set: $${amount} by ${socket.user.firstName} ${socket.user.lastName}`);
        } catch (error) {
            console.error('Set max bid error:', error);
            socket.emit('max_bid_error', { message: 'Failed to set max bid' });
        }
    });

    // Admin: Start auction
    socket.on('start_auction', async (data) => {
        console.log('=== RECEIVED START AUCTION EVENT ===');
        console.log('Start auction data:', data);
        console.log('Socket user:', socket.user);

        try {
            if (!socket.user || socket.user.role !== 'admin') {
                socket.emit('auction_error', { message: 'Admin access required' });
                return;
            }

            const { vehicleId, duration = 300000 } = data;

            // Check if there's already an active auction
            const activeAuction = await Auction.findOne({
                status: 'active',
                isActive: true
            });

            if (activeAuction) {
                socket.emit('auction_error', {
                    message: 'There is already an active auction'
                });
                return;
            }

            // Get vehicle
            const Vehicle = require('./models/Vehicle');
            const vehicle = await Vehicle.findById(vehicleId);
            if (!vehicle) {
                socket.emit('auction_error', { message: 'Vehicle not found' });
                return;
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

            // Broadcast to all users
            const startData = { auction };
            console.log('=== BROADCASTING AUCTION STARTED ===');
            console.log('Auction data:', startData);
            console.log('Number of connected users:', connectedUsers.size);
            console.log('Broadcasting to auction-room');
            io.to('auction-room').emit('auction_started', startData);
            console.log('=== END BROADCASTING AUCTION STARTED ===');

            console.log(`Auction started for vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
        } catch (error) {
            console.error('Start auction error:', error);
            socket.emit('auction_error', { message: 'Failed to start auction' });
        }
    });

    // Admin: End auction
    socket.on('end_auction', async () => {
        try {
            if (!socket.user || socket.user.role !== 'admin') {
                socket.emit('auction_error', { message: 'Admin access required' });
                return;
            }

            const auction = await Auction.findOne({
                status: 'active',
                isActive: true
            });

            if (!auction) {
                socket.emit('auction_error', { message: 'No active auction found' });
                return;
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
                const Vehicle = require('./models/Vehicle');
                const vehicle = await Vehicle.findById(auction.vehicle);
                if (vehicle) {
                    vehicle.status = 'sold';
                    await vehicle.save();
                }
            } else {
                // No bids - mark as no sale
                const Vehicle = require('./models/Vehicle');
                const vehicle = await Vehicle.findById(auction.vehicle);
                if (vehicle) {
                    vehicle.status = 'no_sale';
                    await vehicle.save();
                }
            }

            await auction.save();
            await auction.populate('vehicle');

            // Broadcast to all users
            io.to('auction-room').emit('auction_ended', { auction });

            console.log(`Auction ended. Winner: ${auction.winner?.userName || 'No winner'}`);
        } catch (error) {
            console.error('End auction error:', error);
            socket.emit('auction_error', { message: 'Failed to end auction' });
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
        console.log('User disconnected:', socket.id);
    });
});

// Auction timer management
let auctionTimer = null;

const startAuctionTimer = async () => {
    if (auctionTimer) {
        clearInterval(auctionTimer);
    }

    auctionTimer = setInterval(async () => {
        try {
            const auction = await Auction.findOne({
                status: 'active',
                isActive: true
            });

            if (auction && auction.endTime) {
                const timeRemaining = auction.endTime.getTime() - Date.now();

                if (timeRemaining <= 0) {
                    // Auction time expired
                    auction.status = 'ended';
                    auction.endTime = new Date();

                    if (auction.currentBidder) {
                        auction.winner = {
                            user: auction.currentBidder,
                            userName: auction.currentBidderName,
                            finalBid: auction.currentBid,
                            timestamp: new Date()
                        };

                        // Update vehicle status
                        const Vehicle = require('./models/Vehicle');
                        const vehicle = await Vehicle.findById(auction.vehicle);
                        if (vehicle) {
                            vehicle.status = 'sold';
                            await vehicle.save();
                        }
                    } else {
                        // No bids - mark as no sale
                        const Vehicle = require('./models/Vehicle');
                        const vehicle = await Vehicle.findById(auction.vehicle);
                        if (vehicle) {
                            vehicle.status = 'no_sale';
                            await vehicle.save();
                        }
                    }

                    await auction.save();
                    await auction.populate('vehicle');

                    // Broadcast auction ended
                    io.to('auction-room').emit('auction_ended', { auction });
                    console.log('Auction ended automatically');
                } else {
                    // Broadcast time update
                    io.to('auction-room').emit('time_update', {
                        timeRemaining: Math.max(0, timeRemaining)
                    });
                }
            }
        } catch (error) {
            console.error('Auction timer error:', error);
        }
    }, 1000); // Check every second
};

// Start the timer
startAuctionTimer();

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`CORS Origin: ${process.env.CORS_ORIGIN}`);
}); 