"use client";

import { useState, useCallback, useEffect } from "react";
import {
  AssessmentQuestion,
  AssessmentResult,
  PlacementRecommendation,
  ComprehensiveAssessment,
  calculateAssessmentResults,
  determinePlacement,
  LETTER_NAME_QUESTIONS,
  LETTER_SOUND_QUESTIONS,
  PHONEMIC_AWARENESS_QUESTIONS,
  CVC_READING_QUESTIONS,
  SIGHT_WORD_QUESTIONS,
} from "@/lib/assessment-data";

const STORAGE_KEY = "toddler-learning-assessment";

interface AssessmentAnswer {
  questionId: string;
  answer: string;
  correct: boolean;
  timeSpent: number; // seconds
  timestamp: Date;
}

interface AssessmentState {
  inProgress: boolean;
  currentSection: number;
  currentQuestionIndex: number;
  answers: AssessmentAnswer[];
  startTime: Date | null;
  sectionStartTime: Date | null;
}

const ALL_QUESTIONS: AssessmentQuestion[] = [
  ...LETTER_NAME_QUESTIONS,
  ...LETTER_SOUND_QUESTIONS,
  ...PHONEMIC_AWARENESS_QUESTIONS,
  ...CVC_READING_QUESTIONS,
  ...SIGHT_WORD_QUESTIONS,
];

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>({
    inProgress: false,
    currentSection: 0,
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,
    sectionStartTime: null,
  });

  const [results, setResults] = useState<AssessmentResult[] | null>(null);
  const [placement, setPlacement] = useState<PlacementRecommendation | null>(null);
  const [completedAssessment, setCompletedAssessment] = useState<ComprehensiveAssessment | null>(
    null
  );

  // Load saved assessment on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompletedAssessment(parsed);
      }
    } catch (error) {
      console.error("Failed to load assessment:", error);
    }
  }, []);

  // Save assessment when completed
  useEffect(() => {
    if (completedAssessment && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completedAssessment));
      } catch (error) {
        console.error("Failed to save assessment:", error);
      }
    }
  }, [completedAssessment]);

  const startAssessment = useCallback(() => {
    setState({
      inProgress: true,
      currentSection: 0,
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date(),
      sectionStartTime: new Date(),
    });
    setResults(null);
    setPlacement(null);
  }, []);

  const getCurrentQuestion = useCallback((): AssessmentQuestion | null => {
    if (!state.inProgress) return null;

    // Calculate absolute question index
    const sections = [
      LETTER_NAME_QUESTIONS,
      LETTER_SOUND_QUESTIONS,
      PHONEMIC_AWARENESS_QUESTIONS,
      CVC_READING_QUESTIONS,
      SIGHT_WORD_QUESTIONS,
    ];

    if (state.currentSection >= sections.length) return null;

    const currentSectionQuestions = sections[state.currentSection];
    if (state.currentQuestionIndex >= currentSectionQuestions.length) return null;

    return currentSectionQuestions[state.currentQuestionIndex];
  }, [state]);

  const answerQuestion = useCallback(
    (answer: string) => {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;

      const isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
      const timeSpent = state.sectionStartTime
        ? Math.floor((new Date().getTime() - state.sectionStartTime.getTime()) / 1000)
        : 0;

      const newAnswer: AssessmentAnswer = {
        questionId: currentQuestion.id,
        answer,
        correct: isCorrect,
        timeSpent,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        answers: [...prev.answers, newAnswer],
        sectionStartTime: new Date(),
      }));

      // Move to next question
      setTimeout(() => {
        advanceToNext();
      }, 100);
    },
    [getCurrentQuestion, state.sectionStartTime]
  );

  const advanceToNext = useCallback(() => {
    setState((prev) => {
      const sections = [
        LETTER_NAME_QUESTIONS,
        LETTER_SOUND_QUESTIONS,
        PHONEMIC_AWARENESS_QUESTIONS,
        CVC_READING_QUESTIONS,
        SIGHT_WORD_QUESTIONS,
      ];

      const currentSectionQuestions = sections[prev.currentSection];

      // Check if more questions in current section
      if (prev.currentQuestionIndex + 1 < currentSectionQuestions.length) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      }

      // Move to next section
      if (prev.currentSection + 1 < sections.length) {
        return {
          ...prev,
          currentSection: prev.currentSection + 1,
          currentQuestionIndex: 0,
        };
      }

      // Assessment complete
      return {
        ...prev,
        inProgress: false,
      };
    });
  }, []);

  const skipQuestion = useCallback(() => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    // Record as incorrect with 0 time
    const newAnswer: AssessmentAnswer = {
      questionId: currentQuestion.id,
      answer: "",
      correct: false,
      timeSpent: 0,
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
    }));

    advanceToNext();
  }, [getCurrentQuestion, advanceToNext]);

  const finishAssessment = useCallback(() => {
    if (!state.startTime) return;

    // Convert answers to Map for scoring
    const answersMap = new Map(
      state.answers.map((a) => [a.questionId, { correct: a.correct, timeSpent: a.timeSpent }])
    );

    // Calculate results
    const assessmentResults = calculateAssessmentResults(answersMap);
    setResults(assessmentResults);

    // Determine placement
    const recommendedPlacement = determinePlacement(assessmentResults);
    setPlacement(recommendedPlacement);

    // Calculate overall score
    const totalCorrect = state.answers.filter((a) => a.correct).length;
    const overallScore = Math.round((totalCorrect / ALL_QUESTIONS.length) * 100);

    // Calculate completion time in minutes
    const completionTime = Math.floor(
      (new Date().getTime() - state.startTime.getTime()) / 1000 / 60
    );

    // Save comprehensive assessment
    const comprehensive: ComprehensiveAssessment = {
      userId: "current-user", // TODO: Replace with actual user ID
      date: new Date(),
      results: assessmentResults,
      placement: recommendedPlacement,
      overallScore,
      completionTime,
    };

    setCompletedAssessment(comprehensive);

    // Reset state
    setState({
      inProgress: false,
      currentSection: 0,
      currentQuestionIndex: 0,
      answers: [],
      startTime: null,
      sectionStartTime: null,
    });
  }, [state]);

  // Auto-finish when all questions answered
  useEffect(() => {
    if (
      !state.inProgress &&
      state.answers.length > 0 &&
      state.answers.length === ALL_QUESTIONS.length
    ) {
      finishAssessment();
    }
  }, [state.inProgress, state.answers, finishAssessment]);

  const resetAssessment = useCallback(() => {
    setState({
      inProgress: false,
      currentSection: 0,
      currentQuestionIndex: 0,
      answers: [],
      startTime: null,
      sectionStartTime: null,
    });
    setResults(null);
    setPlacement(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setCompletedAssessment(null);
  }, []);

  const getProgress = useCallback(() => {
    const totalQuestions = ALL_QUESTIONS.length;
    const answeredQuestions = state.answers.length;
    const percentage = Math.round((answeredQuestions / totalQuestions) * 100);

    return {
      answeredQuestions,
      totalQuestions,
      percentage,
      currentSection: state.currentSection,
      currentQuestionIndex: state.currentQuestionIndex,
    };
  }, [state]);

  const hasCompletedAssessment = useCallback(() => {
    return completedAssessment !== null;
  }, [completedAssessment]);

  const getSectionName = useCallback((sectionIndex: number): string => {
    const names = [
      "Letter Names",
      "Letter Sounds",
      "Sound Awareness",
      "Reading Words",
      "Sight Words",
    ];
    return names[sectionIndex] || "Assessment";
  }, []);

  return {
    // State
    inProgress: state.inProgress,
    currentQuestion: getCurrentQuestion(),
    currentSection: state.currentSection,
    currentQuestionIndex: state.currentQuestionIndex,

    // Results
    results,
    placement,
    completedAssessment,

    // Actions
    startAssessment,
    answerQuestion,
    skipQuestion,
    resetAssessment,

    // Utilities
    getProgress,
    hasCompletedAssessment,
    getSectionName,
  };
}
