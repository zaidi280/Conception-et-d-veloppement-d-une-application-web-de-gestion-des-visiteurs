# 🤖 Assistant Visiteur - Chatbot System

## Vue d'ensemble

Ce système de chatbot intelligent est conçu pour votre application de gestion des visiteurs. Il permet aux utilisateurs de poser des questions en langage naturel et d'obtenir des informations détaillées sur les visiteurs, les statistiques et les analyses.

## Fonctionnalités

### 📊 **Statistiques et Analyses**
- **Visiteurs aujourd'hui**: Nombre total, actifs, partis
- **Statistiques par période**: Analyse sur des dates spécifiques
- **Répartition par type**: Docteurs, fournisseurs, visiteurs malades
- **Heures de pointe**: Analyse des périodes les plus fréquentées
- **Durée des visites**: Statistiques sur la durée moyenne des visites

### 🔍 **Recherche et Historique**
- **Recherche de visiteurs**: Par nom, prénom, CIN, matricule fiscal
- **Historique des visites**: Fréquence et détails des visites d'un visiteur
- **Statut en temps réel**: Visiteurs actuellement présents

### 💬 **Interface Intelligente**
- **Chat en temps réel**: Communication via WebSocket
- **Suggestions contextuelles**: Boutons de suggestions pour faciliter l'interaction
- **Affichage des données**: Listes de visiteurs, graphiques, analyses
- **Support multilingue**: Français et anglais

## Installation et Configuration

### 1. Dépendances

Les dépendances nécessaires sont déjà ajoutées dans le `pom.xml`:

```xml
<!-- WebSocket pour le chat en temps réel -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- Client OpenAI (optionnel pour IA avancée) -->
<dependency>
    <groupId>com.theokanning.openai-gpt3-java</groupId>
    <artifactId>service</artifactId>
    <version>0.18.2</version>
</dependency>
```

### 2. Configuration

Le système est automatiquement configuré avec:
- **WebSocket**: Endpoint `/ws` pour la communication en temps réel
- **REST API**: Endpoint `/api/chatbot/query` pour les requêtes HTTP
- **Base de données**: Accès direct aux données des visiteurs

### 3. Démarrage

1. **Démarrer l'application Spring Boot**:
   ```bash
   mvn spring-boot:run
   ```

2. **Accéder au chatbot**:
   - **Interface HTML**: `http://localhost:9011/chatbot.html`
   - **API REST**: `http://localhost:9011/api/chatbot/query`

## Utilisation

### Exemples de Questions

#### 📊 **Statistiques**
```
"Combien de visiteurs aujourd'hui?"
"Statistiques de la semaine"
"Nombre de visiteurs par type"
"Visiteurs actuellement présents"
```

#### 🔍 **Recherche**
```
"Chercher le visiteur Jean Dupont"
"Trouver le visiteur avec CIN 12345678"
"Historique de Marie Martin"
"Combien de fois Pierre est venu?"
```

#### 📈 **Analyses**
```
"Heures de pointe"
"Durée des visites"
"Répartition par type"
"Analyse temporelle"
```

### Intégration React

#### 1. Installer les dépendances React

```bash
npm install sockjs-client @stomp/stompjs
```

#### 2. Importer le composant

```jsx
import ChatbotComponent from './ChatbotComponent';

function App() {
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    return (
        <div>
            {/* Votre contenu existant */}
            
            {/* Bouton pour ouvrir le chatbot */}
            <button onClick={() => setIsChatbotOpen(true)}>
                🤖 Assistant
            </button>

            {/* Composant chatbot */}
            <ChatbotComponent
                isOpen={isChatbotOpen}
                onClose={() => setIsChatbotOpen(false)}
                position="bottom-right"
            />
        </div>
    );
}
```

#### 3. Bouton flottant (optionnel)

```jsx
const FloatingChatButton = ({ onOpen }) => (
    <button
        onClick={onOpen}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg"
    >
        🤖
    </button>
);
```

## API Endpoints

### POST `/api/chatbot/query`
Envoie une requête au chatbot.

**Request Body:**
```json
{
    "message": "Combien de visiteurs aujourd'hui?",
    "sessionId": "session_abc123",
    "dateFrom": "2024-01-01",
    "dateTo": "2024-01-31"
}
```

**Response:**
```json
{
    "response": "📊 Visiteurs d'aujourd'hui (15/01/2024):\n\n• Total des visiteurs: 25\n• Visiteurs actuellement présents: 8\n• Visiteurs partis: 17",
    "sessionId": "session_abc123",
    "visitors": [...],
    "analytics": {...},
    "queryType": "TODAY_VISITORS",
    "confidence": "HIGH",
    "suggestions": ["Voir les détails", "Analyse par type"]
}
```

### GET `/api/chatbot/health`
Vérifie l'état du service chatbot.

### GET `/api/chatbot/capabilities`
Liste toutes les capacités du chatbot.

## WebSocket

### Connexion
```javascript
const socket = new SockJS('/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
});
```

### Envoi de message
```javascript
stompClient.send("/app/chat/private", {}, JSON.stringify({
    message: "Combien de visiteurs aujourd'hui?",
    sessionId: "session_abc123"
}));
```

### Réception de messages
```javascript
stompClient.subscribe('/user/queue/chatbot', function (response) {
    const message = JSON.parse(response.body);
    console.log('Bot response:', message);
});
```

## Types de Requêtes Supportées

| Type de Requête | Mots-clés | Exemple |
|-----------------|-----------|---------|
| **TODAY_VISITORS** | aujourd'hui, today | "Combien de visiteurs aujourd'hui?" |
| **VISITOR_COUNT** | combien, nombre, total | "Statistiques de la semaine" |
| **SEARCH_VISITOR** | chercher, search, trouver | "Chercher Jean Dupont" |
| **VISITOR_HISTORY** | historique, history | "Historique de Marie" |
| **VISITOR_TYPE_ANALYSIS** | type, docteur, fournisseur | "Répartition par type" |
| **ENTRY_TIME_ANALYSIS** | heure, time, entrée | "Heures de pointe" |
| **VISIT_DURATION_ANALYSIS** | durée, duration | "Durée des visites" |
| **PEAK_HOURS** | pic, peak | "Heures de pointe" |
| **ACTIVE_VISITORS** | actif, présent | "Visiteurs actuellement présents" |
| **GENERAL_HELP** | aide, help | "Aide" |

## Personnalisation

### Ajouter de nouveaux types de requêtes

1. **Modifier `ChatbotService.java`**:
```java
private QueryAnalysis analyzeQuery(String message) {
    // Ajouter votre logique de détection
    if (containsAny(message, "votre_mot_cle")) {
        analysis.setQueryType("VOTRE_NOUVEAU_TYPE");
        analysis.setConfidence("HIGH");
    }
}
```

2. **Ajouter le handler**:
```java
case "VOTRE_NOUVEAU_TYPE":
    return handleYourNewQuery(sessionId, analysis);
```

### Personnaliser les réponses

Modifiez les méthodes de traitement dans `ChatbotService.java` pour adapter les réponses à vos besoins.

### Styling React

Le composant React utilise Tailwind CSS. Personnalisez les classes CSS pour adapter le design à votre application.

## Sécurité

- **Authentification**: Le chatbot respecte l'authentification existante
- **Validation**: Toutes les entrées sont validées
- **Session**: Gestion des sessions pour éviter les conflits
- **CORS**: Configuration appropriée pour les requêtes cross-origin

## Dépannage

### Problèmes courants

1. **WebSocket non connecté**:
   - Vérifiez que le serveur est démarré
   - Vérifiez les logs pour les erreurs de connexion

2. **Réponses vides**:
   - Vérifiez la base de données
   - Vérifiez les logs du service

3. **Erreurs de compilation**:
   - Vérifiez que toutes les dépendances sont installées
   - Vérifiez la version de Java (17+)

### Logs utiles

```bash
# Voir les logs du chatbot
tail -f logs/application.log | grep ChatbotService

# Voir les requêtes WebSocket
tail -f logs/application.log | grep WebSocket
```

## Support

Pour toute question ou problème:
1. Vérifiez les logs de l'application
2. Testez avec l'interface HTML standalone
3. Vérifiez la connectivité WebSocket
4. Consultez la documentation de l'API

---

**Développé pour le système de gestion des visiteurs** 🏥 