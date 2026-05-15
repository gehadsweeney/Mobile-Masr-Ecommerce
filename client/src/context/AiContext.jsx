import { createContext, useState, useEffect, useRef } from "react";
import { askAI } from "../services/aiApi";

export const AiContext = createContext();

export const AiProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsUsed, setProductsUsed] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const sessionUserKeyRef = useRef("guest");

  // Helpers for session-scoped storage
  const getSessionKey = (user) => `chatMessages:${user?._id || "guest"}`;
  const getLastGreetingKey = (user) => `lastGreetingAt:${user?._id || "guest"}`;
  const loadChatFromSession = (user) => {
    try {
      const raw = sessionStorage.getItem(getSessionKey(user));
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      console.log("Error loading chat from session");
      return [];
    }
  };
  const saveChatToSession = (user, msgs) => {
    try {
      const toSave = Array.isArray(msgs) ? msgs.slice(-50) : [];
      sessionStorage.setItem(getSessionKey(user), JSON.stringify(toSave));
    } catch (e) {
      console.log("Error saving chat to session");
    }
  };
  const clearChatFromSession = (user) => {
    try {
      sessionStorage.removeItem(getSessionKey(user));
    } catch (e) {
      console.log("Error clearing chat from session");
    }
  };
  const clearAllChatSessions = () => {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach((k) => {
        if (k.startsWith("chatMessages:")) sessionStorage.removeItem(k);
        if (k.startsWith("lastGreetingAt:")) sessionStorage.removeItem(k);
      });
    } catch (e) {
      console.log("Error clearing all chat sessions");
    }
  };

  // Initialize on load: set user and load chat from session
  useEffect(() => {
    const initializeAI = async () => {
      const userData = localStorage.getItem("user");
      let parsedUser = null;
      
      if (userData) {
        try {
          parsedUser = JSON.parse(userData);
          setUserInfo(parsedUser);
        } catch (e) {
          console.log("Error reading user data");
        }
      }
      // Only load persisted chat if logged-in
      if (parsedUser && parsedUser._id) {
        sessionUserKeyRef.current = parsedUser._id;
        const existing = loadChatFromSession(parsedUser);
        setMessages(existing || []);
      } else {
        sessionUserKeyRef.current = "guest";
        setMessages([]);
      }
    };

    initializeAI();
  }, []);

  // Listen to user changes and manage session linkage
  useEffect(() => {
    const handleUserChange = (event) => {
      const userData = event.detail || localStorage.getItem("user");
      if (userData && typeof userData === 'string') {
        try {
          const parsedUser = JSON.parse(userData);
          const prevKey = sessionUserKeyRef.current;
          const nextKey = parsedUser?._id || "guest";
          // If user changed (login or switch), keep current messages and migrate to new session key
          if (prevKey !== nextKey) {
            saveChatToSession(parsedUser, messages);
            sessionUserKeyRef.current = nextKey;
          }
          setUserInfo(parsedUser);
          // Load any existing chat for this user
          const existing = loadChatFromSession(parsedUser);
          if (existing && existing.length > 0) {
            setMessages(existing);
          } else {
            // keep current messages if present, otherwise start empty
            setMessages((curr) => curr);
          }
        } catch (e) {
          console.log("Error parsing user data");
        }
      } else if (userData && typeof userData === 'object') {
        const prevKey = sessionUserKeyRef.current;
        const nextKey = userData?._id || "guest";
        if (prevKey !== nextKey) {
          saveChatToSession(userData, messages);
          sessionUserKeyRef.current = nextKey;
        }
        setUserInfo(userData);
        const existing = loadChatFromSession(userData);
        if (existing && existing.length > 0) {
          setMessages(existing);
        } else {
          setMessages((curr) => curr);
        }
      } else {
        // Logout: clear messages and all session keys
        setUserInfo(null);
        setMessages([]);
        clearAllChatSessions();
        sessionUserKeyRef.current = "guest";
      }
    };

    // الاستماع للحدث المخصص
    window.addEventListener("userChanged", handleUserChange);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  const callAI = async (feature, question, extra = {}) => {
    if (!question.trim()) return;

    setLoading(true);

    // Add user message
    const userMessage = {
      type: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };
    
    // Build conversation history (last 6 messages for context)
    const historyToSend = [...messages, userMessage]
      .slice(-6)
      .map((msg) => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.content
    }));
    
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await askAI(feature, question, {
        userId: userInfo?._id,
        history: historyToSend,
        ...extra,
      });

      // Add AI message
      const aiMessage = {
        type: "ai",
        content: res.answer,
        timestamp: new Date().toISOString(),
        products: res.productsSuggested || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
      setProductsUsed(res.productsUsed || 0);
    } catch (e) {
      const errorMessage = {
        type: "ai",
        content: "Sorry, something went wrong. Please try again 😢",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    if (userInfo && userInfo._id) {
      clearChatFromSession(userInfo);
    }
  };

  const saveMessages = () => {
    if (!userInfo || !userInfo._id) return; // do not persist for guests
    if (messages.length > 0) {
      saveChatToSession(userInfo, messages);
    }
  };

  const addGreeting = () => {
    const name = userInfo?.name || userInfo?.firstName;
    const content = name
      ? `Hi ${name}! 👋 How can I help you today?`
      : `Welcome! 👋 Log in for better assistance!`;
    const msg = {
      type: "ai",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => {
      const next = [...prev, msg];
      if (userInfo && userInfo._id) {
        saveChatToSession(userInfo, next);
        sessionStorage.setItem(getLastGreetingKey(userInfo), Date.now().toString());
      }
      return next;
    });
  };

  return (
    <AiContext.Provider
      value={{ 
        messages, 
        loading, 
        productsUsed, 
        callAI, 
        clearMessages,
        saveMessages,
        addGreeting,
        userInfo,
        setUserInfo
      }}
    >
      {children}
    </AiContext.Provider>
  );
};
