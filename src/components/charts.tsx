import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const trendData = [
  { name: 'Aug', value: 45, alt: 12 },
  { name: 'Sep', value: 44, alt: 14 },
  { name: 'Oct', value: 43, alt: 16 },
  { name: 'Nov', value: 41, alt: 18 },
  { name: 'Dec', value: 39, alt: 19 },
  { name: 'Jan', value: 37, alt: 20 },
  { name: 'Feb', value: 35, alt: 22 },
];

const pieData = [
  { name: 'Tele-consultations', value: 35 },
  { name: 'In-office Medicine', value: 31 },
  { name: 'Lab Tests (On-site)', value: 24 },
  { name: 'Insurance Recovery', value: 10 },
];

const pieColors = ['#6e3df1', '#9470f6', '#b8a0fb', '#ddd1fe'];

export function LineTrendChart({ color = 'var(--brand)' }: { color?: string }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={trendData}>
          <XAxis dataKey="name" tick={{ fill: '#98a0b4', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#a6aec1', fontSize: 12 }} axisLine={false} tickLine={false} width={24} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill={color} fillOpacity={0.15} isAnimationActive />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RingScore({ score, label }: { score: number; label: string }) {
  return (
    <div className="ring-wrap">
      <div className="ring-chart">
        <ResponsiveContainer width={188} height={188}>
          <PieChart>
            <Pie data={[{ value: score }, { value: 100 - score }]} dataKey="value" innerRadius={60} outerRadius={78} startAngle={90} endAngle={-270} cornerRadius={10} stroke="none">
              <Cell fill="#16b36d" />
              <Cell fill="#e8edf8" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="ring-center">
          <strong>{score}%</strong>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}

export function CreditsUsagePie() {
  return (
    <div className="donut-wrap">
      <ResponsiveContainer width={240} height={240}>
        <PieChart>
          <Pie data={pieData} dataKey="value" innerRadius={68} outerRadius={96} stroke="#fff" strokeWidth={3}>
            {pieData.map((entry, index) => (
              <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyBurnChart() {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={255}>
        <BarChart data={trendData}>
          <XAxis dataKey="name" tick={{ fill: '#98a0b4', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#a6aec1', fontSize: 12 }} axisLine={false} tickLine={false} width={26} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#purpleFill)" isAnimationActive />
          <defs>
            <linearGradient id="purpleFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8f5cff" />
              <stop offset="100%" stopColor="#6f3cf0" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SavingsCompareChart() {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={trendData}>
          <XAxis dataKey="name" tick={{ fill: '#98a0b4', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#a6aec1', fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#f14648" />
          <Bar dataKey="alt" radius={[8, 8, 0, 0]} fill="#6f3cf0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
