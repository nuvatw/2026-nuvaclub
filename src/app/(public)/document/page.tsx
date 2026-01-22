'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  PlaybookHero,
  PlaybookSidebar,
  IdentityTable,
  MarkdownContent,
} from '@/features/document';
import {
  PLAYBOOK_CONTENT,
  IDENTITY_INFO,
} from '@/features/document/data/playbook-content';
import { Card, CardContent, Badge } from '@/components/atoms';
import { cn } from '@/lib/utils';

function SectionHeader({
  id,
  title,
  icon,
}: {
  id: string;
  title: string;
  icon?: string;
}) {
  return (
    <h2
      id={id}
      className="text-2xl font-bold text-white mb-6 flex items-center gap-3 scroll-mt-24"
    >
      {icon && <span className="text-2xl">{icon}</span>}
      {title}
    </h2>
  );
}

function SubsectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <h3
      id={id}
      className="text-lg font-semibold text-white mb-4 scroll-mt-24"
    >
      {title}
    </h3>
  );
}

function IdentityCard({
  identity,
}: {
  identity: (typeof IDENTITY_INFO)[0];
}) {
  const colorMap: Record<string, string> = {
    neutral: 'border-neutral-600',
    primary: 'border-primary-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    amber: 'border-amber-500',
  };

  const bgColorMap: Record<string, string> = {
    neutral: 'bg-neutral-600/10',
    primary: 'bg-primary-500/10',
    blue: 'bg-blue-500/10',
    green: 'bg-green-500/10',
    purple: 'bg-purple-500/10',
    amber: 'bg-amber-500/10',
  };

  return (
    <Card
      className={cn('border-l-4', colorMap[identity.color])}
      padding="none"
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <Badge
            className={cn(
              'px-3 py-1 text-sm font-semibold',
              bgColorMap[identity.color]
            )}
          >
            {identity.name}
          </Badge>
        </div>
        <p className="text-neutral-400 text-sm mb-4">{identity.description}</p>

        {identity.capabilities.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Can Do
            </p>
            <ul className="space-y-1">
              {identity.capabilities.map((cap, i) => (
                <li
                  key={i}
                  className="text-sm text-neutral-300 flex items-start gap-2"
                >
                  <span className="text-green-500 mt-0.5">✓</span>
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        )}

        {identity.limitations.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Cannot Do
            </p>
            <ul className="space-y-1">
              {identity.limitations.map((lim, i) => (
                <li
                  key={i}
                  className="text-sm text-neutral-500 flex items-start gap-2"
                >
                  <span className="text-neutral-600 mt-0.5">✗</span>
                  {lim}
                </li>
              ))}
            </ul>
          </div>
        )}

        {identity.upgradePath && (
          <div className="pt-3 border-t border-neutral-800">
            <p className="text-xs text-primary-400">
              ↗ {identity.upgradePath}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-800 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-white">{question}</span>
        <svg
          className={cn(
            'w-5 h-5 text-neutral-400 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <p className="pb-4 text-neutral-400 text-sm">{answer}</p>
      )}
    </div>
  );
}

export default function DocumentPage() {
  const [activeId, setActiveId] = useState('quick-start');

  // Track active section with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66% 0px',
        threshold: 0,
      }
    );

    // Observe all section headers
    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => {
      if (section.tagName === 'H2' || section.tagName === 'H3') {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </motion.div>

        {/* Hero */}
        <PlaybookHero />

        {/* Main Content with Sidebar */}
        <div className="flex gap-8">
          <PlaybookSidebar activeId={activeId} />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Quick Start Section */}
            <section className="mb-16" id="quick-start-section">
              <SectionHeader id="quick-start" title="Quick Start" icon="🚀" />
              <Card>
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.quickStart.content} />
                </CardContent>
              </Card>
            </section>

            {/* Identity Section */}
            <section className="mb-16">
              <SectionHeader id="identity" title="Your Identity" icon="👤" />
              <p className="text-neutral-400 mb-8">
                Your identity determines what features you can access on nuvaClub.
                Here&apos;s a breakdown of each identity level and their capabilities.
              </p>

              {/* Identity Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {IDENTITY_INFO.slice(0, 2).map((identity) => (
                  <div key={identity.id} id={`identity-${identity.id}`}>
                    <IdentityCard identity={identity} />
                  </div>
                ))}
              </div>

              <SubsectionHeader id="identity-solo" title="Paid Members" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {IDENTITY_INFO.slice(2, 4).map((identity) => (
                  <div key={identity.id}>
                    <IdentityCard identity={identity} />
                  </div>
                ))}
              </div>

              <SubsectionHeader id="identity-duo" title="Premium Duo Tickets" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {IDENTITY_INFO.slice(4).map((identity) => (
                  <div key={identity.id}>
                    <IdentityCard identity={identity} />
                  </div>
                ))}
              </div>

              <SubsectionHeader id="identity-comparison" title="Comparison Table" />
              <IdentityTable />
            </section>

            {/* Learn Section */}
            <section className="mb-16">
              <SectionHeader id="learn" title="Learn" icon="📚" />

              <div id="learn-overview" className="mb-8">
                <Card>
                  <CardContent>
                    <MarkdownContent content={PLAYBOOK_CONTENT.learn.overview} />
                  </CardContent>
                </Card>
              </div>

              <SubsectionHeader id="learn-access" title="Course Access Levels" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.learn.access} />
                </CardContent>
              </Card>

              <SubsectionHeader id="learn-progress" title="Progress Tracking" />
              <Card>
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.learn.progress} />
                </CardContent>
              </Card>
            </section>

            {/* Test Section */}
            <section className="mb-16">
              <SectionHeader id="test" title="Test" icon="📝" />

              <div id="test-overview" className="mb-8">
                <Card>
                  <CardContent>
                    <MarkdownContent content={PLAYBOOK_CONTENT.test.overview} />
                  </CardContent>
                </Card>
              </div>

              <SubsectionHeader id="test-levels" title="Level System" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.test.levels} />
                </CardContent>
              </Card>

              <SubsectionHeader id="test-types" title="Question Types" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.test.types} />
                </CardContent>
              </Card>

              <SubsectionHeader id="test-scoring" title="Scoring & Passing" />
              <Card>
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.test.scoring} />
                </CardContent>
              </Card>
            </section>

            {/* Forum Section */}
            <section className="mb-16">
              <SectionHeader id="forum" title="Forum" icon="💬" />

              <div id="forum-overview" className="mb-8">
                <Card>
                  <CardContent>
                    <MarkdownContent content={PLAYBOOK_CONTENT.forum.overview} />
                  </CardContent>
                </Card>
              </div>

              <SubsectionHeader id="forum-categories" title="Categories" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.forum.categories} />
                </CardContent>
              </Card>

              <SubsectionHeader id="forum-guidelines" title="Posting Guidelines" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.forum.guidelines} />
                </CardContent>
              </Card>

              <SubsectionHeader id="forum-markdown" title="Markdown Guide" />
              <Card>
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.forum.markdown} />
                </CardContent>
              </Card>
            </section>

            {/* Space Section */}
            <section className="mb-16">
              <SectionHeader id="space" title="Space" icon="🤝" />

              <div id="space-overview" className="mb-8">
                <Card>
                  <CardContent>
                    <MarkdownContent content={PLAYBOOK_CONTENT.space.overview} />
                  </CardContent>
                </Card>
              </div>

              <SubsectionHeader id="space-roles" title="Nunu & Vava" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.space.roles} />
                </CardContent>
              </Card>

              <SubsectionHeader id="space-matching" title="Matching Process" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.space.matching} />
                </CardContent>
              </Card>

              <SubsectionHeader id="space-tickets" title="Duo Tickets" />
              <Card>
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.space.tickets} />
                </CardContent>
              </Card>
            </section>

            {/* Sprint Section */}
            <section className="mb-16">
              <SectionHeader id="sprint" title="Sprint" icon="🚀" />

              <div id="sprint-overview" className="mb-8">
                <Card>
                  <CardContent>
                    <MarkdownContent content={PLAYBOOK_CONTENT.sprint.overview} />
                  </CardContent>
                </Card>
              </div>

              <SubsectionHeader id="sprint-seasons" title="Seasons & Sprints" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.sprint.seasons} />
                </CardContent>
              </Card>

              <SubsectionHeader id="sprint-submit" title="Submitting Projects" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.sprint.submit} />
                </CardContent>
              </Card>

              <SubsectionHeader id="sprint-voting" title="Voting" />
              <Card>
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.sprint.voting} />
                </CardContent>
              </Card>
            </section>

            {/* Shop Section */}
            <section className="mb-16">
              <SectionHeader id="shop" title="Shop" icon="🛒" />

              <SubsectionHeader id="shop-plans" title="Plans" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.shop.plans} />
                </CardContent>
              </Card>

              <SubsectionHeader id="shop-duo" title="Duo Tickets" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.shop.duo} />
                </CardContent>
              </Card>

              <SubsectionHeader id="shop-events" title="Events" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.shop.events} />
                </CardContent>
              </Card>

              <SubsectionHeader id="shop-merch" title="Merchandise" />
              <Card>
                <CardContent>
                  <MarkdownContent content={PLAYBOOK_CONTENT.shop.merch} />
                </CardContent>
              </Card>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
              <SectionHeader id="faq" title="Frequently Asked Questions" icon="❓" />
              <Card>
                <CardContent>
                  {PLAYBOOK_CONTENT.faq.items.map((item, index) => (
                    <FAQItem
                      key={index}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Footer CTA */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-12 border-t border-neutral-800"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Start?
              </h2>
              <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                Join nuvaClub today and begin your AI learning journey with our
                community of learners and mentors.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/learn"
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors"
                >
                  Start Learning
                </Link>
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors"
                >
                  View Plans
                </Link>
              </div>
            </motion.section>
          </main>
        </div>
      </div>
    </div>
  );
}
