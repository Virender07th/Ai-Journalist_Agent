import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Globe,
  Languages,
  Zap,
} from "lucide-react";
import Button from "../../Component/Button";
import { useDispatch, useSelector } from "react-redux";
import { translate } from "../../Service/Operations/AiOperation";
import ReactMarkdown from "react-markdown";

const Translator = () => {
  const [formData, setFormData] = useState({ url: "", topic: "" });
  const dispatch = useDispatch();

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
  const [translationData, setTranslationData] = useState(null);

  const languageNames = {
    es: "Spanish (Español)",
    fr: "French (Français)",
    de: "German (Deutsch)",
    it: "Italian (Italiano)",
    pt: "Portuguese (Português)",
    ru: "Russian (Русский)",
    ja: "Japanese (日本語)",
    ko: "Korean (한국어)",
    zh: "Chinese (中文)",
    ar: "Arabic (العربية)",
    hi: "Hindi (हिंदी)",
    tr: "Turkish (Türkçe)",
    pl: "Polish (Polski)",
    nl: "Dutch (Nederlands)",
    sv: "Swedish (Svenska)",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const analysisStages = [
    "Analyzing source text...",
    "Detecting language patterns...",
    "Processing translation...",
    "Applying context understanding...",
    "Refining accuracy...",
    "Finalizing translation...",
  ];

  useEffect(() => {
    if (!loading || translationData) return;

    let currentStage = 0;
    let progressInterval;

    progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Stop progress simulation if we have real data
        if (translationData) {
          clearInterval(progressInterval);
          return 100;
        }

        const newProgress = Math.min(prev + Math.random() * 8 + 2, 95);

        if (
          currentStage < analysisStages.length &&
          newProgress > (currentStage + 1) * 15
        ) {
          setAnalysisStage(analysisStages[currentStage]);
          currentStage++;
        }

        return newProgress;
      });
    }, 200);

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [loading, translationData]);

  // Complete progress when translation data is received
  useEffect(() => {
    if (translationData && loading) {
      setProgress(100);
      setAnalysisStage("Translation complete!");
    }
  }, [translationData, loading]);

  const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);

  const SubmitHandler = async (e) => {
    e.preventDefault();

    if (!formData.url.trim() && !formData.topic.trim()) {
      setError("Please enter either a URL or paste content to translate");
      return;
    }

    if (!selectedLanguage) {
      setError("Please select a target language");
      return;
    }

    setError("");
    setLoading(true);
    setDone(true);
    setProgress(0);
    setAnalysisStage("Initializing translation...");
    setTranslationData(null);

    try {
      const payload = {
        topic: formData.topic,
        url: formData.url,
        language: selectedLanguage,
      };

      const res = await dispatch(translate(payload));

      if (res?.success && res.data) {
        setTranslationData(res.data);
      } else {
        setError("Translation failed. Please try again.");
        setDone(false);
      }
    } catch (err) {
      console.error("Translation error:", err);
      setError("Error while translating. Please try again.");
      setDone(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ url: "", topic: "" });
    setSelectedLanguage("");
    setDone(false);
    setLoading(false);
    setError("");
    setProgress(0);
    setAnalysisStage("");
    setTranslationData(null);
  };

  // Custom styles for ReactMarkdown components
  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="text-xl font-bold text-gray-900 mt-4 mb-3 border-b-2 border-gray-300 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-bold text-gray-800 mt-4 mb-2 border-b border-gray-200 pb-1">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-bold text-gray-700 mt-3 mb-2">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 mb-3 leading-relaxed">
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-800">
        {children}
      </strong>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-700 ml-2">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600 my-3">
        {children}
      </blockquote>
    ),
  };

  const popularLanguages = ["es", "fr", "de", "zh", "ja", "ar"];
  const allLanguages = Object.entries(languageNames);

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-8 bg-gradient-to-br from-gray-50 via-indigo-50/30 to-cyan-50/20">
      {/* Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 rounded-3xl blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 tracking-tight leading-tight mb-6">
          AI-Powered Translator
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Break language barriers with intelligent translation powered by
          advanced neural networks and contextual understanding.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { icon: Globe, text: "100+ Languages" },
            { icon: Zap, text: "Instant Translation" },
            { icon: Languages, text: "Context Aware" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200"
            >
              <Icon size={16} className="text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <form onSubmit={SubmitHandler}>
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Content Input
                  </h2>
                  <p className="text-gray-600">
                    Enter URL or paste content for translation
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
                      <span>Auto-detect source language</span>
                    </div>
                  </div>

                  {/* Target Language */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Target Language
                    </label>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 font-medium">
                        Popular Languages:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularLanguages.map((code) => (
                          <button
                            key={code}
                            type="button"
                            disabled={loading}
                            onClick={() => setSelectedLanguage(code)}
                            className={`px-3 py-2 text-xs rounded-full border-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                              selectedLanguage === code
                                ? "bg-indigo-500 text-white border-indigo-500"
                                : "bg-white text-gray-600 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                            }`}
                          >
                            {languageNames[code].split(" (")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <select
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Select target language...</option>
                      {allLanguages.map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  content={loading ? "Translating..." : "Translate Text"}
                  condition={
                    !loading &&
                    (formData.url.trim() || formData.topic.trim()) &&
                    selectedLanguage
                  }
                  data={true}
                  loading={loading}
                  click={SubmitHandler}
                  fullWidth={true}
                  icon={loading ? undefined : Languages}
                />

                {translationData && !loading && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full px-6 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-2xl hover:bg-indigo-100 transition-all duration-200"
                  >
                    Translate Another Text
                  </button>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle size={16} className="text-red-500" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Globe className="text-indigo-600" size={24} />
              Translation Preview
            </h3>

            {!done ? (
              <div className="space-y-4 text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Languages className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500">Submit text to see translation</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Translation Progress
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    {analysisStage}
                  </p>
                </div>

                {translationData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-indigo-600">
                        {translationData.detectedLanguage || "Auto"}
                      </div>
                      <div className="text-xs text-gray-500">Source Lang</div>
                    </div>
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-cyan-600">
                        {translationData.processingTime || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">Process Time</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {done && !loading && translationData && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Translation Results
              </h2>
              <p className="text-gray-600">
                AI-powered language translation output
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-2 border-indigo-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="text-indigo-600" size={24} />
                  Translation Summary
                </h3>
                <span className="px-4 py-2 bg-indigo-100 text-indigo-800 font-bold rounded-full text-sm">
                  Translation Complete
                </span>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600">
                    {translationData.detectedLanguage || "Auto-detected"}
                  </div>
                  <div className="text-xs text-gray-500">Source Language</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-600">
                    {translationData.targetLanguage?.split(" (")[0] ||
                      languageNames[selectedLanguage]?.split(" (")[0]}
                  </div>
                  <div className="text-xs text-gray-500">Target Language</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-cyan-600">
                    {translationData.originalLength || formData.topic.length}
                  </div>
                  <div className="text-xs text-gray-500">Original Chars</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {translationData.translatedLength ||
                      translationData.translatedText?.length ||
                      "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">Translated Chars</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-1 gap-6">
              {/* Original Text */}
              <div className="bg-gray-50/50 border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  Original Text ({translationData?.detectedLanguage || "Source"})
                </h3>
                <div className="bg-white rounded-xl p-4 shadow-sm max-h-64 overflow-y-auto">
                  <div className="text-sm">
                    <ReactMarkdown 
                      components={markdownComponents}
                    >
                      {formData.topic || (formData.url ? `Content from URL: ${formData.url}` : "No content available")}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Translated Text */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 border-2 border-indigo-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  Translated Text ({translationData?.targetLanguage?.split(" (")[0] || languageNames[selectedLanguage]?.split(" (")[0]})
                </h3>
                <div className="bg-white rounded-xl p-4 shadow-sm max-h-64 overflow-y-auto">
                  <div className="text-sm">
                    <ReactMarkdown 
                      components={markdownComponents}
                    >
                      {translationData?.translatedText || "Translation not available"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            {translationData.processingTime && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Translation completed in {translationData.processingTime} • 
                  This translation is powered by advanced AI language models. 
                  For critical documents, consider professional human review.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Translator;