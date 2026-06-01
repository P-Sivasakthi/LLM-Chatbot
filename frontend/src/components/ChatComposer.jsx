import { useState } from "react";
import {
  Paper,
  TextField,
  IconButton,
  Box,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatComposer({ onSend, disabled, loading }) {
  const [input, setInput] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || disabled || loading) return;
    setInput("");
    await onSend(text);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <Paper
      component="form"
      elevation={0}
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        borderRadius: 0,
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder="Message… (Enter to send, Shift+Enter for new line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          aria-label="Chat message"
          sx={{ "& .MuiOutlinedInput-root": { bgcolor: "background.default" } }}
        />
        <Tooltip title="Send message">
          <span>
            <IconButton
              type="submit"
              color="primary"
              disabled={disabled || loading || !input.trim()}
              aria-label="Send message"
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { bgcolor: "primary.dark" },
                "&.Mui-disabled": {
                  bgcolor: "action.disabledBackground",
                  color: "action.disabled",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" aria-hidden />
              ) : (
                <SendIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
}
