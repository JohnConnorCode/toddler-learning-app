"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  Zap,
  Eye,
  Clock,
  Lock,
  Unlock,
  PlayCircle,
  User,
  Heart,
  RefreshCw,
  Check,
  Edit2,
  Cloud,
  CloudOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  LogOut,
  Mail,
} from "lucide-react";
import { useSettings, WordDifficulty } from "@/hooks/use-settings";
import { useOnboarding, AVATAR_EMOJIS, AGE_OPTIONS } from "@/hooks/use-onboarding";
import { useCloudSync } from "@/hooks/use-cloud-sync";
import { useAuth } from "@/hooks/use-auth";
import { INTEREST_THEMES, MASCOTS, type InterestThemeId, type MascotId } from "@/lib/theme-data";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    // Audio
    isMuted,
    volume,
    toggleMute,
    setVolume,

    // Gameplay
    autoAdvance,
    showHints,
    wordDifficulty,
    showWordFamilies,
    delayBetweenWords,
    toggleAutoAdvance,
    toggleShowHints,
    setWordDifficulty,
    toggleShowWordFamilies,
    setDelayBetweenWords,

    // Progression
    lockProgression,
    toggleLockProgression,

    // Accessibility
    autoPlaySuccess,
    toggleAutoPlaySuccess,

    // Actions
    resetSettings,
  } = useSettings();

  const {
    childProfile,
    updateChildProfile,
    resetOnboarding,
    isOnboardingComplete,
  } = useOnboarding();

  const {
    syncStatus,
    lastSynced,
    error: syncError,
    isOnline,
    isEnabled: cloudSyncEnabled,
    isLoggedIn,
    userEmail,
    syncNow,
    restoreFromCloud,
  } = useCloudSync();

  const { signOut, isLoading: authLoading } = useAuth();

  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const handleStartEditName = () => {
    setTempName(childProfile?.name || "");
    setEditingName(true);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateChildProfile({ name: tempName.trim() });
    }
    setEditingName(false);
  };

  const handleInterestToggle = (interestId: InterestThemeId) => {
    const currentInterests = childProfile?.interests || [];
    let newInterests: InterestThemeId[];

    if (currentInterests.includes(interestId)) {
      // Remove the interest
      newInterests = currentInterests.filter((id) => id !== interestId);
    } else if (currentInterests.length < 3) {
      // Add the interest (max 3)
      newInterests = [...currentInterests, interestId];
    } else {
      return; // Already at max
    }

    // Update primary interest
    const newPrimary = newInterests.length > 0 ? newInterests[0] : null;

    updateChildProfile({
      interests: newInterests,
      primaryInterest: newPrimary,
    });
  };

  const handleMascotSelect = (mascotId: MascotId) => {
    updateChildProfile({ selectedMascot: mascotId });
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
    router.push("/onboarding");
  };

  const difficulties: { value: WordDifficulty; label: string; description: string }[] = [
    { value: "easy", label: "Easy", description: "Exact letters only" },
    { value: "medium", label: "Medium", description: "+2-3 extra letters" },
    { value: "hard", label: "Hard", description: "+4-6 extra letters" },
  ];

  const delayOptions = [
    { value: 1000, label: "Fast (1s)" },
    { value: 2000, label: "Normal (2s)" },
    { value: 3000, label: "Slow (3s)" },
    { value: 5000, label: "Very Slow (5s)" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-bold mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4"
          >
            <SettingsIcon className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-2">
            Settings
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Customize your learning experience
          </p>
        </motion.div>
      </div>

      {/* Settings Sections */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Section */}
        {isOnboardingComplete && childProfile && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-800">Profile</h2>
            </div>

            <div className="space-y-6">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="text-5xl">{childProfile.avatarEmoji}</div>
                <div className="flex-1">
                  {editingName ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="flex-1 px-3 py-2 border-2 border-purple-300 rounded-xl text-lg font-bold focus:outline-none focus:border-purple-500"
                        placeholder="Enter name"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-4 py-2 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-gray-800">
                        {childProfile.name}
                      </h3>
                      <button
                        onClick={handleStartEditName}
                        className="p-2 text-gray-400 hover:text-purple-500 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-gray-600">
                    {AGE_OPTIONS.find((a) => a.value === childProfile.age)?.label || `${childProfile.age} years old`}
                  </p>
                </div>
              </div>

              {/* Avatar Selection - Clean Grid */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Choose Your Avatar</h3>
                <p className="text-sm text-gray-500 mb-3">🤖 Robots & 🦕 Dinosaurs are featured first!</p>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                  {AVATAR_EMOJIS.map((emoji, index) => (
                    <button
                      key={emoji}
                      onClick={() => updateChildProfile({ avatarEmoji: emoji })}
                      className={cn(
                        "aspect-square text-2xl sm:text-3xl rounded-xl transition-all flex items-center justify-center",
                        childProfile.avatarEmoji === emoji
                          ? "bg-purple-200 ring-2 ring-purple-500 scale-105 shadow-lg"
                          : "bg-gray-50 hover:bg-purple-50 hover:scale-105",
                        // Highlight popular first row
                        index < 5 && childProfile.avatarEmoji !== emoji && "bg-yellow-50 hover:bg-yellow-100"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Selection */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Age</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AGE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateChildProfile({ age: option.value })}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all text-center",
                        childProfile.age === option.value
                          ? "border-purple-500 bg-purple-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-purple-300"
                      )}
                    >
                      <div className="text-xl mb-1">{option.emoji}</div>
                      <div className="text-sm font-bold">{option.value} years</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests Selection */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <h3 className="font-bold text-gray-800">Interests</h3>
                  <span className="text-sm text-gray-500">(Pick up to 3)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.values(INTEREST_THEMES).map((theme) => {
                    const isSelected = childProfile.interests?.includes(theme.id);
                    const isPrimary = childProfile.primaryInterest === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => handleInterestToggle(theme.id)}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all text-left relative",
                          isSelected
                            ? "border-pink-400 bg-pink-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-pink-200"
                        )}
                      >
                        {isPrimary && (
                          <span className="absolute top-2 right-2 text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                        <div className="text-3xl mb-2">{theme.icon}</div>
                        <div className="font-bold text-gray-800">{theme.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {theme.emojis.slice(0, 4).join(" ")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mascot Selection - Featured first */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Learning Buddy</h3>
                <p className="text-sm text-gray-500 mb-3">Your buddy cheers you on while you learn!</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Display in preferred order: robot, dinosaur first */}
                  {(['robot', 'dinosaur', 'rocket', 'spaceship', 'car', 'lizard', 'owl'] as const).map((mascotId) => {
                    const mascot = MASCOTS[mascotId];
                    if (!mascot) return null;
                    const isSelected = childProfile.selectedMascot === mascot.id;
                    const isFeatured = mascotId === 'robot' || mascotId === 'dinosaur';
                    return (
                      <button
                        key={mascot.id}
                        onClick={() => handleMascotSelect(mascot.id)}
                        className={cn(
                          "relative p-4 rounded-2xl border-2 transition-all text-center",
                          isSelected
                            ? "border-indigo-400 bg-indigo-100 shadow-lg scale-105"
                            : isFeatured
                            ? "border-yellow-300 bg-yellow-50 hover:border-yellow-400 hover:bg-yellow-100"
                            : "border-gray-200 bg-white hover:border-indigo-200"
                        )}
                      >
                        {isFeatured && !isSelected && (
                          <span className="absolute -top-2 -right-2 text-sm">⭐</span>
                        )}
                        <div className="text-4xl mb-2">{mascot.emoji}</div>
                        <div className="font-bold text-gray-800 text-sm">{mascot.name}</div>
                        <div className="text-xs text-gray-500">{mascot.personality}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Audio Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Volume2 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">Audio</h2>
          </div>

          <div className="space-y-6">
            {/* Mute Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Sound</h3>
                <p className="text-sm text-gray-600">Enable or disable all sounds</p>
              </div>
              <button
                onClick={toggleMute}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-colors",
                  isMuted ? "bg-gray-300" : "bg-green-500"
                )}
              >
                <motion.div
                  animate={{ x: isMuted ? 2 : 34 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="w-3 h-3 text-gray-600" />
                  ) : (
                    <Volume2 className="w-3 h-3 text-green-600" />
                  )}
                </motion.div>
              </button>
            </div>

            {/* Volume Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800">Volume</h3>
                <span className="text-sm font-bold text-gray-600">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                disabled={isMuted}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                style={{
                  background: isMuted
                    ? "#e5e7eb"
                    : `linear-gradient(to right, #10b981 0%, #10b981 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>
          </div>
        </motion.section>

        {/* Difficulty Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">Difficulty</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Word Spelling Challenge</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setWordDifficulty(diff.value)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      wordDifficulty === diff.value
                        ? "border-orange-500 bg-orange-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    )}
                  >
                    <div className="font-black text-gray-800 mb-1">{diff.label}</div>
                    <div className="text-xs text-gray-600">{diff.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Display Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">Display</h2>
          </div>

          <div className="space-y-6">
            {/* Show Hints */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Show Hints Button</h3>
                <p className="text-sm text-gray-600">Display the lightbulb hint button</p>
              </div>
              <button
                onClick={toggleShowHints}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-colors",
                  showHints ? "bg-green-500" : "bg-gray-300"
                )}
              >
                <motion.div
                  animate={{ x: showHints ? 34 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Show Word Families */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Show Word Families</h3>
                <p className="text-sm text-gray-600">Display related words after completing a word</p>
              </div>
              <button
                onClick={toggleShowWordFamilies}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-colors",
                  showWordFamilies ? "bg-green-500" : "bg-gray-300"
                )}
              >
                <motion.div
                  animate={{ x: showWordFamilies ? 34 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Auto Play Success */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Auto-play Celebration</h3>
                <p className="text-sm text-gray-600">Automatically play letter sounds after success</p>
              </div>
              <button
                onClick={toggleAutoPlaySuccess}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-colors",
                  autoPlaySuccess ? "bg-green-500" : "bg-gray-300"
                )}
              >
                <motion.div
                  animate={{ x: autoPlaySuccess ? 34 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                >
                  <PlayCircle className="w-3 h-3 text-gray-600" />
                </motion.div>
              </button>
            </div>
          </div>
        </motion.section>

        {/* Timing Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">Timing</h2>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3">Delay Between Words</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {delayOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDelayBetweenWords(option.value)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all font-bold",
                    delayBetweenWords === option.value
                      ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                      : "border-gray-200 bg-white hover:border-purple-300"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Progression Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-pink-100 rounded-xl">
              {lockProgression ? (
                <Lock className="w-6 h-6 text-pink-600" />
              ) : (
                <Unlock className="w-6 h-6 text-pink-600" />
              )}
            </div>
            <h2 className="text-2xl font-black text-gray-800">Progression</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">Lock Units</h3>
              <p className="text-sm text-gray-600">
                {lockProgression
                  ? "Units unlock as previous ones are completed"
                  : "All units are unlocked and accessible"}
              </p>
            </div>
            <button
              onClick={toggleLockProgression}
              className={cn(
                "relative w-16 h-8 rounded-full transition-colors",
                lockProgression ? "bg-pink-500" : "bg-green-500"
              )}
            >
              <motion.div
                animate={{ x: lockProgression ? 34 : 2 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
              >
                {lockProgression ? (
                  <Lock className="w-3 h-3 text-pink-600" />
                ) : (
                  <Unlock className="w-3 h-3 text-green-600" />
                )}
              </motion.div>
            </button>
          </div>
        </motion.section>

        {/* Account & Cloud Sync */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-sky-100 rounded-xl">
              {isOnline ? (
                <Cloud className="w-6 h-6 text-sky-600" />
              ) : (
                <CloudOff className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <h2 className="text-2xl font-black text-gray-800">Account & Sync</h2>
          </div>

          <div className="space-y-4">
            {/* Logged In User */}
            {isLoggedIn && userEmail && (
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border-2 border-green-100">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-800">Signed In</h3>
                    <p className="text-sm text-green-600">{userEmail}</p>
                  </div>
                </div>
                {showLogoutConfirm ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      disabled={authLoading}
                      className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                )}
              </div>
            )}

            {/* Sync Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                {syncStatus === "syncing" && (
                  <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
                )}
                {syncStatus === "success" && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {syncStatus === "error" && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                {syncStatus === "offline" && (
                  <CloudOff className="w-5 h-5 text-gray-400" />
                )}
                {syncStatus === "not_logged_in" && (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                {syncStatus === "idle" && (
                  <Cloud className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <h3 className="font-bold text-gray-800">
                    {syncStatus === "syncing" && "Syncing..."}
                    {syncStatus === "success" && "Synced"}
                    {syncStatus === "error" && "Sync Failed"}
                    {syncStatus === "offline" && "Offline"}
                    {syncStatus === "not_logged_in" && "Not Logged In"}
                    {syncStatus === "idle" && "Ready to Sync"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {syncStatus === "not_logged_in"
                      ? "Sign in to sync across devices"
                      : lastSynced
                      ? `Last synced: ${new Date(lastSynced).toLocaleString()}`
                      : "Not synced yet"}
                  </p>
                  {syncError && (
                    <p className="text-sm text-red-600">{syncError}</p>
                  )}
                </div>
              </div>
              <button
                onClick={syncNow}
                disabled={!cloudSyncEnabled || !isOnline || !isLoggedIn || syncStatus === "syncing"}
                className={cn(
                  "px-6 py-3 font-bold rounded-xl transition-colors flex items-center gap-2",
                  cloudSyncEnabled && isOnline && isLoggedIn
                    ? "bg-sky-500 text-white hover:bg-sky-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                {syncStatus === "syncing" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Cloud className="w-4 h-4" />
                )}
                Sync Now
              </button>
            </div>

            {/* Restore from Cloud */}
            {cloudSyncEnabled && isLoggedIn && (
              <div className="flex items-center justify-between p-4 bg-sky-50 rounded-2xl border-2 border-sky-100">
                <div>
                  <h3 className="font-bold text-sky-800">Restore from Cloud</h3>
                  <p className="text-sm text-sky-600">
                    Download progress from another device
                  </p>
                </div>
                {showRestoreConfirm ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRestoreConfirm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        restoreFromCloud();
                        setShowRestoreConfirm(false);
                      }}
                      className="px-4 py-2 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Restore
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRestoreConfirm(true)}
                    disabled={!isOnline}
                    className={cn(
                      "px-6 py-3 font-bold rounded-xl transition-colors flex items-center gap-2",
                      isOnline
                        ? "bg-sky-600 text-white hover:bg-sky-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Download className="w-4 h-4" />
                    Restore
                  </button>
                )}
              </div>
            )}

            {/* Info */}
            <p className="text-xs text-gray-500 text-center">
              {isLoggedIn
                ? "Progress syncs automatically when online. Works offline too!"
                : "Sign in to sync your progress across all devices."}
            </p>
          </div>
        </motion.section>

        {/* Reset Options */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-xl">
              <RefreshCw className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">Reset Options</h2>
          </div>

          <div className="space-y-4">
            {/* Reset Settings */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <h3 className="font-bold text-gray-800">Reset Settings</h3>
                <p className="text-sm text-gray-600">Restore all settings to defaults</p>
              </div>
              <button
                onClick={() => {
                  if (confirm("Reset all settings to default?")) {
                    resetSettings();
                  }
                }}
                className="px-6 py-3 bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Reset Onboarding */}
            {isOnboardingComplete && (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border-2 border-red-100">
                <div>
                  <h3 className="font-bold text-red-800">Start Over</h3>
                  <p className="text-sm text-red-600">Redo the setup wizard from the beginning</p>
                </div>
                {showResetConfirm ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleResetOnboarding}
                      className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
                    >
                      Confirm
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Start Over
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Bottom Spacing */}
      <div className="h-16" />
    </div>
  );
}
