import React, { useState, useEffect, useRef } from 'react';
import ChatbotIcon from './ChatbotIcon';
import ChatWindow from './ChatWindow';
import chatbotService from '../../services/chatbotService';
import { useDateRange } from '../../contexts/DateRangeContext';

const Chatbot = () => {
  const { dateFrom, dateTo } = useDateRange();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize chatbot with welcome message
    if (isOpen && messages.length === 0) {
      addMessage({
        type: 'bot',
        content: "🤖 **Assistant Visiteur**\n\nBonjour! Je suis votre assistant pour la gestion des visiteurs. Je peux vous aider avec:\n\n📊 **Statistiques:** Nombre de visiteurs, analyses\n🔍 **Recherche:** Trouver des visiteurs spécifiques\n📈 **Analyses:** Heures de pointe, durée des visites\n🟢 **État actuel:** Visiteurs présents\n\nPosez votre question en français ou en anglais!",
        timestamp: new Date(),
        suggestions: ["Combien de visiteurs aujourd'hui?", "Chercher un visiteur", "Heures de pointe", "Aide"]
      });
    }
  }, [isOpen, messages.length]);

  // Add context-aware message handling
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    addMessage(userMessage);

    setIsLoading(true);
    setError(null);

    try {
      // Enhanced context detection and query preprocessing
      const lastBotMessage = messages.filter(m => m.type === 'bot').pop();
      let processedMessage = message;
      
      // Handle help requests first (highest priority) - before any other processing
      const userMessageLower = message.toLowerCase();
      if (userMessageLower === 'aide' || 
          userMessageLower === 'help' || 
          userMessageLower.includes('que puis-je') ||
          userMessageLower.includes('what can')) {
        processedMessage = 'aide';
      }
      // Only do other preprocessing if it's not a help request
      else if (lastBotMessage) {
        const lastContent = lastBotMessage.content.toLowerCase();
        const userMessage = message.toLowerCase();
        
        // Check for search context
        if (lastContent.includes('terme de recherche') || 
            lastContent.includes('spécifier un visiteur') ||
            lastContent.includes('nom, prénom, ou cin') ||
            lastContent.includes('aucun visiteur trouvé')) {
          if (!userMessage.includes('chercher') && 
              !userMessage.includes('search') && 
              !userMessage.includes('trouver')) {
            processedMessage = `chercher ${message}`;
          }
        }
        
        // Check for history context
        else if (lastContent.includes('historique') && 
                 (lastContent.includes('spécifier') || lastContent.includes('visiteur'))) {
          if (!userMessage.includes('historique') && 
              !userMessage.includes('history')) {
            processedMessage = `historique ${message}`;
          }
        }
        
        // Check for visitor type context
        else if (lastContent.includes('type de visiteur') || 
                 lastContent.includes('catégorie')) {
          if (!userMessage.includes('type') && 
              !userMessage.includes('catégorie')) {
            processedMessage = `type ${message}`;
          }
        }
        
        // Check for general clarification context
        else if (lastContent.includes('ne comprends pas') || 
                 lastContent.includes('exemples de questions')) {
          // Don't modify the message, let the backend handle it
          processedMessage = message;
        }
      }
      
            // Query preprocessing for better recognition (only if not already processed as help)
      if (processedMessage !== 'aide') {
        // Handle "Statistiques de la semaine" and similar phrases
        if (userMessageLower.includes('statistiques') && 
            (userMessageLower.includes('semaine') || userMessageLower.includes('semaine'))) {
          processedMessage = 'combien de visiteurs cette semaine';
        }
        else if (userMessageLower.includes('statistiques') && 
                 (userMessageLower.includes('mois') || userMessageLower.includes('mois'))) {
          processedMessage = 'combien de visiteurs ce mois';
        }
        else if (userMessageLower.includes('statistiques') && 
                 (userMessageLower.includes('jour') || userMessageLower.includes('jour'))) {
          processedMessage = 'combien de visiteurs aujourd\'hui';
        }
        else if (userMessageLower.includes('statistiques') && 
                 (userMessageLower.includes('année') || userMessageLower.includes('année'))) {
          processedMessage = 'combien de visiteurs cette année';
        }
        // Handle "Historique de [name]" pattern
        else if (userMessageLower.includes('historique de') || userMessageLower.includes('historique du')) {
          const nameMatch = message.match(/historique de\s+(.+)/i) || message.match(/historique du\s+(.+)/i);
          if (nameMatch) {
            processedMessage = `historique ${nameMatch[1].trim()}`;
          }
        }
        // Handle "Chercher [name]" pattern
        else if (userMessageLower.includes('chercher') || userMessageLower.includes('trouver')) {
          const nameMatch = message.match(/chercher\s+(.+)/i) || message.match(/trouver\s+(.+)/i);
          if (nameMatch) {
            processedMessage = `chercher ${nameMatch[1].trim()}`;
          }
        }
        // Handle "Combien de fois [name] est venu" pattern
        else if (userMessageLower.includes('combien de fois') && userMessageLower.includes('venu')) {
          const nameMatch = message.match(/combien de fois\s+(.+?)\s+est\s+venu/i);
          if (nameMatch) {
            processedMessage = `historique ${nameMatch[1].trim()}`;
          }
        }
        // Handle "Qui est présent" or "Visiteurs présents" patterns
        else if (userMessageLower.includes('qui est présent') || 
                 userMessageLower.includes('visiteurs présents') ||
                 userMessageLower.includes('encore là')) {
          processedMessage = 'visiteurs actuellement présents';
        }
        // Handle "Heures de pointe" or "Pic d'affluence" patterns
        else if (userMessageLower.includes('heures de pointe') || 
                 userMessageLower.includes('pic d\'affluence') ||
                 userMessageLower.includes('moment le plus fréquenté')) {
          processedMessage = 'heures de pointe';
        }
        // Handle "Durée des visites" or "Temps passé" patterns
        else if (userMessageLower.includes('durée des visites') || 
                 userMessageLower.includes('temps passé') ||
                 userMessageLower.includes('longtemps')) {
          processedMessage = 'durée des visites';
        }
        // Handle "Type de visiteurs" or "Catégorie" patterns
        else if (userMessageLower.includes('type de visiteurs') || 
                 userMessageLower.includes('catégorie de visiteurs') ||
                 userMessageLower.includes('répartition')) {
          processedMessage = 'type de visiteurs';
        }
        // Handle "Heures d'entrée" or "Moment d'arrivée" patterns
        else if (userMessageLower.includes('heures d\'entrée') || 
                 userMessageLower.includes('moment d\'arrivée') ||
                 userMessageLower.includes('quand arrivent')) {
          processedMessage = 'heures d\'entrée';
        }
        // Handle "Aujourd'hui" or "Ce jour" patterns
        else if (userMessageLower.includes('aujourd\'hui') || 
                 userMessageLower.includes('ce jour') ||
                 userMessageLower.includes('journée')) {
          processedMessage = 'combien de visiteurs aujourd\'hui';
        }
      }
      
      console.log('Sending chatbot message with date range:', { 
        originalMessage: message, 
        processedMessage, 
        dateFrom, 
        dateTo,
        lastBotMessage: lastBotMessage ? lastBotMessage.content.substring(0, 100) + '...' : 'none'
      });
      const response = await chatbotService.sendMessage(processedMessage, dateFrom, dateTo);
      
      console.log('Backend response:', {
        queryType: response.queryType,
        confidence: response.confidence,
        responseLength: response.response?.length
      });
      
      // Add bot response
      const botMessage = {
        type: 'bot',
        content: response.response,
        timestamp: new Date(),
        suggestions: response.suggestions || [],
        visitors: response.visitors || [],
        analytics: response.analytics || null,
        charts: response.charts || []
      };
      
      // If the backend didn't understand the query, try with a more generic approach
      if (response.queryType === 'UNKNOWN' && processedMessage !== message) {
        console.log('Backend didn\'t understand processed message, trying original message');
        try {
          const fallbackResponse = await chatbotService.sendMessage(message, dateFrom, dateTo);
          if (fallbackResponse.queryType !== 'UNKNOWN') {
            botMessage.content = fallbackResponse.response;
            botMessage.suggestions = fallbackResponse.suggestions || [];
            botMessage.visitors = fallbackResponse.visitors || [];
            botMessage.analytics = fallbackResponse.analytics || null;
            botMessage.charts = fallbackResponse.charts || [];
          }
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
        }
      }
      
      addMessage(botMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
      
      // Add error message
      const errorMessage = {
        type: 'bot',
        content: "❌ Désolé, j'ai rencontré une erreur. Veuillez vérifier votre connexion et réessayer.",
        timestamp: new Date(),
        isError: true
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset error when opening
      setError(null);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    chatbotService.resetSession();
  };

  return (
    <>
      {/* Chatbot Icon */}
      <ChatbotIcon 
        isOpen={isOpen} 
        onToggle={handleToggle}
        hasUnreadMessages={false} // You can implement unread message logic
      />

      {/* Chat Window */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSendMessage={handleSendMessage}
          onSuggestionClick={handleSuggestionClick}
          onClearChat={handleClearChat}
          onClose={() => setIsOpen(false)}
          messagesEndRef={messagesEndRef}
        />
      )}
    </>
  );
};

export default Chatbot; 