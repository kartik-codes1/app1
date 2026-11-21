import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Zap, TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { assistantSeed, assistantSuggestions, assistantReplies } from '@/lib/mockData';
import type { ChatMessage } from '@/lib/types';
import { cx } from '@/lib/format';

const insights = [
  { icon: TrendingUp, title: 'Revenue is up 12.4%', desc: 'Electronics leading growth this month.', tone: 'green' as const },
  { icon: Package, title: '2 products need restock', desc: 'Pulse Fitness Band, Nimbus Smart Bottle.', tone: 'amber' as const },
  { icon: Users, title: '1 customer at risk', desc: 'Emma Wright — 47 days since last order.', tone: 'red' as const },
];

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(assistantSeed);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const replyIndex = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = assistantReplies[replyIndex.current % assistantReplies.length];
      replyIndex.current += 1;
      const aiMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: reply,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      };
      setMessages((m) => [...m, aiMsg]);
      setTyping(false);
    }, 1100);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="AI Business Assistant"
        subtitle="Ask anything about your business — get data-grounded answers instantly."
        actions={<Badge tone="brand"><Sparkles size={12} /> Pilot AI v2</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat */}
        <Card className="flex h-[640px] flex-col p-0 lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-ink-200/70 px-5 py-4 dark:border-ink-800/60">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft"><Sparkles size={20} /></span>
            <div>
              <p className="font-display text-sm font-semibold text-ink-800 dark:text-ink-100">Pilot AI</p>
              <p className="flex items-center gap-1.5 text-xs text-ink-400">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse-soft" /> Online — knows your business
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m) => (
              <div key={m.id} className={cx('flex animate-fade-in gap-3', m.role === 'user' && 'flex-row-reverse')}>
                <span className={cx(
                  'grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white shadow-soft',
                  m.role === 'assistant' ? 'bg-gradient-to-br from-brand-500 to-brand-700' : 'bg-ink-600',
                )}>
                  {m.role === 'assistant' ? <Sparkles size={15} /> : <Zap size={15} />}
                </span>
                <div className={cx('max-w-[80%] rounded-2xl px-4 py-2.5 text-sm', m.role === 'assistant' ? 'bg-ink-100 text-ink-800 dark:bg-ink-800 dark:text-ink-100' : 'bg-brand-600 text-white')}>
                  <p className="leading-relaxed">{m.content}</p>
                  <p className={cx('mt-1.5 text-[10px]', m.role === 'assistant' ? 'text-ink-400' : 'text-white/60')}>{m.time}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3 animate-fade-in">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white"><Sparkles size={15} /></span>
                <div className="flex items-center gap-1 rounded-2xl bg-ink-100 px-4 py-3 dark:bg-ink-800">
                  <span className="h-2 w-2 rounded-full bg-ink-400 animate-pulse-soft" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-ink-400 animate-pulse-soft" style={{ animationDelay: '200ms' }} />
                  <span className="h-2 w-2 rounded-full bg-ink-400 animate-pulse-soft" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-5 pb-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Suggested questions</p>
              <div className="flex flex-wrap gap-2">
                {assistantSuggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:border-brand-500">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-ink-200/70 p-4 dark:border-ink-800/60">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Pilot AI anything about your business…"
                className="input-base flex-1"
              />
              <Button type="submit" className="px-3.5" disabled={!input.trim()}><Send size={16} /></Button>
            </form>
            <p className="mt-2 text-center text-[11px] text-ink-400">Pilot AI can analyze your data and suggest actions. Always review before applying.</p>
          </div>
        </Card>

        {/* Insights sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-base font-semibold text-ink-800 dark:text-ink-100">Today's insights</h3>
            <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">Auto-generated by Pilot AI</p>
            <div className="mt-4 space-y-3">
              {insights.map((i) => (
                <div key={i.title} className="flex items-start gap-3 rounded-xl border border-ink-200/70 p-3 dark:border-ink-800/60">
                  <span className={cx(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-lg',
                    i.tone === 'green' ? 'bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300' :
                    i.tone === 'amber' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300' :
                    'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300',
                  )}>
                    <i.icon size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{i.title}</p>
                    <p className="text-xs text-ink-500 dark:text-ink-400">{i.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
            <DollarSign className="mb-3" size={24} />
            <p className="font-display text-base font-semibold">Forecast ready</p>
            <p className="mt-1 text-sm text-white/85">Pilot AI projects $138k–$152k revenue next quarter based on current trends.</p>
            <Button variant="outline" className="mt-4 w-full border-white/30 bg-white/10 text-white hover:bg-white/20">View forecast</Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
