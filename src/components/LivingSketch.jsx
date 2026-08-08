import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { experience } from '../content'
import nightGalaxy from '../assets/night-sky/night-galaxy.jpg'
import spiralGalaxy from '../assets/night-sky/spiral-galaxy.jpg'
import starCluster from '../assets/night-sky/star-cluster.jpg'
import celestialFireworks from '../assets/night-sky/celestial-fireworks.jpg'
import doubleGalaxy from '../assets/night-sky/double-galaxy.jpg'
import dwarfGalaxy from '../assets/night-sky/dwarf-galaxy.jpg'

const easeOut = [0.22, 1, 0.36, 1]

const pageImages = [
  [
    { src: nightGalaxy, alt: 'An edge-on galaxy surrounded by distant stars', className: 'sky-photo-wide', label: 'still becoming' },
    { src: spiralGalaxy, alt: 'A luminous spiral galaxy in a field of stars', className: 'sky-photo-square', label: 'still full of wonder' },
  ],
  [
    { src: starCluster, alt: 'A dense glowing cluster containing thousands of stars', className: 'sky-photo-cluster', label: 'all that light' },
    { src: celestialFireworks, alt: 'A red celestial ribbon crossing a star field', className: 'sky-photo-ribbon', label: 'finding its way' },
    { src: doubleGalaxy, alt: 'A bright galaxy with a smaller companion nearby', className: 'sky-photo-small', label: 'never alone' },
  ],
  [
    { src: dwarfGalaxy, alt: 'A blue dwarf galaxy floating in deep space', className: 'sky-photo-hero', label: 'a universe of your own' },
  ],
]

const pageVariants = {
  enter: direction => ({ opacity: 0, x: direction > 0 ? 44 : -44, rotateY: direction > 0 ? -7 : 7, scale: .985 }),
  center: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
  exit: direction => ({ opacity: 0, x: direction > 0 ? -34 : 34, rotateY: direction > 0 ? 6 : -6, scale: .99 }),
}

function StarDust({ reduced }) {
  const stars = [[8,12],[20,29],[36,10],[53,22],[72,9],[87,31],[13,54],[31,69],[62,59],[84,76],[48,88],[92,91]]
  return <div className="scrapbook-stars" aria-hidden="true">{stars.map(([left, top], index) => <motion.i key={index} style={{ left: `${left}%`, top: `${top}%` }} animate={reduced ? { opacity: .45 } : { opacity: [.12, .65, .2], scale: [.7, 1.2, .75] }} transition={{ duration: 2.6 + index * .17, delay: index * .13, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }} />)}</div>
}

function Photo({ photo, index, reduced }) {
  return <motion.figure className={`sky-photo ${photo.className}`} initial={{ opacity: 0, y: 16, rotate: index % 2 ? 2 : -2 }} animate={{ opacity: 1, y: 0, rotate: index % 2 ? 1.1 : -1.1 }} transition={{ delay: reduced ? 0 : .15 + index * .16, duration: reduced ? .01 : .7, ease: easeOut }}>
    <div className="sky-photo-image">
      <motion.img src={photo.src} alt={photo.alt} draggable="false" animate={reduced ? undefined : { scale: [1.02, 1.085, 1.02], x: index % 2 ? [0, -4, 0] : [0, 4, 0] }} transition={{ duration: 11 + index * 2, repeat: Infinity, ease: 'easeInOut' }} />
      <span className="photo-shine" aria-hidden="true" />
    </div>
    <figcaption>{photo.label}</figcaption>
  </motion.figure>
}

function ScrapbookPage({ page, direction, reduced }) {
  const copy = experience.sketch.pages[page]
  return <motion.article className={`night-page night-page-${page + 1}`} custom={direction} variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: reduced ? .01 : .55, ease: easeOut }}>
    <StarDust reduced={reduced} />
    <header className="night-page-heading">
      <span>{copy.kicker}</span>
      <h2>{copy.title}</h2>
    </header>
    <div className={`night-collage night-collage-${page + 1}`}>{pageImages[page].map((photo, index) => <Photo key={photo.src} photo={photo} index={index} reduced={reduced} />)}</div>
    <motion.p className="night-page-note" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : .46, duration: reduced ? .01 : .65 }}>{copy.note}</motion.p>
    <span className="nasa-credit">{experience.sketch.credit}</span>
  </motion.article>
}

export default function LivingSketch({ initiallyOpen = false, initialPage = 0, returnToWish, finish }) {
  const [opened, setOpened] = useState(initiallyOpen)
  const [page, setPage] = useState(initialPage)
  const [direction, setDirection] = useState(1)
  const reduced = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 125, damping: 19 })
  const smoothY = useSpring(pointerY, { stiffness: 125, damping: 19 })
  const rotateY = useTransform(smoothX, [-.5, .5], [-1.8, 1.8])
  const rotateX = useTransform(smoothY, [-.5, .5], [1.4, -1.4])

  const moveBook = event => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width - .5)
    pointerY.set((event.clientY - bounds.top) / bounds.height - .5)
  }

  const resetBook = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  const previousPage = () => {
    setDirection(-1)
    setPage(current => Math.max(0, current - 1))
  }

  const nextPage = () => {
    if (page === pageImages.length - 1) {
      finish()
      return
    }
    setDirection(1)
    setPage(current => current + 1)
  }

  return <motion.main className="living-sketch-screen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: .65, ease: easeOut }}>
    <button className="return-letter" type="button" onClick={returnToWish}>your wish</button>
    <header className="living-sketch-heading" aria-live="polite">
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}>{opened ? experience.sketch.openEyebrow : experience.sketch.closedEyebrow}</motion.span>
      <AnimatePresence mode="wait"><motion.h1 key={opened ? 'open' : 'closed'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .45 }}>{opened ? experience.sketch.openTitle : experience.sketch.closedTitle}</motion.h1></AnimatePresence>
      {!opened && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }}>{experience.sketch.closedPrompt}</motion.p>}
    </header>

    <motion.div className={`living-book ${opened ? 'living-book-open' : ''}`} style={opened && !reduced ? { rotateX, rotateY } : undefined} onPointerMove={opened ? moveBook : undefined} onPointerLeave={resetBook}>
      <AnimatePresence mode="wait">
        {!opened ? <motion.button className="living-cover" key="cover" type="button" onClick={() => setOpened(true)} aria-label="Open the hidden sketchbook" initial={{ opacity: 0, rotateY: -8, scale: .94 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} exit={{ opacity: 0, rotateY: -88, x: -90 }} whileHover={reduced ? undefined : { rotate: -.8, y: -3 }} whileTap={{ scale: .97 }} transition={{ duration: .72, ease: easeOut }}>
          <span className="cover-spine" aria-hidden="true" />
          <span className="cover-title-block">
            <i className="cover-rule" aria-hidden="true" />
            <span className="cover-kicker">a page kept aside</span>
            <strong>a small<br />sketchbook</strong>
            <span className="cover-for">for Suha</span>
            <i className="cover-rule" aria-hidden="true" />
          </span>
        </motion.button> : <motion.section className="living-page night-scrapbook" key="scrapbook" initial={{ opacity: 0, rotateY: 12, scale: .96 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} transition={{ duration: .72, ease: easeOut }}>
          <div className="page-corner" aria-hidden="true" />
          <AnimatePresence mode="wait" custom={direction}><ScrapbookPage key={page} page={page} direction={direction} reduced={reduced} /></AnimatePresence>
          <nav className="scrapbook-navigation" aria-label="Sketchbook pages">
            <button type="button" onClick={previousPage} disabled={page === 0} aria-label="Previous page"><span aria-hidden="true">←</span> back</button>
            <div className="page-dots" aria-label={`Page ${page + 1} of ${pageImages.length}`}>{pageImages.map((_, index) => <i key={index} className={index === page ? 'active' : ''} />)}</div>
            <button type="button" className="page-next" onClick={nextPage}>{page === pageImages.length - 1 ? experience.sketch.finishLabel : 'next'} <span aria-hidden="true">→</span></button>
          </nav>
        </motion.section>}
      </AnimatePresence>
    </motion.div>
  </motion.main>
}
