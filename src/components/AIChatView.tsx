import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Trash2, Loader2, ArrowDown, HelpCircle, Check } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { AIChatMessage } from '../types';

export const AIChatView: React.FC = () => {
  const { financialSummary, categories, transactions, budgets, goals, currencySymbol, formatCurrency } = useExpense();

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'init_1',
      sender: 'ai',
      text: `Hello! I am your AI Financial Advisor. I have full real-time awareness of your transactions, active category budgets, recurring subscriptions, and savings targets. Ask me anything about your money, budget optimization, or potential savings!`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'How much did I spend on Food this month?',
    'Where am I spending too much money?',
    'How can I save ₹5,000 next month?',
    'Can I afford buying a new gadget worth ₹40,000?',
    'Provide a complete audit of my financial health',
    'What are my highest recurring bill commitments?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMsg: AIChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-8),
          financialSummary,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: AIChatMessage = {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: data.reply || 'Here is what I found based on your financial records.',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('AI Server error');
      }
    } catch (err) {
      console.error(err);
      const fallbackAiMsg: AIChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: `Based on your live records:\n• Total Income: ${formatCurrency(financialSummary.totalIncome)}\n• Current Month Expense: ${formatCurrency(financialSummary.currentMonthExpense)}\n• Net Balance: ${formatCurrency(financialSummary.balance)}\n• Savings Rate: ${financialSummary.savingsRate}%\n\nYou are saving ${financialSummary.savingsRate}% of your income. To save more, consider setting strict caps on Shopping and Food.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `init_${Date.now()}`,
        sender: 'ai',
        text: 'Chat history cleared. How else can I assist your financial planning today?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col rounded-2xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xs dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-white/10 bg-white/20 dark:bg-slate-800/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(56,189,248,0.35)]">
            <Bot className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Expense AI Assistant</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Contextual financial intelligence powered by Gemini 2.5</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Chat
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in`}
            >
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-sky-500 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : 'bg-white/10 dark:bg-white/10 text-sky-400 border border-white/20 backdrop-blur-md'
                }`}
              >
                {isUser ? <User className="w-4 h-4 stroke-[2.5]" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-sky-500 text-slate-950 font-medium shadow-[0_4px_20px_rgba(56,189,248,0.25)] rounded-tr-xs'
                    : 'bg-white/40 dark:bg-slate-800/60 backdrop-blur-xl text-slate-900 dark:text-slate-100 border border-white/40 dark:border-white/10 rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[9px] mt-1.5 font-semibold ${
                    isUser ? 'text-slate-950/70 text-right' : 'text-slate-400 text-left'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3 animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-white/10 text-sky-400 border border-white/20 shrink-0 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white/40 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>Analyzing your financial data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-white/20 dark:bg-slate-800/30 backdrop-blur-md border-t border-white/10 dark:border-white/10 overflow-x-auto">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-400" /> Ask AI:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              disabled={isTyping}
              className="text-xs px-3 py-1 rounded-full bg-white/40 dark:bg-slate-800/60 backdrop-blur-md border border-white/20 dark:border-white/10 hover:border-sky-400 dark:hover:border-sky-400 text-slate-700 dark:text-slate-300 transition-colors shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <div className="p-4 border-t border-white/10 dark:border-white/10 bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about your money, budgets, or predictions..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            className="flex-1 px-4 py-3 rounded-xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-800/60 backdrop-blur-md text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <button
            type="submit"
            disabled={isTyping || !inputText.trim()}
            className="p-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
