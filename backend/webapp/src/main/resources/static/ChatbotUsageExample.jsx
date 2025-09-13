import React, { useState } from 'react';
import ChatbotComponent from './ChatbotComponent';

// Example usage in your main App or any component
const App = () => {
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    
    // Example: Get current date range from your charts
    // This should come from your chart's date picker or filter component
    const [currentDateRange, setCurrentDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        to: new Date() // today
    });

    // Function to update date range when user changes chart filters
    const handleDateRangeChange = (from, to) => {
        setCurrentDateRange({ from, to });
        console.log('Date range updated:', from, 'to', to);
    };

    return (
        <div className="App">
            {/* Your existing app content */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Système de Gestion des Visiteurs
                        </h1>
                        <button
                            onClick={() => setIsChatbotOpen(true)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                        >
                            <span>🤖</span>
                            <span>Assistant</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Your existing content */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4">Tableau de bord</h2>
                    <p className="text-gray-600">
                        Bienvenue dans votre système de gestion des visiteurs. 
                        Cliquez sur le bouton "Assistant" en haut à droite pour obtenir de l'aide.
                    </p>
                    
                    {/* Example: Date range selector for charts */}
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                        <h3 className="font-semibold mb-2">Sélecteur de période (exemple)</h3>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleDateRangeChange(
                                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
                                    new Date()
                                )}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                            >
                                7 jours
                            </button>
                            <button 
                                onClick={() => handleDateRangeChange(
                                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
                                    new Date()
                                )}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                            >
                                30 jours
                            </button>
                            <button 
                                onClick={() => handleDateRangeChange(
                                    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), 
                                    new Date()
                                )}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                            >
                                90 jours
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            Période actuelle: {currentDateRange.from.toLocaleDateString()} - {currentDateRange.to.toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </main>

            {/* Chatbot Component with date range */}
            <ChatbotComponent
                isOpen={isChatbotOpen}
                onClose={() => setIsChatbotOpen(false)}
                position="bottom-right"
                currentDateRange={currentDateRange}
            />
        </div>
    );
};

// Alternative: Floating chat button
const FloatingChatButton = ({ onOpen }) => {
    return (
        <button
            onClick={onOpen}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
            style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
            }}
        >
            🤖
        </button>
    );
};

// Example with floating button
const AppWithFloatingButton = () => {
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    return (
        <div className="App">
            {/* Your existing app content */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Système de Gestion des Visiteurs
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Your existing content */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4">Tableau de bord</h2>
                    <p className="text-gray-600">
                        Bienvenue dans votre système de gestion des visiteurs. 
                        Cliquez sur le bouton flottant en bas à droite pour ouvrir l'assistant.
                    </p>
                </div>
            </main>

            {/* Floating chat button */}
            <FloatingChatButton onOpen={() => setIsChatbotOpen(true)} />

            {/* Chatbot Component */}
            <ChatbotComponent
                isOpen={isChatbotOpen}
                onClose={() => setIsChatbotOpen(false)}
                position="bottom-right"
            />
        </div>
    );
};

export default App;
export { AppWithFloatingButton }; 