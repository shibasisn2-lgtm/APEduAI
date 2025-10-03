import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Low Risk', value: 62, color: 'hsl(142, 76%, 36%)' },
  { name: 'Medium Risk', value: 28, color: 'hsl(38, 92%, 50%)' },
  { name: 'High Risk', value: 10, color: 'hsl(0, 84%, 60%)' },
];

export default function RiskDistributionChart() {
  return (
    <div className="h-[200px]" data-testid="chart-risk-distribution">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={60}
            innerRadius={25}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
