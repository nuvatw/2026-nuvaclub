'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  PlaybookHero,
  PlaybookSidebar,
  IdentityTable,
  MarkdownContent,
} from '@/features/document';
import {
  VERSION_LIST,
  getPlaybookVersion,
  getLatestVersion,
  isLatestVersion,
} from '@/features/document/data/playbook-content';
import { Card, CardContent, Badge } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { IdentityInfo, VersionUpdate } from '@/features/document/types';

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
      className="text-2xl font-bold text-white mb-6 flex items-center gap-3 scroll-mt-[88px]"
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
      className="text-lg font-semibold text-white mb-4 scroll-mt-[88px]"
    >
      {title}
    </h3>
  );
}

function IdentityCard({
  identity,
}: {
  identity: IdentityInfo;
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

function VersionUpdateCard({ update }: { update: VersionUpdate }) {
  const categoryColors: Record<VersionUpdate['category'], { bg: string; text: string; label: string }> = {
    feature: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'New' },
    improvement: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Improved' },
    fix: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Fixed' },
    breaking: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Breaking' },
  };

  const colors = categoryColors[update.category];

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', colors.bg, colors.text)}>
        {colors.label}
      </span>
      <div>
        <h4 className="font-medium text-white">{update.title}</h4>
        <p className="text-sm text-neutral-400 mt-1">{update.description}</p>
      </div>
    </div>
  );
}

function VersionSelector({
  selectedVersion,
  onVersionChange,
}: {
  selectedVersion: string;
  onVersionChange: (version: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-colors"
      >
        <span className="text-sm text-neutral-300">v{selectedVersion}</span>
        <svg
          className={cn('w-4 h-4 text-neutral-400 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {isLatestVersion(selectedVersion) && (
          <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
            Latest
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 rounded-lg bg-neutral-800 border border-neutral-700 shadow-xl z-20 overflow-hidden">
            <div className="p-2">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1">
                Version History
              </p>
              {VERSION_LIST.map((version) => (
                <button
                  key={version.version}
                  onClick={() => {
                    onVersionChange(version.version);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors',
                    selectedVersion === version.version
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-neutral-300 hover:bg-neutral-700/50'
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">v{version.version}</span>
                      {isLatestVersion(version.version) && (
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{version.releaseDate}</p>
                  </div>
                  {selectedVersion === version.version && (
                    <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DocumentPage() {
  const [activeId, setActiveId] = useState('quick-start');
  const [selectedVersion, setSelectedVersion] = useState(getLatestVersion().info.version);

  // Get the selected playbook version data
  const playbook = useMemo(() => {
    return getPlaybookVersion(selectedVersion) || getLatestVersion();
  }, [selectedVersion]);

  const isLatest = isLatestVersion(selectedVersion);
  const content = playbook.content;
  const identityInfo = playbook.identityInfo;

  // Collect all TOC IDs for observation
  const tocIds = useMemo(() => {
    const ids = new Set<string>();
    const collectIds = (items: typeof playbook.tableOfContents) => {
      items.forEach(item => {
        ids.add(item.id);
        if (item.children) {
          item.children.forEach(child => ids.add(child.id));
        }
      });
    };
    collectIds(playbook.tableOfContents);
    return ids;
  }, [playbook.tableOfContents]);

  // Track active section with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry (topmost visible section)
        const intersecting = entries.filter(e => e.isIntersecting);
        if (intersecting.length > 0) {
          // Sort by position and take the topmost
          const topmost = intersecting.reduce((prev, curr) => {
            return prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr;
          });
          setActiveId(topmost.target.id);
        }
      },
      {
        // -88px top matches our scroll offset (navbar + buffer)
        // -50% bottom triggers when section is in top half of viewport
        rootMargin: '-88px 0px -50% 0px',
        threshold: 0,
      }
    );

    // Observe all elements with IDs that are in our TOC
    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => {
      if (tocIds.has(section.id)) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [selectedVersion, tocIds]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link and Version Selector */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 flex items-center justify-between"
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
          <VersionSelector
            selectedVersion={selectedVersion}
            onVersionChange={setSelectedVersion}
          />
        </motion.div>

        {/* Hero */}
        <PlaybookHero
          quickStartItems={playbook.quickStartItems}
          content={content}
          versionInfo={playbook.info}
          isLatest={isLatest}
        />

        {/* Main Content with Sidebar */}
        <div className="flex gap-8">
          <PlaybookSidebar activeId={activeId} tableOfContents={playbook.tableOfContents} />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Quick Start Section */}
            <section className="mb-16" id="quick-start-section">
              <SectionHeader id="quick-start" title="Quick Start" icon="🚀" />
              <Card>
                <CardContent>
                  <MarkdownContent content={content.quickStart.content} />
                </CardContent>
              </Card>
            </section>

            {/* Version Updates Section (v2.0.0+) */}
            {content.versionUpdates && playbook.changelog && (
              <section className="mb-16">
                <SectionHeader id="version-updates" title="Version Updates" icon="✨" />
                <Card className="mb-6">
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          v{playbook.changelog.version} - {playbook.info.title}
                        </h3>
                        <p className="text-sm text-neutral-400">
                          Released on {playbook.changelog.releaseDate}
                        </p>
                      </div>
                      {isLatest && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          Current Version
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-300 mb-6">{playbook.changelog.summary}</p>
                    <div className="space-y-3">
                      {playbook.changelog.updates.map((update, index) => (
                        <VersionUpdateCard key={index} update={update} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <MarkdownContent content={content.versionUpdates.content} />
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Identity Section */}
            <section className="mb-16">
              <SectionHeader id="identity" title="Your Identity" icon="👤" />
              <p className="text-neutral-400 mb-8">
                Your identity determines what features you can access on nuvaClub.
                Here&apos;s a breakdown of each identity level and their capabilities.
              </p>

              {/* Identity Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {identityInfo.slice(0, 2).map((identity) => (
                  <div key={identity.id} id={`identity-${identity.id}`} className="scroll-mt-[88px]">
                    <IdentityCard identity={identity} />
                  </div>
                ))}
              </div>

              <SubsectionHeader id="identity-solo" title="Paid Members" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {identityInfo.slice(2, 4).map((identity) => (
                  <div key={identity.id}>
                    <IdentityCard identity={identity} />
                  </div>
                ))}
              </div>

              <SubsectionHeader id="identity-duo" title="Premium Duo Tickets" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {identityInfo.slice(4).map((identity) => (
                  <div key={identity.id}>
                    <IdentityCard identity={identity} />
                  </div>
                ))}
              </div>

              <SubsectionHeader id="identity-comparison" title="Comparison Table" />
              <IdentityTable capabilities={playbook.identityCapabilities} />
            </section>

            {/* Member Dashboard Section (v2.0.0+) */}
            {playbook.tableOfContents.some(item => item.id === 'member-dashboard') && (
              <section className="mb-16">
                <SectionHeader id="member-dashboard" title="Member Dashboard" icon="🏠" />

                <div id="dashboard-overview" className="mb-8 scroll-mt-[88px]">
                  <Card>
                    <CardContent>
                      <MarkdownContent content={`
**Your personal control center** for managing your nuvaClub experience. Access your dashboard by clicking on your avatar after logging in.

### Dashboard Sections
The member dashboard is divided into several sections to help you manage different aspects of your learning journey.
                      `} />
                    </CardContent>
                  </Card>
                </div>

                <SubsectionHeader id="dashboard-profile" title="Profile" />
                <Card className="mb-8">
                  <CardContent>
                    <MarkdownContent content={`
View and manage your personal information:
- **Display Name**: Your name shown across the platform
- **Avatar**: Your profile picture
- **Bio**: Tell others about yourself
- **Identity Level**: Your current membership tier
- **Join Date**: When you became a member
                    `} />
                  </CardContent>
                </Card>

                <SubsectionHeader id="dashboard-courses" title="My Courses" />
                <Card className="mb-8">
                  <CardContent>
                    <MarkdownContent content={`
Track your learning progress:
- **Enrolled Courses**: All courses you've started
- **Progress Bars**: Visual completion indicators
- **Resume Learning**: Jump back to where you left off
- **Completion History**: Courses you've finished
                    `} />
                  </CardContent>
                </Card>

                <SubsectionHeader id="dashboard-favorites" title="Favorites" />
                <Card className="mb-8">
                  <CardContent>
                    <MarkdownContent content={`
Quick access to saved content:
- **Favorite Courses**: Courses you've starred for later
- **Bookmarked Posts**: Forum discussions you want to revisit
- **Saved Projects**: Sprint projects you found inspiring
                    `} />
                  </CardContent>
                </Card>

                <SubsectionHeader id="dashboard-settings" title="Settings" />
                <Card className="mb-8">
                  <CardContent>
                    <MarkdownContent content={`
Customize your experience:
- **Account Settings**: Email, password, security
- **Notification Preferences**: Email and push notifications
- **Display Settings**: Theme, language, accessibility
- **Privacy Settings**: Profile visibility, data preferences
                    `} />
                  </CardContent>
                </Card>

                <SubsectionHeader id="dashboard-space" title="My Space" />
                <Card>
                  <CardContent>
                    <MarkdownContent content={`
Manage your Space connections (Duo Ticket holders only):
- **Active Matches**: Current Nunu/Vava partnerships
- **Match History**: Past mentorship connections
- **Matching Posts**: Your active matching requests
- **Messages**: Communication with matches
                    `} />
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Learn Section */}
            <section className="mb-16">
              <SectionHeader id="learn" title="Learn" icon="📚" />

              <div id="learn-overview" className="mb-8 scroll-mt-[88px]">
                <Card>
                  <CardContent>
                    <MarkdownContent content={content.learn.overview} />
                  </CardContent>
                </Card>
              </div>

              {/* Learn Levels (v2.0.0+) */}
              {playbook.tableOfContents.find(item => item.id === 'learn')?.children?.some(child => child.id === 'learn-levels') && (
                <>
                  <SubsectionHeader id="learn-levels" title="Course Levels (1-10)" />
                  <Card className="mb-8">
                    <CardContent>
                      <MarkdownContent content={`
Courses are organized into 10 difficulty levels:

| Level | Name | Description |
|-------|------|-------------|
| Lv.1 | Beginner | Introduction to AI concepts (Free) |
| Lv.2 | Basic | Foundational skills |
| Lv.3 | Elementary | Building understanding |
| Lv.4 | Intermediate | Applied knowledge |
| Lv.5 | Upper-Int | Advanced applications |
| Lv.6 | Advanced | Complex implementations |
| Lv.7 | Proficient | Expert techniques |
| Lv.8 | Expert | Specialized skills |
| Lv.9 | Master | Industry-level mastery |
| Lv.10 | Grandmaster | Elite expertise |

### Level Badges
Each course displays a color-coded level badge:
- **Green** (Lv.1-2): Beginner-friendly
- **Blue** (Lv.3-4): Elementary level
- **Default** (Lv.5-6): Intermediate
- **Orange** (Lv.7-8): Advanced
- **Red** (Lv.9-10): Master level
                      `} />
                    </CardContent>
                  </Card>
                </>
              )}

              <SubsectionHeader id="learn-access" title="Course Access Levels" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.learn.access} />
                </CardContent>
              </Card>

              <SubsectionHeader id="learn-progress" title="Progress Tracking" />
              <Card>
                <CardContent>
                  <MarkdownContent content={content.learn.progress} />
                </CardContent>
              </Card>
            </section>

            {/* Test Section */}
            <section className="mb-16">
              <SectionHeader id="test" title="Test" icon="📝" />

              <div id="test-overview" className="mb-8 scroll-mt-[88px]">
                <Card>
                  <CardContent>
                    <MarkdownContent content={content.test.overview} />
                  </CardContent>
                </Card>
              </div>

              <SubsectionHeader id="test-levels" title="Level System" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.test.levels} />
                </CardContent>
              </Card>

              <SubsectionHeader id="test-types" title="Question Types" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.test.types} />
                </CardContent>
              </Card>

              <SubsectionHeader id="test-scoring" title="Scoring & Passing" />
              <Card>
                <CardContent>
                  <MarkdownContent content={content.test.scoring} />
                </CardContent>
              </Card>
            </section>

            {/* Forum Section */}
            <section className="mb-16">
              <SectionHeader id="forum" title="Forum" icon="💬" />

              <div id="forum-overview" className="mb-8 scroll-mt-[88px]">
                <Card>
                  <CardContent>
                    <MarkdownContent content={content.forum.overview} />
                  </CardContent>
                </Card>
              </div>

              <SubsectionHeader id="forum-categories" title="Categories" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.forum.categories} />
                </CardContent>
              </Card>

              <SubsectionHeader id="forum-guidelines" title="Posting Guidelines" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.forum.guidelines} />
                </CardContent>
              </Card>

              <SubsectionHeader id="forum-markdown" title="Markdown Guide" />
              <Card>
                <CardContent>
                  <MarkdownContent content={content.forum.markdown} />
                </CardContent>
              </Card>
            </section>

            {/* Space Section */}
            <section className="mb-16">
              <SectionHeader id="space" title="Space" icon="🤝" />

              <div id="space-overview" className="mb-8 scroll-mt-[88px]">
                <Card>
                  <CardContent>
                    <MarkdownContent content={content.space.overview} />
                  </CardContent>
                </Card>
              </div>

              <SubsectionHeader id="space-roles" title="Nunu & Vava" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.space.roles} />
                </CardContent>
              </Card>

              <SubsectionHeader id="space-matching" title="Matching Process" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.space.matching} />
                </CardContent>
              </Card>

              <SubsectionHeader id="space-tickets" title="Duo Tickets" />
              <Card>
                <CardContent>
                  <MarkdownContent content={content.space.tickets} />
                </CardContent>
              </Card>
            </section>

            {/* Sprint Section */}
            <section className="mb-16">
              <SectionHeader id="sprint" title="Sprint" icon="🚀" />

              <div id="sprint-overview" className="mb-8 scroll-mt-[88px]">
                <Card>
                  <CardContent>
                    <MarkdownContent content={content.sprint.overview} />
                  </CardContent>
                </Card>
              </div>

              <SubsectionHeader id="sprint-seasons" title="Seasons & Sprints" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.sprint.seasons} />
                </CardContent>
              </Card>

              <SubsectionHeader id="sprint-submit" title="Submitting Projects" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.sprint.submit} />
                </CardContent>
              </Card>

              <SubsectionHeader id="sprint-voting" title="Voting" />
              <Card>
                <CardContent>
                  <MarkdownContent content={content.sprint.voting} />
                </CardContent>
              </Card>
            </section>

            {/* Shop Section */}
            <section className="mb-16">
              <SectionHeader id="shop" title="Shop" icon="🛒" />

              <SubsectionHeader id="shop-plans" title="Plans" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.shop.plans} />
                </CardContent>
              </Card>

              <SubsectionHeader id="shop-duo" title="Duo Tickets" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.shop.duo} />
                </CardContent>
              </Card>

              <SubsectionHeader id="shop-events" title="Events" />
              <Card className="mb-8">
                <CardContent>
                  <MarkdownContent content={content.shop.events} />
                </CardContent>
              </Card>

              <SubsectionHeader id="shop-merch" title="Merchandise" />
              <Card>
                <CardContent>
                  <MarkdownContent content={content.shop.merch} />
                </CardContent>
              </Card>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
              <SectionHeader id="faq" title="Frequently Asked Questions" icon="❓" />
              <Card>
                <CardContent>
                  {content.faq.items.map((item, index) => (
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
