import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ShieldAlert, ShieldCheck, Loader2, Info, UserCheck, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { riskAssessmentService } from '../services/api';

export default function PropertyRisk({ propertyId }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadRiskData = async () => {
      if (!propertyId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await riskAssessmentService.getByProperty(propertyId);
        if (isMounted) {
          setAssessments(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error('Failed to load risk assessments:', err);
        if (isMounted) {
          // If 404 or empty, treat as no assessments
          if (err.response?.status === 404) {
            setAssessments([]);
          } else {
            setError('Unable to load risk assessment data from the server.');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRiskData();
    return () => { isMounted = false; };
  }, [propertyId]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm text-slate-500">Loading risk assessments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Error Loading Risk Data</p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Calculate overall risk score from real assessments
  const hasAssessments = assessments.length > 0;
  const avgScore = hasAssessments
    ? (assessments.reduce((acc, curr) => acc + (Number(curr.riskScore) || 0), 0) / assessments.length).toFixed(1)
    : null;

  const getScoreBadgeColor = (score) => {
    const num = Number(score);
    if (num < 35) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (num < 65) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getLevelBadgeVariant = (level) => {
    const l = (level || '').toUpperCase();
    if (l === 'LOW') return 'bg-emerald-500 text-white';
    if (l === 'MEDIUM' || l === 'MODERATE') return 'bg-amber-500 text-white';
    return 'bg-red-600 text-white';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            Due Diligence Risk Assessment
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Multi-factor evaluation recorded in PostgreSQL by authorized legal reviewers, agents, and financial underwriters.
          </p>
        </div>

        {hasAssessments && avgScore && (
          <div className={`flex items-center gap-2 rounded-full border px-4 py-2 font-semibold text-sm ${getScoreBadgeColor(avgScore)}`}>
            {Number(avgScore) < 50 ? <CheckCircle2 className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            <span>Average Risk Score: {avgScore}/100</span>
          </div>
        )}
      </div>

      {!hasAssessments ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-800">No Risk Assessments Recorded Yet</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            No formal multi-factor risk assessments have been conducted or persisted for this property in the database.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Agents and Legal Reviewers can record assessments through the Risk Categories & Due Diligence modules.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {assessments.map((assessment, index) => {
            const categoryName = assessment.riskCategory?.categoryName || assessment.categoryName || `Category Assessment #${index + 1}`;
            const score = assessment.riskScore != null ? Number(assessment.riskScore).toFixed(0) : 'N/A';
            const level = assessment.riskLevel || 'LOW';
            const recommendation = assessment.recommendation || 'Standard compliance protocols; no anomalies reported.';
            const assessor = assessment.assessedBy?.firstName
              ? `${assessment.assessedBy.firstName} ${assessment.assessedBy.lastName || ''}`.trim()
              : (assessment.assessorName || 'Certified Assessor');

            return (
              <div
                key={assessment.assessmentId || index}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-base">{categoryName}</h4>
                    <span className="text-xs text-slate-500">
                      Score: <strong className="text-slate-800">{score}/100</strong>
                    </span>
                  </div>
                  <Badge className={getLevelBadgeVariant(level)}>
                    {level} RISK
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {recommendation}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                    {assessor}
                  </span>
                  {assessment.assessmentDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(assessment.assessmentDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
