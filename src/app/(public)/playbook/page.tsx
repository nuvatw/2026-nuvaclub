'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Button, Badge } from '@/components/atoms';
import { cn } from '@/lib/utils';
import {
  LockIcon,
  BookOpenIcon,
  CalendarIcon,
  TagIcon,
  SparklesIcon,
  UserIcon,
} from '@/components/icons';
import {
  AUTHORIZED_EMAILS,
  PLAYBOOK_LOGS,
  PLAYBOOK_CONTENT,
  getMemberByEmail,
  type PlaybookLogEntry,
  type PlaybookMember,
} from '@/content/playbook-content';

// Launch date
const LAUNCH_DATE = '2026-07-01T00:00:00+08:00';

// Format date for month header
function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
  });
}

// Get month key for grouping
function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Premium Gradient Orb Component - smooth blue gradient animation
function PremiumGradientOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    let time = 0;

    const animate = () => {
      time += 0.03;

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 4;

      ctx.clearRect(0, 0, size, size);

      // Create smooth gradient blobs using radial gradients
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Base gradient - light blue to white
      const baseGradient = ctx.createRadialGradient(
        centerX + Math.sin(time * 1.2) * 50,
        centerY + Math.cos(time * 1.5) * 40,
        0,
        centerX,
        centerY,
        radius
      );
      baseGradient.addColorStop(0, '#ffffff');
      baseGradient.addColorStop(0.3, '#e0f2ff');
      baseGradient.addColorStop(0.6, '#87CEEB');
      baseGradient.addColorStop(1, '#4A90D9');
      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, size, size);

      // Overlay gradient blob 1 - moving white highlight
      ctx.globalCompositeOperation = 'soft-light';
      const blob1X = centerX + Math.sin(time * 1.8) * 60;
      const blob1Y = centerY + Math.cos(time * 1.4) * 50;
      const gradient1 = ctx.createRadialGradient(blob1X, blob1Y, 0, blob1X, blob1Y, radius * 0.8);
      gradient1.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      gradient1.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
      gradient1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, size, size);

      // Overlay gradient blob 2 - deep blue accent
      ctx.globalCompositeOperation = 'multiply';
      const blob2X = centerX + Math.cos(time * 1.3) * 70;
      const blob2Y = centerY + Math.sin(time * 2.0) * 55;
      const gradient2 = ctx.createRadialGradient(blob2X, blob2Y, 0, blob2X, blob2Y, radius * 0.9);
      gradient2.addColorStop(0, 'rgba(30, 144, 255, 0.5)');
      gradient2.addColorStop(0.5, 'rgba(65, 105, 225, 0.3)');
      gradient2.addColorStop(1, 'rgba(100, 149, 237, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, size, size);

      // Third blob - lighter accent
      ctx.globalCompositeOperation = 'screen';
      const blob3X = centerX + Math.sin(time * 2.2 + 2) * 55;
      const blob3Y = centerY + Math.cos(time * 1.6 + 1) * 60;
      const gradient3 = ctx.createRadialGradient(blob3X, blob3Y, 0, blob3X, blob3Y, radius * 0.6);
      gradient3.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      gradient3.addColorStop(0.5, 'rgba(135, 206, 235, 0.3)');
      gradient3.addColorStop(1, 'rgba(135, 206, 235, 0)');
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, size, size);

      ctx.restore();

      // Subtle outer glow
      ctx.globalCompositeOperation = 'source-over';
      const glowGradient = ctx.createRadialGradient(centerX, centerY, radius - 10, centerX, centerY, radius + 5);
      glowGradient.addColorStop(0, 'rgba(135, 206, 235, 0)');
      glowGradient.addColorStop(0.8, 'rgba(135, 206, 235, 0.1)');
      glowGradient.addColorStop(1, 'rgba(135, 206, 235, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
      ctx.fill();

      // Subtle inner highlight for 3D effect
      const highlightGradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      highlightGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-24 h-24">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ borderRadius: '50%' }}
      />
    </div>
  );
}

// Membership Card Component
function MembershipCard({
  member,
  isGuest,
  onMemberFound,
}: {
  member: PlaybookMember | null;
  isGuest: boolean;
  onMemberFound?: (member: PlaybookMember) => void;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckEmail = async () => {
    if (!email.trim()) return;

    setError('');
    setIsChecking(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const foundMember = getMemberByEmail(email);
    if (foundMember) {
      sessionStorage.setItem('playbook_email', email.toLowerCase().trim());
      sessionStorage.removeItem('playbook_guest');
      onMemberFound?.(foundMember);
    } else {
      setError('此信箱尚未註冊為贊助者');
    }

    setIsChecking(false);
  };

  if (isGuest && !member) {
    return (
      <div
        className="relative rounded-2xl overflow-hidden min-h-[500px] flex flex-col"
        style={{
          background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative p-6 text-center flex-1 flex flex-col">
          <div className="flex justify-center mb-4">
            <img src="/white%20nuva%20logo.png" alt="nuva" className="h-7 w-auto opacity-90" />
          </div>

          <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase mb-6">Membership</p>

          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
              <UserIcon size="lg" className="text-neutral-500 w-10 h-10" />
            </div>
          </div>

          <p className="text-neutral-500 text-xs tracking-wider uppercase mb-1">訪客模式</p>
          <p className="text-white text-xl font-medium mb-6">尚未加入</p>

          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-neutral-700" />
              <div className="w-2 h-2 rounded-full bg-neutral-700" />
              <div className="w-8 h-px bg-neutral-700" />
            </div>
          </div>

          <div className="flex-1" />

          <Link href="/">
            <Button className="w-full mb-4">加入計劃</Button>
          </Link>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#0d0d0d] text-neutral-500">已是贊助者？</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="輸入您的贊助信箱"
              className={cn(
                'w-full px-3 py-2.5 bg-neutral-900 border rounded-lg text-white text-sm',
                'placeholder-neutral-500 focus:outline-none focus:ring-1 transition-all',
                error
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-neutral-700 focus:border-primary-500 focus:ring-primary-500/50'
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCheckEmail();
                }
              }}
            />
            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleCheckEmail}
              disabled={isChecking || !email.trim()}
            >
              {isChecking ? '查詢中...' : '查看我的會員卡'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!member) return null;

  const handleShareToInstagram = () => {
    window.open('https://www.instagram.com/', '_blank');
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden min-h-[500px] flex flex-col"
      style={{
        background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Instagram Share Button */}
      <button
        onClick={handleShareToInstagram}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition-colors group"
        aria-label="分享到 Instagram"
      >
        <svg
          className="w-5 h-5 text-neutral-400 group-hover:text-pink-400 transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="relative p-6 flex-1 flex flex-col">
        <div className="flex justify-center mb-4">
          <img src="/white%20nuva%20logo.png" alt="nuva" className="h-7 w-auto opacity-90" />
        </div>

        <div className="text-center mb-4">
          <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase">Membership</p>
        </div>

        <div className="flex justify-center mb-6">
          <PremiumGradientOrb />
        </div>

        <div className="text-center mb-4">
          <p className="text-neutral-500 text-xs tracking-wider uppercase mb-1">Early Backer</p>
          <p className="text-white text-xl font-medium tracking-wide">{member.name}</p>
        </div>

        <div className="text-center mb-6">
          <p className="text-neutral-600 text-xs tracking-wider uppercase mb-1">Member No.</p>
          <p className="text-3xl font-bold text-white tracking-widest">
            #{String(member.backerNumber).padStart(4, '0')}
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-neutral-700" />
            <div className="w-2 h-2 rounded-full bg-neutral-700" />
            <div className="w-8 h-px bg-neutral-700" />
          </div>
        </div>

        <div className="flex-1" />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">方案</span>
            <span className="text-white">{member.tierName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">會員期限</span>
            <span className="text-white">{member.months} 個月</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated number component - box is static, only numbers animate
function AnimatedDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700 shadow-lg overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-white tabular-nums"
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent z-10" />
      </div>
      <span className="mt-1.5 text-xs text-neutral-400 font-medium">{label}</span>
    </div>
  );
}

// Countdown Section
function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const target = new Date(LAUNCH_DATE).getTime();

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

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isLaunched = timeLeft && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-6 md:p-8 border border-neutral-700 bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-60 h-60 bg-primary-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 mb-3"
          >
            <SparklesIcon size="sm" className="text-primary-400" />
            <span className="text-primary-400 text-xs font-medium">正式上線倒數</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-bold text-white mb-2"
          >
            nuvaClub 即將啟程
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-neutral-400 text-sm"
          >
            2026 年 7 月 1 日，與你一起開啟 AI 學習新紀元
          </motion.p>
        </div>

        {timeLeft && !isLaunched ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center gap-1.5 sm:gap-2 md:gap-4"
          >
            <AnimatedDigit value={timeLeft.days} label="天" />
            <div className="text-xl md:text-2xl text-neutral-600 font-light self-start mt-4 md:mt-6">:</div>
            <AnimatedDigit value={timeLeft.hours} label="時" />
            <div className="text-xl md:text-2xl text-neutral-600 font-light self-start mt-4 md:mt-6">:</div>
            <AnimatedDigit value={timeLeft.minutes} label="分" />
            <div className="text-xl md:text-2xl text-neutral-600 font-light self-start mt-4 md:mt-6">:</div>
            <AnimatedDigit value={timeLeft.seconds} label="秒" />
          </motion.div>
        ) : isLaunched ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <span className="text-2xl md:text-3xl font-bold text-primary-400">正式上線！</span>
          </motion.div>
        ) : (
          <div className="flex justify-center items-center gap-3 h-24">
            <div className="w-16 h-20 bg-neutral-800 rounded-xl animate-pulse" />
            <div className="w-16 h-20 bg-neutral-800 rounded-xl animate-pulse" />
            <div className="w-16 h-20 bg-neutral-800 rounded-xl animate-pulse" />
            <div className="w-16 h-20 bg-neutral-800 rounded-xl animate-pulse" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <span className="text-neutral-500 text-xs">預定上線日期：2026/07/01</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Month Header Component
function MonthHeader({ monthKey }: { monthKey: string }) {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  const formatted = formatMonthYear(date);

  return (
    <div className="py-3 border-b border-neutral-800">
      <h3 className="text-base font-semibold text-white">{formatted}</h3>
    </div>
  );
}

// Log Entry Row Component
function LogEntryRow({ entry, index }: { entry: PlaybookLogEntry; index: number }) {
  const dayNumber = entry.date.getDate();
  const dayOfWeek = entry.date.toLocaleDateString('zh-TW', { weekday: 'short' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="py-4 border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors -mx-4 px-4"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 text-center">
          <div className="text-xs text-neutral-500 uppercase">{dayOfWeek}</div>
          <div className="text-xl font-bold text-white">{dayNumber}</div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-base mb-1">{entry.title}</h4>
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="outline" size="sm" className="text-xs">
                  <TagIcon size="sm" className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-neutral-400 text-sm leading-relaxed">{entry.content}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Login Form Component
function LoginForm({
  onLogin,
  onGuestLogin,
}: {
  onLogin: (email: string) => void;
  onGuestLogin: () => void;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const normalizedEmail = email.toLowerCase().trim();
    const isAuthorized = AUTHORIZED_EMAILS.some(
      (authorizedEmail) => authorizedEmail.toLowerCase() === normalizedEmail
    );

    if (isAuthorized) {
      sessionStorage.setItem('playbook_email', normalizedEmail);
      onLogin(normalizedEmail);
    } else {
      setError(PLAYBOOK_CONTENT.errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl p-8 border border-neutral-700 bg-neutral-800/50">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 border border-primary-500/30 flex items-center justify-center">
              <LockIcon size="lg" className="text-primary-400" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {PLAYBOOK_CONTENT.loginTitle}
            </h1>
            <p className="text-neutral-400">{PLAYBOOK_CONTENT.loginSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={PLAYBOOK_CONTENT.emailPlaceholder}
                required
                className={cn(
                  'w-full px-4 py-3 bg-neutral-900 border rounded-lg text-white',
                  'placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all',
                  error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-neutral-700 focus:border-primary-500 focus:ring-primary-500/50'
                )}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-sm mt-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !email.trim()}>
              {isLoading ? '驗證中...' : PLAYBOOK_CONTENT.loginButton}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-800/50 text-neutral-500">或</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={onGuestLogin}>
            {PLAYBOOK_CONTENT.guestButton}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Logs Section Component
function LogsSection() {
  const sortedLogs = useMemo(() => {
    return [...PLAYBOOK_LOGS].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, []);

  const logsWithMonthHeaders = useMemo(() => {
    const result: { type: 'header' | 'log'; data: string | PlaybookLogEntry }[] = [];
    let lastMonthKey = '';

    sortedLogs.forEach((log) => {
      const monthKey = getMonthKey(log.date);
      if (monthKey !== lastMonthKey) {
        result.push({ type: 'header', data: monthKey });
        lastMonthKey = monthKey;
      }
      result.push({ type: 'log', data: log });
    });

    return result;
  }, [sortedLogs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl p-6 border border-neutral-700 bg-neutral-800/30"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/30 flex items-center justify-center">
          <BookOpenIcon size="sm" className="text-primary-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{PLAYBOOK_CONTENT.title}</h2>
          <p className="text-neutral-400 text-xs">{PLAYBOOK_CONTENT.subtitle}</p>
        </div>
      </div>

      <p className="text-neutral-400 text-sm mb-4">{PLAYBOOK_CONTENT.description}</p>

      <div className="mb-3 text-sm text-neutral-500 flex items-center gap-2">
        <CalendarIcon size="sm" className="w-4 h-4" />
        共 {sortedLogs.length} 則更新紀錄
      </div>

      {sortedLogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-400">{PLAYBOOK_CONTENT.emptyState}</p>
        </div>
      ) : (
        <div>
          {logsWithMonthHeaders.map((item, index) =>
            item.type === 'header' ? (
              <MonthHeader key={`header-${item.data}`} monthKey={item.data as string} />
            ) : (
              <LogEntryRow
                key={(item.data as PlaybookLogEntry).id}
                entry={item.data as PlaybookLogEntry}
                index={index}
              />
            )
          )}
        </div>
      )}
    </motion.div>
  );
}

// Main Playbook Content Component
function PlaybookContent({
  member,
  isGuest,
  onMemberFound,
}: {
  member: PlaybookMember | null;
  isGuest: boolean;
  onMemberFound: (member: PlaybookMember) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      {/* Left Sidebar - Membership Card */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <MembershipCard member={member} isGuest={isGuest} onMemberFound={onMemberFound} />
      </div>

      {/* Right Content */}
      <div className="space-y-6">
        <CountdownSection />
        <LogsSection />
      </div>
    </div>
  );
}

export default function PlaybookPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [member, setMember] = useState<PlaybookMember | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('playbook_email');
      const guestMode = sessionStorage.getItem('playbook_guest');

      if (guestMode === 'true') {
        setIsAuthenticated(true);
        setIsGuest(true);
      } else if (storedEmail) {
        const foundMember = getMemberByEmail(storedEmail);
        if (foundMember) {
          setIsAuthenticated(true);
          setMember(foundMember);
        }
      }
    }
  }, []);

  const handleLogin = (email: string) => {
    const foundMember = getMemberByEmail(email);
    setMember(foundMember);
    setIsGuest(false);
    setIsAuthenticated(true);
  };

  const handleGuestLogin = () => {
    sessionStorage.setItem('playbook_guest', 'true');
    setIsGuest(true);
    setIsAuthenticated(true);
  };

  const handleMemberFound = (foundMember: PlaybookMember) => {
    setMember(foundMember);
    setIsGuest(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginForm onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PlaybookContent member={member} isGuest={isGuest} onMemberFound={handleMemberFound} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
