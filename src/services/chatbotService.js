import config from '../config/config';

class ChatbotService {
  constructor() {
    this.baseURL = config.API_BASE_URL;
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // HTTP endpoint for chatbot queries
  async sendMessage(message, dateFrom = null, dateTo = null) {
    try {
      const token = localStorage.getItem(config.JWT_STORAGE_KEY);
      
      const requestBody = {
        message: message,
        sessionId: this.sessionId,
        dateFrom: dateFrom,
        dateTo: dateTo
      };

      console.log('Chatbot request with date range:', { message, dateFrom, dateTo });

      const response = await fetch(`${this.baseURL}/api/chatbot/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  }

  // Get chatbot capabilities
  async getCapabilities() {
    try {
      const token = localStorage.getItem(config.JWT_STORAGE_KEY);
      
      const response = await fetch(`${this.baseURL}/api/chatbot/capabilities`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error getting chatbot capabilities:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const token = localStorage.getItem(config.JWT_STORAGE_KEY);
      
      const response = await fetch(`${this.baseURL}/api/chatbot/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error checking chatbot health:', error);
      throw error;
    }
  }

  // WebSocket connection for real-time chat
  connectWebSocket(onMessage, onError, onClose, dateFrom = null, dateTo = null) {
    const token = localStorage.getItem(config.JWT_STORAGE_KEY);
    const wsUrl = this.baseURL.replace('http', 'ws') + '/ws';
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      // Subscribe to chatbot topic
      socket.send(JSON.stringify({
        destination: '/app/chat',
        body: JSON.stringify({
          message: 'Hello',
          sessionId: this.sessionId,
          dateFrom: dateFrom,
          dateTo: dateTo
        })
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError(error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      onClose();
    };

    return socket;
  }

  // Send message via WebSocket
  sendWebSocketMessage(socket, message, dateFrom = null, dateTo = null) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageObj = {
        destination: '/app/chat',
        body: JSON.stringify({
          message: message,
          sessionId: this.sessionId,
          dateFrom: dateFrom,
          dateTo: dateTo
        })
      };
      socket.send(JSON.stringify(messageObj));
    }
  }

  // Reset session
  resetSession() {
    this.sessionId = this.generateSessionId();
  }
}

export default new ChatbotService(); 