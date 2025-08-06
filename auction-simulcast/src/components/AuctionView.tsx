import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Timer as TimerIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  Palette as ColorIcon,
  Business as BusinessIcon,
  Stop as StopIcon,
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

interface AuctionViewProps {
  auction: Auction;
  user: User;
  onBid: (vehicleId: string, amount: number) => void;
  onSetMaxBid: (vehicleId: string, amount: number) => void;
  onEndAuction?: () => void;
}

const AuctionView: React.FC<AuctionViewProps> = ({
  auction,
  user,
  onBid,
  onSetMaxBid,
  onEndAuction,
}) => {
  const [showMaxBidDialog, setShowMaxBidDialog] = useState(false);
  const [maxBidAmount, setMaxBidAmount] = useState(0);
  const [isUserBidding, setIsUserBidding] = useState(false);

  const vehicle = auction.vehicle;
  const currentBid = auction.currentBid;
  const bidIncrement = auction.bidIncrement;
  const bidAmount = currentBid + bidIncrement;
  const timeRemaining = auction.timeRemaining || 0;

  const getCarImage = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      return vehicle.images[0];
    }

    const fallbackImages = {
      Honda:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center",
      Toyota:
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop&crop=center",
      Volkswagen:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center",
      Hyundai:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center",
      Chevrolet:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center",
    };

    return (
      fallbackImages[vehicle.make as keyof typeof fallbackImages] ||
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center"
    );
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

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
    <Box className="auction-view">
      {/* Large Image Section */}
      <Box className="auction-image-section">
        <img
          src={getCarImage()}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center";
          }}
        />

        {/* Overlay Elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Status Badges */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            display: "flex",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Chip
            label="LIVE"
            color="success"
            size="small"
            sx={{
              backgroundColor: "#22c55e",
              color: "white",
              fontWeight: 700,
              "& .MuiChip-label": {
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "1px",
              },
            }}
          />
          {timeRemaining > 0 && (
            <Chip
              label={formatTime(timeRemaining)}
              color="warning"
              size="small"
              icon={<TimerIcon />}
              sx={{
                backgroundColor: "#f59e0b",
                color: "white",
                fontWeight: 700,
                "& .MuiChip-label": {
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  fontFamily: "monospace",
                },
              }}
            />
          )}
        </Box>

        {/* Current Bidder Info */}
        {auction.currentBidderName && (
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "16px 20px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{ width: 40, height: 40, backgroundColor: "#3b82f6" }}
              >
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  color="#64748b"
                  sx={{ fontWeight: 500 }}
                >
                  Current Bidder
                </Typography>
                <Typography
                  variant="h6"
                  color="#1e293b"
                  sx={{ fontWeight: 700 }}
                >
                  {auction.currentBidderName}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Condition Badge */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: getConditionColor(),
            color: "white",
            padding: "8px 12px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {vehicle.condition}
        </Box>
      </Box>

      {/* Details and Bidding Section */}
      <Box className="auction-details-section">
        {/* Vehicle Title */}
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}
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
          <Typography variant="body1" color="#64748b" sx={{ mb: 2 }}>
            Run: {vehicle.runNumber} | VIN: {vehicle.vin.slice(-8)}
          </Typography>
        </Box>

        {/* Vehicle Details */}
        <Paper sx={{ p: 2, backgroundColor: "#f8fafc" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <SpeedIcon sx={{ color: "#3b82f6", fontSize: "1.2rem" }} />
                <Typography variant="body2" color="#64748b">
                  {vehicle.mileage.toLocaleString()} {vehicle.mileageType}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <ColorIcon sx={{ color: "#3b82f6", fontSize: "1.2rem" }} />
                <Typography variant="body2" color="#64748b">
                  {vehicle.color}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <BusinessIcon sx={{ color: "#3b82f6", fontSize: "1.2rem" }} />
                <Typography variant="body2" color="#64748b">
                  {vehicle.seller}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CarIcon sx={{ color: "#3b82f6", fontSize: "1.2rem" }} />
                <Typography variant="body2" color="#64748b">
                  {vehicle.condition} Condition
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Divider />

        {/* Current Bid Display */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            component="div"
            sx={{ fontWeight: 900, color: "#3b82f6", mb: 1 }}
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
            Current Bid
          </Typography>
        </Box>

        {/* Bidding Controls */}
        {user.role === "user" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleBid}
              disabled={isUserBidding}
              sx={{
                background: "linear-gradient(45deg, #22c55e 30%, #16a34a 90%)",
                color: "white",
                fontWeight: 700,
                py: 2,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1.1rem",
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
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  borderColor: "#1d4ed8",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)",
                },
              }}
            >
              Set Max Bid
            </Button>
          </Box>
        )}

        {/* Admin End Auction Button */}
        {user.role === "admin" && onEndAuction && (
          <Button
            variant="contained"
            fullWidth
            onClick={onEndAuction}
            sx={{
              background: "linear-gradient(45deg, #ef4444 30%, #dc2626 90%)",
              color: "white",
              fontWeight: 700,
              py: 2,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "1.1rem",
              boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #dc2626 30%, #b91c1c 90%)",
                boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
              },
            }}
            startIcon={<StopIcon />}
          >
            End Auction
          </Button>
        )}
      </Box>

      {/* Max Bid Dialog */}
      <Dialog
        open={showMaxBidDialog}
        onClose={() => setShowMaxBidDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#1e293b", fontWeight: 700 }}>
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
                color: "#1e293b",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#64748b",
                "&.Mui-focused": {
                  color: "#3b82f6",
                },
              },
            }}
          />
          <Typography variant="body2" color="#64748b" sx={{ mt: 2 }}>
            Minimum bid: ${(currentBid + bidIncrement).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowMaxBidDialog(false)}
            sx={{ color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSetMaxBid}
            variant="contained"
            disabled={maxBidAmount <= currentBid}
            sx={{
              background: "linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)",
              color: "white",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)",
              },
              "&:disabled": {
                background: "rgba(59, 130, 246, 0.3)",
                color: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            Set Max Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuctionView;
