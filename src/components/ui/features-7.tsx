import React from 'react';
import { Cpu, Lock, Sparkles, Zap, MessageSquare, BookOpen, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export function Features() {
    return (
        <section id="features" className="overflow-hidden py-16 md:py-32 bg-slate-50 border-t border-slate-100">
            <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8 md:space-y-12">
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4 uppercase tracking-wider">
                        <span>Supercharge your learning</span>
                    </div>
                    <h2 className="text-4xl font-extrabold lg:text-5xl text-slate-900">Everything you need to master your documents</h2>
                    <p className="mt-6 text-lg text-slate-600">Powerful AI tools designed to help you learn faster, comprehend deeper, and retain more information from your reading materials.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {[
                        {
                            icon: <MessageSquare className="w-7 h-7 text-blue-600" />,
                            title: "Conversational Chat",
                            description: "Ask complex questions and get answers instantly. The AI understands the full context of your document, acting as your personal tutor.",
                            bg: "bg-blue-50",
                            border: "border-blue-100"
                        },
                        {
                            icon: <BookOpen className="w-7 h-7 text-indigo-600" />,
                            title: "Practice Quizzes",
                            description: "Automatically generate multiple-choice questions to test your knowledge. Get instant feedback and detailed explanations for every answer.",
                            bg: "bg-indigo-50",
                            border: "border-indigo-100"
                        },
                        {
                            icon: <FileText className="w-7 h-7 text-purple-600" />,
                            title: "Accurate Citations",
                            description: "Every answer is grounded in your document. The AI provides reliable, hallucination-free information based strictly on the uploaded text.",
                            bg: "bg-purple-50",
                            border: "border-purple-100"
                        }
                    ].map((feature, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="group p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className={`w-16 h-16 rounded-2xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-lg relative z-10">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="relative mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-12">
                    {[
                        {
                            icon: <Zap className="size-5 text-blue-600" />,
                            title: "Lightning Fast",
                            description: "Process 100-page PDFs in seconds and get instant contextual answers to your questions.",
                            bg: "bg-blue-50",
                            border: "border-blue-100",
                            hoverBorder: "hover:border-blue-300",
                            hoverShadow: "hover:shadow-blue-100/50"
                        },
                        {
                            icon: <Cpu className="size-5 text-indigo-600" />,
                            title: "Powerful AI",
                            description: "Powered by advanced reasoning to understand complex document contexts and nuances.",
                            bg: "bg-indigo-50",
                            border: "border-indigo-100",
                            hoverBorder: "hover:border-indigo-300",
                            hoverShadow: "hover:shadow-indigo-100/50"
                        },
                        {
                            icon: <Lock className="size-5 text-purple-600" />,
                            title: "Secure & Private",
                            description: "Your documents are processed securely and never used to train public AI models.",
                            bg: "bg-purple-50",
                            border: "border-purple-100",
                            hoverBorder: "hover:border-purple-300",
                            hoverShadow: "hover:shadow-purple-100/50"
                        },
                        {
                            icon: <Sparkles className="size-5 text-amber-500" />,
                            title: "Auto-Quizzes",
                            description: "Automatically generate practice questions to test your knowledge and retention.",
                            bg: "bg-amber-50",
                            border: "border-amber-100",
                            hoverBorder: "hover:border-amber-300",
                            hoverShadow: "hover:shadow-amber-100/50"
                        }
                    ].map((feature, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${feature.hoverBorder} ${feature.hoverShadow}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 ${feature.bg} rounded-xl border ${feature.border}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
