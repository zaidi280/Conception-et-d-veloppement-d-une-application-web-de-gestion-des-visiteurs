# Chatbot Implementation

## Overview
This chatbot implementation provides an intelligent assistant for the visitor management system. It allows users to ask questions about visitors, statistics, and analytics in natural language.

## Features

### 🤖 Chatbot Capabilities
- **Statistics Queries**: Ask about visitor counts, daily statistics, and trends
- **Search Functionality**: Find specific visitors by name, CIN, or other criteria
- **Analytics**: Get insights about peak hours, visit durations, and visitor types
- **Real-time Data**: Access current visitor status and active visitors
- **Natural Language**: Support for both French and English queries

### 💬 User Interface
- **Floating Chat Button**: Always accessible chatbot icon in the bottom-right corner
- **Modern Chat Interface**: Clean, responsive design with message bubbles
- **Quick Suggestions**: Clickable suggestion buttons for common queries
- **Real-time Responses**: Instant feedback with loading indicators
- **Error Handling**: Graceful error handling with user-friendly messages

## Technical Implementation

### Backend Integration
The chatbot connects to your Spring Boot backend through these endpoints:

- **HTTP Endpoint**: `POST /api/chatbot/query` - Main chat functionality
- **Health Check**: `GET /api/chatbot/health` - Service status
- **Capabilities**: `GET /api/chatbot/capabilities` - Available features
- **WebSocket**: `/ws` - Real-time communication (optional)

### Frontend Components

#### Core Components
- `Chatbot.jsx` - Main chatbot component with state management
- `ChatbotIcon.jsx` - Floating action button with animations
- `ChatWindow.jsx` - Chat interface with input and message display
- `MessageBubble.jsx` - Individual message display with formatting
- `SuggestionButtons.jsx` - Quick response suggestion buttons

#### Service Layer
- `chatbotService.js` - API communication and WebSocket handling

## Usage Examples

### Basic Queries
```
"Combien de visiteurs aujourd'hui?"
"How many visitors today?"
"Chercher le visiteur Jean Dupont"
"Find visitor John Smith"
```

### Analytics Queries
```
"Heures de pointe"
"Peak hours"
"Durée des visites"
"Visit duration analysis"
"Répartition par type"
"Visitor type distribution"
```

### Status Queries
```
"Visiteurs actuellement présents"
"Currently active visitors"
"Qui est encore là?"
"Who is still here?"
```

## Configuration

### Environment Variables
Make sure your `.env` file includes:
```
VITE_API_BASE_URL=http://localhost:9011
```

### Authentication
The chatbot automatically includes JWT authentication tokens from localStorage for all API requests.

## Features in Detail

### 1. Natural Language Processing
- Supports both French and English queries
- Intelligent query analysis and categorization
- Context-aware responses

### 2. Data Visualization
- Displays visitor data in structured format
- Shows analytics and statistics
- Presents chart data when available

### 3. User Experience
- Smooth animations and transitions
- Responsive design for all screen sizes
- Loading states and error handling
- Auto-scroll to latest messages

### 4. Integration
- Seamlessly integrated into existing layout
- Appears on all protected pages
- Maintains session state across page navigation

## API Response Format

The chatbot expects responses in this format:
```json
{
  "response": "Formatted response text with markdown support",
  "sessionId": "unique-session-id",
  "visitors": [...], // Optional visitor data
  "analytics": {...}, // Optional analytics data
  "charts": [...], // Optional chart data
  "queryType": "TODAY_VISITORS",
  "confidence": "HIGH",
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}
```

## Styling and Theming

The chatbot uses a consistent color scheme matching your application:
- Primary: `#2c5530` (Dark Green)
- Secondary: `#4CAF50` (Green)
- Background: `#f8f9fa` (Light Gray)
- Text: `#333` (Dark Gray)

## Browser Compatibility

- Modern browsers with ES6+ support
- WebSocket support for real-time features
- Responsive design for mobile devices

## Troubleshooting

### Common Issues

1. **Chatbot not appearing**: Check if user is authenticated
2. **API errors**: Verify backend is running and accessible
3. **WebSocket issues**: Check CORS configuration on backend
4. **Styling issues**: Ensure FontAwesome is loaded

### Debug Mode
Enable console logging by checking browser developer tools for detailed error messages.

## Future Enhancements

- Voice input/output support
- Advanced analytics queries
- Multi-language support expansion
- Integration with external data sources
- Machine learning improvements for query understanding 