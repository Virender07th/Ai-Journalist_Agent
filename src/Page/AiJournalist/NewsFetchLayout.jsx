import React, { useState, useEffect } from "react";
import {
  Globe,
  Clock,
  Send,
  CheckCircle,
  TrendingUp,
  Newspaper,
  Zap,
  Calendar,
} from "lucide-react";
import { fetchNews } from "../../Service/Operations/AiOperation";
import { useDispatch } from "react-redux";

// Enhanced mock news data with all required fields
const mockNewsData = [
  {
    id: "1",
    heading: "Quantum Computing Breakthrough Promises Unbreakable Encryption",
    description: "Researchers have developed a new quantum algorithm that could render current encryption methods obsolete, paving the way for a new era of secure communication.",
    url: "https://example.com/quantum-breakthrough",
    image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&h=250&fit=crop&crop=center",
    publisher: "TechCrunch",
    publishedAt: "2025-09-06T08:30:00Z",
    tone: "Positive",
    category: "AI",
    source: "Tech Journal",
  },
  {
    id: "2",
    heading: "Global Stock Markets Face Volatility Amid New Regulations",
    description: "New international trade regulations have introduced significant uncertainty into the global stock markets, with analysts predicting a period of increased volatility.",
    url: "https://example.com/market-volatility",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&crop=center",
    publisher: "Reuters",
    publishedAt: "2025-09-06T07:45:00Z",
    tone: "Negative",
    category: "Business",
    source: "Financial Times",
  },
  {
    id: "3",
    heading: "NASA's Artemis Mission Successfully Launches Orion Spacecraft",
    description: "The Orion spacecraft is now on its way to the Moon as part of the Artemis program, marking a major milestone in humanity's return to lunar exploration.",
    url: "https://example.com/artemis-launch",
    image: "https://images.unsplash.com/photo-1630514933924-7386765792e3?w=400&h=250&fit=crop&crop=center",
    publisher: "Associated Press",
    publishedAt: "2025-09-06T09:00:00Z",
    tone: "Neutral",
    category: "Space",
    source: "NASA TV",
  },
];


const NewsFetchLayout = () => {
  const [topic, setTopic] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [fetchStage, setFetchStage] = useState("");
  const [newsData, setNewsData] = useState([]);
  const dispatch = useDispatch();

  // WhatsApp scheduling states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [enableScheduling, setEnableScheduling] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState("");
  const [articlesCount, setArticlesCount] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [scheduleId, setScheduleId] = useState(null);

  const interests = [
    { id: "ai", label: "AI & Technology", icon: "🤖" },
    { id: "space", label: "Space & Science", icon: "🚀" },
    { id: "business", label: "Business & Finance", icon: "💼" },
    { id: "health", label: "Health & Medicine", icon: "🏥" },
    { id: "sports", label: "Sports", icon: "⚽" },
    { id: "entertainment", label: "Entertainment", icon: "🎬" },
    { id: "politics", label: "Politics", icon: "🏛️" },
    { id: "climate", label: "Climate & Environment", icon: "🌍" },
  ];

  const fetchStages = [
    "Searching news sources...",
    "Analyzing content relevance...",
    "AI processing summaries...",
    "Categorizing articles...",
    "Filtering by quality...",
    "Finalizing results...",
  ];

  useEffect(() => {
    if (!loading) return;

    let currentStage = 0;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10 + 5;

        if (
          currentStage < fetchStages.length &&
          newProgress > (currentStage + 1) * 16
        ) {
          setFetchStage(fetchStages[currentStage]);
          currentStage++;
        }

        if (newProgress >= 100) {
          clearInterval(timer);
          setProgress(100);
          setFetchStage("News fetch complete!");
        }
        return Math.min(newProgress, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [loading, fetchStages]);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic or URL to fetch news");
      return;
    }

    setError("");
    setProgress(0);
    setFetchStage("Initializing news search...");
    setLoading(true);
    setDone(false);
    setNewsData([]);

    try {
    
      
      const payload = { topic, num_articles: 3 };
      const result = await dispatch(fetchNews(payload));

      if (result?.success) {
        setNewsData(result.data.articles);
        
      } 
    } catch (err) {
      console.error("Fetch News error:", err);
      setError("Failed to fetch news. Please try again. Displaying mock data.");
      setNewsData(mockNewsData);
    } finally {
      setLoading(false);
      setDone(true);
    }
  };

  const handleScheduleSetup = () => {
    if (!phoneNumber || !scheduledTime || selectedInterests.length === 0) {
      setScheduleStatus(
        "Please enter phone number, select time, and choose at least one interest"
      );
      return;
    }

    // Generate a unique schedule ID
    const newScheduleId = `schedule_${Date.now()}`;
    setScheduleId(newScheduleId);
    setEnableScheduling(true);

    const interestLabels = selectedInterests
      .map((id) => interests.find((interest) => interest.id === id)?.label)
      .join(", ");

    setScheduleStatus(
      `✓ Daily news scheduled: ${articlesCount} articles about ${interestLabels} at ${scheduledTime} to ${phoneNumber}`
    );

    // In a real implementation, you would set up the Twilio cron job here
    console.log("Setting up Twilio WhatsApp schedule:", {
      scheduleId: newScheduleId,
      phone: phoneNumber,
      time: scheduledTime,
      interests: selectedInterests,
      articlesCount: articlesCount,
    });
  };

  const handleScheduleCancel = () => {
    setEnableScheduling(false);
    setScheduleStatus("Schedule cancelled successfully");
    setScheduleId(null);

    // In a real implementation, you would cancel the Twilio cron job here
    console.log("Cancelling Twilio WhatsApp schedule:", scheduleId);

    // Clear status after 3 seconds
    setTimeout(() => setScheduleStatus(""), 3000);
  };

  const handleInterestToggle = (interestId) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSendNow = () => {
    if (newsData.length === 0) return;

    const articlesToSend = newsData.slice(0, articlesCount);
    console.log("Sending immediate WhatsApp message:", {
      phone: phoneNumber,
      articles: articlesToSend,
      timestamp: new Date().toISOString(),
    });

    setScheduleStatus(
      `✓ Sent ${articlesToSend.length} articles to ${phoneNumber} immediately`
    );

    // Clear status after 3 seconds
    setTimeout(() => setScheduleStatus(""), 3000);
  };

  const getToneColor = (tone) => {
    switch (tone?.toLowerCase()) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200";
      case "negative":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "ai":
        return <Zap className="w-4 h-4" />;
      case "space":
        return <Globe className="w-4 h-4" />;
      case "legal":
        return <CheckCircle className="w-4 h-4" />;
      case "business":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Newspaper className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight leading-tight mb-6">
          AI-Powered News Fetcher
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Instantly fetch, analyze, and schedule AI-curated news from trusted
          sources. Set up automated WhatsApp delivery for daily updates.
        </p>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { icon: Newspaper, text: "AI Curation" },
            { icon: Send, text: "WhatsApp Delivery" },
            { icon: Calendar, text: "Auto Scheduling" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200"
            >
              <Icon size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-1 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-white/80    backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  News Search
                </h2>
                <p className="text-gray-600">
                  Enter topic or URL for AI-powered news fetching
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., AI technology, climate change, https://news.com/article"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                  required
                />
              </div>

              <button
                onClick={SubmitHandler}
                disabled={loading || !topic.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Fetching News...
                  </>
                ) : (
                  <>
                    <Newspaper size={20} />
                    Fetch AI-Curated News
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <CheckCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Scheduling Section */}
          {/* <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Send className="text-green-600" size={24} />
              WhatsApp Scheduling
            </h3>

            <div className="space-y-6">
           
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number (with country code)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

         
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Daily Delivery Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Articles per Day
                  </label>
                  <select
                    value={articlesCount}
                    onChange={(e) => setArticlesCount(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value={1}>1 Article</option>
                    <option value={3}>3 Articles</option>
                    <option value={5}>5 Articles</option>
                    <option value={10}>10 Articles</option>
                  </select>
                </div>
              </div>

        
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Your Interests ({selectedInterests.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        selectedInterests.includes(interest.id)
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 bg-white/70 text-gray-600 hover:border-green-300 hover:bg-green-50/50"
                      }`}
                    >
                      <span>{interest.icon}</span>
                      <span className="text-xs">{interest.label}</span>
                    </button>
                  ))}
                </div>
              </div>

          
              <div className="space-y-3">
                {!enableScheduling ? (
                  <button
                    onClick={handleScheduleSetup}
                    disabled={
                      !phoneNumber ||
                      !scheduledTime ||
                      selectedInterests.length === 0
                    }
                    className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Clock size={18} />
                    Setup Daily News Schedule
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleScheduleCancel}
                      className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Cancel Schedule
                    </button>
                    <button
                      onClick={handleSendNow}
                      disabled={newsData.length === 0}
                      className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <Send size={16} />
                      Send Latest News Now
                    </button>
                  </div>
                )}
              </div>

        
              {scheduleStatus && (
                <div
                  className={`p-4 border rounded-xl ${
                    scheduleStatus.includes("✓")
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <p className="text-sm font-medium">{scheduleStatus}</p>
                  {enableScheduling && (
                    <div className="mt-2 text-xs text-green-600">
                      <p>• Schedule ID: {scheduleId}</p>
                      <p>• Next delivery: Tomorrow at {scheduledTime}</p>
                    </div>
                  )}
                </div>
              )}

              {enableScheduling && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    Active Schedule
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📱 Phone: {phoneNumber}</p>
                    <p>⏰ Time: {scheduledTime} daily</p>
                    <p>📰 Articles: {articlesCount} per day</p>
                    <p>
                      🎯 Interests:{" "}
                      {selectedInterests
                        .map(
                          (id) =>
                            interests.find((interest) => interest.id === id)
                              ?.icon
                        )
                        .join(" ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div> */}
        </div>

        {/* Progress Section */}
        {loading && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">
                  Fetching News
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 italic flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" />
                {fetchStage}
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Results Section */}
        {!loading && newsData.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Latest News Results
              </h2>
              <p className="text-gray-600">
                AI-curated articles matching your search
              </p>
            </div>

            <div className="grid gap-6">
              {newsData.map((article) => (
                <div
                  key={article.id}
                  className="bg-white/90 border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image Section */}
                    <div className="lg:w-80 h-48 lg:h-auto">
                      <img
                        src={ `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}` || article.image}
                        alt={article.heading}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop&crop=center";
                        }}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 space-y-4">
                      {/* Heading */}
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight hover:text-blue-600 cursor-pointer transition-colors">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {article.heading}
                        </a>
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                        {article.description}
                      </p>

                      {/* Article Metadata */}
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-700">
                                Publisher:
                              </span>
                              <span className="text-gray-600">
                                {article.publisher}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-700">
                                Published At:
                              </span>
                              <span className="text-gray-600">
                                {new Date(article.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-700">
                                Tone:
                              </span>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full border ${getToneColor(
                                  article.tone
                                )}`}
                              >
                                {article.tone}
                              </span>
                            </div>
                            
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-700">
                                Category:
                              </span>
                              <span className="text-gray-600 flex items-center gap-1.5">
                                {getCategoryIcon(article.category)}
                                {article.category}
                              </span>
                            </div>
                            
                            {/* <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-700">
                                Source:
                              </span>
                              <span className="text-gray-600  ">
                                {article.source}
                              </span>
                            </div> */}
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-700">
                                URL:
                              </span>
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline truncate max-w-48"
                              >
                                {article.url
                                  .replace("https://", "")
                                  .split("/")[0]}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags and Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex gap-2">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            <Globe size={14} />
                            Read Full Article
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Delivery Status */}
            {enableScheduling && (
              <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                  <Send className="text-green-600" size={20} />
                  WhatsApp Delivery Active
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-green-700">
                    📱 Delivering {articlesCount} articles daily to{" "}
                    <strong>{phoneNumber}</strong> at{" "}
                    <strong>{scheduledTime}</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-green-600 font-medium">
                      Interests:
                    </span>
                    {selectedInterests.map((id) => {
                      const interest = interests.find((i) => i.id === id);
                      return (
                        <span
                          key={id}
                          className="px-2 py-1 bg-white/70 border border-green-200 rounded-md text-xs font-medium text-green-700"
                        >
                          {interest?.icon} {interest?.label}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleSendNow}
                      disabled={newsData.length === 0}
                      className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Send size={16} />
                      Send Now ({Math.min(articlesCount, newsData.length)}{" "}
                      articles)
                    </button>
                    <button
                      onClick={handleScheduleCancel}
                      className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Cancel Schedule
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-8">
              <p className="text-xs text-gray-500 mb-2">
                News articles are AI-curated and analyzed. WhatsApp delivery
                powered by Twilio API for reliable daily updates.
              </p>
              <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} />
                  Secure Delivery
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Timezone Support
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={12} />
                  AI Filtering
                </span>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {done && !loading && newsData.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No News Found
            </h3>
            <p className="text-gray-600">
              Try a different topic or check your URL format
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFetchLayout;