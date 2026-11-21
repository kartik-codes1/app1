import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Zap, Check, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';

export function SignupPage() {
  const { signUp } = useAuth();
  const { navigate } = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    const { error: err } = await signUp(email, password, name, company);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate('/app');
    }
  };

  const perks = ['14-day free trial', 'No credit card required', 'Cancel anytime'];

  return (
    <AuthLayout side="right">
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-2.5 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white"><Zap size={18} fill="currentColor" /></span>
          <span className="font-display text-lg font-bold text-ink-900 dark:text-white">BizPilot AI</span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900 dark:text-white">Create your workspace</h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Start your 14-day trial. No credit card needed.</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} icon={<User size={16} />} placeholder="Alex Morgan" required />
        <Input label="Company name" value={company} onChange={(e) => setCompany(e.target.value)} icon={<Building2 size={16} />} placeholder="Northwind Trading Co." required />
        <Input label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />} placeholder="you@company.com" required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock size={16} />} placeholder="At least 8 characters" hint="Use 8+ characters with a mix of letters and numbers." required />
        <Button type="submit" className="w-full py-3" disabled={loading}>
          {loading ? <><Loader2 size={16} className="animate-spin" /> Creating workspace…</> : <>Create account <ArrowRight size={16} /></>}
        </Button>
      </form>

      <ul className="mt-6 space-y-2">
        {perks.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300"><Check size={15} className="text-accent-500" /> {p}</li>
        ))}
      </ul>

      <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
        Already have an account? <a href="#/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Sign in</a>
      </p>
    </AuthLayout>
  );
}
