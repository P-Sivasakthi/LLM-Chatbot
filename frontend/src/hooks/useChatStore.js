import { useState, useEffect, useCallback } from "react";

const API_URL = "https://llm-chatbot-6jw4.vercel.app/api/chat";
const STORAGE_KEY = "llm-chatbot-chats";

export function createChat(title = "New chat") {
  return {
    id: crypto.randomUUID(),
    title,
    messages: [],
    createdAt: Date.now(),
  };
}

export function createMessage(role, content) {
  return { id: crypto.randomUUID(), role, content };
}

function loadChats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((chat) => ({
      ...chat,
      messages: (chat.messages ?? []).map((m) =>
        m.id ? m : { ...m, id: crypto.randomUUID() }
      ),
    }));
  } catch {
    return null;
  }
}

export function chatTitleFromMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return "New chat";
  return trimmed.length > 32 ? `${trimmed.slice(0, 32)}…` : trimmed;
}

function getInitialState() {
  const saved = loadChats();
  if (saved) return { chats: saved, activeChatId: saved[0].id };
  const chat = createChat();
  return { chats: [chat], activeChatId: chat.id };
}

export function useChatStore() {
  const [{ chats, activeChatId }, setChatState] = useState(getInitialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setChats = (updater) =>
    setChatState((prev) => ({
      ...prev,
      chats: typeof updater === "function" ? updater(prev.chats) : updater,
    }));

  const setActiveChatId = (id) =>
    setChatState((prev) => ({ ...prev, activeChatId: id }));

  const activeChat = chats.find((c) => c.id === activeChatId) ?? chats[0];
  const messages = activeChat?.messages ?? [];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  const updateChat = useCallback((chatId, updater) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? updater(chat) : chat))
    );
  }, []);

  const fetchReply = useCallback(async (message, history) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data.reply;
  }, []);

  const requestAssistantReply = useCallback(
    async (chatId, history, message) => {
      setLoading(true);
      setError(null);
      try {
        const reply = await fetchReply(message, history);
        updateChat(chatId, (chat) => ({
          ...chat,
          messages: [...chat.messages, createMessage("assistant", reply)],
        }));
      } catch (err) {
        setError(err.message);
        updateChat(chatId, (chat) => ({
          ...chat,
          messages: chat.messages.slice(0, -1),
        }));
      } finally {
        setLoading(false);
      }
    },
    [fetchReply, updateChat]
  );

  const newChat = useCallback(() => {
    const chat = createChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
    setError(null);
    return chat.id;
  }, []);

  const selectChat = useCallback(
    (chatId) => {
      if (loading) return;
      setActiveChatId(chatId);
      setError(null);
    },
    [loading]
  );

  const deleteChat = useCallback(
    (chatId) => {
      if (loading) return;
      const remaining = chats.filter((c) => c.id !== chatId);
      if (remaining.length === 0) {
        const chat = createChat();
        setChats([chat]);
        setActiveChatId(chat.id);
      } else {
        setChats(remaining);
        if (activeChatId === chatId) setActiveChatId(remaining[0].id);
      }
      setError(null);
    },
    [chats, activeChatId, loading]
  );

  const deleteMessage = useCallback(
    (messageId) => {
      if (loading || !activeChat) return;
      updateChat(activeChat.id, (chat) => ({
        ...chat,
        messages: chat.messages.filter((m) => m.id !== messageId),
        title: chat.messages.length <= 1 ? "New chat" : chat.title,
      }));
    },
    [activeChat, loading, updateChat]
  );

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || loading || !activeChat) return false;
      const trimmed = text.trim();
      const history = activeChat.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      updateChat(activeChat.id, (chat) => ({
        ...chat,
        title:
          chat.messages.length === 0
            ? chatTitleFromMessage(trimmed)
            : chat.title,
        messages: [...chat.messages, createMessage("user", trimmed)],
      }));

      await requestAssistantReply(activeChat.id, history, trimmed);
      return true;
    },
    [activeChat, loading, requestAssistantReply, updateChat]
  );

  const saveEditedMessage = useCallback(
    async (message, newContent) => {
      const text = newContent.trim();
      if (!text || loading || !activeChat) return false;

      if (message.role === "assistant") {
        updateChat(activeChat.id, (chat) => ({
          ...chat,
          messages: chat.messages.map((m) =>
            m.id === message.id ? { ...m, content: text } : m
          ),
        }));
        return true;
      }

      const msgIndex = activeChat.messages.findIndex((m) => m.id === message.id);
      const history = activeChat.messages.slice(0, msgIndex).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      updateChat(activeChat.id, (chat) => ({
        ...chat,
        title: msgIndex === 0 ? chatTitleFromMessage(text) : chat.title,
        messages: [
          ...chat.messages.slice(0, msgIndex),
          { ...message, content: text },
        ],
      }));

      await requestAssistantReply(activeChat.id, history, text);
      return true;
    },
    [activeChat, loading, requestAssistantReply, updateChat]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
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
  };
}
