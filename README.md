# 🚗 Live Auction System

A real-time auction platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring WebSocket communication for live bidding, responsive design, and role-based access control.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Bidding**: Live auction updates using Socket.IO
- **Role-based Access**: Separate interfaces for Admin and User portals
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **View Modes**: Compact and detailed card views for vehicle listings
- **JWT Authentication**: Secure user authentication and session management

### 🚗 Vehicle Management
- **Comprehensive Vehicle Data**: Engine specs, transmission, drivetrain, fuel economy, etc.
- **High-quality Images**: Unique images for each vehicle from Unsplash
- **Condition Tracking**: Excellent, Good, Fair, Poor condition ratings
- **VIN Tracking**: Vehicle identification number management

### 💰 Auction Features
- **Live Bidding**: Real-time bid updates and notifications
- **Max Bid System**: Set maximum bid amounts for automatic bidding
- **Timer System**: Countdown timers for auction duration
- **Bid History**: Complete tracking of all bids and bidders
- **Winner Determination**: Automatic winner selection at auction end

### 🎨 User Interface
- **Modern Design**: Sleek, professional interface with animations
- **Mobile Responsive**: Optimized for all screen sizes
- **Light Theme**: Clean, accessible color scheme
- **Interactive Elements**: Hover effects, transitions, and visual feedback

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Material-UI**: Component library for consistent design
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Socket.IO**: Real-time bidirectional communication
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing

### Database
- **MongoDB Atlas**: Cloud-hosted MongoDB database
- **Mongoose ODM**: Object document modeling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Websockets
   ```

2. **Install backend dependencies**
   ```bash
   cd auction-backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../auction-simulcast
   npm install
   ```

4. **Environment Setup**

   Create `auction-backend/config.env`:
   ```env
   PORT=3001
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=24h
   CORS_ORIGIN=http://localhost:3000
   AUCTION_DURATION=300000
   BID_EXTENSION_TIME=30000
   ```

5. **Seed the database**
   ```bash
   cd auction-backend
   node src/utils/seedData.js
   ```

6. **Start the backend server**
   ```bash
   cd auction-backend
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd auction-simulcast
   npm start
   ```

## 🎮 Demo Instructions

### Demo Users
The system comes with pre-configured demo users:

**Admin User:**
- Username: `admin`
- Password: `admin123`

**Regular Users:**
- Username: `john_doe` / Password: `password123`
- Username: `jane_smith` / Password: `password123`
- Username: `mike_wilson` / Password: `password123`

### Demo Flow
1. **Login** as different users in separate browser tabs
2. **Admin**: Start an auction by selecting a vehicle
3. **Users**: Place bids and set max bids
4. **Watch** real-time updates across all tabs
5. **Admin**: End auction to see winner determination

## 📱 Mobile Experience

The application is fully responsive with:
- **Mobile-first design** with adaptive layouts
- **Touch-friendly** interface elements
- **Hamburger menu** for mobile navigation
- **Optimized card layouts** for different screen sizes
- **View mode switching** accessible on mobile

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create vehicle (Admin only)
- `PUT /api/vehicles/:id` - Update vehicle (Admin only)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin only)

### Auctions
- `GET /api/auctions/current` - Get current auction
- `POST /api/auctions/start` - Start auction (Admin only)
- `POST /api/auctions/bid` - Place bid
- `POST /api/auctions/max-bid` - Set max bid
- `POST /api/auctions/end` - End auction (Admin only)
- `GET /api/auctions/history` - Get auction history

## 🔌 WebSocket Events

### Client to Server
- `authenticate` - Authenticate WebSocket connection
- `place_bid` - Place a bid
- `set_max_bid` - Set maximum bid amount
- `start_auction` - Start an auction (Admin)
- `end_auction` - End an auction (Admin)

### Server to Client
- `authenticated` - Authentication confirmation
- `bid_update` - Real-time bid updates
- `max_bid_update` - Max bid updates
- `auction_started` - Auction start notification
- `auction_ended` - Auction end notification
- `time_update` - Timer updates
- `error` - Error notifications

## 🎨 UI Components

### Core Components
- **TopNavbar**: Responsive navigation with mobile menu
- **SimulcastGrid**: Main grid layout for vehicle cards
- **SimulcastTile**: Compact vehicle card component
- **DetailedSimulcastTile**: Detailed vehicle card component
- **AuctionView**: Full-screen auction interface
- **Login**: Authentication interface

### Features
- **View Mode Switcher**: Toggle between compact and detailed views
- **Mobile Menu**: Comprehensive mobile navigation
- **Real-time Updates**: Live auction information
- **Responsive Design**: Adaptive layouts for all devices

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd auction-simulcast && npm run build`
3. Set output directory: `auction-simulcast/build`
4. Add environment variables for API endpoints

### Backend (Railway/Render)
1. Deploy to Railway or Render
2. Set environment variables
3. Configure MongoDB Atlas connection
4. Update CORS settings for production domain

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Role-based Authorization**: Admin and User role restrictions
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing

## 📊 Database Schema

### User Model
- Username, email, password (hashed)
- Role (admin/user)
- First name, last name
- Active status and last login

### Vehicle Model
- Basic info (year, make, model, trim)
- Technical specs (engine, transmission, drivetrain)
- Performance data (horsepower, torque, fuel economy)
- Physical attributes (color, mileage, condition)
- Auction settings (starting bid, reserve price)

### Auction Model
- Vehicle reference
- Current bid and bidder
- Bid history and max bids
- Timer and status tracking
- Winner information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the demo instructions

---

**Built with ❤️ using the MERN stack**
