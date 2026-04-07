import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion'
import heroImg from './assets/hero.png'
import './App.css'

const RESUME_LINK = '/Shivam_Chaudhary_CV_DE.pdf'

/* ─ Animation Variants ─────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease },
  }),
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease } },
}

/* ─ Data ────────────────────────────────────────────────────── */
const caseStudies = [
  {
    id: 'credit-risk',
    tag: 'Credit Risk · BFSI · LTIMindtree',
    title: 'Credit Risk Data Seeding & FICO Integration',
    problem: 'Equifax needed a scalable pipeline to ingest and seed credit profiles, FICO scores, bureau data, and transaction records — connected to downstream ML feature stores with tight latency SLAs.',
    built: 'Designed search-and-match algorithms for seeding and inquiry orchestration; built SQL-driven feature pipelines; implemented GCP metadata backup and load balancing with CI/CD automation around keying and linking modules.',
    metrics: [{ v: '50M+/day', l: 'records' }, { v: '45%', l: 'faster latency' }, { v: '~30%', l: 'better SLAs' }],
    stack: ['Python', 'SQL', 'GCP', 'BigQuery', 'PySpark', 'Airflow', 'dbt'],
    accent: 'cyan',
  },
  {
    id: 'fraud',
    tag: 'Fraud Detection · BFSI · LTIMindtree',
    title: 'AI-Driven Fraud Detection & Anomaly Scoring',
    problem: 'Citizens Bank required an ML-backed decisioning layer capable of processing high-volume transaction streams and reducing false positives without sacrificing recall on actual fraud signals.',
    built: 'Developed ML-driven fraud decisioning flows over streaming transaction data, integrated anomaly scoring pipelines, and built monitoring and threshold automation to support continuous tuning.',
    metrics: [{ v: '20M+/day', l: 'transactions' }, { v: '35%', l: 'fewer false positives' }, { v: '$2.5M+', l: 'annual savings' }],
    stack: ['Python', 'ML', 'PySpark', 'GCP', 'BigQuery', 'SQL'],
    accent: 'violet',
  },
  {
    id: 'enterprise-data',
    tag: 'Data Engineering · Enterprise Scale',
    title: 'Enterprise Data Engineering Layer',
    problem: 'Multiple business units needed a unified data layer handling diverse input formats at massive scale — with consistent validation, observability, and delivery SLAs measured in minutes, not hours.',
    built: 'Architected batch and streaming ingestion layers for CSV, GZIP, and Parquet inputs; built automation and validation frameworks; delivered data contracts and quality controls across the full pipeline lifecycle.',
    metrics: [{ v: '10+ TB/day', l: 'ingestion' }, { v: 'Hours → mins', l: 'latency' }, { v: '40%', l: 'less manual prep' }],
    stack: ['Python', 'PySpark', 'SQL', 'GCP', 'dbt', 'Airflow', 'Data Contracts'],
    accent: 'blue',
  },
  {
    id: 'plurit',
    tag: 'Product · Platform · Founder',
    title: 'Plurit — Event Discovery, Matching & Community',
    problem: 'Building a consumer platform from scratch: event discovery, social matching, and community engagement — with a cloud-native backend that could scale and iterate at startup speed.',
    built: 'Defined product roadmap and infrastructure architecture; built AWS-native backend with Lambda, DynamoDB, API Gateway, and CDK; shipped onboarding, matching, and event discovery flows from concept to live.',
    metrics: [{ v: 'Founder', l: 'execution' }, { v: 'Full-stack', l: 'ownership' }, { v: 'Concept', l: '→ shipped' }],
    stack: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'CDK', 'React Native', 'Product'],
    accent: 'amber',
  },
]

const experience = [
  {
    company: 'Plurit',
    role: 'Director, Product & Platform Architecture',
    period: '2024 – Present',
    location: 'Bengaluru, India',
    chapter: 'Founder-Operator',
    chapterColor: 'amber',
    summary: 'Shaping product direction, cloud infrastructure, and user journeys for a social events and community discovery platform.',
    highlights: [
      'Owned end-to-end strategy for event discovery, community matching, and social engagement journeys',
      'Defined product roadmap: onboarding flows, matching algorithms, and retention/growth loops',
      'Scaled backend with AWS microservices — Lambda, DynamoDB, API Gateway, and CDK infrastructure',
      'Led cross-functional execution across product, design, and engineering from concept to shipped features',
    ],
    stack: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'CDK', 'React Native'],
  },
  {
    company: 'LTIMindtree',
    role: 'Senior Data Engineer',
    period: '2022 – 2024',
    location: 'USA',
    chapter: 'Enterprise Data Fabric',
    chapterColor: 'cyan',
    summary: 'Enterprise analytics engineering for Equifax and Citizens Bank — credit risk infrastructure, fraud decisioning, and high-volume data platform work across GCP.',
    highlights: [
      'Designed search-and-match algorithms for credit seeding and inquiry pipeline orchestration at Equifax',
      'Built SQL-driven feature pipelines processing 50M+ records/day integrated with FICO and bureau data',
      'Implemented GCP metadata backup and load balancing across distributed ingestion layers',
      'Built CI/CD automation around keying, linking, and validation modules; reduced latency by 45%',
      'Delivered fraud/anomaly scoring on 20M+ daily transactions — contributed $2.5M+ in annual savings',
    ],
    stack: ['Python', 'SQL', 'GCP', 'BigQuery', 'PySpark', 'dbt', 'Airflow'],
  },
  {
    company: 'PepsiCo',
    role: 'Data Engineer',
    period: '2021 – 2022',
    location: 'USA',
    chapter: 'Cloud Migration + Feature Pipelines',
    chapterColor: 'blue',
    summary: 'Cloud migration, feature pipeline automation, and ML experiment validation across supply chain and commercial data domains.',
    highlights: [
      'Led BigQuery SQL migration from legacy data warehouse systems across supply chain and commercial domains',
      'Built ETL automation for hit-rate and feature-building pipelines from CSV, API, and semi-structured sources',
      'Architected Azure Databricks + ADF workflows with integrated Power BI reporting layers',
      'Validated ML experiments and led architecture reviews for analytics modernization initiatives',
    ],
    stack: ['BigQuery', 'SQL', 'Azure', 'Databricks', 'ADF', 'Power BI', 'Python'],
  },
  {
    company: 'Rangam',
    role: 'AI & Data Systems Consultant',
    period: '2021',
    location: 'USA',
    chapter: 'AI Systems Layer',
    chapterColor: 'violet',
    summary: 'Secure AI solutions, CV preprocessing pipelines, and staffing-domain conversational architecture.',
    highlights: [
      'Built resume and CV preprocessing pipelines for structured data extraction and candidate matching',
      'Designed architecture for a staffing-domain chatbot with NLP and retrieval workflows',
      'Delivered scalable AI solutions with emphasis on data security and system reliability',
    ],
    stack: ['Python', 'NLP', 'AWS', 'REST APIs'],
  },
  {
    company: 'Amdocs',
    role: 'Data Engineer & QA Analyst',
    period: '2015 – 2018',
    location: 'India & Argentina',
    chapter: 'Foundations Under Pressure',
    chapterColor: 'green',
    summary: 'Where reliability, scale, and delivery discipline became instinct — building data warehouse and OSS/BSS foundations for Telefónica Argentina and major telecom operators.',
    highlights: [
      'Built data warehouse and data lake foundations using SQL and NoSQL across telecom billing and operations',
      'Delivered ETL pipelines for OSS/BSS systems serving Telefónica Argentina and other major operators',
      'Collaborated across product, finance, and marketing to automate deployment and delivery workflows',
      'Led UAT and system integration testing for large-scale telecom platform rollouts',
      'Contributed to $1.2M/month in operational savings through system optimization',
    ],
    stack: ['SQL', 'NoSQL', 'ETL', 'Data Warehouse', 'OSS/BSS', 'Telecom Platforms'],
  },
]

const capabilities = [
  {
    area: 'Data Engineering',
    depth: 'Expert',
    color: 'cyan',
    items: ['Python · SQL · PySpark', 'ETL/ELT pipelines', 'Data lakehouse architecture', 'dbt · Airflow · Spark', 'Data contracts + validation'],
  },
  {
    area: 'Cloud Platforms',
    depth: 'Expert',
    color: 'blue',
    items: ['GCP · BigQuery · Dataflow', 'AWS Lambda · S3 · SageMaker · CDK', 'Azure Databricks · ADF · Power BI', 'Multi-cloud architecture'],
  },
  {
    area: 'Analytics & ML',
    depth: 'Advanced',
    color: 'violet',
    items: ['Feature engineering + stores', 'Model validation + experiment tracking', 'Regression · Classification · NLP', 'Fraud/anomaly detection systems'],
  },
  {
    area: 'Product & Platform',
    depth: 'Advanced',
    color: 'amber',
    items: ['Product roadmap + strategy', 'CI/CD + observability', 'Stakeholder + architecture alignment', 'Founder-level execution'],
  },
]

const labs = [
  { title: 'Optum Health Analytics Capstone', context: 'Northeastern · MS Analytics', desc: 'Analytics pipelines and ML classification models for healthcare data pattern detection.', tags: ['Python', 'ML', 'Healthcare'] },
  { title: 'Fashion-MNIST Neural Network Benchmarking', context: 'Academic Research', desc: 'Benchmarked CNN architectures on Fashion-MNIST — accuracy, training dynamics, and generalization.', tags: ['PyTorch', 'CNN', 'Deep Learning'] },
  { title: 'IMDb Text Analytics & Sentiment Classification', context: 'Applied NLP', desc: 'NLP pipeline for sentiment classification and topic modeling on a large-scale review corpus.', tags: ['NLP', 'Python', 'Scikit-learn'] },
  { title: 'Black Friday Purchase Prediction', context: 'Applied ML', desc: 'Feature-engineered retail transaction data to predict purchase behavior and segment buyer intent.', tags: ['Python', 'XGBoost', 'Feature Engineering'] },
  { title: 'CrowdDoing — Non-Profit Data Analytics', context: 'Volunteer · 2021 – Present', desc: 'Hypothesis-testing frameworks for sparse datasets; Tableau + R Shiny dashboards for impact measurement.', tags: ['R', 'Tableau', 'Statistics'] },
]

const journey = [
  { period: '2011–2015', place: 'India', text: 'B.Tech Computer Engineering, RTU — foundations in systems, logic, and programming.' },
  { period: '2015–2018', place: 'India + Argentina', text: 'Amdocs — telecom data systems, OSS/BSS, data warehouse foundations. $1.2M/month impact.' },
  { period: '2019–2020', place: 'USA', text: 'MS Analytics (AI/ML), Northeastern — Optum capstone, ML research, applied experiments.' },
  { period: '2021–2022', place: 'USA', text: 'PepsiCo + Rangam — BigQuery migration, feature pipelines, Azure analytics, ML validation.' },
  { period: '2022–2024', place: 'USA', text: 'LTIMindtree — enterprise data fabric for Equifax + Citizens: credit risk, fraud, 10+ TB/day.' },
  { period: '2024–Now', place: 'Bengaluru', text: 'Plurit — Director of Product and Platform. Founder-led execution: strategy, cloud infra, shipping.' },
]

const logos = ['Plurit', 'LTIMindtree', 'PepsiCo', 'Rangam', 'Amdocs', 'Northeastern', 'Equifax', 'Citizens Bank', 'Telefónica']

/* ─ Components ──────────────────────────────────────────────── */

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setScrolled(v > 0.02))
    return unsub
  }, [scrollYProgress])

  return (
    <motion.nav
      className={`nav ${scrolled ? 'nav-scrolled' : ''}`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <a href="#hero" className="nav-brand">SC</a>
      <div className="nav-links">
        <a href="#work">Work</a>
        <a href="#experience">Experience</a>
        <a href="#labs">Labs</a>
        <a href="#contact">Contact</a>
        <a href={RESUME_LINK} download className="nav-cta">Download CV</a>
      </div>
    </motion.nav>
  )
}

function InViewSection({ children, className, id, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      custom={delay}
    >
      {children}
    </motion.section>
  )
}

function CaseCard({ study, index }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.article
      ref={ref}
      className={`case-card case-${study.accent} ${open ? 'case-open' : ''}`}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease }}
      onClick={() => setOpen(!open)}
    >
      <div className="case-tag">{study.tag}</div>
      <h3>{study.title}</h3>
      <div className="case-metrics">
        {study.metrics.map((m) => (
          <div key={m.l} className="metric-chip">
            <strong>{m.v}</strong>
            <span>{m.l}</span>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="case-detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="case-block">
              <span className="block-label">The Problem</span>
              <p>{study.problem}</p>
            </div>
            <div className="case-block">
              <span className="block-label">What I Built</span>
              <p>{study.built}</p>
            </div>
            <div className="stack-row">
              {study.stack.map((s) => <span key={s} className="stack-pill">{s}</span>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="case-toggle-row">
        <span className="case-toggle">{open ? '↑ Collapse' : '↓ Expand'}</span>
      </div>
    </motion.article>
  )
}

function ExpCard({ role, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      className="exp-card"
      variants={slideLeft}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ delay: index * 0.08 }}
    >
      <div className="exp-header">
        <div className="exp-left">
          <div className="exp-company">{role.company}</div>
          <div className="exp-role">{role.role}</div>
        </div>
        <div className="exp-right">
          <span className="exp-period">{role.period}</span>
          <span className="exp-location">{role.location}</span>
          <span className={`exp-chapter chapter-${role.chapterColor}`}>{role.chapter}</span>
        </div>
      </div>
      <p className="exp-summary">{role.summary}</p>
      <ul className="exp-bullets">
        {role.highlights.map((h) => <li key={h}>{h}</li>)}
      </ul>
      <div className="stack-row">
        {role.stack.map((s) => <span key={s} className="stack-pill">{s}</span>)}
      </div>
    </motion.div>
  )
}

/* ─ App ─────────────────────────────────────────────────────── */
export default function App() {
  const [activeStage, setActiveStage] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    const onMove = (e) => {
      setTilt({
        x: (e.clientX / window.innerWidth - 0.5) * 14,
        y: (e.clientY / window.innerHeight - 0.5) * 14,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <ScrollProgress />
      <NavBar />

      {/* Ambient background orbs */}
      <div className="ambient" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
        <span className="orb orb-4" />
      </div>

      <main className="page" id="hero">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="hero" ref={heroRef}>
          <motion.div className="hero-content" style={{ y: heroY, opacity: heroOpacity }}>
            <div className="hero-grid">
              <div className="hero-copy">
                <motion.p
                  className="eyebrow"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease }}
                >
                  Senior Data Engineer · Systems Thinker · Founder
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.18, ease }}
                >
                  Building data systems that scale, decide, and deliver.
                </motion.h1>

                <motion.p
                  className="hero-sub"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.28, ease }}
                >
                  8+ years across cloud-native data platforms, analytics engineering,
                  and applied ML — from telecom foundations and enterprise data systems
                  to founder-led product infrastructure.
                </motion.p>

                <motion.div
                  className="hero-actions"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.38, ease }}
                >
                  <a href="#work" className="btn-primary">View My Work</a>
                  <a href="#experience" className="btn-ghost">Experience</a>
                  <a href={RESUME_LINK} download className="btn-ghost">Download CV</a>
                  <a href="#contact" className="btn-ghost">Connect</a>
                </motion.div>
              </div>

              <motion.div
                className="hero-visual"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, delay: 0.22, ease }}
                style={{
                  transform: `perspective(1200px) rotateX(${tilt.y * 0.08}deg) rotateY(${-tilt.x * 0.08}deg)`,
                }}
              >
                <div className="portrait-wrap">
                  <img src={heroImg} alt="Shivam Chaudhary — Senior Data Engineer" className="portrait-img" />
                  <div className="portrait-overlay">
                    <span className="po-name">Shivam Chaudhary</span>
                    <span className="po-title">Senior Data Engineer</span>
                    <span className="po-sub">Data Platforms · Analytics · ML · Product</span>
                  </div>
                  {/* Liquid glass shimmer */}
                  <div className="portrait-shimmer" aria-hidden="true" />
                </div>

                <motion.div
                  className="location-strip"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.5, ease }}
                >
                  {['India', 'Argentina', 'USA', 'Bengaluru'].map((loc) => (
                    <span key={loc} className="loc-tag">{loc}</span>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Scroll cue */}
            <motion.div
              className="scroll-cue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <motion.div
                className="scroll-dot"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ── LOGO STRIP ──────────────────────────────────────────── */}
        <InViewSection className="logo-strip">
          <p className="logo-label">Trusted experience across</p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...logos, ...logos].map((logo, i) => (
                <span key={`${logo}-${i}`} className="logo-pill">{logo}</span>
              ))}
            </div>
          </div>
        </InViewSection>

        {/* ── START HERE ──────────────────────────────────────────── */}
        <InViewSection className="glass-card" id="start">
          <span className="section-label">Start Here</span>
          <h2>I build systems that make complexity usable.</h2>
          <div className="story-cols">
            <p>
              I began in enterprise telecom environments, where reliability, scale, and delivery
              discipline mattered every day. Over time, I moved deeper into data engineering,
              cloud analytics, and ML-backed workflows — building systems that improve how
              businesses ingest, validate, model, and act on data.
            </p>
            <p>
              My work has taken me across India, Argentina, and the United States, spanning
              telecom, BFSI, supply chain, and consumer technology. Today, alongside
              enterprise-scale data engineering, I also operate as a founder-builder — shaping
              product direction, infrastructure, and user journeys at Plurit.
            </p>
          </div>
        </InViewSection>

        {/* ── IMPACT METRICS ──────────────────────────────────────── */}
        <InViewSection className="section" id="impact">
          <div className="section-head">
            <span className="section-label">By the Numbers</span>
            <h2>Impact at scale</h2>
          </div>
          <motion.div
            className="metrics-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              { v: '8+ Years', l: 'building data and analytics systems' },
              { v: '50M+/day', l: 'credit risk records ingested and seeded' },
              { v: '20M+/day', l: 'transactions in fraud/anomaly workflows' },
              { v: '10+ TB/day', l: 'enterprise ingestion scale' },
              { v: '45% Faster', l: 'feature generation latency reduction' },
              { v: '$2.5M+/yr', l: 'savings via fraud prioritization' },
              { v: '$1.2M/mo', l: 'operational savings at Amdocs' },
            ].map((m) => (
              <motion.article key={m.l} className="metric-card" variants={staggerItem}>
                <strong>{m.v}</strong>
                <p>{m.l}</p>
              </motion.article>
            ))}
          </motion.div>
        </InViewSection>

        {/* ── SELECTED WORK ───────────────────────────────────────── */}
        <section className="section" id="work">
          <div className="section-head">
            <span className="section-label">Selected Work</span>
            <h2>Four systems worth understanding</h2>
            <p className="section-sub">
              High-scale risk and fraud infrastructure to founder-led consumer product execution.
              Click any card to expand the full story.
            </p>
          </div>
          <div className="case-grid">
            {caseStudies.map((study, i) => (
              <CaseCard key={study.id} study={study} index={i} />
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ──────────────────────────────────────────── */}
        <section className="section" id="experience">
          <div className="section-head">
            <span className="section-label">Experience</span>
            <h2>Eight years of systems, platforms, and outcomes</h2>
          </div>
          <div className="exp-list">
            {experience.map((role, i) => (
              <ExpCard key={role.company} role={role} index={i} />
            ))}
          </div>
        </section>

        {/* ── CAREER JOURNEY ──────────────────────────────────────── */}
        <InViewSection className="section" id="journey">
          <div className="section-head">
            <span className="section-label">Career Journey</span>
            <h2>India → Argentina → USA → Bengaluru</h2>
          </div>
          <div className="journey-layout">
            <div className="journey-rail">
              {journey.map((step, i) => (
                <button
                  key={step.period}
                  className={`journey-btn ${activeStage === i ? 'active' : ''}`}
                  onClick={() => setActiveStage(i)}
                >
                  <span className="j-period">{step.period}</span>
                  <span className="j-place">{step.place}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={journey[activeStage].period}
                className="journey-detail glass-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease }}
              >
                <div className="jd-place">{journey[activeStage].place}</div>
                <div className="jd-period">{journey[activeStage].period}</div>
                <p>{journey[activeStage].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </InViewSection>

        {/* ── CAPABILITIES ────────────────────────────────────────── */}
        <InViewSection className="section">
          <div className="section-head">
            <span className="section-label">What I Know Deeply</span>
            <h2>Core capabilities</h2>
          </div>
          <motion.div
            className="cap-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {capabilities.map((cap) => (
              <motion.div key={cap.area} className={`cap-card cap-${cap.color}`} variants={staggerItem}>
                <div className="cap-header">
                  <span className="cap-area">{cap.area}</span>
                  <span className="cap-depth">{cap.depth}</span>
                </div>
                <ul className="cap-items">
                  {cap.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </InViewSection>

        {/* ── LABS ────────────────────────────────────────────────── */}
        <InViewSection className="section" id="labs">
          <div className="section-head">
            <span className="section-label">Labs & Experiments</span>
            <h2>Research, applied ML, and side systems</h2>
            <p className="section-sub">
              Academic work, volunteer projects, and applied experiments — the intellectual
              layer beneath the production systems.
            </p>
          </div>
          <motion.div
            className="labs-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {labs.map((lab) => (
              <motion.article key={lab.title} className="lab-card" variants={staggerItem}>
                <span className="lab-context">{lab.context}</span>
                <h3>{lab.title}</h3>
                <p>{lab.desc}</p>
                <div className="stack-row">
                  {lab.tags.map((t) => <span key={t} className="stack-pill">{t}</span>)}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </InViewSection>

        {/* ── EDUCATION ───────────────────────────────────────────── */}
        <InViewSection className="glass-card edu-section">
          <span className="section-label">Education</span>
          <h2>Credentials</h2>
          <div className="edu-list">
            <div className="edu-item">
              <div className="edu-accent" />
              <div>
                <span className="edu-degree">MS in Analytics (AI/ML)</span>
                <span className="edu-school">Northeastern University · Boston · 2019–2020</span>
                <span className="edu-note">Optum capstone · ML coursework · Applied research</span>
              </div>
            </div>
            <div className="edu-item">
              <div className="edu-accent" />
              <div>
                <span className="edu-degree">B.Tech in Computer Engineering</span>
                <span className="edu-school">Rajasthan Technical University · India · 2011–2015</span>
                <span className="edu-note">Systems, algorithms, and software foundations</span>
              </div>
            </div>
          </div>
        </InViewSection>

        {/* ── FOUNDER NOTE ────────────────────────────────────────── */}
        <InViewSection className="glass-card founder-card">
          <span className="section-label">Founder Note</span>
          <h2>Why I build</h2>
          <p>
            I am most energized by systems at the intersection of scale, clarity, and
            decision-making. Whether enterprise data infrastructure or product execution,
            I build foundations that make complexity usable — and I bring the same discipline
            to a startup environment that I applied at Equifax and PepsiCo.
          </p>
        </InViewSection>

        {/* ── CONTACT ─────────────────────────────────────────────── */}
        <InViewSection className="contact-section" id="contact">
          <span className="section-label">Contact</span>
          <h2>Let's connect</h2>
          <div className="contact-links">
            <a href="https://www.linkedin.com/in/shivamchaudhary69/" target="_blank" rel="noreferrer" className="contact-chip">LinkedIn</a>
            <a href="https://github.com/sheevec" target="_blank" rel="noreferrer" className="contact-chip">GitHub</a>
            <a href="mailto:sheevechaudhary@gmail.com" className="contact-chip">Email</a>
            <a href="tel:+15084944767" className="contact-chip">Call</a>
            <a href={RESUME_LINK} download className="contact-chip contact-primary">Download Resume</a>
          </div>
        </InViewSection>

        <footer className="footer">
          <p>Shivam Chaudhary · Senior Data Engineer · Bengaluru, India</p>
        </footer>

      </main>
    </>
  )
}
