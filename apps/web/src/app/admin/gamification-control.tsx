'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings2, 
  Palette, 
  Zap, 
  RotateCcw, 
  Volume2, 
  Layout, 
  Target, 
  Activity,
  Maximize2,
  Dices,
  Waves,
  Sparkles,
  Award
} from 'lucide-react';
import { useAdminGames } from '@/services/admin';

/* ─── PLINKO ADMIN SUB-COMPONENTS ─── */

const ControlSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-stone-50">
      <Icon size={16} className="text-[#f97316]" />
      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">{title}</h3>
    </div>
    {children}
  </div>
);

const RangeSlider = ({ label, value, min, max, step = 1, onChange, suffix = '' }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[11px] font-bold">
      <span className="text-stone-500 uppercase tracking-tight">{label}</span>
      <span className="text-[#f97316]">{value}{suffix}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#f97316]" 
    />
  </div>
);

const PlinkoBoardPreview = ({ config, theme }: { config: any, theme: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'sweeping' | 'dropping' | 'landed'>('sweeping');

  const physics = useRef({
    width: 300,
    height: 400,
    ball: { x: 150, y: 35, vx: 0, vy: 0, radius: 8, isDropping: false },
    pegs: [] as any[],
    bins: [] as any[],
    sweepDirection: 1,
    sweepSpeed: config.sweepSpeed,
    settleTimer: 0
  });

  // Mode-based color overrides
  const getColors = () => {
    if (theme?.mode === 'Neon Bright') return ['#00ffcc', '#ff00ff', '#ccff00', '#0099ff', '#ff3300'];
    if (theme?.mode === 'Classic Casino') return ['#d4af37', '#991b1b', '#065f46', '#1e3a8a', '#44403c'];
    return ['#ef4444', '#a855f7', '#3b82f6', '#22c55e', '#f97316', '#ec4899', '#14b8a6', '#eab308'];
  };

  const BOX_COLORS = getColors();

  // Initialize Board
  useEffect(() => {
    const p = physics.current;
    p.pegs = [];
    const rows = config.pegRows;
    const cols = config.pegCols;
    const spacingX = p.width / (cols + 1);
    const spacingY = (p.height - 120) / rows;

    for (let r = 0; r < rows; r++) {
      const isOffset = r % 2 !== 0;
      const cCount = isOffset ? cols : cols + 1;
      const offset = isOffset ? spacingX : spacingX / 2;
      for (let c = 0; c < cCount; c++) {
        const jitterX = (Math.random() - 0.5) * (spacingX * config.jitter);
        const jitterY = (Math.random() - 0.5) * (spacingY * config.jitter);
        p.pegs.push({
          x: c * spacingX + offset + jitterX,
          y: 80 + r * spacingY + jitterY,
          radius: 4,
          flash: 0
        });
      }
    }

    p.bins = [];
    const binW = p.width / config.bins;
    for (let i = 0; i < config.bins; i++) {
      p.bins.push({ x: i * binW, width: binW });
    }

    p.ball = { x: p.width / 2, y: 35, vx: 0, vy: 0, radius: config.ballRadius * 0.6, isDropping: false };
    p.sweepSpeed = config.sweepSpeed;
    setGameState('sweeping');
  }, [config, theme]); // Added theme dependency to force reset on mode change

  // Main Loop
  useEffect(() => {
    let afId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const p = physics.current;
    const trail: any[] = [];

    const draw = () => {
      afId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, p.width, p.height);

      // Background adjustment based on mode
      if (theme.mode === 'Neon Bright') {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0,0,p.width, p.height);
      }

      if (p.ball.isDropping) {
        p.ball.vy += config.gravity;
        p.ball.vy *= config.friction;
        p.ball.vx *= config.friction;
        
        p.ball.x += p.ball.vx;
        p.ball.y += p.ball.vy;

        if (Math.random() > 0.4) trail.push({ x: p.ball.x, y: p.ball.y, life: 1.0 });

        for (const peg of p.pegs) {
          peg.flash *= 0.8;
          const dx = p.ball.x - peg.x;
          const dy = p.ball.y - peg.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = p.ball.radius + peg.radius;
          
          if (dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            p.ball.x += nx * overlap;
            p.ball.y += ny * overlap;

            const dot = p.ball.vx * nx + p.ball.vy * ny;
            p.ball.vx = (p.ball.vx - 2 * dot * nx) * config.bounce;
            p.ball.vy = (p.ball.vy - 2 * dot * ny) * config.bounce;
            
            p.ball.vx += (Math.random() - 0.5) * config.unpredictability;
            p.ball.vy -= Math.random() * 2;
            peg.flash = 1.0;
          }
        }

        if (p.ball.x < p.ball.radius || p.ball.x > p.width - p.ball.radius) p.ball.vx *= -0.7;
        
        if (p.ball.y > p.height - 20) {
          p.ball.y = p.height - 20;
          p.ball.vy *= -0.2;
          p.settleTimer++;
          if (p.settleTimer > 40) {
            setGameState('landed');
            p.ball.isDropping = false;
          }
        }
      } else if (gameState === 'sweeping') {
        p.ball.x += p.sweepSpeed * p.sweepDirection;
        if (p.ball.x < 30 || p.ball.x > p.width - 30) p.sweepDirection *= -1;
      }

      // Render Trail (Use Accent Color)
      trail.forEach((t, i) => {
        t.life -= 0.05;
        if (t.life <= 0) return;
        ctx.beginPath();
        ctx.arc(t.x, t.y, p.ball.radius * t.life, 0, Math.PI * 2);
        ctx.fillStyle = theme.accentColor + Math.floor(t.life * 100).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Render Pegs
      p.pegs.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        ctx.fillStyle = peg.flash > 0 ? theme.accentColor : theme.mode === 'Neon Bright' ? '#333' : '#cbd5e1';
        if (peg.flash > 0 || theme.mode === 'Neon Bright') {
          ctx.shadowBlur = peg.flash > 0 ? 15 : 5;
          ctx.shadowColor = theme.accentColor;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render Boxes
      p.bins.forEach((bin, i) => {
        const boxSize = Math.min(bin.width * 0.6, 30);
        const boxX = bin.x + (bin.width - boxSize) / 2;
        const boxY = p.height - boxSize - 15;
        const color = theme.mode === 'Flat Design' ? theme.primaryColor : BOX_COLORS[i % BOX_COLORS.length];

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxSize, boxSize, 4);
        ctx.fill();
        
        // Ribbon (Use Secondary Color)
        ctx.fillStyle = theme.secondaryColor;
        ctx.fillRect(boxX + boxSize/2 - 2, boxY, 4, boxSize);
        ctx.fillRect(boxX, boxY + boxSize/2 - 2, boxSize, 4);
      });

      // Render Ball (Use Accent Color)
      ctx.beginPath();
      ctx.arc(p.ball.x, p.ball.y, p.ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = theme.accentColor;
      ctx.shadowBlur = 20;
      ctx.shadowColor = theme.accentColor;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    draw();
    return () => cancelAnimationFrame(afId);
  }, [gameState, config, theme]);

  const handleAction = () => {
    const p = physics.current;
    if (gameState === 'sweeping') {
      p.ball.isDropping = true;
      setGameState('dropping');
    } else if (gameState === 'landed') {
      p.ball.x = p.width / 2;
      p.ball.y = 35;
      p.ball.vx = 0;
      p.ball.vy = 0;
      p.ball.isDropping = false;
      p.sweepDirection = 1;
      p.settleTimer = 0;
      setGameState('sweeping');
    }
  };

  return (
    <div className={`relative group overflow-hidden rounded-2xl border border-white/5 backdrop-blur-sm ${theme.mode === 'Dark Arcade' ? 'bg-black/60' : theme.mode === 'Neon Bright' ? 'bg-zinc-950 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'bg-stone-50'}`}>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
        <button 
          onClick={handleAction}
          className="px-4 py-1.5 text-[10px] font-black rounded-full shadow-lg hover:scale-105 transition-all uppercase tracking-tighter"
          style={{ backgroundColor: theme.accentColor, color: theme.mode === 'Neon Bright' ? '#000' : '#fff' }}
        >
          {gameState === 'sweeping' ? 'Drop Coin' : gameState === 'landed' ? 'Reset' : 'Dropping...'}
        </button>
      </div>
      <canvas ref={canvasRef} width={300} height={400} className="w-full aspect-[3/4]" />
    </div>
  );
};

/* ─── MAIN ARCADE CONTROL COMPONENT ─── */

export const GamificationControl = () => {
  const [subTab, setSubTab] = useState('physics');
  const gamesQuery = useAdminGames();
  const [deploying, setDeploying] = useState(false);
  const [deployMsg, setDeployMsg] = useState('');
  const gameList: any[] = gamesQuery.data?.data ?? gamesQuery.data ?? [];
  const [plinkoConfig, setPlinkoConfig] = useState({
    gravity: 0.5,
    friction: 0.99,
    bounce: 0.6,
    unpredictability: 8,
    pegRows: 10,
    pegCols: 7,
    bins: 8,
    sweepSpeed: 6,
    ballRadius: 10,
    jitter: 0.45
  });

  const [themeConfig, setThemeConfig] = useState({
    primaryColor: '#f97316',
    secondaryColor: '#8b5cf6',
    accentColor: '#facc15',
    mode: 'Dark Arcade',
    font: 'Inter'
  });

  const [distMode, setDistMode] = useState('Weighted Center-Heavy');
  const [binWeights, setBinWeights] = useState<any[]>([]);

  // Initialize bin weights whenever bin count changes
  useEffect(() => {
    const weights = Array.from({ length: plinkoConfig.bins }).map((_, i) => ({
      id: i,
      tier: i < 2 || i > plinkoConfig.bins - 3 ? 'Legendary' : 'Common',
      weight: 100 / plinkoConfig.bins
    }));
    setBinWeights(weights);
  }, [plinkoConfig.bins]);

  const cycleDistMode = () => {
    const modes = ['Weighted Center-Heavy', 'Edge-Heavy (High Risk)', 'Uniform Distribution', 'Chaos (Randomized)'];
    const currentIndex = modes.indexOf(distMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setDistMode(nextMode);
    
    // Auto-adjust weights based on mode
    let newWeights = [...binWeights];
    const n = plinkoConfig.bins;
    if (nextMode.includes('Center-Heavy')) {
      newWeights = newWeights.map((w, i) => ({ ...w, weight: (i === Math.floor(n/2) || i === Math.ceil(n/2)-1) ? 25 : 10 }));
    } else if (nextMode.includes('Edge-Heavy')) {
      newWeights = newWeights.map((w, i) => ({ ...w, weight: (i === 0 || i === n-1) ? 30 : 5 }));
    } else if (nextMode.includes('Uniform')) {
      newWeights = newWeights.map(w => ({ ...w, weight: 100/n }));
    }
    setBinWeights(newWeights);
  };

  const updateBinTier = (index: number) => {
    const tiers: ('Common' | 'Rare' | 'Epic' | 'Legendary')[] = ['Common', 'Rare', 'Epic', 'Legendary'];
    setBinWeights(prev => prev.map((w, i) => {
      if (i !== index) return w;
      const currentIdx = tiers.indexOf(w.tier);
      return { ...w, tier: tiers[(currentIdx + 1) % tiers.length] };
    }));
  };

  const tabs = [
    { id: 'physics', label: 'Physics & Feel', icon: Activity },
    { id: 'layout', label: 'Board Layout', icon: Layout },
    { id: 'prizes', label: 'Prize Logic', icon: Target },
    { id: 'visuals', label: 'Visual Style', icon: Palette },
    { id: 'audio', label: 'Soundscape', icon: Volume2 },
  ];

  const updateConfig = (key: string, val: any) => {
    setPlinkoConfig(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Sub-navigation */}
      <div className="flex items-center gap-1 bg-white border border-stone-200 p-1 rounded-2xl w-max overflow-x-auto max-w-full no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
              subTab === tab.id
                ? 'bg-[#1a1a1a] text-white shadow-lg shadow-black/10'
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration Panels */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={subTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {subTab === 'physics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ControlSection title="Core Gravity" icon={Waves}>
                    <div className="space-y-6">
                      <RangeSlider 
                        label="Gravity Force" 
                        value={plinkoConfig.gravity} 
                        min={0.1} max={1.5} step={0.1} 
                        onChange={(v: any) => updateConfig('gravity', v)} 
                      />
                      <RangeSlider 
                        label="Air Friction" 
                        value={plinkoConfig.friction} 
                        min={0.9} max={1.0} step={0.01} 
                        onChange={(v: any) => updateConfig('friction', v)} 
                        suffix="μ"
                      />
                      <RangeSlider 
                        label="Collision Bounce" 
                        value={plinkoConfig.bounce} 
                        min={0.1} max={0.9} step={0.1} 
                        onChange={(v: any) => updateConfig('bounce', v)} 
                      />
                    </div>
                  </ControlSection>

                  <ControlSection title="Chaos Engine" icon={Dices}>
                    <div className="space-y-6">
                      <RangeSlider 
                        label="Unpredictability" 
                        value={plinkoConfig.unpredictability} 
                        min={0} max={20} 
                        onChange={(v: any) => updateConfig('unpredictability', v)} 
                        suffix=" Factor"
                      />
                      <RangeSlider 
                        label="Peg Jitter" 
                        value={plinkoConfig.jitter} 
                        min={0} max={1.0} step={0.05} 
                        onChange={(v: any) => updateConfig('jitter', v)} 
                      />
                      <div className="pt-2">
                        <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100 cursor-pointer hover:bg-stone-100 transition-colors">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#f97316]" />
                          <span className="text-[11px] font-bold text-stone-700">ENABLE UPWARD KICK ON IMPACT</span>
                        </label>
                      </div>
                    </div>
                  </ControlSection>
                </div>
              )}

              {subTab === 'layout' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ControlSection title="Board Geometry" icon={Maximize2}>
                    <div className="space-y-6">
                      <RangeSlider 
                        label="Peg Rows" 
                        value={plinkoConfig.pegRows} 
                        min={5} max={15} 
                        onChange={(v: any) => updateConfig('pegRows', v)} 
                      />
                      <RangeSlider 
                        label="Peg Density (Cols)" 
                        value={plinkoConfig.pegCols} 
                        min={5} max={12} 
                        onChange={(v: any) => updateConfig('pegCols', v)} 
                      />
                      <RangeSlider 
                        label="Prize Bins" 
                        value={plinkoConfig.bins} 
                        min={2} max={12} 
                        onChange={(v: any) => updateConfig('bins', v)} 
                      />
                    </div>
                  </ControlSection>

                  <ControlSection title="Interaction" icon={Zap}>
                    <div className="space-y-6">
                      <RangeSlider 
                        label="Sweep Speed" 
                        value={plinkoConfig.sweepSpeed} 
                        min={2} max={15} 
                        onChange={(v: any) => updateConfig('sweepSpeed', v)} 
                      />
                      <RangeSlider 
                        label="Ball Size" 
                        value={plinkoConfig.ballRadius} 
                        min={5} max={20} 
                        onChange={(v: any) => updateConfig('ballRadius', v)} 
                        suffix="px"
                      />
                    </div>
                  </ControlSection>
                </div>
              )}

              {subTab === 'prizes' && (
                <ControlSection title="Probability Distribution" icon={Award}>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Sparkles className="text-orange-500" size={20} />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-orange-800 uppercase">Current Distribution Mode</p>
                          <p className="text-xs font-bold text-orange-600">{distMode}</p>
                        </div>
                      </div>
                      <button 
                        onClick={cycleDistMode}
                        className="bg-white px-4 py-2 rounded-lg text-[10px] font-black border border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors"
                      >
                        CHANGE
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {binWeights.map((bin, i) => (
                        <div key={i} className="p-4 bg-white border border-stone-100 rounded-xl flex items-center justify-between group hover:border-orange-200 transition-all">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-stone-400">BIN {i+1}</span>
                            <button 
                              onClick={() => updateBinTier(i)}
                              className={`text-xs font-bold px-2 py-0.5 rounded-md transition-colors ${
                                bin.tier === 'Legendary' ? 'text-purple-600 bg-purple-50' : 
                                bin.tier === 'Epic' ? 'text-blue-600 bg-blue-50' :
                                bin.tier === 'Rare' ? 'text-emerald-600 bg-emerald-50' :
                                'text-stone-600 bg-stone-50'
                              }`}
                            >
                              Tier {bin.tier}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-stone-500">{bin.weight.toFixed(1)}%</span>
                            <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${bin.weight}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ControlSection>
              )}

              {subTab === 'visuals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ControlSection title="Theming" icon={Palette}>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-stone-400 uppercase">Visual Mode</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Dark Arcade', 'Neon Bright', 'Flat Design', 'Classic Casino'].map(mode => (
                            <button 
                              key={mode}
                              onClick={() => setThemeConfig(prev => ({ ...prev, mode }))}
                              className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                                themeConfig.mode === mode 
                                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {['Primary', 'Secondary', 'Accent'].map((type) => (
                          <div key={type} className="space-y-1">
                            <label className="text-[10px] font-black text-stone-400 uppercase">{type}</label>
                            <input type="color" className="w-full h-10 rounded-xl cursor-pointer bg-white border border-stone-100 p-1" defaultValue={themeConfig[`${type.toLowerCase()}Color` as keyof typeof themeConfig]} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </ControlSection>

                  <ControlSection title="Particle Effects" icon={Sparkles}>
                    <div className="space-y-4">
                      {['Ball Trail Engine', 'Impact Flash FX', 'Bin Glow', 'Winner Confetti'].map(fx => (
                        <label key={fx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100 cursor-pointer hover:bg-stone-100 transition-colors">
                          <span className="text-xs font-bold text-stone-700 uppercase tracking-tight">{fx}</span>
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#f97316]" />
                        </label>
                      ))}
                    </div>
                  </ControlSection>
                </div>
              )}

              {subTab === 'audio' && (
                <ControlSection title="Audio Mastering" icon={Volume2}>
                  <div className="space-y-6">
                    <RangeSlider label="Master Volume" value={75} min={0} max={100} onChange={() => {}} suffix="%" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Click Synth', 'Victory Chime', 'Suspense Pad', 'UI Clicks'].map(sound => (
                        <div key={sound} className="p-4 bg-white border border-stone-100 rounded-xl flex items-center justify-between group">
                          <span className="text-xs font-bold text-stone-900">{sound}</span>
                          <button className="p-2 bg-stone-50 rounded-lg text-stone-400 hover:text-[#f97316] hover:bg-orange-50 transition-all">
                            <Volume2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </ControlSection>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Preview & Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1a1a1a] p-6 rounded-3xl text-white shadow-xl shadow-orange-900/10 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
            <h3 className="text-xs font-black mb-6 uppercase tracking-[0.2em] text-orange-500">Board Simulation</h3>
            
            <PlinkoBoardPreview config={plinkoConfig} theme={themeConfig} />

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-stone-500">
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-500">ONLINE</span>
              </div>
              {deployMsg && (
                <p className={`text-[11px] font-bold text-center ${deployMsg.includes('successfully') ? 'text-emerald-500' : 'text-red-500'}`}>{deployMsg}</p>
              )}
              <button
                onClick={() => {
                  setDeployMsg('Not yet connected to the backend — this is a UI mockup.');
                  setTimeout(() => setDeployMsg(''), 3000);
                }}
                className="w-full py-4 bg-gradient-to-r from-[#f97316] to-orange-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.1em] shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                DEPLOY CONFIGURATION
              </button>
              <button className="w-full py-3 bg-white/5 text-white/60 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border border-white/10 hover:bg-white/10 transition-all">
                RESET TO DEFAULTS
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
              <RotateCcw size={14} className="text-blue-500" />
              Recent Logs
            </h3>
            <div className="space-y-3">
              {gameList.slice(0, 5).length > 0 ? gameList.slice(0, 5).map((log: any, i: number) => (
                <div key={log.id || i} className="flex gap-3 text-[10px]">
                  <span className="text-stone-400 font-mono">{log.updatedAt ? new Date(log.updatedAt).toLocaleTimeString() : log.time || 'N/A'}</span>
                  <span className="text-stone-600 font-bold">{log.gameName || log.name ? `${log.gameName || log.name} config updated` : log.msg || 'No logs'}</span>
                </div>
              )) : (
                <p className="text-center text-[#888] py-8 text-[13px]">No logs available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

