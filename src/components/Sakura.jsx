// Beautiful falling sakura petal animation with pink background and top/bottom borders
export default function Sakura({ count = 50 }) {
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 12,
    duration: 7 + Math.random() * 8,
    swayDur: 2.5 + Math.random() * 3,
    size: ['petal-1', 'petal-lg', 'petal-sm'][Math.floor(Math.random() * 3)],
    sway: Math.random() > 0.5 ? 'sway' : 'sway-reverse',
    maxOpacity: 0.25 + Math.random() * 0.3,
  }))

  // Border petals — static at top and bottom edges
  const borderPetals = Array.from({ length: 24 }).map((_, i) => ({
    id: `bp-${i}`,
    left: (i / 24) * 100 + 2,
    scale: 0.8 + ((i * 37) % 25) / 100,
    rotation: ((i * 137) % 360) - 180,
    color: ['#FFB7C5', '#FF91A4', '#FFA5B8', '#FFCAD4', '#FFD1DC', '#FF8EB5'][i % 6],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Pink background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF0F5] via-[#FFE4ED] to-[#FFB7C5]" />

      {/* ═══════ Sakura Top Border — removed ═══════ */}
      {/* <div className="absolute top-12 left-0 right-0 h-16 overflow-hidden" /> */}

      {/* ═══════ Sakura Bottom Border ── ═══════ */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        {/* Dense overlapping petals */}
        {borderPetals.map((p) => (
          <BorderPetal key={p.id} {...p} position="bottom" />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFB7C5]/40 via-[#FFB7C5]/20 to-transparent" style={{ zIndex: 2 }} />
      </div>

      {/* Soft bokeh lights */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`bokeh-${i}`}
          className="absolute rounded-full animate-pulse-soft"
          style={{
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, rgba(255,183,197,${0.08 + Math.random() * 0.1}) 0%, transparent 70%)`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Falling petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          className={`sakura-petal ${p.size} ${p.sway}`}
          style={{
            left: `${p.left}%`,
            '--delay': `${p.delay}s`,
            '--fall-duration': `${p.duration}s`,
            '--sway-dur': `${p.swayDur}s`,
            '--max-opacity': `${p.maxOpacity}`,
          }}
        />
      ))}
    </div>
  )
}

function BorderPetal({ left, scale, rotation, color, position }) {
  return (
    <div
      className="absolute"
      style={{
        left: `${left}%`,
        top: position === 'top' ? '-4px' : undefined,
        bottom: position === 'bottom' ? '-4px' : undefined,
        transform: `translate(-50%, ${position === 'top' ? '0%' : '-100%'}) rotate(${rotation}deg) scale(${scale})`,
        zIndex: 1,
      }}
    >
      <svg width="55" height="55" viewBox="0 0 64 64" style={{ opacity: 0.85 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i * 72 - 90) * (Math.PI / 180)
          const cx = 32 + 20 * Math.cos(a)
          const cy = 32 + 20 * Math.sin(a)
          return (
            <ellipse key={i} cx={cx} cy={cy} rx={14} ry={18} fill={color} opacity={0.85} transform={`rotate(${i * 72 - 90}, ${cx}, ${cy})`} />
          )
        })}
        <circle cx="32" cy="32" r="11" fill="#FF69B4" opacity={0.85} />
        <circle cx="32" cy="32" r="5" fill="#FFD700" opacity={0.9} />
      </svg>
    </div>
  )
}
