'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  BookOpen,
  Hammer,
  Dumbbell,
  Trees,
  Users,
  Scale,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { createPlayerProfile, updateProfile, getPlayerProfile } from '@/lib/api/player';
import { createQuest } from '@/lib/api/quests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ATTRIBUTE_CONFIG, ATTRIBUTES } from '@/lib/game-config';
import { AttributeType } from '@/lib/types';
import { toast } from 'sonner';

const steps = ['Welcome', 'Display Name', 'Primary Focus', 'Starting World', 'First Quest'];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshPlayerState } = useAuth();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [primaryFocus, setPrimaryFocus] = useState<AttributeType>('mind');
  const [startingWorld, setStartingWorld] = useState('forge');
  const [firstQuest, setFirstQuest] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading]);

  const canProceed = () => {
    if (step === 1) return displayName.trim().length >= 2;
    if (step === 4) return firstQuest.trim().length >= 3;
    return true;
  };

  const handleFinish = async () => {
    if (!user) return;
    setSubmitting(true);
    setError(null);

    const { data: existingProfile } = await getPlayerProfile();

    if (!existingProfile) {
      const { error: createError } = await createPlayerProfile(
        user.id,
        displayName.trim(),
        primaryFocus,
        startingWorld
      );
      if (createError) {
        setError('Something went wrong while creating your profile. Please try again.');
        setSubmitting(false);
        return;
      }
    } else {
      await updateProfile({
        display_name: displayName.trim(),
        primary_focus: primaryFocus,
        onboarding_completed: true,
      });
    }

    if (firstQuest.trim()) {
      await createQuest({
        title: firstQuest.trim(),
        attribute: primaryFocus,
        difficulty: 'easy',
      });
    }

    await updateProfile({ onboarding_completed: true });
    await refreshPlayerState();
    toast.success('Your world begins with a single step.');
    router.push('/world');
  };

  const handleNext = async () => {
    if (step === 4) {
      await handleFinish();
      return;
    }
    setStep((s) => s + 1);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="absolute inset-0 forge-radial" />
      <div className="relative w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'w-8 bg-primary' : 'w-4 bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 rounded-full forge-gradient flex items-center justify-center">
                    <Flame className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-cinzel)' }}>
                  Welcome to LIFEFORGE
                </h1>
                <p className="text-muted-foreground max-w-sm mb-2">
                  Your actions shape your world.
                </p>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Let's set up your character and begin your journey.
                </p>
              </motion.div>
            )}

            {/* Step 1: Display Name */}
            {step === 1 && (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center"
              >
                <h2 className="text-2xl font-bold mb-2">What should we call you?</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Your display name appears throughout your world.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="Enter your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={30}
                    autoFocus
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Primary Focus */}
            {step === 2 && (
              <motion.div
                key="focus"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center"
              >
                <h2 className="text-2xl font-bold mb-2">Choose your primary focus</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  This attribute will guide your early journey. You can grow all attributes over time.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {ATTRIBUTES.map((attr) => {
                    const config = ATTRIBUTE_CONFIG[attr];
                    const selected = primaryFocus === attr;
                    return (
                      <button
                        key={attr}
                        onClick={() => setPrimaryFocus(attr)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          selected
                            ? `border-primary bg-primary/10 ${config.textClass}`
                            : 'border-border bg-card hover:bg-secondary'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgClass}`}>
                          <AttributeIcon name={config.icon} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{config.label}</p>
                          <p className="text-xs text-muted-foreground">{config.description}</p>
                        </div>
                        {selected && <Check className="w-5 h-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Starting World */}
            {step === 3 && (
              <motion.div
                key="world"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <h2 className="text-2xl font-bold mb-3">Your starting world</h2>
                <p className="text-muted-foreground text-sm mb-8 max-w-sm">
                  You begin with a single forge. As you level up, new regions will unlock and your world will grow.
                </p>
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-glow" />
                  <div className="relative w-32 h-32 rounded-full forge-gradient flex items-center justify-center">
                    <Flame className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                  {[
                    { level: '5', name: 'Library', icon: BookOpen },
                    { level: '8', name: 'Workshop', icon: Hammer },
                    { level: '10', name: 'Training', icon: Dumbbell },
                    { level: '12', name: 'Garden', icon: Trees },
                    { level: '15', name: 'Community', icon: Users },
                  ].map((node) => (
                    <div key={node.name} className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border bg-card">
                      <node.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Lv {node.level}</span>
                      <span className="text-xs font-medium">{node.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: First Quest */}
            {step === 4 && (
              <motion.div
                key="quest"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center"
              >
                <h2 className="text-2xl font-bold mb-2">Create your first quest</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  What real-world action will you take first? This becomes your opening quest.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="firstQuest">Quest Title</Label>
                  <Input
                    id="firstQuest"
                    placeholder="e.g. Read for 30 minutes"
                    value={firstQuest}
                    onChange={(e) => setFirstQuest(e.target.value)}
                    maxLength={100}
                    autoFocus
                  />
                </div>
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    This quest is set to {ATTRIBUTE_CONFIG[primaryFocus].label} / Easy difficulty.
                  </p>
                </div>
                {error && (
                  <p className="text-sm text-destructive mt-4">{error}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed() || submitting}
              className="forge-gradient text-white font-semibold"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Forging...
                </span>
              ) : step === 4 ? (
                <span className="flex items-center gap-2">
                  Enter World
                  <ArrowRight className="w-4 h-4" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttributeIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    brain: <BookOpen className="w-5 h-5" />,
    dumbbell: <Dumbbell className="w-5 h-5" />,
    hammer: <Hammer className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
    scale: <Scale className="w-5 h-5" />,
  };
  return <>{icons[name] || <Sparkles className="w-5 h-5" />}</>;
}
