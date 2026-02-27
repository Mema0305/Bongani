/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Camera, 
  FlaskConical, 
  TrendingUp, 
  ChevronRight, 
  Upload, 
  Loader2, 
  Sprout, 
  AlertCircle,
  Menu,
  X,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { getAdvisorResponse, analyzeDiagnosticImage } from './services/geminiService';

type Tab = 'dashboard' | 'advisor' | 'diagnostics' | 'hybrid';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#FDFCFB]">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-stone-200 transition-all duration-300 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
            <Sprout size={20} />
          </div>
          {isSidebarOpen && <span className="font-serif text-xl font-bold text-emerald-900">AgriPulse</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="AI Advisor" 
            active={activeTab === 'advisor'} 
            onClick={() => setActiveTab('advisor')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Camera size={20} />} 
            label="Diagnostics" 
            active={activeTab === 'diagnostics'} 
            onClick={() => setActiveTab('diagnostics')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<FlaskConical size={20} />} 
            label="Hybrid Lab" 
            active={activeTab === 'hybrid'} 
            onClick={() => setActiveTab('hybrid')}
            collapsed={!isSidebarOpen}
          />
        </nav>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 text-stone-400 hover:text-stone-600 flex justify-center"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-bottom border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live Market: Wheat +2.4%
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Dashboard key="dashboard" onNavigate={setActiveTab} />}
            {activeTab === 'advisor' && <Advisor key="advisor" />}
            {activeTab === 'diagnostics' && <Diagnostics key="diagnostics" />}
            {activeTab === 'hybrid' && <HybridLab key="hybrid" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, collapsed }: { 
  icon: React.ReactNode, 
  label: string, 
  active: boolean, 
  onClick: () => void,
  collapsed: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
        active 
          ? 'bg-emerald-50 text-emerald-700 font-medium' 
          : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
      }`}
    >
      <div className={active ? 'text-emerald-600' : ''}>{icon}</div>
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <section>
        <h1 className="font-serif text-4xl text-stone-900 mb-2">Welcome back, Farmer.</h1>
        <p className="text-stone-500">Here's what's happening on your farm today.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Projects" 
          value="4" 
          subtitle="2 nearing harvest" 
          icon={<LayoutDashboard className="text-blue-500" />} 
        />
        <StatCard 
          title="Market Outlook" 
          value="Positive" 
          subtitle="Maize prices up 5%" 
          icon={<TrendingUp className="text-emerald-500" />} 
        />
        <StatCard 
          title="Health Alerts" 
          value="1" 
          subtitle="Potential rust in Plot B" 
          icon={<AlertCircle className="text-amber-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <h3 className="font-serif text-xl mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <ActionButton 
              icon={<Camera size={18} />} 
              label="Diagnose a Crop Problem" 
              onClick={() => onNavigate('diagnostics')}
            />
            <ActionButton 
              icon={<MessageSquare size={18} />} 
              label="Get Marketing Advice" 
              onClick={() => onNavigate('advisor')}
            />
            <ActionButton 
              icon={<FlaskConical size={18} />} 
              label="Explore Hybrid Varieties" 
              onClick={() => onNavigate('hybrid')}
            />
          </div>
        </div>

        <div className="bg-emerald-900 text-white p-8 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-serif text-2xl mb-2">Seasonal Tip</h3>
            <p className="text-emerald-100/80 mb-6">
              Current humidity levels are high. Consider adjusting your irrigation schedule for the tomato crop to prevent fungal growth.
            </p>
            <button 
              onClick={() => onNavigate('advisor')}
              className="px-6 py-2 bg-white text-emerald-900 rounded-full text-sm font-semibold hover:bg-emerald-50 transition-colors"
            >
              Learn More
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Sprout size={200} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string, value: string, subtitle: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-stone-50 rounded-xl">{icon}</div>
      </div>
      <h4 className="text-stone-500 text-sm font-medium mb-1">{title}</h4>
      <div className="text-3xl font-bold text-stone-900 mb-1">{value}</div>
      <p className="text-stone-400 text-xs">{subtitle}</p>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 rounded-2xl transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="text-stone-400 group-hover:text-emerald-600 transition-colors">{icon}</div>
        <span className="text-stone-700 font-medium">{label}</span>
      </div>
      <ChevronRight size={18} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
    </button>
  );
}

function Advisor() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<'management' | 'marketing' | 'hybrid'>('management');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await getAdvisorResponse(userMsg, context);
      setMessages(prev => [...prev, { role: 'ai', content: response || 'I am sorry, I could not process that.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to AI advisor. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b border-stone-100 flex gap-2 overflow-x-auto">
        {(['management', 'marketing', 'hybrid'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setContext(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              context === c 
                ? 'bg-emerald-600 text-white' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)} Advice
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="font-serif text-xl mb-2">Ask your AI Advisor</h3>
            <p className="text-stone-500 text-sm">
              Get expert advice on farm management, crop marketing, or hybrid product development.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-stone-50 text-stone-800'
            }`}>
              <div className="markdown-body text-sm">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-stone-50 p-4 rounded-2xl flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-emerald-600" />
              <span className="text-xs text-stone-500">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-stone-100">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about ${context}...`}
            className="w-full pl-4 pr-12 py-3 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Diagnostics() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await analyzeDiagnosticImage(image, 'image/jpeg');
      setAnalysis(result || 'Analysis failed.');
    } catch (error) {
      setAnalysis('Error analyzing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <section className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl mb-4">Crop & Livestock Diagnostics</h2>
        <p className="text-stone-500">
          Upload a photo of your crop or livestock to identify diseases, pests, or deficiencies.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
              image ? 'border-emerald-200 bg-emerald-50/30' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
            }`}
          >
            {image ? (
              <img src={image} alt="Upload" className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 text-stone-400">
                  <Upload size={32} />
                </div>
                <p className="text-sm font-medium text-stone-600">Click to upload or drag and drop</p>
                <p className="text-xs text-stone-400 mt-1">PNG, JPG up to 10MB</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          
          <button 
            disabled={!image || loading}
            onClick={handleAnalyze}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
            {loading ? 'Analyzing...' : 'Run Diagnostics'}
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm min-h-[400px]">
          {analysis ? (
            <div className="markdown-body">
              <Markdown>{analysis}</Markdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400">
              <AlertCircle size={48} className="mb-4 opacity-20" />
              <p className="text-sm">Analysis results will appear here after diagnostic run.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function HybridLab() {
  const [parentA, setParentA] = useState('');
  const [parentB, setParentB] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    if (!parentA || !parentB) return;
    setLoading(true);
    try {
      const prompt = `Simulate a hybrid cross between ${parentA} and ${parentB}. Describe the potential characteristics of the new hybrid, including yield potential, disease resistance, climate suitability, and any specific management requirements. Format as a professional agronomy report.`;
      const response = await getAdvisorResponse(prompt, 'hybrid');
      setResult(response || 'Simulation failed.');
    } catch (error) {
      setResult('Error simulating hybrid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <section className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl mb-4">Hybrid Innovation Lab</h2>
        <p className="text-stone-500">
          Explore the possibilities of crossing different crop varieties to create superior hybrid products.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-medium text-stone-900">Parent Varieties</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-400 uppercase mb-1 block">Parent A (e.g. Heirloom Corn)</label>
                <input 
                  type="text" 
                  value={parentA}
                  onChange={(e) => setParentA(e.target.value)}
                  placeholder="Variety name..."
                  className="w-full px-4 py-2 bg-stone-50 border-none rounded-xl outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-400 uppercase mb-1 block">Parent B (e.g. Drought Resistant Corn)</label>
                <input 
                  type="text" 
                  value={parentB}
                  onChange={(e) => setParentB(e.target.value)}
                  placeholder="Variety name..."
                  className="w-full px-4 py-2 bg-stone-50 border-none rounded-xl outline-none text-sm"
                />
              </div>
            </div>
            <button 
              onClick={handleSimulate}
              disabled={!parentA || !parentB || loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <FlaskConical size={18} />}
              Simulate Hybrid
            </button>
          </div>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <h4 className="text-emerald-900 font-semibold text-sm mb-2">Why Hybridize?</h4>
            <ul className="text-xs text-emerald-800/70 space-y-2">
              <li className="flex gap-2">
                <ChevronRight size={14} className="shrink-0" />
                <span>Increase yield through heterosis (hybrid vigor).</span>
              </li>
              <li className="flex gap-2">
                <ChevronRight size={14} className="shrink-0" />
                <span>Combine resistance to multiple pests/diseases.</span>
              </li>
              <li className="flex gap-2">
                <ChevronRight size={14} className="shrink-0" />
                <span>Improve uniformity for mechanical harvesting.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm min-h-[500px]">
          {result ? (
            <div className="markdown-body">
              <Markdown>{result}</Markdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400">
              <FlaskConical size={48} className="mb-4 opacity-20" />
              <p className="text-sm">Enter parent varieties and simulate to see hybrid potential.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
