'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { TOAST_MESSAGES } from '@/Database/content/home-content';
import {
  useCampaignState,
  HeroSection,
  FounderVideoSection,
  FundingSection,
  PlatformPreviewSection,
  FAQSection,
  FinalCTASection,
  SuccessOverlay,
  Toast,
  type PledgeSuccessInfo,
} from '@/features/home';

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tiersRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pledgeSuccessInfo, setPledgeSuccessInfo] = useState<PledgeSuccessInfo | null>(null);
  const [previousRaised, setPreviousRaised] = useState(0);
  const [backerCount, setBackerCount] = useState(127); // Starting backer count

  const {
    raisedAmount,
    goalAmount,
    currency,
    addPledge,
    resetCampaign,
    isHydrated,
  } = useCampaignState();

  // Check for pledge success on mount (wait for hydration)
  useEffect(() => {
    // Wait for hydration before processing pledge success
    if (!isHydrated) return;

    const pledgeParam = searchParams.get('pledge');
    if (pledgeParam === 'success') {
      // Read pledge info from sessionStorage
      const storedInfo = sessionStorage.getItem('nuvaclub_pledge_success');
      if (storedInfo) {
        try {
          const info = JSON.parse(storedInfo);
          // Store current raised amount before adding pledge
          setPreviousRaised(raisedAmount);
          // Generate backer number
          const newBackerNumber = backerCount + 1;
          setBackerCount(newBackerNumber);

          setPledgeSuccessInfo({
            ...info,
            backerNumber: newBackerNumber,
          });
          setShowSuccess(true);

          // Clean up
          sessionStorage.removeItem('nuvaclub_pledge_success');
          // Remove query param from URL
          router.replace('/', { scroll: false });
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  }, [searchParams, raisedAmount, backerCount, router, isHydrated]);

  const scrollToTiers = useCallback(() => {
    tiersRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToVideo = useCallback(() => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToProgress = useCallback(() => {
    progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleSuccessClose = useCallback(() => {
    // Add the pledge to the total
    if (pledgeSuccessInfo) {
      addPledge(pledgeSuccessInfo.amount);
    }
    setShowSuccess(false);
    setPledgeSuccessInfo(null);
    // Scroll to progress bar
    setTimeout(() => scrollToProgress(), 100);
  }, [pledgeSuccessInfo, addPledge, scrollToProgress]);

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <HeroSection
        onScrollToTiers={scrollToTiers}
        onScrollToVideo={scrollToVideo}
      />
      <FounderVideoSection videoRef={videoRef} />
      <FundingSection
        tiersRef={tiersRef}
        progressRef={progressRef}
        raisedAmount={raisedAmount}
        goalAmount={goalAmount}
        currency={currency}
        resetCampaign={resetCampaign}
        isHydrated={isHydrated}
      />
      <PlatformPreviewSection />
      <FAQSection />
      <FinalCTASection onScrollToTiers={scrollToTiers} />

      {/* Success Overlay */}
      <SuccessOverlay
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        pledgeInfo={pledgeSuccessInfo}
        previousRaised={previousRaised}
        goalAmount={goalAmount}
        currency={currency}
      />

      {/* Toast Notification */}
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        title={TOAST_MESSAGES.pledgeSuccess.title}
        description={TOAST_MESSAGES.pledgeSuccess.description}
      />
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">Loading...</div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
