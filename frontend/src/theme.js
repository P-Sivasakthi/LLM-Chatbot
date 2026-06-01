import { createTheme, alpha } from "@mui/material/styles";

const SPACING = 8;

export const theme = createTheme({
  spacing: SPACING,
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
      dark: "#1d4ed8",
      light: "#3b82f6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#64748b",
    },
    background: {
      default: "#f1f5f9",
      paper: "#ffffff",
    },
    divider: "#e2e8f0",
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    error: {
      main: "#dc2626",
    },
    success: {
      main: "#16a34a",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600, fontSize: "1.25rem", lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: "1rem", lineHeight: 1.5 },
    body1: { fontSize: "0.9375rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    caption: { fontSize: "0.75rem", lineHeight: 1.4 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { height: "100%" },
        body: { height: "100%", margin: 0 },
        "#root": { height: "100%" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha("#0f172a", 0.08)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: `1px solid ${alpha("#0f172a", 0.08)}` },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 8, marginBottom: SPACING / 2 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { minHeight: 48, textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

export const DRAWER_WIDTH = 304;
