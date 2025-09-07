AI Journalist Agents

A React-based AI-powered news platform that allows users to analyze, summarize, and explore news intelligently. This application leverages AI to provide fact-checking, bias detection, summarization, translation, and related news discovery based on URLs or topics.

Features

Fact-Checking: Verify the authenticity of news articles and detect misinformation.

Bias Detection: Analyze news content to detect potential political or ideological bias.

Summarization: Generate concise summaries of news articles for quick understanding.

Translation: Translate news articles into multiple languages to reach a global audience.

Related News: Discover news articles related to a given URL or specific topic.

Topic Search: Explore news articles based on user-defined topics.

Tech Stack

Frontend: React.js, Redux (for state management), Axios (API requests)

UI Components: React-icons, Lucide-react, React-hot-toast

Backend: API-based integration with AI services for NLP tasks

AI Services: Fact-checking, bias detection, summarization, translation

Screenshots


Home page with news feed and AI analysis options.


Fact-check result for a news article.


Bias analysis visualization.


Translated news content.

Installation

Clone the repository:

git clone https://github.com/yourusername/ai-news-assistant.git


Navigate to the project directory:

cd ai-news-assistant


Install dependencies:

npm install


Create a .env file and add your API keys for AI services:

REACT_APP_FACT_CHECK_API=your_api_key
REACT_APP_BIAS_DETECTION_API=your_api_key
REACT_APP_SUMMARIZER_API=your_api_key
REACT_APP_TRANSLATOR_API=your_api_key
REACT_APP_RELATED_NEWS_API=your_api_key


Run the app:

npm start


The app will be available at http://localhost:3000.

Usage

Enter a news article URL or a topic in the search bar.

Choose the AI task you want: Fact-Check, Bias Detection, Summarize, Translate, or Related News.

View the AI-generated insights and explore related articles.

Future Enhancements

Add user authentication to save and bookmark news articles.

Include multimedia analysis (images, videos) for richer insights.

Improve real-time news updates from multiple sources.

Contributing

Contributions are welcome! Please submit a pull request or open an issue for suggestions.

License

This project is licensed under the MIT License.