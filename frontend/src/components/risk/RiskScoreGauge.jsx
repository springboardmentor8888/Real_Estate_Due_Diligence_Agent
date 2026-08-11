import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

function getRiskClasses(level = "LOW") {
  const normalized = String(level || "LOW").toUpperCase();
  if (normalized === "HIGH") {
    return { hex: "#dc2626", text: "text-red-700" };
  }
  if (normalized === "MEDIUM") {
    return { hex: "#f59e0b", text: "text-amber-700" };
  }
  return { hex: "#16a34a", text: "text-green-700" };
}

const RiskScoreGauge = ({ score, level }) => {
  const classes = getRiskClasses(level);
  const safeScore = Number.isFinite(Number(score)) ? Math.min(100, Math.max(0, Number(score))) : 0;
  const data = [
    { name: "Score", value: safeScore },
    { name: "Remaining", value: 100 - safeScore },
  ];

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            dataKey="value"
            innerRadius="68%"
            outerRadius="88%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill={classes.hex} />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-gray-800">{safeScore}</span>
        <span className={`mt-2 text-sm font-semibold ${classes.text}`}>
          {String(level || "LOW").toUpperCase()}
        </span>
        <span className="mt-1 text-xs text-gray-500">out of 100</span>
      </div>
    </div>
  );
};

export default RiskScoreGauge;
