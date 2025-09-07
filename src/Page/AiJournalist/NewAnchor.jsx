import React, { useState, useEffect } from "react";
import { Video, Play, Download, FileText, Mic, Camera, Zap, Clock } from "lucide-react";

const NewsVideoGenerator = () => {
  const [topic, setTopic] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [videoStyle, setVideoStyle] = useState("professional");
  const [videoDuration, setVideoDuration] = useState(60);
  const [includeVoiceover, setIncludeVoiceover] = useState(true);

  const generationStages = [
    "Analyzing content...",
    "Generating script...",
    "Creating storyboard...",
    "Generating visuals...",
    "Adding voiceover...",
    "Rendering video...",
    "Finalizing output..."
  ];

  const videoStyles = [
    { id: "professional", label: "Professional News", icon: "📺", description: "Classic news format with clean graphics" },
    { id: "modern", label: "Modern Dynamic", icon: "🎬", description: "Contemporary style with animations" },
    { id: "documentary", label: "Documentary Style", icon: "🎞️", description: "In-depth narrative format" },
    { id: "social", label: "Social Media", icon: "📱", description: "Optimized for social platforms" }
  ];

  useEffect(() => {
    if (!done || !loading) return;

    let currentStage = 0;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 12 + 3;
        
        if (currentStage < generationStages.length && newProgress > (currentStage + 1) * 14) {
          setGenerationStage(generationStages[currentStage]);
          currentStage++;
        }

        if (newProgress >= 100) {
          clearInterval(timer);
          setLoading(false);
          setGenerationStage("Video generation complete!");
          
          // Generate mock video data
          setVideoData({
            title: "AI-Generated News Video",
            duration: `${videoDuration}s`,
            script: `Welcome to our news update. Today we're covering ${topic}. 

Our analysis shows significant developments in this area, with experts highlighting key trends and implications for the future.

The latest reports indicate growing interest from both industry leaders and consumers, suggesting this topic will continue to evolve rapidly.

In conclusion, this represents an important milestone that deserves continued attention and monitoring.

Thank you for watching. Stay informed with our AI-powered news updates.`,
            scenes: [
              { timestamp: "0:00-0:10", description: "Opening title sequence with topic introduction" },
              { timestamp: "0:10-0:25", description: "Main content overview with key statistics" },
              { timestamp: "0:25-0:45", description: "Expert analysis and supporting visuals" },
              { timestamp: "0:45-1:00", description: "Summary and call-to-action" }
            ],
            videoUrl: "/api/placeholder/800/450",
            thumbnailUrl: "/api/placeholder/320/180",
            size: "15.2 MB",
            format: "MP4 (1080p)",
            voiceSettings: includeVoiceover ? "Professional male voice, moderate pace" : "No voiceover",
            style: videoStyles.find(s => s.id === videoStyle)?.label
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [done, loading, topic, videoDuration, includeVoiceover, videoStyle]);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter content, URL, or topic to generate video");
      return;
    }
    
    setError("");
    setLoading(true);
    setDone(true);
    setProgress(0);
    setGenerationStage("Initializing video generation...");
    setVideoData(null);
  };

  const handleDownload = (type) => {
    console.log(`Downloading ${type}:`, videoData);
    // In a real implementation, this would trigger actual downloads
  };

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight leading-tight mb-6">
          AI News Video Generator
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Transform any content, URL, or topic into professional news videos with AI-generated scripts, visuals, and voiceovers.
        </p>
        
        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { icon: Video, text: "AI Video Generation" },
            { icon: FileText, text: "Auto Script Writing" },
            { icon: Mic, text: "Voice Synthesis" },
            { icon: Camera, text: "Visual Creation" }
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
          {/* Input Section */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Video Generation</h2>
                <p className="text-gray-600">Enter your content to create professional news videos</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Content, URL, or Topic
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Paste article content, news URL, or enter a topic like 'AI advancements in healthcare', 'Climate change solutions', etc."
                  rows={6}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 hover:border-gray-300"
                  required
                />
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{topic.length} characters</span>
                  <span>Min 20 characters recommended</span>
                </div>
              </div>

              {/* Video Style Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Video Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {videoStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setVideoStyle(style.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        videoStyle === style.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white/70 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{style.icon}</span>
                        <span className="font-medium text-sm">{style.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{style.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration and Voice Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={120}>2 minutes</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Voiceover
                  </label>
                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={() => setIncludeVoiceover(!includeVoiceover)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        includeVoiceover ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          includeVoiceover ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700">
                      {includeVoiceover ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={SubmitHandler}
                disabled={loading || !topic.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video size={20} />
                    Generate News Video
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <Video size={16} className="text-red-500" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress and Preview Section */}
          <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Camera className="text-purple-600" size={24} />
              Generation Progress
            </h3>
            
            {!done ? (
              <div className="space-y-4 text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500">Submit content to start video generation</p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                    <div className="text-lg font-bold text-gray-400">--</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                    <div className="text-lg font-bold text-gray-400">--</div>
                    <div className="text-xs text-gray-500">Style</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Generation Progress</span>
                    <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic flex items-center gap-2">
                    <Zap size={14} className="text-purple-500" />
                    {generationStage}
                  </p>
                </div>

                {/* Real-time stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                    <div className="text-lg font-bold text-purple-600">{videoDuration}s</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                    <div className="text-lg font-bold text-blue-600">{videoStyles.find(s => s.id === videoStyle)?.icon}</div>
                    <div className="text-xs text-gray-500">Style</div>
                  </div>
                </div>

                {/* Generation Settings Summary */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Generation Settings</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>🎬 Style: {videoStyles.find(s => s.id === videoStyle)?.label}</p>
                    <p>⏱️ Duration: {videoDuration} seconds</p>
                    <p>🎤 Voiceover: {includeVoiceover ? 'Enabled' : 'Disabled'}</p>
                    <p>📝 Content: {topic.length} characters</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {done && !loading && videoData && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Generated News Video</h2>
              <p className="text-gray-600">Your AI-generated video is ready for download</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Video Preview */}
              <div className="space-y-4">
                <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                    <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                      <Play size={24} className="text-gray-800 ml-1" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 text-white px-3 py-1 rounded text-sm">
                      {videoData.title} • {videoData.duration}
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">Format</div>
                    <div className="text-lg font-bold text-gray-800">{videoData.format}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">Size</div>
                    <div className="text-lg font-bold text-gray-800">{videoData.size}</div>
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleDownload('video')}
                    className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download Video ({videoData.size})
                  </button>
                  <button
                    onClick={() => handleDownload('script')}
                    className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText size={18} />
                    Download Script
                  </button>
                </div>
              </div>

              {/* Script and Details */}
              <div className="space-y-6">
                {/* Generated Script */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="text-blue-600" size={20} />
                    Generated Script
                  </h3>
                  <div className="bg-white rounded-xl p-4 border max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {videoData.script}
                    </pre>
                  </div>
                </div>

                {/* Scene Breakdown */}
                <div className="bg-purple-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Camera className="text-purple-600" size={20} />
                    Scene Breakdown
                  </h3>
                  <div className="space-y-3">
                    {videoData.scenes.map((scene, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 border">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-purple-600 mb-1">{scene.timestamp}</div>
                            <div className="text-sm text-gray-700">{scene.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Zap className="text-blue-600" size={20} />
                    Technical Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Video Style:</span>
                      <span className="font-medium text-gray-800">{videoData.style}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-800">{videoData.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voice Settings:</span>
                      <span className="font-medium text-gray-800">{videoData.voiceSettings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Generated At:</span>
                      <span className="font-medium text-gray-800">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-4">
                Video generated using advanced AI models. Script and visuals are created automatically based on your input content.
              </p>
              <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Video size={12} />
                  HD Quality
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Fast Generation
                </span>
                <span className="flex items-center gap-1">
                  <Download size={12} />
                  Instant Download
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsVideoGenerator;