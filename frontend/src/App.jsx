import { useState } from "react";
import { Alert, Card } from "@mui/material";
import { useChatStore } from "./hooks/useChatStore";
import AppShell from "./components/AppShell";
import ChatSidebar from "./components/ChatSidebar";
import MessageList from "./components/MessageList";
import ChatComposer from "./components/ChatComposer";
import ConfirmDialog from "./components/ConfirmDialog";
import EditMessageDialog from "./components/EditMessageDialog";

export default function App() {
  const {
    chats,
    activeChat,
    activeChatId,
    messages,
    loading,
    error,
    clearError,
    newChat,
    selectChat,
    deleteChat,
    deleteMessage,
    sendMessage,
    saveEditedMessage,
  } = useChatStore();

  const [confirm, setConfirm] = useState(null);
  const [editState, setEditState] = useState(null);

  function handleDeleteChatRequest(chat) {
    setConfirm({
      type: "chat",
      title: "Delete conversation?",
      description: `"${chat.title}" and all its messages will be permanently removed.`,
      onConfirm: () => {
        deleteChat(chat.id);
        setConfirm(null);
      },
    });
  }

  function handleDeleteMessageRequest(message) {
    setConfirm({
      type: "message",
      title: "Delete message?",
      description: "This message will be removed from the conversation history.",
      onConfirm: () => {
        deleteMessage(message.id);
        setConfirm(null);
      },
    });
  }

  function handleEditMessage(message) {
    setEditState({ message, draft: message.content });
  }

  async function handleSaveEdit() {
    if (!editState) return;
    const ok = await saveEditedMessage(editState.message, editState.draft);
    if (ok) setEditState(null);
  }

  return (
    <>
      <AppShell
        title={activeChat?.title ?? "LLM Chatbot"}
        subtitle="Open-source models via Ollama"
        loading={loading}
        sidebar={
          <ChatSidebar
            chats={chats}
            activeChatId={activeChatId}
            activeChat={activeChat}
            loading={loading}
            onNewChat={newChat}
            onSelectChat={selectChat}
            onDeleteChat={handleDeleteChatRequest}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessageRequest}
          />
        }
      >
        <Card
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            m: { xs: 0, sm: 2 },
            mb: { sm: 0 },
            borderRadius: { xs: 0, sm: 2 },
            overflow: "hidden",
            border: { sm: 1 },
            borderColor: "divider",
          }}
        >
          {error && (
            <Alert
              severity="error"
              onClose={clearError}
              sx={{ borderRadius: 0 }}
              role="alert"
            >
              {error}
            </Alert>
          )}

          <MessageList
            messages={messages}
            loading={loading}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessageRequest}
          />

          <ChatComposer
            onSend={sendMessage}
            disabled={Boolean(editState)}
            loading={loading}
          />
        </Card>
      </AppShell>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        description={confirm?.description}
        confirmLabel="Delete"
        onConfirm={confirm?.onConfirm}
        onClose={() => setConfirm(null)}
      />

      <EditMessageDialog
        open={Boolean(editState)}
        message={editState?.message}
        draft={editState?.draft ?? ""}
        onDraftChange={(draft) =>
          setEditState((prev) => (prev ? { ...prev, draft } : null))
        }
        onSave={handleSaveEdit}
        onClose={() => !loading && setEditState(null)}
        loading={loading}
      />
    </>
  );
}
