import { useState } from 'react';
import { Mail, Lock, ArrowRight, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';

export function LoginPage() {
  const { signIn } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate('/app');
    }
  };

  return (
    <AuthLayout side="left">
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-2.5 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white"><Zap size={18} fill="currentColor" /></span>
          <span className="font-display text-lg font-bold text-ink-900 dark:text-white">BizPilot AI</span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Sign in to your BizPilot AI workspace.</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />} placeholder="you@company.com" required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock size={16} />} placeholder="••••••••" required />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink-600 dark:text-ink-300">
            <input type="checkbox" className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500 dark:border-ink-600 dark:bg-ink-800" defaultChecked /> Remember me
          </label>
          <a href="#" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">Forgot password?</a>
        </div>
        <Button type="submit" className="w-full py-3" disabled={loading}>
          {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Sign in <ArrowRight size={16} /></>}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
        Don't have an account? <a href="#/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Sign up free</a>
      </p>
    </AuthLayout>
  );
}
