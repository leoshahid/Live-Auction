import React, { useState, useEffect } from "react";
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

interface SimulcastTileProps {
  vehicle: Vehicle;
  auction?: Auction | null;
  user: User;
  onBid: (vehicleId: string, amount: number) => void;
  onSetMaxBid: (vehicleId: string, amount: number) => void;
  onStartAuction: (vehicleId: string, duration?: number) => void;
  onWatch: (vehicleId: string) => void;
}

const SimulcastTile: React.FC<SimulcastTileProps> = ({
  vehicle,
  auction,
  user,
  onBid,
  onSetMaxBid,
  onStartAuction,
  onWatch,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showMaxBidDialog, setShowMaxBidDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [maxBidAmount, setMaxBidAmount] = useState(0);
  const [isUserBidding, setIsUserBidding] = useState(false);

  // Calculate current bid and bid amount
  const currentBid = auction?.currentBid || vehicle.startingBid;
  const bidIncrement = auction?.bidIncrement || vehicle.bidIncrement;
  const bidAmount = currentBid + bidIncrement;
  const timeRemaining = auction?.timeRemaining || 0;
  const isActiveAuction = auction?.status === "active";

  // Get car images with fallbacks
  const getCarImage = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      return vehicle.images[0];
    }

    // Fallback images based on car make with better variety
    const fallbackImages = {
      Honda:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=240&fit=crop&crop=center",
      Toyota:
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=240&fit=crop&crop=center",
      Volkswagen:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=240&fit=crop&crop=center",
      Hyundai:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=240&fit=crop&crop=center",
      Chevrolet:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=240&fit=crop&crop=center",
      Ford: "https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=400&h=240&fit=crop&crop=center",
      BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=240&fit=crop&crop=center",
      Mercedes:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=240&fit=crop&crop=center",
      Audi: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=240&fit=crop&crop=center",
      Nissan:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=240&fit=crop&crop=center",
    };

    // Use make-specific image or generate a varied fallback based on vehicle properties
    const makeImage =
      fallbackImages[vehicle.make as keyof typeof fallbackImages];
    if (makeImage) {
      return makeImage;
    }

    // Generate varied fallback based on vehicle properties
    const imageVariants = [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=240&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=240&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=240&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=240&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=240&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=400&h=240&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=240&fit=crop&crop=center",
    ];

    // Use vehicle ID to consistently select different images
    const index =
      vehicle._id.charCodeAt(vehicle._id.length - 1) % imageVariants.length;
    return imageVariants[index];
  };

  const handleBid = () => {
    setIsUserBidding(true);
    onBid(vehicle._id, bidAmount);
    setTimeout(() => setIsUserBidding(false), 1000);
  };

  const handleSetMaxBid = () => {
    if (maxBidAmount > currentBid) {
      setIsUserBidding(true);
      onSetMaxBid(vehicle._id, maxBidAmount);
      setShowMaxBidDialog(false);
      setMaxBidAmount(0);
      setTimeout(() => setIsUserBidding(false), 1000);
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
    if (auction?.status === "active") return "success";
    if (auction?.status === "ended") return "error";
    if (vehicle.status === "sold") return "error";
    if (vehicle.status === "no_sale") return "warning";
    return "default";
  };

  const getStatusText = () => {
    if (auction?.status === "active") return "LIVE";
    if (auction?.status === "ended") return "ENDED";
    if (vehicle.status === "sold") return "SOLD";
    if (vehicle.status === "no_sale") return "NO SALE";
    return "AVAILABLE";
  };

  const getConditionColor = () => {
    switch (vehicle.condition) {
      case "excellent":
        return "#22c55e";
      case "good":
        return "#84cc16";
      case "fair":
        return "#f59e0b";
      case "poor":
        return "#ef4444";
      default:
        return "#9e9e9e";
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
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
          border: "1px solid rgba(59, 130, 246, 0.4)",
          "& .car-image": {
            transform: "scale(1.05)",
          },
        },
      }}
    >
      {/* Vehicle Image with Overlay */}
      <Box sx={{ position: "relative", height: 180, overflow: "hidden" }}>
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
              "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=180&fit=crop&crop=center";
          }}
        />

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* Status Badges */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Chip
            label={getStatusText()}
            color={getStatusColor()}
            size="small"
            sx={{
              fontWeight: "bold",
              backgroundColor:
                getStatusColor() === "success"
                  ? "#22c55e"
                  : getStatusColor() === "error"
                  ? "#ef4444"
                  : getStatusColor() === "warning"
                  ? "#f59e0b"
                  : "#3b82f6",
              color: "white",
              "& .MuiChip-label": {
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.5px",
              },
            }}
          />
          {isActiveAuction && timeRemaining > 0 && (
            <Chip
              label={formatTime(timeRemaining)}
              color="warning"
              size="small"
              icon={<TimerIcon />}
              sx={{
                backgroundColor: "#f59e0b",
                color: "white",
                "& .MuiChip-label": {
                  fontSize: "0.75rem",
                  fontWeight: 700,
                },
              }}
            />
          )}
        </Box>

        {/* Condition Badge */}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            backgroundColor: getConditionColor(),
            color: "white",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {vehicle.condition}
        </Box>

        {/* Action Menu */}
        <IconButton
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
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
      <CardContent sx={{ display: "flex", flexDirection: "column", p: 1.5 }}>
        {/* Vehicle Title */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 800,
            color: "#1e293b",
            fontSize: "1rem",
            lineHeight: 1.2,
            mb: 1,
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

        {/* Vehicle Details Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0.5,
            mb: 1,
            p: 1,
            backgroundColor: "#f8fafc",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CarIcon sx={{ fontSize: "0.8rem", color: "#3b82f6" }} />
            <Typography
              variant="body2"
              color="#64748b"
              sx={{ fontSize: "0.7rem", fontWeight: 500 }}
            >
              Run: {vehicle.runNumber}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <SpeedIcon sx={{ fontSize: "0.8rem", color: "#3b82f6" }} />
            <Typography
              variant="body2"
              color="#64748b"
              sx={{ fontSize: "0.7rem", fontWeight: 500 }}
            >
              {vehicle.mileage.toLocaleString()} {vehicle.mileageType}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ColorIcon sx={{ fontSize: "0.8rem", color: "#3b82f6" }} />
            <Typography
              variant="body2"
              color="#64748b"
              sx={{ fontSize: "0.7rem", fontWeight: 500 }}
            >
              {vehicle.color}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <BusinessIcon sx={{ fontSize: "0.8rem", color: "#3b82f6" }} />
            <Typography
              variant="body2"
              color="#64748b"
              sx={{ fontSize: "0.7rem", fontWeight: 500 }}
            >
              {vehicle.seller}
            </Typography>
          </Box>
        </Box>

        {/* VIN Number */}
        <Typography
          variant="body2"
          color="#94a3b8"
          sx={{
            fontSize: "0.6rem",
            mb: 1,
            fontFamily: "monospace",
            textAlign: "center",
            backgroundColor: "#f1f5f9",
            padding: "2px 4px",
            borderRadius: "3px",
            border: "1px solid #e2e8f0",
          }}
        >
          VIN: {vehicle.vin}
        </Typography>

        {/* Additional Vehicle Specifications */}
        {(vehicle.engine ||
          vehicle.transmission ||
          vehicle.drivetrain ||
          vehicle.fuelType) && (
          <Box
            sx={{
              mb: 1,
              p: 1,
              backgroundColor: "#f8fafc",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontWeight: 600,
                color: "#3b82f6",
                mb: 0.5,
                fontSize: "0.65rem",
              }}
            >
              SPECIFICATIONS
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5 }}
            >
              {vehicle.engine && (
                <Typography
                  variant="caption"
                  color="#64748b"
                  sx={{ fontSize: "0.6rem" }}
                >
                  <strong>Engine:</strong> {vehicle.engine}
                </Typography>
              )}
              {vehicle.transmission && (
                <Typography
                  variant="caption"
                  color="#64748b"
                  sx={{ fontSize: "0.6rem" }}
                >
                  <strong>Trans:</strong> {vehicle.transmission}
                </Typography>
              )}
              {vehicle.drivetrain && (
                <Typography
                  variant="caption"
                  color="#64748b"
                  sx={{ fontSize: "0.6rem" }}
                >
                  <strong>Drivetrain:</strong> {vehicle.drivetrain}
                </Typography>
              )}
              {vehicle.fuelType && (
                <Typography
                  variant="caption"
                  color="#64748b"
                  sx={{ fontSize: "0.6rem" }}
                >
                  <strong>Fuel:</strong> {vehicle.fuelType}
                </Typography>
              )}
              {vehicle.horsepower && (
                <Typography
                  variant="caption"
                  color="#64748b"
                  sx={{ fontSize: "0.6rem" }}
                >
                  <strong>HP:</strong> {vehicle.horsepower}
                </Typography>
              )}
              {vehicle.bodyStyle && (
                <Typography
                  variant="caption"
                  color="#64748b"
                  sx={{ fontSize: "0.6rem" }}
                >
                  <strong>Body:</strong> {vehicle.bodyStyle}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Current Bid Display */}
        <Box
          sx={{
            textAlign: "center",
            mb: 1.5,
            p: 1.5,
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
            borderRadius: "10px",
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
              fontSize: "1.5rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            ${currentBid.toLocaleString()}
          </Typography>
          <Typography
            variant="body2"
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

        {/* Action Buttons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {/* Bidding Controls for Users */}
          {isActiveAuction && user.role === "user" && (
            <>
              <Button
                variant="contained"
                fullWidth
                onClick={handleBid}
                disabled={isUserBidding}
                sx={{
                  background:
                    "linear-gradient(45deg, #22c55e 30%, #16a34a 90%)",
                  color: "white",
                  fontWeight: 700,
                  py: 1,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #16a34a 30%, #15803d 90%)",
                    boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
                  },
                  "&:disabled": {
                    background: "rgba(34, 197, 94, 0.3)",
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                {isUserBidding
                  ? "Bidding..."
                  : `Bid $${bidAmount.toLocaleString()}`}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => setShowMaxBidDialog(true)}
                disabled={isUserBidding}
                sx={{
                  borderColor: "#3b82f6",
                  color: "#3b82f6",
                  fontWeight: 600,
                  py: 1,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "0.8rem",
                  "&:hover": {
                    borderColor: "#1d4ed8",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)",
                  },
                }}
              >
                Set Max Bid
              </Button>
            </>
          )}

          {/* Admin Controls */}
          {user.role === "admin" &&
            !isActiveAuction &&
            vehicle.status === "available" && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => onStartAuction(vehicle._id, 300000)}
                sx={{
                  background:
                    "linear-gradient(45deg, #f59e0b 30%, #d97706 90%)",
                  color: "white",
                  fontWeight: 700,
                  py: 1.2,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: "0.9rem",
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
          {!isActiveAuction && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => onWatch(vehicle._id)}
              startIcon={<VisibilityIcon />}
              sx={{
                borderColor: "rgba(0, 0, 0, 0.2)",
                color: "#64748b",
                fontWeight: 600,
                py: 1.2,
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.1)",
                },
              }}
            >
              Watch
            </Button>
          )}
        </Box>
      </CardContent>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: "#1a1a2e",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setShowDetailsDialog(true);
            handleMenuClose();
          }}
        >
          <CarIcon sx={{ mr: 2, color: "#4a90e2" }} />
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            onWatch(vehicle._id);
            handleMenuClose();
          }}
        >
          <VisibilityIcon sx={{ mr: 2, color: "#4a90e2" }} />
          Watch
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ChatIcon sx={{ mr: 2, color: "#4a90e2" }} />
          Chat
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

      {/* Vehicle Details Dialog */}
      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1a1a2e",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: 700 }}>
          Vehicle Details - {vehicle.year} {vehicle.make} {vehicle.model}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="h6" color="white" gutterBottom>
                Vehicle Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Year:</strong> {vehicle.year}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Make:</strong> {vehicle.make}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Model:</strong> {vehicle.model}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Trim:</strong> {vehicle.trim}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Color:</strong> {vehicle.color}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Mileage:</strong> {vehicle.mileage.toLocaleString()}{" "}
                  {vehicle.mileageType}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Condition:</strong> {vehicle.condition}
                </Typography>
                {vehicle.engine && (
                  <Typography variant="body2" color="#b0b0b0">
                    <strong>Engine:</strong> {vehicle.engine}
                  </Typography>
                )}
                {vehicle.transmission && (
                  <Typography variant="body2" color="#b0b0b0">
                    <strong>Transmission:</strong> {vehicle.transmission}
                  </Typography>
                )}
                {vehicle.drivetrain && (
                  <Typography variant="body2" color="#b0b0b0">
                    <strong>Drivetrain:</strong> {vehicle.drivetrain}
                  </Typography>
                )}
                {vehicle.fuelType && (
                  <Typography variant="body2" color="#b0b0b0">
                    <strong>Fuel Type:</strong> {vehicle.fuelType}
                  </Typography>
                )}
                {vehicle.horsepower && (
                  <Typography variant="body2" color="#b0b0b0">
                    <strong>Horsepower:</strong> {vehicle.horsepower} HP
                  </Typography>
                )}
                {vehicle.torque && (
                  <Typography variant="body2" color="#b0b0b0">
                    <strong>Torque:</strong> {vehicle.torque} lb-ft
                  </Typography>
                )}
                {vehicle.bodyStyle && (
                  <Typography variant="body2" color="#b0b0b0">
                    <strong>Body Style:</strong> {vehicle.bodyStyle}
                  </Typography>
                )}
                {vehicle.doors && (
                  <Typography variant="body2" color="#b0b0b0">
                    <strong>Doors:</strong> {vehicle.doors}
                  </Typography>
                )}
                {vehicle.seats && (
                  <Typography variant="body2" color="#b0b0b0">
                    <strong>Seats:</strong> {vehicle.seats}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="h6" color="white" gutterBottom>
                Auction Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Run Number:</strong> {vehicle.runNumber}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>VIN:</strong> {vehicle.vin}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Seller:</strong> {vehicle.seller}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Starting Bid:</strong> $
                  {vehicle.startingBid.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Bid Increment:</strong> $
                  {vehicle.bidIncrement.toLocaleString()}
                </Typography>
                {vehicle.reservePrice && (
                  <Typography variant="body2" color="#b0b0b0">
                    <strong>Reserve Price:</strong> $
                    {vehicle.reservePrice.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          {vehicle.description && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" color="white" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" color="#b0b0b0">
                {vehicle.description}
              </Typography>
            </Box>
          )}
          {vehicle.features && vehicle.features.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" color="white" gutterBottom>
                Features
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {vehicle.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(74, 144, 226, 0.2)",
                      color: "#4a90e2",
                      border: "1px solid rgba(74, 144, 226, 0.3)",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          {vehicle.fuelEconomy && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" color="white" gutterBottom>
                Fuel Economy
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>City:</strong> {vehicle.fuelEconomy.city} MPG
                </Typography>
                <Typography variant="body2" color="#b0b0b0">
                  <strong>Highway:</strong> {vehicle.fuelEconomy.highway} MPG
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowDetailsDialog(false)}
            sx={{ color: "#b0b0b0" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SimulcastTile;
