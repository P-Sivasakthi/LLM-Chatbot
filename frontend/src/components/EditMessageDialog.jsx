import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";

export default function EditMessageDialog({
  open,
  message,
  draft,
  onDraftChange,
  onSave,
  onClose,
  loading,
}) {
  const isUser = message?.role === "user";

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="edit-message-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="edit-message-title">
        Edit {isUser ? "your message" : "assistant reply"}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        {isUser && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Saving removes later messages and regenerates the assistant reply.
          </Alert>
        )}
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          maxRows={12}
          label="Message"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={loading || !draft.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
