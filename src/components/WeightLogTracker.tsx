import React, { useState, useMemo } from 'react';
import { WeightLogEntry, Unit } from '../types';
import { convertToLbs, convertFromLbs } from '../utils/calculations';
import { INITIAL_DEMO_LOGS } from '../utils/storage';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  LineChart as ChartIcon,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';

interface WeightLogTrackerProps {
  logs: WeightLogEntry[];
  unit: Unit;
  onAddLog: (entry: Omit<WeightLogEntry, 'id'>) => void;
  onDeleteLog: (id: string) => void;
  onResetLogs: (newLogs: WeightLogEntry[]) => void;
}

export const WeightLogTracker: React.FC<WeightLogTrackerProps> = ({
  logs,
  unit,
  onAddLog,
  onDeleteLog,
  onResetLogs,
}) => {
  const [newDate, setNewDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [newWeight, setNewWeight] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const unitLabel = unit === 'kg' ? 'kg' : 'lbs';

  // Sort logs by date ascending for charts and calculations
  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  // Baseline starting weight from first entry
  const startEntry = sortedLogs.length > 0 ? sortedLogs[0] : null;
  const startWeightLbs = startEntry ? startEntry.weightInLbs : 0;
  const currentEntry = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1] : null;

  // Milestone targets in current unit
  const target5PctLbs = startWeightLbs * 0.95;
  const target10PctLbs = startWeightLbs * 0.90;

  const target5PctDisplay = convertFromLbs(target5PctLbs, unit);
  const target10PctDisplay = convertFromLbs(target10PctLbs, unit);

  // Prepare chart data
  const chartData = useMemo(() => {
    return sortedLogs.map((item, index) => {
      const displayVal = convertFromLbs(item.weightInLbs, unit);
      const diffLbs = startWeightLbs - item.weightInLbs;
      const pct = startWeightLbs > 0 ? +((diffLbs / startWeightLbs) * 100).toFixed(1) : 0;

      // Delta from previous entry
      let delta = 0;
      if (index > 0) {
        const prevLbs = sortedLogs[index - 1].weightInLbs;
        const deltaLbs = item.weightInLbs - prevLbs;
        delta = +(convertFromLbs(Math.abs(deltaLbs), unit) * (deltaLbs > 0 ? 1 : -1)).toFixed(1);
      }

      return {
        id: item.id,
        date: item.date,
        displayDate: new Date(item.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
        weight: displayVal,
        percentLost: pct,
        delta,
        notes: item.notes || '',
      };
    });
  }, [sortedLogs, unit, startWeightLbs]);

  // Overall summary metrics
  const summary = useMemo(() => {
    if (sortedLogs.length === 0) return null;
    const startLbs = sortedLogs[0].weightInLbs;
    const endLbs = sortedLogs[sortedLogs.length - 1].weightInLbs;
    const allLbs = sortedLogs.map((l) => l.weightInLbs);
    const minLbs = Math.min(...allLbs);
    const maxLbs = Math.max(...allLbs);

    const netChangeLbs = endLbs - startLbs;
    const netChangeUnit = convertFromLbs(Math.abs(netChangeLbs), unit) * (netChangeLbs > 0 ? 1 : -1);
    const netPercent = startLbs > 0 ? +(((startLbs - endLbs) / startLbs) * 100).toFixed(1) : 0;

    return {
      entriesCount: sortedLogs.length,
      startWeight: convertFromLbs(startLbs, unit),
      currentWeight: convertFromLbs(endLbs, unit),
      lowestWeight: convertFromLbs(minLbs, unit),
      highestWeight: convertFromLbs(maxLbs, unit),
      netChangeUnit: +netChangeUnit.toFixed(1),
      netPercent,
      isLoss: netChangeLbs < 0,
    };
  }, [sortedLogs, unit]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const num = parseFloat(newWeight);
    if (!num || num <= 0) {
      setErrorMsg('Please enter a valid weight.');
      return;
    }

    const lbs = convertToLbs(num, unit);

    onAddLog({
      date: newDate,
      weight: num,
      unit: unit,
      weightInLbs: lbs,
      notes: newNotes.trim() || undefined,
    });

    setNewWeight('');
    setNewNotes('');
  };

  const handleExportCsv = () => {
    if (sortedLogs.length === 0) return;
    const headers = ['Date', `Weight (${unitLabel})`, 'Weight (lbs)', 'Notes'];
    const rows = sortedLogs.map((l) => [
      l.date,
      convertFromLbs(l.weightInLbs, unit),
      l.weightInLbs.toFixed(1),
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `weight_loss_history_${unitLabel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Weight Lost
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-emerald-600">
                {summary.netPercent > 0 ? `-${summary.netPercent}%` : `${summary.netPercent}%`}
              </span>
            </div>
            <span className="text-xs text-slate-600 mt-0.5 block">
              {summary.netChangeUnit < 0 ? `${summary.netChangeUnit}` : `+${summary.netChangeUnit}`} {unitLabel} net
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Starting vs Current
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900">
                {summary.startWeight} → {summary.currentWeight}
              </span>
              <span className="text-xs text-slate-500">{unitLabel}</span>
            </div>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Over {summary.entriesCount} recorded weigh-ins
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Lowest Recorded
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">
                {summary.lowestWeight}
              </span>
              <span className="text-xs text-slate-500">{unitLabel}</span>
            </div>
            <span className="text-xs text-emerald-600 mt-0.5 block font-medium">
              Peak historic progress
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              5% & 10% Targets
            </span>
            <div className="mt-1 flex flex-col text-xs text-slate-700">
              <span>5% Goal: <strong className="text-slate-900">{target5PctDisplay} {unitLabel}</strong></span>
              <span>10% Goal: <strong className="text-slate-900">{target10PctDisplay} {unitLabel}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Line Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-emerald-600" />
              Weight Loss & Percentage Trajectory
            </h2>
            <p className="text-xs text-slate-500">
              Green line tracks scale weigh-in history; dashed reference lines highlight 5% and 10% clinical milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => onResetLogs(INITIAL_DEMO_LOGS)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Load Demo Journey
            </button>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tickLine={false}
                  unit={` ${unitLabel}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                          <p className="font-semibold text-slate-300">{data.date}</p>
                          <p className="text-sm font-bold text-emerald-400">
                            {data.weight} {unitLabel}
                          </p>
                          <p className="text-slate-300">
                            Total % Lost: <strong className="text-white">{data.percentLost}%</strong>
                          </p>
                          {data.delta !== 0 && (
                            <p className={data.delta < 0 ? 'text-emerald-300' : 'text-rose-300'}>
                              Change: {data.delta > 0 ? `+${data.delta}` : data.delta} {unitLabel}
                            </p>
                          )}
                          {data.notes && (
                            <p className="text-slate-400 italic text-[11px] pt-1 border-t border-slate-800">
                              "{data.notes}"
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {target5PctDisplay > 0 && (
                  <ReferenceLine
                    y={target5PctDisplay}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{
                      value: `5% Landmark (${target5PctDisplay} ${unitLabel})`,
                      fill: '#059669',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                )}
                {target10PctDisplay > 0 && (
                  <ReferenceLine
                    y={target10PctDisplay}
                    stroke="#0284c7"
                    strokeDasharray="4 4"
                    label={{
                      value: `10% Landmark (${target10PctDisplay} ${unitLabel})`,
                      fill: '#0284c7',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">No weigh-in data to graph.</div>
        )}
      </div>

      {/* Log Form & Entries Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            Add New Weigh-In
          </h3>

          <form onSubmit={handleAddSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Weight ({unitLabel})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder={`e.g. ${unit === 'kg' ? '85.5' : '195.0'}`}
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">
                  {unitLabel}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Notes <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Morning fasted, post 5k walk"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Save Weigh-In
            </button>
          </form>
        </div>

        {/* Entries Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-base">
              Recorded History ({sortedLogs.length})
            </h3>
            {sortedLogs.length > 0 && (
              <button
                type="button"
                onClick={() => onResetLogs([])}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">Diff</th>
                  <th className="py-2.5 px-3">% From Start</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sortedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      No logs recorded yet. Add your first weigh-in or click "Load Demo Journey".
                    </td>
                  </tr>
                ) : (
                  sortedLogs.map((entry, index) => {
                    const displayWeight = convertFromLbs(entry.weightInLbs, unit);
                    const diffFromStartLbs = startWeightLbs - entry.weightInLbs;
                    const pctFromStart = startWeightLbs > 0
                      ? +((diffFromStartLbs / startWeightLbs) * 100).toFixed(1)
                      : 0;

                    let stepDelta = 0;
                    if (index > 0) {
                      const prevLbs = sortedLogs[index - 1].weightInLbs;
                      const stepDiffLbs = entry.weightInLbs - prevLbs;
                      stepDelta = +(convertFromLbs(Math.abs(stepDiffLbs), unit) * (stepDiffLbs > 0 ? 1 : -1)).toFixed(1);
                    }

                    return (
                      <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {displayWeight} {unitLabel}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {index === 0 ? (
                            <span className="text-slate-400">Baseline</span>
                          ) : (
                            <span className={stepDelta < 0 ? 'text-emerald-600' : stepDelta > 0 ? 'text-rose-600' : 'text-slate-400'}>
                              {stepDelta > 0 ? `+${stepDelta}` : `${stepDelta}`} {unitLabel}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {pctFromStart > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                              -{pctFromStart}%
                            </span>
                          ) : pctFromStart < 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold">
                              +{Math.abs(pctFromStart)}%
                            </span>
                          ) : (
                            <span className="text-slate-400">0.0%</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 max-w-[180px] truncate">
                          {entry.notes || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onDeleteLog(entry.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
