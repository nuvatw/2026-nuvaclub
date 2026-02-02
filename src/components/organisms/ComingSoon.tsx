'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/atoms/Button';
import { useHomeContent } from '@/features/home';
import { SparklesIcon, ArrowLeftIcon, UserIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

const LAUNCH_DATE = '2026-07-01T00:00:00+08:00';

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

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.clip();

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

            ctx.globalCompositeOperation = 'soft-light';
            const blob1X = centerX + Math.sin(time * 1.8) * 60;
            const blob1Y = centerY + Math.cos(time * 1.4) * 50;
            const gradient1 = ctx.createRadialGradient(blob1X, blob1Y, 0, blob1X, blob1Y, radius * 0.8);
            gradient1.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            gradient1.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
            gradient1.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient1;
            ctx.fillRect(0, 0, size, size);

            ctx.restore();
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
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

// Animated number component - box is static, only numbers animate
function AnimatedDigit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36 bg-neutral-900/80 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden backdrop-blur-xl">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 60, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold text-white tabular-nums"
                    >
                        {String(value).padStart(2, '0')}
                    </motion.span>
                </AnimatePresence>
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent z-10" />
            </div>
            <span className="mt-3 text-xs sm:text-sm text-neutral-400 font-medium">{label}</span>
        </div>
    );
}

// Membership Card Component
function MembershipCard({ member, onSearch }: { member: any; onSearch: (email: string) => Promise<void> }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    const handleCheckEmail = async () => {
        if (!email.trim()) return;
        setError('');
        setIsChecking(true);
        try {
            await onSearch(email);
        } catch (err: any) {
            setError(err.message || '查詢失敗');
        } finally {
            setIsChecking(false);
        }
    };

    if (!member) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl overflow-hidden min-h-[500px] flex flex-col w-full max-w-sm mx-auto"
                style={{
                    background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
            >
                <div className="relative p-8 text-center flex-1 flex flex-col">
                    <div className="flex justify-center mb-6">
                        <img src="/white%20nuva%20logo.png" alt="nuva" className="h-7 w-auto opacity-90" />
                    </div>
                    <p className="text-neutral-500 text-[10px] tracking-[0.3em] uppercase mb-8">Membership</p>

                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-inner">
                            <UserIcon size="lg" className="text-neutral-600 w-10 h-10" />
                        </div>
                    </div>

                    <p className="text-neutral-500 text-xs tracking-wider uppercase mb-1">訪客模式</p>
                    <p className="text-white text-2xl font-semibold mb-8">尚未加入</p>

                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-px bg-neutral-800" />
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                            <div className="w-12 h-px bg-neutral-800" />
                        </div>
                    </div>

                    <div className="flex-1" />

                    <Link href="/" passHref>
                        <Button className="w-full mb-6 py-6 text-base font-medium">加入計劃</Button>
                    </Link>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-800" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-[#0d0d0d] text-neutral-500 font-medium">已是贊助者？</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="輸入您的贊助信箱"
                            className={cn(
                                'w-full px-4 py-3 bg-neutral-900/50 border rounded-xl text-white text-sm backdrop-blur-sm transition-all',
                                error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-neutral-800 focus:border-primary-500/50 focus:ring-primary-500/20'
                            )}
                            onKeyDown={(e) => e.key === 'Enter' && handleCheckEmail()}
                        />
                        {error && <p className="text-red-400 text-[11px] font-medium transition-all">{error}</p>}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full py-3 border-neutral-800 hover:bg-neutral-800 transition-colors"
                            onClick={handleCheckEmail}
                            disabled={isChecking || !email.trim()}
                        >
                            {isChecking ? '查詢中...' : '查看我的會員卡'}
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl overflow-hidden min-h-[500px] flex flex-col w-full max-w-sm mx-auto"
            style={{
                background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
        >
            <div className="relative p-8 flex-1 flex flex-col">
                <div className="flex justify-center mb-6">
                    <img src="/white%20nuva%20logo.png" alt="nuva" className="h-7 w-auto opacity-90" />
                </div>
                <div className="text-center mb-6">
                    <p className="text-neutral-500 text-[10px] tracking-[0.3em] uppercase">Membership</p>
                </div>

                <div className="flex justify-center mb-8">
                    <PremiumGradientOrb />
                </div>

                <div className="text-center mb-6">
                    <p className="text-neutral-500 text-[10px] tracking-widest uppercase mb-1 font-medium">Early Backer</p>
                    <p className="text-white text-2xl font-bold tracking-tight">{member.name}</p>
                </div>

                <div className="text-center mb-8">
                    <p className="text-neutral-600 text-[10px] tracking-widest uppercase mb-1 font-medium">Member No.</p>
                    <p className="text-4xl font-black text-white tracking-widest">
                        #{String(member.backerNumber).padStart(4, '0')}
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-px bg-neutral-800" />
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                        <div className="w-12 h-px bg-neutral-800" />
                    </div>
                </div>

                <div className="flex-1" />

                <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                        <span className="text-neutral-500 text-xs">方案</span>
                        <span className="text-white">{member.tierName}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                        <span className="text-neutral-500 text-xs">獲得期限</span>
                        <span className="text-white">{member.months} 個月</span>
                    </div>
                </div>

                <div className="mt-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-neutral-500 hover:text-white"
                        onClick={() => onSearch('')} // Clear search
                    >
                        查詢其他信箱
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

export function ComingSoon() {
    const content = useHomeContent();
    const CONTENT = (content as any).comingSoon || {
        headline: 'nuvaClub 即將啟程',
        subheadline: '2026 年 7 月 1 日，與你一起開啟 AI 學習新紀元',
        backToHome: 'Back to Home',
        badge: '正式上線倒數',
        footerDate: '預定上線日期：2026/07/01'
    };

    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    const [foundMember, setFoundMember] = useState<any>(null);

    useEffect(() => {
        const target = new Date(LAUNCH_DATE).getTime();
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = target - now;
            if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            };
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSearch = async (email: string) => {
        if (!email) {
            setFoundMember(null);
            return;
        }

        try {
            const res = await fetch(`/api/bff/membership/find-by-email?email=${encodeURIComponent(email)}`);
            const data = await res.json();

            if (data.found) {
                setFoundMember(data.member);
            } else {
                throw new Error('此信箱尚未註冊為贊助者');
            }
        } catch (err: any) {
            throw err;
        }
    };

    const isLaunched = timeLeft && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center p-6 sm:p-12 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[140px]"
                />
            </div>

            <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-16 lg:gap-24 items-center justify-center min-h-[80vh]">

                {/* Left Side: Countdown */}
                <div className="w-full lg:max-w-2xl text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 mb-8 backdrop-blur-md shadow-lg shadow-primary-500/5"
                    >
                        <SparklesIcon size="sm" className="text-primary-400" />
                        <span className="text-primary-400 text-sm font-medium tracking-wide uppercase">{CONTENT.badge}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
                    >
                        {CONTENT.headline}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-400 text-lg sm:text-2xl font-light mb-12 sm:mb-16 leading-relaxed"
                    >
                        {CONTENT.subheadline}
                    </motion.p>

                    {timeLeft && !isLaunched ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-center lg:justify-start items-center gap-3 sm:gap-4 md:gap-5 mb-12"
                        >
                            <AnimatedDigit value={timeLeft.days} label="天" />
                            <div className="text-2xl md:text-4xl text-neutral-800 font-light self-start mt-8 md:mt-12">:</div>
                            <AnimatedDigit value={timeLeft.hours} label="時" />
                            <div className="text-2xl md:text-4xl text-neutral-800 font-light self-start mt-8 md:mt-12">:</div>
                            <AnimatedDigit value={timeLeft.minutes} label="分" />
                            <div className="text-2xl md:text-4xl text-neutral-800 font-light self-start mt-8 md:mt-12">:</div>
                            <AnimatedDigit value={timeLeft.seconds} label="秒" />
                        </motion.div>
                    ) : isLaunched ? (
                        <div className="text-2xl font-bold text-primary-400 mb-12">已經正式上線！</div>
                    ) : (
                        <div className="h-44 mb-12" />
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 border-t border-neutral-900 pt-10"
                    >
                        <Link href="/" passHref>
                            <Button variant="outline" size="lg" className="px-8 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all rounded-full">
                                <ArrowLeftIcon size="sm" className="mr-2" />
                                {CONTENT.backToHome}
                            </Button>
                        </Link>
                        <div className="text-neutral-500 text-sm tracking-widest font-medium">
                            {CONTENT.footerDate}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Membership Search */}
                <div className="w-full max-w-sm">
                    <MembershipCard member={foundMember} onSearch={handleSearch} />
                </div>
            </div>

            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        </div>
    );
}
