import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, UploadCloud, MessageSquare, BookOpen, Zap, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

import { Features } from './ui/features-7';
import MultiOrbitSemiCircle from './ui/multi-orbit-semi-circle';
import HoverFooter from './HoverFooter';

interface LandingPageProps {
  onFileSelected: (file: File) => void;
}

export function LandingPage({ onFileSelected }: LandingPageProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'text/markdown': ['.md'],
    },
    maxFiles: 1,
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-green-500/30">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-full px-4 py-2.5 flex items-center justify-between w-full max-w-5xl pointer-events-auto transition-all duration-300 hover:bg-slate-900/90 hover:shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
          <div className="flex items-center space-x-2.5 pl-2">
            <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-1.5 rounded-xl shadow-inner">
              <FileText className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300 tracking-tight">ChatPDF</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 p-1 rounded-full border border-slate-700/50">
            <a href="#features" className="px-5 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all duration-200">Features</a>
            <a href="#demo" className="px-5 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all duration-200">Demo</a>
            <a href="#how-it-works" className="px-5 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all duration-200">How it Works</a>
          </div>

          <div className="flex items-center pr-1">
            <Button 
              className="rounded-full bg-green-500 text-slate-950 hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all px-6 h-10 font-bold" 
              onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative overflow-hidden pt-16">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-700 blur-[100px] rounded-full mix-blend-screen" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Copy */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                Unlock the knowledge hidden in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">PDFs</span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Don't just read your documents—converse with them. Upload any PDF to instantly ask questions, extract summaries, and generate practice quizzes to test your understanding.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Instant contextual answers with citations",
                  "Auto-generated multiple choice quizzes",
                  "Secure, private, and lightning fast"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 text-slate-300">
                    <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Upload Box */}
            <motion.div 
              id="upload-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative scroll-mt-32"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-green-900/40 to-emerald-900/20 rounded-3xl transform rotate-3 scale-105 -z-10" />
              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Get Started</h3>
                  <p className="text-slate-400">Upload a document to begin your session</p>
                </div>

                <div
                  {...getRootProps()}
                  className={`
                    relative group overflow-hidden p-12 border-2 border-dashed rounded-2xl transition-all cursor-pointer text-center
                    ${isDragActive 
                      ? 'border-green-500 bg-green-900/20 scale-[1.02]' 
                      : 'border-slate-700 bg-slate-800/50 hover:border-green-500/50 hover:bg-green-900/10'}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
                    <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-green-900/40' : 'bg-slate-800 shadow-sm group-hover:bg-green-900/40'}`}>
                      <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-green-400' : 'text-slate-500 group-hover:text-green-400'}`} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-300 mb-1">
                        {isDragActive ? 'Drop it here!' : 'Click to upload'}
                      </div>
                      <p className="text-sm text-slate-500">
                        or drag and drop your document
                      </p>
                    </div>
                    <div className="pt-4 flex items-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Max file size: 20MB
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      {/* Features Section */}
      <Features />

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">See it in action</h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Experience the magic of chatting with your documents. It's like having the author sitting right next to you, ready to answer any question you have.
              </p>
              <ul className="space-y-5 mb-10">
                {[
                  "Upload a textbook chapter to summarize key concepts",
                  "Upload a financial report to extract specific metrics",
                  "Upload a legal contract to clarify confusing clauses"
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <div className="mt-1 bg-green-500/20 p-1 rounded-full">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-lg text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="bg-green-600 hover:bg-green-500 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:shadow-[0_0_60px_rgba(34,197,94,0.5)] transition-all"
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Try it yourself now
              </Button>
            </motion.div>

            {/* Mock UI */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-[2rem] blur opacity-30"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Mock Header */}
                <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 p-4 flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm font-medium text-slate-400 ml-4 flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Q3_Financial_Report.pdf
                  </div>
                </div>
                {/* Mock Chat Body */}
                <div className="p-6 space-y-6 h-[400px] overflow-hidden flex flex-col justify-end bg-slate-950/50">
                  <div className="flex justify-end">
                    <div className="bg-green-600 text-slate-950 font-medium rounded-2xl rounded-br-none px-5 py-3 max-w-[80%] shadow-md">
                      What was our total revenue for Q3?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-bl-none px-5 py-4 max-w-[85%] shadow-md border border-slate-700">
                      <p className="mb-2">Based on the Q3 Financial Report, the total revenue was <strong>$4.2 million</strong>.</p>
                      <p className="text-sm text-slate-400 border-l-2 border-green-500 pl-3 mt-3">
                        "Total consolidated revenue for the third quarter ending September 30th reached $4.2M, representing a 15% year-over-year growth." (Page 3, Section 1.2)
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-green-600 text-slate-950 font-medium rounded-2xl rounded-br-none px-5 py-3 max-w-[80%] shadow-md">
                      What drove the 15% growth?
                    </div>
                  </div>
                  {/* Mock Input */}
                  <div className="mt-4 relative">
                    <div className="w-full bg-slate-900 border border-slate-700 rounded-full py-3 px-5 text-slate-500 text-sm flex items-center justify-between">
                      <span>Generating response...</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#0a0a0a] border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-white mb-6">How it works</h2>
            <p className="text-xl text-slate-400">Get started in seconds. No complex setup required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900 z-0"></div>
            
            {[
              {
                step: "01",
                title: "Upload Document",
                description: "Drag and drop your document into the upload zone. We support PDFs, TXT, CSV, and Markdown.",
                color: "text-green-400",
                bg: "bg-green-900/30"
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our advanced Gemini AI instantly reads and comprehends the entire document context.",
                color: "text-emerald-400",
                bg: "bg-emerald-900/30"
              },
              {
                step: "03",
                title: "Start Learning",
                description: "Chat with your document, ask questions, or generate practice quizzes immediately.",
                color: "text-teal-400",
                bg: "bg-teal-900/30"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className={`w-24 h-24 rounded-full ${item.bg} border-4 border-slate-800 shadow-xl flex items-center justify-center mb-6`}>
                  <span className={`text-3xl font-black ${item.color}`}>{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Formats / Integrations */}
      <MultiOrbitSemiCircle />

      {/* Footer / CTA */}
      <HoverFooter />
    </div>
  );
}
