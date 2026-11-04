/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface SelfAssessmentWidgetProps {
  onRequestAudit: () => void;
  onViewSampleReport: () => void;
  className?: string;
}

interface Question {
  id: number;
  question: string;
  context: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Does the team classify inventory by the last movement date?',
    context: 'Checks whether items are segregated by time elapsed since last consumption or dispatch.',
  },
  {
    id: 2,
    question: 'Do purchasing and warehouse teams work from the same inventory view?',
    context: 'Evaluates alignment between replenishment orders and physical bin stock.',
  },
  {
    id: 3,
    question: 'Is non-moving stock reviewed at individual SKU level?',
    context: 'Checks whether reviews examine specific line items rather than broad aggregate book values.',
  },
  {
    id: 4,
    question: 'Can management identify high-value inactive stock quickly?',
    context: 'Measures how easily leadership spots top rupee exposure among stagnant items.',
  },
  {
    id: 5,
    question: 'Are ageing definitions applied consistently?',
    context: 'Verifies whether stores, operations, and finance use identical 90/180/365-day thresholds.',
  },
];

type AnswerValue = 'yes' | 'partially' | 'no' | 'unsure';

const OPTIONS: { label: string; value: AnswerValue; points: number }[] = [
  { label: 'Yes', value: 'yes', points: 3 },
  { label: 'Partially', value: 'partially', points: 2 },
  { label: 'No', value: 'no', points: 0 },
  { label: 'Unsure', value: 'unsure', points: 1 },
];

export const SelfAssessmentWidget: React.FC<SelfAssessmentWidgetProps> = ({
  onRequestAudit,
  onViewSampleReport,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});

  const totalQuestions = QUESTIONS.length;
  const isCompleted = currentStep >= totalQuestions;

  const handleSelectOption = (qId: number, value: AnswerValue) => {
    if (currentStep === 0) {
      trackEvent('self_assessment_started');
    }
    const updated = { ...answers, [qId]: value };
    setAnswers(updated);
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    if (nextStep >= totalQuestions) {
      trackEvent('self_assessment_completed', { answers: updated });
    }
  };

  const reset = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  // Compute Total Score
  const totalScore = Object.values(answers).reduce((acc, val) => {
    const opt = OPTIONS.find((o) => o.value === val);
    return acc + (opt ? opt.points : 0);
  }, 0);

  // Cautious result determination (out of 15 max points)
  let outcomeTitle = 'Review Recommended';
  let outcomeDescription =
    'Several core visibility indicators suggest that dormant inventory value may be accumulating without clear individual SKU tracking.';
  let badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  if (totalScore >= 12) {
    outcomeTitle = 'Strong Visibility Foundation';
    outcomeDescription =
      'Your plant appears to have established systematic tracking for movement dates and cross-functional inventory alignment.';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (totalScore >= 7) {
    outcomeTitle = 'Some Visibility Gaps';
    outcomeDescription =
      'Basic tracking mechanisms are present, but certain categories or departments may lack consistent SKU-level dormancy reviews.';
    badgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
  }

  const currentQ = QUESTIONS[currentStep];

  return (
    <div
      className={`rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 md:p-8 space-y-6 shadow-2xl ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              SELF-ASSESSMENT · ZERO OBLIGATION
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">
              {isCompleted ? 'Completed' : `Question ${currentStep + 1} of ${totalQuestions}`}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            How Clear Is Your Current Inventory View?
          </h3>
          <p className="text-xs text-slate-400">
            A quick five-question check on your plant&apos;s operational inventory visibility.
          </p>
        </div>

        {isCompleted && (
          <button
            onClick={reset}
            className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Check</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${Math.round(((isCompleted ? totalQuestions : currentStep) / totalQuestions) * 100)}%` }}
        />
      </div>

      {/* Active Question View */}
      {!isCompleted && currentQ && (
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              Question 0{currentQ.id}:
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentQ.question}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">{currentQ.context}</p>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(currentQ.id, opt.value)}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 text-slate-200 hover:text-white text-xs font-mono font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center group"
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 font-mono text-center pt-1">
            No contact details or login required to complete this assessment.
          </p>
        </div>
      )}

      {/* Completed Results View */}
      {isCompleted && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${badgeColor}`}>
                Observation: {outcomeTitle}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Score: {totalScore} / 15
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {outcomeDescription}
            </p>

            <div className="text-[11px] text-slate-400 font-mono border-t border-slate-850 pt-2.5">
              Note: This assessment provides general operational reflection based on self-reported answers. It does not constitute a formal financial, accounting, or inventory diagnosis.
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-300">
              Curious what a structured inventory audit looks like in practice?
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onViewSampleReport}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>View an Illustrative Audit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
