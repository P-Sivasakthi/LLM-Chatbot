import { useState } from "react";
import {
  Box,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`sidebar-tabpanel-${index}`}>
      {value === index && <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>{children}</Box>}
    </div>
  );
}

export default function ChatSidebar({
  chats,
  activeChatId,
  activeChat,
  loading,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onEditMessage,
  onDeleteMessage,
  onNavigate,
}) {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            onNewChat();
            onNavigate?.();
          }}
          disabled={loading}
          aria-label="Create new chat"
        >
          New chat
        </Button>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        aria-label="Sidebar sections"
        sx={{ px: 1, minHeight: 48, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Chats" id="sidebar-tab-0" aria-controls="sidebar-tabpanel-0" />
        <Tab
          label="History"
          id="sidebar-tab-1"
          aria-controls="sidebar-tabpanel-1"
          disabled={!activeChat?.messages?.length}
        />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Box sx={{ px: 2, py: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search chats…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            aria-label="Search chats"
          />
        </Box>
        <List
          dense
          sx={{ flex: 1, overflow: "auto", px: 1, pb: 2 }}
          aria-label="Chat list"
        >
          {filtered.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
              No chats found
            </Typography>
          ) : (
            filtered.map((chat) => (
              <ListItem
                key={chat.id}
                disablePadding
                secondaryAction={
                  <Tooltip title="Delete chat">
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label={`Delete ${chat.title}`}
                      onClick={() => onDeleteChat(chat)}
                      disabled={loading}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ mb: 0.5 }}
              >
                <ListItemButton
                  selected={chat.id === activeChatId}
                  onClick={() => {
                    onSelectChat(chat.id);
                    onNavigate?.();
                  }}
                  disabled={loading && chat.id !== activeChatId}
                  sx={{ pr: 6 }}
                >
                  <ListItemText
                    primary={chat.title}
                    secondary={`${chat.messages.length} messages`}
                    primaryTypographyProps={{ noWrap: true }}
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <TableContainer sx={{ flex: 1 }}>
          <Table size="small" stickyHeader aria-label="Message history table">
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Preview</TableCell>
                <TableCell align="right" width={88}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(activeChat?.messages ?? []).map((msg) => (
                <TableRow key={msg.id} hover>
                  <TableCell>
                    <Chip
                      label={msg.role === "user" ? "You" : "AI"}
                      size="small"
                      color={msg.role === "user" ? "primary" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
                      {msg.content}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        aria-label="Edit message"
                        onClick={() => onEditMessage(msg)}
                        disabled={loading}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        aria-label="Delete message"
                        onClick={() => onDeleteMessage(msg)}
                        disabled={loading}
                        color="error"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
}
