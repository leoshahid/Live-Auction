import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
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
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Avatar,
  Badge,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings,
  ExitToApp as LogoutIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  DirectionsCar as CarIcon,
  AttachMoney as MoneyIcon,
  Timer as TimerIcon,
  Person as PersonIcon,
  PlayArrow as PlayArrowIcon,
  ViewModule as CompactViewIcon,
  ViewList as DetailedViewIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

interface TopNavbarProps {
  auctionName?: string;
  userName?: string;
  userRole?: "user" | "admin";
  notifications?: number;
  onLogout?: () => void;
  currentAuction?: any;
  onStartAuction?: (vehicleId: string, duration: number) => void;
  onEndAuction?: () => void;
  vehicles?: any[];
  viewMode?: "compact" | "detailed";
  onViewModeChange?: (mode: "compact" | "detailed") => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  auctionName = "Live Auction System",
  userName = "User",
  userRole = "user",
  notifications = 0,
  onLogout,
  currentAuction,
  onStartAuction,
  onEndAuction,
  vehicles = [],
  viewMode = "compact",
  onViewModeChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [startAuctionDialog, setStartAuctionDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [auctionDuration, setAuctionDuration] = useState(300000);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchMenu = (event: React.MouseEvent<HTMLElement>) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleStartAuction = () => {
    if (selectedVehicle && onStartAuction) {
      onStartAuction(selectedVehicle, auctionDuration);
      setStartAuctionDialog(false);
      setSelectedVehicle("");
    }
  };

  const handleEndAuction = () => {
    if (onEndAuction) {
      onEndAuction();
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const availableVehicles = vehicles.filter((v) => v.status === "available");

  return (
    <AppBar
      position="static"
      className="top-navbar"
      sx={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ minHeight: "80px !important", px: { xs: 1, sm: 2 } }}>
        {/* Logo and Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
            }}
          >
            <CarIcon
              sx={{ color: "white", fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
            />
          </Box>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: { xs: "1.1rem", sm: "1.5rem" },
              display: { xs: "none", sm: "block" },
            }}
          >
            {auctionName}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: { xs: "block", sm: "none" },
            }}
          >
            LAS
          </Typography>
        </Box>

        {/* Current Auction Info - Hidden on mobile */}
        {currentAuction && (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 3,
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
              padding: "12px 20px",
              borderRadius: "16px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
              mr: 3,
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MoneyIcon sx={{ color: "#3b82f6", fontSize: "1.2rem" }} />
              <Typography
                variant="body1"
                color="#1e293b"
                sx={{ fontWeight: 600 }}
              >
                ${currentAuction.currentBid?.toLocaleString() || 0}
              </Typography>
            </Box>

            {currentAuction.timeRemaining && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TimerIcon sx={{ color: "#f59e0b", fontSize: "1.2rem" }} />
                <Typography
                  variant="body1"
                  color="#1e293b"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "monospace",
                    fontSize: "1.1rem",
                  }}
                >
                  {formatTime(currentAuction.timeRemaining)}
                </Typography>
              </Box>
            )}

            {currentAuction.currentBidderName && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon sx={{ color: "#22c55e", fontSize: "1.2rem" }} />
                <Typography
                  variant="body2"
                  color="#1e293b"
                  sx={{ fontWeight: 500 }}
                >
                  {currentAuction.currentBidderName}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Admin Controls - Hidden on mobile */}
        {userRole === "admin" && (
          <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 2, mr: 3 }}>
            {!currentAuction ? (
              <Button
                variant="contained"
                onClick={() => setStartAuctionDialog(true)}
                disabled={availableVehicles.length === 0}
                sx={{
                  background:
                    "linear-gradient(45deg, #22c55e 30%, #16a34a 90%)",
                  color: "white",
                  fontWeight: 700,
                  py: 1.5,
                  px: 3,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "0.9rem",
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
                startIcon={<PlayArrowIcon />}
              >
                Start Auction
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleEndAuction}
                sx={{
                  background:
                    "linear-gradient(45deg, #ef4444 30%, #dc2626 90%)",
                  color: "white",
                  fontWeight: 700,
                  py: 1.5,
                  px: 3,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #dc2626 30%, #b91c1c 90%)",
                    boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
                  },
                }}
                startIcon={<StopIcon />}
              >
                End Auction
              </Button>
            )}
          </Box>
        )}

        {/* View Mode Switcher - Hidden on mobile */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, mr: 2 }}>
          <Button
            variant={viewMode === "compact" ? "contained" : "outlined"}
            onClick={() => onViewModeChange?.("compact")}
            size="small"
            sx={{
              minWidth: "auto",
              px: 2,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              ...(viewMode === "compact" && {
                background: "linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)",
                color: "white",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)",
                },
              }),
              ...(viewMode !== "compact" && {
                borderColor: "rgba(59, 130, 246, 0.3)",
                color: "#3b82f6",
                "&:hover": {
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                },
              }),
            }}
            startIcon={<CompactViewIcon sx={{ fontSize: "1rem" }} />}
          >
            Compact
          </Button>
          <Button
            variant={viewMode === "detailed" ? "contained" : "outlined"}
            onClick={() => onViewModeChange?.("detailed")}
            size="small"
            sx={{
              minWidth: "auto",
              px: 2,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              ...(viewMode === "detailed" && {
                background: "linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)",
                color: "white",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)",
                },
              }),
              ...(viewMode !== "detailed" && {
                borderColor: "rgba(59, 130, 246, 0.3)",
                color: "#3b82f6",
                "&:hover": {
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                },
              }),
            }}
            startIcon={<DetailedViewIcon sx={{ fontSize: "1rem" }} />}
          >
            Detailed
          </Button>
        </Box>

        {/* Desktop Actions */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          {/* Search */}
          <IconButton
            size="large"
            onClick={handleSearchMenu}
            sx={{
              color: "rgba(0, 0, 0, 0.7)",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
              mr: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <SearchIcon />
          </IconButton>

          {/* Notifications */}
          <IconButton
            size="large"
            sx={{
              color: "rgba(0, 0, 0, 0.7)",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
              mr: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton
            size="large"
            onClick={handleMenu}
            sx={{
              color: "rgba(0, 0, 0, 0.7)",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
              mr: 2,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                fontWeight: 700,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
          <IconButton
            size="large"
            onClick={handleMobileMenu}
            sx={{
              color: "rgba(0, 0, 0, 0.7)",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Search Menu */}
        <Menu
          anchorEl={searchAnchorEl}
          open={Boolean(searchAnchorEl)}
          onClose={handleSearchClose}
          PaperProps={{
            sx: {
              backgroundColor: "white",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              mt: 1,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuItem onClick={handleSearchClose} sx={{ color: "#1e293b" }}>
            Search Vehicles
          </MenuItem>
          <MenuItem onClick={handleSearchClose} sx={{ color: "#1e293b" }}>
            Search Auctions
          </MenuItem>
        </Menu>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: "white",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              mt: 1,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              minWidth: 250,
            },
          }}
        >
          {/* Current Auction Info for Mobile */}
          {currentAuction && (
            <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
              <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1 }}>
                Current Auction
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <MoneyIcon sx={{ color: "#3b82f6", fontSize: "1rem" }} />
                <Typography
                  variant="body2"
                  color="#1e293b"
                  sx={{ fontWeight: 600 }}
                >
                  ${currentAuction.currentBid?.toLocaleString() || 0}
                </Typography>
              </Box>
              {currentAuction.timeRemaining && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <TimerIcon sx={{ color: "#f59e0b", fontSize: "1rem" }} />
                  <Typography
                    variant="body2"
                    color="#1e293b"
                    sx={{ fontWeight: 600, fontFamily: "monospace" }}
                  >
                    {formatTime(currentAuction.timeRemaining)}
                  </Typography>
                </Box>
              )}
              {currentAuction.currentBidderName && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon sx={{ color: "#22c55e", fontSize: "1rem" }} />
                  <Typography
                    variant="body2"
                    color="#1e293b"
                    sx={{ fontWeight: 500 }}
                  >
                    {currentAuction.currentBidderName}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* View Mode Switcher for Mobile */}
          <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
            <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1 }}>
              View Mode
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant={viewMode === "compact" ? "contained" : "outlined"}
                onClick={() => {
                  onViewModeChange?.("compact");
                  handleMobileMenuClose();
                }}
                size="small"
                sx={{
                  flex: 1,
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  ...(viewMode === "compact" && {
                    background:
                      "linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)",
                    color: "white",
                  }),
                }}
                startIcon={<CompactViewIcon sx={{ fontSize: "0.9rem" }} />}
              >
                Compact
              </Button>
              <Button
                variant={viewMode === "detailed" ? "contained" : "outlined"}
                onClick={() => {
                  onViewModeChange?.("detailed");
                  handleMobileMenuClose();
                }}
                size="small"
                sx={{
                  flex: 1,
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  ...(viewMode === "detailed" && {
                    background:
                      "linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)",
                    color: "white",
                  }),
                }}
                startIcon={<DetailedViewIcon sx={{ fontSize: "0.9rem" }} />}
              >
                Detailed
              </Button>
            </Box>
          </Box>

          {/* Admin Controls for Mobile */}
          {userRole === "admin" && (
            <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
              <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1 }}>
                Admin Controls
              </Typography>
              {!currentAuction ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    setStartAuctionDialog(true);
                    handleMobileMenuClose();
                  }}
                  disabled={availableVehicles.length === 0}
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(45deg, #22c55e 30%, #16a34a 90%)",
                    color: "white",
                    fontWeight: 700,
                    py: 1,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "0.9rem",
                    mb: 1,
                  }}
                  startIcon={<PlayArrowIcon />}
                >
                  Start Auction
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    handleEndAuction();
                    handleMobileMenuClose();
                  }}
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(45deg, #ef4444 30%, #dc2626 90%)",
                    color: "white",
                    fontWeight: 700,
                    py: 1,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "0.9rem",
                    mb: 1,
                  }}
                  startIcon={<StopIcon />}
                >
                  End Auction
                </Button>
              )}
            </Box>
          )}

          {/* Mobile Actions */}
          <Box sx={{ p: 2 }}>
            <MenuItem
              onClick={() => {
                handleSearchMenu(mobileMenuAnchor as any);
                handleMobileMenuClose();
              }}
              sx={{ color: "#1e293b", mb: 1 }}
            >
              <SearchIcon sx={{ mr: 2, fontSize: "1.2rem" }} />
              Search
            </MenuItem>
            <MenuItem sx={{ color: "#1e293b", mb: 1 }}>
              <Badge badgeContent={notifications} color="error">
                <NotificationsIcon sx={{ mr: 2, fontSize: "1.2rem" }} />
              </Badge>
              Notifications
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenu(mobileMenuAnchor as any);
                handleMobileMenuClose();
              }}
              sx={{ color: "#1e293b" }}
            >
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                  fontWeight: 700,
                  mr: 2,
                  fontSize: "0.8rem",
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
              {userName}
            </MenuItem>
          </Box>
        </Menu>

        {/* Desktop User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              backgroundColor: "white",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              mt: 1,
            },
          }}
        >
          <MenuItem onClick={handleClose} sx={{ color: "#1e293b" }}>
            <AccountCircle sx={{ mr: 2, color: "#3b82f6" }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ color: "#1e293b" }}>
            <Settings sx={{ mr: 2, color: "#3b82f6" }} />
            Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              onLogout?.();
            }}
            sx={{ color: "#1e293b" }}
          >
            <LogoutIcon sx={{ mr: 2, color: "#3b82f6" }} />
            Logout
          </MenuItem>
        </Menu>

        {/* User Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            background: "rgba(0, 0, 0, 0.05)",
            padding: "8px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="#1e293b"
              sx={{ fontWeight: 600 }}
            >
              {userName}
            </Typography>
            <Chip
              label={userRole}
              size="small"
              sx={{
                backgroundColor: userRole === "admin" ? "#ef4444" : "#3b82f6",
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
                textTransform: "capitalize",
              }}
            />
          </Box>
        </Box>
      </Toolbar>

      {/* Start Auction Dialog */}
      <Dialog
        open={startAuctionDialog}
        onClose={() => setStartAuctionDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#1e293b", fontWeight: 700 }}>
          Start New Auction
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
            <InputLabel sx={{ color: "#64748b" }}>Select Vehicle</InputLabel>
            <Select
              value={selectedVehicle}
              onChange={(e: SelectChangeEvent) =>
                setSelectedVehicle(e.target.value)
              }
              label="Select Vehicle"
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4a90e2",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4a90e2",
                },
                "& .MuiSvgIcon-root": {
                  color: "#b0b0b0",
                },
              }}
            >
              {availableVehicles.map((vehicle) => (
                <MenuItem
                  key={vehicle._id}
                  value={vehicle._id}
                  sx={{ color: "#1e293b" }}
                >
                  {vehicle.runNumber} - {vehicle.year} {vehicle.make}{" "}
                  {vehicle.model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#64748b" }}>Auction Duration</InputLabel>
            <Select
              value={auctionDuration.toString()}
              onChange={(e: SelectChangeEvent) =>
                setAuctionDuration(Number(e.target.value))
              }
              label="Auction Duration"
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4a90e2",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4a90e2",
                },
                "& .MuiSvgIcon-root": {
                  color: "#b0b0b0",
                },
              }}
            >
              <MenuItem value={60000} sx={{ color: "#1e293b" }}>
                1 minute
              </MenuItem>
              <MenuItem value={300000} sx={{ color: "#1e293b" }}>
                5 minutes
              </MenuItem>
              <MenuItem value={600000} sx={{ color: "#1e293b" }}>
                10 minutes
              </MenuItem>
              <MenuItem value={900000} sx={{ color: "#1e293b" }}>
                15 minutes
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setStartAuctionDialog(false)}
            sx={{ color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartAuction}
            variant="contained"
            disabled={!selectedVehicle}
            sx={{
              background: "linear-gradient(45deg, #22c55e 30%, #16a34a 90%)",
              color: "white",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(45deg, #16a34a 30%, #15803d 90%)",
              },
              "&:disabled": {
                background: "rgba(34, 197, 94, 0.3)",
                color: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            Start Auction
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default TopNavbar;
