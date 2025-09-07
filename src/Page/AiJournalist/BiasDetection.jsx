import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, TrendingUp, Brain, BarChart3 } from "lucide-react";
import { useDispatch } from "react-redux";
import { biasDetection } from "../../Service/Operations/AiOperation"; // Import your API function
import Button from "../../Component/Button";

const BiasDetection = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ url: "", topic: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
  const [biasData, setBiasData] = useState(null);

  const analysisStages = [
    "Parsing content...",
    "Analyzing sentiment...",
    "Detecting keywords...",
    "Cross-referencing sources...",
    "Generating bias score...",
    "Finalizing report..."
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Real API call implementation
  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!formData.url.trim() && !formData.topic.trim()) {
      setError("Please enter some content to analyze");
      return;
    }
    
    setError("");
    setLoading(true);
    setDone(true);
    setProgress(0);
    setAnalysisStage("Initializing analysis...");
    setBiasData(null);

    // Start progress animation
    let currentStage = 0;
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 10 + 5, 90);
        
        if (currentStage < analysisStages.length && newProgress > (currentStage + 1) * 15) {
          setAnalysisStage(analysisStages[currentStage]);
          currentStage++;
        }
        
        return newProgress;
      });
    }, 300);

    try {
      // Prepare the payload to match your API expectations
      const payload = {
        topic: formData.topic || null,
        url: formData.url || null
      };

     

      // Call the API
      const response = await dispatch(biasDetection(payload));
      
      clearInterval(progressTimer);
      setProgress(100);
      setAnalysisStage("Analysis complete!");

      // Extract bias data from API response
      if (response.success && response.data && response.data.biasData) {
        setBiasData(response.data.biasData);
      } else {
        throw new Error("Invalid response format");
      }

    } catch (err) {
      clearInterval(progressTimer);
      setError(err.message || "Analysis failed. Please try again.");
      setDone(false);
    } finally {
      setLoading(false);
    }
  };

  const getBiasLevel = (score) => {
    if (score < 30) return { level: "Low", color: "green", bg: "bg-green-50", border: "border-green-200" };
    if (score < 60) return { level: "Moderate", color: "yellow", bg: "bg-yellow-50", border: "border-yellow-200" };
    return { level: "High", color: "red", bg: "bg-red-50", border: "border-red-200" };
  };

  const biasLevel = biasData ? getBiasLevel(biasData.overallScore) : null;

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight leading-tight mb-6">
          AI-Powered Bias Detection
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Uncover hidden biases in news articles and content using advanced AI sentiment analysis and political lean detection.
        </p>
        
        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { icon: Brain, text: "AI Analysis" },
            { icon: BarChart3, text: "Bias Scoring" },
            { icon: TrendingUp, text: "Sentiment Tracking" }
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Icon size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
           {/* Input */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <form onSubmit={SubmitHandler}>
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Content Analysis</h2>
                  <p className="text-gray-600">Enter your content below for bias detection</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Article URL
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="https://example.com/article"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="text-center">
                    <span className="bg-white px-4 py-2 text-gray-500 font-medium rounded-full text-sm">
                      — or —
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Article Content
                    </label>
                    <textarea
                      name="topic"
                      rows={8}
                      value={formData.topic}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Paste your article content here..."
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-200 hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{formData.topic.length} characters</span>
                      <span>Min 50 characters recommended</span>
                    </div>
                  </div>
                </div>

                <Button
                  content={loading ? "Analyzing Content..." : "Detect Bias"}
                  condition={
                    !loading &&
                    (formData.url.trim() || formData.topic.trim())
                  }
                  data={true}
                  loading={loading}
                  click={SubmitHandler}
                  fullWidth={true}
                  icon={loading ? undefined : Brain}
                />

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle size={16} className="text-red-500" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Quick Stats Preview */}
          <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={24} />
              Analysis Overview
            </h3>
            
            {!done ? (
              <div className="space-y-4 text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500">Submit content to see bias analysis</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Analysis Progress</span>
                    <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">{analysisStage}</p>
                </div>

                {/* Real-time stats */}
                {biasData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600">{biasData.overallScore}%</div>
                      <div className="text-xs text-gray-500">Bias Score</div>
                    </div>
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-green-600">{biasData.confidence}%</div>
                      <div className="text-xs text-gray-500">Confidence</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {done && !loading && biasData && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Bias Detection Report</h2>
              <p className="text-gray-600">Comprehensive analysis of your content</p>
            </div>

            {/* Overall Score */}
            <div className={`${biasLevel.bg} ${biasLevel.border} border-2 rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className={`text-${biasLevel.color}-600`} size={24} />
                  Overall Bias Assessment
                </h3>
                <span className={`px-4 py-2 bg-${biasLevel.color}-100 text-${biasLevel.color}-800 font-bold rounded-full text-sm`}>
                  {biasLevel.level} Bias
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    The content shows <strong>{biasLevel.level.toLowerCase()} bias</strong> with a score of <strong>{biasData.overallScore}%</strong>. 
                    The analysis detected {biasData.sentiment} sentiment with {biasData.confidence}% confidence.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Key Detected Phrases:</div>
                    <div className="flex flex-wrap gap-2">
                      {biasData.keyPhrases && biasData.keyPhrases.map((phrase, index) => (
                        <span key={index} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-600">Category Breakdown:</div>
                  {biasData.categories && Object.entries(biasData.categories).map(([category, score]) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{category} Bias</span>
                        <span className="font-bold">{score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${
                            category === 'factual' 
                              ? 'from-green-400 to-green-500' 
                              : score > 50 
                                ? 'from-red-400 to-red-500'
                                : 'from-yellow-400 to-yellow-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                This analysis is powered by advanced AI models. Results should be used as guidance alongside critical thinking and multiple source verification.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiasDetection;