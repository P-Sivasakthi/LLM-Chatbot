import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function MessageItem({
  message,
  loading,
  onEdit,
  onDelete,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isUser = message.role === "user";
  const menuOpen = Boolean(anchorEl);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 1.5,
        alignItems: "flex-start",
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: isUser ? "primary.main" : "grey.200",
          color: isUser ? "primary.contrastText" : "text.secondary",
        }}
        aria-hidden
      >
        {isUser ? (
          <PersonOutlineIcon fontSize="small" />
        ) : (
          <SmartToyOutlinedIcon fontSize="small" />
        )}
      </Avatar>

      <Box sx={{ maxWidth: { xs: "85%", sm: "75%" }, minWidth: 0, flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexDirection: isUser ? "row-reverse" : "row",
            mb: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {isUser ? "You" : "Assistant"}
          </Typography>
          {!loading && (
            <>
              <IconButton
                size="small"
                aria-label={`Actions for ${isUser ? "your" : "assistant"} message`}
                aria-controls={menuOpen ? "message-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ ml: isUser ? 0 : -0.5 }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                id="message-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    onEdit(message);
                  }}
                >
                  <ListItemIcon>
                    <EditOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    onDelete(message);
                  }}
                  sx={{ color: "error.main" }}
                >
                  <ListItemIcon>
                    <DeleteOutlineIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: isUser ? "primary.main" : "background.paper",
            color: isUser ? "primary.contrastText" : "text.primary",
            border: isUser ? "none" : 1,
            borderColor: "divider",
            borderRadius: 2,
            ...(isUser
              ? { borderBottomRightRadius: 4 }
              : { borderBottomLeftRadius: 4 }),
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {message.content}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export function TypingIndicator() {
  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 2 }}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: "grey.200" }} aria-hidden>
        <SmartToyOutlinedIcon fontSize="small" color="action" />
      </Avatar>
      <Box sx={{ flex: 1, maxWidth: "75%" }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Assistant
        </Typography>
        <Paper elevation={0} sx={{ p: 2, mt: 0.5, border: 1, borderColor: "divider" }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </Paper>
      </Box>
    </Box>
  );
}
