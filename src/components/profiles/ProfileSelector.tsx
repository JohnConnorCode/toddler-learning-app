"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfiles } from "@/hooks/use-profiles";
import { AVATAR_OPTIONS } from "@/lib/profiles-data";
import { Plus, ArrowRight, Sparkles } from "lucide-react";

interface ProfileSelectorProps {
  onProfileSelected?: () => void;
}

export function ProfileSelector({ onProfileSelected }: ProfileSelectorProps) {
  const { profiles, setActiveProfile, createProfile } = useProfiles();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSelectProfile = (profileId: string) => {
    setActiveProfile(profileId);
    onProfileSelected?.();
  };

  if (showCreateForm) {
    return (
      <CreateProfileForm
        onCancel={() => setShowCreateForm(false)}
        onCreate={(profileId) => {
          setShowCreateForm(false);
          handleSelectProfile(profileId);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4"
          >
            <Sparkles className="w-10 h-10 text-purple-500" />
          </motion.div>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-800 mb-2">
            Who's Learning?
          </h1>
          <p className="text-xl text-gray-600">
            Select your profile to continue
          </p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {profiles.map((profile, index) => (
            <motion.button
              key={profile.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectProfile(profile.id)}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all"
              style={{
                background: `linear-gradient(135deg, ${profile.theme.background} 0%, white 100%)`,
              }}
            >
              <div className="text-center">
                <div className="text-6xl mb-3">{profile.avatar}</div>
                <h3 className="font-black text-gray-800 text-lg mb-1">
                  {profile.name}
                </h3>
                <p className="text-sm text-gray-500">Age {profile.age}</p>
              </div>
            </motion.button>
          ))}

          {/* Add Profile Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: profiles.length * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-dashed border-gray-300 hover:border-purple-400"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                <Plus className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-black text-gray-600 text-lg">
                Add Profile
              </h3>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

interface CreateProfileFormProps {
  onCancel: () => void;
  onCreate: (profileId: string) => void;
}

function CreateProfileForm({ onCancel, onCreate }: CreateProfileFormProps) {
  const { createProfile } = useProfiles();
  const [name, setName] = useState("");
  const [age, setAge] = useState(4);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { name?: string; age?: string } = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (age < 2 || age > 10) {
      newErrors.age = "Age must be between 2 and 10";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const profile = createProfile(name.trim(), age, selectedAvatar);
    onCreate(profile.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full"
      >
        <h2 className="text-4xl font-black text-gray-800 mb-8 text-center">
          Create New Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Child's Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-lg font-medium"
              placeholder="Enter name..."
              maxLength={20}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Age Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Age
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="2"
                max="10"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="w-16 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <span className="text-2xl font-black text-purple-700">
                  {age}
                </span>
              </div>
            </div>
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Choose Avatar
            </label>
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-4xl p-2 rounded-xl transition-all ${
                    selectedAvatar === avatar
                      ? "bg-purple-200 scale-110 shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Create Profile</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
