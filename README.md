# AI Journalist Agents

**AI Journalist Agents** is a React-based, AI-powered news platform that enables users to analyze, summarize, and explore news intelligently. The application leverages advanced AI capabilities to provide fact-checking, bias detection, summarization, translation, and related news discovery based on URLs or topics.

---

## Features

- **Fact-Checking**: Verify the authenticity of news articles and detect misinformation from multiple sources.  
- **Bias Detection**: Analyze news content to identify potential political, ideological, or regional bias.  
- **Summarization**: Generate concise and easy-to-read summaries of news articles for quick understanding.  
- **Translation**: Translate news articles into multiple languages to make content accessible globally.  
- **Related News**: Discover news articles related to a given URL or specific topic for comprehensive coverage.  
- **Topic Search**: Explore news articles based on user-defined topics for personalized insights.  

---

## Tech Stack

### Frontend
- **React.js**: Build the user interface  
- **Redux**: State management  
- **Axios**: API requests  
- **UI Components**: React-icons, Lucide-react, React-hot-toast, Tailwind CSS  

### Backend
- **Node.js**: Server-side runtime  
- **Express.js**: REST API framework  
- **MongoDB**: Database for storing users, news, and analytics  
- **News APIs**: Google RSS, News.org  
- **Authentication & Authorization**: JWT-based secure login and role-based access control  

### AI Backend
- **FastAPI**: Serving AI endpoints  
- **LangChain**: Embeddings, RAG, and AI pipelines  
- **Gemini / Other AI APIs**: Fact-checking, bias detection, summarization, translation, and related news  
- **Uvicorn**: ASGI server for FastAPI  

### Backend & AI Integration
- **API-based Integration**: Backend connects with AI services for processing and delivering results  
- **AI Services**: Fact-checking, bias detection, summarization, translation, and related news discovery  

---

## Usage

1. Enter a news article URL or a topic to analyze.  
2. Choose an AI task: Fact-Check, Bias Detection, Summarize, Translate, or Related News.  
3. View AI-generated insights and explore related articles.  
4. Optionally, save articles to your profile and track activity statistics.  

