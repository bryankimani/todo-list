import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

/**
 * ProgressChart component to display a pie chart of todo statistics.
 * @param {Array} data - The data for the pie chart.
 */
export const ProgressChart = ({ data }) => {
  // Colors for the pie chart
  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold mb-4">Todo Statistics</h2>
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};