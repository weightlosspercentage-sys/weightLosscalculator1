import React from 'react';
import { Unit, WeightLogEntry } from '../types';
import { convertFromLbs } from '../utils/calculations';
import { Printer, X, Award, CheckCircle2 } from 'lucide-react';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: WeightLogEntry[];
  unit: Unit;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  logs,
  unit,
}) => {
  if (!isOpen) return null;

  const unitLabel = unit === 'kg' ? 'kg' : 'lbs';
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const startLog = sortedLogs[0];
  const currentLog = sortedLogs[sortedLogs.length - 1];

  const startWeight = startLog ? convertFromLbs(startLog.weightInLbs, unit) : 0;
  const currentWeight = currentLog ? convertFromLbs(currentLog.weightInLbs, unit) : 0;
  const weightChange = +(startWeight - currentWeight).toFixed(1);
  const percentChange = startWeight > 0 ? +((weightChange / startWeight) * 100).toFixed(2) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Progress & Clinical Summary Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 print:p-0 print:m-0" id="printable-report">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Weight Loss Progress Report
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Generated on {new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-wide">
                Official Summary
              </span>
            </div>
          </div>

          {/* Key Summary Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Starting Weight</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{startWeight} {unitLabel}</p>
              <span className="text-[10px] text-slate-400">{startLog?.date}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Current Weight</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{currentWeight} {unitLabel}</p>
              <span className="text-[10px] text-slate-400">{currentLog?.date}</span>
            </div>
            <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase">Total % Lost</span>
              <p className="text-xl font-black text-emerald-700 mt-1">-{percentChange}%</p>
              <span className="text-[10px] text-emerald-800 font-medium">-{weightChange} {unitLabel}</span>
            </div>
          </div>

          {/* Clinical Status */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Metabolic & Clinical Landmark Status
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${percentChange >= 5 ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span className={percentChange >= 5 ? 'font-semibold text-slate-900' : 'text-slate-500'}>
                  5% Landmark (Blood pressure & HbA1c reduction): {percentChange >= 5 ? 'ACHIEVED' : 'In Progress'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${percentChange >= 10 ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span className={percentChange >= 10 ? 'font-semibold text-slate-900' : 'text-slate-500'}>
                  10% Landmark (Visceral fat depletion & sleep apnea easing): {percentChange >= 10 ? 'ACHIEVED' : 'In Progress'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${percentChange >= 15 ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span className={percentChange >= 15 ? 'font-semibold text-slate-900' : 'text-slate-500'}>
                  15% Landmark (Diabetes remission & fatty liver reversal): {percentChange >= 15 ? 'ACHIEVED' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>

          {/* Log Table Snapshot */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wide text-slate-700 mb-2">
              Weigh-In Record History ({sortedLogs.length} Entries)
            </h4>
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-600 font-semibold">
                <tr>
                  <th className="p-2 border-b">Date</th>
                  <th className="p-2 border-b">Weight</th>
                  <th className="p-2 border-b">% Change</th>
                  <th className="p-2 border-b">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedLogs.map((l) => {
                  const w = convertFromLbs(l.weightInLbs, unit);
                  const p = startWeight > 0 ? +(((startWeight - w) / startWeight) * 100).toFixed(1) : 0;
                  return (
                    <tr key={l.id}>
                      <td className="p-2 text-slate-800">{l.date}</td>
                      <td className="p-2 font-bold text-slate-900">{w} {unitLabel}</td>
                      <td className="p-2 text-emerald-700 font-medium">-{p}%</td>
                      <td className="p-2 text-slate-500">{l.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-slate-400 text-center pt-4 border-t border-slate-100">
            Document generated by Weight Loss Percentage Calculator. For informational and medical tracking purposes.
          </div>
        </div>
      </div>
    </div>
  );
};
