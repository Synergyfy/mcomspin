'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCustomerStore } from '@/store/customer-store';
import { motion, AnimatePresence } from 'framer-motion';
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

type Prize = {
  title: string;
  value: string;
  type: 'coupon' | 'voucher' | 'product' | 'exclusive' | 'discount' | 'appointment';
  rarity: Rarity;
  details: string;
  image?: string;
  expiryDate?: string;
  terms?: string;
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

const PRIZE_IMAGES = {
  appointment: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80',
  discount: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80',
  voucher: 'https://images.unsplash.com/photo-1549463591-24c188273390?auto=format&fit=crop&w=400&q=80',
  product: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=400&q=80',
  exclusive: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80',
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
      { 
        title: 'Free Haircut', 
        value: '100% OFF', 
        type: 'appointment', 
        rarity: 'legendary', 
        details: 'Full signature haircut and styling by a senior barber.',
        image: PRIZE_IMAGES.appointment,
        expiryDate: '30 Days from today',
        terms: 'Valid Monday to Thursday only. Subject to availability.'
      },
      { 
        title: '20% Discount', 
        value: 'ALL SERVICES', 
        type: 'discount', 
        rarity: 'common', 
        details: 'Apply on any walk-in service including cuts and shaves.',
        image: PRIZE_IMAGES.discount,
        expiryDate: '14 Days from today',
        terms: 'Cannot be combined with other offers. One per customer.'
      },
      { 
        title: '£50 Gift Card', 
        value: 'STORE CREDIT', 
        type: 'voucher', 
        rarity: 'epic', 
        details: 'Spend on premium pomades, beard oils, and grooming kits.',
        image: PRIZE_IMAGES.voucher,
        expiryDate: '90 Days from today',
        terms: 'Non-transferable. Can be used for products or services.'
      },
      { 
        title: 'Beard Care Kit', 
        value: 'PREMIUM SET', 
        type: 'product', 
        rarity: 'rare', 
        details: 'Includes luxury beard oil, balm, and a handcrafted wooden comb.',
        image: PRIZE_IMAGES.product,
        expiryDate: 'Until stock lasts',
        terms: 'In-store collection only. While supplies last.'
      },
      { 
        title: 'VIP Treatment', 
        value: 'FULL SERVICE', 
        type: 'exclusive', 
        rarity: 'legendary', 
        details: 'Ultimate grooming session: Hot towel shave, haircut, and facial.',
        image: PRIZE_IMAGES.exclusive,
        expiryDate: '30 Days from today',
        terms: 'Booking required. Includes complimentary drink.'
      },
      { 
        title: 'Youth Special', 
        value: '30% OFF', 
        type: 'discount', 
        rarity: 'common', 
        details: '30% off any haircut for young gents under 18.',
        image: PRIZE_IMAGES.discount,
        expiryDate: '21 Days from today',
        terms: 'Valid for under 18s only. ID may be required.'
      },
      { 
        title: 'Hair Products', 
        value: 'PREMIUM', 
        type: 'product', 
        rarity: 'rare', 
        details: 'Choose any professional hair product from our premium shelf.',
        image: PRIZE_IMAGES.product,
        expiryDate: '30 Days from today',
        terms: 'Subject to stock availability. One product per reward.'
      },
      { 
        title: 'Mystery Box', 
        value: 'SURPRISE GIFT', 
        type: 'exclusive', 
        rarity: 'epic', 
        details: 'A curated surprise bundle of our best products worth over £40.',
        image: PRIZE_IMAGES.exclusive,
        expiryDate: '14 Days from today',
        terms: 'Content of the box varies. In-store collection only.'
      },
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
  const prizeImagesRef = useRef<Record<number, HTMLImageElement>>({});
  
  const [gameState, setGameState] = useState<'sweeping' | 'dropping' | 'landed'>('sweeping');

  useEffect(() => {
    // Preload prize images
    activeGame.prizes.forEach((prize, index) => {
      if (prize.image) {
        const img = new Image();
        img.src = prize.image;
        img.onload = () => {
          prizeImagesRef.current[index] = img;
        };
      }
    });
  }, [activeGame]);

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
    const sparkles: {x: number, y: number, vx: number, vy: number, life: number, color: string}[] = [];
    let frameCount = 0;

    const draw = () => {
      afId = requestAnimationFrame(draw);
      frameCount++;

      // ── IMMERSIVE GRADIENT BACKGROUND ──
      ctx.clearRect(0, 0, p.width, p.height);
      const bgGrad = ctx.createLinearGradient(0, 0, 0, p.height);
      bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      bgGrad.addColorStop(0.5, 'rgba(255, 247, 237, 0.7)'); // orange-50
      bgGrad.addColorStop(1, 'rgba(255, 237, 213, 0.85)'); // orange-100
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, p.width, p.height);

      // Subtle animated particles (warm/sunlight particles)
      ctx.save();
      for (let s = 0; s < 40; s++) {
        const sx = ((s * 137.5 + frameCount * 0.1) % p.width);
        const sy = ((s * 89.3 + frameCount * 0.05) % (p.height * 0.6));
        const pulse = Math.sin(frameCount * 0.03 + s) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, 1 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${0.1 + pulse * 0.2})`; // subtle orange
        ctx.fill();
      }
      ctx.restore();

      if (p.ball.isDropping) {
        p.ball.vy += 0.5;
        p.ball.vy *= 0.99;
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

            p.ball.vx += (Math.random() - 0.5) * 16;
            p.ball.vy -= Math.random() * 5;

            peg.flash = 1.0;
            playSound('click');

            // Spawn sparkles on collision
            for (let sp = 0; sp < 5; sp++) {
              sparkles.push({
                x: peg.x, y: peg.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1.0,
                color: ['#facc15', '#f97316', '#a78bfa', '#38bdf8', '#fb7185'][Math.floor(Math.random() * 5)]
              });
            }
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

      // ── Draw Sparkles ──
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= 0.04;
        if (sp.life <= 0) { sparkles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2 * sp.life, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.life;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // ── Draw Trail ──
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i];
        t.life -= 0.05;
        if (t.life <= 0) { trail.splice(i, 1); continue; }

        ctx.beginPath();
        ctx.arc(t.x, t.y, p.ball.radius * t.life * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${t.life * 0.6})`;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Sweeper Line (animated glow) ──
      if (gameState === 'sweeping') {
        const glowPulse = Math.sin(frameCount * 0.08) * 0.3 + 0.7;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(20, 35);
        ctx.lineTo(p.width - 20, 35);
        const lineGrad = ctx.createLinearGradient(20, 35, p.width - 20, 35);
        lineGrad.addColorStop(0, '#f97316'); // orange-500
        lineGrad.addColorStop(0.5, '#facc15'); // yellow-400
        lineGrad.addColorStop(1, '#f97316'); // orange-500
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#fb923c';
        ctx.shadowBlur = 10 * glowPulse;
        ctx.stroke();
        ctx.restore();
      }

      // ── Draw Pegs (Vibrant Light Mode Glow) ──
      const pegColors = ['#f97316', '#0ea5e9', '#10b981', '#f43f5e', '#8b5cf6'];
      for (let pi = 0; pi < p.pegs.length; pi++) {
        const peg = p.pegs[pi];
        const pegColor = pegColors[pi % pegColors.length];
        const breathe = Math.sin(frameCount * 0.04 + pi * 0.5) * 0.15 + 0.85;

        // Outer glow
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = `${pegColor}22`; // slightly stronger for light mode
        ctx.shadowColor = pegColor;
        ctx.shadowBlur = 8 * breathe;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Core peg
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(peg.x - 2, peg.y - 2, 0, peg.x, peg.y, peg.radius);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.5, pegColor);
        g.addColorStop(1, `${pegColor}88`);
        ctx.fillStyle = g;
        ctx.shadowColor = pegColor;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner highlight
        ctx.beginPath();
        ctx.arc(peg.x - 1.5, peg.y - 1.5, peg.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();

        // Flash overlay when hit
        if (peg.flash > 0.05) {
          ctx.beginPath();
          ctx.arc(peg.x, peg.y, peg.radius + peg.flash * 18, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(250, 204, 21, ${peg.flash * 0.5})`;
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 30;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // ── Draw Bins / Guides ──
      ctx.lineWidth = 1;
      p.bins.forEach((bin, i) => {
        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(bin.x, p.height - 110);
          ctx.lineTo(bin.x, p.height);
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.15)'; // faint orange
          ctx.stroke();
        }

        // 3D Gift Box
        const boxSize = Math.min(bin.width * 0.7, 48);
        const boxX = bin.x + (bin.width - boxSize) / 2;
        const boxY = p.height - boxSize - 22;

        const colorPair = BOX_COLORS[i % BOX_COLORS.length].replace('from-', '').replace('to-', '').split(' ');
        const mainColor = colorPair[0].replace(/-\d+$/, '');

        const colors: Record<string, { light: string, dark: string, glow: string }> = {
          red: { light: '#ef4444', dark: '#991b1b', glow: '#ef444466' },
          purple: { light: '#a855f7', dark: '#6b21a8', glow: '#a855f766' },
          blue: { light: '#3b82f6', dark: '#1e40af', glow: '#3b82f666' },
          green: { light: '#22c55e', dark: '#166534', glow: '#22c55e66' },
          orange: { light: '#f97316', dark: '#9a3412', glow: '#f9731666' },
          pink: { light: '#ec4899', dark: '#9d174d', glow: '#ec489966' },
          teal: { light: '#14b8a6', dark: '#115e59', glow: '#14b8a666' },
          yellow: { light: '#eab308', dark: '#854d0e', glow: '#eab30866' }
        };

        const theme = colors[mainColor] || colors.yellow;

        // Box glow
        ctx.shadowColor = theme.glow;
        ctx.shadowBlur = 15;

        // Box body
        ctx.fillStyle = theme.dark;
        const radius = 6;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxSize, boxSize, radius);
        ctx.fill();

        // Box face gradient
        const boxG = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxSize);
        boxG.addColorStop(0, theme.light);
        boxG.addColorStop(1, theme.dark);
        ctx.fillStyle = boxG;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxSize, boxSize - 4, radius);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Ribbon
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = 'rgba(250,204,21,0.3)';
        ctx.shadowBlur = 6;
        ctx.fillRect(boxX + boxSize / 2 - 3, boxY, 6, boxSize - 4);
        ctx.fillRect(boxX, boxY + boxSize / 2 - 3, boxSize, 6);
        ctx.shadowBlur = 0;

        // Center knot
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.roundRect(boxX + boxSize / 2 - 7, boxY + boxSize / 2 - 7, 14, 14, 3);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(8, boxSize * 0.2)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎁', bin.x + bin.width / 2, boxY + boxSize / 2);

        // Text below box
        ctx.fillStyle = '#ea580c'; // darker orange
        ctx.font = `900 ${Math.max(6, boxSize * 0.13)}px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText('MYSTERY BOX', bin.x + bin.width / 2, p.height - 10);
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; // dark text
        ctx.font = `bold ${Math.max(4, boxSize * 0.09)}px sans-serif`;
        ctx.fillText('SURPRISE REWARD', bin.x + bin.width / 2, p.height - 3);
      });

      // ── Draw Ball (Gold Coin with premium metallic shine) ──
      // Outer glow ring
      ctx.beginPath();
      ctx.arc(p.ball.x, p.ball.y, p.ball.radius + 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.15)';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 35;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Coin body
      ctx.beginPath();
      ctx.arc(p.ball.x, p.ball.y, p.ball.radius, 0, Math.PI * 2);
      const bg = ctx.createRadialGradient(p.ball.x - 3, p.ball.y - 3, 0, p.ball.x, p.ball.y, p.ball.radius);
      bg.addColorStop(0, '#fef9c3');
      bg.addColorStop(0.3, '#fde047');
      bg.addColorStop(0.7, '#f59e0b');
      bg.addColorStop(1, '#b45309');
      ctx.fillStyle = bg;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Coin edge ring
      ctx.beginPath();
      ctx.arc(p.ball.x, p.ball.y, p.ball.radius - 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner star
      ctx.font = `${p.ball.radius}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#92400e';
      ctx.fillText('★', p.ball.x, p.ball.y + 1);

      // Specular highlight
      ctx.beginPath();
      ctx.arc(p.ball.x - p.ball.radius * 0.25, p.ball.y - p.ball.radius * 0.25, p.ball.radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fill();
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
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
          <span className="text-orange-900 font-black text-sm md:text-lg tracking-wider uppercase" style={{ textShadow: '0 0 15px rgba(255,255,255,0.9), 0 2px 4px rgba(249,115,22,0.3)' }}>
            TAP <span className="text-orange-600">STOP</span> TO DROP THE COIN!
          </span>
        </div>
      )}

      <div ref={containerRef} className="relative w-full flex-1 min-h-[550px] rounded-2xl overflow-hidden shadow-2xl bg-orange-50/50 border border-orange-100">
        {/* SECTOR BACKGROUND IMAGE */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url(${THEMES[activeGame.theme as keyof typeof THEMES]?.bgImage})` }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none z-10" />
      </div>

    </div>
  );
};


/* ─── MAIN ARCADE PAGE ─── */

function ArcadeGamesPageContent() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId');
  const router = useRouter();
  
  const { profile, unlockReward, decrementSpins, addPoints } = useCustomerStore();

  const [activeGame, setActiveGame] = useState<Campaign | null>(null);
  
  // Auto-select game if campaignId is provided
  useEffect(() => {
    if (campaignId) {
      const foundGame = ACTIVE_CAMPAIGNS.find(c => c.id === campaignId) || null;
      setActiveGame(foundGame);
    }
  }, [campaignId]);

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
    const currentId = activeGame?.id;
    setActiveGame(null);
    setTimeout(() => {
        if(currentId) setActiveGame(ACTIVE_CAMPAIGNS.find(c => c.id === currentId) || null);
    }, 50);
  };

  if (!activeGame) {
    return (
      <div className="space-y-8">
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
        <div className="space-y-8 text-left">
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
        </div>
      </div>
    );
  }

  const currentTheme = THEMES[activeGame.theme as keyof typeof THEMES];

  return (
    <div className="min-h-screen text-stone-900 flex flex-col font-sans overflow-hidden relative selection:bg-orange-300/30">
      {/* ── IMMERSIVE VIBRANT BACKGROUND ── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-50 via-white to-orange-100" />
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-soft-light opacity-30 transition-opacity duration-1000"
        style={{ backgroundImage: `url(${currentTheme?.bgImage})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-white via-white/80 to-white/40 pointer-events-none" />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f97316\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      {/* ── HEADER — Sleek Glassmorphic Light ── */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 bg-white/70 backdrop-blur-xl border-b border-orange-100/50 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveGame(null)}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-stone-600 hover:bg-orange-100 hover:text-orange-600 transition-all flex-shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0 border border-white">
              {currentTheme?.icon ? React.createElement(currentTheme.icon, { className: "text-white", size: 18 }) : <Store className="text-white" size={18} />}
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-black tracking-wider text-stone-900 uppercase leading-tight">
                {activeGame.businessName}
              </h1>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-orange-400 text-orange-400" />)}
                <span className="text-[10px] text-stone-500 ml-1.5 font-medium hidden sm:inline">{activeGame.description}</span>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setSoundEnabled(!soundEnabled)} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-stone-600 hover:bg-orange-100 hover:text-orange-600 transition-all">
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </header>

      {/* ── ACTION BAR — Vivid CTA Light ── */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-8 py-2.5 bg-gradient-to-r from-orange-100/80 via-amber-100/60 to-orange-100/80 border-b border-orange-200/50 backdrop-blur-md">
        <h2 className="text-xs md:text-sm font-black text-orange-900 tracking-[0.2em] uppercase">
          🎰 Win Amazing Rewards
        </h2>
        <button
          onClick={() => setDropTrigger(d => d + 1)}
          disabled={plinkoState !== 'sweeping'}
          className={`relative group px-5 md:px-8 py-2 md:py-2.5 rounded-full font-black text-sm md:text-base tracking-wider transition-all duration-300 ${
            plinkoState === 'sweeping'
              ? 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white shadow-[0_4px_20px_rgba(249,115,22,0.4)] cursor-pointer hover:scale-105 active:scale-95 hover:shadow-[0_6px_25px_rgba(249,115,22,0.5)]'
              : 'bg-stone-200 text-stone-400 shadow-none cursor-not-allowed'
          }`}
          style={{ textShadow: plinkoState === 'sweeping' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none' }}
        >
          {plinkoState === 'sweeping' && (
            <div className="absolute inset-0 rounded-full border-2 border-orange-300/40 animate-ping pointer-events-none" />
          )}
          STOP COIN!
        </button>
      </div>

      {/* ── GAME AREA ── */}
      <div className="flex-1 relative z-10 flex flex-col md:flex-row px-2 md:px-4 py-3 md:py-4 gap-3 md:gap-4 min-h-[550px] md:min-h-[600px] lg:min-h-[700px]">
        {/* Rewards FAB */}
        <div className="fixed bottom-24 left-4 md:bottom-auto md:left-auto md:relative z-[60] md:z-50">
          <button
            onClick={() => setShowRewards(!showRewards)}
            className="absolute top-0 left-0 bg-gradient-to-br from-orange-400 to-red-500 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 border border-white/50 hover:scale-110 active:scale-95 transition-all"
          >
            <Gift size={22} className="text-white" />
          </button>
          <AnimatePresence>
            {showRewards && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-14 md:bottom-auto md:top-16 left-0 w-[250px] md:w-[270px] flex flex-col origin-bottom-left md:origin-top-left"
              >
                <div className="bg-white/95 backdrop-blur-xl border border-orange-100 rounded-2xl overflow-hidden shadow-2xl shadow-orange-900/10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2.5">
                    <span className="text-white text-[11px] font-black tracking-widest uppercase">🎁 Possible Rewards</span>
                  </div>
                  <div className="p-2.5 max-h-[350px] overflow-y-auto space-y-1.5 custom-scrollbar">
                    {activeGame.prizes.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 hover:bg-orange-50 transition-colors group cursor-default border border-stone-100 hover:border-orange-200">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-sm flex-shrink-0">
                          <Gift size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="text-stone-800 font-bold text-xs truncate leading-tight">{p.title}</h4>
                          <p className="text-[9px] text-orange-500 font-bold uppercase tracking-wider truncate">{p.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* GAME BOARD */}
        <div className="flex-1 relative flex flex-col justify-between">
          <ArcadePlinkoBoard
            activeGame={activeGame}
            onWin={handlePlinkoWin}
            playSound={playSound}
            dropTrigger={dropTrigger}
            onStateChange={setPlinkoState}
          />
        </div>

        {/* Live Winners — Desktop sidebar */}
        <div className="hidden lg:flex w-[210px] flex-col relative">
          <div className="bg-white/90 backdrop-blur-xl border border-orange-100 rounded-2xl overflow-hidden shadow-2xl shadow-orange-900/10 flex-1 flex flex-col">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2.5">
              <span className="text-white text-[11px] font-black tracking-widest uppercase">🏆 Live Winners</span>
            </div>
            <div className="p-2.5 space-y-2 flex-1 overflow-hidden">
              <AnimatePresence>
                {activityFeed.map((winner, i) => (
                  <motion.div key={i + winner.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100"
                  >
                    <img src={winner.avatar} alt="Avatar" className="w-7 h-7 rounded-full border border-stone-200 object-cover" />
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-stone-800 font-bold text-[11px]">{winner.name}</h4>
                      <p className="text-orange-500 text-[9px] font-bold truncate">{winner.won}</p>
                      <p className="text-[7px] text-stone-400 uppercase font-bold">{winner.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER — Minimal ── */}
      <footer className="relative z-10 bg-white/60 backdrop-blur-sm border-t border-orange-200/50 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Gift className="text-orange-500" size={16} />
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Every Drop Wins</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <BadgeCheck className="text-emerald-500" size={16} />
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Fair & Verified</span>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full py-1.5 px-4 shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform text-white text-[10px] font-black uppercase tracking-wider border border-orange-400/20">
          <Trophy size={14} />
          Leaderboard
        </button>
      </footer>
      <AnimatePresence>
        {showVictoryModal && wonPrize && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white border border-stone-200 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible custom-scrollbar"
            >
              {/* Left Side: Visual Celebration (Orange Gradient) */}
              <div className="md:w-5/12 relative min-h-[160px] md:min-h-[200px] bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-6 md:p-8">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
                
                {/* Reward Image with Glow */}
                <motion.div 
                  initial={{ rotate: -15, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="relative z-10 w-32 md:w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border-4 border-white/40"
                >
                  <img 
                    src={wonPrize.image || PRIZE_IMAGES.exclusive} 
                    alt={wonPrize.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 text-left">
                    <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${
                      wonPrize.rarity === 'legendary' ? 'bg-white text-orange-600' :
                      wonPrize.rarity === 'epic' ? 'bg-stone-900 text-white' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {wonPrize.rarity}
                    </span>
                  </div>
                </motion.div>

                {/* Animated Light Orbs */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-10 left-10 w-20 h-20 bg-white blur-[40px] rounded-full pointer-events-none"
                />
              </div>

              {/* Right Side: Info & Actions */}
              <div className="md:w-7/12 p-6 md:p-10 flex flex-col h-full bg-white">
                <div className="mb-4 md:mb-6">
                  <span className="text-orange-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] block mb-1">Congratulations!</span>
                  <h2 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight mb-1 uppercase italic tracking-tighter">
                    {wonPrize.title}
                  </h2>
                  <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <span className="text-xl md:text-2xl font-black text-orange-600">{wonPrize.value}</span>
                    <span className="text-stone-300 px-1">|</span>
                    <span className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest">{activeGame.businessName}</span>
                  </div>
                </div>

                {/* Reward Details Section */}
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <div className="space-y-1">
                    <span className="text-[8px] md:text-[10px] font-black text-stone-300 uppercase tracking-widest">What you won</span>
                    <p className="text-stone-600 text-xs md:text-sm font-medium leading-relaxed">{wonPrize.details}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-100">
                    <div className="space-y-1">
                      <span className="text-[8px] md:text-[10px] font-black text-stone-300 uppercase tracking-widest">Valid Until</span>
                      <div className="flex items-center gap-1.5 text-orange-600">
                        <Clock size={12} />
                        <span className="text-[10px] md:text-xs font-bold">{wonPrize.expiryDate}</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[8px] md:text-[10px] font-black text-stone-300 uppercase tracking-widest">Terms & Conditions</span>
                      <p className="text-[8px] md:text-[9px] text-stone-400 leading-tight">{wonPrize.terms}</p>
                    </div>
                  </div>
                </div>

                {/* Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 mt-auto">
                  {/* Primary Action */}
                  <button 
                    onClick={() => {
                      const newReward = {
                        title: wonPrize.title,
                        provider: activeGame.businessName,
                        providerLogo: activeGame.businessName.substring(0, 2),
                        type: wonPrize.type as any,
                        value: wonPrize.value,
                        details: wonPrize.details,
                      };
                      unlockReward(newReward);
                      router.push('/customer/wallet');
                    }}
                    className="col-span-2 py-3.5 md:py-4 bg-orange-500 hover:bg-orange-600 rounded-xl md:rounded-2xl font-black text-white text-xs md:text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Redeem Reward
                  </button>

                  {/* Secondary Actions */}
                  <button 
                    onClick={() => {
                      alert('Reward saved to your wallet!');
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 md:py-3 bg-stone-50 border border-stone-200 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black text-stone-600 uppercase tracking-widest hover:bg-stone-100 transition-all"
                  >
                    <Star size={12} className="fill-orange-400 text-orange-400" />
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      alert('Sharing link copied!');
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 md:py-3 bg-stone-50 border border-stone-200 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black text-stone-600 uppercase tracking-widest hover:bg-stone-100 transition-all"
                  >
                    <Zap size={12} className="text-orange-500" />
                    Share
                  </button>

                  <button 
                    onClick={resetGame}
                    className="col-span-2 mt-1 md:mt-2 text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] hover:text-orange-500 transition-colors py-2"
                  >
                    Return to Game
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={resetGame} 
                className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-orange-500 hover:text-white transition-all z-[3010]"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ArcadeGamesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArcadeGamesPageContent />
    </Suspense>
  );
}
