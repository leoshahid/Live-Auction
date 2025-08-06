# Auction Simulcast - React Application

A modern, real-time auction simulcast application built with React, TypeScript, and Material-UI. This application provides a sophisticated bidding interface for live vehicle auctions with real-time updates, chat functionality, and responsive design.

## Features

### 🚗 **Vehicle Management**

- Real-time vehicle information display
- Vehicle images and details
- VIN, mileage, and condition information
- Seller information and vehicle specifications

### 💰 **Bidding System**

- Live bidding with real-time updates
- Maximum bid setting functionality
- Bid increment management
- Countdown timers for active auctions
- Bid history tracking

### 📊 **Real-time Updates**

- WebSocket integration for live data
- Real-time bid updates
- Vehicle status changes
- Auction statistics
- Live chat functionality

### 🎨 **Modern UI/UX**

- Material-UI components
- Dark theme optimized for auction environments
- Responsive grid layout
- Interactive bidding tiles
- Toast notifications

### 📱 **Responsive Design**

- Mobile-friendly interface
- Adaptive grid system
- Touch-optimized controls
- Cross-device compatibility

## Technology Stack

- **Frontend**: React 18, TypeScript
- **UI Framework**: Material-UI (MUI)
- **Real-time Communication**: Socket.IO Client
- **State Management**: React Hooks
- **Styling**: CSS-in-JS with MUI System
- **Build Tool**: Create React App

## Project Structure

```
src/
├── components/
│   ├── TopNavbar.tsx          # Main navigation bar
│   ├── SimulcastGrid.tsx      # Main grid container
│   └── SimulcastTile.tsx      # Individual auction tile
├── services/
│   └── WebSocketService.ts    # WebSocket communication
├── App.tsx                    # Main application component
├── App.css                    # Global styles
└── index.tsx                  # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd auction-simulcast
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3002](http://localhost:3002) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Usage

### Bidding Interface

1. **View Vehicles**: Each tile displays vehicle information, current bid, and status
2. **Place Bids**: Click the "BID" button to place a bid at the current increment
3. **Set Max Bid**: Use the "MAX" button to set a maximum bid amount
4. **Watch Vehicles**: Click the eye icon to add vehicles to your watch list

### Real-time Features

- **Live Updates**: Bid amounts and timers update in real-time
- **Status Changes**: Vehicle status changes (bidding, sold, no sale) are reflected immediately
- **Chat**: Communicate with other bidders (when backend is implemented)
- **Notifications**: Toast notifications for bid confirmations and updates

## Configuration

### WebSocket Connection

The application is configured to connect to a WebSocket server at `ws://localhost:3001`. To change this:

1. Update the WebSocket URL in `src/services/WebSocketService.ts`
2. Configure your backend server accordingly

### Theme Customization

The application uses a custom dark theme optimized for auction environments. To customize:

1. Modify the theme object in `src/App.tsx`
2. Update color schemes in `src/App.css`
3. Adjust component-specific styling in individual components

## Backend Integration

This frontend application is designed to work with a backend that provides:

### WebSocket Events

**Client to Server:**

- `place_bid` - Place a bid on a vehicle
- `set_max_bid` - Set maximum bid amount
- `chat_message` - Send chat message
- `watch_vehicle` - Add vehicle to watch list

**Server to Client:**

- `bid_update` - Real-time bid updates
- `vehicle_update` - Vehicle information updates
- `chat_message` - Incoming chat messages
- `stats_update` - Auction statistics updates

### API Endpoints (REST)

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get specific vehicle
- `POST /api/bids` - Place a bid
- `GET /api/auction-stats` - Get auction statistics

## Demo Data

The application includes demo data for testing purposes:

- 6 sample vehicles with realistic information
- Simulated real-time bid updates
- Mock auction statistics
- Placeholder images

## Deployment

### Production Build

1. Create a production build:

```bash
npm run build
```

2. The build folder contains optimized files ready for deployment

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_WEBSOCKET_URL=ws://your-websocket-server.com
REACT_APP_API_URL=https://your-api-server.com
REACT_APP_AUCTION_ID=your-auction-id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

### Planned Features

- [ ] Advanced filtering and search
- [ ] Bid history visualization
- [ ] Vehicle condition reports
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] Unit and integration tests
- [ ] PWA capabilities

### Backend Development

The next phase will include:

- Node.js/Express backend
- Socket.IO server implementation
- MongoDB database integration
- Authentication system
- Real-time auction management

---

**Note**: This is a demo application showcasing the frontend implementation. The WebSocket functionality is simulated for demonstration purposes. For production use, implement the corresponding backend services.
