import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, CheckCircle, TrendingUp, Shield, Search, ExternalLink } from "lucide-react";
import Button from "../../Component/Button";
import { factCheckNews } from "../../Service/Operations/AiOperation";

const FactChecker = () => {
  const dispatch = useDispatch();
 
const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ url: "", topic: "" });
  const [error, setError] = useState("");
  const [factData, setFactData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user starts typing
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!formData.url.trim() && !formData.topic.trim()) {
      setError("Please enter some content or URL to fact-check");
      return;
    }

    if (formData.topic.trim() && formData.topic.trim().length < 10) {
      setError("Please enter at least 10 characters of content");
      return;
    }
    
    setError("");
    setIsAnalyzing(true);
    setFactData(null);

    try {
      // Prepare JSON payload
      const payload = {};
      
      if (formData.url.trim()) {
        payload.url = formData.url.trim();
      }
      
      if (formData.topic.trim()) {
        payload.content = formData.topic.trim();
      }

      const result = await dispatch(factCheckNews(payload));
      
      if (result && result.success) {
        setFactData(result.data);
      }
    } catch (error) {
      console.error("Fact check error:", error);
      setError("Failed to perform fact check. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictStyle = (verdict) => {
    switch (verdict?.toUpperCase()) {
      case "TRUE":
        return { 
          level: "TRUE", 
          color: "green", 
          bg: "bg-green-50", 
          border: "border-green-200", 
          icon: CheckCircle,
          textColor: "text-green-800",
          badgeColor: "bg-green-100"
        };
      case "MOSTLY TRUE":
        return { 
          level: "MOSTLY TRUE", 
          color: "blue", 
          bg: "bg-blue-50", 
          border: "border-blue-200", 
          icon: CheckCircle,
          textColor: "text-blue-800",
          badgeColor: "bg-blue-100"
        };
      case "MIXED":
        return { 
          level: "MIXED", 
          color: "yellow", 
          bg: "bg-yellow-50", 
          border: "border-yellow-200", 
          icon: AlertTriangle,
          textColor: "text-yellow-800",
          badgeColor: "bg-yellow-100"
        };
      default:
        return { 
          level: "FALSE", 
          color: "red", 
          bg: "bg-red-50", 
          border: "border-red-200", 
          icon: AlertTriangle,
          textColor: "text-red-800",
          badgeColor: "bg-red-100"
        };
    }
  };

  const verdictStyle = factData ? getVerdictStyle(factData.verdict) : null;

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-8 bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/20">
      {/* Enhanced Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-3xl blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 tracking-tight leading-tight mb-6">
          AI-Powered Fact Checker
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Validate claims and articles against trusted sources using advanced AI cross-referencing and real-time fact verification.
        </p>
        
        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { icon: Shield, text: "Source Verification" },
            { icon: Search, text: "Real-time Analysis" },
            { icon: TrendingUp, text: "Credibility Scoring" }
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Icon size={16} className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <form onSubmit={SubmitHandler} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Fact Verification</h2>
                <p className="text-gray-600">Enter claims, articles, or URLs for fact-checking</p>
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
                    disabled={loading || isAnalyzing}
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
                    disabled={loading || isAnalyzing}
                    placeholder="Paste your article content here..."
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-200 hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>{formData.topic.length} characters</span>
                    <span>Min 10 characters required</span>
                  </div>
                </div>
              </div>

              <Button
                content={isAnalyzing ? "Fact-Checking..." : "Verify Facts"}
                condition={!loading && !isAnalyzing && (formData.url.trim() || (formData.topic.trim() && formData.topic.length >= 10))}
                data={true}
                loading={isAnalyzing}
                click={SubmitHandler}
                fullWidth={true}
                icon={isAnalyzing ? undefined : Shield}
                type="submit"
              />

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle size={16} className="text-red-500" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Quick Stats Preview */}
          <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Search className="text-green-600" size={24} />
              Verification Overview
            </h3>
            
            {!factData && !isAnalyzing ? (
              <div className="space-y-4 text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500">Submit content to see fact-check results</p>
              </div>
            ) : isAnalyzing ? (
              <div className="space-y-4 text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Search className="text-blue-600" size={32} />
                </div>
                <p className="text-blue-600 font-medium">Analyzing content...</p>
                <p className="text-gray-500 text-sm">This may take a few moments</p>
              </div>
            ) : factData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{factData.overallScore}%</div>
                    <div className="text-xs text-gray-500">Truth Score</div>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{factData.confidence}%</div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                </div>
                <div className={`${verdictStyle.bg} ${verdictStyle.border} border-2 rounded-xl p-4 text-center`}>
                  <span className={`px-4 py-2 ${verdictStyle.badgeColor} ${verdictStyle.textColor} font-bold rounded-full text-sm`}>
                    {verdictStyle.level}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Results Section */}
        {factData && !isAnalyzing && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Fact Check Report</h2>
              <p className="text-gray-600">Comprehensive verification of your content</p>
            </div>

            {/* Overall Verdict */}
            <div className={`${verdictStyle.bg} ${verdictStyle.border} border-2 rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <verdictStyle.icon className={`text-${verdictStyle.color}-600`} size={24} />
                  Fact Check Verdict
                </h3>
                <span className={`px-4 py-2 ${verdictStyle.badgeColor} ${verdictStyle.textColor} font-bold rounded-full text-sm`}>
                  {verdictStyle.level}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    The content is assessed as <strong>{factData.verdict.toLowerCase()}</strong> with a truth score of <strong>{factData.overallScore}%</strong>. 
                    Our analysis cross-referenced multiple trusted sources with {factData.confidence}% confidence.
                  </p>
                  {factData.keyClaims && factData.keyClaims.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600">Key Claims Verified:</div>
                      <div className="space-y-1">
                        {factData.keyClaims.map((claim, index) => (
                          <div key={index} className="text-xs bg-white border border-gray-300 rounded-lg p-2">
                            {claim}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {factData.categories && (
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-gray-600">Verification Breakdown:</div>
                    {Object.entries(factData.categories).map(([category, score]) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize font-medium">{category} Accuracy</span>
                          <span className="font-bold">{score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${
                              score > 80 
                                ? 'from-green-400 to-green-500' 
                                : score > 60 
                                  ? 'from-yellow-400 to-yellow-500'
                                  : 'from-red-400 to-red-500'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reasoning Section */}
            {factData.reasoning && (
              <div className="bg-gray-50/50 border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Analysis Reasoning</h3>
                <p className="text-gray-700 leading-relaxed">{factData.reasoning}</p>
              </div>
            )}

            {/* Sources Table */}
            {factData.sources && factData.sources.length > 0 && (
              <div className="bg-gray-50/50 border-2 border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 bg-white/70 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ExternalLink className="text-blue-600" size={20} />
                    Verified Sources ({factData.sources.length})
                  </h3>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="bg-white/80 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Source</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Domain</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Credibility</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Last Verified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {factData.sources.map((source, index) => (
                        <tr key={index} className="hover:bg-white/50 transition-colors">
                          <td className="px-6 py-3 font-medium text-gray-900">
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 transition-colors"
                            >
                              {source.title}
                            </a>
                          </td>
                          <td className="px-6 py-3 text-blue-600 font-mono text-xs">
                            {new URL(source.url).hostname}
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                source.credibility > 90 ? 'bg-green-500' : 
                                source.credibility > 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className="font-semibold">{source.credibility}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-gray-600 text-xs">{source.verified}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-500">
                This fact-check is powered by AI analysis of trusted sources. Always use critical thinking and verify important claims through official channels.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactChecker;