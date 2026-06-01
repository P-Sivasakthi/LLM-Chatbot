import { useState, cloneElement, isValidElement } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { DRAWER_WIDTH } from "../theme";

export default function AppShell({
  title,
  subtitle,
  sidebar,
  children,
  loading,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeDrawer = () => setMobileOpen(false);
  const sidebarNode = isValidElement(sidebar)
    ? cloneElement(sidebar, { onNavigate: closeDrawer })
    : sidebar;

  const drawer = (
    <Box role="navigation" aria-label="Chat navigation" sx={{ height: "100%" }}>
      {sidebarNode}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100%", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        elevation={0}
        color="inherit"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <SmartToyOutlinedIcon color="primary" aria-hidden />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h1" noWrap>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {subtitle}
              </Typography>
            )}
          </Box>
          {loading && (
            <Chip
              label="Thinking…"
              size="small"
              color="primary"
              variant="outlined"
              aria-live="polite"
            />
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav" aria-label="Sidebar">
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
                top: { sm: 64 },
                height: { sm: "calc(100% - 64px)" },
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%",
          ml: { md: `${DRAWER_WIDTH}px` },
          pt: { xs: "56px", sm: "64px" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
