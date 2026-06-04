import { motion } from 'framer-motion';
import {
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  BarChart3,
  Shield,
  Zap,
  MessageSquare,
  Eye,
  BookOpen,
  ClipboardCheck,
  FileText,
  Award,
  AlertCircle,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

// ─── Alignment Bar ───
function AlignmentBar({ item, matchPercentage, category }) {
  const getBarColor = (pct) => {
    if (pct >= 80) return 'from-emerald-500 to-emerald-400';
    if (pct >= 60) return 'from-violet-500 to-indigo-400';
    if (pct >= 40) return 'from-yellow-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  const getTextColor = (pct) => {
    if (pct >= 80) return 'text-emerald-400';
    if (pct >= 60) return 'text-violet-400';
    if (pct >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBadgeColor = (pct) => {
    if (pct >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15';
    if (pct >= 60) return 'bg-violet-500/10 text-violet-400 border-violet-500/15';
    if (pct >= 40) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/15';
    return 'bg-red-500/10 text-red-400 border-red-500/15';
  };

  const getMatchLabel = (pct) => {
    if (pct >= 80) return 'Fully Aligned';
    if (pct >= 60) return 'Well Covered';
    if (pct >= 40) return 'Partial Coverage';
    return 'Gap Identified';
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">{item}</span>
          {category && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white/[0.04] text-gray-500 border border-white/[0.06]">
              {category}
            </span>
          )}
        </div>
        <span className={`text-sm font-bold ${getTextColor(matchPercentage)}`}>
          {matchPercentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${matchPercentage}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getBarColor(matchPercentage)}`}
        />
        {/* Glow effect */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${matchPercentage}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getBarColor(matchPercentage)} blur-sm opacity-40`}
        />
      </div>

      {/* Match label */}
      <div className="flex items-center justify-between mt-2">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getBadgeColor(matchPercentage)}`}>
          {getMatchLabel(matchPercentage)}
        </span>
        {matchPercentage >= 80 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        {matchPercentage < 40 && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
      </div>
    </motion.div>
  );
}

// ─── Insight Card ───
function InsightCard({ icon: Icon, title, content, accentColor, index }) {
  const colorMap = {
    violet: {
      iconBg: 'from-violet-500/20 to-indigo-500/20',
      iconBorder: 'border-violet-500/20',
      iconText: 'text-violet-400',
      accent: 'from-violet-500/10 to-transparent',
      accentBorder: 'border-violet-500/[0.12]',
    },
    cyan: {
      iconBg: 'from-cyan-500/20 to-blue-500/20',
      iconBorder: 'border-cyan-500/20',
      iconText: 'text-cyan-400',
      accent: 'from-cyan-500/10 to-transparent',
      accentBorder: 'border-cyan-500/[0.12]',
    },
    emerald: {
      iconBg: 'from-emerald-500/20 to-green-500/20',
      iconBorder: 'border-emerald-500/20',
      iconText: 'text-emerald-400',
      accent: 'from-emerald-500/10 to-transparent',
      accentBorder: 'border-emerald-500/[0.12]',
    },
    indigo: {
      iconBg: 'from-indigo-500/20 to-purple-500/20',
      iconBorder: 'border-indigo-500/20',
      iconText: 'text-indigo-400',
      accent: 'from-indigo-500/10 to-transparent',
      accentBorder: 'border-indigo-500/[0.12]',
    },
    amber: {
      iconBg: 'from-amber-500/20 to-yellow-500/20',
      iconBorder: 'border-amber-500/20',
      iconText: 'text-amber-400',
      accent: 'from-amber-500/10 to-transparent',
      accentBorder: 'border-amber-500/[0.12]',
    },
    red: {
      iconBg: 'from-red-500/20 to-orange-500/20',
      iconBorder: 'border-red-500/20',
      iconText: 'text-red-400',
      accent: 'from-red-500/10 to-transparent',
      accentBorder: 'border-red-500/[0.12]',
    },
  };

  const colors = colorMap[accentColor] || colorMap.violet;

  return (
    <motion.div
      variants={fadeInUp}
      className={`
        p-5 rounded-2xl bg-gradient-to-r ${colors.accent} to-white/[0.01]
        border ${colors.accentBorder} hover:bg-white/[0.04] transition-all duration-300 group
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-10 h-10 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.iconBorder} border
          flex items-center justify-center shrink-0
          group-hover:scale-[1.05] transition-transform duration-300
        `}>
          <Icon className={`w-5 h-5 ${colors.iconText}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{content}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Overall Score Ring ───
function OverallScoreRing({ score }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s) => {
    if (s >= 80) return { stroke: '#22c55e', text: 'text-emerald-400', label: 'Excellent Alignment' };
    if (s >= 60) return { stroke: '#8b5cf6', text: 'text-violet-400', label: 'Good Alignment' };
    if (s >= 40) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'Partial Alignment' };
    return { stroke: '#ef4444', text: 'text-red-400', label: 'Significant Gaps' };
  };

  const scoreInfo = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[140px] h-[140px]">
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Score ring */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={scoreInfo.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* Glow ring */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={scoreInfo.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            style={{ filter: 'blur(4px)', opacity: 0.4 }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`text-3xl font-extrabold ${scoreInfo.text}`}
          >
            {score}
          </motion.span>
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-1">
            out of 100
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-center"
      >
        <span className={`text-sm font-bold ${scoreInfo.text}`}>
          {scoreInfo.label}
        </span>
      </motion.div>
    </div>
  );
}

// ─── Main Results Component ───
export default function SkillsAnalysisResults({ results, onReset, isAnalyzing }) {
  // Parse results - handle various response shapes from the backend
  const overallScore = results?.overallScore ?? results?.score ?? results?.alignmentScore ?? 0;
  const alignedItems = results?.alignedItems ?? results?.matchedSkills ?? results?.aligned ?? [];
  const gapItems = results?.gapItems ?? results?.gapSkills ?? results?.gaps ?? results?.missingSkills ?? [];
  const insights = results?.insights ?? results?.recommendations ?? [];
  const answers = results?.answers ?? results?.queryResponses ?? [];
  const summary = results?.summary ?? results?.overview ?? '';

  // If the backend returns a flat text response, parse it into sections
  const isStructured = alignedItems.length > 0 || gapItems.length > 0 || insights.length > 0;

  return (
    <div className="space-y-8">
      {/* ─── Results Header ─── */}
      <motion.div {...fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">OpsMind Analysis Results</h2>
            <p className="text-sm text-gray-500">Your operational knowledge insights</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          New Analysis
        </motion.button>
      </motion.div>

      {/* ─── Overall Score + Summary ─── */}
      <motion.div
        {...fadeInUp}
        className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08]"
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Score Ring */}
          <OverallScoreRing score={overallScore} />

          {/* Summary Text */}
          <div className="flex-1 min-w-0">
            {summary && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-violet-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Overview</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/[0.12] text-center">
                <span className="text-lg font-bold text-emerald-400">{alignedItems.length}</span>
                <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-semibold mt-1">
                  Aligned
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/[0.06] border border-red-500/[0.12] text-center">
                <span className="text-lg font-bold text-red-400">{gapItems.length}</span>
                <p className="text-[10px] uppercase tracking-wider text-red-400/70 font-semibold mt-1">
                  Gaps
                </p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/[0.06] border border-indigo-500/[0.12] text-center">
                <span className="text-lg font-bold text-indigo-400">{insights.length}</span>
                <p className="text-[10px] uppercase tracking-wider text-indigo-400/70 font-semibold mt-1">
                  Insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Structured Results ─── */}
      {isStructured ? (
        <>
          {/* ─── Aligned SOP Coverage ─── */}
          {alignedItems.length > 0 && (
            <motion.div {...fadeInUp}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/20 flex items-center justify-center">
                  <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white">SOP Alignment Coverage</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                  {alignedItems.length} aligned
                </span>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {alignedItems.map((item, idx) => (
                  <AlignmentBar
                    key={idx}
                    item={item.name ?? item.skill ?? item.item ?? item}
                    matchPercentage={item.matchPercentage ?? item.match ?? item.percentage ?? item.alignment ?? 75}
                    category={item.category ?? item.type ?? null}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ─── Compliance & Coverage Gaps ─── */}
          {gapItems.length > 0 && (
            <motion.div {...fadeInUp}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Compliance & Coverage Gaps</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-500/10 text-red-400 border border-red-500/15">
                  {gapItems.length} identified
                </span>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {gapItems.map((item, idx) => (
                  <AlignmentBar
                    key={idx}
                    item={item.name ?? item.skill ?? item.item ?? item}
                    matchPercentage={item.matchPercentage ?? item.match ?? item.percentage ?? item.alignment ?? 25}
                    category={item.category ?? item.type ?? null}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ─── Insights & Recommendations ─── */}
          {insights.length > 0 && (
            <motion.div {...fadeInUp}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-indigo-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Insights & Recommendations</h2>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {insights.map((insight, idx) => {
                  const iconMap = {
                    strength: Award,
                    aligned: ClipboardCheck,
                    gap: AlertTriangle,
                    recommendation: Lightbulb,
                    tip: Zap,
                    action: Target,
                    learning: BookOpen,
                    compliance: Shield,
                    coverage: Eye,
                    procedure: FileText,
                    default: Sparkles,
                  };
                  const type = insight.type ?? insight.category ?? 'default';
                  const accentMap = {
                    strength: 'emerald',
                    aligned: 'emerald',
                    gap: 'red',
                    recommendation: 'violet',
                    tip: 'amber',
                    action: 'cyan',
                    learning: 'indigo',
                    compliance: 'cyan',
                    coverage: 'indigo',
                    procedure: 'violet',
                    default: 'violet',
                  };

                  return (
                    <InsightCard
                      key={idx}
                      icon={iconMap[type] || iconMap.default}
                      title={insight.title ?? insight.name ?? `Insight ${idx + 1}`}
                      content={insight.content ?? insight.description ?? insight.text ?? insight.message ?? ''}
                      accentColor={accentMap[type] || accentMap.default}
                      index={idx}
                    />
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {/* ─── Answers to User Questions ─── */}
          {answers.length > 0 && (
            <motion.div {...fadeInUp}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Answers to Your Questions</h2>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                {answers.map((answer, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/[0.06] to-transparent border border-cyan-500/[0.12]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {answer.question && (
                          <p className="text-sm font-semibold text-cyan-300 mb-2">
                            Q: {answer.question}
                          </p>
                        )}
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {answer.answer ?? answer.content ?? answer.text ?? answer.response ?? answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </>
      ) : (
        /* ─── Unstructured / Raw Text Response ─── */
        <motion.div {...fadeInUp}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="text-lg font-bold text-white">OpsMind Analysis Output</h2>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08]">
            {/* If the entire result is a string, display it */}
            {typeof results === 'string' ? (
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{results}</p>
            ) : (
              /* If it's an object with a text/content/analysis field */
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {results?.analysis ?? results?.content ?? results?.text ?? results?.message ?? JSON.stringify(results, null, 2)}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* ─── Footer Actions ─── */}
      <motion.div {...fadeInUp} className="flex items-center justify-center gap-4 pt-4 pb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.45)] transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Run New Analysis
        </motion.button>
      </motion.div>
    </div>
  );
}