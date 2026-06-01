import { useEffect, useRef } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import MessageItem, { TypingIndicator } from "./MessageItem";

export default function MessageList({ messages, loading, onEdit, onDelete }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Card
          elevation={0}
          sx={{
            maxWidth: 400,
            textAlign: "center",
            bgcolor: "background.default",
            border: 1,
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ py: 4, px: 3 }}>
            <ChatOutlinedIcon
              sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              aria-hidden
            />
            <Typography variant="h6" gutterBottom>
              Start a conversation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ask anything. Your messages are saved locally in this browser.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      aria-label="Chat messages"
      aria-live="polite"
      sx={{ flex: 1, overflow: "auto", px: { xs: 2, sm: 3 }, py: 2 }}
    >
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {loading && <TypingIndicator />}
      <div ref={endRef} />
    </Box>
  );
}
