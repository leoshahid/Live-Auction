import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  DirectionsCar as CarIcon,
} from "@mui/icons-material";
import apiService from "../services/ApiService";
import webSocketService from "../services/WebSocketService";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await apiService.login(loginData);
      apiService.setToken(user.token);
      await webSocketService.authenticate(user.token);
      onLogin(user);
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await apiService.register(registerData);
      apiService.setToken(user.token);
      await webSocketService.authenticate(user.token);
      onLogin(user);
    } catch (error: any) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginInputChange =
    (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginData({ ...loginData, [field]: e.target.value });
    };

  const handleRegisterInputChange =
    (field: keyof RegisterRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRegisterData({ ...registerData, [field]: e.target.value });
    };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          mx: 2,
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "20px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
              }}
            >
              <CarIcon sx={{ color: "white", fontSize: "2rem" }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Live Auction System
            </Typography>
            <Typography variant="body2" color="#64748b">
              Sign in to access the auction platform
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{
              mb: 4,
              "& .MuiTab-root": {
                color: "#64748b",
                fontWeight: 600,
                "&.Mui-selected": {
                  color: "#3b82f6",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#3b82f6",
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {tab === 0 && (
            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={loginData.email}
                onChange={handleLoginInputChange("email")}
                margin="normal"
                required
                autoComplete="email"
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
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={loginData.password}
                onChange={handleLoginInputChange("password")}
                margin="normal"
                required
                autoComplete="current-password"
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
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 2,
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    color: "#f44336",
                  }}
                >
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  background:
                    "linear-gradient(45deg, #3b82f6 30%, #1d4ed8 90%)",
                  color: "white",
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)",
                    boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                  },
                  "&:disabled": {
                    background: "rgba(59, 130, 246, 0.3)",
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Username"
                value={registerData.username}
                onChange={handleRegisterInputChange("username")}
                margin="normal"
                required
                autoComplete="username"
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
              <TextField
                fullWidth
                label="First Name"
                value={registerData.firstName}
                onChange={handleRegisterInputChange("firstName")}
                margin="normal"
                required
                autoComplete="given-name"
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
              <TextField
                fullWidth
                label="Last Name"
                value={registerData.lastName}
                onChange={handleRegisterInputChange("lastName")}
                margin="normal"
                required
                autoComplete="family-name"
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
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={registerData.email}
                onChange={handleRegisterInputChange("email")}
                margin="normal"
                required
                autoComplete="email"
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
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={registerData.password}
                onChange={handleRegisterInputChange("password")}
                margin="normal"
                required
                autoComplete="new-password"
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
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 2,
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    color: "#f44336",
                  }}
                >
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  background:
                    "linear-gradient(45deg, #4caf50 30%, #45a049 90%)",
                  color: "white",
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #45a049 30%, #3d8b40 90%)",
                    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                  },
                  "&:disabled": {
                    background: "rgba(76, 175, 80, 0.3)",
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography
              variant="body2"
              color="#64748b"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Demo Credentials:
            </Typography>
            <Box
              sx={{
                background: "rgba(0, 0, 0, 0.05)",
                borderRadius: "12px",
                padding: 2,
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="body2"
                color="#3b82f6"
                sx={{ mb: 1, fontWeight: 600 }}
              >
                Admin: admin@auction.com / admin123
              </Typography>
              <Typography
                variant="body2"
                color="#3b82f6"
                sx={{ fontWeight: 600 }}
              >
                User: john@example.com / password123
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
