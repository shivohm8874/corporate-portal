import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

type CardTone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type DeltaTone = 'positive' | 'negative' | 'neutral';

function inferCardTone(title: string): CardTone {
  const t = title.toLowerCase();
  if (t.includes('failed') || t.includes('inactive') || t.includes('drop-off')) return 'danger';
  if (t.includes('saved') || t.includes('engagement') || t.includes('active')) return 'success';
  if (t.includes('burn') || t.includes('cost')) return 'warning';
  if (t.includes('sync') || t.includes('forecast')) return 'info';
  if (t.includes('last') || t.includes('remaining')) return 'brand';
  return 'neutral';
}

function inferDeltaTone(delta: string): DeltaTone {
  const d = delta.toLowerCase();
  if (d.includes('+') || d.includes('healthy') || d.includes('active') || d.includes('strong')) return 'positive';
  if (d.includes('-') || d.includes('needs') || d.includes('error') || d.includes('failed')) return 'negative';
  return 'neutral';
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <motion.header className="section-title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </motion.header>
  );
}

export function StatCard({
  title,
  subtitle,
  value,
  delta,
  icon = <Sparkles size={16} />,
  tone,
  deltaTone,
}: {
  title: string;
  subtitle: string;
  value: string;
  delta: string;
  icon?: ReactNode;
  tone?: CardTone;
  deltaTone?: DeltaTone;
}) {
  const resolvedTone = tone ?? inferCardTone(title);
  const resolvedDeltaTone = deltaTone ?? inferDeltaTone(delta);

  return (
    <motion.article className={`card stat-card tone-${resolvedTone}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} whileHover={{ y: -2 }}>
      <div className="row-bet">
        <div>
          <h3>{title}</h3>
          <small>{subtitle}</small>
        </div>
        <span className="card-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
      <span className={`delta delta-${resolvedDeltaTone}`}>{delta}</span>
    </motion.article>
  );
}

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  return (
    <div className="progress-shell">
      <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}
