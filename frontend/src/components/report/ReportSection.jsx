const ReportSection = ({ title, icon, children }) => {
  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        {icon}
        {title}
      </h2>

      {children}
    </section>
  );
};

export default ReportSection;
