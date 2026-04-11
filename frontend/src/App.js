import React, { useState } from 'react';
import axios from 'axios';
import AnalysisResult from './components/AnalysisResult';

const EXAMPLE_SCENARIOS = [
  "I want to carry a concealed handgun in Missouri without a permit",
  "Can I record a phone call without telling the other person in Missouri?",
  "I want to sell homemade food from my home kitchen in Missouri",
  "Can I smoke marijuana in a public park in Missouri?",
  "I want to open a small business without registering it in Missouri",
];

function App() {
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const analyzeScenario = async () => {
    if (!scenario.trim()) {
      setError('Please describe your scenario first.');
      return;
    }
    if (scenario.trim().length < 15) {
      setError('Please provide more detail about your scenario.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/analyze', {
        scenario: scenario.trim(),
        state: 'Missouri',
      }, { timeout: 60000 });

      setResult(response.data);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response?.data?.detail?.includes('insufficient_quota') || err.response?.data?.detail?.includes('quota')) {
        setError('⚠️ OpenAI API quota exceeded. Please check your API key billing at platform.openai.com and make sure you have available credits.');
      } else if (err.response?.data?.detail) {
        setError(`Error: ${err.response.data.detail}`);
      } else {
        setError('Failed to connect to the server. Please make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (example) => {
    setScenario(example);
    setShowExamples(false);
    setResult(null);
    setError('');
  };

  const handleReset = () => {
    setScenario('');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-900 px-4 pt-10 pb-6 text-center">
        <div className="text-4xl mb-2">⚖️</div>
        <h1 className="text-2xl font-black text-white tracking-tight">LawCheck</h1>
        <p className="text-slate-400 text-sm mt-1">Missouri & Federal Legal Research</p>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Input Card */}
        {!result && (
          <div className="bg-white rounded-3xl shadow-xl p-5 mb-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              📝 Describe Your Scenario
            </label>
            <textarea
              className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl p-3 text-base text-slate-800 resize-none outline-none transition-colors duration-200 min-h-[130px]"
              placeholder="e.g. I want to carry a concealed firearm in Missouri without a permit..."
              value={scenario}
              onChange={(e) => {
                setScenario(e.target.value);
                setError('');
              }}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1 mb-3">
              <span className="text-xs text-slate-400">{scenario.length}/1000 characters</span>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="text-xs text-blue-500 font-semibold"
              >
                {showExamples ? 'Hide examples' : '💡 See examples'}
              </button>
            </div>

            {/* Example Scenarios */}
            {showExamples && (
              <div className="mb-4 space-y-2">
                {EXAMPLE_SCENARIOS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleExample(ex)}
                    className="w-full text-left bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 rounded-xl px-3 py-2 text-sm text-blue-800 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={analyzeScenario}
              disabled={loading || !scenario.trim()}
              className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg transition-all duration-200 
                ${loading || !scenario.trim()
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing Laws...
                </span>
              ) : (
                '🔍 Check Legality'
              )}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center mb-4">
            <div className="text-5xl mb-4 animate-bounce">⚖️</div>
            <p className="text-slate-700 font-bold text-lg mb-1">Researching Laws...</p>
            <p className="text-slate-500 text-sm mb-4">Checking Missouri statutes and federal law</p>
            <div className="space-y-2">
              {['Searching Missouri Revisor of Statutes...', 'Checking federal law databases...', 'Applying AI legal reasoning...'].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                  <svg className="animate-spin h-4 w-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div>
            <AnalysisResult result={result} scenario={scenario} />
            <button
              onClick={handleReset}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-lg shadow-lg transition-all duration-200 mb-8"
            >
              🔄 Check Another Scenario
            </button>
          </div>
        )}

        {/* Footer Disclaimer */}
        {!result && !loading && (
          <div className="text-center text-xs text-slate-400 px-4 pb-8 mt-2">
            <p>⚠️ Not legal advice. For informational purposes only.</p>
            <p className="mt-1">Always consult a licensed attorney for your specific situation.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;