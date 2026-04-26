import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars -- `motion` is used as JSX namespace (motion.div, motion.nav, etc.)
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useInView } from 'framer-motion'
import portraitImg from './assets/portrait.jpg'
import dividerImg from './assets/divider.jpg'
import './App.css'

const RESUME_LINK = '/Shivam_Chaudhary_CV_DE.pdf'
const FORMSPREE_ID = 'mkopyepo'

// Toggle to true once at least one essay is published. Until then the section is hidden
// because aspirational "Coming soon" / "Draft ready" tiles weaken the page more than they help.
const WRITING_LIVE = false

const ease = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay, ease },
  }),
}

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease },
  },
}

const logos = [
  { name: 'Plurit',        src: '/logos/plurit.svg' },
  { name: 'LTIMindtree',   src: '/logos/ltimindtree.svg' },
  { name: 'PepsiCo',       src: '/logos/pepsico.svg' },
  { name: 'Rangam',        src: '/logos/rangam.svg' },
  { name: 'Amdocs',        src: '/logos/amdocs.svg' },
  { name: 'Northeastern',  src: '/logos/northeastern.svg' },
  { name: 'Equifax',       src: '/logos/equifax.svg' },
  { name: 'Citizens Bank', src: '/logos/citizens-bank.svg' },
  { name: 'Telefónica',    src: '/logos/telefonica.svg' },
]

const heroMetrics = [
  { value: '8+', label: 'Years Experience' },
  { value: '50M+', label: 'Records / Day' },
  { value: '$2.5M+', label: 'Savings Delivered' },
  { value: '10TB+', label: 'Daily Data Scale' },
]

const caseStudies = [
  {
    id: 'credit-risk',
    tag: 'Credit Risk · BFSI',
    title: 'Credit Risk Data Seeding & FICO Integration',
    summary:
      'Designed high-scale credit profile, bureau, FICO and transaction pipelines for risk infrastructure connected to downstream ML feature stores.',
    result: '50M+ records/day · 45% faster latency · ~30% better SLA posture',
    problem:
      'Equifax needed a reliable data seeding and inquiry orchestration layer that could connect bureau data, FICO scores, credit profiles and transaction records without breaking latency expectations.',
    built:
      'Built search-and-match logic, SQL-driven feature pipelines, GCP backup workflows, metadata handling and CI/CD automation around keying and linking modules.',
    stack: ['Python', 'SQL', 'GCP', 'BigQuery', 'PySpark', 'Airflow', 'dbt'],
    accent: 'cyan',
    diagram: ['Bureau / FICO', 'Match + Key', 'Feature Store', 'Risk Models'],
    github: 'https://github.com/sheevec/credit-risk-pipeline',
  },
  {
    id: 'fraud',
    tag: 'Fraud ML · BFSI',
    title: 'AI-Driven Fraud Detection & Anomaly Scoring',
    summary:
      'Built ML-backed fraud decisioning flows over high-volume transaction streams to reduce false positives while preserving recall.',
    result: '20M+ transactions/day · 35% fewer false positives · $2.5M+ annual savings',
    problem:
      'Citizens Bank needed a decisioning layer that could prioritize suspicious transaction signals without overwhelming investigation teams with low-value alerts.',
    built:
      'Designed anomaly scoring workflows, monitoring loops, threshold automation and data pipelines that supported continuous tuning of fraud detection outcomes.',
    stack: ['Python', 'ML', 'PySpark', 'GCP', 'BigQuery', 'SQL'],
    accent: 'violet',
    diagram: ['Tx Stream', 'Anomaly', 'Score', 'Decision'],
    github: 'https://github.com/sheevec/fraud-detection-ml',
  },
  {
    id: 'enterprise-data',
    tag: 'Data Platform',
    title: 'Enterprise Data Engineering Layer',
    summary:
      'Architected ingestion, validation and observability patterns for enterprise-scale batch and streaming systems.',
    result: '10+ TB/day · hours to minutes · 40% less manual prep',
    problem:
      'Multiple business units needed a unified data layer that could handle diverse formats with consistent validation, quality controls and delivery guarantees.',
    built:
      'Built ingestion layers for CSV, GZIP and Parquet, validation frameworks, contract-driven controls and data delivery workflows across the pipeline lifecycle.',
    stack: ['Python', 'PySpark', 'SQL', 'GCP', 'dbt', 'Airflow', 'Data Contracts'],
    accent: 'blue',
    diagram: ['CSV / Parquet', 'Validate', 'Lakehouse', 'Consumers'],
    github: 'https://github.com/sheevec/enterprise-data-platform',
  },
  {
    id: 'plurit',
    tag: 'Founder · Product Platform',
    title: 'Plurit — Event Discovery, Matching & Community',
    summary:
      'Built a consumer product layer around event discovery, social matching and community interaction with AWS-native infrastructure.',
    result: 'Founder-led · full-stack ownership · concept to shipped product',
    problem:
      'People discover events but still struggle with decision confidence and meaningful social connection before attending.',
    built:
      'Defined product strategy, AWS microservice architecture, onboarding flows, matching loops, event discovery journeys and backend execution using Lambda, DynamoDB, API Gateway and CDK.',
    stack: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'CDK', 'React Native', 'Product'],
    accent: 'amber',
    diagram: ['Mobile App', 'API Gateway', 'Lambda', 'DynamoDB'],
  },
]

const architectureSystems = [
  {
    title: 'Batch + Streaming Data Pipelines',
    description:
      'Ingestion and transformation systems across CSV, GZIP, Parquet, APIs and event-style workloads with reliable delivery boundaries.',
    flow: ['Sources', 'Validation', 'Transform', 'Warehouse'],
    stack: ['PySpark', 'Airflow', 'BigQuery', 'SQL'],
  },
  {
    title: 'Feature Engineering + ML Decisioning',
    description:
      'Reusable feature pipelines, scoring layers and threshold workflows for fraud, anomaly detection and risk use cases.',
    flow: ['Raw Events', 'Features', 'Model Score', 'Decision'],
    stack: ['Python', 'ML', 'BigQuery', 'Monitoring'],
  },
  {
    title: 'Cloud-Native Product Backends',
    description:
      'Serverless product architecture with APIs, event flows, DynamoDB models and operational dashboards built for fast iteration.',
    flow: ['Mobile App', 'API Gateway', 'Lambda', 'DynamoDB'],
    stack: ['AWS', 'CDK', 'Lambda', 'DynamoDB'],
  },
  {
    title: 'Data Quality + Observability',
    description:
      'Validation rules, metadata controls, SLA tracking and monitoring layers that make data systems safer to operate.',
    flow: ['Contracts', 'Checks', 'Alerts', 'Review'],
    stack: ['dbt', 'SQL', 'CloudWatch', 'Data Contracts'],
  },
]

const experience = [
  {
    company: 'Plurit',
    role: 'Director, Product & Platform Architecture',
    period: '2024 – Present',
    location: 'Bengaluru, India',
    chapter: 'Founder-Operator',
    highlights: [
      'Owned product direction for event discovery, social matching and community engagement.',
      'Designed AWS-native backend architecture using Lambda, DynamoDB, API Gateway and CDK.',
      'Led onboarding, matching and event discovery flows from concept to shipped product.',
    ],
    stack: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'CDK', 'React Native'],
  },
  {
    company: 'LTIMindtree',
    role: 'Senior Data Engineer',
    period: '2022 – 2024',
    location: 'USA',
    chapter: 'Enterprise Data Fabric',
    highlights: [
      'Built credit risk seeding and FICO-integrated pipelines processing 50M+ records/day.',
      'Delivered fraud/anomaly scoring on 20M+ daily transactions with measurable savings.',
      'Reduced latency through CI/CD automation, metadata handling and load balancing.',
    ],
    stack: ['Python', 'SQL', 'GCP', 'BigQuery', 'PySpark', 'dbt', 'Airflow'],
  },
  {
    company: 'PepsiCo',
    role: 'Data Engineer',
    period: '2021 – 2022',
    location: 'USA',
    chapter: 'Cloud Migration + Feature Pipelines',
    highlights: [
      'Led BigQuery SQL migration from legacy warehouse systems.',
      'Built ETL automation for hit-rate and feature-building pipelines.',
      'Integrated Azure Databricks, ADF and Power BI reporting layers.',
    ],
    stack: ['BigQuery', 'SQL', 'Azure', 'Databricks', 'ADF', 'Power BI'],
  },
  {
    company: 'Amdocs',
    role: 'Data Engineer & QA Analyst',
    period: '2015 – 2018',
    location: 'India & Argentina',
    chapter: 'Foundations Under Pressure',
    highlights: [
      'Built data warehouse and data lake foundations across telecom billing and operations.',
      'Delivered ETL pipelines for OSS/BSS systems serving Telefónica Argentina.',
      'Contributed to $1.2M/month in operational savings through system optimization.',
    ],
    stack: ['SQL', 'NoSQL', 'ETL', 'Data Warehouse', 'OSS/BSS'],
  },
]

const howIWork = [
  {
    title: 'I start with the operating problem',
    description:
      'Before touching architecture, I clarify the decision, bottleneck or risk the system is supposed to improve.',
  },
  {
    title: 'I design for scale without overbuilding',
    description:
      'The best system is not the most complex one — it is the one that survives growth, failure and real users.',
  },
  {
    title: 'I make data systems observable',
    description:
      'Pipelines need contracts, checks, alerts and ownership so teams can trust them after launch.',
  },
  {
    title: 'I connect engineering with product impact',
    description:
      'My founder experience helps me translate infrastructure work into speed, reliability, revenue and user outcomes.',
  },
]

const capabilities = [
  {
    area: 'Data Engineering',
    color: 'cyan',
    items: ['Python · SQL · PySpark', 'ETL/ELT pipelines', 'Lakehouse architecture', 'dbt · Airflow · Spark'],
  },
  {
    area: 'Cloud Platforms',
    color: 'blue',
    items: ['GCP · BigQuery', 'AWS Lambda · DynamoDB · CDK', 'Azure Databricks · ADF', 'Serverless APIs'],
  },
  {
    area: 'ML Systems',
    color: 'violet',
    items: ['Feature engineering', 'Fraud/anomaly detection', 'Model validation', 'Decisioning workflows'],
  },
  {
    area: 'Product Architecture',
    color: 'amber',
    items: ['Roadmap thinking', 'Mobile backend systems', 'Event-driven architecture', 'Founder execution'],
  },
]

const LAB_FILTERS = ['All', 'ML', 'NLP', 'Deep Learning', 'Data']

const labs = [
  {
    title: 'Optum Health Analytics Capstone',
    context: 'Northeastern · MS Analytics',
    category: 'ML',
    desc: 'Analytics pipelines and ML classification models for healthcare pattern detection with population segmentation over large patient datasets (HIPAA-aware PHI handling).',
    tags: ['Python', 'PySpark', 'ML', 'Healthcare', 'Azure'],
    github: 'https://github.com/sheevec/optum-health-analytics',
  },
  {
    title: 'COVID-19 Fake News Detector',
    context: 'Applied NLP · Team Project',
    category: 'NLP',
    desc: 'NLP classifier detecting COVID-19 misinformation with 30+ linguistic features (readability, POS distributions, lexical richness, negation patterns) deployed via AWS SageMaker. ~91% accuracy without transformers.',
    tags: ['Python', 'NLP', 'SageMaker', 'scikit-learn', 'NLTK'],
    github: 'https://github.com/sheevec/covid-fake-news-detector',
  },
  {
    title: 'IMDb Sentiment: Classical ML vs Transformers',
    context: 'Applied NLP',
    category: 'NLP',
    desc: 'End-to-end NLP benchmark comparing TF-IDF + LogReg (89.3%), BiLSTM (91.7%), and fine-tuned BERT (94.8%) on 50k movie reviews. Includes error analysis and accuracy-by-length breakdown.',
    tags: ['Python', 'BERT', 'Transformers', 'PyTorch'],
    github: 'https://github.com/sheevec/imdb-sentiment-nlp',
  },
  {
    title: 'Macroeconomic Forecasting with VAR',
    context: 'Northeastern · Capstone',
    category: 'Data',
    desc: 'Vector Autoregression model forecasting US inflation, unemployment, and Federal Funds Rate over 55 years of quarterly data (1960–2015). Lag selection, restricted VAR, impulse response, 25-quarter forecasting at 95% CI.',
    tags: ['R', 'VAR', 'Time Series', 'Econometrics', 'FRED'],
    github: 'https://github.com/sheevec/macroeconomic-forecasting',
  },
  {
    title: 'Bank Marketing Campaign Prediction',
    context: 'Northeastern · Predictive Analytics',
    category: 'ML',
    desc: 'Multi-model classification on 45k bank telemarketing records predicting term deposit subscriptions. Logistic Regression vs Naive Bayes vs Decision Trees with an expected-value matrix to quantify financial impact per model.',
    tags: ['R', 'Classification', 'caret', 'Predictive Analytics'],
    github: 'https://github.com/sheevec/banking-campaign-prediction',
  },
  {
    title: 'Fashion-MNIST CNN Benchmarking',
    context: 'Academic Research',
    category: 'Deep Learning',
    desc: 'Benchmarked 5 CNN architectures on Fashion-MNIST — LeNet-5, SimpleCNN, ResNet-18, VGG-like, EfficientNet-B0. Best accuracy 94.2% (ResNet-18). Compared accuracy, parameters, and training time.',
    tags: ['PyTorch', 'CNN', 'Deep Learning', 'ResNet'],
    github: 'https://github.com/sheevec/fashion-mnist-benchmarking',
  },
  {
    title: 'Black Friday Purchase Prediction',
    context: 'Applied ML',
    category: 'ML',
    desc: 'Feature-engineered 550k retail transactions to predict purchase amounts. User-level aggregations and product interaction features. Best RMSE 2847 (LightGBM). Includes expected value and buyer intent segmentation.',
    tags: ['Python', 'XGBoost', 'LightGBM', 'Feature Engineering'],
    github: 'https://github.com/sheevec/black-friday-prediction',
  },
  {
    title: 'CrowdDoing — Non-Profit Analytics',
    context: 'Volunteer · 2021 – Present',
    category: 'Data',
    desc: 'Volunteer engagement analytics for crowddoing.world — cohort retention, skill supply vs demand matching, and impact scoring across 10k+ volunteers. Dashboards and hypothesis-testing frameworks for sparse non-profit data.',
    tags: ['Python', 'pandas', 'Plotly', 'Statistics', 'Non-profit'],
    github: 'https://github.com/sheevec/crowddoing-analytics',
  },
]

const writings = [
  {
    tag: 'ML Engineering',
    title: 'How I Cut Fraud False Positives by 35%',
    teaser:
      'A practical breakdown of fraud pipelines, threshold tuning and why precision-recall tradeoffs are business decisions.',
    status: 'Draft ready',
  },
  {
    tag: 'Data Engineering',
    title: 'What 10+ TB/Day Actually Looks Like in Production',
    teaser:
      'The ingestion patterns, data contracts and failure modes behind enterprise-scale data fabric work.',
    status: 'Outline ready',
  },
  {
    tag: 'Founder',
    title: 'Why Data Engineers Make Strong Product Builders',
    teaser:
      'How systems thinking, reliability instincts and feedback loops transfer from infrastructure to startup execution.',
    status: 'In progress',
  },
]

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

function DataFlowCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth < 900) return

    let animId
    let ro

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const nodes = []
    const NODE_COUNT = 26
    const MAX_DIST = 145

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resize()
    ro = new ResizeObserver(resize)
    ro.observe(canvas)

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.9,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy

        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)

          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * 0.12
            ctx.beginPath()
            ctx.strokeStyle = `rgba(34,211,238,${a})`
            ctx.lineWidth = 0.7
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(34,211,238,0.34)'
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      ro?.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="data-canvas" aria-hidden="true" />
}

// Magnetic hover — pulls the element a few px toward the cursor.
// Disabled on touch / coarse pointers.
function useMagnetic(strength = 0.35) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    }
    const onLeave = () => { el.style.transform = '' }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return ref
}

function ChapterDivider() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // Image scrolls a touch slower than the page → subtle parallax
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.08, 1.05])

  return (
    <motion.div
      ref={ref}
      className="chapter-divider"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9 }}
    >
      <motion.img
        src={dividerImg}
        alt=""
        aria-hidden="true"
        className="divider-img"
        loading="lazy"
        style={{ y, scale }}
      />
      <div className="divider-overlay">
        <span>"I build systems that make complexity usable."</span>
        <small>— Shivam</small>
      </div>
    </motion.div>
  )
}

function InViewSection({ id, className = '', children }) {
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
    >
      {children}
    </motion.section>
  )
}

const NAV_SECTIONS = ['hero', 'plurit', 'systems', 'impact', 'work', 'experience', 'labs', 'education', 'contact']
const NAV_SECTION_MAP = { plurit: 'plurit', systems: 'plurit', impact: 'work', work: 'work', experience: 'experience', labs: 'labs', education: 'education', contact: 'contact', hero: '' }

function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(NAV_SECTION_MAP[entry.target.id] ?? '')
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    for (const id of NAV_SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  // Close the menu on route hash change (i.e. user tapped a link)
  useEffect(() => {
    const onHash = () => setMenuOpen(false)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLink = (href, label, id) => (
    <a href={href} className={activeSection === id ? 'nav-active' : ''}>{label}</a>
  )

  return (
    <motion.nav
      className={`nav premium-nav ${scrolled ? 'nav-scrolled' : ''} ${menuOpen ? 'nav-menu-open' : ''}`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <a href="#hero" className="nav-brand premium-brand">
        <span className="brand-mark">SC</span>
        <span className="brand-text">
          <strong>Shivam</strong>
          <small>Chaudhary</small>
        </span>
      </a>

      <div className="nav-links">
        {navLink('#plurit', 'Plurit', 'plurit')}
        {navLink('#work', 'Work', 'work')}
        {navLink('#experience', 'Experience', 'experience')}
        {navLink('#labs', 'Labs', 'labs')}
        {navLink('#education', 'Education', 'education')}
      </div>

      <a href="#contact" className="nav-cta premium-nav-cta">
        Let's Talk ↗
      </a>

      <button
        type="button"
        className="nav-burger"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-mobile-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <a href="#plurit" onClick={() => setMenuOpen(false)}>Plurit</a>
            <a href="#systems" onClick={() => setMenuOpen(false)}>Systems</a>
            <a href="#work" onClick={() => setMenuOpen(false)}>Case Studies</a>
            <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
            <a href="#labs" onClick={() => setMenuOpen(false)}>Labs</a>
            <a href="#education" onClick={() => setMenuOpen(false)}>Education</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="nav-mobile-cta">Let's Talk ↗</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function CaseCard({ study }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.article
      className={`case-card case-${study.accent} ${open ? 'case-open' : ''}`}
      variants={staggerItem}
      onClick={() => setOpen(!open)}
    >
      <div className="case-topline">
        <span className="case-tag">{study.tag}</span>
        <span className="case-arrow">{open ? '−' : '+'}</span>
      </div>

      <h3>{study.title}</h3>
      <p className="case-summary">{study.summary}</p>

      {study.diagram && (
        <div className={`case-diagram diag-${study.accent}`} aria-hidden="true">
          <div className="diag-glow" />
          {study.diagram.map((node, i) => (
            <div key={node} className="diag-node-wrap">
              <span className="diag-node">{node}</span>
              {i < study.diagram.length - 1 && <span className="diag-line" />}
            </div>
          ))}
        </div>
      )}

      <div className="case-result">{study.result}</div>

      {!open && <span className="case-expand-hint">Tap to explore ↓</span>}

      <AnimatePresence>
        {open && (
          <motion.div
            className="case-detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32 }}
          >
            <div className="case-block">
              <span>The Problem</span>
              <p>{study.problem}</p>
            </div>

            <div className="case-block">
              <span>What I Built</span>
              <p>{study.built}</p>
            </div>

            <div className="stack-row">
              {study.stack.map((s) => <span key={s} className="stack-pill">{s}</span>)}
            </div>

            {study.github && (
              <a
                href={study.github}
                target="_blank"
                rel="noreferrer"
                className="case-github-link"
                onClick={(e) => e.stopPropagation()}
              >
                View on GitHub ↗
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function CountUp({ prefix = '', value, suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(decimals > 0 ? (0).toFixed(decimals) : '0')
  const rafId = useRef(null)

  useEffect(() => {
    if (!inView) return

    const duration = 1600
    let startTime = null

    const animate = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = eased * value

      setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString())

      if (progress < 1) rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [inView, value, decimals])

  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

function ContactForm() {
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          <span>Name</span>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
        </label>

        <label>
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
        </label>
      </div>

      <label>
        <span>Subject</span>
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Role / Advisory / Collaboration" required />
      </label>

      <label>
        <span>Message</span>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me what you want to build..." rows={5} required />
      </label>

      <button className="form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message ↗'}
      </button>

      {status === 'success' && <p className="form-success">Message sent — I'll get back to you soon.</p>}
      {status === 'error' && <p className="form-error">Something went wrong. Try emailing directly.</p>}
    </form>
  )
}

function useGitHubStats(username) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) setStats({ repos: data.public_repos, followers: data.followers })
      })
      .catch(() => {})
  }, [username])

  return stats
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          aria-label="Back to top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [labFilter, setLabFilter] = useState('All')
  const ghStats = useGitHubStats('sheevec')
  const primaryCtaRef = useMagnetic(0.18)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e) => {
      setTilt({
        x: (e.clientX / window.innerWidth - 0.5) * 12,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <ScrollProgress />
      <NavBar />

      <div className="grain" aria-hidden="true" />
      <div className="ambient" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>

      <main className="page">
        <section className="hero premium-hero" id="hero">
          <DataFlowCanvas />

          <div className="hero-grid">
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease }}
            >
              <span className="status-pill" role="status">
                <span className="status-dot" aria-hidden="true" />
                Currently shipping <strong>Plurit</strong> · Open to senior roles
              </span>

              <p className="eyebrow premium-eyebrow">Senior Data Engineer · Founder · Bengaluru</p>

              <h1 className="premium-hero-title">
                I built fraud decisioning that saved Citizens Bank $2.5M a year.
                <span className="hero-highlight"> Now I'm building Plurit.</span>
              </h1>

              <p className="hero-sub premium-hero-sub">
                Eight years across credit risk, fraud ML, and enterprise data fabric — Equifax,
                Citizens Bank, PepsiCo, Telefónica. Today I run product and platform at Plurit,
                shipping a cloud-native consumer app from zero.
              </p>

              <div className="hero-actions">
                <a href="#work" className="btn-primary btn-magnet" ref={primaryCtaRef}>
                  <span>View My Work ↗</span>
                </a>
                <a href={RESUME_LINK} download className="btn-ghost">Download Resume ↓</a>
              </div>

              <div className="premium-social-row">
                <a href="https://www.linkedin.com/in/shivamchaudhary69/" target="_blank" rel="noreferrer">in</a>
                <a href="https://github.com/sheevec" target="_blank" rel="noreferrer">GH</a>
                <a href="mailto:sheevechaudhary@gmail.com">✉</a>
                <a href={RESUME_LINK} download>CV</a>
              </div>
            </motion.div>

            <motion.div
              className="hero-visual premium-hero-visual"
              initial={{ opacity: 0, x: 34 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.82, delay: 0.12, ease }}
              style={{
                transform: `perspective(1200px) rotateX(${tilt.y * 0.08}deg) rotateY(${-tilt.x * 0.08}deg)`,
              }}
            >
              <div className="portrait-wrap premium-portrait-wrap">
                <img
                  src={portraitImg}
                  alt="Shivam Chaudhary"
                  className="portrait-img premium-portrait-img"
                  fetchPriority="high"
                  decoding="async"
                />

                <div className="portrait-shimmer" aria-hidden="true" />

                <div className="portrait-name-overlay">
                  <strong>Shivam Chaudhary</strong>
                  <span className="portrait-role">Senior Data Engineer</span>
                  <span className="portrait-tags">Data Platforms · Analytics · ML · Product</span>
                </div>
              </div>

              <div className="portrait-city-row">
                {['India', 'Argentina', 'USA', 'Bengaluru'].map((c) => (
                  <span key={c} className="city-pill">{c}</span>
                ))}
              </div>

              <div className="hero-metric-overlay">
                {heroMetrics.map((m) => (
                  <div key={m.label} className="hero-metric-item">
                    <strong>{m.value}</strong>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="hero-ticker-wrap" aria-hidden="true">
          <div className="hero-ticker-track">
            {Array(6).fill('Senior Data Engineer · Systems Thinker · Founder').map((t, i) => (
              <span key={i} className="hero-ticker-item">{t}</span>
            ))}
          </div>
        </div>

        <InViewSection className="logo-strip premium-logo-strip">
          <p className="logo-label">Experience that shapes me</p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...logos, ...logos].map((logo, i) => (
                <span key={`${logo.name}-${i}`} className="logo-pill logo-mark" aria-label={logo.name}>
                  <img src={logo.src} alt={logo.name} loading="lazy" />
                </span>
              ))}
            </div>
          </div>
        </InViewSection>

        <InViewSection className="glass-card intro-card" id="start">
          <span className="section-label">Start Here</span>
          <h2>From enterprise data fabric to founder execution.</h2>
          <div className="story-cols">
            <p>
              I began in enterprise telecom environments, where reliability, scale and delivery
              discipline mattered every day. Over time, I moved deeper into data engineering,
              cloud analytics and ML-backed decision workflows.
            </p>
            <p>
              Today, I combine senior data engineering experience with founder-level product execution —
              building infrastructure, user journeys and cloud-native systems that move from idea to shipped product.
            </p>
          </div>
        </InViewSection>

        <ChapterDivider />

        <InViewSection className="plurit-feature" id="plurit">
          <div className="section-head split-head">
            <div>
              <span className="section-label label-amber">Featured Builder Story</span>
              <h2>Plurit — the product I'm building from zero to scale</h2>
            </div>
            <a href="https://apps.apple.com/in/app/plur/id6748575019" target="_blank" rel="noreferrer" className="section-link">
              View App ↗
            </a>
          </div>

          <div className="plurit-grid">
            <div className="plurit-main">
              <span className="product-pill">Founder · Product · Platform</span>
              <h3>Event discovery + social connection layer for real-world experiences.</h3>
              <p>
                Plurit is built around the idea that discovery alone is not enough. Users need confidence,
                context and connection before they actually show up. I own product direction, infrastructure
                architecture and execution across event discovery, onboarding, matching and community flows.
              </p>

              <div className="plurit-actions">
                <a href="https://apps.apple.com/in/app/plur/id6748575019" target="_blank" rel="noreferrer" className="btn-primary">
                  iOS App ↗
                </a>
                <a href="https://play.google.com/store/apps/details?id=app.plurit.mobile&hl=en_IN" target="_blank" rel="noreferrer" className="btn-ghost">
                  Android App ↗
                </a>
              </div>
            </div>

            <div className="plurit-proof-grid">
              {[
                ['Backend', 'AWS Lambda, API Gateway, DynamoDB and CDK-based infrastructure.'],
                ['Product', 'Onboarding, event discovery, social matching and community engagement journeys.'],
                ['Architecture', 'Service-oriented backend with auth, user, chat, events and notification layers.'],
                ['Execution', 'Founder-led roadmap, feature prioritization, design collaboration and launch loops.'],
              ].map(([title, desc]) => (
                <div key={title} className="proof-card">
                  <span>{title}</span>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </InViewSection>

        <InViewSection className="section" id="systems">
          <div className="section-head split-head">
            <div>
              <span className="section-label label-violet">Systems I Can Design</span>
              <h2>Architecture depth beyond the resume</h2>
            </div>
            <a href="#contact" className="section-link">Discuss a system →</a>
          </div>

          <motion.div
            className="architecture-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            {architectureSystems.map((system) => (
              <motion.article key={system.title} className="architecture-card" variants={staggerItem}>
                <h3>{system.title}</h3>
                <p>{system.description}</p>

                <div className="flow-row">
                  {system.flow.map((node, index) => (
                    <span key={node}>
                      {node}
                      {index < system.flow.length - 1 && <b>→</b>}
                    </span>
                  ))}
                </div>

                <div className="stack-row">
                  {system.stack.map((s) => <span key={s} className="stack-pill">{s}</span>)}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </InViewSection>

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
            viewport={{ once: true, margin: '-80px' }}
          >
            {[
              { prefix: '', value: 8, suffix: '+ Years', decimals: 0, l: 'building data and analytics systems' },
              { prefix: '', value: 50, suffix: 'M+/day', decimals: 0, l: 'credit risk records ingested and seeded' },
              { prefix: '', value: 20, suffix: 'M+/day', decimals: 0, l: 'transactions in fraud/anomaly workflows' },
              { prefix: '', value: 10, suffix: '+ TB/day', decimals: 0, l: 'enterprise ingestion scale' },
              { prefix: '', value: 45, suffix: '% Faster', decimals: 0, l: 'feature generation latency reduction' },
              { prefix: '$', value: 2.5, suffix: 'M+/yr', decimals: 1, l: 'savings via fraud prioritization' },
              { prefix: '$', value: 1.2, suffix: 'M/mo', decimals: 1, l: 'operational savings at Amdocs' },
            ].map((m) => (
              <motion.article key={m.l} className="metric-card" variants={staggerItem}>
                <strong><CountUp prefix={m.prefix} value={m.value} suffix={m.suffix} decimals={m.decimals} /></strong>
                <p>{m.l}</p>
              </motion.article>
            ))}
          </motion.div>
        </InViewSection>

        <InViewSection className="section" id="work">
          <div className="section-head">
            <span className="section-label">Selected Case Studies</span>
            <h2>Proof of systems built</h2>
            <p className="section-sub">
              A mix of enterprise data platforms, fraud decisioning, credit-risk infrastructure and founder-led product work.
            </p>
          </div>

          <motion.div
            className="case-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            {caseStudies.map((study) => (
              <CaseCard key={study.id} study={study} />
            ))}
          </motion.div>
        </InViewSection>

        <InViewSection className="section" id="experience">
          <div className="section-head">
            <span className="section-label">Experience</span>
            <h2>Eight years of systems, platforms and outcomes</h2>
          </div>

          <div className="exp-list">
            {experience.map((role) => (
              <article key={role.company} className="exp-card">
                <div className="exp-header">
                  <div>
                    <div className="exp-company">{role.company}</div>
                    <div className="exp-role">{role.role}</div>
                  </div>

                  <div className="exp-right">
                    <span className="exp-period">{role.period}</span>
                    <span className="exp-location">{role.location}</span>
                    <span className="exp-chapter">{role.chapter}</span>
                  </div>
                </div>

                <ul className="exp-bullets">
                  {role.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>

                <div className="stack-row">
                  {role.stack.map((s) => <span key={s} className="stack-pill">{s}</span>)}
                </div>
              </article>
            ))}
          </div>
        </InViewSection>

        <InViewSection className="section how-section" id="how">
          <div className="section-head">
            <span className="section-label">How I Work</span>
            <h2>The operating principles behind the systems I ship</h2>
          </div>

          <div className="how-grid">
            {howIWork.map((item, index) => (
              <article key={item.title} className="how-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </InViewSection>

        <InViewSection className="section">
          <div className="section-head">
            <span className="section-label">Core Capabilities</span>
            <h2>What I know deeply</h2>
          </div>

          <div className="cap-grid">
            {capabilities.map((cap) => (
              <article key={cap.area} className={`cap-card cap-accent-${cap.color}`}>
                <div className="cap-header">
                  <span className="cap-area">{cap.area}</span>
                  <span className="cap-depth">Strong</span>
                </div>

                <ul className="cap-items">
                  {cap.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </InViewSection>

        <InViewSection className="section" id="labs">
          <div className="section-head">
            <span className="section-label label-blue">Labs & Experiments</span>
            <h2>Applied ML and research work</h2>
          </div>

          <div className="lab-filters" role="group" aria-label="Filter projects">
            {LAB_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`lab-filter-btn ${labFilter === f ? 'lab-filter-active' : ''}`}
                onClick={() => setLabFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="labs-grid">
            {labs.filter((lab) => labFilter === 'All' || lab.category === labFilter).map((lab) => (
              <article key={lab.title} className="lab-card">
                <span className="lab-context">{lab.context}</span>
                <h3>{lab.title}</h3>
                <p>{lab.desc}</p>

                <div className="stack-row">
                  {lab.tags.map((t) => <span key={t} className="stack-pill">{t}</span>)}
                </div>

                {lab.github && (
                  <a
                    href={lab.github}
                    target="_blank"
                    rel="noreferrer"
                    className="lab-github-link"
                  >
                    View on GitHub ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </InViewSection>

        <InViewSection className="glass-card edu-section" id="education">
          <span className="section-label label-green">Education</span>
          <h2>Credentials</h2>

          <div className="edu-list">
            <div className="edu-item">
              <div className="edu-accent" />
              <div className="edu-body">
                <span className="edu-degree">MS in Analytics (AI / ML)</span>
                <span className="edu-school">Northeastern University · Boston · 2019 – 2020</span>
                <span className="edu-note">Optum Health Analytics capstone · Applied ML coursework · Research projects</span>
              </div>
            </div>

            <div className="edu-item">
              <div className="edu-accent" />
              <div className="edu-body">
                <span className="edu-degree">B.Tech in Computer Engineering</span>
                <span className="edu-school">Rajasthan Technical University · India · 2011 – 2015</span>
                <span className="edu-note">Systems, algorithms, and software engineering foundations</span>
              </div>
            </div>
          </div>
        </InViewSection>

        {WRITING_LIVE && (
          <InViewSection className="section" id="writing">
            <div className="section-head split-head">
              <div>
                <span className="section-label label-cyan">Writing</span>
                <h2>Thinking out loud</h2>
                <p className="section-sub">
                  Essays on data engineering, ML systems, and the craft of building at scale.
                </p>
              </div>
              <a href="#contact" className="section-link">More →</a>
            </div>

            <div className="writing-grid">
              {writings.map((w) => (
                <article key={w.title} className="writing-card">
                  <div className="writing-top">
                    <span className="writing-tag">{w.tag}</span>
                    <span className="writing-time">{w.status}</span>
                  </div>
                  <h3>{w.title}</h3>
                  <p>{w.teaser}</p>
                </article>
              ))}
            </div>
          </InViewSection>
        )}

        <InViewSection className="contact-section" id="contact">
          <div className="contact-cta-copy">
            <span className="section-label">Contact</span>
            <h2>Hiring for Senior Data Engineering or AI Platform roles?</h2>
            <p>
              I can help build reliable data systems, ML pipelines and cloud-native product platforms.
            </p>
          </div>

          <div className="contact-layout">
            <ContactForm />

            <aside className="contact-right">
              <div className="contact-info-block">
                <span>Email</span>
                <a href="mailto:sheevechaudhary@gmail.com">sheevechaudhary@gmail.com</a>
              </div>

              <div className="contact-info-block">
                <span>Location</span>
                <strong>Bengaluru, India</strong>
              </div>

              <div className="contact-socials">
                <a href="mailto:sheevechaudhary@gmail.com" className="contact-chip contact-primary">Email Me ↗</a>
                <a href={RESUME_LINK} download className="contact-chip">Download Resume ↓</a>
                <a href="https://github.com/sheevec" target="_blank" rel="noreferrer" className="contact-chip contact-chip-gh">
                  View GitHub ↗
                  {ghStats && <span className="chip-stat">{ghStats.repos} repos</span>}
                </a>
                <a href="https://www.linkedin.com/in/shivamchaudhary69/" target="_blank" rel="noreferrer" className="contact-chip">LinkedIn ↗</a>
              </div>
            </aside>
          </div>
        </InViewSection>

        <footer className="footer">
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#plurit">Plurit</a>
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#labs">Labs</a>
            <a href="#education">Education</a>
            <a href="#contact">Contact</a>
          </nav>
          <p>Shivam Chaudhary · Senior Data Engineer · Founder Builder · Bengaluru, India</p>
          <span className="footer-year">© {new Date().getFullYear()}</span>
        </footer>
      </main>

      <ScrollToTop />
    </>
  )
}
