'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame,
  BookOpen,
  Hammer,
  Dumbbell,
  Trees,
  Users,
  Scale,
  ArrowRight,
  Sparkles,
  Trophy,
  Calendar,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { MiniWorld } from '@/components/world/mini-world';
import { useAuth } from '@/components/providers/auth-provider';

const attributes = [
  { name: 'Mind', icon: BookOpen, color: 'text-blue-400', desc: 'Learn, study, and expand knowledge' },
  { name: 'Body', icon: Dumbbell, color: 'text-red-400', desc: 'Train, exercise, and build health' },
  { name: 'Craft', icon: Hammer, color: 'text-amber-400', desc: 'Create, build, and master skills' },
  { name: 'Social', icon: Users, color: 'text-emerald-400', desc: 'Connect and build relationships' },
  { name: 'Balance', icon: Scale, color: 'text-purple-400', desc: 'Reflect, meditate, and find harmony' },
];

const steps = [
  { num: '01', title: 'Create a Quest', desc: 'Turn any real-world action into a quest. Study, train, create, connect.' },
  { num: '02', title: 'Complete It', desc: 'Do the action in real life. Mark it complete in LIFEFORGE.' },
  { num: '03', title: 'Earn XP & Essence', desc: 'Gain experience for your attributes and Essence for your sanctuary.' },
  { num: '04', title: 'Watch Your World Grow', desc: 'Level up, unlock new regions, and evolve your world.' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg forge-gradient flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide" style={{ fontFamily: 'var(--font-cinzel)' }}>
              LIFEFORGE
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/world"
                className="px-4 py-2 rounded-lg forge-gradient text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Enter Your World
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg forge-gradient text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 forge-radial" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Life RPG</span>
            </div>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              LIFEFORGE
            </h1>
            <p className="text-2xl sm:text-3xl text-foreground font-semibold mb-3">
              Forge your life. Level by level.
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Your actions shape your world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={user ? '/world' : '/signup'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl forge-gradient font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Enter Your World
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Explore the Forge
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <MiniWorld />
          </motion.div>
        </div>
      </section>

      {/* Core Concept */}
      <section className="py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            Real Life. Quests. Growth. World.
          </motion.h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every action you take in the real world — studying, training, creating, connecting —
            becomes a quest in LIFEFORGE. Complete it, and watch as your character grows,
            your attributes rise, and your world evolves.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm">
            {['Real Life Action', 'Quest', 'Completion', 'XP + Essence', 'Growth', 'World Evolution'].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <span className="px-4 py-2 rounded-full border border-border bg-card text-muted-foreground">
                  {step}
                </span>
                {i < 5 && <ArrowRight className="w-4 h-4 text-primary" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'var(--font-cinzel)' }}>
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-xl border border-border bg-card p-6"
              >
                <span className="text-3xl font-bold text-primary/30 mb-2 block">{step.num}</span>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Attributes */}
      <section className="py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>
            Five Attributes
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Every quest you complete channels growth into one of five attributes that define your character.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {attributes.map((attr, i) => (
              <motion.div
                key={attr.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className={`w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-3 ${attr.color}`}>
                  <attr.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">{attr.name}</h3>
                <p className="text-xs text-muted-foreground">{attr.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Living World */}
      <section className="py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-cinzel)' }}>
              A Living World
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your world begins with a single forge. As you level up, new regions unlock —
              a Library for the mind, a Workshop for craft, a Training Ground for body,
              a Garden for balance, and a Community for connection.
            </p>
            <div className="space-y-3">
              {[
                { level: 'Level 1', unlock: 'Starting Forge', icon: Flame },
                { level: 'Level 5', unlock: 'Library', icon: BookOpen },
                { level: 'Level 8', unlock: 'Workshop', icon: Hammer },
                { level: 'Level 10', unlock: 'Training Ground', icon: Dumbbell },
                { level: 'Level 12', unlock: 'Garden', icon: Trees },
                { level: 'Level 15', unlock: 'Community', icon: Users },
              ].map((node) => (
                <div key={node.unlock} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
                    <node.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground w-16">{node.level}</span>
                  <span className="text-sm font-medium">{node.unlock}</span>
                </div>
              ))}
            </div>
          </div>
          <MiniWorld />
        </div>
      </section>

      {/* Rewards */}
      <section className="py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>
            Rewards That Matter
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Complete quests to earn XP and Essence. Spend Essence in the Sanctuary to upgrade your world.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'XP', desc: 'Experience points that level up your character and attributes', color: 'text-blue-400' },
              { icon: Sparkles, title: 'Essence', desc: 'Currency earned from quests, spent in the Sanctuary shop', color: 'text-amber-400' },
              { icon: Trophy, title: 'World Unlocks', desc: 'New regions and structures that appear as you grow', color: 'text-emerald-400' },
            ].map((reward, i) => (
              <motion.div
                key={reward.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className={`w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-3 ${reward.color}`}>
                  <reward.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{reward.title}</h3>
                <p className="text-sm text-muted-foreground">{reward.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Streaks */}
      <section className="py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
              <div className="relative w-20 h-20 rounded-full bg-card border border-orange-500/30 flex items-center justify-center mx-auto">
                <Flame className="w-10 h-10 text-orange-500" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>
              Build Your Streak
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Complete a quest every day to keep your streak alive. Consistency is the forge of growth.
            </p>
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  <Calendar className="w-4 h-4" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative w-16 h-16 rounded-full forge-gradient flex items-center justify-center mx-auto">
                <Flame className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>
              Your world begins with a single step.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Forge your life. Level by level.
            </p>
            <Link
              href={user ? '/world' : '/signup'}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl forge-gradient font-semibold text-white text-lg hover:opacity-90 transition-opacity"
            >
              Enter Your World
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded forge-gradient flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-cinzel)' }}>
              LIFEFORGE
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Your actions shape your world.</p>
        </div>
      </footer>
    </div>
  );
}
