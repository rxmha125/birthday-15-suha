import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { experience } from '../content'

const paperPile = [
  ['pink', 10, 12, -9], ['blue', 24, 8, 7], ['red', 38, 15, -4], ['dark', 54, 9, 10],
  ['pink', 68, 16, -7], ['blue', 80, 10, 5], ['red', 16, 31, 8], ['dark', 31, 27, -11],
  ['pink', 47, 34, 6], ['blue', 63, 29, -5], ['red', 77, 34, 9], ['dark', 7, 48, -4],
  ['pink', 23, 49, 11], ['blue', 40, 45, -8], ['red', 57, 50, 4], ['dark', 73, 46, -10],
]

function readStoredJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value && typeof value === 'object' ? value : fallback
  } catch {
    return fallback
  }
}

function restoreCooldown() {
  const stored = readStoredJson(experience.jar.cooldownStorageKey, {})
  const availableAt = Number(stored.availableAt)
  return Number.isFinite(availableAt) && availableAt > Date.now() ? availableAt : 0
}

function restoreLastDraw() {
  const stored = readStoredJson(experience.jar.cooldownStorageKey, {})
  const category = experience.jar.categories.find(item => item.id === stored.categoryId)
  const index = Number(stored.noteIndex)
  if (!category || !Number.isInteger(index) || index < 0 || index >= category.notes.length) return null
  return { category, note: category.notes[index], index }
}

function restoreIndexes() {
  const stored = readStoredJson(experience.jar.indexesStorageKey, {})
  return Object.fromEntries(experience.jar.categories.map(category => {
    const value = Number(stored[category.id])
    return [category.id, Number.isInteger(value) && value >= -1 && value < category.notes.length ? value : -1]
  }))
}

function formatRemaining(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000))
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

export default function MemoryJar({ returnToFinal }) {
  const reduced = useReducedMotion()
  const [selection, setSelection] = useState(null)
  const [lastDraw, setLastDraw] = useState(restoreLastDraw)
  const [phase, setPhase] = useState('idle')
  const [availableAt, setAvailableAt] = useState(restoreCooldown)
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, restoreCooldown() - Date.now()))
  const noteIndexes = useRef(restoreIndexes())
  const timers = useRef([])
  const coolingDown = remainingMs > 0

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }

  useEffect(() => clearTimers, [])

  useEffect(() => {
    if (!availableAt) {
      setRemainingMs(0)
      return undefined
    }

    const updateRemaining = () => {
      const remaining = Math.max(0, availableAt - Date.now())
      setRemainingMs(remaining)
      if (!remaining) {
        setAvailableAt(0)
        localStorage.removeItem(experience.jar.cooldownStorageKey)
      }
    }

    updateRemaining()
    const interval = window.setInterval(updateRemaining, 1000)
    return () => window.clearInterval(interval)
  }, [availableAt])

  const beginReveal = nextSelection => {
    setSelection(nextSelection)
    if (reduced) {
      setPhase('open')
      return
    }
    setPhase('drawing')
    timers.current.push(window.setTimeout(() => setPhase('opening'), 720))
    timers.current.push(window.setTimeout(() => setPhase('open'), 1180))
  }

  const drawNote = (category, afterClosing = false) => {
    if (coolingDown || (!afterClosing && phase !== 'idle')) return
    clearTimers()
    const nextIndex = (noteIndexes.current[category.id] + 1) % category.notes.length
    noteIndexes.current[category.id] = nextIndex
    localStorage.setItem(experience.jar.indexesStorageKey, JSON.stringify(noteIndexes.current))

    const nextSelection = { category, note: category.notes[nextIndex], index: nextIndex }
    const nextAvailableAt = Date.now() + experience.jar.cooldownMs
    localStorage.setItem(experience.jar.cooldownStorageKey, JSON.stringify({
      availableAt: nextAvailableAt,
      categoryId: category.id,
      noteIndex: nextIndex,
    }))
    setLastDraw(nextSelection)
    setAvailableAt(nextAvailableAt)
    setRemainingMs(experience.jar.cooldownMs)
    beginReveal(nextSelection)
  }

  const closeNote = () => {
    clearTimers()
    if (reduced) {
      setSelection(null)
      setPhase('idle')
      return
    }
    setPhase('closing')
    timers.current.push(window.setTimeout(() => {
      setSelection(null)
      setPhase('idle')
    }, 420))
  }

  const drawAgain = () => {
    if (!selection || coolingDown || phase !== 'open') return
    const category = selection.category
    clearTimers()
    setPhase('closing')
    timers.current.push(window.setTimeout(() => {
      setSelection(null)
      setPhase('idle')
      drawNote(category, true)
    }, reduced ? 0 : 420))
  }

  const reopenLastNote = () => {
    if (!lastDraw || phase !== 'idle') return
    clearTimers()
    setSelection(lastDraw)
    setPhase('open')
  }

  return <motion.main className="memory-jar-screen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: reduced ? .01 : .65 }}>
    <button className="return-letter" type="button" onClick={returnToFinal}>final note</button>

    <header className="memory-jar-heading">
      <span>{experience.jar.eyebrow}</span>
      <h1>{experience.jar.title}</h1>
      <p>{experience.jar.prompt}</p>
    </header>

    <section className="memory-jar-experience" aria-label="A jar of notes for different kinds of days">
      <div className="jar-scene">
        <motion.div className="jar-shadow" animate={reduced ? undefined : { scaleX: [1, 1.04, 1], opacity: [.15, .21, .15] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="glass-jar" aria-hidden="true">
          <div className="jar-mouth"><i /><i /></div>
          <div className="jar-neck" />
          <div className="jar-body">
            <span className="jar-glass-shine jar-glass-shine-a" />
            <span className="jar-glass-shine jar-glass-shine-b" />
            <span className="jar-label"><small>a handful of words</small><strong>{experience.jar.jarLabel}</strong></span>
            <div className="paper-pile">{paperPile.map(([color, left, bottom, rotate], index) => <motion.i key={`${color}-${index}`} className={`folded-paper paper-${color}`} style={{ left: `${left}%`, bottom: `${bottom}%`, rotate }} animate={reduced ? undefined : { y: [0, index % 2 ? -1.8 : 1.4, 0], rotate: [rotate, rotate + (index % 2 ? 1.5 : -1.2), rotate] }} transition={{ duration: 3.4 + (index % 5) * .45, delay: index * .08, repeat: Infinity, ease: 'easeInOut' }} />)}</div>
          </div>
        </div>

        <AnimatePresence>
          {selection && phase !== 'open' && <motion.div key={`flying-${selection.category.id}-${selection.index}`} className={`flying-note paper-${selection.category.color}`} initial={reduced ? { opacity: 0 } : { x: '-50%', y: 64, rotate: -8, scale: .72, opacity: 0 }} animate={phase === 'closing' ? { x: '-50%', y: 62, rotate: 7, scale: .7, opacity: 0 } : phase === 'opening' ? { x: '-50%', y: -122, rotate: 0, scaleX: 1.65, scaleY: 1.12, opacity: 1 } : { x: '-50%', y: -85, rotate: 7, scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: phase === 'opening' ? .48 : .7, ease: [0.22, 1, .36, 1] }}><i /><span /></motion.div>}
        </AnimatePresence>
      </div>

      <div className="jar-categories" aria-label="Choose a note category">
        {experience.jar.categories.map(category => <motion.button key={category.id} className={`jar-category category-${category.color}`} type="button" onClick={() => drawNote(category)} disabled={coolingDown || phase !== 'idle'} whileTap={{ scale: .96 }} aria-label={coolingDown ? `${category.label}. Another note is available in ${formatRemaining(remainingMs)}` : `Draw a note for ${category.label}`}>
          <i aria-hidden="true" />
          <span>{category.label}</span>
        </motion.button>)}
      </div>

      <AnimatePresence mode="wait">
        {coolingDown ? <motion.div className="jar-cooldown" key="cooldown" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
          <span>{experience.jar.cooldownLabel}</span>
          <strong>{formatRemaining(remainingMs)}</strong>
          {lastDraw && phase === 'idle' && <button type="button" onClick={reopenLastNote}>{experience.jar.reopenNote}</button>}
        </motion.div> : lastDraw && <motion.p className="jar-ready" key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{experience.jar.readyLabel}</motion.p>}
      </AnimatePresence>
    </section>

    <AnimatePresence>
      {selection && phase === 'open' && <motion.div className="opened-note-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? .01 : .3 }} role="presentation" onPointerDown={event => event.target === event.currentTarget && closeNote()}>
        <motion.article className={`opened-jar-note note-${selection.category.color}`} role="dialog" aria-modal="true" aria-labelledby="jar-note-title" initial={reduced ? { opacity: 0 } : { opacity: 0, y: 62, scaleX: .32, scaleY: .22, rotate: -3 }} animate={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: 42, scale: .5, rotate: 3 }} transition={{ duration: reduced ? .01 : .62, ease: [0.22, 1, .36, 1] }}>
          <span className="note-fold note-fold-top" aria-hidden="true" />
          <span className="note-fold note-fold-side" aria-hidden="true" />
          <button className="note-close" type="button" onClick={closeNote} aria-label="Close this note">×</button>
          <header><i aria-hidden="true" /><span id="jar-note-title">{selection.category.label}</span></header>
          <p>{selection.note}</p>
          <footer>
            <button type="button" onClick={closeNote}>{experience.jar.closeNote}</button>
            <button type="button" className="draw-again" onClick={drawAgain} disabled={coolingDown} aria-label={coolingDown ? `Draw another note in ${formatRemaining(remainingMs)}` : experience.jar.drawAgain}>{coolingDown ? formatRemaining(remainingMs) : experience.jar.drawAgain} <span aria-hidden="true">↻</span></button>
          </footer>
        </motion.article>
      </motion.div>}
    </AnimatePresence>
  </motion.main>
}
