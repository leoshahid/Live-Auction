import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Badge,
  Grid,
  Divider,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon,
  Videocam as VideocamIcon,
  DirectionsCar as CarIcon,
  Timer as TimerIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Speed as SpeedIcon,
  Palette as ColorIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Build as EngineIcon,
  Settings as SettingsIcon,
  LocalGasStation as FuelIcon,
  Speed as SpeedIcon2,
  EventSeat as SeatIcon,
  DoorFront as DoorIcon,
} from "@mui/icons-material";

interface Vehicle {
  _id: string;
  runNumber: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  mileageType: string;
  color: string;
  seller: string;
  description: string;
  images: string[];
  startingBid: number;
  bidIncrement: number;
  reservePrice?: number;
  status: "available" | "in_auction" | "sold" | "no_sale";
  condition: "excellent" | "good" | "fair" | "poor";
  features: string[];
  // Additional vehicle specifications
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  fuelEconomy?: {
    city: number;
    highway: number;
  };
  cylinders?: number;
  displacement?: string;
  horsepower?: number;
  torque?: number;
  exteriorColor?: string;
  interiorColor?: string;
  bodyStyle?: string;
  doors?: number;
  seats?: number;
  isActive: boolean;
}

interface Auction {
  _id: string;
  vehicle: Vehicle;
  currentBid: number;
  currentBidder?: string;
  currentBidderName?: string;
  bidIncrement: number;
  status: "pending" | "active" | "ended" | "cancelled";
  startTime?: Date;
  endTime?: Date;
  timeRemaining?: number;
  winner?: {
    user: string;
    userName: string;
    finalBid: number;
    timestamp: Date;
  };
  reservePrice?: number;
  reserveMet: boolean;
  bidHistory: Array<{
    bidder: string;
    bidderName: string;
    amount: number;
    timestamp: Date;
    type: "bid" | "max_bid";
  }>;
}

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
}

interface DetailedSimulcastTileProps {
  vehicle: Vehicle;
  auction?: Auction | null;
  user: User;
  onBid: (vehicleId: string, amount: number) => void;
  onSetMaxBid: (vehicleId: string, amount: number) => void;
  onStartAuction: (vehicleId: string, duration?: number) => void;
  onWatch: (vehicleId: string) => void;
}

const DetailedSimulcastTile: React.FC<DetailedSimulcastTileProps> = ({
  vehicle,
  auction,
  user,
  onBid,
  onSetMaxBid,
  onStartAuction,
  onWatch,
}) => {
  const [showMaxBidDialog, setShowMaxBidDialog] = useState(false);
  const [maxBidAmount, setMaxBidAmount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isActiveAuction = auction?.status === "active";
  const currentBid = auction?.currentBid || vehicle.startingBid;
  const bidIncrement = auction?.bidIncrement || vehicle.bidIncrement;

  const getCarImage = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      return vehicle.images[0];
    }
    // Fallback to a car image based on vehicle ID
    const carImages = [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=200&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=200&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=200&fit=crop&crop=center",
    ];
    const index = parseInt(vehicle._id.slice(-1)) % carImages.length;
    return carImages[index];
  };

  const handleBid = () => {
    onBid(vehicle._id, currentBid + bidIncrement);
  };

  const handleSetMaxBid = () => {
    if (maxBidAmount > currentBid) {
      onSetMaxBid(vehicle._id, maxBidAmount);
      setShowMaxBidDialog(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getStatusColor = () => {
    if (isActiveAuction) return "#22c55e";
    if (vehicle.status === "sold") return "#ef4444";
    if (vehicle.status === "no_sale") return "#f59e0b";
    return "#3b82f6";
  };

  const getStatusText = () => {
    if (isActiveAuction) return "LIVE";
    if (vehicle.status === "sold") return "SOLD";
    if (vehicle.status === "no_sale") return "NO SALE";
    return "AVAILABLE";
  };

  const getConditionColor = () => {
    switch (vehicle.condition) {
      case "excellent":
        return "#22c55e";
      case "good":
        return "#3b82f6";
      case "fair":
        return "#f59e0b";
      case "poor":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  return (
    <Card
      className="simulcast-tile"
      sx={{
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "20px",
        overflow: "hidden",
        transition:
          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      {/* Vehicle Image with Overlay */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 200, sm: 250, md: 300 },
          overflow: "hidden",
        }}
      >
        <img
          src={getCarImage()}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="car-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center";
          }}
        />

        {/* Status Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: getStatusColor(),
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {getStatusText()}
        </Box>

        {/* Condition Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: getConditionColor(),
            color: "white",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {vehicle.condition}
        </Box>

        {/* Menu Button */}
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            backdropFilter: "blur(10px)",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.8)",
            },
          }}
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>

        {/* Current Bidder Info */}
        {isActiveAuction && auction?.currentBidderName && (
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              right: 16,
              backgroundColor: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              padding: "12px 16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                <PersonIcon sx={{ fontSize: "1rem" }} />
              </Avatar>
              <Typography
                variant="caption"
                color="white"
                sx={{ fontWeight: 600 }}
              >
                Current Bidder: {auction.currentBidderName}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Vehicle Details */}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          p: { xs: 1.5, md: 2 },
        }}
      >
        {/* Vehicle Title */}
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 800,
            color: "#1e293b",
            fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
            lineHeight: 1.2,
            mb: 1.5,
          }}
        >
          {vehicle.year} {vehicle.make} {vehicle.model}
          {vehicle.trim && (
            <Typography
              component="span"
              sx={{ color: "#3b82f6", fontWeight: 600 }}
            >
              {" "}
              {vehicle.trim}
            </Typography>
          )}
        </Typography>

        {/* Current Bid Display */}
        <Box
          sx={{
            textAlign: "center",
            mb: 2,
            p: { xs: 1.5, md: 2 },
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
            borderRadius: "12px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
            },
          }}
        >
          <Typography
            variant="h3"
            component="div"
            gutterBottom
            sx={{
              fontWeight: 900,
              color: "#3b82f6",
              fontSize: { xs: "2rem", sm: "2.2rem", md: "2.5rem" },
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            ${currentBid.toLocaleString()}
          </Typography>
          <Typography
            variant="body1"
            color="#64748b"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {isActiveAuction ? "Current Bid" : "Starting Bid"}
          </Typography>
        </Box>

        {/* Detailed Specifications Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // Single column on mobile
              sm: "1fr", // Single column on small tablets
              md: "1fr 1fr", // Two columns on medium screens and up
            },
            gap: { xs: 1.5, md: 2 },
            mb: 2,
          }}
        >
          {/* Basic Info */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 1, color: "#3b82f6", fontWeight: 600 }}
            >
              Basic Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CarIcon sx={{ fontSize: "1rem", color: "#3b82f6" }} />
                <Typography variant="body2" color="#64748b">
                  <strong>Run:</strong> {vehicle.runNumber}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SpeedIcon sx={{ fontSize: "1rem", color: "#3b82f6" }} />
                <Typography variant="body2" color="#64748b">
                  <strong>Mileage:</strong> {vehicle.mileage.toLocaleString()}{" "}
                  {vehicle.mileageType}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ColorIcon sx={{ fontSize: "1rem", color: "#3b82f6" }} />
                <Typography variant="body2" color="#64748b">
                  <strong>Color:</strong> {vehicle.color}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BusinessIcon sx={{ fontSize: "1rem", color: "#3b82f6" }} />
                <Typography variant="body2" color="#64748b">
                  <strong>Seller:</strong> {vehicle.seller}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Technical Specs */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 1, color: "#3b82f6", fontWeight: 600 }}
            >
              Technical Specifications
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {vehicle.engine && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EngineIcon sx={{ fontSize: "1rem", color: "#3b82f6" }} />
                  <Typography variant="body2" color="#64748b">
                    <strong>Engine:</strong> {vehicle.engine}
                  </Typography>
                </Box>
              )}
              {vehicle.transmission && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SettingsIcon sx={{ fontSize: "1rem", color: "#3b82f6" }} />
                  <Typography variant="body2" color="#64748b">
                    <strong>Transmission:</strong> {vehicle.transmission}
                  </Typography>
                </Box>
              )}
              {vehicle.drivetrain && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SpeedIcon2 sx={{ fontSize: "1rem", color: "#3b82f6" }} />
                  <Typography variant="body2" color="#64748b">
                    <strong>Drivetrain:</strong> {vehicle.drivetrain}
                  </Typography>
                </Box>
              )}
              {vehicle.fuelType && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FuelIcon sx={{ fontSize: "1rem", color: "#3b82f6" }} />
                  <Typography variant="body2" color="#64748b">
                    <strong>Fuel:</strong> {vehicle.fuelType}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Performance */}
          {(vehicle.horsepower || vehicle.torque || vehicle.fuelEconomy) && (
            <Box>
              <Typography
                variant="h6"
                sx={{ mb: 1, color: "#3b82f6", fontWeight: 600 }}
              >
                Performance
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {vehicle.horsepower && (
                  <Typography variant="body2" color="#64748b">
                    <strong>Horsepower:</strong> {vehicle.horsepower} HP
                  </Typography>
                )}
                {vehicle.torque && (
                  <Typography variant="body2" color="#64748b">
                    <strong>Torque:</strong> {vehicle.torque} lb-ft
                  </Typography>
                )}
                {vehicle.fuelEconomy && (
                  <Box>
                    <Typography variant="body2" color="#64748b">
                      <strong>Fuel Economy:</strong>
                    </Typography>
                    <Typography variant="body2" color="#64748b" sx={{ ml: 2 }}>
                      City: {vehicle.fuelEconomy.city} MPG | Highway:{" "}
                      {vehicle.fuelEconomy.highway} MPG
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Body & Interior */}
          {(vehicle.bodyStyle || vehicle.doors || vehicle.seats) && (
            <Box>
              <Typography
                variant="h6"
                sx={{ mb: 1, color: "#3b82f6", fontWeight: 600 }}
              >
                Body & Interior
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {vehicle.bodyStyle && (
                  <Typography variant="body2" color="#64748b">
                    <strong>Body Style:</strong> {vehicle.bodyStyle}
                  </Typography>
                )}
                {vehicle.doors && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DoorIcon sx={{ fontSize: "1rem", color: "#3b82f6" }} />
                    <Typography variant="body2" color="#64748b">
                      <strong>Doors:</strong> {vehicle.doors}
                    </Typography>
                  </Box>
                )}
                {vehicle.seats && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SeatIcon sx={{ fontSize: "1rem", color: "#3b82f6" }} />
                    <Typography variant="body2" color="#64748b">
                      <strong>Seats:</strong> {vehicle.seats}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* VIN Number */}
        <Typography
          variant="body2"
          color="#94a3b8"
          sx={{
            fontSize: "0.7rem",
            mb: 1.5,
            fontFamily: "monospace",
            textAlign: "center",
            backgroundColor: "#f1f5f9",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
          }}
        >
          VIN: {vehicle.vin}
        </Typography>

        {/* Description */}
        {vehicle.description && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="#64748b"
              sx={{ fontStyle: "italic" }}
            >
              {vehicle.description}
            </Typography>
          </Box>
        )}

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 1, color: "#3b82f6", fontWeight: 600 }}
            >
              Features
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {vehicle.features.slice(0, 6).map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    color: "#3b82f6",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    fontSize: "0.7rem",
                  }}
                />
              ))}
              {vehicle.features.length > 6 && (
                <Chip
                  label={`+${vehicle.features.length - 6} more`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(100, 116, 139, 0.1)",
                    color: "#64748b",
                    border: "1px solid rgba(100, 116, 139, 0.2)",
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Bidding Controls for Users */}
          {isActiveAuction && user.role === "user" && (
            <>
              <Button
                variant="contained"
                onClick={handleBid}
                fullWidth
                sx={{
                  background:
                    "linear-gradient(45deg, #22c55e 30%, #16a34a 90%)",
                  color: "white",
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #16a34a 30%, #15803d 90%)",
                    boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
                  },
                }}
              >
                Bid ${(currentBid + bidIncrement).toLocaleString()}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowMaxBidDialog(true)}
                fullWidth
                sx={{
                  borderColor: "#3b82f6",
                  color: "#3b82f6",
                  fontWeight: 600,
                  py: 1.2,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  "&:hover": {
                    borderColor: "#1d4ed8",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                Set Max Bid
              </Button>
            </>
          )}

          {/* Admin Controls */}
          {user.role === "admin" && !isActiveAuction && (
            <Button
              variant="contained"
              onClick={() => onStartAuction(vehicle._id)}
              fullWidth
              sx={{
                background: "linear-gradient(45deg, #f59e0b 30%, #d97706 90%)",
                color: "white",
                fontWeight: 600,
                py: 1.5,
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #d97706 30%, #b45309 90%)",
                  boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
                },
              }}
            >
              Start Auction
            </Button>
          )}

          {/* Watch Button */}
          <Button
            variant="outlined"
            onClick={() => onWatch(vehicle._id)}
            fullWidth
            sx={{
              borderColor: "rgba(0, 0, 0, 0.2)",
              color: "#64748b",
              fontWeight: 600,
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": {
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.05)",
              },
            }}
          >
            Watch Vehicle
          </Button>
        </Box>
      </CardContent>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: "#1a1a2e",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ color: "white" }}>
          <VisibilityIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "white" }}>
          <ChatIcon sx={{ mr: 1 }} />
          Contact Seller
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "white" }}>
          <VideocamIcon sx={{ mr: 1 }} />
          View Video
        </MenuItem>
      </Menu>

      {/* Max Bid Dialog */}
      <Dialog
        open={showMaxBidDialog}
        onClose={() => setShowMaxBidDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#1a1a2e",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: 700 }}>
          Set Maximum Bid
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Maximum Bid Amount"
            type="number"
            fullWidth
            value={maxBidAmount}
            onChange={(e) => setMaxBidAmount(Number(e.target.value))}
            inputProps={{ min: currentBid + bidIncrement }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#4a90e2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4a90e2",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#b0b0b0",
                "&.Mui-focused": {
                  color: "#4a90e2",
                },
              },
            }}
          />
          <Typography variant="body2" color="#b0b0b0" sx={{ mt: 2 }}>
            Minimum bid: ${(currentBid + bidIncrement).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowMaxBidDialog(false)}
            sx={{ color: "#b0b0b0" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSetMaxBid}
            variant="contained"
            disabled={maxBidAmount <= currentBid}
            sx={{
              background: "linear-gradient(45deg, #4a90e2 30%, #357abd 90%)",
              color: "white",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(45deg, #357abd 30%, #2e6da4 90%)",
              },
              "&:disabled": {
                background: "rgba(74, 144, 226, 0.3)",
                color: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            Set Max Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DetailedSimulcastTile;
