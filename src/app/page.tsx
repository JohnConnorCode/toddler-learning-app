"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Star, Settings, Eye, Users, ClipboardCheck, Sparkles, BarChart3, Rocket, Map, Book, Trophy, Pencil, Calculator, Edit3, Play, RefreshCw, Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";
import { InstallButton } from "@/components/InstallButton";
import { useLevelProgress, useLevelProgressHydrated } from "@/hooks/use-level-progress";
import { useAccessibility } from "@/hooks/use-accessibility";
import { useOnboarding, useChildName, useOnboardingHydrated } from "@/hooks/use-onboarding";
import { useMascot } from "@/hooks/use-mascot";
import { useSession } from "@/hooks/use-session";
import { useTheme } from "@/hooks/use-theme";
import { useLearningProgress, useLearningProgressHydrated } from "@/hooks/use-learning-progress";
import { UnifiedProgress } from "@/components/home/UnifiedProgress";
import { getPersonalizedRecommendations, getInterestLabel } from "@/lib/interest-content";
import { Heart } from "lucide-react";

export default function Home() {
    const router = useRouter();
    const levelProgressHydrated = useLevelProgressHydrated();
    const onboardingHydrated = useOnboardingHydrated();
    const learningProgressHydrated = useLearningProgressHydrated();
    const { getTotalProgress, currentLevel } = useLevelProgress();
    const { shouldReduceMotion } = useAccessibility();
    const { isOnboardingComplete, childProfile } = useOnboarding();
    const childName = useChildName();
    const { mascot, greet } = useMascot();
    const { hasActiveSession, getResumeUrl, getResumeLabel, activeSession } = useSession();
    const { interests, hasInterests, theme, gradientClass } = useTheme();
    const { getRecommendations, getActivityReadiness, getReviewItems, getLearningStats } = useLearningProgress();
    const [isReady, setIsReady] = useState(false);

    // Get personalized recommendations
    const recommendations = hasInterests ? getPersonalizedRecommendations(interests, { maxWords: 6, maxStories: 3 }) : null;
    const interestLabel = hasInterests ? getInterestLabel(interests) : "";

    // Get learning recommendations
    const learningRecommendations = learningProgressHydrated ? getRecommendations() : [];
    const reviewItems = learningProgressHydrated ? getReviewItems() : [];
    const learningStats = learningProgressHydrated ? getLearningStats() : null;
    const topRecommendation = learningRecommendations[0];

    // Get readiness for each activity
    const activityReadiness = {
        phonics: learningProgressHydrated ? getActivityReadiness("phonics") : null,
        words: learningProgressHydrated ? getActivityReadiness("words") : null,
        blending: learningProgressHydrated ? getActivityReadiness("blending") : null,
        sightWords: learningProgressHydrated ? getActivityReadiness("sight-words") : null,
        stories: learningProgressHydrated ? getActivityReadiness("stories") : null,
        wordFamilies: learningProgressHydrated ? getActivityReadiness("word-families") : null,
    };

    // Wait for ALL stores to hydrate before making decisions
    const hasHydrated = levelProgressHydrated && onboardingHydrated && learningProgressHydrated;

    // Check for active session
    const showResumeCard = hasActiveSession();
    const resumeUrl = getResumeUrl();
    const resumeLabel = getResumeLabel();

    // Redirect first-time users to onboarding, show loading until ready AFTER hydration
    useEffect(() => {
        if (!hasHydrated) return;
        if (isOnboardingComplete === false) {
            router.replace("/onboarding");
        } else if (isOnboardingComplete === true) {
            setIsReady(true);
        }
    }, [isOnboardingComplete, router, hasHydrated]);

    // Show beautiful loading screen while checking onboarding status
    if (!isReady) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-blue-100 flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-8xl mb-6"
                    >
                        🌟
                    </motion.div>
                    <h1 className="text-3xl font-black text-gray-800 mb-2">
                        Smart Starts
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Getting ready to learn...
                    </p>
                </motion.div>
            </main>
        );
    }

    return (
        <main
            id="main-content"
            role="main"
            aria-label="Little Learner Home"
            className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ scale: 0.5, opacity: 0, y: -50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-8 sm:mb-12 md:mb-16 text-center relative z-10"
            >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-800 tracking-tight mb-2 drop-shadow-sm">
                    {childProfile ? (
                        <>Hi, <span className="text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{childName}</span>!</>
                    ) : (
                        <>Little <span className="text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Learner</span></>
                    )}
                </h1>
                <p className="text-lg sm:text-xl text-gray-500 font-medium">
                    {childProfile ? "Ready to learn today?" : "Let's play and learn!"}
                </p>

                {/* Mascot greeting - shown when user has completed onboarding */}
                {childProfile && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 flex items-center justify-center gap-3"
                    >
                        <motion.span
                            animate={shouldReduceMotion ? {} : {
                                y: [0, -5, 0],
                                rotate: [0, -5, 5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="text-4xl"
                        >
                            {mascot.emoji}
                        </motion.span>
                        <div className="bg-white rounded-xl px-4 py-2 shadow-md">
                            <p className="text-gray-700 font-medium text-sm">
                                "{greet()}" — {mascot.name}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Avatar - Clickable to edit profile */}
                {childProfile?.avatarEmoji && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
                        className="mt-3"
                    >
                        <Link
                            href="/settings"
                            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all group"
                            title="Edit Profile"
                        >
                            <span className="text-3xl group-hover:scale-110 transition-transform">
                                {childProfile.avatarEmoji}
                            </span>
                            <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        </Link>
                    </motion.div>
                )}
            </motion.div>

            {/* Unified Progress Dashboard */}
            {childProfile && <UnifiedProgress />}

            {/* For You Section - Personalized recommendations based on interests */}
            {childProfile && hasInterests && recommendations && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="w-full max-w-4xl mb-6 sm:mb-8 relative z-10"
                >
                    <div className={`${gradientClass || 'bg-gradient-to-br from-pink-400 to-purple-400'} rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 shadow-xl border-b-4 sm:border-b-6 border-black/10`}>
                        <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-6 h-6 text-white fill-white" />
                            <h2 className="text-xl sm:text-2xl font-black text-white">For You</h2>
                        </div>
                        <p className="text-white/80 text-sm mb-4">{interestLabel}</p>

                        {/* Quick access to personalized content */}
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/words?filter=for-you" className="group">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all">
                                    <div className="text-3xl mb-2">
                                        {recommendations.words.slice(0, 3).map((w, i) => (
                                            <span key={i} className="mr-1">{w.word.charAt(0)}</span>
                                        ))}
                                    </div>
                                    <p className="text-white font-bold text-sm">Your Words</p>
                                    <p className="text-white/70 text-xs">{recommendations.words.length} words to learn</p>
                                </div>
                            </Link>
                            <Link href="/stories?filter=for-you" className="group">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all">
                                    <div className="text-3xl mb-2">📚</div>
                                    <p className="text-white font-bold text-sm">Your Stories</p>
                                    <p className="text-white/70 text-xs">{recommendations.stories.length} stories for you</p>
                                </div>
                            </Link>
                        </div>

                        {/* Interest badges */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {interests.map((interest) => (
                                <span
                                    key={interest}
                                    className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1"
                                >
                                    {theme?.icon || '⭐'} {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Resume Session Card - shown when there's an active session */}
            {showResumeCard && resumeUrl && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                    className="w-full max-w-4xl mb-4 sm:mb-6 relative z-10"
                >
                    <Link href={resumeUrl} className="group block">
                        <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 shadow-xl border-b-4 sm:border-b-6 border-green-700 group-hover:scale-[1.02] transition-all overflow-hidden">
                            {/* Animated pulse background */}
                            <motion.div
                                animate={{ opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-white/10"
                            />


                            <div className="relative flex items-center gap-4">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
                                        Resume Learning
                                    </h2>
                                    <p className="text-white/90 text-sm sm:text-base font-medium">
                                        {resumeLabel}
                                    </p>
                                    {activeSession?.progress !== undefined && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${activeSession.progress}%` }}
                                                    className="h-full bg-white rounded-full"
                                                />
                                            </div>
                                            <span className="text-white/80 text-xs font-bold">
                                                {Math.round(activeSession.progress)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            )}

            {/* Recommended Next Card - Smart learning recommendation */}
            {childProfile && topRecommendation && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.18, type: "spring", stiffness: 200 }}
                    className="w-full max-w-4xl mb-4 sm:mb-6 relative z-10"
                >
                    <Link href={topRecommendation.href} className="group block">
                        <div className={`relative rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 shadow-xl border-b-4 sm:border-b-6 group-hover:scale-[1.02] transition-all overflow-hidden ${
                            topRecommendation.type === "review"
                                ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 border-amber-700"
                                : topRecommendation.type === "continue"
                                ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 border-blue-700"
                                : topRecommendation.type === "celebrate"
                                ? "bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 border-yellow-600"
                                : "bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 border-teal-700"
                        }`}>
                            {/* Animated background */}
                            <motion.div
                                animate={{ opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 bg-white/10"
                            />


                            <div className="relative flex items-center gap-4">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                    {topRecommendation.type === "review" ? (
                                        <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    ) : topRecommendation.type === "celebrate" ? (
                                        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    ) : (
                                        <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
                                        {topRecommendation.title}
                                    </h2>
                                    <p className="text-white/90 text-sm sm:text-base font-medium">
                                        {topRecommendation.description}
                                    </p>
                                    {reviewItems.length > 0 && topRecommendation.type === "review" && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {reviewItems.slice(0, 5).map((item) => (
                                                <span
                                                    key={item.item}
                                                    className="bg-white/30 px-2 py-0.5 rounded text-white text-xs font-bold"
                                                >
                                                    {item.item}
                                                </span>
                                            ))}
                                            {reviewItems.length > 5 && (
                                                <span className="text-white/70 text-xs font-medium">
                                                    +{reviewItems.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Learning progress bar */}
                            {learningStats && (
                                <div className="relative mt-4 pt-3 border-t border-white/20">
                                    <div className="flex items-center justify-between text-white/80 text-xs font-medium mb-1">
                                        <span>Letter mastery</span>
                                        <span>{learningStats.mastered}/26 letters</span>
                                    </div>
                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(learningStats.mastered / 26) * 100}%` }}
                                            className="h-full bg-white rounded-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Link>
                </motion.div>
            )}

            {/* Featured Learning Journey Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-4xl mb-6 sm:mb-8 relative z-10"
            >
                <Link href="/levels" className="group block">
                    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl border-b-6 sm:border-b-8 border-blue-800 group-hover:scale-[1.02] transition-all overflow-hidden">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

                        {/* Progress Badge */}
                        {currentLevel && (
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                className="absolute top-4 right-4 bg-green-400 text-green-900 px-4 py-2 rounded-full font-black text-sm flex items-center gap-2 shadow-lg"
                            >
                                <Rocket className="w-4 h-4" />
                                LEVEL {currentLevel}
                            </motion.div>
                        )}

                        <div className="relative flex flex-col sm:flex-row items-center gap-6">
                            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                                <Map className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                                    {currentLevel ? 'Continue Your Journey' : 'Start Your Learning Adventure'}
                                </h2>
                                <p className="text-white/90 text-base sm:text-lg font-medium mb-4">
                                    {currentLevel
                                        ? `Keep learning with 10 exciting levels! You're ${getTotalProgress()}% complete`
                                        : 'Explore 10 magical levels filled with reading activities and stories'
                                    }
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold text-sm">
                                        <span>✓ 10 Themed Levels</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold text-sm">
                                        <span>✓ Earn Stars</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold text-sm">
                                        <span>✓ Unlock Stories</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>

            {/* Featured Assessment Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-4xl mb-6 sm:mb-8 relative z-10"
            >
                <Link href="/assessment" className="group block">
                    <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl border-b-6 sm:border-b-8 border-purple-700 group-hover:scale-[1.02] transition-all overflow-hidden">
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />


                        <div className="relative flex flex-col sm:flex-row items-center gap-6">
                            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                                <ClipboardCheck className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                                    Find Your Perfect Path
                                </h2>
                                <p className="text-white/90 text-base sm:text-lg font-medium mb-4">
                                    Take a quick 10-minute assessment to get personalized recommendations
                                </p>
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold text-sm">
                                    <span>✓ Personalized learning path</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>

            <nav
                aria-label="Learning activities"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl relative z-10"
            >
                <Link href="/phonics" className="group" aria-label="ABC Phonics - Learn letters and their sounds">
                    <motion.div
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03, rotate: -2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-primary/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-50" aria-hidden="true" />
                        <div className="bg-yellow-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Star className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-primary transition-colors">ABC Phonics</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Learn letters & sounds</span>
                    </motion.div>
                </Link>

                <Link href="/blending-activities" className="group" aria-label="Blending Practice - Connect sounds to read words">
                    <motion.div
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03, rotate: 2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-green-400/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-50" aria-hidden="true" />
                        {/* Readiness indicator */}
                        {activityReadiness.blending && (
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                activityReadiness.blending.ready
                                    ? "bg-green-100 text-green-700"
                                    : "bg-amber-100 text-amber-700"
                            }`}>
                                {activityReadiness.blending.ready ? (
                                    <><CheckCircle2 className="w-3 h-3" /> Ready</>
                                ) : (
                                    <><AlertCircle className="w-3 h-3" /> {Math.round(activityReadiness.blending.readinessScore)}%</>
                                )}
                            </div>
                        )}
                        <div className="bg-green-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" aria-hidden="true" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-green-600 transition-colors">Blending Practice</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Connect sounds to read!</span>
                    </motion.div>
                </Link>

                <Link href="/words" className="group" aria-label="First Words - Spell simple words">
                    <motion.div
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03, rotate: 2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-accent/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent opacity-50" aria-hidden="true" />
                        {/* Readiness indicator */}
                        {activityReadiness.words && (
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                activityReadiness.words.ready
                                    ? "bg-green-100 text-green-700"
                                    : "bg-amber-100 text-amber-700"
                            }`}>
                                {activityReadiness.words.ready ? (
                                    <><CheckCircle2 className="w-3 h-3" /> Ready</>
                                ) : (
                                    <><AlertCircle className="w-3 h-3" /> {Math.round(activityReadiness.words.readinessScore)}%</>
                                )}
                            </div>
                        )}
                        <div className="bg-pink-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-pink-500 fill-pink-500" aria-hidden="true" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-accent transition-colors">First Words</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Spell simple words</span>
                    </motion.div>
                </Link>

                <Link href="/sight-words" className="group" aria-label="Sight Words - Learn to recognize common words">
                    <motion.div
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03, rotate: -2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-purple-400/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-50" aria-hidden="true" />
                        <div className="bg-purple-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" aria-hidden="true" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-purple-600 transition-colors">Sight Words</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Learn to recognize</span>
                    </motion.div>
                </Link>

                <Link href="/word-families" className="group" aria-label="Word Families - Practice rhyming patterns">
                    <motion.div
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03, rotate: 2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-blue-400/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50" aria-hidden="true" />
                        {/* Readiness indicator */}
                        {activityReadiness.wordFamilies && (
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                activityReadiness.wordFamilies.ready
                                    ? "bg-green-100 text-green-700"
                                    : "bg-amber-100 text-amber-700"
                            }`}>
                                {activityReadiness.wordFamilies.ready ? (
                                    <><CheckCircle2 className="w-3 h-3" /> Ready</>
                                ) : (
                                    <><AlertCircle className="w-3 h-3" /> {Math.round(activityReadiness.wordFamilies.readinessScore)}%</>
                                )}
                            </div>
                        )}
                        <div className="bg-blue-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" aria-hidden="true" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">Word Families</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Rhyming patterns</span>
                    </motion.div>
                </Link>

                <Link href="/stories" className="group" aria-label="Story Books - Read and learn with stories">
                    <motion.div
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03, rotate: -2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-orange-400/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-50" aria-hidden="true" />
                        {/* Readiness indicator */}
                        {activityReadiness.stories && (
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                activityReadiness.stories.ready
                                    ? "bg-green-100 text-green-700"
                                    : "bg-amber-100 text-amber-700"
                            }`}>
                                {activityReadiness.stories.ready ? (
                                    <><CheckCircle2 className="w-3 h-3" /> Ready</>
                                ) : (
                                    <><AlertCircle className="w-3 h-3" /> {Math.round(activityReadiness.stories.readinessScore)}%</>
                                )}
                            </div>
                        )}
                        <div className="bg-orange-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Book className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 fill-orange-500" aria-hidden="true" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-orange-600 transition-colors">Story Books</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Read & learn</span>
                    </motion.div>
                </Link>

                <Link href="/math" className="group" aria-label="Fun Math - Learn counting, addition, and subtraction">
                    <motion.div
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03, rotate: 2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-teal-400/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-50" aria-hidden="true" />
                        <div className="bg-teal-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Calculator className="w-10 h-10 sm:w-12 sm:h-12 text-teal-500" aria-hidden="true" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-teal-600 transition-colors">Fun Math</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Count, add & subtract</span>
                    </motion.div>
                </Link>

                <Link href="/practice" className="group" aria-label="Skills Practice - Trace letters, blend sounds, and more">
                    <motion.div
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03, rotate: -2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-b-4 sm:border-b-6 md:border-b-8 border-gray-100 group-hover:border-indigo-400/30 transition-all h-52 sm:h-60 md:h-64 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-50" aria-hidden="true" />
                        <div className="bg-indigo-100 p-4 sm:p-5 md:p-6 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Pencil className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500" aria-hidden="true" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-gray-800 group-hover:text-indigo-600 transition-colors">Skills Practice</span>
                        <span className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 font-medium">Trace, blend & more</span>
                    </motion.div>
                </Link>
            </nav>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 sm:mt-12 md:mt-16 flex flex-col items-center gap-4"
            >
                {/* Install App Button */}
                <InstallButton />

                {/* Icon Buttons */}
                <div className="flex gap-3 sm:gap-4">
                    <Link
                        href="/achievements"
                        className="p-4 rounded-full bg-white shadow-md text-yellow-400 hover:text-yellow-600 hover:scale-110 transition-all group touch-target"
                        title="Achievements & Badges"
                        aria-label="Achievements & Badges"
                    >
                        <Trophy className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                    </Link>
                    <Link
                        href="/parent-dashboard"
                        className="p-4 rounded-full bg-white shadow-md text-purple-400 hover:text-purple-600 hover:scale-110 transition-all group touch-target"
                        title="Parent Dashboard"
                        aria-label="Parent Dashboard"
                    >
                        <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                    </Link>
                    <Link
                        href="/settings"
                        className="p-4 rounded-full bg-white shadow-md text-gray-400 hover:text-gray-600 hover:scale-110 transition-all group touch-target"
                        title="Settings"
                        aria-label="Settings"
                    >
                        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
