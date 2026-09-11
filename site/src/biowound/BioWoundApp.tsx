import { useEffect, useRef, useState, type ReactNode } from 'react';
import logoDefault from '../../assets/logo-default-transparent.png';
import hero640Avif from '../../assets/hero-care-640.avif';
import hero1024Avif from '../../assets/hero-care-1024.avif';
import hero1536Avif from '../../assets/hero-care-1536.avif';
import hero640Webp from '../../assets/hero-care-640.webp';
import hero1024Webp from '../../assets/hero-care-1024.webp';
import hero1536Webp from '../../assets/hero-care-1536.webp';
import foot640Avif from '../../assets/cellmax-care-640.avif';
import foot1024Avif from '../../assets/cellmax-care-1024.avif';
import foot1536Avif from '../../assets/cellmax-care-1536.avif';
import foot640Webp from '../../assets/cellmax-care-640.webp';
import foot1024Webp from '../../assets/cellmax-care-1024.webp';
import foot1536Webp from '../../assets/cellmax-care-1536.webp';
import clinician640Avif from '../../assets/clinical-support-640.avif';
import clinician1024Avif from '../../assets/clinical-support-1024.avif';
import clinician640Webp from '../../assets/clinical-support-640.webp';
import clinician1024Webp from '../../assets/clinical-support-1024.webp';
import { bioWoundContent, clinic, type BioWoundLocale } from './content';
import {
  CONSENT_KEY,
  initialiseAnalytics,
  setAnalyticsConsent,
  track,
  type AnalyticsConsent,
} from './analytics';

const localeStorageKey = 'inocare-biowound-language';

function getInitialLocale(): BioWoundLocale {
  const queryLocale = new URLSearchParams(location.search).get('lang');
  if (queryLocale === 'ms' || queryLocale === 'en') return queryLocale;
  const saved = localStorage.getItem(localeStorageKey);
  if (saved === 'ms' || saved === 'en') return saved;
  return navigator.language.toLowerCase().startsWith('ms') ? 'ms' : 'en';
}

function whatsAppHref(locale: BioWoundLocale, homeCare = false) {
  const text = locale === 'ms'
    ? `Salam Klinik Inocare. Saya ingin bertanya tentang penilaian luka${homeCare ? ' dan penjagaan luka di rumah' : ''}.`
    : `Hello Klinik Inocare. I would like to ask about a wound assessment${homeCare ? ' and home wound care' : ''}.`;
  return `https://wa.me/${clinic.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function Arrow({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={direction === 'down' ? 'rotate-90' : ''}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4.1Z" />
      <path d="M8.4 8.1c.2-.4.4-.4.7-.4h.4c.1 0 .3 0 .4.4l.7 1.6c.1.3.1.5-.1.7l-.6.7c-.2.2-.1.4 0 .6.7 1.2 1.6 2.1 2.8 2.7.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.6.8c.3.1.4.3.4.5 0 .3-.2 1.4-1 1.9-.6.5-1.5.8-2.4.6-1-.2-2.3-.7-3.9-2.1-1.8-1.6-2.9-3.6-3.2-4.7-.3-1 .1-1.6.5-2Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function Picture({
  alt,
  avif,
  webp,
  fallback,
  className = '',
  eager = false,
}: {
  alt: string;
  avif: string;
  webp: string;
  fallback: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <picture>
      <source srcSet={avif} type="image/avif" sizes="(min-width: 1024px) 50vw, 100vw" />
      <source srcSet={webp} type="image/webp" sizes="(min-width: 1024px) 50vw, 100vw" />
      <img
        src={fallback}
        width="1536"
        height="1024"
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        className={className}
      />
    </picture>
  );
}

function Section({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`scroll-mt-24 px-4 py-20 sm:px-6 md:py-28 ${className}`}>{children}</section>;
}

function SectionIntro({ eyebrow, title, body, light = false }: { eyebrow: string; title: string; body?: string; light?: boolean }) {
  return (
    <div className="max-w-3xl min-w-0">
      <p className={`text-xs font-bold uppercase tracking-[0.18em] ${light ? 'text-[#DCEAF7]' : 'text-[#538AC3]'}`}>{eyebrow}</p>
      <h2 className={`mt-4 text-[clamp(2.35rem,6vw,5.25rem)] font-bold leading-[0.95] tracking-[-0.05em] ${light ? 'text-white' : 'text-[#234173]'}`}>{title}</h2>
      {body ? <p className={`mt-6 max-w-2xl text-base leading-7 md:text-lg ${light ? 'text-white/75' : 'text-[#64748B]'}`}>{body}</p> : null}
    </div>
  );
}

function Nav({ locale, onLocaleChange }: { locale: BioWoundLocale; onLocaleChange: () => void }) {
  const [open, setOpen] = useState(false);
  const c = bioWoundContent[locale];
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    addEventListener('keydown', onKeyDown);
    return () => removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#DCEAF7]/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-4 px-4 sm:px-6">
          <a href="/" className="flex min-h-11 min-w-0 items-center" aria-label="Klinik Inocare">
            <img src={logoDefault} width="2560" height="654" alt="Klinik Inocare" className="h-auto w-[clamp(9rem,20vw,11.5rem)]" />
          </a>
          <div className="ml-auto hidden items-center gap-1 lg:flex">
            <nav aria-label={c.navAria} className="flex items-center">
              {c.nav.map(([label, href]) => (
                <a key={href} href={href} className="flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-[#234173] hover:bg-[#F7F9FC]">{label}</a>
              ))}
            </nav>
            <button type="button" onClick={onLocaleChange} className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#DCEAF7] px-3 text-sm font-bold text-[#234173]" aria-label={c.languageAria}>{c.languageLabel}</button>
            <a href={whatsAppHref(locale)} target="_blank" rel="noreferrer" className="ml-1 flex min-h-11 items-center gap-2 rounded-full bg-[#234173] px-5 text-sm font-bold text-white" onClick={() => track('whatsapp_click', { placement: 'navigation', locale })}><WhatsAppIcon />{c.cta}</a>
          </div>
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <button type="button" onClick={onLocaleChange} className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#DCEAF7] px-3 text-sm font-bold text-[#234173]" aria-label={c.languageAria}>{c.languageLabel}</button>
            <button ref={triggerRef} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="biowound-mobile-menu" aria-label={open ? c.navClose : c.navOpen} className="relative h-11 w-11 rounded-full border border-[#DCEAF7]">
              <span className={`absolute left-[11px] top-[14px] h-0.5 w-5 bg-[#234173] transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`absolute left-[11px] top-[21px] h-0.5 w-5 bg-[#234173] ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-[11px] top-[28px] h-0.5 w-5 bg-[#234173] transition ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>
      <div className={`fixed inset-0 z-40 lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
        <button type="button" aria-label={c.navClose} onClick={() => setOpen(false)} className={`absolute inset-0 bg-[#1E293B]/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} />
        <aside id="biowound-mobile-menu" className={`absolute right-0 top-0 flex h-full w-[min(88%,24rem)] flex-col overflow-y-auto bg-white px-6 pb-8 pt-28 shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <nav aria-label={c.navAria}>
            {c.nav.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-14 items-center border-b border-[#DCEAF7] text-xl font-bold text-[#234173]">{label}</a>
            ))}
          </nav>
          <a href={whatsAppHref(locale)} target="_blank" rel="noreferrer" className="mt-8 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#234173] px-5 text-center text-sm font-bold text-white" onClick={() => { setOpen(false); track('whatsapp_click', { placement: 'mobile_navigation', locale }); }}><WhatsAppIcon />{c.cta}</a>
        </aside>
      </div>
    </>
  );
}

function ConsentBanner({ locale, consent, onChoice }: { locale: BioWoundLocale; consent: AnalyticsConsent; onChoice: (choice: Exclude<AnalyticsConsent, null>) => void }) {
  if (consent) return null;
  const isMalay = locale === 'ms';
  return (
    <aside aria-label={isMalay ? 'Pilihan privasi' : 'Privacy choices'} className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl rounded-2xl border border-[#DCEAF7] bg-white p-4 shadow-2xl sm:flex sm:items-center sm:gap-5">
      <div className="flex-1">
        <h2 className="font-bold text-[#234173]">{isMalay ? 'Pilihan privasi anda' : 'Your privacy choices'}</h2>
        <p className="mt-1 text-xs leading-5 text-[#64748B]">{isMalay ? 'Benarkan analitik pilihan untuk membantu kami memahami penggunaan halaman ini.' : 'Allow optional analytics to help us understand how this page is used.'}</p>
      </div>
      <div className="mt-4 flex gap-2 sm:mt-0">
        <button type="button" onClick={() => onChoice('denied')} className="min-h-11 rounded-full border border-[#234173] px-4 text-xs font-bold text-[#234173]">{isMalay ? 'Tolak' : 'Decline'}</button>
        <button type="button" onClick={() => onChoice('granted')} className="min-h-11 rounded-full bg-[#234173] px-4 text-xs font-bold text-white">{isMalay ? 'Benarkan' : 'Allow analytics'}</button>
      </div>
    </aside>
  );
}

export default function BioWoundApp() {
  const [locale, setLocale] = useState<BioWoundLocale>(getInitialLocale);
  const [consent, setConsent] = useState<AnalyticsConsent>(null);
  const c = bioWoundContent[locale];

  useEffect(() => {
    document.documentElement.lang = locale === 'ms' ? 'ms-MY' : 'en-MY';
    document.title = locale === 'ms' ? 'BioWound | Penjagaan Luka Klinik Inocare' : 'BioWound | Wound Care at Klinik Inocare';
  }, [locale]);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    const initial = saved === 'granted' || saved === 'denied' ? saved : null;
    setConsent(initial);
    initialiseAnalytics(initial);
  }, []);

  function changeLocale() {
    const next = locale === 'en' ? 'ms' : 'en';
    setLocale(next);
    localStorage.setItem(localeStorageKey, next);
    const url = new URL(location.href);
    url.searchParams.set('lang', next);
    history.replaceState(null, '', url);
    track('language_change', { locale: next });
  }

  function chooseConsent(choice: Exclude<AnalyticsConsent, null>) {
    setConsent(choice);
    setAnalyticsConsent(choice);
  }

  return (
    <div className="min-w-0 bg-white text-[#1E293B]">
      <a href="#main" className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-full bg-white px-4 py-3 font-bold text-[#234173] shadow focus:translate-y-0">{c.skip}</a>
      <Nav locale={locale} onLocaleChange={changeLocale} />
      <main id="main">
        <section className="px-3 pb-3 pt-[5.75rem] sm:px-5 sm:pb-5">
          <div className="mx-auto grid min-h-[calc(100vh-7rem)] min-h-[calc(100dvh-7rem)] max-w-[1600px] overflow-hidden rounded-[1.5rem] bg-[#F7F9FC] lg:grid-cols-[1.04fr_.96fr]">
            <div className="flex min-w-0 flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16">
              <div className="max-w-3xl py-5 lg:py-10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#538AC3]">{c.hero.eyebrow}</p>
                <h1 className="mt-5 break-words text-[clamp(2.4rem,7.2vw,7.25rem)] font-bold leading-[0.88] tracking-[-0.065em] text-[#234173]">{c.hero.title}</h1>
                <p className="mt-7 max-w-2xl text-base font-medium leading-7 text-[#475569] md:text-xl md:leading-8">{c.hero.body}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={whatsAppHref(locale)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center gap-2 rounded-full bg-[#234173] px-6 text-sm font-bold text-white shadow-sm" onClick={() => track('whatsapp_click', { placement: 'hero', locale })}><WhatsAppIcon />{c.cta}</a>
                  <a href={`tel:${clinic.primaryPhone}`} className="flex min-h-12 items-center gap-2 rounded-full border border-[#234173] bg-white px-6 text-sm font-bold text-[#234173]">{c.call}<Arrow /></a>
                </div>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#DCEAF7] bg-white p-5"><p className="text-sm font-bold text-[#234173]">{c.hero.note}</p><p className="mt-2 text-xs leading-5 text-[#64748B]">{c.hero.location}</p></div>
                <div className="rounded-2xl bg-[#234173] p-5 text-white sm:text-right"><p className="text-sm font-bold">{c.hero.promise}</p><p className="mt-2 text-xs text-white/70">Klinik Inocare · Kuala Lumpur</p></div>
              </div>
            </div>
            <div className="relative min-h-[24rem] bg-[#DCEAF7] lg:min-h-full">
              <Picture alt={locale === 'ms' ? 'Doktor berbincang dengan pesakit semasa konsultasi' : 'Doctor speaking with a patient during a consultation'} avif={`${hero640Avif} 640w, ${hero1024Avif} 1024w, ${hero1536Avif} 1536w`} webp={`${hero640Webp} 640w, ${hero1024Webp} 1024w, ${hero1536Webp} 1536w`} fallback={hero1024Webp} eager className="absolute inset-0 h-full w-full object-cover object-center" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#234173]/35 to-transparent" />
              <a href="#who-we-help" className="absolute bottom-5 right-5 flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#234173] shadow-lg">{locale === 'ms' ? 'Lihat penjagaan' : 'Explore care'}<Arrow direction="down" /></a>
            </div>
          </div>
        </section>

        <section aria-label={locale === 'ms' ? 'Prinsip penjagaan' : 'Care principles'} className="px-4 py-10 sm:px-6 md:py-14">
          <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-3">
            {c.reassurance.map(([title, body], index) => (
              <article key={title} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 rounded-2xl border border-[#DCEAF7] p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DCEAF7] text-xs font-bold text-[#234173]">0{index + 1}</span>
                <div className="min-w-0"><h2 className="font-bold text-[#234173]">{title}</h2><p className="mt-2 text-sm leading-6 text-[#64748B]">{body}</p></div>
              </article>
            ))}
          </div>
        </section>

        <Section id="who-we-help" className="bg-[#234173] text-white">
          <div className="mx-auto max-w-7xl">
            <SectionIntro eyebrow={c.who.eyebrow} title={c.who.title} body={c.who.intro} light />
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {c.who.items.map(([title, body], index) => (
                <article key={title} className={`min-w-0 rounded-2xl p-6 ${index === 0 ? 'bg-[#538AC3]' : 'bg-white'}`}>
                  <span className={`text-xs font-bold ${index === 0 ? 'text-white/75' : 'text-[#538AC3]'}`}>0{index + 1}</span>
                  <h3 className={`mt-8 text-2xl font-bold tracking-[-0.03em] ${index === 0 ? 'text-white' : 'text-[#234173]'}`}>{title}</h3>
                  <p className={`mt-4 text-sm leading-6 ${index === 0 ? 'text-white/80' : 'text-[#64748B]'}`}>{body}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 rounded-2xl border border-white/25 bg-white/10 p-5 text-sm font-semibold leading-6 text-white">{c.who.safety}</p>
          </div>
        </Section>

        <Section id="assessment">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.88fr_1.12fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <SectionIntro eyebrow={c.assessment.eyebrow} title={c.assessment.title} body={c.assessment.body} />
              <p className="mt-8 rounded-2xl bg-[#DCEAF7] p-5 text-sm font-semibold leading-6 text-[#234173]">{c.assessment.qualifier}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {c.assessment.cards.map(([number, title, body]) => (
                <article key={number} className="flex min-h-64 min-w-0 flex-col justify-between rounded-2xl bg-[#F7F9FC] p-6 md:p-8">
                  <span className="text-xs font-bold text-[#538AC3]">{number}</span>
                  <div><h3 className="text-2xl font-bold tracking-[-0.03em] text-[#234173]">{title}</h3><p className="mt-4 text-sm leading-6 text-[#64748B]">{body}</p></div>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <Section id="care-pathway" className="bg-[#F7F9FC]">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-end">
              <SectionIntro eyebrow={c.pathway.eyebrow} title={c.pathway.title} body={c.pathway.intro} />
              <div className="relative min-h-80 overflow-hidden rounded-2xl bg-[#234173]">
                <Picture alt={locale === 'ms' ? 'Kaki pesakit semasa pemantauan penjagaan' : 'Patient foot during care monitoring'} avif={`${foot640Avif} 640w, ${foot1024Avif} 1024w, ${foot1536Avif} 1536w`} webp={`${foot640Webp} 640w, ${foot1024Webp} 1024w, ${foot1536Webp} 1536w`} fallback={foot1024Webp} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#234173]/75 via-transparent to-transparent" />
                <p className="absolute inset-x-6 bottom-6 max-w-md text-sm font-semibold leading-6 text-white">{c.assessment.qualifier}</p>
              </div>
            </div>
            <ol className="mt-8 grid gap-3 md:grid-cols-2">
              {c.pathway.steps.map(([title, body], index) => (
                <li key={title} className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] gap-4 rounded-2xl bg-white p-5 md:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#234173] text-sm font-bold text-white">0{index + 1}</span>
                  <div className="min-w-0"><h3 className="text-xl font-bold text-[#234173]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#64748B]">{body}</p></div>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-2xl bg-[#234173] p-6 text-white md:p-10">
              <h3 className="text-2xl font-bold md:text-3xl">{c.pathway.servicesTitle}</h3>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {c.pathway.services.map((service) => <li key={service} className="flex min-w-0 items-start gap-3 rounded-xl bg-white/10 p-4 text-sm font-semibold leading-6"><span className="mt-0.5 text-[#DCEAF7]"><CheckIcon /></span><span>{service}</span></li>)}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="home-care">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-[#DCEAF7] lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative min-h-[28rem] bg-[#DCEAF7]">
              <Picture alt={locale === 'ms' ? 'Doktor menerangkan langkah penjagaan' : 'Doctor explaining the next step in care'} avif={`${clinician640Avif} 640w, ${clinician1024Avif} 1024w`} webp={`${clinician640Webp} 640w, ${clinician1024Webp} 1024w`} fallback={clinician1024Webp} className="absolute inset-0 h-full w-full object-cover object-center" />
            </div>
            <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-14">
              <SectionIntro eyebrow={c.homeCare.eyebrow} title={c.homeCare.title} body={c.homeCare.body} />
              <ul className="mt-8 space-y-3">
                {c.homeCare.points.map((point) => <li key={point} className="flex items-start gap-3 text-sm font-semibold leading-6 text-[#234173]"><span className="mt-0.5 text-[#538AC3]"><CheckIcon /></span>{point}</li>)}
              </ul>
              <a href={whatsAppHref(locale, true)} target="_blank" rel="noreferrer" className="mt-8 flex min-h-12 w-fit max-w-full items-center gap-2 rounded-full bg-[#234173] px-6 text-sm font-bold text-white" onClick={() => track('whatsapp_click', { placement: 'home_care', locale })}><WhatsAppIcon />{c.homeCare.button}</a>
            </div>
          </div>
        </Section>

        <Section id="faqs" className="bg-[#F7F9FC]">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div className="lg:sticky lg:top-28 lg:self-start"><SectionIntro eyebrow={c.faq.eyebrow} title={c.faq.title} /></div>
            <div className="divide-y divide-[#DCEAF7] border-y border-[#DCEAF7]">
              {c.faq.items.map(([question, answer], index) => (
                <details key={question} className="group" open={index === 0}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-bold text-[#234173]">{question}<span aria-hidden="true" className="text-2xl font-normal transition group-open:rotate-45">+</span></summary>
                  <p className="max-w-2xl pb-6 pr-8 text-sm leading-7 text-[#64748B] md:text-base">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>

        <section id="visit" className="scroll-mt-24 px-3 pb-3 pt-16 sm:px-5 sm:pb-5 md:pt-24">
          <div className="mx-auto max-w-[1600px] overflow-hidden rounded-3xl bg-[#234173] text-white">
            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_.9fr] lg:p-14">
              <div><SectionIntro eyebrow={c.visit.eyebrow} title={c.visit.title} body={c.visit.body} light /><div className="mt-8 flex flex-wrap gap-3"><a href={whatsAppHref(locale)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#234173]" onClick={() => track('whatsapp_click', { placement: 'visit', locale })}><WhatsAppIcon />{c.cta}</a><a href={`tel:${clinic.primaryPhone}`} className="flex min-h-12 items-center rounded-full border border-white/50 px-6 text-sm font-bold">{c.call}</a></div></div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <article className="rounded-2xl bg-white p-6 text-[#1E293B]"><p className="text-xs font-bold uppercase tracking-widest text-[#538AC3]">{c.visit.addressLabel}</p><p className="mt-4 font-bold leading-6 text-[#234173]">{clinic.address}</p><p className="mt-2 text-sm text-[#64748B]">{c.visit.landmark}</p><a href={clinic.mapsUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-[#234173]">{c.visit.directions}<Arrow /></a></article>
                <article className="rounded-2xl bg-white/10 p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#DCEAF7]">{c.visit.phoneLabel}</p><a href={`tel:${clinic.primaryPhone}`} className="mt-4 block text-lg font-bold">{clinic.primaryPhoneLabel}</a><a href={`tel:${clinic.mobilePhone}`} className="mt-1 block text-lg font-bold">{clinic.mobilePhoneLabel}</a><p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#DCEAF7]">{c.visit.hoursLabel}</p><p className="mt-2 text-sm leading-6 text-white/75">{c.visit.hours}</p></article>
              </div>
            </div>
            <footer className="bg-white px-6 py-9 text-[#234173] sm:px-10 lg:px-14">
              <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                <div><img src={logoDefault} width="2560" height="654" alt="Klinik Inocare" className="h-auto w-44" /><p className="mt-4 max-w-lg text-sm leading-6 text-[#64748B]">{c.footer.summary}</p></div>
                <div className="flex flex-col items-start"><a href={clinic.mainWebsite} target="_blank" rel="noreferrer" className="flex min-h-11 items-center text-sm font-semibold">{c.footer.mainSite}</a><a href={clinic.woundCareSource} target="_blank" rel="noreferrer" className="flex min-h-11 max-w-md items-center text-left text-sm font-semibold">{c.footer.source}</a><button type="button" onClick={() => setConsent(null)} className="min-h-11 text-sm font-semibold">{locale === 'ms' ? 'Tetapan privasi' : 'Privacy settings'}</button></div>
              </div>
              <div className="mt-8 border-t border-[#DCEAF7] pt-6 text-xs leading-5 text-[#64748B]"><p>{c.footer.medical}</p><p className="mt-2">© {new Date().getFullYear()} {c.footer.rights}</p></div>
            </footer>
          </div>
        </section>
      </main>

      <a href={whatsAppHref(locale)} target="_blank" rel="noreferrer" aria-label={c.cta} className="fixed bottom-4 right-4 z-40 flex min-h-12 items-center gap-2 rounded-full bg-[#234173] px-4 text-sm font-bold text-white shadow-xl ring-2 ring-white sm:px-5" onClick={() => track('whatsapp_click', { placement: 'floating', locale })}><WhatsAppIcon /><span className="hidden sm:inline">{c.cta}</span></a>
      <ConsentBanner locale={locale} consent={consent} onChoice={chooseConsent} />
    </div>
  );
}
