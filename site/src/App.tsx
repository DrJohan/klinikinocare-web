import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import logoDefault from '../assets/logo-default-transparent.png';
import hero640Avif from '../assets/hero-care-640.avif';
import hero1024Avif from '../assets/hero-care-1024.avif';
import hero1536Avif from '../assets/hero-care-1536.avif';
import hero640Webp from '../assets/hero-care-640.webp';
import hero1024Webp from '../assets/hero-care-1024.webp';
import hero1536Webp from '../assets/hero-care-1536.webp';
import cellmax640Avif from '../assets/cellmax-care-640.avif';
import cellmax1024Avif from '../assets/cellmax-care-1024.avif';
import cellmax1536Avif from '../assets/cellmax-care-1536.avif';
import cellmax640Webp from '../assets/cellmax-care-640.webp';
import cellmax1024Webp from '../assets/cellmax-care-1024.webp';
import cellmax1536Webp from '../assets/cellmax-care-1536.webp';
import icon640Avif from '../assets/clinical-icon-640.avif';
import icon1024Avif from '../assets/clinical-icon-1024.avif';
import icon640Webp from '../assets/clinical-icon-640.webp';
import icon1024Webp from '../assets/clinical-icon-1024.webp';
import support640Avif from '../assets/clinical-support-640.avif';
import support1024Avif from '../assets/clinical-support-1024.avif';
import support640Webp from '../assets/clinical-support-640.webp';
import support1024Webp from '../assets/clinical-support-1024.webp';
import presentationRegistry from '../presentations.json';

type Locale = 'en' | 'ms';
type ServiceId = 'wound' | 'knee' | 'hair';
type Consent = 'granted' | 'denied' | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const presentations = presentationRegistry.presentations
  .filter((item) => item.enabled !== false)
  .map((item) => ({ ...item, href: `/${item.path.replace(/^\/+|\/+$/g, '')}/` }));

const WA_NUMBER = '60178974751';
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
const CONSENT_KEY = 'inocare-analytics-consent';

const content = {
  en: {
    switchLabel: 'BM', switchAria: 'Lihat dalam Bahasa Melayu',
    a11y: { skip: 'Skip to main content', navigation: 'Primary navigation', home: 'Klinik Inocare home' },
    nav: { home: 'Home', cellmax: 'Cellmax', treatments: 'Care pathways', why: 'Why Inocare', journey: 'What to expect', faq: 'FAQs', visit: 'Visit us', training: 'Training', open: 'Open menu', close: 'Close menu' },
    common: { whatsapp: 'WhatsApp Us', explore: 'Explore Treatments', qualifier: 'Suitability depends on clinical assessment.', location: 'Kuala Lumpur · Opposite HKL', promise: 'Trusted Care. Inspired Innovation.' },
    hero: { eyebrow: 'Cellmax Therapy at Klinik Inocare', title: 'Wound, Knee & Hair Care', body: 'Focused care guided by clinical assessment, clear explanations and an individual plan.', note: 'For people seeking informed next steps for wound, knee or hair concerns.' },
    cellmax: {
      eyebrow: 'Assessment first', title: 'Understanding Cellmax Therapy',
      body: 'Cellmax Therapy is considered as part of an individual care pathway after a clinician reviews your concern, health history and goals.',
      qualifier: 'Treatment choice, suitability and expected outcomes vary between individuals. An assessment is required before any recommendation is made.',
      points: [['A guided decision', 'Your clinician explains which options may be appropriate and why.'], ['A personal pathway', 'The plan is matched to findings from your assessment.'], ['Planned follow-up', 'Progress and next steps are reviewed with you over time.']],
    },
    treatments: {
      eyebrow: 'Three care pathways', title: 'Start with the concern that matters to you', intro: 'These pathways are informational. A clinician must assess you before discussing a suitable treatment plan.', ask: 'Ask about',
      items: [
        { id: 'wound' as ServiceId, num: '01', title: 'Wound Care', topic: 'wound care', summary: 'For wounds that are slow to heal or need structured clinical follow-up.', assessment: 'Assessment considers the wound, surrounding skin, general health and current care needs.' },
        { id: 'knee' as ServiceId, num: '02', title: 'Knee Treatment', topic: 'knee treatment', summary: 'For ongoing knee discomfort, stiffness or changes in movement and function.', assessment: 'Assessment reviews symptoms, function, health history and whether further investigation is appropriate.' },
        { id: 'hair' as ServiceId, num: '03', title: 'Hair Treatment', topic: 'hair treatment', summary: 'For concerns about thinning hair or changes in hair density and scalp health.', assessment: 'Assessment considers the pattern, duration, scalp and relevant health factors before any recommendation.' },
      ],
    },
    why: {
      eyebrow: 'Why Klinik Inocare', title: 'Care built around informed decisions', body: 'We keep the pathway clear: understand the concern, assess what matters and explain the available next steps.',
      reasons: [['Assessment-led care', 'Recommendations follow a clinical review, not a one-size-fits-all package.'], ['Clear explanations', 'You can ask questions and understand the purpose of each proposed step.'], ['Individual planning', 'Your plan reflects your findings, priorities and follow-up needs.'], ['Continuity of care', 'Follow-up supports review of progress and necessary adjustments.']],
      role: 'Registered medical practitioner', name: 'Dr Ahmad Nabil Fikri bin Norhashimi', qualification: 'MD, I.M. Sechenov First Moscow State Medical University', registration: 'MMC Full Registration No. 105388', note: 'Registration and qualification details are provided for factual identification.'
    },
    journey: {
      eyebrow: 'What to expect', title: 'A clear first step', intro: 'You do not need to decide on a treatment before speaking with us.',
      steps: [['Message us', 'Tell us which pathway you want to ask about. Avoid sending urgent or highly sensitive information through WhatsApp.'], ['Attend an assessment', 'Bring your medication list, relevant reports and the questions you want answered.'], ['Discuss your plan', 'The clinician explains findings, possible next steps and follow-up before you decide.']],
      bring: 'Helpful to bring', list: ['Current medication list', 'Relevant medical reports', 'A list of your questions'], emergency: 'WhatsApp is not an emergency service. For a medical emergency, call 999 or go to the nearest Emergency Department.'
    },
    faq: {
      eyebrow: 'Frequently asked questions', title: 'Answers before your visit',
      items: [
        ['What is Cellmax Therapy?', 'It is a treatment pathway considered by the clinic after assessment. Your clinician will explain what is being considered, why it may or may not suit you, and available alternatives.'],
        ['Is Cellmax Therapy suitable for everyone?', 'No. Suitability depends on your concern, examination findings, health history and clinical judgement.'],
        ['How long will treatment take?', 'The number and timing of visits vary. A likely schedule can only be discussed after assessment and may change during follow-up.'],
        ['What should I bring?', 'Bring your medication list, relevant medical reports and any questions you would like the clinician to address.'],
        ['Is home wound care available?', 'Please ask the clinic team whether a home visit is available for your location and clinical situation.'],
        ['How much will care cost?', 'Charges depend on the assessment and agreed care plan. Ask the team for current charges before confirming a service.'],
        ['Can this website diagnose my condition?', 'No. This page provides general information and does not replace an examination or diagnosis by a qualified healthcare professional.'],
      ],
    },
    visit: { eyebrow: 'Visit Klinik Inocare', title: 'Care starts with a conversation', body: 'Contact the clinic team to ask about a pathway or arrange an assessment.', addressLabel: 'Address', address: 'G06 & G07, VUE Residence Service Suite 102, Jalan Pahang, 53300 Kuala Lumpur', landmark: 'Opposite HKL main entrance', phone: 'Phone', hoursLabel: 'Opening hours', hours: 'Please confirm current opening hours on WhatsApp before visiting.', directions: 'Open directions', call: 'Call clinic', website: 'Main clinic website' },
    footer: { summary: 'Assessment-led wound, knee and hair care in Kuala Lumpur.', privacy: 'Privacy notice', settings: 'Privacy settings', medical: 'Medical information on this website is general and does not replace clinical assessment, diagnosis or emergency care.', rights: 'Klinik Inocare. All rights reserved.' },
    privacy: { title: 'Privacy notice', body: 'This page uses optional analytics only after you allow analytics storage. WhatsApp is a separate service. Please avoid sending urgent or unnecessary sensitive information in your first message.', analytics: 'Analytics helps us understand visits, language use, pathway interest and outbound WhatsApp clicks. It is not used to diagnose or assess your health.', close: 'Close privacy notice' },
    consent: { title: 'Your privacy choices', body: 'Allow optional analytics to help us understand how this page is used. You can change this choice later.', accept: 'Allow analytics', decline: 'Decline', learn: 'Read privacy notice' },
  },
  ms: {
    switchLabel: 'EN', switchAria: 'View in English',
    a11y: { skip: 'Langkau ke kandungan utama', navigation: 'Navigasi utama', home: 'Laman utama Klinik Inocare' },
    nav: { home: 'Utama', cellmax: 'Cellmax', treatments: 'Laluan penjagaan', why: 'Mengapa Inocare', journey: 'Apa yang dijangka', faq: 'Soalan lazim', visit: 'Kunjungi kami', training: 'Latihan', open: 'Buka menu', close: 'Tutup menu' },
    common: { whatsapp: 'WhatsApp Kami', explore: 'Lihat Rawatan', qualifier: 'Kesesuaian bergantung pada penilaian klinikal.', location: 'Kuala Lumpur · Bertentangan HKL', promise: 'Trusted Care. Inspired Innovation.' },
    hero: { eyebrow: 'Cellmax Therapy di Klinik Inocare', title: 'Penjagaan Luka, Lutut & Rambut', body: 'Penjagaan berfokus yang berpandukan penilaian klinikal, penerangan jelas dan pelan individu.', note: 'Untuk individu yang inginkan langkah seterusnya bagi masalah luka, lutut atau rambut.' },
    cellmax: {
      eyebrow: 'Penilaian terlebih dahulu', title: 'Memahami Cellmax Therapy',
      body: 'Cellmax Therapy dipertimbangkan sebagai sebahagian daripada laluan penjagaan individu selepas doktor menilai masalah, sejarah kesihatan dan matlamat anda.',
      qualifier: 'Pilihan rawatan, kesesuaian dan hasil yang dijangka berbeza bagi setiap individu. Penilaian diperlukan sebelum sebarang cadangan dibuat.',
      points: [['Keputusan berpandu', 'Doktor menerangkan pilihan yang mungkin sesuai dan sebabnya.'], ['Laluan peribadi', 'Pelan dipadankan dengan dapatan daripada penilaian anda.'], ['Susulan terancang', 'Kemajuan dan langkah seterusnya dinilai bersama anda.']],
    },
    treatments: {
      eyebrow: 'Tiga laluan penjagaan', title: 'Mulakan dengan masalah yang penting bagi anda', intro: 'Maklumat ini ialah panduan umum. Doktor perlu menilai anda sebelum membincangkan pelan rawatan yang sesuai.', ask: 'Tanya tentang',
      items: [
        { id: 'wound' as ServiceId, num: '01', title: 'Penjagaan Luka', topic: 'penjagaan luka', summary: 'Untuk luka yang lambat sembuh atau memerlukan susulan klinikal teratur.', assessment: 'Penilaian mengambil kira luka, kulit di sekelilingnya, kesihatan umum dan keperluan penjagaan semasa.' },
        { id: 'knee' as ServiceId, num: '02', title: 'Rawatan Lutut', topic: 'rawatan lutut', summary: 'Untuk ketidakselesaan lutut, kekakuan atau perubahan pergerakan dan fungsi yang berterusan.', assessment: 'Penilaian meneliti gejala, fungsi, sejarah kesihatan dan sama ada pemeriksaan lanjut sesuai.' },
        { id: 'hair' as ServiceId, num: '03', title: 'Rawatan Rambut', topic: 'rawatan rambut', summary: 'Untuk masalah rambut menipis atau perubahan kepadatan rambut dan kesihatan kulit kepala.', assessment: 'Penilaian mengambil kira corak, tempoh, kulit kepala dan faktor kesihatan berkaitan sebelum sebarang cadangan.' },
      ],
    },
    why: {
      eyebrow: 'Mengapa Klinik Inocare', title: 'Penjagaan berasaskan keputusan termaklum', body: 'Kami memastikan laluan penjagaan jelas: fahami masalah, nilai perkara penting dan terangkan langkah seterusnya.',
      reasons: [['Penjagaan berasaskan penilaian', 'Cadangan dibuat selepas penilaian klinikal, bukan pakej yang sama untuk semua.'], ['Penerangan jelas', 'Anda boleh bertanya dan memahami tujuan setiap langkah yang dicadangkan.'], ['Perancangan individu', 'Pelan anda mengambil kira dapatan, keutamaan dan keperluan susulan.'], ['Kesinambungan penjagaan', 'Susulan membantu menilai kemajuan dan pelarasan yang diperlukan.']],
      role: 'Pengamal perubatan berdaftar', name: 'Dr Ahmad Nabil Fikri bin Norhashimi', qualification: 'MD, I.M. Sechenov First Moscow State Medical University', registration: 'No. Pendaftaran Penuh MMC 105388', note: 'Maklumat pendaftaran dan kelayakan diberikan untuk pengenalan fakta.'
    },
    journey: {
      eyebrow: 'Apa yang dijangka', title: 'Langkah pertama yang jelas', intro: 'Anda tidak perlu memilih rawatan sebelum berbincang dengan kami.',
      steps: [['Hubungi kami', 'Beritahu laluan penjagaan yang ingin ditanya. Elakkan menghantar maklumat segera atau sangat sensitif melalui WhatsApp.'], ['Hadir untuk penilaian', 'Bawa senarai ubat, laporan berkaitan dan soalan yang ingin anda ajukan.'], ['Bincangkan pelan anda', 'Doktor menerangkan dapatan, pilihan langkah seterusnya dan susulan sebelum anda membuat keputusan.']],
      bring: 'Elok dibawa bersama', list: ['Senarai ubat semasa', 'Laporan perubatan berkaitan', 'Senarai soalan anda'], emergency: 'WhatsApp bukan perkhidmatan kecemasan. Untuk kecemasan perubatan, hubungi 999 atau pergi ke Jabatan Kecemasan terdekat.'
    },
    faq: {
      eyebrow: 'Soalan lazim', title: 'Jawapan sebelum kunjungan anda',
      items: [
        ['Apakah Cellmax Therapy?', 'Ia ialah laluan rawatan yang dipertimbangkan selepas penilaian. Doktor akan menerangkan perkara yang dipertimbangkan, mengapa ia mungkin sesuai atau tidak sesuai, serta pilihan lain.'],
        ['Adakah Cellmax Therapy sesuai untuk semua orang?', 'Tidak. Kesesuaian bergantung pada masalah, dapatan pemeriksaan, sejarah kesihatan dan pertimbangan klinikal.'],
        ['Berapa lama rawatan diperlukan?', 'Bilangan dan jarak masa lawatan berbeza. Jangkaan jadual hanya boleh dibincangkan selepas penilaian dan mungkin berubah semasa susulan.'],
        ['Apakah yang perlu saya bawa?', 'Bawa senarai ubat, laporan perubatan berkaitan dan soalan yang ingin anda bincangkan dengan doktor.'],
        ['Adakah penjagaan luka di rumah tersedia?', 'Sila tanya pasukan klinik sama ada lawatan ke rumah tersedia untuk lokasi dan keadaan klinikal anda.'],
        ['Berapakah kos penjagaan?', 'Caj bergantung pada penilaian dan pelan penjagaan yang dipersetujui. Tanya pasukan klinik tentang caj semasa sebelum mengesahkan perkhidmatan.'],
        ['Bolehkah laman ini mendiagnosis keadaan saya?', 'Tidak. Halaman ini menyediakan maklumat umum dan tidak menggantikan pemeriksaan atau diagnosis oleh profesional kesihatan berkelayakan.'],
      ],
    },
    visit: { eyebrow: 'Kunjungi Klinik Inocare', title: 'Penjagaan bermula dengan perbualan', body: 'Hubungi pasukan klinik untuk bertanya tentang laluan penjagaan atau mengatur penilaian.', addressLabel: 'Alamat', address: 'G06 & G07, VUE Residence Service Suite 102, Jalan Pahang, 53300 Kuala Lumpur', landmark: 'Bertentangan pintu masuk utama HKL', phone: 'Telefon', hoursLabel: 'Waktu operasi', hours: 'Sila sahkan waktu operasi semasa melalui WhatsApp sebelum berkunjung.', directions: 'Buka pandu arah', call: 'Hubungi klinik', website: 'Laman utama klinik' },
    footer: { summary: 'Penjagaan luka, lutut dan rambut berasaskan penilaian di Kuala Lumpur.', privacy: 'Notis privasi', settings: 'Tetapan privasi', medical: 'Maklumat perubatan di laman ini adalah umum dan tidak menggantikan penilaian klinikal, diagnosis atau rawatan kecemasan.', rights: 'Klinik Inocare. Hak cipta terpelihara.' },
    privacy: { title: 'Notis privasi', body: 'Halaman ini hanya menggunakan analitik pilihan selepas anda membenarkan penyimpanan analitik. WhatsApp ialah perkhidmatan berasingan. Elakkan menghantar maklumat segera atau sensitif yang tidak diperlukan dalam mesej pertama.', analytics: 'Analitik membantu kami memahami kunjungan, penggunaan bahasa, minat terhadap laluan penjagaan dan klik ke WhatsApp. Data ini tidak digunakan untuk mendiagnosis atau menilai kesihatan anda.', close: 'Tutup notis privasi' },
    consent: { title: 'Pilihan privasi anda', body: 'Benarkan analitik pilihan untuk membantu kami memahami penggunaan halaman ini. Anda boleh mengubah pilihan ini kemudian.', accept: 'Benarkan analitik', decline: 'Tolak', learn: 'Baca notis privasi' },
  },
} as const;

const locale = (): Locale => typeof window !== 'undefined' && /^\/ms(?:\/|$)/.test(location.pathname) ? 'ms' : 'en';
const langHref = (target: Locale) => `/${target}/${typeof window === 'undefined' ? '' : location.hash}`;
const waHref = (language: Locale, topic?: string) => {
  const text = language === 'ms'
    ? `Salam Klinik Inocare. Saya ingin bertanya${topic ? ` tentang ${topic}` : ''} dan mengatur penilaian klinikal.`
    : `Hello Klinik Inocare. I would like to ask${topic ? ` about ${topic}` : ''} and arrange a clinical assessment.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

function ensureGtag() {
  window.dataLayer ??= [];
  window.gtag ??= (...args: unknown[]) => window.dataLayer?.push(args);
}

function loadAnalytics() {
  if (!GA_ID) return;
  ensureGtag();
  if (!document.querySelector(`script[data-ga-id="${GA_ID}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    script.dataset.gaId = GA_ID;
    document.head.appendChild(script);
    window.gtag?.('js', new Date());
    window.gtag?.('config', GA_ID);
  }
}

function track(name: string, params: Record<string, string | number> = {}) {
  if (localStorage.getItem(CONSENT_KEY) === 'granted') window.gtag?.('event', name, params);
}

function switchLanguage(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
  event.currentTarget.href = langHref(target);
  track('language_switch', { language: target });
}

function WhatsAppIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z" stroke="currentColor" strokeWidth="1.8"/><path d="M9 8c.3-.4.8-.3 1 .1l.8 1.8c.1.3 0 .5-.2.7l-.5.5c.8 1.6 1.7 2.5 3.3 3.2l.6-.7c.2-.2.5-.3.7-.2l1.8.8c.4.2.5.5.3.9-.4.9-1.2 1.4-2.2 1.3-3.5-.5-6.4-3.1-7-6.2-.2-.9.4-1.8 1.4-2.2Z" fill="currentColor"/></svg>;
}

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h12m0 0L9 3m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function Picture({ alt, avif, webp, fallback, eager, className, square = false }: { alt: string; avif: string; webp: string; fallback: string; eager?: boolean; className: string; square?: boolean }) {
  return <picture><source srcSet={avif} sizes="(min-width:1024px) 50vw, 100vw" type="image/avif"/><source srcSet={webp} sizes="(min-width:1024px) 50vw, 100vw" type="image/webp"/><img src={fallback} alt={alt} width={square ? 1024 : 1536} height={1024} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} className={className}/></picture>;
}

function Intro({ eyebrow, title, body, light }: { eyebrow: string; title: string; body?: string; light?: boolean }) {
  return <div className="max-w-3xl"><p className={`mb-4 text-xs font-bold uppercase tracking-[0.18em] ${light ? 'text-[#DCEAF7]' : 'text-[#538AC3]'}`}>{eyebrow}</p><h2 className={`text-[clamp(2.5rem,6vw,5.8rem)] font-bold leading-[0.94] tracking-[-0.04em] ${light ? 'text-white' : 'text-[#234173]'}`}>{title}</h2>{body && <p className={`mt-6 max-w-2xl text-base leading-7 md:text-lg ${light ? 'text-white/80' : 'text-[#64748B]'}`}>{body}</p>}</div>;
}

function Nav({ language }: { language: Locale }) {
  const c = content[language];
  const targetLanguage: Locale = language === 'en' ? 'ms' : 'en';
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState(false);
  const trainingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const close = (event: KeyboardEvent) => event.key === 'Escape' && (setOpen(false), setTraining(false));
    const outside = (event: PointerEvent) => training && !trainingRef.current?.contains(event.target as Node) && setTraining(false);
    addEventListener('keydown', close); addEventListener('pointerdown', outside);
    return () => { document.body.style.overflow = ''; removeEventListener('keydown', close); removeEventListener('pointerdown', outside); };
  }, [open, training]);
  const links = [[c.nav.home, '#home'], [c.nav.cellmax, '#cellmax'], [c.nav.treatments, '#treatments'], [c.nav.why, '#why'], [c.nav.journey, '#journey'], [c.nav.faq, '#faq'], [c.nav.visit, '#visit']];
  return <>
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#DCEAF7]/70 bg-white/90 px-4 py-2 backdrop-blur-xl md:px-6" aria-label={c.a11y.navigation}><div className="mx-auto flex max-w-[1600px] items-center justify-between">
      <a href="#home" className="rounded focus-visible:ring-2 focus-visible:ring-[#538AC3]" aria-label={c.a11y.home}><img src={logoDefault} width="2560" height="654" alt="Klinik Inocare" className="h-auto w-40 md:w-48"/></a>
      <div className="hidden items-center gap-4 md:flex lg:gap-6"><a href="#treatments" className="py-3 text-sm font-semibold text-[#234173]">{c.nav.treatments}</a><a href="#why" className="hidden py-3 text-sm font-semibold text-[#234173] lg:block">{c.nav.why}</a><a href="#visit" className="hidden py-3 text-sm font-semibold text-[#234173] lg:block">{c.nav.visit}</a>
        <div ref={trainingRef} className="relative"><button type="button" className="min-h-11 text-sm font-semibold text-[#234173]" aria-expanded={training} onClick={() => setTraining(!training)}>{c.nav.training} ⌄</button><div className={`absolute right-0 top-full w-72 rounded-2xl border border-[#DCEAF7] bg-white p-2 shadow-2xl ${training ? 'block' : 'hidden'}`}>{presentations.map((p) => <a key={p.id} href={p.href} className="block rounded-xl px-3 py-3 hover:bg-[#F7F9FC]"><b className="block text-sm text-[#234173]">{p.title}</b><span className="mt-1 block text-xs text-[#64748B]">{p.description}</span></a>)}</div></div>
        <a href={langHref(targetLanguage)} className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#DCEAF7] px-3 text-sm font-bold text-[#234173]" aria-label={c.switchAria} onClick={(event) => switchLanguage(event, targetLanguage)}>{c.switchLabel}</a>
        <a href={waHref(language)} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 rounded-full bg-[#234173] px-5 text-sm font-bold text-white" onClick={() => track('whatsapp_click', { placement: 'navigation', language })}><WhatsAppIcon/>{c.common.whatsapp}</a>
      </div>
      <button type="button" className="relative h-11 w-11 md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? c.nav.close : c.nav.open} onClick={() => setOpen(!open)}><span className={`absolute left-2.5 top-4 h-0.5 w-6 bg-[#234173] transition ${open ? 'translate-y-1.5 rotate-45' : ''}`}/><span className={`absolute left-2.5 top-[21px] h-0.5 w-6 bg-[#234173] ${open ? 'opacity-0' : ''}`}/><span className={`absolute left-2.5 top-[27px] h-0.5 w-6 bg-[#234173] transition ${open ? '-translate-y-1.5 -rotate-45' : ''}`}/></button>
    </div></nav>
    <div className={`fixed inset-0 z-40 md:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}><button type="button" aria-label={c.nav.close} className={`absolute inset-0 bg-[#1E293B]/30 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)}/><aside id="mobile-menu" className={`absolute right-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white px-7 pb-8 pt-24 shadow-2xl transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      {links.map(([label, href]) => <a key={href} href={href} className="block border-b border-[#DCEAF7] py-3 text-2xl font-bold text-[#234173]" onClick={() => setOpen(false)}>{label}</a>)}<p className="mb-2 mt-6 text-xs font-bold uppercase tracking-widest text-[#64748B]">{c.nav.training}</p>{presentations.map((p) => <a key={p.id} href={p.href} className="mb-2 flex min-h-11 items-center justify-between rounded-xl bg-[#F7F9FC] px-4 text-sm font-bold text-[#234173]">{p.title}<span>↗</span></a>)}<div className="mt-6 flex gap-2"><a href={langHref(targetLanguage)} className="flex min-h-11 min-w-14 items-center justify-center rounded-full border border-[#234173] font-bold text-[#234173]" onClick={(event) => { setOpen(false); switchLanguage(event, targetLanguage); }}>{c.switchLabel}</a><a href={waHref(language)} target="_blank" rel="noreferrer" className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#234173] text-sm font-bold text-white" onClick={() => track('whatsapp_click', { placement: 'mobile_navigation', language })}><WhatsAppIcon/>{c.common.whatsapp}</a></div>
    </aside></div>
  </>;
}

function ConsentBanner({ language, choice, choose, privacy }: { language: Locale; choice: Consent; choose: (value: Exclude<Consent, null>) => void; privacy: () => void }) {
  if (choice) return null;
  const c = content[language].consent;
  return <aside className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl rounded-2xl border border-[#DCEAF7] bg-white p-4 shadow-2xl md:flex md:items-center md:gap-5"><div className="flex-1"><h2 className="font-bold text-[#234173]">{c.title}</h2><p className="mt-1 text-xs leading-5 text-[#64748B]">{c.body}</p><button type="button" className="mt-1 text-xs font-semibold text-[#234173] underline" onClick={privacy}>{c.learn}</button></div><div className="mt-4 flex gap-2 md:mt-0"><button type="button" className="min-h-11 rounded-full border border-[#234173] px-4 text-xs font-bold text-[#234173]" onClick={() => choose('denied')}>{c.decline}</button><button type="button" className="min-h-11 rounded-full bg-[#234173] px-4 text-xs font-bold text-white" onClick={() => choose('granted')}>{c.accept}</button></div></aside>;
}

function Section({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`scroll-mt-20 px-4 py-20 md:px-6 md:py-28 ${className}`}>{children}</section>;
}

export default function App() {
  const language = locale();
  const targetLanguage: Locale = language === 'en' ? 'ms' : 'en';
  const c = content[language];
  const [consent, setConsent] = useState<Consent>(null);
  const privacyRef = useRef<HTMLDialogElement>(null);
  const depths = useRef(new Set<number>());
  useEffect(() => {
    document.documentElement.lang = language === 'ms' ? 'ms-MY' : 'en-MY';
    const saved = localStorage.getItem(CONSENT_KEY);
    const initial = saved === 'granted' || saved === 'denied' ? saved : null;
    setConsent(initial); ensureGtag();
    window.gtag?.('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    if (initial === 'granted') { window.gtag?.('consent', 'update', { analytics_storage: 'granted' }); loadAnalytics(); }
  }, [language]);
  useEffect(() => {
    const onScroll = () => { const total = document.documentElement.scrollHeight - innerHeight; if (!total) return; const value = scrollY / total * 100; [50, 90].forEach((n) => { if (value >= n && !depths.current.has(n)) { depths.current.add(n); track('scroll_depth', { percent: n, language }); } }); };
    addEventListener('scroll', onScroll, { passive: true }); return () => removeEventListener('scroll', onScroll);
  }, [language]);
  const choose = (value: Exclude<Consent, null>) => { ensureGtag(); localStorage.setItem(CONSENT_KEY, value); setConsent(value); window.gtag?.('consent', 'update', { analytics_storage: value }); if (value === 'granted') loadAnalytics(); };
  const privacy = () => privacyRef.current?.showModal();
  return <div className="bg-white text-[#1E293B]">
    <a href="#main" className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-full bg-white px-4 py-3 font-bold text-[#234173] shadow focus:translate-y-0">{c.a11y.skip}</a><Nav language={language}/>
    <main id="main">
      <section id="home" className="min-h-screen min-h-[100dvh] px-3 pb-3 pt-24 md:px-5 md:pb-5"><div className="relative mx-auto min-h-[calc(100vh-7rem)] max-w-[1600px] overflow-hidden rounded-2xl bg-[#DCEAF7]">
        <Picture alt="" avif={`${hero640Avif} 640w, ${hero1024Avif} 1024w, ${hero1536Avif} 1536w`} webp={`${hero640Webp} 640w, ${hero1024Webp} 1024w, ${hero1536Webp} 1536w`} fallback={hero1024Webp} eager className="absolute inset-0 h-full w-full object-cover object-[68%_center] md:object-center"/><div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent md:via-white/40"/>
        <div className="relative z-10 flex min-h-[calc(100vh-7rem)] max-w-4xl flex-col justify-between p-5 md:p-10 lg:p-12"><div className="max-w-2xl pt-4 md:pt-8"><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#538AC3]">{c.hero.eyebrow}</p><h1 className="text-[clamp(3rem,8.5vw,8rem)] font-bold leading-[0.88] tracking-[-0.06em] text-[#234173]">{c.hero.title}</h1><p className="mt-6 max-w-xl text-base font-medium leading-7 md:text-xl">{c.hero.body}</p><div className="mt-7 flex flex-wrap gap-3"><a href={waHref(language)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center gap-2 rounded-full bg-[#234173] px-6 text-sm font-bold text-white" onClick={() => track('whatsapp_click', { placement: 'hero', language })}><WhatsAppIcon/>{c.common.whatsapp}</a><a href="#treatments" className="flex min-h-12 items-center gap-2 rounded-full border border-[#234173] bg-white/80 px-6 text-sm font-bold text-[#234173]">{c.common.explore}<Arrow/></a></div></div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white/85 p-4 backdrop-blur"><p className="text-sm font-bold text-[#234173]">{c.common.qualifier}</p><p className="mt-1 text-xs leading-5 text-[#64748B]">{c.hero.note}</p></div><div className="rounded-xl bg-[#234173] p-4 text-white sm:text-right"><p className="text-sm font-bold">{c.common.promise}</p><p className="mt-1 text-xs text-white/70">{c.common.location}</p></div></div>
        </div></div></section>

      <Section id="cellmax"><div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[.92fr_1.08fr]"><div className="flex flex-col justify-between rounded-2xl bg-[#F7F9FC] p-6 md:p-10"><div><p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#538AC3]">{c.cellmax.eyebrow}</p><h2 className="text-[clamp(2.8rem,6vw,5.8rem)] font-bold leading-[.92] tracking-[-.05em] text-[#234173]">{c.cellmax.title}</h2><p className="mt-6 text-base leading-7 text-[#64748B] md:text-lg">{c.cellmax.body}</p></div><p className="mt-10 rounded-xl border border-[#DCEAF7] bg-white p-5 text-sm font-semibold leading-6 text-[#234173]">{c.cellmax.qualifier}</p></div><div className="relative min-h-[560px] overflow-hidden rounded-2xl bg-[#234173]"><Picture alt="" avif={`${cellmax640Avif} 640w, ${cellmax1024Avif} 1024w, ${cellmax1536Avif} 1536w`} webp={`${cellmax640Webp} 640w, ${cellmax1024Webp} 1024w, ${cellmax1536Webp} 1536w`} fallback={cellmax1024Webp} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-[#234173]/45"/><div className="absolute inset-x-4 bottom-4 grid gap-2 md:inset-x-6 md:bottom-6 md:grid-cols-3">{c.cellmax.points.map(([title, text]) => <article key={title} className="rounded-xl bg-white/95 p-4"><h3 className="font-bold text-[#234173]">{title}</h3><p className="mt-2 text-xs leading-5 text-[#64748B]">{text}</p></article>)}</div></div></div></Section>

      <Section id="treatments" className="bg-[#234173]"><div className="mx-auto max-w-7xl"><Intro eyebrow={c.treatments.eyebrow} title={c.treatments.title} body={c.treatments.intro} light/><div className="mt-12 grid gap-4 lg:grid-cols-3">{c.treatments.items.map((item) => <article key={item.id} className="flex min-h-[430px] flex-col justify-between rounded-2xl bg-white p-6 md:p-8"><div><span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCEAF7] text-xs font-bold text-[#234173]">{item.num}</span><h3 className="mt-8 text-4xl font-bold tracking-[-.04em] text-[#234173]">{item.title}</h3><p className="mt-6 leading-7">{item.summary}</p><p className="mt-4 border-l-2 border-[#538AC3] pl-4 text-sm leading-6 text-[#64748B]">{item.assessment}</p></div><a href={waHref(language, item.topic)} target="_blank" rel="noreferrer" className="mt-8 flex min-h-12 items-center justify-between rounded-full bg-[#F7F9FC] px-5 text-sm font-bold text-[#234173]" onClick={() => { track('service_interest', { service: item.id, language }); track('whatsapp_click', { placement: 'pathway', service: item.id, language }); }}>{c.treatments.ask} {item.title}<Arrow/></a></article>)}</div></div></Section>

      <Section id="why"><div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><Intro eyebrow={c.why.eyebrow} title={c.why.title} body={c.why.body}/><div className="grid gap-3 sm:grid-cols-2">{c.why.reasons.map(([title, text], i) => <article key={title} className={`rounded-2xl p-5 ${i === 0 ? 'bg-[#DCEAF7]' : 'bg-[#F7F9FC]'}`}><h3 className="text-lg font-bold text-[#234173]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#64748B]">{text}</p></article>)}</div></div><article className="mt-12 grid overflow-hidden rounded-2xl border border-[#DCEAF7] lg:grid-cols-[.72fr_1.28fr]"><div className="relative min-h-[280px] bg-[#234173]"><Picture alt="" avif={`${icon640Avif} 640w, ${icon1024Avif} 1024w`} webp={`${icon640Webp} 640w, ${icon1024Webp} 1024w`} fallback={icon640Webp} square className="absolute inset-0 h-full w-full object-cover"/></div><div className="flex flex-col justify-center p-6 md:p-10"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#538AC3]">{c.why.role}</p><h3 className="mt-4 text-3xl font-bold tracking-[-.03em] text-[#234173] md:text-5xl">{c.why.name}</h3><p className="mt-5 font-semibold">{c.why.qualification}</p><p className="mt-2 text-sm text-[#64748B]">{c.why.registration}</p><p className="mt-6 text-xs leading-5 text-[#64748B]">{c.why.note}</p></div></article></div></Section>

      <Section id="journey" className="bg-[#F7F9FC]"><div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-2xl bg-white p-6 md:p-10"><Intro eyebrow={c.journey.eyebrow} title={c.journey.title} body={c.journey.intro}/><ol className="mt-10 space-y-3">{c.journey.steps.map(([title, text], i) => <li key={title} className="grid grid-cols-[3rem_1fr] gap-4 rounded-xl bg-[#F7F9FC] p-4"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#234173] text-sm font-bold text-white">0{i + 1}</span><div><h3 className="text-lg font-bold text-[#234173]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#64748B]">{text}</p></div></li>)}</ol></div><div className="relative min-h-[560px] overflow-hidden rounded-2xl bg-[#234173]"><Picture alt="" avif={`${support640Avif} 640w, ${support1024Avif} 1024w`} webp={`${support640Webp} 640w, ${support1024Webp} 1024w`} fallback={support640Webp} square className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-[#234173] via-[#234173]/20 to-transparent"/><div className="absolute inset-x-5 bottom-5 rounded-xl bg-white/95 p-5 md:inset-x-7 md:bottom-7 md:p-7"><h3 className="text-xl font-bold text-[#234173]">{c.journey.bring}</h3><ul className="mt-4 space-y-2 text-sm">{c.journey.list.map((item) => <li key={item} className="flex gap-2"><span className="text-[#538AC3]">●</span>{item}</li>)}</ul><p className="mt-5 border-t border-[#DCEAF7] pt-4 text-xs font-semibold leading-5 text-[#234173]">{c.journey.emergency}</p></div></div></div></Section>

      <Section id="faq"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]"><div className="lg:sticky lg:top-28 lg:self-start"><Intro eyebrow={c.faq.eyebrow} title={c.faq.title}/><p className="mt-6 rounded-xl bg-[#DCEAF7] p-4 text-sm font-semibold text-[#234173]">{c.common.qualifier}</p></div><div className="divide-y divide-[#DCEAF7] border-y border-[#DCEAF7]">{c.faq.items.map(([q, a], i) => <details key={q} className="group" open={i === 0}><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-bold text-[#234173]">{q}<span className="text-2xl font-normal group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-6 pr-8 text-sm leading-7 text-[#64748B] md:text-base">{a}</p></details>)}</div></div></Section>

      <section id="visit" className="scroll-mt-20 px-3 pb-3 md:px-5 md:pb-5"><div className="mx-auto max-w-[1600px] overflow-hidden rounded-2xl bg-[#234173] text-white"><div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1fr_.9fr] lg:p-14"><div><Intro eyebrow={c.visit.eyebrow} title={c.visit.title} body={c.visit.body} light/><div className="mt-8 flex flex-wrap gap-3"><a href={waHref(language)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#234173]" onClick={() => track('whatsapp_click', { placement: 'visit', language })}><WhatsAppIcon/>{c.common.whatsapp}</a><a href="tel:+60397714550" className="flex min-h-12 items-center rounded-full border border-white/50 px-6 text-sm font-bold">{c.visit.call}</a></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><article className="rounded-xl bg-white p-5 text-[#1E293B]"><p className="text-xs font-bold uppercase tracking-widest text-[#538AC3]">{c.visit.addressLabel}</p><p className="mt-3 font-bold leading-6 text-[#234173]">{c.visit.address}</p><p className="mt-2 text-sm text-[#64748B]">{c.visit.landmark}</p><a href="https://www.google.com/maps/search/?api=1&query=G06%20%26%20G07%20VUE%20Residence%20Service%20Suite%20102%20Jalan%20Pahang%2053300%20Kuala%20Lumpur" target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-[#234173]">{c.visit.directions}<Arrow/></a></article><article className="rounded-xl bg-white/10 p-5"><p className="text-xs font-bold uppercase tracking-widest text-[#DCEAF7]">{c.visit.phone}</p><a href="tel:+60397714550" className="mt-3 block text-lg font-bold">+60 3-9771 4550</a><a href="tel:+60178974751" className="block text-lg font-bold">+60 17-897 4751</a><p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#DCEAF7]">{c.visit.hoursLabel}</p><p className="mt-2 text-sm leading-6 text-white/75">{c.visit.hours}</p></article></div></div>
        <footer className="bg-white px-6 py-8 text-[#234173] md:px-10 lg:px-14"><div className="grid gap-8 md:grid-cols-[1fr_auto_auto]"><div><img src={logoDefault} width="2560" height="654" alt="Klinik Inocare" className="h-auto w-44"/><p className="mt-4 max-w-sm text-sm text-[#64748B]">{c.footer.summary}</p></div><div><p className="text-xs font-bold uppercase tracking-widest text-[#538AC3]">{c.nav.training}</p>{presentations.map((p) => <a key={p.id} href={p.href} className="mt-3 block text-sm font-semibold">{p.title}</a>)}</div><div className="flex flex-col items-start"><a href={langHref(targetLanguage)} className="py-3 text-sm font-semibold" onClick={(event) => switchLanguage(event, targetLanguage)}>{c.switchAria}</a><a href="https://klinikinocare.com/" target="_blank" rel="noreferrer" className="py-3 text-sm font-semibold">{c.visit.website}</a><button type="button" className="py-3 text-sm font-semibold" onClick={privacy}>{c.footer.privacy}</button><button type="button" className="py-3 text-sm font-semibold" onClick={() => setConsent(null)}>{c.footer.settings}</button></div></div><div className="mt-8 border-t border-[#DCEAF7] pt-6 text-xs leading-5 text-[#64748B]"><p>{c.footer.medical}</p><p className="mt-2">© {new Date().getFullYear()} {c.footer.rights}</p></div></footer>
      </div></section>
    </main>
    <a href={waHref(language)} target="_blank" rel="noreferrer" className="fixed bottom-4 right-4 z-40 flex min-h-12 items-center gap-2 rounded-full bg-[#234173] px-5 text-sm font-bold text-white shadow-xl ring-2 ring-white" aria-label={c.common.whatsapp} onClick={() => track('whatsapp_click', { placement: 'floating', language })}><WhatsAppIcon/><span className="hidden sm:inline">{c.common.whatsapp}</span></a>
    <ConsentBanner language={language} choice={consent} choose={choose} privacy={privacy}/>
    <dialog ref={privacyRef} className="w-[calc(100%-2rem)] max-w-xl rounded-2xl p-0 text-[#1E293B] shadow-2xl backdrop:bg-[#1E293B]/50"><div className="p-6 md:p-8"><div className="flex items-start justify-between gap-4"><h2 className="text-2xl font-bold text-[#234173]">{c.privacy.title}</h2><form method="dialog"><button type="submit" className="h-11 w-11 rounded-full border border-[#DCEAF7] text-xl text-[#234173]" aria-label={c.privacy.close}>×</button></form></div><p className="mt-5 text-sm leading-7 text-[#64748B]">{c.privacy.body}</p><p className="mt-4 text-sm leading-7 text-[#64748B]">{c.privacy.analytics}</p><form method="dialog" className="mt-6"><button type="submit" className="min-h-11 rounded-full bg-[#234173] px-5 text-sm font-bold text-white">{c.privacy.close}</button></form></div></dialog>
  </div>;
}
