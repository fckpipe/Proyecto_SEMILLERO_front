// ─────────────────────────────────────────────────────────────────────────────
// MOV-IA ROBOT SVG COMPONENT
// Animated SVG robot for the MOV-IA chat widget
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'

const ROBOT_STYLES = `
  @keyframes movia-bob {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes movia-blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95%            { transform: scaleY(0.08); }
  }
  @keyframes movia-wave-left {
    0%, 100% { transform: rotate(-15deg); }
    50%      { transform: rotate(10deg); }
  }
  @keyframes movia-wave-right {
    0%, 100% { transform: rotate(15deg); }
    50%      { transform: rotate(-10deg); }
  }
  @keyframes movia-antenna-pulse {
    0%, 100% { opacity: 1; r: 4; }
    50%      { opacity: 0.4; r: 6; }
  }
  @keyframes movia-antenna-fast {
    0%, 100% { opacity: 1; }
    25%      { opacity: 0.2; }
    75%      { opacity: 0.8; }
  }
  @keyframes movia-eye-glow {
    0%, 100% { fill: #00e5ff; filter: drop-shadow(0 0 3px #00e5ff); }
    50%      { fill: #80ffff; filter: drop-shadow(0 0 8px #00e5ff); }
  }
  @keyframes movia-think {
    0%, 100% { transform: rotate(0deg); }
    25%      { transform: rotate(-8deg); }
    75%      { transform: rotate(8deg); }
  }
  @keymoviaframes movia-celebrate-arm-left {
    0%, 100% { transform: rotate(-15deg); }
    50%      { transform: rotate(-80deg) translateY(-10px); }
  }
  @keyframes movia-celebrate {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25%      { transform: scale(1.1) rotate(-5deg); }
    75%      { transform: scale(1.1) rotate(5deg); }
  }
  @keyframes movia-spin-eye {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .movia-bob     { animation: movia-bob 3s ease-in-out infinite; }
  .movia-blink   { animation: movia-blink 4s ease-in-out infinite; transform-origin: center; }
  .movia-blink-delay { animation: movia-blink 4s ease-in-out 2s infinite; transform-origin: center; }
  .movia-arm-l   { animation: movia-wave-left  3s ease-in-out infinite; transform-origin: top right; }
  .movia-arm-r   { animation: movia-wave-right 3s ease-in-out infinite; transform-origin: top left; }
  .movia-antenna { animation: movia-antenna-pulse 1.5s ease-in-out infinite; }
  .movia-antenna-fast { animation: movia-antenna-fast 0.4s ease-in-out infinite; }
  .movia-think   { animation: movia-think 0.8s ease-in-out infinite; transform-origin: center; }
  .movia-celebrate { animation: movia-celebrate 0.5s ease-in-out infinite; }
  .movia-eye-glow { animation: movia-eye-glow 2s ease-in-out infinite; }
  .movia-eye-glow-active { animation: movia-eye-glow 0.5s ease-in-out infinite; }
`

export default function MovIARobot({ state = 'idle', size = 80 }) {
  // state: 'idle' | 'typing' | 'thinking' | 'celebrating'
  const scale = size / 100

  const bodyClass = state === 'celebrating' ? 'movia-celebrate' : 'movia-bob'
  const eyeClass = state === 'typing' ? 'movia-eye-glow-active' : 'movia-eye-glow'
  const antennaClass = state === 'typing' ? 'movia-antenna-fast' : 'movia-antenna'
  const headClass = state === 'thinking' ? 'movia-think' : ''
  const [armLeftClass, armRightClass] = state === 'celebrating'
    ? ['', '']
    : ['movia-arm-l', 'movia-arm-r']

  const celebrateLeftArmTransform = state === 'celebrating' ? 'rotate(-80deg) translateY(-10px)' : ''
  const celebrateRightArmTransform = state === 'celebrating' ? 'rotate(80deg) translateY(-10px)' : ''

  return (
    <>
      <style>{ROBOT_STYLES}</style>
      <svg
        viewBox="0 0 100 120"
        width={size}
        height={size * 1.2}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'block' }}
      >
        {/* Glow filter definition */}
        <defs>
          <filter id="movia-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="movia-body-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="movia-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a4080" />
            <stop offset="100%" stopColor="#003366" />
          </linearGradient>
          <linearGradient id="movia-head-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#004a99" />
            <stop offset="100%" stopColor="#003366" />
          </linearGradient>
          <radialGradient id="movia-eye-grad">
            <stop offset="0%" stopColor="#80ffff" />
            <stop offset="100%" stopColor="#00e5ff" />
          </radialGradient>
        </defs>

        {/* ── Floating group (bob animation) ── */}
        <g className={bodyClass} style={{ transformOrigin: '50px 60px' }}>

          {/* ── ANTENNA ── */}
          <line x1="50" y1="10" x2="50" y2="22" stroke="#007A4D" strokeWidth="2" strokeLinecap="round" />
          <circle
            cx="50" cy="7" r="4.5"
            fill="#007A4D"
            className={antennaClass}
            filter="url(#movia-glow)"
          />

          {/* ── HEAD ── */}
          <g className={headClass} style={{ transformOrigin: '50px 30px' }}>
            <rect x="26" y="20" width="48" height="36" rx="10" ry="10"
              fill="url(#movia-head-grad)"
              stroke="#005bb5" strokeWidth="1.5"
            />
            {/* Visor bar */}
            <rect x="28" y="26" width="44" height="16" rx="6"
              fill="#0a1628" stroke="#00e5ff" strokeWidth="0.8" opacity="0.9"
            />
            {/* Left eye */}
            <circle cx="39" cy="34" r="6" fill="#0a1628" />
            <circle cx="39" cy="34" r="4.5"
              fill="url(#movia-eye-grad)"
              className={`${eyeClass} ${state === 'thinking' ? '' : 'movia-blink'}`}
              filter="url(#movia-glow)"
            />
            <circle cx="40.5" cy="32.5" r="1.5" fill="white" opacity="0.8" />
            {/* Right eye */}
            <circle cx="61" cy="34" r="6" fill="#0a1628" />
            <circle cx="61" cy="34" r="4.5"
              fill="url(#movia-eye-grad)"
              className={`${eyeClass} ${state === 'thinking' ? '' : 'movia-blink-delay'}`}
              filter="url(#movia-glow)"
            />
            <circle cx="62.5" cy="32.5" r="1.5" fill="white" opacity="0.8" />
            {/* Mouth */}
            <path
              d={state === 'celebrating' ? 'M 36 46 Q 50 52 64 46' : 'M 36 47 Q 50 52 64 47'}
              stroke="#007A4D" strokeWidth="2" fill="none" strokeLinecap="round"
            />
          </g>

          {/* ── LEFT ARM ── */}
          <g
            className={armLeftClass}
            style={{
              transformOrigin: '25px 65px',
              transform: celebrateLeftArmTransform,
              transition: 'transform 0.3s'
            }}
          >
            <rect x="12" y="60" width="14" height="28" rx="7"
              fill="url(#movia-body-grad)" stroke="#005bb5" strokeWidth="1.2"
            />
            {/* Hand */}
            <circle cx="19" cy="90" r="5" fill="#004a99" stroke="#007A4D" strokeWidth="1" />
          </g>

          {/* ── BODY ── */}
          <rect x="25" y="56" width="50" height="44" rx="10"
            fill="url(#movia-body-grad)"
            stroke="#005bb5" strokeWidth="1.5"
          />
          {/* Body details - chest panel */}
          <rect x="32" y="62" width="36" height="20" rx="5"
            fill="#0a1628" stroke="#007A4D" strokeWidth="0.8"
          />
          {/* Chest LEDs */}
          <circle cx="40" cy="69" r="2.5" fill="#007A4D" filter="url(#movia-glow)" />
          <circle cx="50" cy="69" r="2.5" fill="#0066cc" filter="url(#movia-glow)" />
          <circle cx="60" cy="69" r="2.5" fill="#007A4D" filter="url(#movia-glow)" />
          {/* Chest label */}
          <text x="50" y="80" textAnchor="middle" fontSize="5.5" fill="#007A4D" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            MOV-IA
          </text>
          {/* Body vents */}
          <line x1="32" y1="88" x2="68" y2="88" stroke="#005bb5" strokeWidth="1" opacity="0.6" />
          <line x1="32" y1="92" x2="68" y2="92" stroke="#005bb5" strokeWidth="0.8" opacity="0.4" />

          {/* ── RIGHT ARM ── */}
          <g
            className={armRightClass}
            style={{
              transformOrigin: '75px 65px',
              transform: celebrateRightArmTransform,
              transition: 'transform 0.3s'
            }}
          >
            <rect x="74" y="60" width="14" height="28" rx="7"
              fill="url(#movia-body-grad)" stroke="#005bb5" strokeWidth="1.2"
            />
            <circle cx="81" cy="90" r="5" fill="#004a99" stroke="#007A4D" strokeWidth="1" />
          </g>

          {/* ── LEGS ── */}
          <rect x="33" y="98" width="14" height="18" rx="7"
            fill="url(#movia-body-grad)" stroke="#005bb5" strokeWidth="1.2"
          />
          <rect x="53" y="98" width="14" height="18" rx="7"
            fill="url(#movia-body-grad)" stroke="#005bb5" strokeWidth="1.2"
          />
          {/* Feet */}
          <ellipse cx="40" cy="116" rx="9" ry="4" fill="#003366" stroke="#005bb5" strokeWidth="1" />
          <ellipse cx="60" cy="116" rx="9" ry="4" fill="#003366" stroke="#005bb5" strokeWidth="1" />

          {/* ── SHADOW ── */}
          <ellipse cx="50" cy="120" rx="22" ry="4" fill="#000" opacity="0.15" />
        </g>

        {/* ── CELEBRATION CONFETTI (when state = celebrating) ── */}
        {state === 'celebrating' && (
          <>
            <style>{`
              @keyframes confetti1 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(-20px,-40px) rotate(360deg);opacity:0} }
              @keyframes confetti2 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(20px,-50px) rotate(-360deg);opacity:0} }
              @keyframes confetti3 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(-10px,-35px) rotate(180deg);opacity:0} }
              @keyframes confetti4 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(15px,-45px) rotate(-180deg);opacity:0} }
              .cf1{animation:confetti1 1s ease-out infinite} .cf2{animation:confetti2 1.2s ease-out 0.2s infinite}
              .cf3{animation:confetti3 0.9s ease-out 0.1s infinite} .cf4{animation:confetti4 1.1s ease-out 0.3s infinite}
            `}</style>
            <circle className="cf1" cx="30" cy="40" r="3" fill="#fbbf24" />
            <rect  className="cf2" x="65" y="35" width="5" height="5" fill="#f472b6" />
            <circle className="cf3" cx="20" cy="55" r="2.5" fill="#4ade80" />
            <rect  className="cf4" x="72" y="50" width="4" height="4" fill="#60a5fa" />
          </>
        )}
      </svg>
    </>
  )
}
