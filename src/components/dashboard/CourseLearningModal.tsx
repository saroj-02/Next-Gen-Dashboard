"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, BookOpen, CheckCircle, ChevronRight, ChevronLeft,
  Trophy, Zap, Lock, Star, ArrowRight, RotateCcw,
  CheckCheck, AlertCircle, Sparkles
} from "lucide-react";
import type { Course } from "@/lib/types";
import { useUser } from "@/lib/UserContext";
import { getCourseContent, type TopicContent } from "@/lib/courseContent";
import DynamicIcon from "@/components/icons/DynamicIcon";

interface CourseLearningModalProps {
  course: Course | null;
  onClose: () => void;
}

type QuizState = "idle" | "answered" | "correct" | "wrong";

interface ChapterQuizState {
  selectedOption: number | null;
  state: QuizState;
  currentMCQIndex: number;
  mcqAnswers: Record<number, { selected: number; correct: boolean }>;
  allMCQsDone: boolean;
}

const categoryColors: Record<string, { primary: string; glow: string; bg: string }> = {
  "Web Development":      { primary: "#6c63ff", glow: "rgba(108,99,255,0.25)", bg: "rgba(108,99,255,0.08)" },
  "Software Development": { primary: "#22d3ee", glow: "rgba(34,211,238,0.25)", bg: "rgba(34,211,238,0.08)" },
  "Data Analysis":        { primary: "#10b981", glow: "rgba(16,185,129,0.25)", bg: "rgba(16,185,129,0.08)" },
  "AI & Gen AI":          { primary: "#f59e0b", glow: "rgba(245,158,11,0.25)", bg: "rgba(245,158,11,0.08)" },
  "Android Development":  { primary: "#a855f7", glow: "rgba(168,85,247,0.25)", bg: "rgba(168,85,247,0.08)" },
  "Design":               { primary: "#f43f5e", glow: "rgba(244,63,94,0.25)", bg: "rgba(244,63,94,0.08)" },
};

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
    .replace(/### (.*?)(\n|$)/g, '<h3 class="topic-h3">$1</h3>')
    .replace(/## (.*?)(\n|$)/g, '<h2 class="topic-h2">$1</h2>')
    .replace(/\n\n/g, '</p><p class="topic-p">')
    .replace(/\n/g, "<br/>")
    .replace(/^\s*- (.*?)$/gm, '<li class="topic-li">$1</li>')
    .replace(/(<li[\s\S]*<\/li>)/, '<ul class="topic-ul">$1</ul>');
}

export default function CourseLearningModal({ course, onClose }: CourseLearningModalProps) {
  const { stats, completeChapter, getCompletedChapters } = useUser();
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [quizStates, setQuizStates] = useState<Record<number, ChapterQuizState>>({});
  const [showXPBurst, setShowXPBurst] = useState(false);
  const [xpBurstAmount, setXpBurstAmount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const topics: TopicContent[] = course
    ? getCourseContent(course.id, course.chapters)
    : [];

  const completedChapters = course ? getCompletedChapters(course.id) : [];
  const accentColor = course ? (categoryColors[course.category || ""] || categoryColors["Web Development"]) : categoryColors["Web Development"];

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (course) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [course, onClose]);

  const getQuizState = (topicIndex: number): ChapterQuizState => {
    return quizStates[topicIndex] || {
      selectedOption: null,
      state: "idle",
      currentMCQIndex: 0,
      mcqAnswers: {},
      allMCQsDone: false,
    };
  };

  const handleOptionSelect = (topicIndex: number, optionIndex: number) => {
    const qs = getQuizState(topicIndex);
    if (qs.state === "answered" || qs.allMCQsDone) return;
    
    const topic = topics[topicIndex];
    const mcq = topic.mcqs[qs.currentMCQIndex];
    const isCorrect = optionIndex === mcq.answer;
    const newAnswers = { ...qs.mcqAnswers, [qs.currentMCQIndex]: { selected: optionIndex, correct: isCorrect } };
    const allDone = Object.keys(newAnswers).length >= topic.mcqs.length;
    const allCorrect = allDone && Object.values(newAnswers).every((a) => a.correct);

    setQuizStates((prev) => ({
      ...prev,
      [topicIndex]: {
        ...qs,
        selectedOption: optionIndex,
        state: "answered",
        mcqAnswers: newAnswers,
        allMCQsDone: allDone,
      },
    }));

    // If all MCQs done and all correct, award XP
    if (allDone && allCorrect && course && !completedChapters.includes(topicIndex)) {
      setTimeout(() => {
        completeChapter(course.id, topicIndex, topics.length);
        setXpBurstAmount(120);
        setShowXPBurst(true);
        setTimeout(() => setShowXPBurst(false), 2500);
      }, 600);
    }
  };

  const advanceMCQ = (topicIndex: number) => {
    const qs = getQuizState(topicIndex);
    const topic = topics[topicIndex];
    if (qs.currentMCQIndex < topic.mcqs.length - 1) {
      setQuizStates((prev) => ({
        ...prev,
        [topicIndex]: { ...qs, state: "idle", selectedOption: null, currentMCQIndex: qs.currentMCQIndex + 1 },
      }));
    }
  };

  const retryMCQ = (topicIndex: number) => {
    setQuizStates((prev) => ({
      ...prev,
      [topicIndex]: {
        selectedOption: null,
        state: "idle",
        currentMCQIndex: 0,
        mcqAnswers: {},
        allMCQsDone: false,
      },
    }));
  };

  if (!course) return null;

  const currentTopic = topics[activeTopicIndex];
  const currentQS = getQuizState(activeTopicIndex);
  const isChapterCompleted = completedChapters.includes(activeTopicIndex);
  const totalCompleted = completedChapters.length;
  const overallProgress = topics.length > 0 ? Math.round((totalCompleted / topics.length) * 100) : 0;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex"
      role="dialog"
      aria-modal="true"
      aria-label={`Learning: ${course.title}`}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(4, 7, 14, 0.95)", backdropFilter: "blur(16px)" }}
      />

        {/* XP Burst Animation */}
        <AnimatePresence>
          {showXPBurst && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -60, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="fixed top-1/2 left-1/2 z-[80] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white text-lg shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${accentColor.primary}, #f59e0b)`,
                  boxShadow: `0 0 40px ${accentColor.glow}`,
                }}
              >
                <Zap className="w-5 h-5" />
                +{xpBurstAmount} XP Earned!
                <Sparkles className="w-5 h-5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="relative z-10 w-full max-w-7xl mx-auto my-4 flex rounded-3xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: "var(--bg-base)",
            border: "1px solid var(--border-subtle)",
            maxHeight: "calc(100vh - 32px)",
          }}
        >
          {/* Top Accent Line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 z-10 pointer-events-none"
            style={{ background: `linear-gradient(90deg, ${accentColor.primary}, transparent 70%)` }}
          />

          {/* ─── LEFT SIDEBAR — Chapter List ──────────────────────────────── */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="shrink-0 flex flex-col overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderRight: "1px solid var(--border-subtle)",
                }}
              >
                {/* Sidebar Header */}
                <div className="p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: accentColor.bg, border: `1px solid ${accentColor.primary}40` }}
                    >
                      <DynamicIcon name={course.icon_name} className="w-4.5 h-4.5" style={{ color: accentColor.primary }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
                        {course.title}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {course.category}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1.5">
                      <span style={{ color: "var(--text-muted)" }}>{totalCompleted}/{topics.length} chapters</span>
                      <span style={{ color: accentColor.primary }}>{overallProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: accentColor.primary }}
                        initial={{ width: 0 }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chapter List */}
                <div className="flex-1 overflow-y-auto py-3 scrollbar-thin">
                  {topics.map((topic, i) => {
                    const isCompleted = completedChapters.includes(i);
                    const isActive = i === activeTopicIndex;
                    const qs = getQuizState(i);
                    const isInProgress = !isCompleted && (qs.mcqAnswers && Object.keys(qs.mcqAnswers).length > 0);

                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTopicIndex(i)}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all cursor-pointer"
                        style={{
                          backgroundColor: isActive ? accentColor.bg : "transparent",
                          borderLeft: isActive ? `3px solid ${accentColor.primary}` : "3px solid transparent",
                        }}
                      >
                        {/* Status indicator */}
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: isCompleted
                              ? "rgba(16,185,129,0.15)"
                              : isActive
                              ? accentColor.bg
                              : "rgba(255,255,255,0.04)",
                            border: isCompleted
                              ? "1px solid rgba(16,185,129,0.4)"
                              : isActive
                              ? `1px solid ${accentColor.primary}60`
                              : "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
                          ) : isInProgress ? (
                            <span className="text-[9px] font-bold" style={{ color: accentColor.primary }}>
                              {Object.keys(qs.mcqAnswers).length}/{topics[i]?.mcqs?.length || 3}
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                              {i + 1}
                            </span>
                          )}
                        </div>

                        <span
                          className="text-xs font-medium leading-tight line-clamp-2"
                          style={{
                            color: isCompleted
                              ? "#10b981"
                              : isActive
                              ? "var(--text-primary)"
                              : "var(--text-secondary)",
                          }}
                        >
                          {topic.title}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ─── MAIN CONTENT AREA ────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Top Header Bar */}
            <header
              className="flex items-center gap-3 px-5 py-3.5 shrink-0 border-b"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            >
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer hover:bg-white/5"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                aria-label="Toggle sidebar"
              >
                <BookOpen className="w-4 h-4" />
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  Chapter {activeTopicIndex + 1} of {topics.length}
                </p>
                <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                  {currentTopic?.title}
                </p>
              </div>

              {/* XP Counter */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <Zap className="w-3.5 h-3.5" />
                {stats.totalXP.toLocaleString()} XP
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                aria-label="Close learning view"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTopicIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-6 lg:p-8 max-w-3xl mx-auto"
                >
                  {currentTopic && (
                    <>
                      {/* Chapter Header */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: accentColor.bg, color: accentColor.primary }}
                          >
                            Chapter {activeTopicIndex + 1}
                          </span>
                          {isChapterCompleted && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                              <CheckCheck className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                        </div>
                        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                          {currentTopic.title}
                        </h1>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          Read the material, then complete the quiz to unlock +120 XP
                        </p>
                      </div>

                      {/* Topic Description */}
                      <div
                        className="rounded-2xl p-6 mb-6 topic-content"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.02)",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        <div
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                          dangerouslySetInnerHTML={{
                            __html: `<p class="topic-p">${renderMarkdown(currentTopic.description)}</p>`,
                          }}
                        />
                      </div>

                      {/* ─── MCQ Quiz Section ─────────────────────────────── */}
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{ border: `1px solid ${currentQS.allMCQsDone ? "rgba(16,185,129,0.3)" : accentColor.primary + "30"}` }}
                      >
                        {/* Quiz Header */}
                        <div
                          className="px-5 py-3.5 flex items-center justify-between"
                          style={{
                            backgroundColor: currentQS.allMCQsDone
                              ? "rgba(16,185,129,0.08)"
                              : accentColor.bg,
                            borderBottom: `1px solid ${currentQS.allMCQsDone ? "rgba(16,185,129,0.2)" : accentColor.primary + "20"}`,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {currentQS.allMCQsDone ? (
                              <Trophy className="w-4 h-4" style={{ color: "#10b981" }} />
                            ) : (
                              <Star className="w-4 h-4" style={{ color: accentColor.primary }} />
                            )}
                            <span className="text-xs font-bold" style={{ color: currentQS.allMCQsDone ? "#10b981" : accentColor.primary }}>
                              {currentQS.allMCQsDone ? "Quiz Complete!" : `Knowledge Check — Question ${currentQS.currentMCQIndex + 1} of ${currentTopic.mcqs.length}`}
                            </span>
                          </div>

                          {/* MCQ Progress dots */}
                          <div className="flex gap-1">
                            {currentTopic.mcqs.map((_, qi) => {
                              const ans = currentQS.mcqAnswers[qi];
                              return (
                                <div
                                  key={qi}
                                  className="w-2 h-2 rounded-full transition-all"
                                  style={{
                                    backgroundColor: ans
                                      ? ans.correct ? "#10b981" : "#f43f5e"
                                      : qi === currentQS.currentMCQIndex
                                      ? accentColor.primary
                                      : "rgba(255,255,255,0.15)",
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Quiz Content */}
                        <div className="p-5" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
                          {!currentQS.allMCQsDone ? (
                            <>
                              {/* Current Question */}
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={currentQS.currentMCQIndex}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  <p className="text-sm font-semibold mb-4 leading-relaxed" style={{ color: "var(--text-primary)" }}>
                                    {currentTopic.mcqs[currentQS.currentMCQIndex].question}
                                  </p>

                                  <div className="flex flex-col gap-2.5">
                                    {currentTopic.mcqs[currentQS.currentMCQIndex].options.map((option, oi) => {
                                      const mcq = currentTopic.mcqs[currentQS.currentMCQIndex];
                                      const isSelected = currentQS.selectedOption === oi;
                                      const isAnswered = currentQS.state === "answered";
                                      const isCorrectOption = oi === mcq.answer;
                                      const isWrong = isAnswered && isSelected && !isCorrectOption;
                                      const showCorrect = isAnswered && isCorrectOption;

                                      return (
                                        <motion.button
                                          key={oi}
                                          whileHover={!isAnswered ? { scale: 1.01 } : {}}
                                          whileTap={!isAnswered ? { scale: 0.99 } : {}}
                                          onClick={() => !isAnswered && handleOptionSelect(activeTopicIndex, oi)}
                                          className="w-full text-left p-3.5 rounded-xl flex items-start gap-3 transition-all cursor-pointer text-xs font-medium"
                                          style={{
                                            border: showCorrect
                                              ? "1px solid rgba(16,185,129,0.6)"
                                              : isWrong
                                              ? "1px solid rgba(244,63,94,0.6)"
                                              : isSelected
                                              ? `1px solid ${accentColor.primary}60`
                                              : "1px solid var(--border-subtle)",
                                            backgroundColor: showCorrect
                                              ? "rgba(16,185,129,0.08)"
                                              : isWrong
                                              ? "rgba(244,63,94,0.08)"
                                              : isSelected
                                              ? accentColor.bg
                                              : "rgba(255,255,255,0.02)",
                                            color: showCorrect
                                              ? "#10b981"
                                              : isWrong
                                              ? "#f43f5e"
                                              : "var(--text-secondary)",
                                            cursor: isAnswered ? "default" : "pointer",
                                            pointerEvents: isAnswered ? "none" : "auto",
                                          }}
                                          aria-label={`Option ${oi + 1}: ${option}`}
                                        >
                                          <div
                                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
                                            style={{
                                              backgroundColor: showCorrect
                                                ? "rgba(16,185,129,0.2)"
                                                : isWrong
                                                ? "rgba(244,63,94,0.2)"
                                                : isSelected
                                                ? accentColor.bg
                                                : "rgba(255,255,255,0.06)",
                                              border: showCorrect
                                                ? "1px solid rgba(16,185,129,0.4)"
                                                : isWrong
                                                ? "1px solid rgba(244,63,94,0.4)"
                                                : "1px solid rgba(255,255,255,0.1)",
                                              color: showCorrect ? "#10b981" : isWrong ? "#f43f5e" : "var(--text-muted)",
                                            }}
                                          >
                                            {showCorrect ? "✓" : isWrong ? "✗" : String.fromCharCode(65 + oi)}
                                          </div>
                                          <span className="leading-relaxed">{option}</span>
                                        </motion.button>
                                      );
                                    })}
                                  </div>

                                  {/* After answering — show feedback & next */}
                                  {currentQS.state === "answered" && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-4 flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-2">
                                        {currentQS.selectedOption === currentTopic.mcqs[currentQS.currentMCQIndex].answer ? (
                                          <>
                                            <CheckCircle className="w-4 h-4" style={{ color: "#10b981" }} />
                                            <span className="text-xs font-semibold" style={{ color: "#10b981" }}>
                                              Correct! Well done.
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <AlertCircle className="w-4 h-4" style={{ color: "#f43f5e" }} />
                                            <span className="text-xs font-semibold" style={{ color: "#f43f5e" }}>
                                              Not quite — the correct answer is highlighted.
                                            </span>
                                          </>
                                        )}
                                      </div>

                                      {currentQS.currentMCQIndex < currentTopic.mcqs.length - 1 && (
                                        <motion.button
                                          whileHover={{ scale: 1.03 }}
                                          whileTap={{ scale: 0.97 }}
                                          onClick={() => advanceMCQ(activeTopicIndex)}
                                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                                          style={{
                                            background: `linear-gradient(135deg, ${accentColor.primary}, ${accentColor.primary}cc)`,
                                            border: "none",
                                          }}
                                        >
                                          Next Question
                                          <ChevronRight className="w-3.5 h-3.5" />
                                        </motion.button>
                                      )}
                                    </motion.div>
                                  )}
                                </motion.div>
                              </AnimatePresence>
                            </>
                          ) : (
                            /* All MCQs done — Results Screen */
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-4"
                            >
                              {(() => {
                                const correctCount = Object.values(currentQS.mcqAnswers).filter((a) => a.correct).length;
                                const totalMCQs = currentTopic.mcqs.length;
                                const allCorrect = correctCount === totalMCQs;
                                return (
                                  <>
                                    <div className="text-4xl mb-3">{allCorrect ? "🏆" : correctCount > totalMCQs / 2 ? "💡" : "📖"}</div>
                                    <p className="text-sm font-bold mb-1" style={{ color: allCorrect ? "#10b981" : "var(--text-primary)" }}>
                                      {allCorrect
                                        ? "Perfect Score! Chapter Complete!"
                                        : `${correctCount}/${totalMCQs} Correct`}
                                    </p>
                                    <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                                      {allCorrect
                                        ? `+120 XP awarded! Ready for the next chapter.`
                                        : "Review the material and try again to earn XP."}
                                    </p>

                                    <div className="flex gap-3 justify-center">
                                      <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => retryMCQ(activeTopicIndex)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                                        style={{
                                          backgroundColor: "rgba(255,255,255,0.06)",
                                          border: "1px solid var(--border-subtle)",
                                          color: "var(--text-secondary)",
                                        }}
                                      >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Retry Quiz
                                      </motion.button>

                                      {activeTopicIndex < topics.length - 1 && (
                                        <motion.button
                                          whileHover={{ scale: 1.03 }}
                                          whileTap={{ scale: 0.97 }}
                                          onClick={() => {
                                            setActiveTopicIndex((i) => i + 1);
                                          }}
                                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                                          style={{
                                            background: `linear-gradient(135deg, ${accentColor.primary}, ${accentColor.primary}cc)`,
                                            border: "none",
                                          }}
                                        >
                                          Next Chapter
                                          <ArrowRight className="w-3.5 h-3.5" />
                                        </motion.button>
                                      )}

                                      {activeTopicIndex === topics.length - 1 && allCorrect && (
                                        <motion.button
                                          whileHover={{ scale: 1.03 }}
                                          whileTap={{ scale: 0.97 }}
                                          onClick={onClose}
                                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                                          style={{
                                            background: "linear-gradient(135deg, #10b981, #059669)",
                                            border: "none",
                                          }}
                                        >
                                          <Trophy className="w-3.5 h-3.5" />
                                          Course Complete!
                                        </motion.button>
                                      )}
                                    </div>
                                  </>
                                );
                              })()}
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Navigation Footer */}
                      <div className="flex items-center justify-between mt-6">
                        <motion.button
                          whileHover={activeTopicIndex > 0 ? { scale: 1.03 } : {}}
                          whileTap={activeTopicIndex > 0 ? { scale: 0.97 } : {}}
                          onClick={() => activeTopicIndex > 0 && setActiveTopicIndex((i) => i - 1)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                          style={{
                            backgroundColor: activeTopicIndex > 0 ? "rgba(255,255,255,0.05)" : "transparent",
                            border: "1px solid var(--border-subtle)",
                            color: activeTopicIndex > 0 ? "var(--text-secondary)" : "var(--text-muted)",
                            cursor: activeTopicIndex > 0 ? "pointer" : "default",
                            opacity: activeTopicIndex > 0 ? 1 : 0.4,
                          }}
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Previous
                        </motion.button>

                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {activeTopicIndex + 1} / {topics.length}
                        </span>

                        <motion.button
                          whileHover={activeTopicIndex < topics.length - 1 ? { scale: 1.03 } : {}}
                          whileTap={activeTopicIndex < topics.length - 1 ? { scale: 0.97 } : {}}
                          onClick={() => activeTopicIndex < topics.length - 1 && setActiveTopicIndex((i) => i + 1)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                          style={{
                            backgroundColor: activeTopicIndex < topics.length - 1 ? accentColor.bg : "transparent",
                            border: `1px solid ${activeTopicIndex < topics.length - 1 ? accentColor.primary + "40" : "var(--border-subtle)"}`,
                            color: activeTopicIndex < topics.length - 1 ? accentColor.primary : "var(--text-muted)",
                            cursor: activeTopicIndex < topics.length - 1 ? "pointer" : "default",
                            opacity: activeTopicIndex < topics.length - 1 ? 1 : 0.4,
                          }}
                        >
                          Next
                          <ChevronRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Inline styles for topic content rendering */}
        <style>{`
          .inline-code {
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            background: rgba(255,255,255,0.08);
            padding: 1px 5px;
            border-radius: 4px;
            font-size: 0.75em;
            color: #22d3ee;
          }
          .code-block {
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px;
            padding: 14px 16px;
            margin: 10px 0;
            overflow-x: auto;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 0.72em;
            line-height: 1.7;
            color: #e2e8f0;
          }
          .topic-p { margin: 8px 0; line-height: 1.7; }
          .topic-h2 { font-size: 0.9em; font-weight: 700; color: var(--text-primary); margin: 14px 0 6px; }
          .topic-h3 { font-size: 0.82em; font-weight: 600; color: var(--text-secondary); margin: 10px 0 4px; }
          .topic-li { padding-left: 4px; margin: 4px 0; }
          .topic-ul { padding-left: 16px; margin: 6px 0; list-style: disc; }
        `}</style>
    </motion.div>
  );
}
