import React, { useState, useRef, useEffect } from 'react';
import { useProcurement } from '../../context/ProcurementContext';
import { Bot, Send, Sparkles, User as UserIcon, ArrowRight, Loader2, Table, ChevronRight } from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const { chatMessages, sendChatMessage, setActivePage } = useProcurement();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Which suppliers are high risk?",
    "Which RFQ has the best quotation?",
    "Where can we reduce procurement costs?",
    "Should we buy steel now?",
    "Which suppliers have the best delivery performance?",
    "Why did procurement spending increase this month?"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    sendChatMessage(query);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 800);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-950 shadow-lg shadow-blue-500/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              ProcureAI Assistant
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask questions about your procurement data, active suppliers, RFQs & price forecasts.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Grounded in Real-Time ERP Context</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Suggested Questions:</span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map(q => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-medium transition-all text-left group"
            >
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="glass-panel rounded-3xl border border-slate-800 flex flex-col h-[550px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}>
                {msg.sender === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Bubble Content */}
              <div className={`max-w-2xl space-y-3 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Optional Data Table Snippet */}
                {msg.dataTable && (
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs overflow-x-auto text-left">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                          {msg.dataTable.headers.map((h, i) => (
                            <th key={i} className="pb-2 pr-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {msg.dataTable.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="py-2 pr-4 font-medium">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Optional Action Button Link */}
                {msg.actionLink && (
                  <div className="text-left">
                    <button
                      onClick={() => setActivePage(msg.actionLink!.page, { targetId: msg.actionLink!.targetId })}
                      className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>{msg.actionLink.label}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <span className="text-[10px] text-slate-500 block px-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <span className="animate-pulse">ProcureAI is synthesizing procurement data...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ask about suppliers, RFQs, price forecasts, or savings opportunities..."
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
