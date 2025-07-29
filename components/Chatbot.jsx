import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

const genAI = new GoogleGenerativeAI("genai_api_key");

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: ">>> System initialized.\n I'm your AI assistant terminal. How can I help you today? Add your GENERATIVE-AI API key in components/chatbot.jsx", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const toggleChat = () => {
    if (open) {
      setIsAnimating(true);
      setTimeout(() => {
        setOpen(false);
        setIsAnimating(false);
      }, 250);
    } else {
      setOpen(true);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      from: "user", 
      text: input.trim(), 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(input.trim());
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { 
        from: "bot", 
        text: text, 
        timestamp: Date.now() 
      }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, { 
        from: "bot", 
        text: ">>> ERROR: Connection failed. Retrying connection... Please try again.", 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={toggleChat}
          className="group bg-gradient-to-r from-green-500 to-green-400 p-4 rounded-full text-black shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 ease-out animate-pulse hover:animate-none border border-green-400"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-300 rounded-full animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-300 rounded-full"></div>
        </button>
      )}

      {(open || isAnimating) && (
        <div 
          className={`w-96 bg-black border border-green-500 rounded-2xl shadow-2xl shadow-green-500/20 overflow-hidden flex flex-col transition-all duration-300 ease-out transform origin-bottom-right ${
            open && !isAnimating 
              ? 'scale-100 opacity-100 translate-y-0' 
              : 'scale-95 opacity-0 translate-y-2'
          }`}
          onWheel={(e) => {
            e.stopPropagation();
            const messagesContainer = e.currentTarget.querySelector('[data-messages-container]');
            if (messagesContainer && messagesContainer.contains(e.target)) {
              return;
            }
            e.preventDefault();
          }}
        >
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 to-black text-green-400 border-b border-green-500/30">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <span className="font-mono font-semibold text-green-300">TERMINAL_AI</span>
                <div className="text-xs opacity-90 font-mono text-green-500">Status: Online</div>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="p-1 hover:bg-green-500/20 rounded-lg transition-all duration-200 hover:scale-110 border border-transparent hover:border-green-500"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-green-400" />
            </button>
          </div>

          <div 
            data-messages-container
            className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 min-h-80 bg-black scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800"
            style={{ scrollbarWidth: 'thin' }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  msg.from === "user" ? "flex-row-reverse space-x-reverse" : ""
                } animate-in slide-in-from-bottom-3 fade-in duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                  msg.from === "user" 
                    ? "bg-green-500/20 text-green-300 border-green-400" 
                    : "bg-black text-green-400 border-green-500"
                }`}>
                  {msg.from === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`flex flex-col max-w-xs ${
                  msg.from === "user" ? "items-end" : "items-start"
                }`}>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed transition-all duration-200 hover:shadow-md font-mono border whitespace-pre-line ${
                    msg.from === "user"
                      ? "bg-green-500/20 text-green-100 rounded-br-md border-green-400 hover:shadow-green-500/25"
                      : "bg-gray-900 text-green-300 rounded-bl-md border-green-500/50 hover:shadow-green-500/25"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-green-500 mt-1 px-1 font-mono">
                    [{formatTime(msg.timestamp)}]
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-2 animate-in slide-in-from-bottom-3 fade-in duration-300">
                <div className="w-8 h-8 bg-black text-green-400 border border-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-900 border border-green-500/50 p-3 rounded-2xl rounded-bl-md animate-pulse">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                    <span className="text-sm text-green-300 font-mono">Processing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-green-500/30 p-4 bg-black">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="root@terminal:~$ _"
                  className="w-full text-green-300 placeholder-green-500/70 p-3 pr-12 text-sm bg-gray-900 border border-green-500/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all max-h-32 min-h-[44px] font-mono"
                  rows="2"
                  style={{ 
                    height: 'auto',
                    minHeight: '44px',
                    maxHeight: '128px',
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                  }}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-green-500 text-black rounded-xl hover:bg-green-400 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex-shrink-0 border border-green-400 hover:shadow-lg hover:shadow-green-500/25"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-green-500 mt-2 text-center font-mono">
              [ENTER] to execute | [SHIFT+ENTER] for new line
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;