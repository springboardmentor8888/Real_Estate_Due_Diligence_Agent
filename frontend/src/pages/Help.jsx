import React from "react";

const Help = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">Help & Support</h1>

      <p className="mt-1 text-slate-500">
        Find answers and get assistance with the application.
      </p>

      {/* FAQ */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="font-medium text-slate-800">
              How do I search for a property?
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Go to Search Property and search using the property address, city,
              or pincode.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-slate-800">
              What is risk assessment?
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Risk assessment evaluates available property information such as
              ownership, taxes, permits, flood and environmental records.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-slate-800">
              How can I generate a due diligence report?
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Open the property details page and use the report generation
              option to create the due diligence report.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-slate-800">
              What should I do if property information is missing?
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Verify the connected property records and review the available
              risk evidence before proceeding.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-slate-900">
          Contact Support
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          If you need additional assistance, contact the support team.
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="font-medium">Email:</span>{" "}
            support@realestateagent.com
          </p>

          <p>
            <span className="font-medium">Support Hours:</span> Monday – Friday,
            9:00 AM – 6:00 PM
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-slate-900">Quick Help</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-medium">Search Property</p>
            <p className="mt-1 text-sm text-slate-500">
              Find and review properties.
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-medium">Risk Assessment</p>
            <p className="mt-1 text-sm text-slate-500">
              Review property risk factors.
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-medium">Reports</p>
            <p className="mt-1 text-sm text-slate-500">
              Generate due diligence reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
