'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button, Card, CardContent, Badge } from '@/components/atoms';
import {
  ArrowRightIcon,
  ChevronRightIcon,
  StarSolidIcon,
  CheckIcon,
  CheckCircleIcon,
} from '@/components/icons';
import { PageTransition } from '@/components/molecules/PageTransition';
import { HomePageSkeleton } from '@/components/skeletons';

// ==========================================
// DATA
// ==========================================

const STATS = [
  { value: '50+', label: 'AI Courses' },
  { value: '10K+', label: 'Learners' },
  { value: '500+', label: 'Mentor Matches' },
  { value: '95%', label: 'Satisfaction' },
];

const PAIN_POINTS = [
  {
    icon: '😵',
    title: 'Overwhelmed by Information',
    description: 'Thousands of AI tutorials, but no clear path forward',
  },
  {
    icon: '🤷',
    title: 'Learning Alone',
    description: 'No one to ask questions or validate your progress',
  },
  {
    icon: '📉',
    title: 'Giving Up Too Soon',
    description: 'Without accountability, motivation fades quickly',
  },
];

const PILLARS = [
  {
    icon: '📚',
    title: 'Learn',
    subtitle: 'Structured AI Courses',
    description:
      'From ChatGPT basics to advanced automation. Video courses designed for real-world application, not just theory.',
    href: '/learn',
    gradient: 'from-blue-500 to-blue-700',
    features: ['50+ video courses', 'Hands-on projects', 'Progress tracking'],
  },
  {
    icon: '💬',
    title: 'Forum',
    subtitle: 'Community Q&A',
    description:
      'Stuck on a problem? Get answers from fellow learners and experts who\'ve been where you are.',
    href: '/forum',
    gradient: 'from-green-500 to-green-700',
    features: ['Expert answers', 'Resource sharing', 'Weekly discussions'],
  },
  {
    icon: '🤝',
    title: 'Space',
    subtitle: '1:1 Mentorship',
    description:
      'Get matched with a Nunu (mentor) who guides your journey. Personal feedback, accountability, and support.',
    href: '/space',
    gradient: 'from-purple-500 to-purple-700',
    features: ['Personal mentor', 'Weekly check-ins', 'Career guidance'],
  },
  {
    icon: '🚀',
    title: 'Sprint',
    subtitle: 'Build & Showcase',
    description:
      'Apply what you learn. Build real AI projects, get community feedback, and build your portfolio.',
    href: '/sprint',
    gradient: 'from-orange-500 to-orange-700',
    features: ['Quarterly challenges', 'Community voting', 'Portfolio pieces'],
  },
  {
    icon: '🛒',
    title: 'Shop',
    subtitle: 'Events & More',
    description:
      'Exclusive workshops, live events, and merchandise. Connect with the community IRL.',
    href: '/shop',
    gradient: 'from-pink-500 to-pink-700',
    features: ['Live workshops', 'Exclusive events', 'Community merch'],
  },
];

const FEATURED_COURSES = [
  {
    id: 'course-1',
    title: 'ChatGPT Mastery',
    instructor: 'Dr. Sarah Chen',
    level: 'Beginner',
    duration: '4 hours',
    image: '/images/courses/chatgpt.jpg',
    rating: 4.9,
    students: 2847,
  },
  {
    id: 'course-2',
    title: 'Prompt Engineering Pro',
    instructor: 'Michael Torres',
    level: 'Intermediate',
    duration: '6 hours',
    image: '/images/courses/prompt.jpg',
    rating: 4.8,
    students: 1923,
  },
  {
    id: 'course-3',
    title: 'AI Automation Workflow',
    instructor: 'Emily Zhang',
    level: 'Advanced',
    duration: '8 hours',
    image: '/images/courses/automation.jpg',
    rating: 4.9,
    students: 1456,
  },
];

const TESTIMONIALS = [
  {
    quote:
      'I went from AI-curious to building automated workflows for my business in 3 months. The mentor matching was a game-changer.',
    name: 'James Liu',
    role: 'Startup Founder',
    avatar: 'https://i.pravatar.cc/150?u=james',
  },
  {
    quote:
      'Finally, a structured path to learning AI. No more jumping between random YouTube tutorials. Everything just clicks here.',
    name: 'Michelle Park',
    role: 'Marketing Director',
    avatar: 'https://i.pravatar.cc/150?u=michelle',
  },
  {
    quote:
      'My Nunu mentor helped me land an AI-focused role. The community here is incredibly supportive and knowledgeable.',
    name: 'David Chen',
    role: 'Product Manager',
    avatar: 'https://i.pravatar.cc/150?u=david2',
  },
];

const PRICING_TIERS = [
  {
    name: 'Explorer',
    price: 'Free',
    period: '',
    description: 'Start your AI journey',
    features: [
      'Access to free courses',
      'Forum browsing & liking',
      'Sprint project viewing',
      'Community access',
    ],
    cta: 'Start Free',
    href: '/learn',
    highlight: false,
  },
  {
    name: 'Solo Traveler',
    price: '$9.99',
    period: '/month',
    description: 'Full learning access',
    features: [
      'All 50+ AI courses',
      'Forum posting & discussions',
      'Sprint project submissions',
      'Progress certificates',
      '12-level AI assessments',
    ],
    cta: 'Start Learning',
    href: '/shop',
    highlight: true,
  },
  {
    name: 'Duo Traveler',
    price: '$29',
    period: '/month',
    description: 'Learning + Mentorship',
    features: [
      'Everything in Solo Traveler',
      '1:1 Nunu mentor matching',
      'Weekly mentor sessions',
      'Priority support',
      'Exclusive Discord access',
    ],
    cta: 'Get a Mentor',
    href: '/shop',
    highlight: false,
  },
];

// ==========================================
// COMPONENTS
// ==========================================

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <iframe
          className="w-full h-[150%] -translate-y-[25%] object-cover scale-125"
          src="https://www.youtube.com/embed/dLRdaUda8Ho?autoplay=1&mute=1&controls=0&loop=1&playlist=dLRdaUda8Ho&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3"
          title="Hero Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ pointerEvents: 'none' }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/80 to-neutral-950 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <Badge variant="primary" className="px-4 py-2 text-sm">
              Join 10,000+ AI learners
            </Badge>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Stop Watching.
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Start Mastering AI.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-neutral-300 mb-8 max-w-2xl leading-relaxed">
            The AI revolution won&apos;t wait for you. Get structured courses, 1:1
            mentorship, and a community that pushes you forward.
          </p>

          {/* Single Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link href="/learn">
              <Button size="lg" className="text-lg px-8 py-4 h-auto">
                Start My AI Journey
                <ArrowRightIcon size="md" className="ml-2" />
              </Button>
            </Link>
            <p className="text-neutral-400 text-sm">
              Free courses available. No credit card required.
            </p>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-neutral-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-neutral-500 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-neutral-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="py-20 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Sound Familiar?
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Most people fail at learning AI. Not because they&apos;re not smart
            enough, but because they&apos;re doing it wrong.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PAIN_POINTS.map((pain, index) => (
            <motion.div
              key={pain.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full bg-neutral-900/80 border-red-900/30 hover:border-red-800/50 transition-colors">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{pain.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {pain.title}
                  </h3>
                  <p className="text-neutral-400">{pain.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Transition to Solution */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-xl text-neutral-300">
            There&apos;s a better way.{' '}
            <span className="text-primary-400 font-semibold">
              A proven system.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="success" className="mb-4">
            The nuvaClub Method
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Five Pillars to AI Mastery
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            A complete ecosystem designed to take you from curious beginner to
            confident AI practitioner.
          </p>
        </motion.div>

        <div className="space-y-6">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={pillar.href}>
                <Card
                  hover
                  className="overflow-hidden group"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Icon/Visual Side */}
                      <div
                        className={`md:w-48 p-8 flex items-center justify-center bg-gradient-to-br ${pillar.gradient}`}
                      >
                        <span className="text-6xl group-hover:scale-110 transition-transform">
                          {pillar.icon}
                        </span>
                      </div>

                      {/* Content Side */}
                      <div className="flex-1 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">
                            {pillar.title}
                          </h3>
                          <Badge variant="outline">{pillar.subtitle}</Badge>
                        </div>
                        <p className="text-neutral-400 mb-4 max-w-xl">
                          {pillar.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {pillar.features.map((feature) => (
                            <span
                              key={feature}
                              className="text-sm text-neutral-300 bg-neutral-800 px-3 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="hidden md:flex items-center px-6">
                        <ChevronRightIcon size="lg" className="text-neutral-600 group-hover:text-white group-hover:translate-x-2 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoursePreviewSection() {
  return (
    <section className="py-20 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start with These
            </h2>
            <p className="text-neutral-400 text-lg">
              Our most popular courses to kickstart your AI journey
            </p>
          </div>
          <Link
            href="/learn"
            className="text-primary-400 hover:text-primary-300 font-medium mt-4 md:mt-0 flex items-center gap-2"
          >
            View all courses
            <ChevronRightIcon size="sm" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED_COURSES.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link href={`/learn/${course.id}`}>
                <Card hover className="overflow-hidden group h-full">
                  {/* Course Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-30">📚</span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge variant="default">{course.level}</Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded text-sm text-white">
                      {course.duration}
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-3">
                      {course.instructor}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <StarSolidIcon size="sm" className="text-yellow-500" />
                        <span className="text-white font-medium">
                          {course.rating}
                        </span>
                      </div>
                      <span className="text-neutral-500 text-sm">
                        {course.students.toLocaleString()} students
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* First Chapter Free */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-neutral-400">
            <span className="text-green-400 font-medium">First chapter free</span>{' '}
            on all courses. Try before you commit.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function MentorshipSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="warning" className="mb-4">
              Space - Mentorship Matching
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Don&apos;t Learn Alone.
              <br />
              <span className="text-primary-400">Get a Nunu.</span>
            </h2>
            <p className="text-neutral-300 text-lg mb-6">
              A <strong className="text-white">Nunu</strong> is your personal AI
              mentor. They&apos;ve walked the path you&apos;re on and can guide you
              through the challenges, answer your questions, and keep you
              accountable.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: '🎯', text: 'Matched based on your goals and level' },
                { icon: '💬', text: 'Weekly 1:1 sessions and async support' },
                { icon: '📈', text: 'Track your progress together' },
                { icon: '🔥', text: 'Stay accountable and motivated' },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-neutral-300">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <Link href="/space">
              <Button variant="secondary" size="lg">
                Explore Space
                <ArrowRightIcon size="md" className="ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Mentor Card */}
              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                      👩‍🏫
                    </div>
                    <div>
                      <div className="text-white font-semibold text-lg">
                        Sarah Lin
                      </div>
                      <div className="text-purple-300 text-sm">
                        Verified Nunu • AI Specialist
                      </div>
                    </div>
                  </div>
                  <p className="text-neutral-300 mb-4">
                    &quot;I help beginners build confidence with AI tools. My focus
                    is practical application over theory.&quot;
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">ChatGPT</Badge>
                    <Badge variant="outline">Automation</Badge>
                    <Badge variant="outline">Business AI</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Match Notification */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-4 -right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
              >
                <CheckIcon size="md" />
                Matched!
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-20 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Real Results from Real Learners
          </h2>
          <p className="text-neutral-400 text-lg">
            Join thousands who&apos;ve transformed their careers with AI skills
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon key={i} size="md" className="text-yellow-500" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-neutral-300 mb-6 leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="text-white font-medium">
                        {testimonial.name}
                      </div>
                      <div className="text-neutral-500 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-neutral-400 text-lg">
            Start free. Upgrade when you&apos;re ready to go deeper.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={tier.highlight ? 'md:-mt-4 md:mb-4' : ''}
            >
              <Card
                className={`h-full ${
                  tier.highlight
                    ? 'border-primary-500 bg-gradient-to-b from-primary-950/50 to-neutral-900'
                    : ''
                }`}
              >
                <CardContent className="p-6">
                  {tier.highlight && (
                    <Badge variant="primary" className="mb-4">
                      Most Popular
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      {tier.price}
                    </span>
                    <span className="text-neutral-400">{tier.period}</span>
                  </div>
                  <p className="text-neutral-400 mb-6">{tier.description}</p>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-neutral-300"
                      >
                        <CheckCircleIcon size="md" className="text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href={tier.href} className="block">
                    <Button
                      variant={tier.highlight ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            AI Won&apos;t Wait.
            <br />
            <span className="text-primary-400">Will You?</span>
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Every day you wait, others are getting ahead. Start your AI journey
            today. First chapter of every course is free.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/learn">
              <Button size="lg" className="text-lg px-10 py-5 h-auto">
                Start Learning Now
                <ArrowRightIcon size="md" className="ml-2" />
              </Button>
            </Link>
          </motion.div>

          <p className="text-neutral-500 mt-6 text-sm">
            Join 10,000+ learners. Free courses available. No credit card
            required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================

export default function HomePage() {
  return (
    <PageTransition skeleton={<HomePageSkeleton />}>
      <div className="min-h-screen">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <CoursePreviewSection />
        <MentorshipSection />
        <TestimonialsSection />
        <PricingSection />
        <FinalCTASection />
      </div>
    </PageTransition>
  );
}
