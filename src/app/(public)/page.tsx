'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, CardContent, Badge, Modal } from '@/components/atoms';
import {
  ArrowRightIcon,
  CheckIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  SparklesIcon,
  ShareIcon,
  CopyIcon,
  ChatBubbleIcon,
  ImageIcon,
  GiftIcon,
  TagIcon,
  ShoppingBagIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UsersIcon,
  FireIcon,
  ShoppingCartIcon,
} from '@/components/icons';

// Helper to render perk icons (replacing emojis)
function PerkIcon({ icon, className }: { icon: string; className?: string }) {
  const iconClass = cn('w-5 h-5', className);
  // Map emoji to icon
  if (icon.includes('🎟') || icon.includes('票') || icon.includes('派對')) {
    return <TagIcon className={iconClass} />;
  }
  if (icon.includes('🎒') || icon.includes('背包') || icon.includes('包')) {
    return <ShoppingBagIcon className={iconClass} />;
  }
  return <GiftIcon className={iconClass} />;
}

// Helper to render module icons (replacing emojis)
function ModuleIcon({ title, className }: { title: string; className?: string }) {
  const iconClass = cn('w-10 h-10', className);
  switch (title) {
    case 'Learn':
      return <BookOpenIcon className={iconClass} />;
    case 'Test':
      return <AcademicCapIcon className={iconClass} />;
    case 'Forum':
      return <ChatBubbleIcon className={iconClass} />;
    case 'Space':
      return <UsersIcon className={iconClass} />;
    case 'Sprint':
      return <FireIcon className={iconClass} />;
    case 'Shop':
      return <ShoppingCartIcon className={iconClass} />;
    default:
      return <SparklesIcon className={iconClass} />;
  }
}
import { cn } from '@/lib/utils';
import {
  // Campaign
  CAMPAIGN_CONFIG,
  // Hero
  HERO_CONTENT,
  HERO_VIDEO_ID,
  STATS,
  // Founder Video
  FOUNDER_VIDEO_CONTENT,
  // Funding
  FUNDING_CONTENT,
  FUNDING_TIERS,
  CUSTOM_TIER_CONFIG,
  // Attendee Selection
  ATTENDEE_SELECTION,
  // Celebration
  CELEBRATION_CONTENT,
  // Platform Preview
  PLATFORM_PREVIEW_CONTENT,
  PLATFORM_MODULES,
  // FAQ
  FAQ_CONTENT,
  FAQ_ITEMS,
  // Final CTA
  FINAL_CTA_CONTENT,
  // Toast
  TOAST_MESSAGES,
} from '@/Database/content/home-content';

// ==========================================
// CAMPAIGN STATE HOOK (localStorage persistence)
// ==========================================

function useCampaignState() {
  const [raisedAmount, setRaisedAmount] = useState<number>(CAMPAIGN_CONFIG.initialRaised);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CAMPAIGN_CONFIG.storageKey);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        setRaisedAmount(parsed);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CAMPAIGN_CONFIG.storageKey, String(raisedAmount));
    }
  }, [raisedAmount, isHydrated]);

  const addPledge = useCallback((amount: number) => {
    setRaisedAmount((prev) => prev + amount);
  }, []);

  const resetCampaign = useCallback(() => {
    setRaisedAmount(CAMPAIGN_CONFIG.initialRaised);
    localStorage.removeItem(CAMPAIGN_CONFIG.storageKey);
  }, []);

  return {
    raisedAmount,
    goalAmount: CAMPAIGN_CONFIG.goalAmount,
    currency: CAMPAIGN_CONFIG.currency,
    addPledge,
    resetCampaign,
    isHydrated,
  };
}

// ==========================================
// ANIMATED COUNTER COMPONENT
// ==========================================

function AnimatedCounter({
  value,
  duration = 1000,
  currency = '',
}: {
  value: number;
  duration?: number;
  currency?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current === value) return;

    const startValue = previousValue.current;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    previousValue.current = value;
  }, [value, duration]);

  return (
    <span>
      {currency}
      {displayValue.toLocaleString()}
    </span>
  );
}

// ==========================================
// ATTENDEE SELECTION MODAL
// ==========================================

function AttendeeSelectionModal({
  isOpen,
  onClose,
  tierName,
  amount,
  months,
  tierId,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  tierName: string;
  amount: number;
  months: number;
  tierId: string;
  onConfirm: (count: number) => void;
}) {
  const [count, setCount] = useState(1);
  const [customCount, setCustomCount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const router = useRouter();

  const effectiveCount = isCustom ? (parseInt(customCount, 10) || 1) : count;
  const totalAmount = amount * effectiveCount;
  const avgMonthlyPrice = Math.round(amount / months);

  const handleSelectPreset = (num: number) => {
    setCount(num);
    setIsCustom(false);
    setCustomCount('');
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    if (!customCount) {
      setCustomCount('4');
    }
  };

  const handleCustomChange = (value: string) => {
    const num = value.replace(/\D/g, '');
    if (num === '' || (parseInt(num, 10) >= 1 && parseInt(num, 10) <= 99)) {
      setCustomCount(num);
    }
  };

  const handleConfirm = () => {
    onConfirm(effectiveCount);
    // Navigate to checkout page
    const params = new URLSearchParams({
      tier: tierId,
      count: effectiveCount.toString(),
      ...(tierId === 'tier-custom' ? { amount: amount.toString() } : {}),
    });
    router.push(`/pledge?${params.toString()}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ATTENDEE_SELECTION.title} size="md">
      <div>
        <p className="text-neutral-400 text-sm mb-6">{ATTENDEE_SELECTION.subtitle}</p>

        {/* Tier Info */}
        <div className="bg-neutral-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-400">方案</span>
            <span className="text-white font-semibold">{tierName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-400">會員期間</span>
            <span className="text-white">{months} 個月</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">{ATTENDEE_SELECTION.labels.perPerson}</span>
            <span className="text-white font-semibold">NT${amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Attendee Count Selector */}
        <div className="mb-6">
          <label className="block text-sm text-neutral-400 mb-3">選擇人數</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => handleSelectPreset(num)}
                className={cn(
                  'flex-1 py-3 rounded-lg font-semibold transition-all',
                  !isCustom && count === num
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                )}
              >
                {num} {ATTENDEE_SELECTION.labels.person}
              </button>
            ))}
            {/* Custom Input */}
            <div className="flex-1 relative">
              {isCustom ? (
                <input
                  type="text"
                  value={customCount}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  autoFocus
                  className="w-full h-full py-3 px-3 rounded-lg font-semibold text-center bg-primary-500 text-white border-2 border-primary-400 focus:outline-none"
                  placeholder="4+"
                />
              ) : (
                <button
                  onClick={handleCustomClick}
                  className="w-full py-3 rounded-lg font-semibold transition-all bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                >
                  自訂
                </button>
              )}
            </div>
          </div>
          {isCustom && (
            <p className="text-xs text-neutral-500 mt-2">請輸入人數（1-99）</p>
          )}
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300">{ATTENDEE_SELECTION.labels.total}</span>
            <span className="text-2xl font-bold text-white">
              NT${totalAmount.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-neutral-500 text-right mt-1">
            平均每月 NT${avgMonthlyPrice}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={effectiveCount < 1} className="flex-1">
            {ATTENDEE_SELECTION.labels.continue}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ==========================================
// SUCCESS OVERLAY (After Checkout)
// ==========================================

interface PledgeSuccessInfo {
  amount: number;
  tierName: string;
  months: number;
  attendeeCount: number;
  backerNumber: number;
  purchaserName: string;
  participantNames?: string[];
}

// Instagram Logo SVG Component
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

// LINE Logo SVG Component
function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  );
}

// Download Icon SVG Component
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

// Animated Liquid Flowing Gradient Orb - Premium smooth animation with subtle texture
function FlowingGradientOrb({ canvasRef, subtle = false }: { canvasRef?: React.RefObject<HTMLCanvasElement | null>; subtle?: boolean }) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const canvas = canvasRef?.current || internalCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200; // High resolution for quality
    canvas.width = size;
    canvas.height = size;

    let time = 0;
    // Smoother animation with eased time progression
    const timeSpeed = subtle ? 0.008 : 0.012; // Slower, smoother

    const animate = () => {
      // Smooth easing for premium feel
      time += timeSpeed;

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 10;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Create circular clipping path
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Draw flowing liquid gradient with subtle color intensity
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;

      // Color intensity multiplier - subtle mode reduces vibrancy
      const colorIntensity = subtle ? 0.35 : 0.5;
      const baseColor = subtle ? 60 : 30; // Higher base = more muted

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= radius) {
            const angle = Math.atan2(dy, dx);
            const normalizedDist = dist / radius;

            // Smoother flowing effect with cubic easing
            const easeTime = time * 0.8;
            const flow1 = Math.sin(angle * 1.5 + easeTime * 1.2 + normalizedDist * 2) * 0.5 + 0.5;
            const flow2 = Math.sin(angle * 2 - easeTime * 0.9 + normalizedDist * 1.5) * 0.5 + 0.5;
            const flow3 = Math.sin(angle * 1.2 + easeTime * 1.5 - normalizedDist * 2.5) * 0.5 + 0.5;
            const flow4 = Math.sin(normalizedDist * 3 - easeTime * 1.8 + angle * 0.8) * 0.5 + 0.5;

            // Blend multiple color channels for liquid effect
            const blend = (flow1 + flow2 + flow3 + flow4) / 4;
            const blend2 = (flow1 * 0.6 + flow2 * 0.4 + flow3 * 0.3) / 1.3;
            const blend3 = (flow2 * 0.5 + flow4 * 0.5);

            // Soft pastel colors for premium look
            const r = Math.floor(255 * (colorIntensity + colorIntensity * Math.sin(blend * Math.PI * 2 + 0)));
            const g = Math.floor(255 * (colorIntensity + colorIntensity * Math.sin(blend2 * Math.PI * 2 + 2)));
            const b = Math.floor(255 * (colorIntensity + colorIntensity * Math.sin(blend3 * Math.PI * 2 + 4)));

            // Smooth brightness falloff from center
            const brightness = 1 - normalizedDist * 0.25;

            const idx = (y * size + x) * 4;
            data[idx] = Math.min(255, r * brightness + baseColor);
            data[idx + 1] = Math.min(255, g * brightness + baseColor);
            data[idx + 2] = Math.min(255, b * brightness + baseColor);
            data[idx + 3] = 255;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Add subtle film grain texture overlay for premium feel
      const grainIntensity = subtle ? 8 : 12;
      const grainData = ctx.getImageData(0, 0, size, size);
      const grainPixels = grainData.data;
      for (let i = 0; i < grainPixels.length; i += 4) {
        const noise = (Math.random() - 0.5) * grainIntensity;
        grainPixels[i] = Math.max(0, Math.min(255, grainPixels[i] + noise));
        grainPixels[i + 1] = Math.max(0, Math.min(255, grainPixels[i + 1] + noise));
        grainPixels[i + 2] = Math.max(0, Math.min(255, grainPixels[i + 2] + noise));
      }
      ctx.putImageData(grainData, 0, 0);

      // Add soft glossy reflection
      const gradient = ctx.createRadialGradient(
        centerX - radius * 0.3, centerY - radius * 0.3, 0,
        centerX, centerY, radius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw subtle border ring
      ctx.strokeStyle = 'rgba(120, 120, 120, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 1, 0, Math.PI * 2);
      ctx.stroke();

      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasRef, subtle, prefersReducedMotion]);

  return (
    <div className="relative w-24 h-24">
      {/* Subtle outer glow - more muted */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 blur-xl opacity-30" />
      {/* Canvas for liquid animation */}
      <canvas
        ref={canvasRef || internalCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ borderRadius: '50%' }}
      />
    </div>
  );
}

// Confetti component with proper fade-out and cleanup
function ConfettiEffect() {
  const [confettiItems, setConfettiItems] = useState<Array<{ id: number; x: number; color: string; delay: number; duration: number }>>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Generate confetti items only on client
    const items = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['bg-primary-400', 'bg-accent-400', 'bg-green-400', 'bg-yellow-400', 'bg-pink-400'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.5,
      duration: 3 + Math.random() * 2,
    }));
    setConfettiItems(items);

    // Fade out and cleanup after 5 seconds
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    const cleanupTimer = setTimeout(() => {
      setConfettiItems([]);
    }, 6000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  if (confettiItems.length === 0) return null;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      {confettiItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{
            opacity: 1,
            x: `${item.x}vw`,
            y: -20,
            rotate: 0,
          }}
          animate={{
            y: '100vh',
            rotate: Math.random() * 720,
            opacity: [1, 1, 0.5, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: [0.25, 0.1, 0.25, 1], // Smooth cubic bezier
          }}
          className={cn('absolute w-3 h-3 rounded-sm', item.color)}
        />
      ))}
    </motion.div>
  );
}

function SuccessOverlay({
  isOpen,
  onClose,
  pledgeInfo,
  previousRaised,
  goalAmount,
  currency,
}: {
  isOpen: boolean;
  onClose: () => void;
  pledgeInfo: PledgeSuccessInfo | null;
  previousRaised: number;
  goalAmount: number;
  currency: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [progressAnimated, setProgressAnimated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Get all participant names for carousel
  const participantNames = pledgeInfo?.participantNames && pledgeInfo.participantNames.length > 0
    ? pledgeInfo.participantNames
    : pledgeInfo ? [pledgeInfo.purchaserName] : [];
  const totalCards = participantNames.length;

  // Play success sound when overlay opens
  useEffect(() => {
    if (isOpen && pledgeInfo) {
      // Create and play audio
      audioRef.current = new Audio('/success.wav');
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // Audio play failed (user hasn't interacted with page yet)
      });

      // Start progress animation after a short delay
      const timer = setTimeout(() => setProgressAnimated(true), 500);
      // Reset card index when overlay opens
      setCurrentCardIndex(0);
      return () => clearTimeout(timer);
    } else {
      setProgressAnimated(false);
    }
  }, [isOpen, pledgeInfo]);

  if (!pledgeInfo) return null;

  const newTotal = previousRaised + pledgeInfo.amount;
  const previousPercent = Math.min((previousRaised / goalAmount) * 100, 100);
  const newPercent = Math.min((newTotal / goalAmount) * 100, 100);
  const addedPercent = newPercent - previousPercent;

  // Generate a single high-quality card image for a participant
  // Uses 2x resolution for retina-quality sharpness
  const generateCardImage = async (
    participantName: string,
    memberNumber: number,
    orbCanvas: HTMLCanvasElement | null
  ): Promise<Blob | null> => {
    // Use 2x scale for high DPI / retina quality
    const scale = 2;
    const baseWidth = 405;
    const baseHeight = 720;
    const outputWidth = baseWidth * scale;
    const outputHeight = baseHeight * scale;

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d', { alpha: false })!;

    // Scale everything by 2x for retina sharpness
    ctx.scale(scale, scale);

    // Enable high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill background - solid dark for clean look
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Card dimensions (centered)
    const cardWidth = 320;
    const cardHeight = 440;
    const cardX = (baseWidth - cardWidth) / 2;
    const cardY = (baseHeight - cardHeight) / 2;
    const borderRadius = 16;

    // Draw card background with rounded corners
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, borderRadius);
    ctx.fillStyle = '#141414';
    ctx.fill();

    // Draw subtle card border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Load and draw nuva logo at top
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    await new Promise<void>((resolve) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => resolve();
      logoImg.src = '/white%20nuva%20logo.png';
    });

    if (logoImg.complete && logoImg.naturalWidth > 0) {
      const logoHeight = 22;
      const logoWidth = (logoImg.naturalWidth / logoImg.naturalHeight) * logoHeight;
      ctx.drawImage(logoImg, (baseWidth - logoWidth) / 2, cardY + 32, logoWidth, logoHeight);
    }

    // Draw "MEMBERSHIP" text
    ctx.fillStyle = '#666666';
    ctx.font = '600 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MEMBERSHIP', baseWidth / 2, cardY + 75);

    // Draw the animated orb by capturing from the live canvas
    const orbCenterY = cardY + 165;
    const orbRadius = 52;

    if (orbCanvas) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(baseWidth / 2, orbCenterY, orbRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        orbCanvas,
        0, 0, 200, 200,
        baseWidth / 2 - orbRadius, orbCenterY - orbRadius, orbRadius * 2, orbRadius * 2
      );
      ctx.restore();

      ctx.strokeStyle = 'rgba(100, 100, 100, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(baseWidth / 2, orbCenterY, orbRadius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const orbGradient = ctx.createRadialGradient(
        baseWidth / 2, orbCenterY, 0,
        baseWidth / 2, orbCenterY, orbRadius
      );
      orbGradient.addColorStop(0, '#a855f7');
      orbGradient.addColorStop(0.5, '#3b82f6');
      orbGradient.addColorStop(1, '#06b6d4');
      ctx.beginPath();
      ctx.arc(baseWidth / 2, orbCenterY, orbRadius, 0, Math.PI * 2);
      ctx.fillStyle = orbGradient;
      ctx.fill();
    }

    // Draw "EARLY BACKER" text
    ctx.fillStyle = '#666666';
    ctx.font = '600 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('EARLY BACKER', baseWidth / 2, cardY + 248);

    // Draw name
    ctx.fillStyle = '#ffffff';
    ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(participantName || 'Member', baseWidth / 2, cardY + 280);

    // Draw "MEMBER NO." text
    ctx.fillStyle = '#4a4a4a';
    ctx.font = '600 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('MEMBER NO.', baseWidth / 2, cardY + 325);

    // Draw backer number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`#${String(memberNumber).padStart(4, '0')}`, baseWidth / 2, cardY + 365);

    // Draw decorative line
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(baseWidth / 2 - 35, cardY + 405);
    ctx.lineTo(baseWidth / 2 - 10, cardY + 405);
    ctx.moveTo(baseWidth / 2 + 10, cardY + 405);
    ctx.lineTo(baseWidth / 2 + 35, cardY + 405);
    ctx.stroke();

    // Draw center dot
    ctx.beginPath();
    ctx.arc(baseWidth / 2, cardY + 405, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#333333';
    ctx.fill();

    // Convert to blob with high quality PNG
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  // Download all participant cards (one per participant)
  const handleDownloadImage = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // Get participant names - if no participantNames, use purchaserName
      const names = pledgeInfo.participantNames && pledgeInfo.participantNames.length > 0
        ? pledgeInfo.participantNames
        : [pledgeInfo.purchaserName];

      // Generate and download a card for each participant
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const memberNumber = pledgeInfo.backerNumber + i;

        const blob = await generateCardImage(name, memberNumber, videoCanvasRef.current);

        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `nuvaclub-member-${memberNumber}-${name.replace(/\s+/g, '-')}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Small delay between downloads to prevent browser blocking
          if (i < names.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }

      setIsDownloading(false);
    } catch (error) {
      console.error('Image download failed:', error);
      alert('圖片下載失敗，請重試');
      setIsDownloading(false);
    }
  };

  const handleShare = (platform: string) => {
    const shareUrl = window.location.origin;
    const shareText = `我剛剛成為了 nuvaClub 的第 ${pledgeInfo.backerNumber} 號贊助者！一起來支持 AI 學習社群吧！`;

    if (platform === 'line') {
      window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'instagram') {
      // Open Instagram app or website
      window.open('https://www.instagram.com/', '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('已複製連結！');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
        >
          {/* Confetti with proper fade-out and cleanup */}
          <ConfettiEffect />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative z-10 w-full max-w-md mx-auto my-8"
          >
            {/* Thank you message */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">謝謝你支持我們的夢想</h2>
              <p className="text-neutral-400">您已成為 nuvaClub 早鳥贊助者</p>
            </div>

            {/* Passport-style Backer Card with Carousel for Multiple Participants */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCardIndex}
                  ref={cardRef}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Subtle leather texture pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Card content */}
                  <div className="relative p-8">
                    {/* Header - nuva logo branding */}
                    <div className="flex justify-center mb-4">
                      <img
                        src="/white%20nuva%20logo.png"
                        alt="nuva"
                        className="h-8 w-auto opacity-90"
                      />
                    </div>

                    <div className="text-center mb-2">
                      <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase">Membership</p>
                    </div>

                    {/* Centered Flowing Gradient Orb with subtle animation */}
                    <div className="flex justify-center mb-6">
                      <FlowingGradientOrb canvasRef={videoCanvasRef} subtle />
                    </div>

                    {/* User Info - Shows current participant */}
                    <div className="text-center mb-4">
                      <p className="text-neutral-500 text-xs tracking-wider uppercase mb-1">Early Backer</p>
                      <p className="text-white text-xl font-medium tracking-wide">
                        {participantNames[currentCardIndex] || 'Member'}
                      </p>
                    </div>

                    {/* Backer Number - Increments for each participant */}
                    <div className="text-center mb-6">
                      <p className="text-neutral-600 text-xs tracking-wider uppercase mb-1">Member No.</p>
                      <p className="text-3xl font-bold text-white tracking-widest">
                        #{String(pledgeInfo.backerNumber + currentCardIndex).padStart(4, '0')}
                      </p>
                    </div>

                    {/* Bottom decorative element */}
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-px bg-neutral-700" />
                        <div className="w-2 h-2 rounded-full bg-neutral-700" />
                        <div className="w-8 h-px bg-neutral-700" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Card Navigation - Only show if multiple participants */}
              {totalCards > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setCurrentCardIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentCardIndex === 0}
                    className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="上一張卡片"
                  >
                    <ChevronLeftIcon size="sm" className="text-white" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {participantNames.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentCardIndex(index)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          index === currentCardIndex
                            ? 'bg-white w-4'
                            : 'bg-neutral-600 hover:bg-neutral-500'
                        )}
                        aria-label={`卡片 ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentCardIndex(prev => Math.min(totalCards - 1, prev + 1))}
                    disabled={currentCardIndex === totalCards - 1}
                    className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="下一張卡片"
                  >
                    <ChevronRightIcon size="sm" className="text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 bg-neutral-900/80 rounded-xl p-4 border border-neutral-800">
              <p className="text-sm text-neutral-400 mb-2">{CELEBRATION_CONTENT.progressLabel}</p>
              <div className="h-3 bg-neutral-800 rounded-full overflow-hidden relative">
                {/* Combined progress bar - previous + new pledge seamlessly */}
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${newPercent}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                  {/* Previous progress (blue) */}
                  <div
                    className="absolute left-0 top-0 h-full bg-primary-600"
                    style={{ width: `${(previousPercent / newPercent) * 100}%` }}
                  />
                  {/* New pledge (green) - fills the rest */}
                  <motion.div
                    className="absolute top-0 h-full bg-green-500"
                    style={{ left: `${(previousPercent / newPercent) * 100}%`, right: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: progressAnimated ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  />
                </motion.div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-neutral-500">
                  {currency}{previousRaised.toLocaleString()} → {currency}{newTotal.toLocaleString()}
                </span>
                <span className="text-green-400 font-medium">
                  +{currency}{pledgeInfo.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-3">
              {/* Download Image Button */}
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 border border-neutral-700"
              >
                <DownloadIcon className="w-5 h-5" />
                <span>
                  {isDownloading
                    ? '下載中...'
                    : pledgeInfo.attendeeCount > 1
                      ? `下載會員卡 (${pledgeInfo.attendeeCount}張)`
                      : '下載會員卡'
                  }
                </span>
              </button>

              {/* Share Buttons - Simplified colors */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare('instagram')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors border border-neutral-700"
                >
                  <InstagramIcon className="w-5 h-5 text-pink-400" />
                  <span className="text-sm text-neutral-300">IG</span>
                </button>
                <button
                  onClick={() => handleShare('line')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors border border-neutral-700"
                >
                  <LineIcon className="w-5 h-5 text-[#06C755]" />
                  <span className="text-sm text-neutral-300">LINE</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors border border-neutral-700"
                >
                  <CopyIcon size="md" className="text-neutral-400" />
                  <span className="text-sm text-neutral-300">複製</span>
                </button>
              </div>

              {/* Close Button */}
              <Button onClick={onClose} variant="outline" className="w-full">
                {CELEBRATION_CONTENT.closeButton}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================

function Toast({
  isOpen,
  onClose,
  title,
  description,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-xl max-w-md"
        >
          <div className="flex items-start gap-3">
            <CheckCircleIcon size="md" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-green-100">{description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// COUNTDOWN TIMER COMPONENT
// ==========================================

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="h-5" />; // Placeholder to prevent layout shift
  }

  const { days, hours, minutes, seconds } = timeLeft;
  const isEnded = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  if (isEnded) {
    return (
      <p className="text-amber-400 text-xs sm:text-sm font-medium">
        募資已結束
      </p>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
      <span className="text-neutral-400">募資倒數</span>
      <div className="flex items-center gap-1 font-mono">
        <span className="bg-neutral-800 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
          {days}
        </span>
        <span className="text-neutral-500">天</span>
        <span className="bg-neutral-800 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
          {String(hours).padStart(2, '0')}
        </span>
        <span className="text-neutral-500">:</span>
        <span className="bg-neutral-800 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
          {String(minutes).padStart(2, '0')}
        </span>
        <span className="text-neutral-500">:</span>
        <span className="bg-neutral-800 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
          {String(seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// HERO SECTION (Dream Pitch)
// ==========================================

function HeroSection({
  onScrollToTiers,
  onScrollToVideo,
}: {
  onScrollToTiers: () => void;
  onScrollToVideo: () => void;
}) {
  const [videoReady, setVideoReady] = useState(false);

  // Preload video by waiting for iframe to be ready
  useEffect(() => {
    // Give the video a moment to start loading, then fade in
    const timer = setTimeout(() => setVideoReady(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
      {/* Video Background - hidden until ready, no visible loading state */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Poster/placeholder that matches the gradient overlay - ensures no CLS */}
        <div className="absolute inset-0 bg-neutral-950" />
        {/* Video iframe - starts invisible, fades in when ready */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <iframe
            className="w-full h-[150%] -translate-y-[25%] object-cover scale-125"
            src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_VIDEO_ID}&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
            title="Hero Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ pointerEvents: 'none' }}
          />
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/85 to-neutral-950 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <Badge variant="warning" className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm" dot>
              {HERO_CONTENT.badge}
            </Badge>
          </motion.div>

          {/* Headline - optimized for mobile */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-[1.2] sm:leading-tight">
            {HERO_CONTENT.headline.line1}
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              {HERO_CONTENT.headline.line2}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-neutral-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
            {HERO_CONTENT.subheadline}
          </p>

          {/* Dual CTAs - optimized for mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-row items-center gap-3 sm:gap-4 mb-4"
          >
            <Button
              size="lg"
              className="text-sm sm:text-lg px-5 sm:px-8 py-3 sm:py-4 h-auto flex-1 sm:flex-none"
              onClick={onScrollToTiers}
            >
              {HERO_CONTENT.primaryCta}
              <ArrowRightIcon size="sm" className="ml-1.5 sm:ml-2 hidden sm:block" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-sm sm:text-lg px-5 sm:px-8 py-3 sm:py-4 h-auto flex-1 sm:flex-none"
              onClick={onScrollToVideo}
            >
              <PlayIcon size="sm" className="mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">{HERO_CONTENT.secondaryCta}</span>
              <span className="sm:hidden">創辦人的話</span>
            </Button>
          </motion.div>

          {/* Countdown Timer */}
          <CountdownTimer targetDate={CAMPAIGN_CONFIG.countdownEndDate} />
        </motion.div>

        {/* Stats Row - optimized for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 sm:mt-16 grid grid-cols-4 gap-2 sm:gap-8"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">
                {stat.value}
              </div>
              <div className="text-neutral-400 text-[10px] sm:text-sm leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
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

// ==========================================
// FOUNDER VIDEO SECTION
// ==========================================

function FounderVideoSection({ videoRef }: { videoRef: React.RefObject<HTMLElement | null> }) {
  return (
    <section ref={videoRef} className="py-20 bg-neutral-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="primary" className="mb-4">
            {FOUNDER_VIDEO_CONTENT.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {FOUNDER_VIDEO_CONTENT.headline}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {FOUNDER_VIDEO_CONTENT.subheadline}
          </p>
        </motion.div>

        {/* Video Embed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-video rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${FOUNDER_VIDEO_CONTENT.videoId}?rel=0&modestbranding=1`}
              title="創辦人的話"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Duration Badge */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {FOUNDER_VIDEO_CONTENT.duration}
          </div>
        </motion.div>

        {/* Video Chapters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <h3 className="text-neutral-400 text-sm mb-4 text-center">影片章節</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {FOUNDER_VIDEO_CONTENT.chapters.map((chapter) => (
              <div
                key={chapter.time}
                className="bg-neutral-800 px-4 py-2 rounded-lg text-sm"
              >
                <span className="text-primary-400 font-mono mr-2">
                  {chapter.time}
                </span>
                <span className="text-neutral-300">{chapter.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// FUNDING PROGRESS + TIERS SECTION
// ==========================================

interface TierCardProps {
  tier: (typeof FUNDING_TIERS)[number];
  onSelect: () => void;
}

function TierCard({ tier, onSelect }: TierCardProps) {
  const savings = tier.originalValue - tier.price;
  const savingsPercent = Math.round((savings / tier.originalValue) * 100);
  const avgMonthlyPrice = Math.round(tier.price / tier.getMonths);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      {/* Container with subtle glow that respects rounded corners */}
      <div className={cn(
        'h-full relative rounded-2xl',
        tier.highlight && 'shadow-[0_0_25px_rgba(59,130,246,0.15),0_0_50px_rgba(59,130,246,0.08)]'
      )}>
        <Card
          className={cn(
            'h-full relative overflow-hidden transition-all duration-300 cursor-pointer rounded-2xl',
            tier.highlight
              ? 'border-2 border-primary-500/60 bg-gradient-to-b from-primary-500/8 to-transparent'
              : 'border-neutral-700 hover:border-neutral-600'
          )}
          onClick={onSelect}
        >
          {/* Best Value Badge */}
          {tier.badge && (
            <div
              className={cn(
                'absolute top-0 right-0 px-4 py-1 text-xs font-bold rounded-bl-lg',
                tier.highlight
                  ? 'bg-primary-500 text-white'
                  : 'bg-amber-500 text-black'
              )}
            >
              {tier.badge}
            </div>
          )}

          <CardContent className="p-6">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
              <p className="text-neutral-400 text-sm">{tier.subtitle}</p>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  NT${tier.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-neutral-500 line-through text-sm">
                  NT${tier.originalValue.toLocaleString()}
                </span>
                <Badge variant="success" size="sm">
                  省 {savingsPercent}%
                </Badge>
              </div>
            </div>

            {/* Months Math */}
            <div className="bg-neutral-800 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">
                  支付 {tier.payMonths} 個月
                </span>
                <ArrowRightIcon size="sm" className="text-neutral-500" />
                <span className="text-green-400 font-semibold">
                  獲得 {tier.getMonths} 個月
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-neutral-700 flex items-center justify-between text-sm">
                <span className="text-neutral-500">平均每月</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600 line-through text-xs">NT$990</span>
                  <span className="text-green-400 font-semibold">NT${avgMonthlyPrice}</span>
                </div>
              </div>
            </div>

            {/* Perks */}
            <ul className="space-y-2 mb-4">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm">
                  <CheckIcon size="sm" className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-300">{perk}</span>
                </li>
              ))}
            </ul>

            {/* Exclusive Perks */}
            {'exclusivePerks' in tier && tier.exclusivePerks && (
              <div className="mt-4 pt-4 border-t border-neutral-700">
                <p className="text-xs text-amber-400 font-semibold mb-3 uppercase tracking-wide">
                  限定贈品
                </p>
                <div className="space-y-2">
                  {tier.exclusivePerks.map((perk) => (
                    <div
                      key={perk.title}
                      className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2"
                    >
                      <PerkIcon icon={perk.icon} className="text-amber-400 flex-shrink-0" />
                      <p className="text-amber-300 font-medium text-sm">
                        {perk.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Limited Qty */}
            {tier.limitedQty && (
              <div className="mt-4 text-center">
                <Badge variant="error" size="sm">
                  限量 {tier.limitedQty} 組
                </Badge>
              </div>
            )}

            {/* CTA Button */}
            <div className="mt-4">
              <Button
                variant={tier.highlight ? 'primary' : 'outline'}
                className={cn(
                  'w-full font-semibold',
                  tier.highlight && 'shadow-lg shadow-primary-500/30'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
              >
                選擇此方案
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// ==========================================
// CUSTOM TIER CARD (4th option)
// ==========================================

interface CustomTierCardProps {
  onSelect: (amount: number) => void;
  minPrice: number;
}

function CustomTierCard({ onSelect, minPrice }: CustomTierCardProps) {
  const [customAmount, setCustomAmount] = useState<string>(minPrice.toString());
  const [error, setError] = useState<string>('');
  const [callMeDaddy, setCallMeDaddy] = useState(false);

  const amount = parseInt(customAmount, 10) || 0;
  const isValid = amount >= minPrice;

  // Calculate months: ceil(amount / 400) so average never exceeds 400
  // e.g., 5200 → 13 months (avg 400), 5201 → 14 months (avg ~371)
  const pricePerMonth = CAMPAIGN_CONFIG.customTierMonthlyPrice;
  const totalMonths = Math.ceil(amount / pricePerMonth);
  const avgMonthlyPrice = totalMonths > 0 ? Math.round(amount / totalMonths) : pricePerMonth;

  const handleAmountChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');
    setCustomAmount(numericValue);

    const num = parseInt(numericValue, 10) || 0;
    if (num > 0 && num < minPrice) {
      setError(`最低金額為 NT$${minPrice.toLocaleString()}`);
    } else {
      setError('');
    }
  };

  const handleSelect = () => {
    if (isValid) {
      onSelect(amount);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="h-full relative overflow-hidden border-neutral-700 hover:border-neutral-600 transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white">{CUSTOM_TIER_CONFIG.name}</h3>
            <p className="text-neutral-400 text-sm">{CUSTOM_TIER_CONFIG.subtitle}</p>
          </div>

          {/* Custom Amount Input */}
          <div className="mb-4">
            <label className="block text-sm text-neutral-400 mb-2">輸入金額</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                NT$
              </span>
              <input
                type="text"
                value={customAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={cn(
                  'w-full pl-14 pr-4 py-3 bg-neutral-800 border rounded-lg text-white text-xl font-bold focus:outline-none',
                  error
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-neutral-700 focus:border-primary-500'
                )}
              />
            </div>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            <p className="text-neutral-500 text-xs mt-1">
              最低 NT${minPrice.toLocaleString()}
            </p>
          </div>

          {/* Calculated Benefits */}
          {isValid && (
            <div className="bg-neutral-800 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-neutral-400">獲得會員</span>
                <span className="text-green-400 font-semibold">{totalMonths} 個月</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">平均每月</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600 line-through text-xs">NT$990</span>
                  <span className="text-green-400 font-semibold">NT${avgMonthlyPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Perks */}
          <ul className="space-y-2 mb-4">
            {CUSTOM_TIER_CONFIG.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm">
                <CheckIcon size="sm" className="text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-300">{perk}</span>
              </li>
            ))}
          </ul>

          {/* Special Checkbox Option */}
          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={callMeDaddy}
                  onChange={(e) => setCallMeDaddy(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  callMeDaddy
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-neutral-800 border-neutral-600 group-hover:border-neutral-500'
                )}>
                  {callMeDaddy && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-neutral-300 group-hover:text-neutral-200 transition-colors">
                上哲會叫你一聲爸爸
              </span>
            </label>
          </div>

          {/* Exclusive Perks */}
          <div className="mt-4 pt-4 border-t border-neutral-700">
            <p className="text-xs text-amber-400 font-semibold mb-3 uppercase tracking-wide">
              限定贈品
            </p>
            <div className="space-y-2">
              {CUSTOM_TIER_CONFIG.exclusivePerks.map((perk) => {
                const isRed = 'color' in perk && perk.color === 'red';
                return (
                  <div
                    key={perk.title}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2',
                      isRed
                        ? 'bg-red-500/10 border border-red-500/30'
                        : 'bg-amber-500/10 border border-amber-500/30'
                    )}
                  >
                    <PerkIcon icon={perk.icon} className={cn('flex-shrink-0', isRed ? 'text-red-400' : 'text-amber-400')} />
                    <p className={cn('font-medium text-sm', isRed ? 'text-red-300' : 'text-amber-300')}>
                      {perk.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-4">
            <Button
              variant="primary"
              className="w-full font-semibold"
              onClick={handleSelect}
              disabled={!isValid}
            >
              選擇此金額
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface SelectedTier {
  id: string;
  name: string;
  amount: number;
  months: number;
}

function FundingSection({
  tiersRef,
  progressRef,
  raisedAmount,
  goalAmount,
  currency,
  resetCampaign,
  isHydrated,
}: {
  tiersRef: React.RefObject<HTMLElement | null>;
  progressRef: React.RefObject<HTMLDivElement | null>;
  raisedAmount: number;
  goalAmount: number;
  currency: string;
  resetCampaign: () => void;
  isHydrated: boolean;
}) {
  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SelectedTier | null>(null);

  const progressPercent = Math.min((raisedAmount / goalAmount) * 100, 100);
  const remaining = goalAmount - raisedAmount;

  // Handle tier selection - show attendee modal
  const handleSelectTier = (tier: (typeof FUNDING_TIERS)[number]) => {
    setSelectedTier({
      id: tier.id,
      name: tier.name,
      amount: tier.price,
      months: tier.getMonths,
    });
    setShowAttendeeModal(true);
  };

  // Handle custom amount selection
  const handleSelectCustom = (amount: number) => {
    // ceil(amount / 400) so average never exceeds 400
    const totalMonths = Math.ceil(amount / CAMPAIGN_CONFIG.customTierMonthlyPrice);

    setSelectedTier({
      id: 'tier-custom',
      name: CUSTOM_TIER_CONFIG.name,
      amount,
      months: totalMonths,
    });
    setShowAttendeeModal(true);
  };

  const handleCloseAttendeeModal = () => {
    setShowAttendeeModal(false);
    setSelectedTier(null);
  };

  return (
    <section ref={tiersRef} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="warning" className="mb-4">
            {FUNDING_CONTENT.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {FUNDING_CONTENT.headline}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {FUNDING_CONTENT.subheadline}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          ref={progressRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-12"
        >
          <Card className="bg-neutral-900/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-neutral-400 text-sm">募資進度</p>
                  <p className="text-3xl font-bold text-white">
                    {isHydrated ? (
                      <AnimatedCounter
                        value={raisedAmount}
                        currency={currency}
                      />
                    ) : (
                      `${currency}0`
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-neutral-400 text-sm">目標</p>
                  <p className="text-xl font-semibold text-neutral-300">
                    {currency}
                    {goalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="h-4 bg-neutral-800 rounded-full overflow-hidden mb-3"
                role="progressbar"
                aria-valuenow={raisedAmount}
                aria-valuemin={0}
                aria-valuemax={goalAmount}
                aria-label={`募資進度: ${currency}${raisedAmount.toLocaleString()} / ${currency}${goalAmount.toLocaleString()}`}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-400 font-semibold">
                  {progressPercent.toFixed(1)}% 達成
                </span>
                <span className="text-neutral-500">
                  還差 {currency}
                  {remaining.toLocaleString()}
                </span>
              </div>

              {/* Dev Reset Button */}
              {process.env.NODE_ENV !== 'production' && (
                <button
                  onClick={resetCampaign}
                  className="mt-4 text-xs text-neutral-600 hover:text-neutral-400 underline"
                >
                  [DEV] Reset Demo
                </button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tier Cards - 3 fixed tiers + 1 custom */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FUNDING_TIERS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TierCard tier={tier} onSelect={() => handleSelectTier(tier)} />
            </motion.div>
          ))}

          {/* Custom Tier Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <CustomTierCard
              onSelect={handleSelectCustom}
              minPrice={CUSTOM_TIER_CONFIG.minPrice}
            />
          </motion.div>
        </div>

        {/* Attendee Selection Modal */}
        {selectedTier && (
          <AttendeeSelectionModal
            isOpen={showAttendeeModal}
            onClose={handleCloseAttendeeModal}
            tierName={selectedTier.name}
            amount={selectedTier.amount}
            months={selectedTier.months}
            tierId={selectedTier.id}
            onConfirm={() => {}}
          />
        )}
      </div>
    </section>
  );
}

// ==========================================
// PLATFORM PREVIEW SECTION
// ==========================================

function PlatformPreviewSection() {
  return (
    <section className="py-20 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="info" className="mb-4">
            {PLATFORM_PREVIEW_CONTENT.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {PLATFORM_PREVIEW_CONTENT.headline}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {PLATFORM_PREVIEW_CONTENT.subheadline}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_MODULES.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={module.href}>
                <Card
                  hover
                  className={cn(
                    'h-full overflow-hidden group',
                    module.borderColor
                  )}
                >
                  <CardContent className="p-0">
                    {/* Header with gradient */}
                    <div className={cn('p-6 bg-gradient-to-br', module.color)}>
                      <div className="flex items-center justify-between">
                        <div className="group-hover:scale-110 transition-transform text-white/80">
                          <ModuleIcon title={module.title} />
                        </div>
                        <Badge variant="outline" size="sm">
                          Preview
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                          {module.title}
                        </h3>
                      </div>
                      <p className="text-neutral-400 text-sm mb-2">
                        {module.subtitle}
                      </p>
                      <p className="text-neutral-500 text-sm">
                        {module.description}
                      </p>
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

// ==========================================
// FAQ SECTION
// ==========================================

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-800 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-white font-medium pr-4">{question}</span>
        <ChevronDownIcon
          size="md"
          className={cn(
            'text-neutral-400 transition-transform flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-neutral-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {FAQ_CONTENT.headline}
          </h2>
          <p className="text-neutral-400 text-lg">{FAQ_CONTENT.subheadline}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardContent className="p-6">
              {FAQ_ITEMS.map((faq) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// FINAL CTA SECTION
// ==========================================

function FinalCTASection({ onScrollToTiers }: { onScrollToTiers: () => void }) {
  return (
    <section className="py-20 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {FINAL_CTA_CONTENT.headline}
            <br />
            <span className="text-primary-400">
              {FINAL_CTA_CONTENT.headlineHighlight}
            </span>
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            {FINAL_CTA_CONTENT.subheadline}
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="lg"
              className="text-lg px-10 py-5 h-auto"
              onClick={onScrollToTiers}
            >
              {FINAL_CTA_CONTENT.primaryCta}
              <ArrowRightIcon size="md" className="ml-2" />
            </Button>
          </motion.div>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {FINAL_CTA_CONTENT.trustPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-2 text-neutral-400 text-sm"
              >
                <CheckCircleIcon size="sm" className="text-green-500" />
                {point}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================

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
