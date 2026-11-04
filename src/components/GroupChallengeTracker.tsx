import React, { useState, useMemo } from 'react';
import { ChallengeParticipant, Unit } from '../types';
import { INITIAL_DEMO_PARTICIPANTS } from '../utils/storage';
import {
  Users,
  Trophy,
  Medal,
  Plus,
  Trash2,
  TrendingDown,
  Scale,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface GroupChallengeTrackerProps {
  participants: ChallengeParticipant[];
  unit: Unit;
  onAddParticipant: (p: Omit<ChallengeParticipant, 'id'>) => void;
  onDeleteParticipant: (id: string) => void;
  onResetParticipants: (list: ChallengeParticipant[]) => void;
}

export const GroupChallengeTracker: React.FC<GroupChallengeTrackerProps> = ({
  participants,
  unit,
  onAddParticipant,
  onDeleteParticipant,
  onResetParticipants,
}) => {
  const [name, setName] = useState<string>('');
  const [startWeight, setStartWeight] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const unitLabel = unit === 'kg' ? 'kg' : 'lbs';

  // Calculate percentage lost and sort
  const leaderboard = useMemo(() => {
    return participants
      .map((p) => {
        const diff = p.startWeight - p.currentWeight;
        const pct = p.startWeight > 0 ? +((diff / p.startWeight) * 100).toFixed(2) : 0;
        return {
          ...p,
          weightLost: +diff.toFixed(1),
          percentLost: pct,
        };
      })
      .sort((a, b) => b.percentLost - a.percentLost);
  }, [participants]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const s = parseFloat(startWeight);
    const c = parseFloat(currentWeight);
    if (!name.trim() || !s || !c) return;

    const colors = [
      'bg-emerald-500',
      'bg-sky-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-rose-500',
      'bg-amber-500',
      'bg-teal-500',
    ];
    const avatarColor = colors[participants.length % colors.length];

    onAddParticipant({
      name: name.trim(),
      startWeight: s,
      currentWeight: c,
      unit: unit,
      avatarColor,
    });

    setName('');
    setStartWeight('');
    setCurrentWeight('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase tracking-wider text-purple-200 mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-300" /> Fair Competition Leaderboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Group Weight Loss Challenge
          </h1>
          <p className="mt-2 text-purple-100 text-sm leading-relaxed">
            Comparing raw pounds lost is unfair to lighter individuals. 
            Percentage of body weight lost normalizes progress across different body sizes, 
            making it the universal fair standard for workplace and community competitions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaderboard Table / Cards */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Current Standings ({leaderboard.length})
              </h2>
              <span className="text-xs text-slate-500">
                Ranked purely by highest percentage of starting weight lost
              </span>
            </div>

            <button
              type="button"
              onClick={() => onResetParticipants(INITIAL_DEMO_PARTICIPANTS)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Roster
            </button>
          </div>

          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                No participants entered yet. Add colleagues or friends using the form on the right!
              </div>
            ) : (
              leaderboard.map((item, index) => {
                const rank = index + 1;
                const isWinner = rank === 1;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isWinner
                        ? 'bg-gradient-to-r from-amber-50/70 to-yellow-50/40 border-amber-300 shadow-xs'
                        : rank === 2
                        ? 'bg-slate-50/90 border-slate-300'
                        : rank === 3
                        ? 'bg-amber-50/30 border-amber-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full font-extrabold text-sm shrink-0">
                          {rank === 1 ? (
                            <span className="text-xl" role="img" aria-label="1st">🥇</span>
                          ) : rank === 2 ? (
                            <span className="text-xl" role="img" aria-label="2nd">🥈</span>
                          ) : rank === 3 ? (
                            <span className="text-xl" role="img" aria-label="3rd">🥉</span>
                          ) : (
                            <span className="text-slate-500 font-bold">#{rank}</span>
                          )}
                        </div>

                        {/* Avatar & Name */}
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-full ${item.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs`}
                          >
                            {item.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              {item.name}
                              {isWinner && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                                  Leader
                                </span>
                              )}
                            </h3>
                            <span className="text-xs text-slate-500">
                              {item.startWeight} {unitLabel} → {item.currentWeight} {unitLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Percentage & Weight Lost */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span
                            className={`text-lg font-black block leading-tight ${
                              item.percentLost > 0
                                ? 'text-emerald-600'
                                : item.percentLost < 0
                                ? 'text-rose-600'
                                : 'text-slate-600'
                            }`}
                          >
                            {item.percentLost > 0 ? `-${item.percentLost}%` : `${item.percentLost}%`}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {item.weightLost > 0 ? `-${item.weightLost}` : `+${Math.abs(item.weightLost)}`} {unitLabel}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteParticipant(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Remove participant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Mini progress bar of % lost */}
                    <div className="mt-3 w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWinner ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, item.percentLost * 5))}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Add Participant Form & Explanation */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Add Participant
            </h3>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Participant Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Starting Weight ({unitLabel})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 185.0"
                  value={startWeight}
                  onChange={(e) => setStartWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Current Weight ({unitLabel})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 172.5"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add to Leaderboard
              </button>
            </form>
          </div>

          {/* Fairness Math Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              The Math of Contest Fairness:
            </span>
            <p>
              If Contestant A starts at <strong>250 lbs</strong> and loses <strong>20 lbs</strong>, they lost <strong>8.0%</strong>.
            </p>
            <p>
              If Contestant B starts at <strong>160 lbs</strong> and loses <strong>16 lbs</strong>, they lost <strong>10.0%</strong>!
            </p>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              Contestant B shed a greater fraction of their biological mass despite losing fewer raw pounds. Percentage reflects pure effort!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
