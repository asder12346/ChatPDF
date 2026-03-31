import React, { useState, useRef, useEffect } from 'react';
import { FileText, MessageCircle, GraduationCap, ArrowUp, Loader2, Plus, RefreshCw, CheckCircle2, XCircle, PanelLeftClose, PanelLeft, X, Trophy, AlertCircle, Copy, Check, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import ReactMarkdown from 'react-markdown';
import { generateChatResponse, generatePracticeQuestions } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  pdfFile: File;
  pdfBase64: string;
  onReset: () => void;
}

type ViewMode = 'chat' | 'practice';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface PracticeQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export function Dashboard({ pdfFile, pdfBase64, onReset }: DashboardProps) {
  const [view, setView] = useState<ViewMode>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Practice State
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[] | null>(null);
  const [isPracticeLoading, setIsPracticeLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getMimeType = (file: File) => {
    if (file.type && file.type !== 'application/octet-stream') return file.type;
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'application/pdf';
      case 'txt': return 'text/plain';
      case 'csv': return 'text/csv';
      case 'md': return 'text/markdown';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default: return 'application/pdf';
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isChatLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    const newHistory = [...chatHistory, { role: 'user' as const, text: userMessage }];
    setChatHistory(newHistory);
    setIsChatLoading(true);

    try {
      const mimeType = getMimeType(pdfFile);
      const responseText = await generateChatResponse(pdfBase64, mimeType, chatHistory, userMessage);
      setChatHistory([...newHistory, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setChatHistory([...newHistory, { role: 'model', text: "Sorry, I encountered an error while processing your request. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const loadPracticeQuestions = async () => {
    setIsPracticeLoading(true);
    setPracticeQuestions(null);
    setSelectedAnswers({});
    setShowResults(false);
    try {
      const mimeType = getMimeType(pdfFile);
      const questions = await generatePracticeQuestions(pdfBase64, mimeType);
      setPracticeQuestions(questions);
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate practice questions. Please try again.");
    } finally {
      setIsPracticeLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'practice' && !practiceQuestions && !isPracticeLoading) {
      loadPracticeQuestions();
    }
  }, [view]);

  const handleOptionSelect = (qIndex: number, option: string) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const calculateScore = () => {
    if (!practiceQuestions) return 0;
    return practiceQuestions.reduce((score, q, i) => {
      return score + (selectedAnswers[i] === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = practiceQuestions?.length || 0;
  const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="flex h-screen bg-[#0a0a0a] relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-zinc-950 border-r border-zinc-800 flex flex-col transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDesktopSidebarCollapsed ? 'w-64 md:w-16' : 'w-64'}`}>
        <div className={`p-4 border-b border-zinc-800 flex items-center ${isDesktopSidebarCollapsed ? 'md:justify-center justify-between' : 'justify-between'}`}>
          <div className={`flex items-center space-x-2 overflow-hidden ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>
            <Bot className="w-6 h-6 text-green-500 flex-shrink-0" />
            <span className="font-semibold text-lg text-white truncate">Chat PDF</span>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)} className="hidden md:flex p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors" title={isDesktopSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
              {isDesktopSidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className={`p-4 ${isDesktopSidebarCollapsed ? 'md:flex md:flex-col md:items-center md:space-y-4' : ''}`}>
          <div className={`text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>Current File</div>
          <div className={`flex items-center bg-zinc-900 rounded-md ${isDesktopSidebarCollapsed ? 'md:justify-center md:p-2 md:mb-0 space-x-2 p-2' : 'space-x-2 p-2'}`} title={pdfFile.name}>
            <FileText className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <span className={`text-sm text-zinc-300 truncate ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>{pdfFile.name}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className={`px-3 space-y-1 ${isDesktopSidebarCollapsed ? 'md:flex md:flex-col md:items-center' : ''}`}>
            <button
              onClick={() => { setView('chat'); setIsSidebarOpen(false); }}
              title="Chat"
              className={`flex items-center rounded-md transition-colors ${
                view === 'chat' ? 'bg-green-500/10 text-green-400' : 'text-zinc-400 hover:bg-zinc-900'
              } ${isDesktopSidebarCollapsed ? 'md:justify-center md:w-10 md:h-10 md:p-0 w-full space-x-3 px-3 py-2' : 'w-full space-x-3 px-3 py-2'}`}
            >
              <MessageCircle className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>Chat</span>
            </button>
            <button
              onClick={() => { setView('practice'); setIsSidebarOpen(false); }}
              title="Practice Questions"
              className={`flex items-center rounded-md transition-colors ${
                view === 'practice' ? 'bg-green-500/10 text-green-400' : 'text-zinc-400 hover:bg-zinc-900'
              } ${isDesktopSidebarCollapsed ? 'md:justify-center md:w-10 md:h-10 md:p-0 w-full space-x-3 px-3 py-2' : 'w-full space-x-3 px-3 py-2'}`}
            >
              <GraduationCap className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium ${isDesktopSidebarCollapsed ? 'md:hidden' : ''}`}>Practice Questions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-green-500" />
            <span className="font-semibold text-lg text-white truncate">Chat PDF</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-zinc-400 hover:text-zinc-200">
            <PanelLeft className="w-6 h-6" />
          </button>
        </div>
        {view === 'chat' ? (
          <div className="flex-1 flex flex-col bg-[#0a0a0a]">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Start Chatting</h2>
                  <p className="text-zinc-400 max-w-md">
                    Ask questions about your PDF, request summaries, or extract specific information.
                  </p>
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                      msg.role === 'user' 
                        ? 'bg-green-600 text-white rounded-br-none' 
                        : 'bg-zinc-900 text-zinc-200 rounded-bl-none'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <div className="flex flex-col">
                          <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => handleCopy(msg.text, i)}
                              className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors bg-zinc-800/50 hover:bg-zinc-800 px-2 py-1 rounded-md"
                              title="Copy response"
                            >
                              {copiedIndex === i ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-green-600" />
                                  <span className="text-green-700 font-medium">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="font-medium">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 rounded-2xl rounded-bl-none px-5 py-4 flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                    <span className="text-zinc-400 text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 bg-[#0a0a0a]">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question about your document..."
                  className="flex-1 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-green-500"
                  disabled={isChatLoading}
                />
                <Button type="submit" disabled={!inputValue.trim() || isChatLoading} size="icon" className="bg-green-600 hover:bg-green-700 text-white">
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0a0a0a]">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                <div>
                  <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-green-500" />
                    Knowledge Check
                  </h2>
                  <p className="text-zinc-400 mt-1">Test your understanding of the document.</p>
                </div>
                <Button onClick={loadPracticeQuestions} variant="outline" disabled={isPracticeLoading} className="rounded-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                  <RefreshCw className={`w-4 h-4 mr-2 ${isPracticeLoading ? 'animate-spin' : ''}`} />
                  Generate New Quiz
                </Button>
              </div>

              {isPracticeLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-zinc-900 p-4 rounded-full shadow-lg border border-zinc-800">
                      <Loader2 className="w-10 h-10 animate-spin text-green-500" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">Analyzing Document</h3>
                    <p className="text-zinc-400 mt-1">Crafting personalized practice questions...</p>
                  </div>
                </div>
              ) : practiceQuestions ? (
                <div className="space-y-8 pb-12">
                  {/* Progress Bar */}
                  <div className="bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl border border-zinc-800 sticky top-0 z-10">
                    <div className="flex justify-between text-sm font-medium text-zinc-400 mb-2">
                      <span>Progress</span>
                      <span>{answeredCount} of {totalQuestions} Answered</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-6">
                    {practiceQuestions.map((q, qIndex) => (
                      <motion.div 
                        key={qIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: qIndex * 0.1 }}
                      >
                        <Card className="overflow-hidden bg-zinc-900/50 border-zinc-800 transition-shadow duration-300 rounded-2xl">
                          <CardHeader className="bg-zinc-900/80 border-b border-zinc-800 pb-5">
                            <CardTitle className="text-lg flex items-start space-x-4 leading-relaxed">
                              <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm mt-0.5">
                                {qIndex + 1}
                              </span>
                              <span className="text-zinc-200">{q.question}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 space-y-3">
                            <div className="grid gap-3">
                              {q.options.map((option, oIndex) => {
                                const isSelected = selectedAnswers[qIndex] === option;
                                const isCorrect = option === q.correctAnswer;
                                const optionLabel = String.fromCharCode(65 + oIndex); // A, B, C, D
                                
                                let optionClass = "border-zinc-800 hover:border-green-500/50 hover:bg-green-500/5 text-zinc-300 bg-zinc-900/50";
                                let labelClass = "bg-zinc-800 text-zinc-400 group-hover:bg-green-500/20 group-hover:text-green-400";
                                
                                if (showResults) {
                                  if (isCorrect) {
                                    optionClass = "border-green-500 bg-green-500/10 text-green-400 shadow-sm ring-1 ring-green-500/50";
                                    labelClass = "bg-green-500/20 text-green-400";
                                  } else if (isSelected && !isCorrect) {
                                    optionClass = "border-red-500/50 bg-red-500/10 text-red-400 shadow-sm ring-1 ring-red-500/50";
                                    labelClass = "bg-red-500/20 text-red-400";
                                  } else {
                                    optionClass = "border-zinc-800 opacity-50 bg-zinc-900/30";
                                  }
                                } else if (isSelected) {
                                  optionClass = "border-green-500 bg-green-500/10 text-green-400 shadow-sm ring-1 ring-green-500/50";
                                  labelClass = "bg-green-500 text-white";
                                }

                                return (
                                  <button
                                    key={oIndex}
                                    onClick={() => handleOptionSelect(qIndex, option)}
                                    disabled={showResults}
                                    className={`group w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${optionClass}`}
                                  >
                                    <div className="flex items-center space-x-4">
                                      <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${labelClass}`}>
                                        {optionLabel}
                                      </span>
                                      <span className="font-medium">{option}</span>
                                    </div>
                                    {showResults && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 ml-4" />}
                                    {showResults && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 ml-4" />}
                                  </button>
                                );
                              })}
                            </div>

                            <AnimatePresence>
                              {showResults && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                  className="overflow-hidden"
                                >
                                  <div className={`p-5 rounded-xl border ${selectedAnswers[qIndex] === q.correctAnswer ? 'bg-green-500/10 border-green-500/20' : 'bg-zinc-800/50 border-zinc-700'}`}>
                                    <div className="flex items-start space-x-3">
                                      <div className="mt-0.5">
                                        {selectedAnswers[qIndex] === q.correctAnswer ? 
                                          <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                                          <AlertCircle className="w-5 h-5 text-zinc-400" />
                                        }
                                      </div>
                                      <div>
                                        <p className="font-bold text-sm mb-1 text-white">
                                          {selectedAnswers[qIndex] === q.correctAnswer ? 'Correct!' : 'Explanation'}
                                        </p>
                                        <p className="text-sm text-zinc-300 leading-relaxed">{q.explanation}</p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-8 flex justify-center">
                    {!showResults ? (
                      <Button 
                        size="lg" 
                        onClick={() => setShowResults(true)}
                        disabled={answeredCount < totalQuestions}
                        className="rounded-full px-12 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {answeredCount < totalQuestions ? `Answer all questions to submit` : `Submit Answers`}
                      </Button>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-800 text-center max-w-md w-full"
                      >
                        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Trophy className="w-10 h-10 text-yellow-600" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2">
                          {calculateScore()} / {totalQuestions}
                        </h3>
                        <p className="text-zinc-400 mb-8 text-lg">
                          {calculateScore() === totalQuestions ? 'Perfect score! Excellent work.' : 
                           calculateScore() >= totalQuestions / 2 ? 'Good job! Keep practicing.' : 
                           'Review the explanations and try again!'}
                        </p>
                        <Button size="lg" onClick={loadPracticeQuestions} className="w-full rounded-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 text-white">
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Try Another Quiz
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
