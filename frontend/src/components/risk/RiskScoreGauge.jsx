import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { getRiskClasses } from "../../data/riskData";

const RiskScoreGauge = ({ score, level }) => {
  const classes = getRiskClasses(level);
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
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
        <span className="text-5xl font-bold text-gray-800">{score}</span>
        <span className={`mt-2 text-sm font-semibold ${classes.text}`}>
          {level} Risk
        </span>
        <span className="mt-1 text-xs text-gray-500">out of 100</span>
      </div>
    </div>
  );
};

export default RiskScoreGauge;
