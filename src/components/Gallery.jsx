import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'

const PHOTOS = [
  { src: '/photos/gallery-01.jpeg', cls: 'wide tall' },
  { src: '/photos/gallery-02.jpeg', cls: '' },
  { src: '/photos/gallery-03.jpeg', cls: 'tall' },
  { src: '/photos/gallery-04.jpeg', cls: '' },
  { src: '/photos/gallery-05.jpeg', cls: '' },
  { src: '/photos/gallery-06.jpeg', cls: '' },
  { src: '/photos/gallery-07.jpeg', cls: 'wide' },
  { src: '/photos/gallery-08.jpeg', cls: '' },
  { src: '/photos/gallery-09.jpeg', cls: '' },
  { src: '/photos/gallery-10.jpeg', cls: '' },
  { src: '/photos/gallery-11.jpeg', cls: '' },
  { src: '/photos/gallery-12.jpeg', cls: 'wide' },
]

export default function Gallery() {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en
  const headRef = useReveal()
  const gridRef = useReveal()

  return (
    <section className="section gallery" id="gallery">
      <div className="wrap">
        <div className="sec-head reveal" ref={headRef}>
          <span className="kicker">{t('Istantanee', 'Snapshots')}</span>
          <h2>
            {t('Frammenti di ', 'Fragments of ')}
            <em>{t('noi', 'us')}</em>
          </h2>
        </div>
        <div className="gal-grid reveal" ref={gridRef}>
          {PHOTOS.map(({ src, cls }, i) => (
            <div key={i} className={`gal-item${cls ? ' ' + cls : ''}`}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
