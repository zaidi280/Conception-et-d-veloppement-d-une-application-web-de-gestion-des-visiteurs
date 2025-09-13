import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ChatbotComponent = ({ isOpen, onClose, position = 'bottom-right', currentDateRange = null }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [stompClient, setStompClient] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Generate session ID
    const generateSessionId = () => {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    };

    // Connect to WebSocket
    const connectWebSocket = () => {
        const socket = new SockJS('/ws');
        const client = Stomp.over(socket);
        
        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            setIsConnected(true);
            setStompClient(client);
            
            // Subscribe to private messages
            client.subscribe('/user/queue/chatbot', (response) => {
                const message = JSON.parse(response.body);
                handleBotMessage(message);
            });
            
            // Subscribe to broadcast messages
            client.subscribe('/topic/chatbot', (response) => {
                const message = JSON.parse(response.body);
                handleBotMessage(message);
            });
            
            // Send welcome message
            setTimeout(() => {
                sendMessage("aide");
            }, 1000);
            
        }, (error) => {
            console.log('STOMP error: ' + error);
            setIsConnected(false);
            setTimeout(connectWebSocket, 5000); // Retry connection
        });
    };

    // Send message
    const sendMessage = (message) => {
        if (!stompClient || !stompClient.connected) {
            console.log('Not connected to WebSocket');
            return;
        }

        const request = {
            message: message,
            sessionId: sessionId || generateSessionId(),
            dateFrom: currentDateRange?.from ? currentDateRange.from.toISOString().split('T')[0] : null,
            dateTo: currentDateRange?.to ? currentDateRange.to.toISOString().split('T')[0] : null
        };

        console.log('Sending request with date range:', request.dateFrom, 'to', request.dateTo);

        // Send via WebSocket
        stompClient.send("/app/chat/private", {}, JSON.stringify(request));
        
        // Also send via HTTP as fallback
        fetch('/api/chatbot/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        }).catch(error => {
            console.error('HTTP fallback error:', error);
        });
    };

    // Handle user message
    const handleUserMessage = (message) => {
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: message,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        sendMessage(message);
    };

    // Handle bot message
    const handleBotMessage = (response) => {
        const botMessage = {
            id: Date.now(),
            type: 'bot',
            content: response.response,
            visitors: response.visitors,
            analytics: response.analytics,
            suggestions: response.suggestions,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
        handleUserMessage(suggestion);
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setSessionId(generateSessionId());
            connectWebSocket();
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [isOpen]);

    useEffect(() => {
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [stompClient]);

    if (!isOpen) return null;

    const positionClasses = {
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4'
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-50`}>
            <div className="bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">🤖 Assistant Visiteur</h3>
                            <p className="text-sm opacity-90">Posez vos questions sur les visiteurs</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex items-center mt-2">
                        <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-xs">{isConnected ? 'Connecté' : 'Déconnecté'}</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.map((message) => (
                        <div key={message.id} className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.type === 'user' 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                                    : 'bg-white text-gray-800 border border-gray-200'
                            }`}>
                                <div className="text-sm">{message.content}</div>
                                
                                {/* Visitor list */}
                                {message.visitors && message.visitors.length > 0 && (
                                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                                        <strong>Visiteurs trouvés:</strong>
                                        {message.visitors.slice(0, 3).map((visitor, index) => (
                                            <div key={index} className="mt-1">
                                                {visitor.prenom} {visitor.nom} ({visitor.cin})
                                            </div>
                                        ))}
                                        {message.visitors.length > 3 && (
                                            <div className="mt-1 text-gray-600">
                                                ... et {message.visitors.length - 3} autres
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Analytics data */}
                                {message.analytics && (
                                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                                        <strong>Données analytiques:</strong>
                                        {Object.entries(message.analytics).map(([key, value]) => (
                                            <div key={key} className="mt-1">
                                                {key}: {value}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Suggestions */}
                                {message.suggestions && message.suggestions.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {message.suggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="px-2 py-1 bg-gray-200 hover:bg-blue-500 hover:text-white rounded-full text-xs transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (inputMessage.trim()) {
                            handleUserMessage(inputMessage);
                            setInputMessage('');
                        }
                    }}>
                        <div className="flex space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Posez votre question..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={!isConnected}
                            />
                            <button
                                type="submit"
                                disabled={!isConnected || !inputMessage.trim()}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            >
                                ➤
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatbotComponent; 