'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerStore } from '@/store/customer-store';
import {
  Star,
  Volume2,
  VolumeX,
  X,
  Clock,
  ChevronLeft,
  Scissors,
  Coffee,
  Ticket,
  Heart,
  Store,
  Monitor,
  Compass,
  ArrowRight,
  Gift,
  Trophy,
  Zap,
  RotateCcw,
  BadgeCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

/* ─── TYPES & THEMES ─── */

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

type Prize = {
  title: string;
  value: string;
  type: 'coupon' | 'voucher' | 'product' | 'exclusive' | 'discount' | 'appointment';
  rarity: Rarity;
  details: string;
};

type Campaign = {
  id: string;
  businessName: string;
  businessCategory: string;
  theme: 'fashion' | 'tech' | 'food' | 'barber' | 'beauty' | 'event' | 'mall';
  boxCount: 2 | 4 | 6 | 8;
  description: string;
  prizes: Prize[];
  logo?: any;
};

const THEMES = {
  fashion: { accent: '#f97316', icon: Store, bgImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80' },
  tech: { accent: '#06b6d4', icon: Monitor, bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80' },
  food: { accent: '#f43f5e', icon: Coffee, bgImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80' },
  barber: { accent: '#8b5cf6', icon: Scissors, bgImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80' },
  beauty: { accent: '#ec4899', icon: Heart, bgImage: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80' },
  event: { accent: '#eab308', icon: Ticket, bgImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80' },
  mall: { accent: '#10b981', icon: Compass, bgImage: 'https://images.unsplash.com/photo-1519567241046-7f5f4399e098?auto=format&fit=crop&q=80' }
};

const BOX_COLORS = [
  'from-red-600 to-red-800',       // Red
  'from-purple-600 to-purple-800', // Purple
  'from-blue-600 to-blue-800',     // Blue
  'from-green-600 to-green-800',   // Green
  'from-orange-600 to-orange-800', // Orange
  'from-pink-600 to-pink-800',     // Pink
  'from-teal-600 to-teal-800',     // Teal
  'from-yellow-500 to-yellow-700', // Gold
];

const MOCK_LIVE_ACTIVITIES = [
  { name: 'Jaden M.', won: 'Free Haircut', time: 'Just won!', avatar: 'https://i.pravatar.cc/100?img=11' },
  { name: 'Sophia L.', won: '£50 Gift Card', time: '2 sec ago', avatar: 'https://i.pravatar.cc/100?img=5' },
  { name: 'Michael T.', won: '20% Discount', time: '5 sec ago', avatar: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Emma R.', won: 'Beard Care Kit', time: '8 sec ago', avatar: 'https://i.pravatar.cc/100?img=9' },
  { name: 'Alex K.', won: 'VIP Treatment', time: '12 sec ago', avatar: 'https://i.pravatar.cc/100?img=15' },
];

const ACTIVE_CAMPAIGNS: Campaign[] = [
  {
    id: 'toby-barbers',
    businessName: 'TOBY BARBERS',
    businessCategory: 'Premium Barbering',
    theme: 'barber',
    boxCount: 8,
    description: 'Fresh Cuts. Fresh Confidence.',
    prizes: [
      { title: 'Free Haircut', value: '100% OFF', type: 'appointment', rarity: 'legendary', details: 'Full signature haircut and styling.' },
      { title: '20% Discount', value: 'ALL SERVICES', type: 'discount', rarity: 'common', details: 'Apply on any walk-in service.' },
      { title: '£50 Gift Card', value: 'STORE CREDIT', type: 'voucher', rarity: 'epic', details: 'Spend on premium pomades and kits.' },
      { title: 'Beard Care Kit', value: 'PREMIUM SET', type: 'product', rarity: 'rare', details: 'Oils, balms, and wooden comb set.' },
      { title: 'VIP Treatment', value: 'FULL SERVICE', type: 'exclusive', rarity: 'legendary', details: 'Hot towel shave, cut, and facial.' },
      { title: 'Youth Special', value: '30% OFF', type: 'discount', rarity: 'common', details: 'Valid for anyone under 18.' },
      { title: 'Hair Products', value: 'PREMIUM', type: 'product', rarity: 'rare', details: 'Choose any product from the shelf.' },
      { title: 'Mystery Box', value: 'SURPRISE GIFT', type: 'exclusive', rarity: 'epic', details: 'A surprise bundle worth over £40.' },
    ]
  }
];

/* ─── PLINKO PHYSICS COMPONENT ─── */

const ArcadePlinkoBoard = ({
  activeGame,
  onWin,
  playSound,
  dropTrigger,
  onStateChange
}: {
  activeGame: Campaign,
  onWin: (prizeIndex: number) => void,
  playSound: (type: any) => void,
  dropTrigger: number,
  onStateChange: (state: 'sweeping' | 'dropping' | 'landed') => void
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [gameState, setGameState] = useState<'sweeping' | 'dropping' | 'landed'>('sweeping');

  useEffect(() => {
    if (onStateChange) onStateChange(gameState);
  }, [gameState, onStateChange]);

  useEffect(() => {
    if (dropTrigger > 0 && gameState === 'sweeping') {
      physics.current.ball.isDropping = true;
      playSound('suspense');
      setGameState('dropping');
    }
  }, [dropTrigger]);
  
  const physics = useRef({
    width: 0,
    height: 0,
    ball: { x: 0, y: 30, vx: 0, vy: 0, radius: 10, isDropping: false },
    pegs: [] as {x: number, y: number, radius: number, flash: number}[],
    bins: [] as {x: number, width: number, prizeIndex: number}[],
    sweepDirection: 1,
    sweepSpeed: 6,
    settleTimer: 0
  });

  useEffect(() => {
    const p = physics.current;
    if (!containerRef.current || !canvasRef.current) return;
    
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    canvasRef.current.width = w;
    canvasRef.current.height = h;
    p.width = w;
    p.height = h;

    // Generate Pegs
    p.pegs = [];
    const rows = 10;
    const cols = 7;
    const startY = 90;
    const endY = h - 120;
    const spacingX = w / cols;
    const spacingY = (endY - startY) / rows;
    
    for (let r = 0; r < rows; r++) {
      const isOffset = r % 2 !== 0;
      const cCount = isOffset ? cols - 1 : cols;
      const offset = isOffset ? spacingX : spacingX / 2;
      for (let c = 0; c < cCount; c++) {
        // Add random jitter to make the board unpredictable
        const jitterX = (Math.random() - 0.5) * (spacingX * 0.45);
        const jitterY = (Math.random() - 0.5) * (spacingY * 0.45);
        
        p.pegs.push({
          x: c * spacingX + offset + jitterX,
          y: startY + r * spacingY + jitterY,
          radius: 8,
          flash: 0
        });
      }
    }

    // Generate Bins
    p.bins = [];
    const binCount = activeGame.boxCount;
    const binW = w / binCount;
    for (let i = 0; i < binCount; i++) {
      p.bins.push({ x: i * binW, width: binW, prizeIndex: i });
    }

    const ballRadius = w < 500 ? 7 : 12;
    p.ball = { x: w / 2, y: 35, vx: 0, vy: 0, radius: ballRadius, isDropping: false };
    p.sweepDirection = 1;
    setGameState('sweeping');
  }, [activeGame]);

  useEffect(() => {
    let afId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const p = physics.current;

    const trail: {x: number, y: number, life: number}[] = [];

    const draw = () => {
      afId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, p.width, p.height);

      if (p.ball.isDropping) {
        p.ball.vy += 0.5; // Gravity
        p.ball.vy *= 0.99; // Drag
        p.ball.vx *= 0.98;
        if (p.ball.vy > 18) p.ball.vy = 18;

        p.ball.x += p.ball.vx;
        p.ball.y += p.ball.vy;

        // Trail emission
        if (Math.random() > 0.3) {
          trail.push({ x: p.ball.x, y: p.ball.y, life: 1.0 });
        }

        // Peg Collisions
        for (const peg of p.pegs) {
          peg.flash *= 0.85; 
          const dx = p.ball.x - peg.x;
          const dy = p.ball.y - peg.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = p.ball.radius + peg.radius;
          
          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;
            p.ball.x += nx * overlap;
            p.ball.y += ny * overlap;

            const dot = p.ball.vx * nx + p.ball.vy * ny;
            p.ball.vx = (p.ball.vx - 2 * dot * nx) * 0.6;
            p.ball.vy = (p.ball.vy - 2 * dot * ny) * 0.6;
            
            // Massive unpredictability injection!
            p.ball.vx += (Math.random() - 0.5) * 16; 
            p.ball.vy -= Math.random() * 5; // Slight upward kick for chaos and hangtime
            
            peg.flash = 1.0;
            playSound('click');
          }
        }

        // Walls
        if (p.ball.x < p.ball.radius) { p.ball.x = p.ball.radius; p.ball.vx *= -0.7; }
        if (p.ball.x > p.width - p.ball.radius) { p.ball.x = p.width - p.ball.radius; p.ball.vx *= -0.7; }

        // Bins / Settling
        if (p.ball.y > p.height - 20) {
          p.ball.y = p.height - 20;
          p.ball.vy *= -0.3;
          p.ball.vx *= 0.7;
          
          if (Math.abs(p.ball.vy) < 1.0 && Math.abs(p.ball.vx) < 1.0) {
            p.settleTimer++;
            if (p.settleTimer > 30 && gameState !== 'landed') {
              p.ball.isDropping = false;
              setGameState('landed');
              const bin = p.bins.find(b => p.ball.x >= b.x && p.ball.x < b.x + b.width);
              if (bin) onWin(bin.prizeIndex);
            }
          }
        }
      } else if (gameState === 'sweeping') {
        p.ball.x += p.sweepSpeed * p.sweepDirection;
        if (p.ball.x < p.ball.radius + 20 || p.ball.x > p.width - p.ball.radius - 20) {
          p.sweepDirection *= -1;
        }
      }

      // Draw Trail
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i];
        t.life -= 0.05;
        if (t.life <= 0) { trail.splice(i, 1); continue; }
        
        ctx.beginPath();
        ctx.arc(t.x, t.y, p.ball.radius * t.life * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${t.life * 0.6})`;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Top Sweeper Line
      if (gameState === 'sweeping') {
        ctx.beginPath();
        ctx.moveTo(20, 35);
        ctx.lineTo(p.width - 20, 35);
        ctx.strokeStyle = '#5b21b6';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Draw Pegs (Glowing White/Silver)
      for (const peg of p.pegs) {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        // Base gradient
        const g = ctx.createRadialGradient(peg.x - 2, peg.y - 2, 0, peg.x, peg.y, peg.radius);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(1, '#9ca3af');
        ctx.fillStyle = g;
        ctx.shadowColor = 'rgba(255,255,255,0.4)';
        ctx.shadowBlur = 8;
        ctx.fill();
        
        // Flash overlay when hit
        if (peg.flash > 0.05) {
          ctx.beginPath();
          ctx.arc(peg.x, peg.y, peg.radius + peg.flash * 10, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(250, 204, 21, ${peg.flash * 0.7})`; // Gold flash
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 20;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // Draw Bins / Guides
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      p.bins.forEach((bin, i) => {
        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(bin.x, p.height - 120);
          ctx.lineTo(bin.x, p.height);
          ctx.stroke();
        }

        // DRAW BOX DIRECTLY ON CANVAS (3D VERSION)
        const boxSize = Math.min(bin.width * 0.75, 55);
        const boxX = bin.x + (bin.width - boxSize) / 2;
        const boxY = p.height - boxSize - 25;
        
        // Dynamic colors from BOX_COLORS array
        const colorPair = BOX_COLORS[i % BOX_COLORS.length].replace('from-', '').replace('to-', '').split(' ');
        const mainColor = colorPair[0].replace(/-\d+$/, ''); // e.g., 'red'
        
        // Define color mapping for canvas (simplified version of the tailwind classes)
        const colors: Record<string, { light: string, dark: string }> = {
          red: { light: '#ef4444', dark: '#991b1b' },
          purple: { light: '#a855f7', dark: '#6b21a8' },
          blue: { light: '#3b82f6', dark: '#1e40af' },
          green: { light: '#22c55e', dark: '#166534' },
          orange: { light: '#f97316', dark: '#9a3412' },
          pink: { light: '#ec4899', dark: '#9d174d' },
          teal: { light: '#14b8a6', dark: '#115e59' },
          yellow: { light: '#eab308', dark: '#854d0e' }
        };

        const theme = colors[mainColor] || colors.yellow;
        
        // Box Body (3D Side)
        ctx.fillStyle = theme.dark;
        const radius = 6;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxSize, boxSize, radius);
        ctx.fill();

        // Box Top (3D perspective feel)
        const lidHeight = boxSize * 0.2;
        const boxG = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxSize);
        boxG.addColorStop(0, theme.light);
        boxG.addColorStop(1, theme.dark);
        ctx.fillStyle = boxG;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxSize, boxSize - 4, radius);
        ctx.fill();

        // Ribbon (Gold)
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        // Vertical Ribbon
        ctx.fillRect(boxX + boxSize/2 - 4, boxY, 8, boxSize - 4);
        // Horizontal Ribbon
        ctx.fillRect(boxX, boxY + boxSize/2 - 4, boxSize, 8);
        ctx.shadowBlur = 0;

        // Center Knot/Icon Area
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.roundRect(boxX + boxSize/2 - 8, boxY + boxSize/2 - 8, 16, 16, 4);
        ctx.fill();
        
        // Mini Gift Icon Symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎁', bin.x + bin.width/2, boxY + boxSize/2);
        
        // Draw "Mystery Box" text below box
        ctx.fillStyle = '#fbbf24';
        ctx.font = '900 7px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MYSTERY BOX', bin.x + bin.width/2, p.height - 12);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = 'bold 5px sans-serif';
        ctx.fillText('SURPRISE REWARD', bin.x + bin.width/2, p.height - 5);
      });

      // Draw Ball (Gold Coin)
      ctx.beginPath();
      ctx.arc(p.ball.x, p.ball.y, p.ball.radius, 0, Math.PI * 2);
      const bg = ctx.createRadialGradient(p.ball.x - 4, p.ball.y - 4, 0, p.ball.x, p.ball.y, p.ball.radius);
      bg.addColorStop(0, '#fef08a');
      bg.addColorStop(0.6, '#facc15');
      bg.addColorStop(1, '#ca8a04');
      ctx.fillStyle = bg;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner Star
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#a16207';
      ctx.fillText('★', p.ball.x, p.ball.y + 1);

    };

    afId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(afId);
  }, [activeGame, gameState, onWin, playSound]);

  const handleDrop = () => {
    if (gameState === 'sweeping') {
      physics.current.ball.isDropping = true;
      playSound('suspense');
      setGameState('dropping');
    }
  };

  return (
    <div className="flex flex-col items-center w-full relative h-full">
      
      {gameState === 'sweeping' && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-yellow-300 font-extrabold text-2xl drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] z-20 whitespace-nowrap">
          CLICK <span className="text-yellow-100">STOP</span> TO DROP THE COIN!
        </div>
      )}

      <div ref={containerRef} className="relative w-full flex-1 min-h-[450px]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none z-10" />
      </div>

    </div>
  );
};


/* ─── MAIN ARCADE PAGE ─── */

export default function ArcadeGamesPage() {
  const { profile, unlockReward, decrementSpins, addPoints } = useCustomerStore();

  const [activeGame, setActiveGame] = useState<Campaign | null>(null);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activityFeed, setActivityFeed] = useState(MOCK_LIVE_ACTIVITIES);
  const [showRewards, setShowRewards] = useState(false);
  
  const [plinkoState, setPlinkoState] = useState<'sweeping' | 'dropping' | 'landed'>('sweeping');
  const [dropTrigger, setDropTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Jaden M.', 'Sophia L.', 'Michael T.', 'Emma R.', 'Alex K.', 'David P.', 'Chloe S.'];
      const c = ACTIVE_CAMPAIGNS[0];
      const p = c.prizes[Math.floor(Math.random() * c.prizes.length)];
      setActivityFeed(prev => [{ 
        name: names[Math.floor(Math.random() * names.length)], 
        won: p.title, 
        time: 'Just won!',
        avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 50)}` 
      }, ...prev.slice(0, 4)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Default to null to show the home screen
  // useEffect(() => {
  //   setActiveGame(ACTIVE_CAMPAIGNS[0]);
  // }, []);

  const playSound = useCallback((type: 'click' | 'victory' | 'suspense') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (type === 'click') {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.setValueAtTime(800, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        o.start(); o.stop(ctx.currentTime + 0.05);
      } else if (type === 'suspense') {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination); o.type = 'sine';
        o.frequency.setValueAtTime(150, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(300, ctx.currentTime + 3.0);
        g.gain.setValueAtTime(0.15, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 3.0);
        o.start(); o.stop(ctx.currentTime + 3.0);
      } else if (type === 'victory') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination); o.type = 'triangle';
          o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
          g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 1);
          o.start(ctx.currentTime + i * 0.1);
          o.stop(ctx.currentTime + i * 0.1 + 1);
        });
      }
    } catch (e) { /* silent */ }
  }, [soundEnabled]);

  const fireVictoryConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ffeb3b', '#ff9800', '#f44336'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ffeb3b', '#ff9800', '#f44336'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }, []);

  const handlePlinkoWin = useCallback((prizeIndex: number) => {
    if (!activeGame) return;
    decrementSpins();
    addPoints(25);
    const prize = activeGame.prizes[prizeIndex % activeGame.prizes.length];
    setWonPrize(prize);
    playSound('victory');
    fireVictoryConfetti();
    unlockReward({
      title: prize.title,
      provider: activeGame.businessName,
      providerLogo: activeGame.businessName.substring(0, 2).toUpperCase(),
      type: prize.type,
      value: prize.value,
      details: prize.details
    });
    setTimeout(() => setShowVictoryModal(true), 800);
  }, [activeGame, decrementSpins, addPoints, playSound, fireVictoryConfetti, unlockReward]);

  const resetGame = () => {
    playSound('click');
    setWonPrize(null);
    setShowVictoryModal(false);
    // Hard remount of active game to reset canvas state
    setActiveGame(null);
    setTimeout(() => setActiveGame(ACTIVE_CAMPAIGNS[0]), 50);
  };

  if (!activeGame) {
    return (
      <div className="space-y-8">
        {/* Top Header with Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-white border border-[#eee] rounded-3xl p-6 shadow-sm text-left">
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Active Games</h1>
            <p className="text-[#888] text-sm">Discover and play reward campaigns from your favorite businesses.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search campaigns..." 
                className="pl-10 pr-4 py-2.5 bg-[#fafaf9] border border-[#eee] rounded-xl text-sm w-full md:w-64 focus:outline-none focus:border-[#f97316] transition-colors"
              />
              <svg className="w-4 h-4 text-[#888] absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories / Grid */}
        <div className="space-y-8 text-left">
          {/* Available Reward Games */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#f97316]" />
              <h2 className="text-lg font-display font-bold text-[#1a1a1a]">Available Reward Games</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ACTIVE_CAMPAIGNS.map(game => {
                const Icon = THEMES[game.theme as keyof typeof THEMES]?.icon || Store;
                return (
                  <div 
                    key={game.id} 
                    onClick={() => setActiveGame(game)} 
                    className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm hover:border-[#f97316] hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-[#f97316] transition-colors">
                        <Icon className="w-6 h-6 text-[#f97316] group-hover:text-white transition-colors" />
                      </div>
                      <span className="bg-stone-100 text-[#888] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {game.businessCategory}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-[#1a1a1a] mb-2">{game.businessName}</h3>
                    <p className="text-sm text-[#888] mb-6 flex-grow">{game.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-[#eee]">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-[#f97316]" />
                        <span className="text-xs font-bold text-[#f97316] uppercase tracking-widest">{game.boxCount} Boxes</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#888] group-hover:text-[#f97316] transition-colors">
                        <span className="text-xs font-bold uppercase tracking-wider">Play Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Placeholders matching light style */}
          <section className="opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-display font-bold text-[#1a1a1a]">Featured Businesses</h2>
            </div>
            <div className="bg-stone-50 rounded-3xl border border-dashed border-[#ccc] h-32 flex items-center justify-center">
              <p className="text-[#888] font-bold uppercase tracking-widest text-sm">More campaigns dropping soon</p>
            </div>
          </section>

          <section className="opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-pink-500" />
              <h2 className="text-lg font-display font-bold text-[#1a1a1a]">Youth Offers</h2>
            </div>
            <div className="bg-stone-50 rounded-3xl border border-dashed border-[#ccc] h-32 flex items-center justify-center">
              <p className="text-[#888] font-bold uppercase tracking-widest text-sm">More campaigns dropping soon</p>
            </div>
          </section>

          <section className="opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-display font-bold text-[#1a1a1a]">Event Campaigns</h2>
            </div>
            <div className="bg-stone-50 rounded-3xl border border-dashed border-[#ccc] h-32 flex items-center justify-center">
              <p className="text-[#888] font-bold uppercase tracking-widest text-sm">More campaigns dropping soon</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const currentTheme = THEMES[activeGame.theme as keyof typeof THEMES];

  return (
    <div className="min-h-screen text-white flex flex-col font-sans overflow-hidden relative selection:bg-purple-500/30">
      
      {/* Dynamic Background Image based on Business Theme */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${currentTheme?.bgImage})` }}
      />
      {/* Medium overlay to ensure perfect contrast for the neon game elements while keeping image visible */}
      <div className="absolute inset-0 bg-[#0f031c]/60 z-0 pointer-events-none" />

      {/* ════════════ TOP HEADER ════════════ */}
      <header className="relative z-10 flex flex-wrap md:flex-nowrap items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-black/20 backdrop-blur-md gap-4">
        <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto justify-between md:justify-start">
          <button 
            onClick={() => setActiveGame(null)} 
            className="w-10 h-10 rounded-xl bg-[#2e1065] border border-[#4c1d95] flex items-center justify-center text-white hover:bg-[#3b0764] transition-colors shadow-inner flex-shrink-0"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-yellow-500 overflow-hidden shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-[#111] flex items-center justify-center flex-shrink-0">
              {currentTheme?.icon ? React.createElement(currentTheme.icon, { className: "text-yellow-500", size: 24 }) : <Store className="text-yellow-500" size={24} />}
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black tracking-wider text-white uppercase leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {activeGame.businessName}
              </h1>
              <p className="text-yellow-400 text-[10px] md:text-xs italic font-medium tracking-wide hidden sm:block">
                {activeGame.description}
              </p>
              <div className="flex items-center gap-0.5 md:gap-1 mt-0.5 md:mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={8} className="fill-yellow-400 text-yellow-400 md:w-4 md:h-4" />)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center px-6 py-2 rounded-xl border border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-transparent shadow-[0_0_20px_rgba(250,204,21,0.15)]">
            <span className="text-yellow-400 text-[10px] font-bold tracking-widest uppercase">Your Points</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center"><Star size={12} className="fill-black text-black" /></div>
              <span className="text-xl font-black text-white">{profile.totalPoints.toLocaleString()} <span className="text-xs text-yellow-400">PTS</span></span>
            </div>
          </div>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="w-12 h-12 rounded-xl bg-[#2e1065] border border-[#4c1d95] flex items-center justify-center text-white hover:bg-[#3b0764] transition-colors shadow-inner">
            {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        </div>
      </header>

      {/* ════════════ STATS BAR ════════════ */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-2 md:py-3 bg-black/40 border-b border-purple-900/30 shadow-lg gap-2 md:gap-0">
        <h2 className="text-lg md:text-2xl font-black text-white tracking-widest uppercase text-center md:text-left" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
          WIN AMAZING REWARDS!
        </h2>
        
        {/* COMPACTED STOP COIN BUTTON */}
        <button 
          onClick={() => setDropTrigger(d => d + 1)}
          disabled={plinkoState !== 'sweeping'}
          className={`pointer-events-auto w-full md:w-auto relative group px-6 md:px-8 py-2 rounded-full font-black text-base md:text-lg tracking-wider transition-all duration-300 ${
            plinkoState === 'sweeping' 
              ? 'bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-600 text-white shadow-[0_0_20px_rgba(250,204,21,0.6)] cursor-pointer hover:scale-105 active:scale-95' 
              : 'bg-stone-800 text-stone-500 shadow-none cursor-not-allowed opacity-50'
          }`}
          style={{ textShadow: plinkoState === 'sweeping' ? '0 2px 4px rgba(0,0,0,0.5)' : 'none' }}
        >
          {plinkoState === 'sweeping' && (
            <div className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-50 scale-110 group-hover:animate-ping pointer-events-none" />
          )}
          STOP COIN!
        </button>
      </div>

      {/* ════════════ 3-COLUMN ARENA ════════════ */}
      <div className="flex-1 relative z-10 flex flex-col md:flex-row px-2 md:px-4 pt-4 md:pt-6 gap-4 md:gap-6 min-h-[400px] md:min-h-[500px]">
        
        {/* Left Column: Possible Rewards FAB & Panel */}
        <div className="fixed md:relative bottom-4 left-4 md:bottom-auto md:left-auto z-[60] md:z-50">
          <button 
            onClick={() => setShowRewards(!showRewards)} 
            className="absolute top-0 left-0 bg-gradient-to-br from-red-500 to-red-700 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] border-2 border-red-300/50 hover:scale-105 active:scale-95 transition-all"
          >
            <Gift size={24} className="text-white drop-shadow-md" />
          </button>
          
          <AnimatePresence>
            {showRewards && (
              <motion.div 
                initial={{ opacity: 0, x: -20, scale: 0.9 }} 
                animate={{ opacity: 1, x: 0, scale: 1 }} 
                exit={{ opacity: 0, x: -20, scale: 0.9 }} 
                className="absolute bottom-16 md:bottom-auto md:top-16 left-0 w-[240px] md:w-[260px] flex flex-col mb-2 md:mt-2 origin-bottom-left md:origin-top-left"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black tracking-widest uppercase py-1.5 px-6 rounded-t-md z-20 shadow-[0_4px_10px_rgba(220,38,38,0.5)] whitespace-nowrap border-b-2 border-red-800">
                  Possible Rewards
                </div>
                <div className="bg-gradient-to-b from-[#1c0838] to-[#120424] border border-[#3b1a60] rounded-xl pt-8 p-3 max-h-[400px] overflow-y-auto space-y-2 shadow-2xl relative custom-scrollbar">
                  {activeGame.prizes.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-purple-900/50 bg-black/20 hover:bg-white/5 transition-colors group cursor-default relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-lg border border-yellow-300/30 flex-shrink-0">
                        <Gift size={20} className="text-white drop-shadow-md" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-yellow-400 font-bold text-sm truncate leading-tight">{p.title}</h4>
                        <p className="text-[10px] text-white/70 font-black uppercase tracking-wider truncate">{p.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Column: Plinko Board & Reward Boxes */}
        <div className="flex-1 relative flex flex-col justify-between">
          <ArcadePlinkoBoard 
            activeGame={activeGame} 
            onWin={handlePlinkoWin} 
            playSound={playSound} 
            dropTrigger={dropTrigger}
            onStateChange={setPlinkoState}
          />
        </div>

        {/* Right Column: Live Winners */}
        <div className="hidden lg:flex w-[200px] flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-black tracking-widest uppercase py-1.5 px-8 rounded-t-md z-20 shadow-[0_4px_10px_rgba(22,163,74,0.5)] whitespace-nowrap border-b-2 border-green-800">
            Live Winners!
          </div>
          <div className="flex-1 bg-gradient-to-b from-[#1c0838] to-[#120424] border border-[#3b1a60] rounded-xl pt-8 p-3 overflow-hidden shadow-2xl relative flex flex-col">
            <div className="space-y-3 flex-1 overflow-hidden">
              <AnimatePresence>
                {activityFeed.map((winner, i) => (
                  <motion.div key={i + winner.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-purple-900/30 bg-black/30"
                  >
                    <img src={winner.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-purple-500/30 object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-xs">{winner.name}</h4>
                      <p className="text-yellow-400 text-[10px] font-semibold truncate">{winner.won}</p>
                      <p className="text-[8px] text-white/40 uppercase font-medium">{winner.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      {/* ════════════ BOTTOM FOOTER BAR ════════════ */}
      <footer className="relative z-10 bg-[#0f031c] border-t border-purple-900/50 p-4 flex flex-wrap items-center justify-between gap-4 px-8">
        <button className="flex items-center gap-4 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full py-2 px-6 pr-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform border border-yellow-300/30">
          <Trophy className="text-white fill-yellow-200" size={24} />
          <div className="text-left pr-4">
            <h4 className="text-white font-black text-sm uppercase tracking-wider leading-tight">Daily Leaderboard</h4>
            <p className="text-yellow-100 text-[9px] font-medium">Be the fastest to win amazing rewards!</p>
          </div>
          <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white"><ChevronLeft size={16} className="rotate-180" /></div>
        </button>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Gift className="text-pink-500" size={24} />
            <div>
              <h5 className="text-white font-bold text-[10px] uppercase tracking-wider">Exciting Rewards</h5>
              <p className="text-white/50 text-[9px]">Every Drop Wins!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheck className="text-green-500" size={24} />
            <div>
              <h5 className="text-white font-bold text-[10px] uppercase tracking-wider">Fair & Fun</h5>
              <p className="text-white/50 text-[9px]">Every Player Wins</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════ VICTORY MODAL ════════════ */}
      <AnimatePresence>
        {showVictoryModal && wonPrize && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#4c1d95] to-[#2e1065] border border-purple-400/30 rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(147,51,234,0.4)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
              
              <div className="relative z-10 space-y-6">
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }} 
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    y: [0, -10, 0] 
                  }} 
                  transition={{ 
                    type: 'spring', 
                    delay: 0.2,
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }} 
                  className="w-44 h-44 mx-auto flex items-center justify-center relative"
                >
                  <div className="absolute inset-0 bg-yellow-500/30 blur-3xl rounded-full" />
                  <img 
                    src="/crown.png" 
                    alt="Victory Crown" 
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                  />
                </motion.div>

                <div>
                  <h3 className="text-yellow-400 font-black text-xl uppercase tracking-widest drop-shadow">You Won!</h3>
                  <h2 className="text-4xl font-black text-white mt-2 leading-tight tracking-tight">{wonPrize.title}</h2>
                  <p className="text-xl font-bold text-yellow-200 mt-2">{wonPrize.value}</p>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-purple-500/30">
                  <p className="text-white/80 text-sm leading-relaxed">{wonPrize.details}</p>
                </div>

                <button onClick={resetGame} className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl font-black text-black text-lg shadow-[0_4px_15px_rgba(250,204,21,0.4)] hover:scale-105 active:scale-95 transition-all uppercase tracking-wider">
                  Claim Reward
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
