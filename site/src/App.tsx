import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import clinicBackgroundOne from '../assets/clinic-background-1.png';
import clinicBackgroundTwo from '../assets/clinic-background-2.png';
import clinicBackgroundThree from '../assets/clinic-background-3.png';
import clinicHero from '../assets/clinic-hero.png';
import logoDefault from '../assets/logo-default.jpg';
import presentationRegistry from '../presentations.json';

const HERO_IMAGE = clinicBackgroundThree;
const SECTION2_IMAGE = clinicBackgroundOne;
const SECTION3_IMG1 = clinicBackgroundTwo;
const SECTION3_IMG2 = clinicHero;
const SECTION3_BG = clinicBackgroundThree;

const services = [
  { name: 'Wound\nCare', num: '01', active: true },
  { name: 'Knee\nTreatment', num: '02', active: false },
  { name: 'Hair\nTreatment', num: '03', active: false },
  { name: 'Clinical\nAssessment', num: null, active: false },
];

const mobileNavLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Cellmax', href: '#cellmax' },
  { label: 'Treatments', href: '#treatments' },
  { label: 'Assessment', href: '#assessment' },
  { label: 'Clinic Website', href: 'https://klinikinocare.com/' },
];

type TrainingPresentation = {
  id: string;
  title: string;
  description: string;
  repository: string;
  branch: string;
  path: string;
  sourceDir: string;
  enabled?: boolean;
};

const trainingPresentations = (presentationRegistry.presentations as TrainingPresentation[])
  .filter((presentation) => presentation.enabled !== false)
  .map((presentation) => ({
    ...presentation,
    href: `/${presentation.path.replace(/^\/+|\/+$/g, '')}/`,
  }));

type MaskPosition = {
  x: number;
  y: number;
  sw: number;
  sh: number;
};

const EMPTY_POSITION: MaskPosition = { x: 0, y: 0, sw: 0, sh: 0 };

function useMaskPositions(
  sectionRef: RefObject<HTMLElement | null>,
  cardRefs: RefObject<Array<HTMLDivElement | null>>,
) {
  const [positions, setPositions] = useState<MaskPosition[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updatePositions = () => {
      const sectionRect = section.getBoundingClientRect();
      setPositions(
        cardRefs.current.map((card) => {
          if (!card) return EMPTY_POSITION;
          const cardRect = card.getBoundingClientRect();
          return {
            x: cardRect.left - sectionRect.left,
            y: cardRect.top - sectionRect.top,
            sw: sectionRect.width,
            sh: sectionRect.height,
          };
        }),
      );
    };

    updatePositions();
    const observer = new ResizeObserver(updatePositions);
    observer.observe(section);

    return () => observer.disconnect();
  }, [cardRefs, sectionRef]);

  return positions;
}

function useImageWidth(
  imageUrl: string,
  sectionRef: RefObject<HTMLElement | null>,
) {
  const [imageWidth, setImageWidth] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const img = new Image();

    const updateWidth = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      const sectionHeight = section.getBoundingClientRect().height;
      setImageWidth(img.naturalWidth * (sectionHeight / img.naturalHeight));
    };

    img.addEventListener('load', updateWidth);
    img.src = imageUrl;

    const observer = new ResizeObserver(updateWidth);
    observer.observe(section);

    return () => {
      img.removeEventListener('load', updateWidth);
      observer.disconnect();
    };
  }, [imageUrl, sectionRef]);

  return imageWidth;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    setIsMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isMobile;
}

function useStaggeredReveal(count: number, threshold = 0.15) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [threshold]);

  const getAnimStyle = useCallback(
    (index: number): CSSProperties => {
      const staggerIndex = Math.min(Math.max(index, 0), count - 1);
      const delay = staggerIndex * 120;
      return {
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      };
    },
    [count, visible],
  );

  return { containerRef, getAnimStyle };
}

type MaskedCardProps = {
  bgImage: string;
  position: MaskPosition;
  imageWidth: number;
  focalX: number;
  className: string;
  children: ReactNode;
  cardRef: (element: HTMLDivElement | null) => void;
  style?: CSSProperties;
};

function MaskedCard({
  bgImage,
  position,
  imageWidth,
  focalX,
  className,
  children,
  cardRef,
  style,
}: MaskedCardProps) {
  const coverScale = imageWidth > 0 && imageWidth < position.sw ? position.sw / imageWidth : 1;
  const renderWidth = imageWidth * coverScale;
  const renderHeight = position.sh * coverScale;
  const overflow = renderWidth > position.sw ? renderWidth - position.sw : 0;
  const focalOffset = overflow * focalX;
  const verticalOffset = Math.max(renderHeight - position.sh, 0) * 0.5;
  const backgroundStyle: CSSProperties = position.sh
    ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: `${renderWidth}px ${renderHeight}px`,
        backgroundPosition: `-${position.x + focalOffset}px -${position.y + verticalOffset}px`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#F7F9FC',
      }
    : {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };

  return (
    <div ref={cardRef} className={className} style={{ ...backgroundStyle, ...style }}>
      {children}
    </div>
  );
}

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let current = 0;
    let exitTimer = 0;
    let completeTimer = 0;

    const counter = window.setInterval(() => {
      current += 1;
      setCount(current);

      if (current === 100) {
        window.clearInterval(counter);
        exitTimer = window.setTimeout(() => setExiting(true), 200);
        completeTimer = window.setTimeout(onComplete, 900);
      }
    }, 20);

    return () => {
      window.clearInterval(counter);
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-start bg-white text-[#234173] transition-opacity duration-700 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
      aria-label={`Loading ${count}%`}
      role="status"
    >
      <span className="p-6 text-7xl font-bold leading-none tabular-nums md:p-10 md:text-9xl">
        {count}
      </span>
    </div>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const trainingTriggerRef = useRef<HTMLButtonElement | null>(null);
  const trainingMenuRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const closeTraining = useCallback((restoreFocus = false) => {
    setTrainingOpen(false);
    if (restoreFocus) trainingTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) closeMenu(true);
      if (event.key === 'Escape' && trainingOpen) closeTraining(true);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeMenu, closeTraining, menuOpen, trainingOpen]);

  useEffect(() => {
    if (!trainingOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!trainingMenuRef.current?.contains(event.target as Node)) closeTraining();
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [closeTraining, trainingOpen]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
      else closeTraining();
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [closeMenu, closeTraining]);

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-white/80 px-4 py-2 backdrop-blur-md md:px-6 md:py-3"
        aria-label="Primary navigation"
      >
        <a href="#home" className="block shrink-0" aria-label="Klinik Inocare home">
          <img
            src={logoDefault}
            width="2560"
            height="654"
            alt="Klinik Inocare"
            className="h-auto w-40 md:w-44 lg:w-52"
          />
        </a>

        <div className="hidden items-center gap-3 md:flex lg:gap-4">
          <button
            type="button"
            className="rounded-full border border-[#234173] bg-white px-5 py-3 text-xs font-semibold text-[#234173] transition-colors duration-200 hover:bg-[#234173] hover:text-white lg:px-6 lg:text-sm"
            onClick={() => document.getElementById('treatments')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Menu
          </button>
          <div ref={trainingMenuRef} className="relative">
            <button
              ref={trainingTriggerRef}
              type="button"
              className="flex min-h-11 items-center gap-1 text-xs font-semibold text-[#234173] transition-colors hover:text-[#538AC3] lg:text-sm"
              aria-expanded={trainingOpen}
              aria-controls="desktop-training-menu"
              onClick={() => setTrainingOpen((open) => !open)}
            >
              Training
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform duration-200 ${trainingOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path d="m2.5 4.5 3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              id="desktop-training-menu"
              className={`absolute right-0 top-full mt-2 max-h-[70vh] w-72 overflow-y-auto rounded-2xl border border-[#DCEAF7] bg-white p-2 shadow-2xl transition-all duration-200 ${
                trainingOpen
                  ? 'visible translate-y-0 opacity-100'
                  : 'invisible -translate-y-2 opacity-0'
              }`}
            >
              <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                Training presentations
              </p>
              {trainingPresentations.map((presentation) => (
                <a
                  key={presentation.id}
                  href={presentation.href}
                  className="block rounded-xl px-3 py-3 transition-colors hover:bg-[#F7F9FC] focus:bg-[#F7F9FC]"
                  onClick={() => closeTraining()}
                >
                  <span className="block text-sm font-bold text-[#234173]">{presentation.title}</span>
                  <span className="mt-1 block text-xs leading-4 text-[#64748B]">{presentation.description}</span>
                </a>
              ))}
            </div>
          </div>
          <a href="https://klinikinocare.com/" className="text-xs font-semibold text-[#234173] lg:text-sm">
            Book Assessment
          </a>
        </div>

        <button
          ref={triggerRef}
          type="button"
          className="relative flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu-panel"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            className={`absolute h-0.5 w-6 rounded-full bg-[#234173] transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              menuOpen ? 'translate-y-0 rotate-45' : '-translate-y-2'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 rounded-full bg-[#234173] transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              menuOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 rounded-full bg-[#234173] transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              menuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-2'
            }`}
          />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => closeMenu()}
        />

        <aside
          id="mobile-menu-panel"
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-label="Mobile menu"
        >
          <div className="flex h-full flex-col justify-center gap-1 px-8">
            {mobileNavLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-3xl font-bold text-[#234173] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:text-[#538AC3] sm:text-4xl ${
                  menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: menuOpen ? `${100 + index * 60}ms` : '0ms' }}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => closeMenu()}
              >
                {link.label}
              </a>
            ))}

            <div
              className={`mt-8 border-t border-neutral-200 pt-8 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}
              style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }}
            >
              <p className="mb-3 text-sm font-semibold text-[#234173]">Training</p>
              <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
                {trainingPresentations.map((presentation) => (
                  <a
                    key={presentation.id}
                    href={presentation.href}
                    className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-[#F7F9FC] px-4 py-3 text-sm font-semibold text-[#234173] transition-colors hover:bg-[#DCEAF7]"
                    tabIndex={menuOpen ? 0 : -1}
                    onClick={() => closeMenu()}
                  >
                    <span>{presentation.title}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function ArrowIcon({ white = false }: { white?: boolean }) {
  return (
    <span
      className={`flex h-9 w-9 self-end items-center justify-center rounded-full border md:h-12 md:w-12 ${
        white ? 'border-white text-white' : 'border-[#234173] text-[#234173]'
      }`}
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="rotate-[-45deg]">
        <path
          d="M1 7h12m0 0L8 2m5 5L8 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const isMobile = useIsMobile();

  const section1Ref = useRef<HTMLElement | null>(null);
  const section1Cards = useRef<Array<HTMLDivElement | null>>([]);
  const section1Positions = useMaskPositions(section1Ref, section1Cards);
  const section1ImageWidth = useImageWidth(HERO_IMAGE, section1Ref);
  const s1Reveal = useStaggeredReveal(1);

  const section2Ref = useRef<HTMLElement | null>(null);
  const section2Cards = useRef<Array<HTMLDivElement | null>>([]);
  const section2Positions = useMaskPositions(section2Ref, section2Cards);
  const section2ImageWidth = useImageWidth(SECTION2_IMAGE, section2Ref);
  const s2Reveal = useStaggeredReveal(4);

  const s3Reveal = useStaggeredReveal(4);

  const setSection1Ref = useCallback(
    (element: HTMLElement | null) => {
      section1Ref.current = element;
      s1Reveal.containerRef.current = element;
    },
    [s1Reveal.containerRef],
  );

  const setSection2Ref = useCallback(
    (element: HTMLElement | null) => {
      section2Ref.current = element;
      s2Reveal.containerRef.current = element;
    },
    [s2Reveal.containerRef],
  );

  const completeSplash = useCallback(() => setShowSplash(false), []);
  const section1FocalX = isMobile ? 0.7 : 0.8;
  const section2FocalX = isMobile ? 0.65 : 0.8;

  return (
    <div className="bg-white">
      {showSplash && <SplashScreen onComplete={completeSplash} />}
      <Navbar />

      <section
        id="home"
        ref={setSection1Ref}
        className="flex h-screen w-full flex-col gap-1.5 overflow-hidden px-3 pb-1.5 pt-24 md:gap-2 md:px-5 md:pb-2 md:pt-24"
        aria-labelledby="hero-title"
      >
        <MaskedCard
          bgImage={HERO_IMAGE}
          position={section1Positions[0] ?? EMPTY_POSITION}
          imageWidth={section1ImageWidth}
          focalX={section1FocalX}
          cardRef={(element) => {
            section1Cards.current[0] = element;
          }}
          className="relative min-h-0 w-full flex-1 overflow-hidden rounded-xl md:rounded-2xl"
          style={s1Reveal.getAnimStyle(0)}
        >
          <p className="absolute left-4 top-4 z-10 max-w-[220px] text-xs font-semibold leading-4 text-[#1E293B] md:left-7 md:top-7 md:max-w-[330px] md:text-sm md:leading-5">
            Focused care for wounds, knee concerns
            <br />
            and hair health, guided by clinical assessment.
          </p>

          <div className="absolute bottom-7 left-3 z-10 md:bottom-8 md:left-4">
            <span className="mb-1 block text-xs font-semibold text-[#234173] md:mb-2 md:text-sm">
              Cellmax Therapy at Klinik Inocare
            </span>
            <h1
              id="hero-title"
              className="text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.84] tracking-tight text-[#234173] md:leading-[0.79]"
            >
              Care
              <br />
              Renewed
            </h1>
          </div>

          <span className="absolute bottom-5 right-4 z-10 max-w-[120px] text-right text-[10px] font-semibold leading-3 text-white md:bottom-10 md:right-8 md:max-w-none md:text-sm md:leading-normal">
            Trusted Care. Inspired Innovation.
          </span>
        </MaskedCard>
      </section>

      <section
        id="cellmax"
        ref={setSection2Ref}
        className="flex min-h-screen w-full flex-col gap-1.5 overflow-hidden px-3 pb-1.5 pt-16 md:h-screen md:gap-2 md:px-5 md:pb-2 md:pt-20"
        aria-labelledby="cellmax-title"
      >
        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_auto_auto_auto] gap-1.5 md:grid-cols-2 md:grid-rows-[1fr_1fr_0.8fr] md:gap-2">
          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={section2Positions[0] ?? EMPTY_POSITION}
            imageWidth={section2ImageWidth}
            focalX={section2FocalX}
            cardRef={(element) => {
              section2Cards.current[0] = element;
            }}
            className="relative min-h-[160px] overflow-hidden rounded-xl md:min-h-0 md:rounded-2xl"
            style={s2Reveal.getAnimStyle(0)}
          >
            <h2
              id="cellmax-title"
              className="absolute left-5 top-4 z-10 text-2xl font-bold text-white md:left-7 md:top-6 md:text-3xl"
            >
              Cellmax Therapy
            </h2>
            <span className="absolute bottom-4 left-5 z-10 text-xs font-semibold text-white md:bottom-6 md:left-7 md:text-sm">
              Three focused treatment pathways
            </span>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={section2Positions[1] ?? EMPTY_POSITION}
            imageWidth={section2ImageWidth}
            focalX={section2FocalX}
            cardRef={(element) => {
              section2Cards.current[1] = element;
            }}
            className="relative min-h-[200px] overflow-hidden rounded-xl md:row-span-2 md:min-h-0 md:rounded-2xl"
            style={s2Reveal.getAnimStyle(1)}
          >
            <p className="absolute bottom-16 left-5 z-10 max-w-xs text-xs font-semibold leading-4 text-white md:bottom-20 md:left-7 md:text-sm md:leading-5">
              Every treatment plan begins with an assessment.
              <br />
              Suitability depends on your individual needs.
            </p>
            <a
              href="https://klinikinocare.com/"
              className="absolute bottom-4 right-4 z-10 rounded-full bg-white px-5 py-3 text-base font-bold text-[#234173] transition-transform hover:scale-105 md:bottom-6 md:right-6 md:px-8 md:py-5 md:text-xl"
            >
              Book Assessment
            </a>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={section2Positions[2] ?? EMPTY_POSITION}
            imageWidth={section2ImageWidth}
            focalX={section2FocalX}
            cardRef={(element) => {
              section2Cards.current[2] = element;
            }}
            className="relative min-h-[160px] overflow-hidden rounded-xl md:min-h-0 md:rounded-2xl"
            style={s2Reveal.getAnimStyle(2)}
          >
            <h2 className="absolute left-5 top-4 z-10 text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] text-white md:left-7 md:top-6">
              Wound,
              <br />
              Knee &amp; Hair
            </h2>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={section2Positions[3] ?? EMPTY_POSITION}
            imageWidth={section2ImageWidth}
            focalX={section2FocalX}
            cardRef={(element) => {
              section2Cards.current[3] = element;
            }}
            className="relative col-span-1 min-h-[200px] overflow-hidden rounded-xl md:col-span-2 md:min-h-0 md:rounded-2xl"
            style={s2Reveal.getAnimStyle(3)}
          >
            <div id="treatments" className="absolute inset-0 z-10 flex flex-wrap gap-1.5 p-2 md:flex-nowrap md:gap-2 md:p-3">
              {services.map((service) => (
                <article
                  key={service.name}
                  className={`flex min-w-[calc(50%-4px)] flex-1 flex-col justify-between rounded-xl p-3 md:min-w-0 md:rounded-2xl md:p-5 ${
                    service.active ? 'bg-white/90 backdrop-blur-md' : 'bg-white/20 backdrop-blur-xl'
                  }`}
                >
                  <h3
                    className={`whitespace-pre-line text-xl font-bold leading-[1.05] md:text-4xl ${
                      service.active ? 'text-[#234173]' : 'text-white'
                    }`}
                  >
                    {service.name}
                  </h3>
                  {service.num && (
                    <span
                      className={`flex h-8 w-8 self-end items-center justify-center rounded-full border text-xs font-semibold md:h-12 md:w-12 md:text-sm ${
                        service.active ? 'border-[#234173] text-[#234173]' : 'border-white text-white'
                      }`}
                    >
                      {service.num}
                    </span>
                  )}
                </article>
              ))}
            </div>
          </MaskedCard>
        </div>
      </section>

      <section
        id="assessment"
        ref={s3Reveal.containerRef}
        className="flex min-h-screen w-full flex-col gap-1.5 overflow-hidden px-3 pb-1.5 pt-16 md:h-screen md:gap-2 md:px-5 md:pb-2 md:pt-20"
        aria-labelledby="assessment-title"
      >
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-1.5 md:grid-cols-2 md:gap-2">
          <div className="flex min-w-0 flex-col gap-1.5 md:gap-2">
            <div
              className="flex min-h-[180px] flex-[1.2] flex-col justify-between rounded-xl bg-[#F7F9FC] p-5 md:min-h-0 md:rounded-2xl md:p-7"
              style={s3Reveal.getAnimStyle(0)}
            >
              <h2
                id="assessment-title"
                className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-[#234173]"
              >
                Care
                <br />
                Starts Here
              </h2>
              <p className="text-xs font-semibold text-[#1E293B] md:text-sm">
                Assessment first. Care matched to your needs.
              </p>
            </div>

            <div
              className="flex min-h-[140px] flex-1 gap-1.5 md:min-h-0 md:gap-2"
              style={s3Reveal.getAnimStyle(1)}
            >
              <div className="flex-1 overflow-hidden rounded-xl md:rounded-2xl">
                <img
                  src={SECTION3_IMG1}
                  alt="Blue healthcare icon illustration"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 overflow-hidden rounded-xl md:rounded-2xl">
                <img
                  src={SECTION3_IMG2}
                  alt="Illustration of a clinician on a blue background"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div
              id="consultation"
              className="flex min-h-[160px] flex-[0.8] items-end justify-between rounded-xl bg-[#DCEAF7] p-5 md:min-h-0 md:rounded-2xl md:p-7"
              style={s3Reveal.getAnimStyle(2)}
            >
              <div>
                <p className="mb-2 text-xs font-semibold text-[#234173] md:mb-3 md:text-sm">Your next step</p>
                <h3 className="text-xl font-bold leading-6 text-[#234173] md:text-3xl md:leading-8">
                  Clinical
                  <br />
                  Assessment
                  <br />
                  at Inocare
                </h3>
              </div>
              <a
                href="https://klinikinocare.com/"
                className="rounded-full bg-white px-5 py-3 text-base font-bold text-[#234173] transition-transform hover:scale-105 md:px-8 md:py-5 md:text-xl"
              >
                Visit Clinic
              </a>
            </div>
          </div>

          <div
            className="relative min-h-[350px] overflow-hidden rounded-xl md:min-h-0 md:rounded-2xl"
            style={s3Reveal.getAnimStyle(3)}
          >
            <img
              src={SECTION3_BG}
              alt="Illustration of a clinician supporting a patient"
              className="h-full w-full object-cover"
              loading="lazy"
            />

            <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 md:bottom-5 md:left-5 md:right-5 md:gap-2">
              <article className="flex h-36 flex-1 flex-col justify-between rounded-xl bg-white p-3 md:h-52 md:rounded-2xl md:p-5">
                <h4 className="text-lg font-bold leading-5 text-[#234173] md:text-2xl md:leading-7">
                  Guided
                  <br />
                  by your
                  <br />
                  assessment
                </h4>
                <ArrowIcon />
              </article>

              <article className="flex h-36 flex-1 flex-col justify-between rounded-xl bg-white/20 p-3 backdrop-blur-xl md:h-52 md:rounded-2xl md:p-5">
                <h4 className="text-lg font-bold leading-5 text-white md:text-2xl md:leading-7">
                  Suitability
                  <br />
                  depends on
                  <br />
                  clinical review
                </h4>
                <ArrowIcon white />
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
