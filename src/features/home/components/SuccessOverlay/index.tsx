'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/atoms';
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useHomeContent } from '../../hooks/useHomeContent';
import { FlowingGradientOrb } from './FlowingGradientOrb';
import { ConfettiEffect } from './ConfettiEffect';
import { InstagramIcon, LineIcon, DownloadIcon } from './SocialIcons';

export interface PledgeSuccessInfo {
  amount: number;
  tierName: string;
  months: number;
  attendeeCount: number;
  backerNumber: number;
  purchaserName: string;
  participantNames?: string[];
}

interface SuccessOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  pledgeInfo: PledgeSuccessInfo | null;
  previousRaised: number;
  goalAmount: number;
  currency: string;
}

export function SuccessOverlay({
  isOpen,
  onClose,
  pledgeInfo,
  previousRaised,
  goalAmount,
  currency,
}: SuccessOverlayProps) {
  const content = useHomeContent();
  const CELEBRATION_CONTENT = (content as any).celebration;
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
    ctx.fillText(CELEBRATION_CONTENT.membershipLabel, baseWidth / 2, cardY + 75);

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
    ctx.fillText(CELEBRATION_CONTENT.earlyBackerLabel, baseWidth / 2, cardY + 248);

    // Draw name
    ctx.fillStyle = '#ffffff';
    ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(participantName || 'Member', baseWidth / 2, cardY + 280);

    // Draw "MEMBER NO." text
    ctx.fillStyle = '#4a4a4a';
    ctx.font = '600 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(CELEBRATION_CONTENT.memberNoLabel, baseWidth / 2, cardY + 325);

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

  // Check if running on iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
          const fileName = `nuvaclub-member-${memberNumber}-${name.replace(/\s+/g, '-')}.png`;

          // Try Web Share API first (works well on mobile)
          if (navigator.share && navigator.canShare) {
            const file = new File([blob], fileName, { type: 'image/png' });
            const shareData = { files: [file] };

            if (navigator.canShare(shareData)) {
              try {
                await navigator.share(shareData);
                continue; // Successfully shared, move to next card
              } catch {
                // User cancelled or share failed, fallback to download
                console.log('Share cancelled or failed, trying download');
              }
            }
          }

          // Fallback: For iOS, open in new tab (user can long-press to save)
          // For other browsers, use download link
          const url = URL.createObjectURL(blob);

          if (isIOS()) {
            // On iOS, open image in new tab for manual save
            const newWindow = window.open(url, '_blank');
            if (!newWindow) {
              // Popup blocked, show alert with instructions
              alert(CELEBRATION_CONTENT.iosSaveNote);
              // Create a temporary image display
              const img = document.createElement('img');
              img.src = url;
              img.style.cssText = 'max-width:100%;position:fixed;top:0;left:0;z-index:9999;background:black;padding:20px;';
              img.onclick = () => {
                document.body.removeChild(img);
                URL.revokeObjectURL(url);
              };
              document.body.appendChild(img);
            } else {
              // Cleanup after a delay
              setTimeout(() => URL.revokeObjectURL(url), 60000);
            }
          } else {
            // Standard download for desktop browsers
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }

          // Small delay between downloads to prevent browser blocking
          if (i < names.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }

      setIsDownloading(false);
    } catch (error) {
      console.error('Image download failed:', error);
      alert(CELEBRATION_CONTENT.downloadFailed);
      setIsDownloading(false);
    }
  };

  const handleShare = (platform: string) => {
    const shareUrl = window.location.origin;
    const shareText = CELEBRATION_CONTENT.shareText.replace('{number}', pledgeInfo.backerNumber.toString());

    if (platform === 'line') {
      window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'instagram') {
      // Open Instagram app or website
      window.open('https://www.instagram.com/', '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert(CELEBRATION_CONTENT.copySuccess);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
        >
          {/* Confetti with proper fade-out and cleanup */}
          <ConfettiEffect />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative z-10 w-full max-w-md mx-auto py-4 md:my-8"
          >
            {/* Thank you message */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">{CELEBRATION_CONTENT.title}</h2>
              <p className="text-neutral-400">{CELEBRATION_CONTENT.subtitle}</p>
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
                      <p className="text-neutral-500 text-xs tracking-wider uppercase mb-1">{CELEBRATION_CONTENT.earlyBackerLabel}</p>
                      <p className="text-white text-xl font-medium tracking-wide">
                        {participantNames[currentCardIndex] || 'Member'}
                      </p>
                    </div>

                    {/* Backer Number - Increments for each participant */}
                    <div className="text-center mb-6">
                      <p className="text-neutral-600 text-xs tracking-wider uppercase mb-1">{CELEBRATION_CONTENT.memberNoLabel}</p>
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
                    aria-label={CELEBRATION_CONTENT.prevCard}
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
                        aria-label={CELEBRATION_CONTENT.cardAria.replace('{index}', (index + 1).toString())}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentCardIndex(prev => Math.min(totalCards - 1, prev + 1))}
                    disabled={currentCardIndex === totalCards - 1}
                    className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label={CELEBRATION_CONTENT.nextCard}
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
                    ? CELEBRATION_CONTENT.downloading
                    : pledgeInfo.attendeeCount > 1
                      ? CELEBRATION_CONTENT.downloadCardsPlural.replace('{count}', pledgeInfo.attendeeCount.toString())
                      : CELEBRATION_CONTENT.downloadCards
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
                  <span className="text-sm text-neutral-300">
                    {CELEBRATION_CONTENT.shareButtons?.find((b: { id: string; label: string }) => b.id === 'copy')?.label || '複製'}
                  </span>
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
