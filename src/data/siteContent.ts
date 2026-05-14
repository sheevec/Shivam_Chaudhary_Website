export interface LogoItem {
  name: string
  src: string
}

export interface HeroMetric {
  value: string
  label: string
}

export type CaseAccent = 'cyan' | 'violet' | 'blue' | 'amber'

export interface CaseStudy {
  id: string
  tag: string
  title: string
  summary: string
  result: string
  problem: string
  built: string
  stack: string[]
  accent: CaseAccent
  diagram: string[]
  github?: string
}

export interface ArchitectureSystem {
  title: string
  description: string
  flow: string[]
  stack: string[]
}

export interface ExperienceRole {
  company: string
  role: string
  period: string
  location: string
  chapter: string
  highlights: string[]
  stack: string[]
}

export interface HowIWorkItem {
  title: string
  description: string
}

export interface Capability {
  area: string
  color: 'cyan' | 'blue' | 'violet' | 'amber'
  items: string[]
}

export type LabCategory = 'ML' | 'NLP' | 'Deep Learning' | 'Data'

export interface LabProject {
  title: string
  context: string
  category: LabCategory
  desc: string
  tags: string[]
  github?: string
}

export interface WritingItem {
  tag: string
  title: string
  teaser: string
  status: string
}

export const logos: LogoItem[] = [
  { name: 'Plurit', src: '/logos/plurit.svg' },
  { name: 'LTIMindtree', src: '/logos/ltimindtree.svg' },
  { name: 'PepsiCo', src: '/logos/pepsico.svg' },
  { name: 'Rangam', src: '/logos/rangam.svg' },
  { name: 'Amdocs', src: '/logos/amdocs.svg' },
  { name: 'Northeastern', src: '/logos/northeastern.svg' },
  { name: 'Equifax', src: '/logos/equifax.svg' },
  { name: 'Citizens Bank', src: '/logos/citizens-bank.svg' },
  { name: 'Telefónica', src: '/logos/telefonica.svg' },
]

export const heroMetrics: HeroMetric[] = [
  { value: '8+', label: 'Years Experience' },
  { value: '50M+', label: 'Records / Day' },
  { value: '$2.5M+', label: 'Savings Delivered' },
  { value: '10TB+', label: 'Daily Data Scale' },
]

export const caseStudies: CaseStudy[] = [
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

export const architectureSystems: ArchitectureSystem[] = [
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

export const experience: ExperienceRole[] = [
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

export const howIWork: HowIWorkItem[] = [
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

export const capabilities: Capability[] = [
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

export const LAB_FILTERS = ['All', 'ML', 'NLP', 'Deep Learning', 'Data'] as const
export type LabFilter = (typeof LAB_FILTERS)[number]

export const labs: LabProject[] = [
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

export const writings: WritingItem[] = [
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
