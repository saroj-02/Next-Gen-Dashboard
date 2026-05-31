import type { Course } from "@/lib/types";
import DashboardClient from "./DashboardClient";
import { createClient } from "@/lib/supabase/server";

// Fallback high-fidelity dynamic catalog containing 50 distinct professional courses (10 per section)
const FALLBACK_COURSES: Course[] = [
  // ─── WEB DEVELOPMENT (10 Courses) ───
  {
    id: "1",
    title: "Advanced React Patterns",
    progress: 0,
    icon_name: "Code2",
    created_at: new Date().toISOString(),
    category: "Web Development",
    difficulty: "Expert",
    duration: "12 hours",
    instructor: "Dr. Sarah Jenkins, React Core Team Alum",
    description: "Master high-performance design patterns in React including component composition, render props, dynamic hooks, custom reconciliation algorithms, and global state management optimization.",
    chapters: [
      "1. Introduction to Advanced Component Scoping",
      "2. The Power of Component Composition",
      "3. Render Props & HOC Custom Patterns",
      "4. Advanced State Reducers with Custom Hooks",
      "5. React 19 Concurrent Features & Transitions",
      "6. Profiling rendering speeds & memory optimization"
    ]
  },
  {
    id: "3",
    title: "TypeScript Deep Dive",
    progress: 0,
    icon_name: "FileCode",
    created_at: new Date().toISOString(),
    category: "Web Development",
    difficulty: "Intermediate",
    duration: "10 hours",
    instructor: "Liam O'Connor, TypeScript Core Contributor",
    description: "Unlock the full power of TypeScript's static compiler. Master advanced generics, conditional and mapped types, custom decorators, and type manipulation strategies.",
    chapters: [
      "1. Type Assertion vs Type Narrowing techniques",
      "2. Advanced Generics & Constraint Parameters",
      "3. Conditional Types & template literal types",
      "4. Mapped Types & Utility API implementations",
      "5. Decorators in Modern Web Scapes",
      "6. Absolute TS Config & compiler profiling"
    ]
  },
  {
    id: "5",
    title: "Next.js 15 App Router",
    progress: 0,
    icon_name: "Layout",
    created_at: new Date().toISOString(),
    category: "Web Development",
    difficulty: "Expert",
    duration: "15 hours",
    instructor: "Sarah Jenkins, React Core Team Alum",
    description: "Build high-performance, fully optimized React frameworks. Master Next.js 15 Server Actions, PPR (Partial Prerendering), route handlers, dynamic layout scoping, and hybrid caching.",
    chapters: [
      "1. Next.js App Router structural topology",
      "2. Server Components vs Client Components execution",
      "3. Server Actions & Form Mutations deep dive",
      "4. Hybrid Rendering with PPR & Static Exports",
      "5. Route Handlers & Middleware Security API",
      "6. Advanced Caching & Tag-Based Revalidations"
    ]
  },
  {
    id: "15",
    title: "Modern JS Essentials",
    progress: 0,
    icon_name: "FileCode",
    created_at: new Date().toISOString(),
    category: "Web Development",
    difficulty: "Beginner",
    duration: "8 hours",
    instructor: "Liam O'Connor, TypeScript Core Contributor",
    description: "Master modern ECMAScript standard behaviors. Covers event loops, closure scopes, async-await patterns, prototype inheritance hierarchies, modern ES modules, and DOM performance tactics.",
    chapters: [
      "1. JavaScript Compiler & Event Loop mechanics",
      "2. Scope chains, Closure scopes & Context blocks",
      "3. Async JS (Promises, Async-Await, Event Emitters)",
      "4. Prototype inheritance vs ES6 Class syntax",
      "5. ES Modules & modern Bundlers configurations",
      "6. High-performance DOM modifications & events bubbling"
    ]
  },
  {
    id: "18",
    title: "Web Accessibility (a11y) Pro",
    progress: 0,
    icon_name: "Award",
    created_at: new Date().toISOString(),
    category: "Web Development",
    difficulty: "Intermediate",
    duration: "9 hours",
    instructor: "Sarah Jenkins, React Core Team Alum",
    description: "Develop layouts compliant with WCAG accessibility principles. Master semantic HTML landmarks, WAI-ARIA tags, focus trapping, screen reader testing, and custom custom overlay accessibility.",
    chapters: [
      "1. Web Accessibilities guidelines (WCAG 2.2) standards",
      "2. Semantic HTML markup & page landmarks structure",
      "3. Focus Management, Key navigation & outline locks",
      "4. Dynamic screen reader overlays (ARIA tags)",
      "5. Designing accessible Modals, Forms & Drawers",
      "6. Performing Accessibility Audits with devtools tools"
    ]
  },
  {
    id: "20",
    title: "Node.js Back-End Masterclass",
    progress: 0,
    icon_name: "Layout",
    created_at: new Date().toISOString(),
    category: "Web Development",
    difficulty: "Intermediate",
    duration: "13 hours",
    instructor: "Liam O'Connor, TypeScript Core Contributor",
    description: "Build robust distributed backend REST systems. Learn event-driven Node architecture, express routes handling, custom middleware configurations, file streams, and security configurations.",
    chapters: [
      "1. Event-Driven non-blocking Node architecture",
      "2. Building RESTful routes using Express API",
      "3. Express Middleware scopes (Cors, Helmet, BodyParser)",
      "4. File Streams & asynchronous systems",
      "5. Connecting Databases (MongoDB & PostgreSQL engines)",
      "6. Back-end security principles & input validators"
    ]
  },
  {
    id: "23",
    title: "API Design & GraphQL",
    progress: 0,
    icon_name: "Activity",
    created_at: new Date().toISOString(),
    category: "Web Development",
    difficulty: "Intermediate",
    duration: "12 hours",
    instructor: "Sarah Jenkins, React Core Team Alum",
    description: "Design efficient data endpoints. Learn REST best practices, GraphQL schema queries and mutations, query pagination, connection rate limitings, and data validators.",
    chapters: [
      "1. REST API endpoint structure best practices",
      "2. Introduction to GraphQL schemas, Resolvers & Queries",
      "3. Building dynamic GraphQL Mutations & Subscriptions",
      "4. API Pagination strategies & sorting cursors",
      "5. Implementing API Rate Limiting & caching proxies",
      "6. Automated API Documentation tools (Swagger)"
    ]
  },
  {
    id: "27",
    title: "CSS Grid & Flexbox Mastery",
    progress: 0,
    icon_name: "Code",
    created_at: new Date().toISOString(),
    category: "Web Development",
    difficulty: "Beginner",
    duration: "6 hours",
    instructor: "Sarah Jenkins, React Core Team Alum",
    description: "Conquer responsive layouts without heavy styling frameworks. Master Flexbox alignment axis, CSS Grid fraction units, implicit grids, template areas, container queries, and aspect ratios.",
    chapters: [
      "1. Flexbox container models & cross axis sizing",
      "2. CSS Grid layout systems & fr unit scoping",
      "3. Auto-fit vs Auto-fill responsive wrapping",
      "4. Implicit grids vs Explicit grid templates",
      "5. Modern Container Queries & responsive elements",
      "6. Crafting complex, fully customized pixel UI layouts"
    ]
  },
  {
    id: "28",
    title: "Vue.js 3 Production Scale",
    progress: 0,
    icon_name: "Layers",
    created_at: new Date().toISOString(),
    category: "Web Development",
    difficulty: "Intermediate",
    duration: "11 hours",
    instructor: "Liam O'Connor, TypeScript Core Contributor",
    description: "Build robust frontend systems using Vue 3. Master Composition API, script setup syntax, Pinia state stores, Vue Router view transitions, custom directives, and compiler optimizations.",
    chapters: [
      "1. Vue 3 reactivity engine & ref/reactive scoping",
      "2. Structuring reusable script setup composition hooks",
      "3. High-performance state management using Pinia",
      "4. Route guards & dynamic route bindings",
      "5. Custom directives & DOM element intersections",
      "6. Optimizing virtual DOM rendering speeds"
    ]
  },
  {
    id: "29",
    title: "Chrome Extensions V3",
    progress: 0,
    icon_name: "ExternalLink",
    created_at: new Date().toISOString(),
    category: "Web Development",
    difficulty: "Intermediate",
    duration: "10 hours",
    instructor: "Dr. Sarah Jenkins, Extension Architect",
    description: "Build premium browser add-ons under Manifest V3 specifications. Learn popup views, content scripts DOM injections, service worker tasks, Declarative Net Request intercepts, and Web Store compliance.",
    chapters: [
      "1. Manifest V3 structural JSON parameters",
      "2. Popups, Action views & responsive extension options",
      "3. Content Scripts & DOM data integrations",
      "4. Background Service Workers lifecycle events",
      "5. Declarative Net Request API for network blocking",
      "6. Extension publishing pipelines & review checklist"
    ]
  },

  // ─── SOFTWARE DEVELOPMENT (10 Courses) ───
  {
    id: "2",
    title: "System Design Mastery",
    progress: 0,
    icon_name: "Server",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Expert",
    duration: "18 hours",
    instructor: "Alex Mercer, Principal Architect at AWS",
    description: "Learn to design highly scalable, fault-tolerant distributed web architectures. Covers multi-region load balancing, database sharding, caching topologies, message brokers, and CDN optimization.",
    chapters: [
      "1. Horizontal Scaling vs Vertical Scoping",
      "2. Load Balancing Techniques (Round Robin & IP Hash)",
      "3. Database Partitioning & Sharding Tactics",
      "4. Caching Topologies (Redis Cluster & Memcached)",
      "5. Event-Driven Systems with Kafka & RabbitMQ",
      "6. Multi-Region Failover & CDN Edge Topologies"
    ]
  },
  {
    id: "6",
    title: "Microservices Architecture",
    progress: 0,
    icon_name: "Workflow",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Expert",
    duration: "20 hours",
    instructor: "Alex Mercer, Principal Architect at AWS",
    description: "Transition monoliths to agile microservices. Design independent modules, manage database-per-service topologies, coordinate distributed transactions, and implement event sourcing.",
    chapters: [
      "1. Monolith to Microservice decomposition patterns",
      "2. Inter-service Communications (gRPC vs REST vs MQ)",
      "3. Managing Database-Per-Service constraints",
      "4. Implementing Saga Pattern & 2-Phase Commits",
      "5. Dockerizing Services & Kubernetes orchestrations",
      "6. API Gateway configurations (Routing & Rate Limiting)"
    ]
  },
  {
    id: "11",
    title: "Software Requirements scoping",
    progress: 0,
    icon_name: "Feather",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Beginner",
    duration: "9 hours",
    instructor: "Liam O'Connor, Principal DBA",
    description: "Bridge code and business. Master professional software requirements engineering. Learn requirements gathering techniques, user story mapping, flow diagrams, and functional specifications scoping.",
    chapters: [
      "1. Scoping Requirements Gathering & stakeholder alignment",
      "2. Agile Scoping & User Story Mapping mechanics",
      "3. Functional vs Non-Functional Scoping parameters",
      "4. Drafting clean User Flows & State Diagrams",
      "5. Managing scopes creeping & estimation baselines",
      "6. Scoping Product Requirements Documents (PRD)"
    ]
  },
  {
    id: "12",
    title: "Pragmatic DevOps & CI/CD",
    progress: 0,
    icon_name: "Terminal",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Intermediate",
    duration: "13 hours",
    instructor: "Alex Mercer, Principal Architect at AWS",
    description: "Automate code verification and delivery. Master Docker container builds, multi-stage pipelines, GitHub Actions workflows, secure SSH cloud deploys, and service monitoring monitors.",
    chapters: [
      "1. Core Principles of Continuous Delivery (CI/CD)",
      "2. Writing clean multi-stage Docker builds",
      "3. Writing YAML workflows in GitHub Actions",
      "4. Automated testing triggers & security linters",
      "5. Zero-Downtime deployments via SSH scripts",
      "6. Real-time application monitoring & alert logs"
    ]
  },
  {
    id: "13",
    title: "Cloud Native AWS Solutions",
    progress: 0,
    icon_name: "Cloud",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Intermediate",
    duration: "16 hours",
    instructor: "Alex Mercer, Principal Architect at AWS",
    description: "Architect secure cloud systems. Master AWS EC2 compute, S3 static assets storage, serverless AWS Lambda triggers, secure RDS databases, VPC network routing, and IAM credentials permissions.",
    chapters: [
      "1. Cloud topologies & AWS infrastructure layers",
      "2. Compute configurations (EC2 & Elastic Beanstalk)",
      "3. Object Storage (S3) & CloudFront content delivery",
      "4. Serverless triggers using AWS Lambda & API Gateway",
      "5. VPC networking (Subnets, Gateways, Security Groups)",
      "6. IAM users & credentials permissions best practices"
    ]
  },
  {
    id: "14",
    title: "Data Structures & Algorithms",
    progress: 0,
    icon_name: "Cpu",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Intermediate",
    duration: "18 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Build fast, optimal code blocks. Master data structures: trees, graphs, sorting search strategies, time-complexity analysis (Big O), recursion, and dynamic programming.",
    chapters: [
      "1. Analyzing complexity using Big O notation",
      "2. Linear structures (Arrays, Linked Lists, Stacks, Queues)",
      "3. Tree structures (BST, AVL Trees, Binary Heaps)",
      "4. Graph topologies & search algorithms (BFS, DFS)",
      "5. Sorting algorithms (QuickSort, MergeSort, Radix)",
      "6. Dynamic Programming & Memoization techniques"
    ]
  },
  {
    id: "17",
    title: "Product Management Foundations",
    progress: 0,
    icon_name: "Compass",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Beginner",
    duration: "10 hours",
    instructor: "Emma Watson, Lead Product Designer",
    description: "Launch successful digital platforms. Master product discovery loops, competitive benchmarks audit, agile sprints roadmap scoping, OKR goal target sets, and user test analytics reports.",
    chapters: [
      "1. The Product Lifecycle & Product Manager roles",
      "2. User Research, Personas & feedback loops",
      "3. Strategic Scoping: Competitors Audits & OKRs",
      "4. Scoping Agile Sprints & prioritisation models (RICE)",
      "5. Product Analytics, A/B Testing & success KPIs",
      "6. Product Launch playbooks & marketing loops"
    ]
  },
  {
    id: "21",
    title: "Docker & Container Security",
    progress: 0,
    icon_name: "Lock",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Intermediate",
    duration: "11 hours",
    instructor: "Alex Mercer, Principal Architect at AWS",
    description: "Create and secure lightweight app containers. Covers dockerfiles, multi-stage builds caching, container system hardening, networks isolation, secret injections, and secure registries.",
    chapters: [
      "1. Introduction to Containerisation & Docker engines",
      "2. Scoping secure lightweight multi-stage Dockerfiles",
      "3. Managing volumes & Container local networks",
      "4. Container hardening: Non-root user execution configs",
      "5. Secure Docker Secret injections & environment variables",
      "6. Scanning container images for core vulnerabilities"
    ]
  },
  {
    id: "22",
    title: "Cybersecurity & Cryptography",
    progress: 0,
    icon_name: "Shield",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Expert",
    duration: "15 hours",
    instructor: "Alex Mercer, Principal Architect at AWS",
    description: "Guard web systems against exploits. Master JWT session auth, modern hashing, data encryption standards (AES), OWASP top 10 prevention, and input sanitization scopes.",
    chapters: [
      "1. Core security concepts: Authentication vs Authorisation",
      "2. Modern Hashing (Bcrypt) & Encryptions (AES)",
      "3. Building secure session APIs with JSON Web Tokens (JWT)",
      "4. Preventing OWASP Top 10 vulnerabilities (XSS, SQLi)",
      "5. Security Headers, CORS scoping & HTTPS SSL setup",
      "6. Ethical Hacking: Penetration Testing base guidelines"
    ]
  },
  {
    id: "26",
    title: "Agile Scrum Mastery",
    progress: 0,
    icon_name: "Users",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Beginner",
    duration: "9 hours",
    instructor: "Sarah Jenkins, React Core Team Alum",
    description: "Facilitate high-productivity software sprints. Master scrum team structures, sprint scoping sessions, retrospectives routine, sprint velocity burndowns, and agile product ownership.",
    chapters: [
      "1. Agile values & Scrum frameworks structural roles",
      "2. Structuring efficient Sprint Scoping sessions",
      "3. Running dynamic Daily Standups & Retrospectives",
      "4. Tracking metrics using Velocity & Burndown Charts",
      "5. The Role of Agile Product Owners & backlog grooming",
      "6. Managing epic structures & scoping release milestones"
    ]
  },

  // ─── DATA ANALYSIS (10 Courses) ───
  {
    id: "7",
    title: "High-Performance SQL & DBs",
    progress: 0,
    icon_name: "Database",
    created_at: new Date().toISOString(),
    category: "Data Analysis",
    difficulty: "Intermediate",
    duration: "12 hours",
    instructor: "Liam O'Connor, Principal DBA",
    description: "Write faster queries and scale databases. Covers advanced index B-Trees, transaction isolation levels (ACID), locking mechanisms, query execution plans, and read/write scaling replicas.",
    chapters: [
      "1. Relational engines & ACID transaction scopes",
      "2. Designing efficient Indexes (B-Tree, Hash, GIN)",
      "3. Analysing Query Execution Plans (EXPLAIN ANALYZE)",
      "4. Transaction Isolation Levels & locking conflicts",
      "5. Read Replicas & scaling connection pools",
      "6. Database migrations & schemas auditing without downtime"
    ]
  },
  {
    id: "10",
    title: "BI with Tableau",
    progress: 0,
    icon_name: "TrendingUp",
    created_at: new Date().toISOString(),
    category: "Data Analysis",
    difficulty: "Intermediate",
    duration: "11 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Build premium visual analysis charts. Master Tableau workbook datasets, dashboard storytelling, custom parameters, Level of Detail (LOD) expressions, and real-time operational executive layouts.",
    chapters: [
      "1. Connecting & formatting raw Tableau datasets",
      "2. Building advanced visualisations (Geomaps, Heatmaps)",
      "3. Custom Calculations & Parameters parameters",
      "4. Level of Detail (LOD) Expressions deep dive",
      "5. Designing premium, accessible Executive Dashboards",
      "6. Storytelling dashboards & sharing workbook insights"
    ]
  },
  {
    id: "16",
    title: "Data Science with Python",
    progress: 0,
    icon_name: "TrendingUp",
    created_at: new Date().toISOString(),
    category: "Data Analysis",
    difficulty: "Intermediate",
    duration: "14 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Data analysis workflows using Python. Master clean Pandas dataframes, NumPy mathematical operations, Matplotlib data plots, and exploratory data analysis (EDA).",
    chapters: [
      "1. Dynamic Python scripting & data containers",
      "2. Vector operations using NumPy libraries",
      "3. Parsing & filtering datasets with Pandas",
      "4. Explanatory Data Analysis & cleaning outliers",
      "5. Data Visualisations using Matplotlib & Seaborn",
      "6. Descriptive statistics & hypothesis testing"
    ]
  },
  {
    id: "25",
    title: "Big Data & Apache Spark",
    progress: 0,
    icon_name: "Cpu",
    created_at: new Date().toISOString(),
    category: "Data Analysis",
    difficulty: "Expert",
    duration: "16 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Process massive datasets quickly. Master Spark SQL, MapReduce processing logic, cluster distribution setups, and real-time streaming analysis.",
    chapters: [
      "1. Big Data pipelines & MapReduce processing structures",
      "2. Apache Spark distributed architecture & cluster nodes",
      "3. Fast querying using Spark SQL & Resilient Datasets (RDD)",
      "4. Performing Data Wrangling transformations on large logs",
      "5. Real-Time streaming parsing using Spark Streaming APIs",
      "6. Integrating Big Data with Hadoop S3 lake infrastructure"
    ]
  },
  {
    id: "32",
    title: "Excel for Data Analytics",
    progress: 0,
    icon_name: "Table",
    created_at: new Date().toISOString(),
    category: "Data Analysis",
    difficulty: "Beginner",
    duration: "8 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Unlock the raw power of spreadsheets. Learn nested dynamic functions, XLOOKUP mechanics, advanced Pivot Tables, PowerQuery connections, and operational dashboard building.",
    chapters: [
      "1. Core referencing & logical lookup triggers",
      "2. Cleaning datasets with Excel text and date algorithms",
      "3. Organizing summaries with dynamic Pivot Tables",
      "4. Intro to ETL data queries inside PowerQuery",
      "5. Design principles for Excel KPIs & chart sheets",
      "6. Writing dynamic macros & VBA functions"
    ]
  },
  {
    id: "33",
    title: "Data Warehousing & ETL",
    progress: 0,
    icon_name: "FolderGit",
    created_at: new Date().toISOString(),
    category: "Data Analysis",
    difficulty: "Expert",
    duration: "15 hours",
    instructor: "Liam O'Connor, Principal DBA",
    description: "Design efficient modern enterprise data warehouses. Learn Kimball dimensional models (Star & Snowflake schemas), slow-changing dimensions (SCD), ETL orchestrations, and dbt models.",
    chapters: [
      "1. Data warehouse topologies & core OLAP vs OLTP",
      "2. Kimball dimensional models: Stars & Snowflakes schemas",
      "3. Slow-Changing Dimensions (SCD Type 1, 2, & 3)",
      "4. Coding ETL workflows using Python pipelines",
      "5. SQL modeling & transforms using dbt (data build tool)",
      "6. Scheduling analytics jobs via Apache Airflow DAGs"
    ]
  },
  {
    id: "34",
    title: "Pandas & NumPy Deep Dive",
    progress: 0,
    icon_name: "Code",
    created_at: new Date().toISOString(),
    category: "Data Analysis",
    difficulty: "Intermediate",
    duration: "10 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Write vectorised, ultra-fast Python analysis scripts. Master advanced multi-indexing, pandas merge/join options, data aggregations, vectorised numpy operations, and CSV/JSON memory optimization.",
    chapters: [
      "1. Memory layout differences: Pandas Series vs NumPy Arrays",
      "2. Multi-Indexing & complex pivot tabular transformations",
      "3. Advanced merge topologies & database joints mapping",
      "4. Dynamic GroupBy aggregations & lambda transforms",
      "5. Vectorised numeric operations for matrix mathematics",
      "6. Minimizing RAM footprint for large CSV structures"
    ]
  },
  {
    id: "35",
    title: "PowerBI Advanced Dashboards",
    progress: 0,
    icon_name: "TrendingUp",
    created_at: new Date().toISOString(),
    category: "Data Analysis",
    difficulty: "Intermediate",
    duration: "11 hours",
    instructor: "Liam O'Connor, Principal DBA",
    description: "Build state-of-the-art interactive reporting suites. Master DAX formula querying, relationships mapping, row-level security parameters, bookmarks, and automated refresh gateways.",
    chapters: [
      "1. PowerBI Desktop structure & data modeling imports",
      "2. Writing complex DAX formulas (CALCULATE, FILTER, dynamic scopes)",
      "3. Structuring robust one-to-many relationship maps",
      "4. Dynamic visual parameters, Bookmarks & page navigators",
      "5. Setting up secure Row-Level Security (RLS)",
      "6. Configuring cloud gateways & scheduled data refreshes"
    ]
  },
  {
    id: "36",
    title: "Statistics for Data Analysts",
    progress: 0,
    icon_name: "Percent",
    created_at: new Date().toISOString(),
    category: "Data Analysis",
    difficulty: "Beginner",
    duration: "9 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Develop quantitative decision-making frameworks. Master descriptive stats, probability distributions, central limit theorem, hypothesis testing (T-Test, ANOVA), and linear correlation regressions.",
    chapters: [
      "1. Central tendencies, standard deviation & variances",
      "2. Probability distributions (Normal, Binomial, Poisson)",
      "3. Sampling theory & the Central Limit Theorem",
      "4. Formulating hypothesis: Null vs Alternative frameworks",
      "5. Executing T-Tests, Chi-Square, & ANOVA formulas",
      "6. Simple & Multiple Linear Correlation regressions"
    ]
  },
  {
    id: "30",
    title: "Design Patterns & Refactoring",
    progress: 0,
    icon_name: "Cpu",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Expert",
    duration: "14 hours",
    instructor: "Alex Mercer, Principal AWS Architect",
    description: "Write clean, maintainable software. Master GoF patterns (Creational, Structural, Behavioral), SOLID principles, and code refactoring strategies.",
    chapters: [
      "1. SOLID Principles in modern software environments",
      "2. Creational Patterns (Factory, Singleton, Builder)",
      "3. Structural Patterns (Adapter, Decorator, Facade)",
      "4. Behavioral Patterns (Observer, Strategy, State)",
      "5. Smelling code bad blocks & refactoring recipes",
      "6. Writing testable and maintainable clean modules"
    ]
  },

  // ─── AI & GEN AI (10 Courses) ───
  {
    id: "19",
    title: "Prompt Engineering & GenAI",
    progress: 0,
    icon_name: "Sparkles",
    created_at: new Date().toISOString(),
    category: "AI & Gen AI",
    difficulty: "Beginner",
    duration: "8 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Unlock the capabilities of Large Language Models (LLMs). Learn few-shot prompting, chain-of-thought, system prompts, prompt chaining, API integrations, and preventing prompt injections.",
    chapters: [
      "1. Core Mechanics of Large Language Models",
      "2. Zero-shot vs Few-shot Prompting techniques",
      "3. Chain-of-Thought & Reasoning frameworks",
      "4. Multi-agent workflows & dynamic prompt chaining",
      "5. OpenAI, Gemini, and Claude API integrations",
      "6. Securing prompts against jailbreaks & injections"
    ]
  },
  {
    id: "24",
    title: "LLM Fine-Tuning & RAG",
    progress: 0,
    icon_name: "Brain",
    created_at: new Date().toISOString(),
    category: "AI & Gen AI",
    difficulty: "Expert",
    duration: "16 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Learn to build domain-specific AI systems. Covers Parameter-Efficient Fine-Tuning (LoRA, QLoRA), Retrieval-Augmented Generation (RAG), vector databases, chunking strategies, and AI evaluation metrics.",
    chapters: [
      "1. Fine-tuning vs Retrieval-Augmented Generation",
      "2. PEFT methods (LoRA, QLoRA) deep dive",
      "3. Parsing documents & custom text chunking strategies",
      "4. Vector Embeddings & databases (Pinecone, pgvector)",
      "5. Implementing Hybrid Search & Reranking algorithms",
      "6. Evaluating RAG systems using Ragas frameworks"
    ]
  },
  {
    id: "37",
    title: "Deep Learning & Neural Networks",
    progress: 0,
    icon_name: "Brain",
    created_at: new Date().toISOString(),
    category: "AI & Gen AI",
    difficulty: "Expert",
    duration: "18 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Master neural networks from scratch. Learn forward/backpropagation, loss functions, optimizer math (Adam, SGD), CNNs for vision, RNN/LSTMs for sequences, and PyTorch model builds.",
    chapters: [
      "1. Feedforward architectures & neuron activation mechanics",
      "2. Mathematical backpropagation & gradient descent optimizations",
      "3. Advanced Optimization algorithms: SGD, RMSProp, Adam",
      "4. Convolutional Neural Networks (CNNs) for vision",
      "5. Recurrent Neural Networks (RNNs) & LSTM mechanics",
      "6. Coding custom layers & neural maps in PyTorch"
    ]
  },
  {
    id: "38",
    title: "Natural Language Processing (NLP)",
    progress: 0,
    icon_name: "MessageSquare",
    created_at: new Date().toISOString(),
    category: "AI & Gen AI",
    difficulty: "Intermediate",
    duration: "12 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Analyze, generate, and classify human text. Covers legacy bag-of-words tokenizing, Tf-Idf vectors, Word2Vec embeddings, sequence-to-sequence networks, Attention formulas, and Transformer layers.",
    chapters: [
      "1. Text pre-processing: Stemming, Lemmatisation & Tokenisation",
      "2. Vector Space Models: Tf-Idf vs Word2Vec embeddings",
      "3. Sequence modeling using Encoder-Decoder networks",
      "4. Self-Attention mechanics & scaling dot products",
      "5. Transformer architectures: Multi-Head Attention blocks",
      "6. Fine-tuning HuggingFace Transformer models"
    ]
  },
  {
    id: "39",
    title: "Computer Vision & CNNs",
    progress: 0,
    icon_name: "Eye",
    created_at: new Date().toISOString(),
    category: "AI & Gen AI",
    difficulty: "Intermediate",
    duration: "14 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Program machines to interpret digital visual media. Covers OpenCV image manipulations, edge detections, CNN pooling layers, object detection models (YOLO, SSD), and semantic image segmentation.",
    chapters: [
      "1. Digital Image representation & pixel calculations",
      "2. Convolutional filters, kernels, & edge detections",
      "3. CNN layers: Pooling, stride, & fully-connected blocks",
      "4. Transfer Learning using ResNet & VGG models",
      "5. Real-Time Object Detection models (YOLO frameworks)",
      "6. Semantic Image Segmentation using U-Net networks"
    ]
  },
  {
    id: "40",
    title: "AI Agent Workflows & LangChain",
    progress: 0,
    icon_name: "Activity",
    created_at: new Date().toISOString(),
    category: "AI & Gen AI",
    difficulty: "Expert",
    duration: "15 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Design autonomous AI agents that invoke tools. Learn LangChain architecture, custom tool bindings, ReAct loops, vector search routers, persistent chat histories, and LangGraph multi-agent systems.",
    chapters: [
      "1. Core concept: LLMs as reasoning engines vs static text writers",
      "2. LangChain Expression Language (LCEL) chain mappings",
      "3. Binding API tools & executing function calls",
      "4. The ReAct (Reason + Act) loop execution path",
      "5. Designing multi-agent state machines in LangGraph",
      "6. Deploying production agent servers using LangServe"
    ]
  },
  {
    id: "41",
    title: "Vector Search & Databases",
    progress: 0,
    icon_name: "Database",
    created_at: new Date().toISOString(),
    category: "AI & Gen AI",
    difficulty: "Intermediate",
    duration: "10 hours",
    instructor: "Liam O'Connor, Principal DBA",
    description: "Manage semantic database indexes. Master vector embeddings generation, distance metrics (Cosine, Euclidean), HNSW indexing graphs, metadata filters, and server pipelines (Pinecone, Chroma).",
    chapters: [
      "1. Vector Space mathematics & high-dimensional grids",
      "2. Distance Metrics: Cosine Similarity vs L2 Euclidean",
      "3. Approximate Nearest Neighbor (ANN) search algorithms",
      "4. HNSW Indexing graph mechanics & IVF structures",
      "5. Metadata indexing & hard filtering constraints",
      "6. Scaled cluster pipelines using Pinecone database"
    ]
  },
  {
    id: "42",
    title: "Reinforcement Learning",
    progress: 0,
    icon_name: "TrendingUp",
    created_at: new Date().toISOString(),
    category: "AI & Gen AI",
    difficulty: "Expert",
    duration: "16 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "Train agents via reward/punishment loops. Learn Markov Decision Processes (MDP), Q-Learning, Deep Q-Networks (DQN), policy gradients (PPO), actor-critic models, and custom Gym/Gymnasium simulators.",
    chapters: [
      "1. Markov Decision Processes (MDP): States, Actions, Rewards",
      "2. Q-Learning & Bellman Equation updates",
      "3. Deep Q-Networks (DQN) & experience replay arrays",
      "4. Policy Gradients: Proximal Policy Optimisation (PPO)",
      "5. Actor-Critic models (A2C/A3C) networks mapping",
      "6. Training custom agent simulation loops inside Gymnasium"
    ]
  },
  {
    id: "43",
    title: "Responsible AI & Ethics",
    progress: 0,
    icon_name: "ShieldAlert",
    created_at: new Date().toISOString(),
    category: "AI & Gen AI",
    difficulty: "Beginner",
    duration: "8 hours",
    instructor: "Dr. Sofia Chen, AI Ethics Board",
    description: "Mitigate model bias and secure deployments. Covers statistical definitions of fairness, adversarial prompt attacks, toxicity safeguards, model watermarking, copyright constraints, and EU AI Act.",
    chapters: [
      "1. Algorithmic bias & statistical metrics of fairness",
      "2. Red Teaming: adversarial prompt attacks & injections",
      "3. Safety guardrails: LLM toxicity and safety classifiers",
      "4. Generative watermarking, copyrights & licensing ethics",
      "5. Implementing EU AI Act compliance metrics",
      "6. Best practices for model audits & safety reporting"
    ]
  },
  {
    id: "4",
    title: "Generative AI Foundations",
    progress: 0,
    icon_name: "Sparkles",
    created_at: new Date().toISOString(),
    category: "AI & Gen AI",
    difficulty: "Beginner",
    duration: "10 hours",
    instructor: "Dr. Sofia Chen, AI Research Scientist",
    description: "A comprehensive introduction to modern generative models. Covers VAEs, GANs, Diffusion Models, and how Transformer topologies enable conversational engines.",
    chapters: [
      "1. Intro to Generative vs Discriminative modeling",
      "2. Variational Autoencoders (VAEs) architectures",
      "3. Generative Adversarial Networks (GANs) generators",
      "4. Diffusion Models & noise schedules mechanics",
      "5. Autoregressive language decoders",
      "6. Evaluating generative quality via FID metrics"
    ]
  },

  // ─── ANDROID DEVELOPMENT (10 Courses) ───
  {
    id: "8",
    title: "Android Jetpack Compose Pro",
    progress: 0,
    icon_name: "Smartphone",
    created_at: new Date().toISOString(),
    category: "Android Development",
    difficulty: "Intermediate",
    duration: "12 hours",
    instructor: "Marcus Aurelius, Lead Android Architect",
    description: "Build native Android UIs using declarative Jetpack Compose. Learn state management, custom layouts, gestures, graphic drawings, theme customizing, and advanced animations.",
    chapters: [
      "1. Declarative UI Paradigms vs Legacy XML",
      "2. Managing State in Compose (remember & rememberSaveable)",
      "3. Custom Layouts & Measure Policies",
      "4. Gestures, Pointer Input & Canvas Drawings",
      "5. Advanced Compose Animations & Transitions",
      "6. Integrating Compose with Legacy XML Views"
    ]
  },
  {
    id: "9",
    title: "Kotlin Multiplatform (KMM)",
    progress: 0,
    icon_name: "Layers",
    created_at: new Date().toISOString(),
    category: "Android Development",
    difficulty: "Intermediate",
    duration: "15 hours",
    instructor: "Marcus Aurelius, Lead Android Architect",
    description: "Share business logic between Android and iOS. Learn project setup, writing common code libraries, handling platform-specific APIs with expect/actual, local storage syncing, and network calls.",
    chapters: [
      "1. KMM Architecture & Project Layout",
      "2. Sharing business logics & data modeling",
      "3. Networking with Ktor in Common modules",
      "4. Database setups using SQLDelight",
      "5. Platform-specific codes using Expect/Actual",
      "6. SwiftUI & Compose UI connections"
    ]
  },
  {
    id: "44",
    title: "Android Performance Tuning",
    progress: 0,
    icon_name: "Zap",
    created_at: new Date().toISOString(),
    category: "Android Development",
    difficulty: "Expert",
    duration: "10 hours",
    instructor: "Marcus Aurelius, Lead Android Architect",
    description: "Master performance tuning for Android applications. Learn layout hierarchy profiling, memory leak detection, garbage collection cycles optimization, background threading, and APK size shrinking.",
    chapters: [
      "1. Profiling layouts with Android Studio Layout Inspector",
      "2. Detecting Memory Leaks with LeakCanary",
      "3. Optimizing Garbage Collection & Allocations",
      "4. Multi-threading with Kotlin Coroutines & Flows",
      "5. Shunning layout overdraws & rendering latency",
      "6. Shaving APK bundle sizes via R8 & ProGuard"
    ]
  },
  {
    id: "45",
    title: "Kotlin Coroutines & Flow",
    progress: 0,
    icon_name: "Zap",
    created_at: new Date().toISOString(),
    category: "Android Development",
    difficulty: "Expert",
    duration: "12 hours",
    instructor: "Marcus Aurelius, Lead Android Architect",
    description: "Master asynchronous code structures in Android. Learn coroutines builders, dispatchers, structured concurrency scopes, exception propagations, and reactive cold/hot Flow channels.",
    chapters: [
      "1. Asynchronous scopes: Threading vs Kotlin Coroutines",
      "2. Coroutine Builders (launch, async) & custom Dispatchers",
      "3. Structured Concurrency lifecycle scopes (SupervisorJob)",
      "4. Advanced Exception Propagation & handling recipes",
      "5. Reactive cold streams: Kotlin Flow, stateFlow & sharedFlow",
      "6. Backpressure configurations & custom transformations"
    ]
  },
  {
    id: "46",
    title: "Android Architecture & MVVM",
    progress: 0,
    icon_name: "FolderGit",
    created_at: new Date().toISOString(),
    category: "Android Development",
    difficulty: "Intermediate",
    duration: "14 hours",
    instructor: "Marcus Aurelius, Lead Android Architect",
    description: "Build robust, testable enterprise Android apps. Master MVVM (Model-View-ViewModel) and MVI (Model-View-Intent) patterns, repository database cache architectures, clean architecture bounds, and UI state models.",
    chapters: [
      "1. Evolution of Android Architectures: MVC, MVP, to MVVM",
      "2. Lifecycle-Aware ViewModels & LiveData updates",
      "3. Designing state-driven UIs using MVI (Model-View-Intent)",
      "4. Designing clean Repository patterns with Room caching",
      "5. Clean Architecture: Use Cases, Domain boundaries & Entities",
      "6. Decoupling view models from UI components for testing"
    ]
  },
  {
    id: "47",
    title: "Android Jetpack Suite",
    progress: 0,
    icon_name: "Layers",
    created_at: new Date().toISOString(),
    category: "Android Development",
    difficulty: "Intermediate",
    duration: "11 hours",
    instructor: "Marcus Aurelius, Lead Android Architect",
    description: "Unleash Google's suite of modern libraries. Master Room SQL cache layers, Jetpack Navigation graphs, WorkManager deferred background tasks, Paging 3 listing streams, and Datastore keys.",
    chapters: [
      "1. Room persistence engines: Entities, DAOs, & migrations",
      "2. Jetpack Navigation graph mapping & safe args parameters",
      "3. Scheduling reliable background syncs with WorkManager",
      "4. Infinite scroll listing streams using Paging 3",
      "5. Jetpack DataStore: Proto & Preferences secure files",
      "6. CameraX and Media3 Jetpack integration components"
    ]
  },
  {
    id: "48",
    title: "Android App Testing",
    progress: 0,
    icon_name: "Award",
    created_at: new Date().toISOString(),
    category: "Android Development",
    difficulty: "Expert",
    duration: "13 hours",
    instructor: "Marcus Aurelius, Testing Specialist",
    description: "Write automated tests for secure, crash-free apps. Learn local JUnit unit test models, Mockk mock objects, Robolectric sandbox tests, and Espresso UI automation integrations.",
    chapters: [
      "1. Testing pyramid: Unit, Integration, & Instrumented tests",
      "2. Writing fast local JVM tests with Mockk frameworks",
      "3. Running headless Android OS integrations via Robolectric",
      "4. Automating View & Compose layouts via Espresso",
      "5. Setting up Hilt dependency injection mocks in tests",
      "6. Continuous Integration automated test suites triggers"
    ]
  },
  {
    id: "49",
    title: "Android DI with Hilt",
    progress: 0,
    icon_name: "Compass",
    created_at: new Date().toISOString(),
    category: "Android Development",
    difficulty: "Intermediate",
    duration: "9 hours",
    instructor: "Marcus Aurelius, Lead Android Architect",
    description: "De-clutter object instantiations with Dependency Injection. Master Hilt scopes (Application, Activity, ViewModel), custom provider modules, interface constructor injections, and dynamic testing mock maps.",
    chapters: [
      "1. Why Dependency Injections? Dagger2 to Hilt evolution",
      "2. Hilt components lifecycle hierarchy scopes",
      "3. Dynamic dependencies mapping: @Provides vs @Binds",
      "4. Constructor injection vs Field injection mechanics",
      "5. Multibinding maps & custom qualifiers mapping",
      "6. Dynamic testing setups with Hilt Test Runners"
    ]
  },
  {
    id: "50",
    title: "Bluetooth LE & IoT Android",
    progress: 0,
    icon_name: "Feather",
    created_at: new Date().toISOString(),
    category: "Android Development",
    difficulty: "Expert",
    duration: "16 hours",
    instructor: "Marcus Aurelius, IoT Consultant",
    description: "Connect Android apps to hardware and sensors. Master Bluetooth Low Energy permissions, scanning peripheral nodes, custom GATT services, character readings, notify events, and background BLE connections.",
    chapters: [
      "1. Core Bluetooth Low Energy architecture: GATT vs GAP",
      "2. Requesting runtime locations and BLE secure permissions",
      "3. Scanning BLE peripherals & filtering scan results",
      "4. Connecting GATT servers: Services & Characteristics",
      "5. Reading, Writing, & subscribing to Notify descriptors",
      "6. Structuring robust BLE background reconnect triggers"
    ]
  },
  {
    id: "51",
    title: "Android Custom Canvas",
    progress: 0,
    icon_name: "PenTool",
    created_at: new Date().toISOString(),
    category: "Android Development",
    difficulty: "Expert",
    duration: "11 hours",
    instructor: "Marcus Aurelius, Android Animator",
    description: "Break away from stock UI constraints. Learn dynamic custom Canvas mappings, Paint stroke configurations, Path calculations, custom measurements (onMeasure), layout positioning (onLayout), and physics-driven spring animations.",
    chapters: [
      "1. Core Android graphic pipeline & standard drawing hooks",
      "2. Custom drawings using dynamic Canvas & Paint tools",
      "3. Creating path vectors & mathematical Bezier curves",
      "4. Custom Measurements (onMeasure) & calculations templates",
      "5. Custom Layouts positioning (onLayout) & allocations",
      "6. Designing high-fps custom animations & physics layouts"
    ]
  },
  {
    id: "31",
    title: "Kubernetes in Production",
    progress: 0,
    icon_name: "Layers",
    created_at: new Date().toISOString(),
    category: "Software Development",
    difficulty: "Expert",
    duration: "18 hours",
    instructor: "Alex Mercer, Principal AWS Architect",
    description: "Deploy and manage large-scale container clusters. Covers Pods, Services, Deployments, ingress configurations, stateful sets, helm charts, and horizontal autoscaling.",
    chapters: [
      "1. Kubernetes architecture & control plane components",
      "2. Writing clean YAML Pod and Service configurations",
      "3. Rolling Updates & Canary Deployments strategies",
      "4. Ingress controllers & SSL certificate automations",
      "5. Managing stateful databases with StatefulSets",
      "6. Dynamic autoscaling using HPA (Horizontal Pod Autoscaler)"
    ]
  },
  {
    id: "52",
    title: "UI/UX Design Systems",
    progress: 0,
    icon_name: "Layers",
    created_at: new Date().toISOString(),
    category: "Design",
    difficulty: "Beginner",
    duration: "8 hours",
    instructor: "Emma Watson, Lead Product Designer",
    description: "Learn to build reusable digital design guidelines. Covers atomic design framework hierarchies, typography grids, spatial mapping, accessible color palettes (WCAG), and responsive screens.",
    chapters: [
      "1. Introduction to Atomic Design Systems",
      "2. Grid Layouts & Spatial Baseline Scaping",
      "3. Responsive Fluid Typography hierarchies",
      "4. WCAG Accessible Color contrast palettes",
      "5. Creating reusable component specs & style tokens",
      "6. Designing smooth Micro-Animations for UI assets"
    ]
  },
  {
    id: "53",
    title: "Figma Pro Masterclass",
    progress: 0,
    icon_name: "PenTool",
    created_at: new Date().toISOString(),
    category: "Design",
    difficulty: "Intermediate",
    duration: "10 hours",
    instructor: "Emma Watson, Lead Product Designer",
    description: "Accelerate your styling output in Figma. Master advanced variables, component properties, nested autolayout, responsive constraints, custom design libraries, and user test prototypes.",
    chapters: [
      "1. Master nested Auto-Layout & Absolute Positions",
      "2. Component Properties & Variant structures",
      "3. Styling Variables for Theme accents (Light/Dark)",
      "4. Developing Shared Libraries & Style Guides",
      "5. Dynamic Prototyping (Conditions & Scroll Effects)",
      "6. Design-to-Development Developer Hand-off best practices"
    ]
  },
  {
    id: "54",
    title: "Tailwind CSS Artistry",
    progress: 0,
    icon_name: "Wind",
    created_at: new Date().toISOString(),
    category: "Design",
    difficulty: "Beginner",
    duration: "7 hours",
    instructor: "Emma Watson, Lead Product Designer",
    description: "Write custom styles with utility CSS classes. Learn Tailwind configuration tokens, grid layouts, responsive breakpoints, transitions, complex animations, and responsive dark mode layouts.",
    chapters: [
      "1. The utility-first CSS scoping ideology",
      "2. Fluid Tailwind configs (Fonts, Spacing, Colors)",
      "3. Creating complex Flexbox & CSS Grid layouts",
      "4. Implementing Dark Mode & custom responsive breakpoints",
      "5. Reusable Component styling with utility tokens",
      "6. Smooth CSS Hover transitions & active states"
    ]
  },
  {
    id: "55",
    title: "Framer Motion Animations",
    progress: 0,
    icon_name: "Sparkles",
    created_at: new Date().toISOString(),
    category: "Design",
    difficulty: "Expert",
    duration: "9 hours",
    instructor: "Emma Watson, Lead Product Designer",
    description: "Add smooth fluid animations to React. Master Framer Motion layout transitions, dynamic keyframes, gesture triggers, scroll-driven parallax effects, and page layout reveals.",
    chapters: [
      "1. Framer Motion base tags & visual transitions",
      "2. Dynamic Keyframe animations & CSS spring physics",
      "3. Gesture animation triggers (Hover, Tap, Drag triggers)",
      "4. Shared Layout Transitions & AnimatePresence loops",
      "5. Scroll-Driven animations & Parallax layouts",
      "6. Page Route transitions in React App Router"
    ]
  },
  {
    id: "56",
    title: "Creative Graphic Design",
    progress: 0,
    icon_name: "Palette",
    created_at: new Date().toISOString(),
    category: "Design",
    difficulty: "Beginner",
    duration: "8 hours",
    instructor: "Emma Watson, Creative Lead",
    description: "Master layout composition, vector asset creation, visual hierarchies, typography pairing, and color theory principles for digital and print media.",
    chapters: [
      "1. Introduction to Color Theory & Contrast",
      "2. Vector vs Raster graphics differences",
      "3. Typography Pairing & Kerning constraints",
      "4. Composition: Rule of Thirds & Golden Ratio",
      "5. Designing visual marketing materials & branding",
      "6. Mastering Pen tools & vector shapes in Illustrator"
    ]
  },
  {
    id: "57",
    title: "Mobile Interface Design",
    progress: 0,
    icon_name: "Smartphone",
    created_at: new Date().toISOString(),
    category: "Design",
    difficulty: "Intermediate",
    duration: "11 hours",
    instructor: "Emma Watson, Lead Product Designer",
    description: "Learn Apple Human Interface Guidelines and Android Material Design systems. Create high-fidelity mobile prototypes, handle touch targets, gestures, and dark themes.",
    chapters: [
      "1. iOS Human Interface vs Material Design guidelines",
      "2. Designing for varying mobile screen aspect ratios",
      "3. Tap Targets, Gestures, & reachability zones",
      "4. Structuring efficient navigation patterns",
      "5. Setting up cohesive Mobile Style Tokens",
      "6. Interactive mobile prototyping and transition loops"
    ]
  },
  {
    id: "58",
    title: "Brand Identity & Logos",
    progress: 0,
    icon_name: "Award",
    created_at: new Date().toISOString(),
    category: "Design",
    difficulty: "Intermediate",
    duration: "10 hours",
    instructor: "Emma Watson, Brand Strategist",
    description: "Design cohesive brand identities, visual guidelines, and memorable vector logo marks. Covers client briefs, brainstorming, vector layout scoping, and brand book specifications.",
    chapters: [
      "1. Scoping Brand Briefs & market research",
      "2. Mind-mapping & early concept sketching",
      "3. Vector Logo drafting & grid constraints",
      "4. Selecting custom brand typography & color palettes",
      "5. Creating brand collateral templates (business cards, letterheads)",
      "6. Designing comprehensive Brand Identity Guidelines"
    ]
  },
  {
    id: "59",
    title: "Motion Design with AE",
    progress: 0,
    icon_name: "Video",
    created_at: new Date().toISOString(),
    category: "Design",
    difficulty: "Intermediate",
    duration: "14 hours",
    instructor: "Emma Watson, Motion Graphics Artist",
    description: "Create professional motion graphics, title sequences, logo reveals, and dynamic UI micro-animations. Master keyframes, easing curves, kinetic typography, and rendering options.",
    chapters: [
      "1. After Effects interface & timeline configuration",
      "2. Keyframe basics & value graph editor easing",
      "3. Parent-Child layers & null object trackings",
      "4. Kinetic Typography & title card animations",
      "5. Vector shape path animations & logo reveals",
      "6. Exporting Lottie animations for web developers"
    ]
  },
  {
    id: "60",
    title: "UX Research & Testing",
    progress: 0,
    icon_name: "Search",
    created_at: new Date().toISOString(),
    category: "Design",
    difficulty: "Beginner",
    duration: "9 hours",
    instructor: "Emma Watson, UX Researcher",
    description: "Conduct professional user research, qualitative interviews, usability testing sessions, and parse analytics. Learn user journey maps, card sorting, and actionable research reports.",
    chapters: [
      "1. Qualitative vs Quantitative UX research scopes",
      "2. Conducting user interviews & formulating scripts",
      "3. User Journey Mapping & Empathy maps creation",
      "4. Information Architecture: Card Sorting techniques",
      "5. Designing and executing Usability Testing protocols",
      "6. Synthesizing user feedback into actionable redesigns"
    ]
  },
  {
    id: "61",
    title: "Web UI Design & Grids",
    progress: 0,
    icon_name: "Layout",
    created_at: new Date().toISOString(),
    category: "Design",
    difficulty: "Intermediate",
    duration: "10 hours",
    instructor: "Emma Watson, Lead Product Designer",
    description: "Design stunning web layouts. Master 12-column grid systems, visual hierarchy, typography pairing, hero section design, landing page optimization, and responsive design systems.",
    chapters: [
      "1. Web grids history: 12-column grid frameworks",
      "2. Designing modern responsive Hero Sections",
      "3. Landing page conversion zones & CTAs mapping",
      "4. Typography scale & line height constraints",
      "5. Navigation layouts (megamenus, footers) design",
      "6. Designing modular card grids & responsive behaviors"
    ]
  }
];

async function fetchCourses(): Promise<{ courses: Course[]; error: string | null }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If credentials are not set or are still placeholders, return fallback
  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (!supabaseUrl || !supabaseKey || !isValidUrl(supabaseUrl)) {
    return { courses: FALLBACK_COURSES, error: null };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("id, title, progress, icon_name, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[CoursesSection] Supabase error:", error.message);
      return { courses: FALLBACK_COURSES, error: error.message };
    }

    const dbCourses = (data as Course[]) ?? [];

    // Dynamically merge the database records with our 50-course array
    const combined = [...FALLBACK_COURSES];

    dbCourses.forEach((dbCourse) => {
      const idx = combined.findIndex((c) => c.id === dbCourse.id);
      if (idx !== -1) {
        // Overlay standard details from database, keeping high-fidelity extensions
        combined[idx] = {
          ...combined[idx],
          title: dbCourse.title || combined[idx].title,
          icon_name: dbCourse.icon_name || combined[idx].icon_name,
        };
      } else {
        // If DB has a course not in fallbacks, add it as Web Development fallback
        combined.push({
          ...dbCourse,
          category: "Web Development",
          description: "Learn professional architecture, hands-on production code blocks, and deployment steps in this dynamic catalog module.",
          instructor: "Academy Staff",
          duration: "10 hours",
          difficulty: "Beginner",
          chapters: [
            "1. Fundamental Concepts & Environment Setup",
            "2. Developing Base Building Blocks & Modules",
            "3. Managing States & Data Pipelines",
            "4. Real-world Deployment & Performance optimization"
          ]
        });
      }
    });

    return { courses: combined, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[CoursesSection] Connection error:", message);
    return { courses: FALLBACK_COURSES, error: message };
  }
}

export default async function CoursesSection() {
  const { courses, error } = await fetchCourses();

  return (
    <>
      {error && (
        <div
          className="mb-4 px-4 py-2 rounded-xl text-xs"
          role="alert"
          style={{
            backgroundColor: "rgba(244,63,94,0.1)",
            border: "1px solid rgba(244,63,94,0.2)",
            color: "#F43F5E",
          }}
        >
          ⚠️ Using fallback data — Supabase error: {error}
        </div>
      )}
      <DashboardClient courses={courses} />
    </>
  );
}
