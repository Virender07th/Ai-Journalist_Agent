import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Zap,
  List,
} from "lucide-react";
import Button from "../../Component/Button";
import { useDispatch } from "react-redux";
import { summarizer } from "../../Service/Operations/AiOperation";

const SummaryGenerator = () => {
  const [formData, setFormData] = useState({ url: "", topic: "" });
  const dispatch = useDispatch();
  const [outputType, setOutputType] = useState("bulletPoint");
  const [summaryText, setSummaryText] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
  const [summaryData, setSummaryData] = useState(null);

  const analysisStages = [
    "Processing content...",
    "Extracting key information...",
    "Analyzing context...",
    "Identifying main points...",
    "Generating summary...",
    "Formatting output...",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // progress animation
 // progress animation
useEffect(() => {
  if (!loading) return;
  let currentStage = 0;
  const timer = setInterval(() => {
    setProgress((prev) => {
      const newProgress = prev + Math.random() * 10 + 5;
      if (
        currentStage < analysisStages.length &&
        newProgress > (currentStage + 1) * 16
      ) {
        setAnalysisStage(analysisStages[currentStage]);
        currentStage++;
      }
      return Math.min(newProgress, 80); // cap at 95% until real data comes
    });
  }, 150);
  return () => clearInterval(timer);
}, [loading]);
  // submit handler
  const SubmitHandler = async (e) => {
    e.preventDefault();

    if (!formData.url.trim() && !formData.topic.trim()) {
      setError("Please enter either a URL or paste content to summarize");
      return;
    }

    const payload = {
      topic: formData.topic,
      url: formData.url,
      format: outputType,
    };

    try {
     
      setError("");
      setLoading(true);
      setDone(true);
      setProgress(0);
      setAnalysisStage("Initializing summarization...");
      setSummaryData(null);
      setSummaryText("");

      const res = await dispatch(summarizer(payload));

      if (res?.success && res.data) {
        const { summary, wordCount, readingTime } = res.data;
        const formattedSummary = Array.isArray(summary)
          ? summary.join("\n")
          : summary;

        setSummaryText(formattedSummary);
        setSummaryData({ wordCount, readingTime });

        // ✅ instantly finish progress
        setProgress(100);
        setAnalysisStage("Summary complete!");
        setLoading(false);
      } else {
        setError("Failed to fetch summary.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Summarizer error:", err);
      setError("Failed to generate summary. Try again.");
      setLoading(false);
    }
  };

  // render summary content
  const renderOutput = () => {
    if (!summaryText) {
      return (
        <p className="text-gray-400 italic text-center py-8">
          Summary will appear here after generation.
        </p>
      );
    }

    if (outputType === "paragraph") {
      return (
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-justify">
            {summaryText}
          </p>
        </div>
      );
    }

    const bullets = summaryText.split("\n").filter((b) => b.trim() !== "");
    return (
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Here are 7 key factual bullet points from the news article:
        </h3>
        <ul className="space-y-3">
          {bullets.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const formatOptions = [
    {
      key: "bulletPoint",
      label: "Bullet Points",
      icon: List,
      description: "Structured key points",
    },
    {
      key: "paragraph",
      label: "Paragraph",
      icon: FileText,
      description: "Flowing narrative",
    },
    {
      key: "keyHighlight",
      label: "Key Highlights",
      icon: Zap,
      description: "Important insights",
    },
  ];
  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-8 bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20">
      {/* Enhanced Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 tracking-tight leading-tight mb-6">
          AI Summary Generator
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Transform lengthy articles and content into clear, concise summaries
          using advanced AI processing and natural language understanding.
        </p>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { icon: FileText, text: "Smart Extraction" },
            { icon: Zap, text: "Instant Processing" },
            { icon: TrendingUp, text: "Multiple Formats" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200"
            >
              <Icon size={16} className="text-purple-600" />
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
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Content Input
                </h2>
                <p className="text-gray-600">
                  Enter URL or paste content for summarization
                </p>
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
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300"
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
                    placeholder="Paste your article content here. The AI will analyze and extract the most important information to create a comprehensive summary..."
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-200 hover:border-gray-300"
                  />
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>
                      {(formData.topic + formData.url).length} characters
                    </span>
                    <span>Longer content produces better summaries</span>
                  </div>
                </div>

                {/* Format Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Summary Format
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {formatOptions.map(
                      ({ key, label, icon: Icon, description }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setOutputType(key)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                            outputType === key
                              ? "bg-purple-50 border-purple-200 text-purple-700"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <Icon
                            size={20}
                            className={
                              outputType === key
                                ? "text-purple-600"
                                : "text-gray-400"
                            }
                          />
                          <div className="text-left">
                            <div className="font-medium text-sm">{label}</div>
                            <div className="text-xs opacity-70">
                              {description}
                            </div>
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <Button
                content={loading ? "Generating Summary..." : "Generate Summary"}
                condition={
                  !loading && (formData.url.trim() || formData.topic.trim())
                }
                data={true}
                loading={loading}
                click={SubmitHandler}
                fullWidth={true}
                icon={loading ? undefined : FileText}
              />

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle size={16} className="text-red-500" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="text-purple-600" size={24} />
              Summary Preview
            </h3>

            {!done ? (
              <div className="space-y-4 text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500">
                  Submit content to see generated summary
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Generation Progress
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    {analysisStage}
                  </p>
                </div>

                {/* Real-time stats */}
                {summaryData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-purple-600">
                        {summaryData.wordCount}
                        {outputType === "paragraph" ? "" : " pts"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {outputType === "paragraph"
                          ? "Word Count"
                          : "Key Points"}
                      </div>
                    </div>
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {summaryData.readingTime}
                      </div>
                      <div className="text-xs text-gray-500">Reading Time</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {done && !loading && summaryData && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Generated Summary
              </h2>
              <p className="text-gray-600">
                AI-powered content summarization results
              </p>
            </div>

            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="text-purple-600" size={24} />
                  Summary Statistics
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {summaryData.wordCount}
                    {outputType === "paragraph" ? "" : ""}
                  </div>
                  <div className="text-xs text-gray-600">
                    {outputType === "paragraph" ? "Words" : "Points"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {summaryData.readingTime}
                  </div>
                  <div className="text-xs text-gray-600">Read Time</div>
                </div>
              </div>
            </div>

            {/* Summary Content */}
            <div className="bg-gray-50/50 border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {formatOptions.find((f) => f.key === outputType)?.label}{" "}
                  Summary
                </h3>
                <span className="text-sm text-gray-500">
                  Format:{" "}
                  {formatOptions.find((f) => f.key === outputType)?.description}
                </span>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm max-h-96 overflow-y-auto">
                {renderOutput()}
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                This summary is generated using advanced AI language models.
                Review and verify important details as needed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryGenerator;
