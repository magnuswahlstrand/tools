import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const IMAGES = Array.from({ length: 21 }, (_, i) => ({
  src: `${import.meta.env.BASE_URL}images/gen_${i + 1}.jpg`,
  label: `gen_${i + 1}`,
}))

const SWIPE_THRESHOLD = 50

function App() {
  const [index, setIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback((next: number) => {
    setIndex(((next % IMAGES.length) + IMAGES.length) % IMAGES.length)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(index - 1)
      else if (e.key === 'ArrowRight') goTo(index + 1)
      else if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, goTo])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) goTo(index + 1)
      else goTo(index - 1)
    }
  }

  const current = IMAGES[index]

  return (
    <div className="carousel">
      <header className="carousel-header">
        <h1>Reading Practice</h1>
        <span className="counter">
          {index + 1} / {IMAGES.length}
        </span>
      </header>

      <div
        className="viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button className="arrow arrow-prev" onClick={() => goTo(index - 1)} aria-label="Previous image">
          ‹
        </button>
        <img
          key={current.src}
          className="slide"
          src={current.src}
          alt={current.label}
          onClick={() => setFullscreen(true)}
        />
        <button className="arrow arrow-next" onClick={() => goTo(index + 1)} aria-label="Next image">
          ›
        </button>
      </div>

      <div className="dots">
        {IMAGES.map((img, i) => (
          <button
            key={img.src}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>

      {fullscreen && (
        <div className="fullscreen" onClick={() => setFullscreen(false)}>
          <img src={current.src} alt={current.label} />
        </div>
      )}
    </div>
  )
}

export default App