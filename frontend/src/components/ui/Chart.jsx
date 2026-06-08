import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

export function BarChartComponent({ data, dataKey, nameKey, title, color = '#8b5cf6' }) {
  return (
    <div className="w-full h-64">
      <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey={nameKey} stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(30, 30, 40, 0.9)', border: 'none', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChartComponent({ data, dataKey, nameKey, title }) {
  return (
    <div className="w-full h-64">
      <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(30, 30, 40, 0.9)', border: 'none', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChartComponent({ data, dataKey, nameKey, title, color = '#3b82f6' }) {
  return (
    <div className="w-full h-64">
      <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey={nameKey} stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(30, 30, 40, 0.9)', border: 'none', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}