import { useState, useRef, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AIChatAssistant({ resumeId }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'SYSTEM_READY: I am your AI-driven resume optimization utility. Input query to begin analysis or refinement.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const chatMessages = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await api.post(`/resume/${resumeId}/chat`, { messages: chatMessages });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.data.reply }]);
    } catch (err) {
      toast.error('Connection fault');
      setMessages(prev => [...prev, { role: 'assistant', content: 'FATAL_ERROR: Connection to neural processing unit lost.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full font-mono bg-[var(--terminal-bg)]">
      {/* Header */}
      <div className="p-3 border-b border-[var(--terminal-border)] bg-[var(--terminal-header)]">
        <h3 className="text-[10px] font-bold text-[var(--terminal-accent)] uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--terminal-accent)] rounded-full animate-pulse" />
          Neural_Net_Link_Established
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-terminal">
        {messages.map((msg, i) => (
          <div key={i} className="animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase ${msg.role === 'user' ? 'text-white' : 'text-[var(--terminal-accent)]'}`}>
                {msg.role === 'user' ? '[LOCAL_USER]' : '[REMOTE_AI]'}
              </span>
              <span className="text-[10px] text-[var(--terminal-muted)]">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className={`text-xs leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-[var(--terminal-text)] opacity-90'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 animate-pulse">
            <span className="text-[10px] font-bold text-[var(--terminal-accent)]">[PROCESSING]</span>
            <span className="text-xs text-[var(--terminal-muted)]">...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--terminal-border)]">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-0 bottom-0 flex items-center text-[var(--terminal-accent)] text-xs leading-none">{'>'}</span>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ENTER_QUERY..."
              className="input-terminal !pl-8 !text-xs h-9"
              disabled={loading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="btn-terminal btn-terminal-primary !px-4 text-[10px] font-bold h-9 flex items-center justify-center"
          >
            EXEC
          </button>
        </div>
      </div>
    </div>
  );
}

