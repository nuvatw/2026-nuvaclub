'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button, Card, CardContent } from '@/components/atoms';
import { PageTransition } from '@/components/molecules/PageTransition';
import { HomePageSkeleton } from '@/components/skeletons';

const FEATURES = [
  {
    icon: '📚',
    title: 'Learn',
    description: 'Master new skills, from basics to advanced',
    href: '/learn',
    color: 'from-blue-500/20 to-blue-600/20',
  },
  {
    icon: '💬',
    title: 'Forum',
    description: 'Connect with the community, share your journey',
    href: '/forum',
    color: 'from-green-500/20 to-green-600/20',
  },
  {
    icon: '🤝',
    title: 'Space',
    description: 'Find companions, grow together',
    href: '/space',
    color: 'from-purple-500/20 to-purple-600/20',
  },
  {
    icon: '🚀',
    title: 'Sprint',
    description: 'Build projects, showcase your skills',
    href: '/sprint',
    color: 'from-orange-500/20 to-orange-600/20',
  },
  {
    icon: '🛒',
    title: 'Shop',
    description: 'Purchase tickets, events, and merchandise',
    href: '/shop',
    color: 'from-pink-500/20 to-pink-600/20',
  },
];

export default function HomePage() {
  return (
    <PageTransition skeleton={<HomePageSkeleton />}>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <iframe
            className="w-full h-[150%] -translate-y-[25%] object-cover scale-125"
            src={`https://www.youtube.com/embed/dLRdaUda8Ho?autoplay=1&mute=1&controls=0&loop=1&playlist=dLRdaUda8Ho&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
            title="Hero Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ pointerEvents: 'none' }}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-neutral-950/80 to-neutral-950 z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Welcome to{' '}
              <span className="text-primary-400">nuva</span>
              <span className="text-primary-500">Club</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-8">
              Learn → Forum → Space → Sprint → Shop
              <br />
              Your learning journey starts here
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/learn">
                <Button size="lg">
                  Start Learning
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="secondary" size="lg">
                  View Plans
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Five Pillars
          </h2>
          <p className="text-neutral-400">
            Your daily life at nuvaClub
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Link href={feature.href}>
                <Card hover className="h-full">
                  <CardContent>
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Identity Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Your Identity
          </h2>
          <p className="text-neutral-400">
            From Guest to Duo Traveler, unlock more features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Guest',
              description: 'Not logged in, can view first chapter',
              features: ['First chapter', 'Browse Forum', 'Browse Shop'],
              color: 'bg-neutral-600',
            },
            {
              title: 'Explorer',
              description: 'Logged in, free tier',
              features: ['Free courses', 'Forum interaction', 'Browse Sprint'],
              color: 'bg-primary-600',
            },
            {
              title: 'Solo Traveler',
              description: 'Paid member',
              features: ['Full platform courses', 'Forum posting', 'Sprint uploads'],
              color: 'bg-accent-500',
            },
            {
              title: 'Duo Traveler',
              description: 'Active Duo Ticket',
              features: ['Space matching', 'Companion interaction', 'Discord connection'],
              color: 'bg-green-500',
            },
          ].map((identity, index) => (
            <motion.div
              key={identity.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full">
                <CardContent>
                  <div
                    className={`w-3 h-3 rounded-full ${identity.color} mb-4`}
                  />
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {identity.title}
                  </h3>
                  <p className="text-sm text-neutral-400 mb-4">
                    {identity.description}
                  </p>
                  <ul className="space-y-2">
                    {identity.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-sm text-neutral-300 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4 text-primary-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="text-center py-12 px-6 bg-neutral-900/50 border-neutral-800">
            <CardContent>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
                Join nuvaClub and begin your learning journey.
                Start with free courses and gradually unlock more features.
              </p>
              <Link href="/learn">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
    </PageTransition>
  );
}
