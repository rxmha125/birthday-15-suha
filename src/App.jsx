import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { dateGate, experience, previewAccess } from './content'
import LivingSketch from './components/LivingSketch'
import MemoryJar from './components/MemoryJar'

const spring = { type: 'spring', stiffness: 260, damping: 26, mass: 0.8 }

function gateDate() {
  return Date.UTC(dateGate.year, dateGate.month, dateGate.day, dateGate.hour, dateGate.minute)
}

function timeAtGateZone(now) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: dateGate.timeZone,
    year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23',
  }).formatToParts(new Date(now)).reduce((value, part) => ({ ...value, [part.type]: part.value }), {})
  return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second))
}

function beforeBirthday(now = Date.now()) {
  if (!dateGate.enabled) return false
  return timeAtGateZone(now) < gateDate()
}

function timeUntil(now) {
  const difference = Math.max(0, gateDate() - timeAtGateZone(now))
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference % 86400000) / 3600000),
    minutes: Math.floor((difference % 3600000) / 60000),
    seconds: Math.floor((difference % 60000) / 1000),
  }
}

function hasPreviewPassword() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path !== '/admin/pass') return false

  const rawQuery = window.location.search.slice(1)
  const namedPassword = new URLSearchParams(window.location.search).get('password')
  return (namedPassword || rawQuery) === previewAccess.password
}

function initialView() {
  if (!hasPreviewPassword()) return 'deck'
  const requestedView = new URLSearchParams(window.location.search).get('view')
  return ['deck', 'letter', 'garden', 'wish', 'sketch', 'final', 'jar'].includes(requestedView) ? requestedView : 'deck'
}

function previewStartsOpen() {
  return hasPreviewPassword() && new URLSearchParams(window.location.search).get('open') === 'true'
}

function previewSketchPage() {
  if (!hasPreviewPassword()) return 0
  const page = Number(new URLSearchParams(window.location.search).get('page'))
  return Number.isInteger(page) && page >= 1 && page <= 3 ? page - 1 : 0
}

function Ambient() {
  return <div className="ambient" aria-hidden="true">
    <motion.div className="ambient-blob ambient-rose" animate={{ x: [0, 28, -8, 0], y: [0, -22, 13, 0], scale: [1, 1.08, .97, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.div className="ambient-blob ambient-sage" animate={{ x: [0, -25, 11, 0], y: [0, 17, -13, 0], scale: [1, .95, 1.07, 1] }} transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.div className="ambient-blob ambient-gold" animate={{ x: [0, 16, -18, 0], y: [0, -15, 10, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
  </div>
}

function Accent({ type }) {
  if (type === 'orbit') return <motion.svg className="accent-svg" viewBox="0 0 160 120" fill="none" aria-hidden="true">
    <motion.path d="M80 95C80 67 81 49 80 25M80 58C58 55 47 44 44 28M80 66C103 62 113 48 116 33" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: .75 }} transition={{ duration: 2.4, ease: 'easeInOut' }} />
    <motion.path d="M44 28C36 24 37 15 44 14C52 17 52 25 44 28ZM116 33C108 31 108 22 115 20C123 23 123 31 116 33Z" fill="currentColor" initial={{ opacity: 0, scale: .7 }} animate={{ opacity: [.25, .82, .55], scale: [.88, 1.08, 1] }} transition={{ duration: 3.8, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '80px 58px' }} />
    <motion.circle cx="80" cy="22" r="6" fill="currentColor" animate={{ scale: [.87, 1.08, .87], opacity: [.5, .9, .5] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />
  </motion.svg>
  if (type === 'petals') return <div className="petal-field" aria-hidden="true">{[...Array(7)].map((_, i) => <motion.i key={i} className="petal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: [.15, .7, .15], y: [12, -12, 12], x: [0, i % 2 ? 7 : -6, 0], rotate: [0, i % 2 ? 25 : -25, 0] }} transition={{ duration: 3.6 + i * .28, delay: i * .2, repeat: Infinity, ease: 'easeInOut' }} style={{ left: `${12 + i * 13}%`, top: `${40 + (i % 3) * 12}%` }} />)}</div>
  if (type === 'ripple') return <div className="ripple" aria-hidden="true">{[0, 1, 2].map(i => <motion.span key={i} animate={{ scale: [0.75, 1.12], opacity: [.45, 0] }} transition={{ duration: 3.5, delay: i * 1.1, repeat: Infinity, ease: 'easeOut' }} />)}</div>
  if (type === 'blob') return <motion.div className="morph-blob" aria-hidden="true" animate={{ borderRadius: ['44% 56% 61% 39% / 45% 38% 62% 55%', '59% 41% 38% 62% / 53% 60% 40% 47%', '44% 56% 61% 39% / 45% 38% 62% 55%'], rotate: [0, 7, 0], scale: [1, 1.08, 1] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
  if (type === 'constellation') return <svg className="accent-svg constellation" viewBox="0 0 160 120" aria-hidden="true"><motion.path d="M31 78L61 38L92 70L128 34" fill="none" stroke="currentColor" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: .55 }} transition={{ duration: 2.2, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1.4 }} />{[[31,78],[61,38],[92,70],[128,34]].map(([cx,cy], i) => <motion.circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" animate={{ opacity: [.25, .9, .25], scale: [.8, 1.25, .8] }} transition={{ duration: 2.8, delay: i*.28, repeat: Infinity }} />)}</svg>
  if (type === 'sun') return <motion.div className="soft-sun" aria-hidden="true" animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'], scale: [1, 1.06, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
  return <div className="fold-accent" aria-hidden="true"><motion.span animate={{ rotate: [0, 180] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} /><motion.span animate={{ rotate: [180, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} /></div>
}

function Card({ card, index, active, onDismiss, onUnfold, hasInteracted }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-180, 0, 180], [-7, 0, 7])
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0])
  const isLast = index === experience.cards.length - 1
  const dragEnd = (_, info) => {
    if (Math.abs(info.offset.x) > 78 || Math.abs(info.velocity.x) > 550) isLast ? onUnfold() : onDismiss()
  }
  return <motion.article
    className={`card ${active ? 'card-active' : 'card-peek'}`}
    style={active ? { x, rotate, opacity, zIndex: 20 } : { zIndex: 10 - index }}
    initial={{ opacity: 0, scale: .94, y: 20 }}
    animate={active ? { opacity: 1, scale: 1, y: 0 } : { opacity: .48, scale: .94 - Math.min(index, 3) * .025, y: Math.min(index, 3) * 11 }}
    exit={{ x: 500, rotate: 12, opacity: 0, transition: { duration: .34, ease: 'easeIn' } }}
    transition={spring}
    drag={active ? 'x' : false}
    dragConstraints={{ left: 0, right: 0 }}
    dragElastic={.72}
    onDragEnd={dragEnd}
    onPointerDown={hasInteracted}
    onClick={() => isLast && active && onUnfold()}
  >
    <div className="card-topline"><span>{String(index + 1).padStart(2, '0')}</span><span>{isLast ? 'open' : 'keep going'}</span></div>
    <Accent type={card.accent} />
    <p className="card-line">{card.line}</p>
    {active && !isLast && <motion.div className="gesture-hint" animate={{ x: [0, 8, 0], opacity: [0, .65, .65, 0] }} transition={{ duration: 2.8, repeat: hasInteracted ? 0 : Infinity, delay: .9 }}><span>swipe</span><b>→</b></motion.div>}
    {active && isLast && <div className="open-hint">tap or swipe to unfold</div>}
  </motion.article>
}

function Deck({ unfold, jarDiscovered, openJar }) {
  const [current, setCurrent] = useState(0)
  const [touched, setTouched] = useState(false)
  const visibleCards = useMemo(() => experience.cards.slice(current, current + 3).reverse(), [current])
  return <main className="deck-shell">
    {jarDiscovered && <motion.button className="love-jar-shortcut" type="button" onClick={openJar} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .5 }}>
      <i aria-hidden="true"><span /></i>{experience.jar.shortcutLabel}
    </motion.button>}
    <div className="deck" aria-label="Birthday messages">{visibleCards.map((card, reversedIndex) => {
      const absoluteIndex = current + (visibleCards.length - 1 - reversedIndex)
      return <Card key={absoluteIndex} card={card} index={absoluteIndex} active={absoluteIndex === current} onDismiss={() => setCurrent(n => Math.min(n + 1, experience.cards.length - 1))} onUnfold={unfold} hasInteracted={() => setTouched(true)} />
    })}</div>
  </main>
}

function Letter({ openGarden }) {
  return <motion.main className="letter-screen" initial={{ clipPath: 'inset(45% 20% round 28px)', opacity: .4 }} animate={{ clipPath: 'inset(0% 0% round 0px)', opacity: 1 }} transition={{ duration: .85, ease: [0.22, 1, .36, 1] }}>
    <motion.div className="letter" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .48, delayChildren: .55 } } }}>
      <motion.p className="letter-to" variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>{experience.recipient},</motion.p>
      {experience.letter.map((line, i) => <motion.p className="letter-line" key={i} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: .8, ease: [0.22, 1, .36, 1] } } }}>{line}</motion.p>)}
      <motion.p className="letter-signature" variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>{experience.signature}</motion.p>
      <motion.div className="keepsake-wrap" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
        <p className="keepsake-note">{experience.keepsake}</p>
      </motion.div>
      <motion.button className="garden-entry" type="button" onClick={openGarden} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
        one more small thing <span>→</span>
      </motion.button>
    </motion.div>
  </motion.main>
}

function GardenTree({ bloom, index }) {
  const shapes = ['tree-round', 'tree-pine', 'tree-bloom', 'tree-cypress']
  const shape = shapes[index % shapes.length]
  const id = `tree-${index}`
  return <motion.div className={`tree ${shape}`} style={{ left: `${bloom.x}%`, top: `${bloom.y}%`, '--tree-scale': bloom.scale }} initial={{ scale: 0, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 17, delay: .04 }}>
    <span className="tree-shadow" />
    <motion.svg className="tree-art" viewBox="0 0 72 132" aria-hidden="true" animate={{ rotate: [0, index % 2 ? -2.6 : 2.6, 0], x: [0, index % 2 ? 2 : -2, 0] }} transition={{ duration: 3.2 + (index % 4) * .45, repeat: Infinity, ease: 'easeInOut' }}>
      <defs><linearGradient id={`${id}-trunk`} x1="0" x2="1"><stop stopColor="#7c6553" /><stop offset="1" stopColor="#b18d68" /></linearGradient><radialGradient id={`${id}-round`} cx="34%" cy="25%"><stop stopColor="#d1ddc6" /><stop offset="1" stopColor="#7f9f7f" /></radialGradient><radialGradient id={`${id}-bloom`} cx="35%" cy="25%"><stop stopColor="#f0d8d0" /><stop offset="1" stopColor="#c58f89" /></radialGradient></defs>
      <path d="M35 130V75M35 95L19 77M36 87L52 69" fill="none" stroke={`url(#${id}-trunk)`} strokeWidth="5" strokeLinecap="round" />
      {shape === 'tree-round' && <g fill={`url(#${id}-round)`}><circle cx="22" cy="57" r="17" /><circle cx="44" cy="48" r="21" /><circle cx="54" cy="65" r="16" /><circle cx="33" cy="70" r="21" /></g>}
      {shape === 'tree-bloom' && <g fill={`url(#${id}-bloom)`}><circle cx="22" cy="59" r="16" /><circle cx="43" cy="49" r="20" /><circle cx="55" cy="66" r="16" /><circle cx="34" cy="72" r="20" /></g>}
      {shape === 'tree-pine' && <g fill="#7f9d81"><path d="M36 15 10 75h52L36 15Z" /><path d="m36 35-31 59h62L36 35Z" fill="#90aa8d" /><path d="m36 55-34 59h68L36 55Z" fill="#7b987c" /></g>}
      {shape === 'tree-cypress' && <path d="M36 11C18 39 18 65 22 95h28c4-30 4-56-14-84Z" fill={`url(#${id}-round)`} />}
      {(shape === 'tree-round' || shape === 'tree-bloom') && <g fill="rgba(255,255,255,.28)"><circle cx="36" cy="42" r="3" /><circle cx="23" cy="58" r="2" /></g>}
    </motion.svg>
  </motion.div>
}

function Clouds() {
  return <div className="garden-clouds" aria-hidden="true">
    <motion.svg className="cloud cloud-a" viewBox="0 0 190 76" initial={{ x: '-48vw', opacity: 0 }} animate={{ x: ['-48vw', '116vw'], y: [8, -4, 8], opacity: [0, .78, .78, 0], rotate: [-3, -1, -3] }} transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}><path d="M14 60h150c15 0 26-9 26-21 0-14-12-24-26-24-6 0-11 2-15 5C143 8 132 2 118 2c-16 0-29 10-34 24-5-3-10-4-16-4-16 0-29 12-30 28-14 0-24 4-24 10Z" /></motion.svg>
    <motion.svg className="cloud cloud-b" viewBox="0 0 190 76" initial={{ x: '-48vw', opacity: 0 }} animate={{ x: ['-48vw', '116vw'], y: [-7, 5, -7], opacity: [0, .68, .68, 0], rotate: [3, 1, 3] }} transition={{ duration: 16, delay: -7.5, repeat: Infinity, ease: 'linear' }}><path d="M20 60h143c15 0 25-9 25-21 0-13-11-23-25-23-4 0-8 1-12 3C144 7 132 0 117 0c-17 0-31 10-36 25a31 31 0 0 0-14-4c-17 0-30 12-32 28-9 1-15 5-15 11 0 0 0 0 0 0Z" /></motion.svg>
  </div>
}

function Garden({ returnToLetter, goNext }) {
  const [blooms, setBlooms] = useState([])
  const [wish, setWish] = useState('')
  const addBloom = event => {
    if (blooms.length >= experience.garden.maxTrees) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.max(7, Math.min(93, ((event.clientX - bounds.left) / bounds.width) * 100))
    const rawY = ((event.clientY - bounds.top) / bounds.height) * 100
    // The terrain is a wide ellipse: its visible edge drops lower as it reaches
    // either side. This mirrors that curve so no roots can appear in the sky.
    const terrainEdge = 63 + 17 * Math.pow(Math.abs(x - 50) / 50, 1.75)
    if (rawY < terrainEdge || rawY > 90) return
    const y = Math.min(87, rawY)
    const next = blooms.length
    setBlooms(items => [...items, { x, y, scale: .72 + ((next * 17) % 30) / 100 }])
    setWish(experience.garden.wishes[next % experience.garden.wishes.length])
  }
  const finished = blooms.length === experience.garden.maxTrees
  return <motion.main className="garden-screen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .55 }}>
    <button className="return-letter" type="button" onClick={returnToLetter}>your letter</button>
    <button className="next-page" type="button" onClick={goNext}>Next <span>→</span></button>
    <header className="garden-heading"><p>{experience.garden.title}</p><span>{finished ? experience.garden.complete : experience.garden.prompt}</span></header>
    <div className="garden-stage" onPointerUp={addBloom} role="presentation">
      <Clouds />
      <div className="garden-ground" />
      <AnimatePresence>{blooms.map((bloom, index) => <GardenTree key={`${index}-${bloom.x}`} bloom={bloom} index={index} />)}</AnimatePresence>
      {!blooms.length && <motion.div className="garden-seed" animate={{ y: [0, -5, 0], opacity: [.38, .75, .38] }} transition={{ duration: 3.3, repeat: Infinity, ease: 'easeInOut' }}><i /><i /><i /></motion.div>}
    </div>
    <AnimatePresence mode="wait">{wish && <motion.p key={wish} className="garden-wish" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .5 }}>{wish}</motion.p>}</AnimatePresence>
  </motion.main>
}

// 15 candles in 3 offset rings (back/mid/front) so candles never stack at
// the same x across rings — that's what makes the 3D depth read correctly.
// 6 strawberries are scattered across the same 3 depths so they're not
// all bunched at the front rim. Every x/y pair is derived from the
// frosting ellipse so nothing can sit outside the cake surface. Items are
// sorted by depth (smaller = further back) so the painter's algorithm
// draws back items first, giving correct occlusion.
const cakeItems = (() => {
  const cx = 180, rxT = 118, ryT = 40, cyTop = 158
  const out = []

  const candleRings = [
    { depth: 0.2,  columns: [-0.66, -0.32, 0,     0.32,  0.66], scale: 0.88 }, // back ring (smallest, furthest away)
    { depth: 0.5,  columns: [-0.84, -0.42, 0,     0.42,  0.84], scale: 0.98 }, // middle ring (widest spread)
    { depth: 0.82, columns: [-0.66, -0.32, 0,     0.32,  0.66], scale: 1.06 }, // front ring (largest, nearest)
  ]
  let candleIdx = 0
  for (const ring of candleRings) {
    const depthSigned = ring.depth * 2 - 1
    for (const fx of ring.columns) {
      const x = cx + rxT * fx
      const halfH = ryT * Math.sqrt(1 - fx * fx)
      const y = cyTop + depthSigned * halfH
      out.push({
        kind: 'candle',
        x, y, scale: ring.scale,
        color: ['rose', 'cream', 'gold'][candleIdx % 3],
        depth: ring.depth,
        candleIdx,
      })
      candleIdx++
    }
  }

  const berrySpecs = [
    { fx: -0.5,  depth: 0.3,  r: -7, scale: 0.85 }, // back-left berry
    { fx:  0.5,  depth: 0.3,  r:  7, scale: 0.85 }, // back-right berry
    { fx: -0.74, depth: 0.55, r: -8, scale: 0.9  }, // mid-left berry (between candles)
    { fx:  0.74, depth: 0.55, r:  8, scale: 0.9  }, // mid-right berry
    { fx: -0.45, depth: 0.78, r: -5, scale: 0.95 }, // front-left berry
    { fx:  0.45, depth: 0.78, r:  5, scale: 0.95 }, // front-right berry
  ]
  berrySpecs.forEach((s, i) => {
    const x = cx + rxT * s.fx
    const halfH = ryT * Math.sqrt(1 - s.fx * s.fx)
    const depthSigned = s.depth * 2 - 1
    const y = cyTop + depthSigned * halfH
    out.push({
      kind: 'berry',
      x, y, scale: s.scale, r: s.r,
      depth: s.depth,
      berryIdx: i,
    })
  })

  // Painter's algorithm: smaller depth (further back) drawn first.
  out.sort((a, b) => a.depth - b.depth)
  return out
})()

function Candle({ item, wished, reduceMotion }) {
  const fill = item.color === 'rose'
    ? 'url(#rose-candle)'
    : item.color === 'cream'
      ? 'url(#cream-candle)'
      : 'url(#gold-candle)'
  return <g transform={`translate(${item.x} ${item.y}) scale(${item.scale})`}>
    <ellipse cx="1" cy="4" rx="9" ry="3.2" fill="#76564c" opacity=".2" transform="rotate(8)" />
    <rect x="-5" y="-40" width="10" height="44" rx="3" fill={fill} stroke="#6b4f47" strokeOpacity=".18" />
    <path d="M-4-30 4-24M-4-18 4-12" stroke="#fff" strokeOpacity=".34" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="0" cy="-38" rx="5.2" ry="2.1" fill="none" stroke="#ead0c1" strokeWidth="2.4" opacity=".9" />
    <path d="M0-40L0-47" stroke="#51443e" strokeWidth="1.8" strokeLinecap="round" />
    <g transform="translate(0 -47)">
      <AnimatePresence>{!wished && <motion.path key="flame" className="cake-flame" d="M0 0C-7-7-4-17 0-23C4-17 7-7 0 0Z" fill="url(#flame-fill)" initial={{ opacity: 0 }} animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scaleY: [.9, 1.12, .96, 1.05, .9], scaleX: [1, .92, 1.04, .94, 1] }} exit={{ opacity: 0, scale: .25 }} transition={reduceMotion ? { duration: .2 } : { opacity: { duration: .2 }, duration: 1.1 + (item.candleIdx % 4) * .12, repeat: Infinity, ease: 'easeInOut' }} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }} />}</AnimatePresence>
      {wished && <motion.path key="smoke" d="M0 0C-5-6 5-11 0-17C-5-23 5-28 0-34" fill="none" stroke="#8a827b" strokeWidth="2" strokeLinecap="round" initial={{ opacity: .5, pathLength: 0 }} animate={{ opacity: 0, pathLength: 1, y: -12 }} transition={{ duration: 1.4 + (item.candleIdx % 3) * .15, delay: item.candleIdx * .02, ease: 'easeOut' }} />}
    </g>
  </g>
}

function Berry({ item }) {
  return <g transform={`translate(${item.x} ${item.y}) rotate(${item.r}) scale(${item.scale})`}>
    <ellipse cx="0" cy="3" rx="14" ry="4.5" fill="#825e53" opacity=".22" />
    <path d="M0 4C-12-7-13-22 0-29 13-22 12-7 0 4Z" fill="#b9575d" stroke="#8f4149" strokeWidth="1" />
    <path d="M-8-24 0-34 8-24M-10-26 0-22 10-26" fill="#7d9273" stroke="#657a60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="-4" cy="-14" r="1" fill="#f1c49c" /><circle cx="4" cy="-8" r="1" fill="#f1c49c" /><circle cx="2" cy="-20" r="1" fill="#f1c49c" />
  </g>
}

function WishPage({ returnToGarden, continueJourney }) {
  const [wished, setWished] = useState(false)
  const reduceMotion = useReducedMotion()
  return <motion.main className="wish-screen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .55 }}>
    <button className="return-letter" type="button" onClick={returnToGarden}>garden</button>
    <button className="complete-page" type="button" onClick={continueJourney}>Next <span aria-hidden="true">→</span></button>
    <div className="wish-copy"><p>{experience.wish.title}</p><span>{wished ? experience.wish.complete : experience.wish.prompt}</span></div>
    <motion.button className={`cake-scene ${wished ? 'cake-wished' : ''}`} type="button" aria-label="Make a wish and blow out 15 candles" onClick={() => setWished(true)} whileTap={wished ? undefined : { scale: .975 }}>
      <svg className="birthday-cake-svg" viewBox="0 0 360 360" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="plate-top" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffaf2" /><stop offset=".5" stopColor="#ecdfce" /><stop offset="1" stopColor="#cdb79f" /></linearGradient>
          <linearGradient id="plate-side" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dcc9b2" /><stop offset="1" stopColor="#a98c74" /></linearGradient>
          <linearGradient id="cake-side" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#b98471" /><stop offset=".18" stopColor="#efd0bb" /><stop offset=".5" stopColor="#f8e2ce" /><stop offset=".82" stopColor="#ddb49e" /><stop offset="1" stopColor="#aa7567" /></linearGradient>
          <radialGradient id="frosting-top" cx="38%" cy="24%" r="78%"><stop stopColor="#fffdf7" /><stop offset=".56" stopColor="#f6e0d3" /><stop offset="1" stopColor="#cfa18f" /></radialGradient>
          <linearGradient id="cream-band" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff5e8" /><stop offset=".58" stopColor="#efd2c2" /><stop offset="1" stopColor="#d99ca1" /></linearGradient>
          <linearGradient id="rose-candle" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#ba6e78" /><stop offset=".45" stopColor="#e7aeb2" /><stop offset=".72" stopColor="#f1c9c5" /><stop offset="1" stopColor="#a95e69" /></linearGradient>
          <linearGradient id="cream-candle" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#c7ac73" /><stop offset=".5" stopColor="#fff0c7" /><stop offset="1" stopColor="#b99558" /></linearGradient>
          <linearGradient id="gold-candle" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#a77f45" /><stop offset=".5" stopColor="#e9cb8c" /><stop offset="1" stopColor="#97703c" /></linearGradient>
          <radialGradient id="flame-fill" cx="50%" cy="72%" r="70%"><stop stopColor="#fffce3" /><stop offset=".33" stopColor="#f4ce72" /><stop offset=".76" stopColor="#cf7f50" /><stop offset="1" stopColor="#cf7f50" stopOpacity="0" /></radialGradient>
          <filter id="cake-shadow-filter" x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="7" /></filter>
          <filter id="soft-depth" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#5d4137" floodOpacity=".2" /></filter>
          <clipPath id="cake-body-clip"><path d="M62 158L62 270A118 40 0 0 0 298 270L298 158A118 40 0 0 1 62 158Z" /></clipPath>
        </defs>
        <ellipse cx="180" cy="332" rx="150" ry="15" fill="#5d4b42" opacity=".17" filter="url(#cake-shadow-filter)" />
        <path d="M20 284A164 44 0 0 0 340 284L340 298A164 44 0 0 1 20 298Z" fill="url(#plate-side)" />
        <ellipse cx="180" cy="284" rx="164" ry="44" fill="url(#plate-top)" stroke="#c2ab93" strokeWidth="1.2" />
        <g filter="url(#soft-depth)">
          <path d="M62 158L62 270A118 40 0 0 0 298 270L298 158A118 40 0 0 1 62 158Z" fill="url(#cake-side)" />
        </g>
        <g clipPath="url(#cake-body-clip)">
          <path d="M82 158V286" stroke="#fff" strokeOpacity=".16" strokeWidth="16" />
        </g>
        <ellipse cx="180" cy="158" rx="118" ry="40" fill="url(#frosting-top)" stroke="#c99a88" strokeWidth="1.4" />
        <g clipPath="url(#cake-body-clip)">
          <path d="M62 158A118 40 0 0 1 298 158L298 206C276 224 256 206 236 220C214 234 196 212 176 224C156 234 138 212 118 222C100 232 80 214 62 206Z" fill="url(#cream-band)" />
        </g>
        <path d="M62 158A118 40 0 0 1 298 158" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
        {cakeItems.map((item) => item.kind === 'candle' ? (
          <Candle key={`candle-${item.candleIdx}`} item={item} wished={wished} reduceMotion={reduceMotion} />
        ) : (
          <Berry key={`berry-${item.berryIdx}`} item={item} />
        ))}
      </svg>
    </motion.button>
  </motion.main>
}

function CatPair() {
  return <motion.svg className="cat-pair" viewBox="0 0 280 150" aria-label="Two cats sitting together" role="img" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: .7 }}>
    <motion.g animate={{ rotate: [0, -1.5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '89px 124px' }}>
      <path d="M43 127V75l16-21 12 13 15-13 16 21v52H43Z" fill="#b89576" /><path d="M59 87c3-3 7-3 10 0M79 87c3-3 7-3 10 0M69 100l4 3 4-3" fill="none" stroke="#594c42" strokeWidth="2" strokeLinecap="round" /><path d="M43 119c-24 0-27-31-7-36" fill="none" stroke="#b89576" strokeWidth="11" strokeLinecap="round" />
    </motion.g>
    <motion.g animate={{ rotate: [0, 1.5, 0] }} transition={{ duration: 4.4, delay: .4, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '184px 124px' }}>
      <path d="M146 127V75l16-21 13 13 15-13 16 21v52h-60Z" fill="#9faf91" /><path d="M162 87c3-3 7-3 10 0M183 87c3-3 7-3 10 0M173 100l4 3 4-3" fill="none" stroke="#445047" strokeWidth="2" strokeLinecap="round" /><path d="M206 119c26 2 28-31 8-36" fill="none" stroke="#9faf91" strokeWidth="11" strokeLinecap="round" />
    </motion.g>
    <path d="M110 130c22 6 38 6 59 0" fill="none" stroke="#d5b67a" strokeWidth="2" strokeLinecap="round" opacity=".8" />
  </motion.svg>
}

function FinalPage({ openJar }) {
  return <motion.main className="final-screen" initial={{ clipPath: 'inset(15% 15% round 35px)', opacity: .2 }} animate={{ clipPath: 'inset(0% 0% round 0px)', opacity: 1 }} transition={{ duration: .85, ease: [0.22, 1, .36, 1] }}>
    <motion.div className="final-copy" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .35, delayChildren: .35 } } }}>
      <motion.h1 variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>{experience.final.title}</motion.h1>
      {experience.final.lines.map(line => <motion.p key={line} variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}>{line}</motion.p>)}
      <motion.em variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>{experience.final.signoff}</motion.em>
      <motion.button className="jar-entry" type="button" onClick={openJar} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
        {experience.final.jarLabel} <span aria-hidden="true">→</span>
      </motion.button>
    </motion.div>
    <CatPair />
  </motion.main>
}

function Teaser({ now }) {
  const remaining = timeUntil(now)
  return <main className="teaser"><motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}><p className="eyebrow">a small something awaits Suha</p><div className="countdown" aria-live="polite">{[['days', remaining.days], ['hours', remaining.hours], ['minutes', remaining.minutes], ['seconds', remaining.seconds]].map(([label, value]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div><p className="teaser-copy">until it unfolds</p><p className="release-date">14 August 2026 · 12:00 AM</p></motion.div></main>
}

export default function App() {
  const [view, setView] = useState(initialView)
  const [now, setNow] = useState(() => Date.now())
  const [previewUnlocked, setPreviewUnlocked] = useState(() => localStorage.getItem(previewAccess.storageKey) === 'true' || hasPreviewPassword())
  const [jarDiscovered, setJarDiscovered] = useState(() => localStorage.getItem(experience.jar.storageKey) === 'true')
  useEffect(() => {
    if (!dateGate.enabled) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    if (!hasPreviewPassword()) return
    localStorage.setItem(previewAccess.storageKey, 'true')
    setPreviewUnlocked(true)
  }, [])
  useEffect(() => {
    if (view !== 'jar') return
    localStorage.setItem(experience.jar.storageKey, 'true')
    setJarDiscovered(true)
  }, [view])
  const openJar = () => {
    localStorage.setItem(experience.jar.storageKey, 'true')
    setJarDiscovered(true)
    setView('jar')
  }
  const gated = beforeBirthday(now)
  return <div className="app min-h-[100svh] overflow-hidden text-stone-800"><Ambient /><AnimatePresence mode="wait">{gated && !previewUnlocked ? <Teaser key="teaser" now={now} /> : view === 'jar' ? <MemoryJar key="jar" returnToFinal={() => setView('final')} /> : view === 'final' ? <FinalPage key="final" openJar={openJar} /> : view === 'sketch' ? <LivingSketch key="sketch" initiallyOpen={previewStartsOpen()} initialPage={previewSketchPage()} returnToWish={() => setView('wish')} finish={() => setView('final')} /> : view === 'wish' ? <WishPage key="wish" returnToGarden={() => setView('garden')} continueJourney={() => setView('sketch')} /> : view === 'garden' ? <Garden key="garden" returnToLetter={() => setView('letter')} goNext={() => setView('wish')} /> : view === 'letter' ? <Letter key="letter" openGarden={() => setView('garden')} /> : <Deck key="deck" unfold={() => setView('letter')} jarDiscovered={jarDiscovered} openJar={openJar} />}</AnimatePresence></div>
}
