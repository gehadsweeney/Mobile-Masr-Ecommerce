import { useContext, useState, useRef, useEffect } from "react";
import { AiContext } from "../../context/AiContext";
import IsLoginContext from "../../context/IsLoginContext";
import "./ChatFeature.css";

export default function ChatFeature() {
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { callAI, loading, messages, clearMessages, saveMessages, userInfo, addGreeting } = useContext(AiContext);
  const { isLoggedIn } = useContext(IsLoginContext);
  const messagesEndRef = useRef(null);

  // تمرير تلقائي للأسفل عند وصول رسالة جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // حفظ الرسائل عند تغييرها
  useEffect(() => {
    if (messages.length > 1) {
      saveMessages();
    }
  }, [messages, saveMessages]);

  // إضافة تحية داخل الشات عند فتحه
  useEffect(() => {
    if (isOpen) {
      const lastGreetingAt = userInfo?._id
        ? Number(sessionStorage.getItem(`lastGreetingAt:${userInfo._id}`) || 0)
        : 0; // لا نحفظ للضيوف
      const justOpened = Date.now() - lastGreetingAt > 60000; // دقيقة على الأقل بين التحيات
      const needsGreeting = messages.length === 0 || justOpened;
      if (needsGreeting) {
        addGreeting();
      }
    }
    // لا شيء عند الإغلاق
  }, [isOpen]);

  // إخفاء رسالة الترحيب بعد 5 ثواني
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // إظهار رسالة الترحيب مرة أخرى عند تغيير حالة اللوجين أو userInfo
  useEffect(() => {
    if (userInfo) {
      setShowWelcome(true);
      // إضافة تحية جديدة في الشات
      addGreeting();
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userInfo?.firstName, userInfo?._id]);

  const handleSend = () => {
    if (q.trim()) {
      callAI("chat", q);
      setQ(""); // تفريغ الـ Input بعد الإرسال
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSend();
    }
  };

  const handleClear = () => {
    clearMessages();
  };

  return (
    <div className="chat-feature-container">
      {/* Welcome Bubble */}
      {!isOpen && showWelcome && (
        <div className="welcome-bubble p-3 text-white  ">
          {isLoggedIn && userInfo ? (
            <p className="mb-0  fw-semibold">Hi {userInfo.firstName}! 👋<br/>How can I help you today?</p>
          ) : (
            <p className="mb-0  fw-semibold">Welcome! 👋<br/>Log in for better assistance!</p>
          )}
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        className={`chat-float-btn btn rounded-circle border-0 position-relative d-flex align-items-center justify-content-center ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="AI Assistant"
      >
        <span className="chat-icon">🤖</span>
        {!isOpen && messages.length > 0 && (
          <span className="chat-notification position-absolute top-0 end-0 rounded-circle bg-danger border-2 border-white"></span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window bg-white d-flex flex-column overflow-hidden">
          {/* Header */}
          <div className="chat-header text-white p-3 d-flex justify-content-between align-items-start gap-3">
            <div className="chat-header-content ">
              <h3 className="fs-5 fw-bold"><span>🤖</span> AI Assistant</h3>
              <p className="mb-0" style={{fontSize: '1.1rem', opacity: 0.95}}>Your helper in choosing the best products 🛍️</p>
            </div>
            <div className="chat-header-actions d-flex gap-2">
              <button
                className="chat-clear-btn btn rounded-circle border-0"
                onClick={handleClear}
                title="Clear chat"
                style={{background: 'rgba(255,255,255,0.2)', color: 'white', width: '35px', height: '35px'}}
              >
                🔄
              </button>
              <button
                className="chat-close-btn btn rounded-circle border-0"
                onClick={() => setIsOpen(false)}
                style={{background: 'rgba(255,255,255,0.2)', color: 'white', width: '32px', height: '32px'}}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Status Bar */}
          {!isLoggedIn && (
            <div className="chat-status-bar text-center py-2 px-3">
              <span>⚠️ Log in to get personalized recommendations</span>
            </div>
          )}

          {/* Messages Container */}
          <div className="chat-messages grow p-2 d-flex flex-column gap-3">
            {messages.length === 0 && (
              <div className="empty-chat d-flex flex-column align-items-center justify-content-center h-100 text-center text-muted">
                <div className="empty-icon mb-3" style={{fontSize: '4rem', opacity: 0.5}}>💬</div>
                <p className="mb-0 fs-6">No messages yet. Start chatting!</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-wrapper d-flex flex-column gap-2 ${msg.type === "user" ? "align-items-end" : "align-items-start"}`}
              >
                <div className={`message ${msg.type}-message p-2 rounded`} style={{maxWidth: '85%'}}>
                  <div className="message-content">
                    <p className="mb-1">{msg.content}</p>
                  </div>
                  <span className="message-time opacity-75" style={{fontSize: '1rem'}}>
                    {msg.timestamp 
                      ? new Date(msg.timestamp).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""
                    }
                  </span>
                </div>

                {/* عرض المنتجات المقترحة */}
                {msg.products && msg.products.length > 0 && (
                  <div className="suggested-products d-flex flex-column gap-2" style={{maxWidth: '85%'}}>
                    {msg.products.map((product) => (
                      <div key={product._id} className="product-card border rounded d-flex gap-2 p-2">
                        <div className="product-image rounded overflow-hidden shrink-0" style={{width: '60px', height: '60px'}}>
                          <img
                            src={product.images?.[0] || product.image || "/default-product.jpg"}
                            alt={product.name?.en || product.name?.ar || "Product"}
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                        <div className="product-info grow d-flex flex-column gap-1">
                          <h4 className="mb-0 text-truncate" style={{fontSize: '1.1rem', fontWeight: 600}}>{product.name?.en || product.name?.ar || product.name}</h4>
                          <p className="product-price mb-0 fw-bold" style={{fontSize: '1rem'}}>
                            {product.price?.toLocaleString("en-US")} EGP
                          </p>
                          <button 
                            onClick={() => window.location.href = `/products/${product._id}`}
                            className="view-btn btn btn-link p-0 text-start text-decoration-none fw-semibold"
                            style={{fontSize: '0.95rem'}}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="message-wrapper ai align-items-start">
                <div className="message ai-message loading p-3 rounded">
                  <span className="typing-indicator d-flex align-items-center gap-2">
                    <span className="rounded-circle"></span>
                    <span className="rounded-circle"></span>
                    <span className="rounded-circle"></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area p-3 bg-white border-top d-flex gap-2">
            <textarea
              className="chat-textarea form-control grow border rounded"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question here... "
              disabled={loading}
              rows="2"
              style={{resize: 'none', maxHeight: '70px'}}
            />
            <button
              className="chat-send-btn btn text-white rounded d-flex align-items-center justify-content-center"
              onClick={handleSend}
              disabled={loading || !q.trim()}
              title="Send message"
            >
              {loading ? "⏳" : (
                <a className="button-footer">
                  ➤
                </a>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
