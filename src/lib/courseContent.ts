// ─────────────────────────────────────────────────────────────────────────────
// Course Content Database — Topic descriptions + MCQ quizzes for all 60 courses
// ─────────────────────────────────────────────────────────────────────────────

export interface MCQ {
  question: string;
  options: string[];
  answer: number; // zero-based index of correct option
}

export interface TopicContent {
  title: string;
  description: string;
  mcqs: MCQ[];
}

export interface CourseContent {
  courseId: string;
  topics: TopicContent[];
}

// ─── Shared MCQ helper content ─────────────────────────────────────────────

const ALL_COURSE_CONTENT: CourseContent[] = [

  // ════════════════════════════════════════════════════════════════════════════
  // 1. Advanced React Patterns
  // ════════════════════════════════════════════════════════════════════════════
  {
    courseId: "1",
    topics: [
      {
        title: "Introduction to Advanced Component Scoping",
        description: `React components are the building blocks of modern UIs. In this chapter, we dive deep into *advanced component scoping* — the art of designing components that are focused, reusable, and performant.\n\n**Key Concepts:**\n- **Single Responsibility Principle**: Each component should do one thing well. A \`UserCard\` renders user info; it shouldn't also fetch data.\n- **Prop Drilling vs Context**: Passing props 5 levels deep creates fragile trees. We explore when lifting state is right vs. when to reach for Context API.\n- **Component Boundary Design**: Splitting large components at data ownership seams, not visual ones.\n- **Controlled vs Uncontrolled patterns**: When form inputs should own their state vs. delegate it.\n\nBy mastering component scoping, you'll write React trees that are easy to test, refactor, and reason about — even at enterprise scale.`,
        mcqs: [
          {
            question: "What does the Single Responsibility Principle mean for React components?",
            options: [
              "Each component should use a single hook",
              "Each component should have one focused purpose or concern",
              "Each component should render only one DOM element",
              "Each component should be written in a single file"
            ],
            answer: 1
          },
          {
            question: "When does prop drilling become problematic?",
            options: [
              "When you pass more than 2 props to a component",
              "When props are passed through many intermediate components that don't use them",
              "When using TypeScript with React",
              "When props contain arrays or objects"
            ],
            answer: 1
          },
          {
            question: "Which React API helps avoid prop drilling for global or shared state?",
            options: ["useRef", "useMemo", "Context API", "useReducer"],
            answer: 2
          }
        ]
      },
      {
        title: "The Power of Component Composition",
        description: `Composition is React's most powerful design tool. Instead of building deeply inherited class hierarchies, React components compose behavior through children props, render slots, and compound components.\n\n**Compound Components Pattern:**\nLet components form a cohesive API together. Think of \`<Select>\` + \`<Select.Option>\` — they share implicit state without prop drilling.\n\n**Children as Functions (Render Props):**\n\`\`\`jsx\n<Mouse render={({ x, y }) => <Circle x={x} y={y} />} />\n\`\`\`\nThis lets the consumer decide what to render with shared data.\n\n**Slot Patterns:**\nComponents expose named "slots" (header, footer, body) via named props, giving consumers full layout control while keeping internal logic encapsulated.\n\n**Benefits:** Compositions are easier to test in isolation, require no inheritance, and create naturally discoverable APIs.`,
        mcqs: [
          {
            question: "What is a Compound Component pattern in React?",
            options: [
              "Multiple components merged into one file",
              "Components that share implicit state and form a unified API together",
              "Components that use compound selectors in CSS",
              "A pattern that requires Redux for state sharing"
            ],
            answer: 1
          },
          {
            question: "What does 'render props' pattern refer to?",
            options: [
              "Rendering SVG props in JSX",
              "A prop that is a function returning JSX, used to share component logic",
              "The process of converting server-rendered HTML into React components",
              "Using CSS-in-JS for rendering styles"
            ],
            answer: 1
          },
          {
            question: "What advantage does component composition provide over inheritance?",
            options: [
              "It is faster because inheritance uses the prototype chain",
              "It allows sharing state via props only",
              "It enables flexible, testable UIs without deep class hierarchies",
              "It removes the need for the virtual DOM"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Render Props & HOC Custom Patterns",
        description: `Before hooks, **Higher-Order Components (HOCs)** and **Render Props** were the primary tools for sharing stateful logic between components.\n\n**HOC Pattern:**\nA HOC is a function that takes a component and returns a new, enhanced component.\n\`\`\`jsx\nconst withAuth = (WrappedComponent) => {\n  return function AuthenticatedComponent(props) {\n    if (!isLoggedIn) return <Redirect to="/login" />;\n    return <WrappedComponent {...props} />;\n  };\n};\n\`\`\`\n\n**Render Props:**\nPass a function as a prop to inject dynamic behavior into a component from the outside.\n\n**When to still use them:**\n- HOCs: for cross-cutting concerns (logging, auth guards, analytics wrappers)\n- Render Props: when you need to share state but want consumer control over the rendered output\n\n**Modern Alternative:** Custom hooks solve most HOC/Render Prop use cases more cleanly, but HOCs remain valuable for library-level abstractions.`,
        mcqs: [
          {
            question: "What is a Higher-Order Component (HOC)?",
            options: [
              "A component with more than 5 props",
              "A function that takes a component and returns an enhanced component",
              "A React built-in API for performance optimization",
              "A component that wraps the entire application"
            ],
            answer: 1
          },
          {
            question: "Which modern React feature largely replaces the need for HOCs and Render Props?",
            options: ["React.memo", "Custom Hooks", "Portals", "Strict Mode"],
            answer: 1
          },
          {
            question: "In the HOC pattern, how are original props typically forwarded to the wrapped component?",
            options: [
              "Using Object.assign()",
              "Via the spread operator: {...props}",
              "Using React.cloneElement()",
              "By destructuring and listing all props manually"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Advanced State Reducers with Custom Hooks",
        description: `\`useReducer\` is React's built-in state machine primitive. Combined with custom hooks, it enables predictable, testable state machines for complex UI logic.\n\n**The State Reducer Pattern:**\nExpose your reducer to consumers so they can override default state transitions — giving them "control" without reimplementing everything.\n\n\`\`\`jsx\nfunction useToggle({ reducer = toggleReducer } = {}) {\n  const [state, dispatch] = useReducer(reducer, { on: false });\n  const toggle = () => dispatch({ type: 'TOGGLE' });\n  return { on: state.on, toggle };\n}\n\`\`\`\n\n**Why Custom Hooks win:**\n- Extract complex stateful logic out of components\n- Make logic reusable across different components\n- Drastically improve unit testability (test the hook, not the UI)\n\n**Advanced Pattern — useReducer + Context:**\nCombine useReducer with Context to build scalable mini-Redux stores without any dependencies.`,
        mcqs: [
          {
            question: "What does `useReducer` return?",
            options: [
              "A state object and a setter function",
              "A state value and a dispatch function",
              "A memoized value and a reset function",
              "An effect cleanup and a state updater"
            ],
            answer: 1
          },
          {
            question: "What is the key advantage of the State Reducer Pattern?",
            options: [
              "It allows consumers to override default state transitions",
              "It eliminates the need for useEffect",
              "It automatically memoizes all state values",
              "It replaces Redux in all use cases"
            ],
            answer: 0
          },
          {
            question: "What is a primary benefit of extracting logic into custom hooks?",
            options: [
              "Custom hooks run on the server automatically",
              "They make stateful logic reusable and independently testable",
              "They prevent re-renders caused by context changes",
              "They bypass React's reconciliation algorithm"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "React 19 Concurrent Features & Transitions",
        description: `React 19 introduces powerful concurrent rendering primitives that allow React to interrupt, pause, and resume rendering work — keeping UIs fast and responsive even under heavy computation.\n\n**Key APIs:**\n\n**\`startTransition\`:** Marks state updates as non-urgent. React can interrupt them to handle more critical updates (e.g., user input).\n\`\`\`jsx\nstartTransition(() => {\n  setFilteredResults(heavyFilter(data));\n});\n\`\`\`\n\n**\`useTransition\`:** Returns \`[isPending, startTransition]\` — \`isPending\` lets you show loading skeletons during heavy transitions.\n\n**\`useDeferredValue\`:** Defers re-rendering a part of the tree until the browser is idle.\n\n**React Suspense + Streaming:**\nWith server components, React can stream UI chunks to the browser as they resolve, dramatically improving Time to First Byte (TTFB).`,
        mcqs: [
          {
            question: "What does `startTransition` do in React 19?",
            options: [
              "Starts a CSS transition animation",
              "Marks a state update as non-urgent, allowing React to prioritize other updates",
              "Defers a component's initial render until its data loads",
              "Cancels a pending useEffect"
            ],
            answer: 1
          },
          {
            question: "What does `useTransition` return?",
            options: [
              "A loading state and a memoized callback",
              "An animation controller and a start function",
              "An isPending boolean and a startTransition function",
              "A deferred value and a suspend promise"
            ],
            answer: 2
          },
          {
            question: "What is the purpose of `useDeferredValue`?",
            options: [
              "To cache expensive computations between renders",
              "To defer re-rendering a part of the tree until the browser is idle",
              "To delay API calls until the component is visible",
              "To memoize event handlers"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Profiling Rendering Speeds & Memory Optimization",
        description: `Performance optimization in React is about reducing unnecessary work. Before optimizing, always **profile first** using React DevTools Profiler or Chrome Performance tab.\n\n**Common performance killers:**\n- Unnecessary re-renders from unstable object/array references\n- Missing \`key\` props causing full list re-mounts\n- Large component trees without memoization\n- Memory leaks from uncleaned subscriptions in \`useEffect\`\n\n**Key Tools:**\n- **\`React.memo\`**: Prevents re-render if props haven't changed (shallow comparison)\n- **\`useMemo\`**: Memoizes expensive computations\n- **\`useCallback\`**: Memoizes functions to keep references stable\n- **\`React DevTools Profiler\`**: Records rendering timelines and flame graphs\n\n**Memory Best Practices:**\n- Always return cleanup functions from \`useEffect\`\n- Unsubscribe from WebSockets, EventEmitters, and Intersection Observers\n- Avoid storing DOM nodes in state (use refs instead)`,
        mcqs: [
          {
            question: "What does `React.memo` do?",
            options: [
              "It memoizes expensive calculations inside a component",
              "It prevents a component from re-rendering if its props haven't changed",
              "It caches the entire React tree in memory",
              "It replaces useCallback for function memoization"
            ],
            answer: 1
          },
          {
            question: "How do you prevent memory leaks from event listeners in useEffect?",
            options: [
              "Use useMemo to cache the listener",
              "Return a cleanup function from useEffect that removes the listener",
              "Use React.StrictMode to automatically clean up listeners",
              "Store the listener in a ref instead of state"
            ],
            answer: 1
          },
          {
            question: "What is the difference between `useMemo` and `useCallback`?",
            options: [
              "useMemo memoizes values; useCallback memoizes functions",
              "useMemo runs on every render; useCallback runs only once",
              "useCallback can replace useEffect; useMemo cannot",
              "They are identical — both memoize any value type"
            ],
            answer: 0
          }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 2. System Design Mastery
  // ════════════════════════════════════════════════════════════════════════════
  {
    courseId: "2",
    topics: [
      {
        title: "Horizontal vs Vertical Scaling",
        description: `Scaling is the process of handling increased load. There are two primary strategies:\n\n**Vertical Scaling (Scale Up):**\nAdd more resources (CPU, RAM) to a single server. Simple but has a ceiling — hardware has limits. Suitable for databases early in a product's life.\n\n**Horizontal Scaling (Scale Out):**\nAdd more servers and distribute load across them. Theoretically unlimited scale, but requires stateless services and a load balancer. This is the backbone of cloud-native architectures.\n\n**Stateless vs Stateful Services:**\nHorizontally scaling stateful services (e.g., sessions stored in memory) is hard. Solution: externalize state to Redis or a database, keeping services stateless.\n\n**When to choose which:**\n- Vertical: Early-stage, simple applications, relational databases\n- Horizontal: High-traffic APIs, microservices, streaming systems`,
        mcqs: [
          {
            question: "What is vertical scaling?",
            options: [
              "Adding more servers to handle load",
              "Increasing the resources (CPU, RAM) of a single server",
              "Distributing database reads across replicas",
              "Partitioning data across multiple servers"
            ],
            answer: 1
          },
          {
            question: "Why must services be stateless for effective horizontal scaling?",
            options: [
              "Stateful services use too much memory",
              "Any server must be able to handle any request without session affinity",
              "Stateless services don't need load balancers",
              "Horizontal scaling doesn't work with databases"
            ],
            answer: 1
          },
          {
            question: "What is a common solution for externalizing session state to enable horizontal scaling?",
            options: ["PostgreSQL", "Redis", "NGINX", "Kafka"],
            answer: 1
          }
        ]
      },
      {
        title: "Load Balancing Techniques",
        description: `A **Load Balancer** distributes incoming traffic across multiple servers to prevent overload and ensure high availability.\n\n**Common Algorithms:**\n\n1. **Round Robin**: Requests cycle through servers sequentially. Simple and effective for uniform workloads.\n2. **Least Connections**: Route to the server with fewest active connections. Better for variable-length requests.\n3. **IP Hash**: Route based on client IP — ensures the same client always hits the same server (session affinity).\n4. **Weighted Round Robin**: Servers with more capacity receive proportionally more traffic.\n\n**Layer 4 vs Layer 7 Load Balancing:**\n- **L4**: Operates at TCP/UDP level — fast but no content awareness\n- **L7**: Operates at HTTP level — can route based on URL paths, headers, cookies\n\n**Health Checks:** Load balancers periodically ping servers. Unhealthy servers are removed from the pool automatically.`,
        mcqs: [
          {
            question: "Which load balancing algorithm routes requests to the server with fewest active connections?",
            options: ["Round Robin", "IP Hash", "Least Connections", "Weighted Round Robin"],
            answer: 2
          },
          {
            question: "What is the advantage of Layer 7 load balancing over Layer 4?",
            options: [
              "It operates at the network layer and is faster",
              "It can route traffic based on HTTP content like URL paths and headers",
              "It doesn't require health checks",
              "It works exclusively with UDP traffic"
            ],
            answer: 1
          },
          {
            question: "What is IP Hash load balancing useful for?",
            options: [
              "Routing traffic to the fastest available server",
              "Distributing requests evenly in a round-robin fashion",
              "Ensuring session affinity (same client hits the same server)",
              "Encrypting traffic between load balancer and servers"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Database Partitioning & Sharding",
        description: `As data grows, a single database server becomes a bottleneck. **Partitioning** and **Sharding** distribute data across multiple nodes.\n\n**Horizontal Partitioning (Sharding):**\nRows of a table are distributed across multiple database servers (shards). Each shard holds a subset of data.\n\n**Shard Key Selection (Critical!):**\nA poor shard key creates "hot spots" — one shard gets all the load. Good keys distribute writes evenly (e.g., user_id hash).\n\n**Types of Sharding:**\n- **Range-based**: Shard by ID range (1-1M on Shard A, 1M-2M on Shard B)\n- **Hash-based**: Hash the key and modulo by shard count\n- **Directory-based**: A lookup service maps keys to shards\n\n**Vertical Partitioning:**\nSplit a wide table into multiple tables by columns. E.g., move infrequently accessed columns to a separate table.\n\n**Challenges:** Cross-shard joins are expensive. Rebalancing shards as data grows requires careful migration planning.`,
        mcqs: [
          {
            question: "What is database sharding?",
            options: [
              "Creating read replicas of a database",
              "Distributing rows of a table across multiple database servers",
              "Encrypting database columns for security",
              "Splitting a database table by columns"
            ],
            answer: 1
          },
          {
            question: "What is a 'hot spot' in the context of database sharding?",
            options: [
              "A database server that receives disproportionately high traffic due to a poor shard key",
              "A database with too many active connections",
              "A geographic region with high user density",
              "A caching layer that has too many cache hits"
            ],
            answer: 0
          },
          {
            question: "What is vertical partitioning?",
            options: [
              "Sharding rows across multiple servers",
              "Splitting a database by geographic region",
              "Splitting a wide table by columns into multiple tables",
              "Creating separate databases for read and write operations"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Caching Topologies (Redis & Memcached)",
        description: `Caching is storing frequently accessed data in fast-access storage (memory) to reduce database load and response latency.\n\n**Cache-Aside (Lazy Loading):**\nApplication checks cache first. On miss, fetches from DB and populates cache. Most common pattern.\n\n**Write-Through:**\nWrite to cache and DB simultaneously. Cache is always warm but adds write latency.\n\n**Write-Behind (Write-Back):**\nWrite to cache immediately, persist to DB asynchronously. Fast writes but risk of data loss.\n\n**Redis vs Memcached:**\n| Feature | Redis | Memcached |\n|---|---|---|\n| Data Structures | Rich (lists, sets, sorted sets) | Simple strings |\n| Persistence | Optional (RDB/AOF) | None |\n| Clustering | Native Redis Cluster | Client-side |\n| Pub/Sub | Yes | No |\n\n**Cache Eviction Policies:**\n- **LRU** (Least Recently Used): Evict oldest accessed items\n- **LFU** (Least Frequently Used): Evict least-used items\n- **TTL** (Time To Live): Auto-expire after a time window`,
        mcqs: [
          {
            question: "What is the Cache-Aside (Lazy Loading) pattern?",
            options: [
              "Data is pre-loaded into cache at application startup",
              "Writes go to cache first and persist to DB asynchronously",
              "The application checks cache first; on miss, fetches from DB and stores in cache",
              "Cache is invalidated every time a write occurs"
            ],
            answer: 2
          },
          {
            question: "Which feature does Redis have that Memcached lacks?",
            options: [
              "In-memory storage",
              "Key-value data model",
              "Rich data structures like sorted sets, lists, and pub/sub",
              "Horizontal scaling"
            ],
            answer: 2
          },
          {
            question: "What does LRU eviction policy do?",
            options: [
              "Evicts items that are least frequently accessed over time",
              "Evicts items that haven't been accessed recently",
              "Evicts the largest items first",
              "Evicts items based on their TTL expiry"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Event-Driven Systems with Kafka & RabbitMQ",
        description: `Event-driven architecture decouples producers and consumers of data, enabling asynchronous, scalable systems.\n\n**Apache Kafka:**\nA distributed log/streaming platform. Messages (events) are stored in **topics** (append-only logs). Consumers read at their own pace via **offsets**. Kafka retains messages for configurable periods — consumers can replay history.\n\n**Key Kafka Concepts:**\n- **Topics**: Named streams of events\n- **Partitions**: Topics split for parallel consumption\n- **Consumer Groups**: Multiple consumers share partition load\n- **Offset**: Consumer's position in the log\n\n**RabbitMQ:**\nA traditional message broker using **queues**. Messages are consumed and deleted (push model). Better for task queues and RPC patterns. Uses AMQP protocol.\n\n**Kafka vs RabbitMQ:**\n| | Kafka | RabbitMQ |\n|---|---|---|\n| Model | Pull (log-based) | Push (queue-based) |\n| Retention | Long-term | Until consumed |\n| Replay | Yes | No |\n| Throughput | Very high | Moderate |`,
        mcqs: [
          {
            question: "What is a Kafka 'offset'?",
            options: [
              "The delay between a producer and consumer",
              "A consumer's position in a partition log",
              "The size of a Kafka message batch",
              "The number of partitions in a topic"
            ],
            answer: 1
          },
          {
            question: "How does Kafka differ from RabbitMQ in message retention?",
            options: [
              "Kafka deletes messages after consumption; RabbitMQ retains them",
              "Kafka retains messages for a configurable period; RabbitMQ deletes after consumption",
              "Both retain messages indefinitely",
              "RabbitMQ supports longer retention with AOF persistence"
            ],
            answer: 1
          },
          {
            question: "What are Kafka Consumer Groups used for?",
            options: [
              "Grouping producers by topic",
              "Allowing multiple consumers to share the load of reading from partitions",
              "Encrypting messages between producers and consumers",
              "Routing messages to specific consumers based on content"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Multi-Region Failover & CDN Edge Topologies",
        description: `Global applications need to serve users fast worldwide while surviving regional outages.\n\n**Multi-Region Deployment:**\nDeploy services in multiple geographic regions. Use **DNS failover** to redirect traffic if a region goes down.\n\n**Active-Active vs Active-Passive:**\n- **Active-Active**: Both regions serve live traffic. Complexity: data synchronization.\n- **Active-Passive**: One region is primary; the other is hot standby. Simpler but wastes capacity.\n\n**CDN (Content Delivery Network):**\nCDNs cache static assets (images, JS, CSS) at **edge nodes** close to users. Reduces origin server load and latency dramatically.\n\n**CDN Strategies:**\n- **Pull-based**: Edge fetches from origin on first miss, caches thereafter\n- **Push-based**: You proactively push content to edge nodes\n\n**Cache Invalidation in CDNs:**\nWhen content changes, you must purge CDN caches. Most CDNs support tag-based purging and URL purging.\n\n**Route 53 & GeoDNS:** DNS services can route users to the nearest healthy region automatically.`,
        mcqs: [
          {
            question: "What is the difference between Active-Active and Active-Passive multi-region deployments?",
            options: [
              "Active-Active serves traffic in one region; Active-Passive serves in both",
              "Active-Active has both regions serving live traffic; Active-Passive has one on standby",
              "Active-Passive is faster due to reduced latency",
              "Active-Active doesn't require data synchronization"
            ],
            answer: 1
          },
          {
            question: "What is the primary purpose of a CDN edge node?",
            options: [
              "To run server-side code closer to users",
              "To cache static assets geographically close to users, reducing latency",
              "To encrypt traffic between users and the origin server",
              "To balance database queries across regions"
            ],
            answer: 1
          },
          {
            question: "What is a CDN pull-based caching strategy?",
            options: [
              "Content is pushed to all edge nodes at deployment time",
              "The edge node fetches content from origin on first miss and caches it",
              "Users download content directly from the origin server",
              "The CDN actively monitors and updates content every minute"
            ],
            answer: 1
          }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 3. TypeScript Deep Dive
  // ════════════════════════════════════════════════════════════════════════════
  {
    courseId: "3",
    topics: [
      {
        title: "Type Assertion vs Type Narrowing",
        description: `TypeScript gives you tools to work with types safely. Understanding the difference between **type assertion** and **type narrowing** is crucial.\n\n**Type Assertion:**\nTells TypeScript "trust me, I know the type." Uses the \`as\` keyword. Bypasses type checking — use sparingly.\n\`\`\`ts\nconst input = document.getElementById('email') as HTMLInputElement;\n\`\`\`\n\n**Type Narrowing:**\nUsing runtime checks that TypeScript understands to narrow union types to specific types. Safer because it's verified at runtime.\n\n\`\`\`ts\nfunction process(value: string | number) {\n  if (typeof value === 'string') {\n    return value.toUpperCase(); // TypeScript knows it's a string here\n  }\n  return value.toFixed(2); // TypeScript knows it's a number here\n}\n\`\`\`\n\n**Narrowing Techniques:**\n- \`typeof\` guards for primitives\n- \`instanceof\` guards for classes\n- \`in\` operator for object shapes\n- Custom type predicates: \`function isUser(x: any): x is User\``,
        mcqs: [
          {
            question: "What does the `as` keyword do in TypeScript?",
            options: [
              "Narrows a type using runtime checks",
              "Asserts to TypeScript that a value has a specific type, bypassing checks",
              "Creates a type alias",
              "Imports a type from another module"
            ],
            answer: 1
          },
          {
            question: "What is the safer alternative to type assertion?",
            options: [
              "Using `any` type",
              "Type casting with angle brackets",
              "Type narrowing with runtime checks like `typeof` or `instanceof`",
              "Using `unknown` type with force cast"
            ],
            answer: 2
          },
          {
            question: "What is a type predicate function?",
            options: [
              "A function that converts one type to another",
              "A function whose return type is `x is SomeType`, used for narrowing",
              "A generic constraint that filters types",
              "A TypeScript utility type that extracts keys"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Advanced Generics & Constraint Parameters",
        description: `Generics make TypeScript code reusable across types while maintaining type safety.\n\n**Basic Generic:**\n\`\`\`ts\nfunction identity<T>(value: T): T {\n  return value;\n}\n\`\`\`\n\n**Generic Constraints:**\nUse \`extends\` to restrict what types can be passed:\n\`\`\`ts\nfunction getLength<T extends { length: number }>(value: T): number {\n  return value.length;\n}\n// Works for strings, arrays — not numbers\n\`\`\`\n\n**Multiple Type Parameters:**\n\`\`\`ts\nfunction merge<T, U>(a: T, b: U): T & U {\n  return { ...a, ...b };\n}\n\`\`\`\n\n**Default Type Parameters:**\n\`\`\`ts\ntype ApiResponse<T = unknown> = { data: T; status: number };\n\`\`\`\n\n**keyof & Constraints:**\n\`\`\`ts\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\`\`\`\nThis ensures you can only access valid keys of an object.`,
        mcqs: [
          {
            question: "What does `T extends { length: number }` mean as a generic constraint?",
            options: [
              "T must be a subclass of an object with a length property",
              "T must have at least a `length` property of type number",
              "T extends the built-in Array type",
              "T must be a string with a minimum length"
            ],
            answer: 1
          },
          {
            question: "What does `keyof T` produce in TypeScript?",
            options: [
              "The values of all properties in T",
              "A union type of all the keys (property names) of T",
              "The prototype chain of T",
              "A tuple of all T's properties"
            ],
            answer: 1
          },
          {
            question: "What is a default type parameter used for?",
            options: [
              "To provide a fallback type when no type argument is passed",
              "To restrict a generic to only default JavaScript types",
              "To automatically infer types from function arguments",
              "To create a union of all possible types for a parameter"
            ],
            answer: 0
          }
        ]
      },
      {
        title: "Conditional Types & Template Literal Types",
        description: `TypeScript's type system is Turing-complete! Conditional and template literal types let you build powerful type-level transformations.\n\n**Conditional Types:**\n\`\`\`ts\ntype IsString<T> = T extends string ? 'yes' : 'no';\ntype A = IsString<string>; // 'yes'\ntype B = IsString<number>; // 'no'\n\`\`\`\n\n**Distributive Conditional Types:**\nWhen applied to union types, conditional types distribute over each member:\n\`\`\`ts\ntype ToArray<T> = T extends any ? T[] : never;\ntype Result = ToArray<string | number>; // string[] | number[]\n\`\`\`\n\n**\`infer\` Keyword:**\nExtract types from within conditional checks:\n\`\`\`ts\ntype ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;\n\`\`\`\n\n**Template Literal Types:**\n\`\`\`ts\ntype EventName = 'click' | 'focus';\ntype Handler = \`on\${Capitalize<EventName>}\`; // 'onClick' | 'onFocus'\n\`\`\``,
        mcqs: [
          {
            question: "What does the `infer` keyword do in conditional types?",
            options: [
              "Forces TypeScript to infer all types in a generic function",
              "Extracts and names a type within a conditional type pattern",
              "Converts conditional types to mapped types",
              "Prevents type widening in conditional branches"
            ],
            answer: 1
          },
          {
            question: "What is a distributive conditional type?",
            options: [
              "A conditional type that applies to a fixed type only",
              "A conditional type that automatically distributes over each member of a union type",
              "A type that distributes properties across multiple interfaces",
              "A mapped type that conditionally adds properties"
            ],
            answer: 1
          },
          {
            question: "What does the template literal type `\\`on${Capitalize<T>}\\`` produce when T is 'click'?",
            options: ["'onclick'", "'onClick'", "'OnClick'", "'on_click'"],
            answer: 1
          }
        ]
      },
      {
        title: "Mapped Types & Utility API Implementations",
        description: `**Mapped Types** iterate over the keys of an existing type and transform them.\n\n**Basic Mapped Type:**\n\`\`\`ts\ntype ReadOnly<T> = {\n  readonly [K in keyof T]: T[K];\n};\n\`\`\`\n\n**Modifiers:**\n- Add \`readonly\`: \`readonly [K in keyof T]\`\n- Remove readonly: \`-readonly [K in keyof T]\`\n- Make optional: \`[K in keyof T]?: T[K]\`\n- Remove optional: \`[K in keyof T]-?: T[K]\`\n\n**Built-in Utility Types (implementing them from scratch):**\n\`\`\`ts\n// Partial - make all properties optional\ntype MyPartial<T> = { [K in keyof T]?: T[K] };\n\n// Required - make all properties required\ntype MyRequired<T> = { [K in keyof T]-?: T[K] };\n\n// Pick - select subset of properties\ntype MyPick<T, K extends keyof T> = { [P in K]: T[P] };\n\n// Record - create type with specific keys and value type\ntype MyRecord<K extends string, V> = { [P in K]: V };\n\`\`\``,
        mcqs: [
          {
            question: "What does `{ [K in keyof T]?: T[K] }` create?",
            options: [
              "A type where all properties of T are required",
              "A type where all properties of T are optional",
              "A type that removes all readonly modifiers from T",
              "A type that extracts only optional properties from T"
            ],
            answer: 1
          },
          {
            question: "What does the `-?` modifier do in a mapped type?",
            options: [
              "Removes the property from the type",
              "Removes the optional modifier, making the property required",
              "Removes the readonly modifier from the property",
              "Negates the property's type"
            ],
            answer: 1
          },
          {
            question: "What does TypeScript's built-in `Pick<T, K>` utility type do?",
            options: [
              "Removes keys K from type T",
              "Makes all keys in K optional in type T",
              "Creates a new type by selecting only keys K from type T",
              "Creates a union of types for each key in K"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Decorators in Modern Web Scapes",
        description: `**TypeScript Decorators** are a stage-3 ECMAScript proposal that allows you to annotate and modify classes, methods, and properties with declarative syntax.\n\n**Class Decorator:**\n\`\`\`ts\n@sealed\nclass UserService {\n  name = 'UserService';\n}\n\nfunction sealed(constructor: Function) {\n  Object.seal(constructor);\n}\n\`\`\`\n\n**Method Decorator:**\n\`\`\`ts\nfunction log(target: any, key: string, descriptor: PropertyDescriptor) {\n  const original = descriptor.value;\n  descriptor.value = function(...args: any[]) {\n    console.log(\`Calling \${key}\`);\n    return original.apply(this, args);\n  };\n  return descriptor;\n}\n\`\`\`\n\n**Property Decorators:** Transform property definitions at class level.\n\n**Real-world use cases:**\n- **Angular**: \`@Component\`, \`@Injectable\`, \`@Input\`\n- **TypeORM**: \`@Entity\`, \`@Column\`, \`@PrimaryKey\`\n- **NestJS**: \`@Controller\`, \`@Get\`, \`@Post\`\n\nDecorators are the backbone of metadata-driven frameworks.`,
        mcqs: [
          {
            question: "What is a TypeScript class decorator?",
            options: [
              "A function that modifies a class's prototype at runtime",
              "A special comment syntax for documenting classes",
              "A type constraint that restricts class instantiation",
              "A built-in TypeScript keyword for abstract classes"
            ],
            answer: 0
          },
          {
            question: "Which framework heavily uses TypeScript decorators for its component system?",
            options: ["React", "Vue.js", "Angular", "Svelte"],
            answer: 2
          },
          {
            question: "What does a method decorator receive as its third argument?",
            options: [
              "The class prototype",
              "The method's name as a string",
              "The PropertyDescriptor of the method",
              "The return type of the method"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Absolute TS Config & Compiler Profiling",
        description: `The \`tsconfig.json\` controls everything about how TypeScript compiles your code. Mastering it unlocks faster builds, stricter safety, and better IDE experiences.\n\n**Critical \`compilerOptions\`:**\n\`\`\`json\n{\n  "compilerOptions": {\n    "strict": true,           // Enables all strict checks\n    "noUncheckedIndexedAccess": true, // Array access returns T | undefined\n    "exactOptionalPropertyTypes": true, // Distinguish missing vs undefined\n    "paths": {               // Path aliases for clean imports\n      "@/*": ["./src/*"]\n    },\n    "incremental": true,      // Cache compilation for speed\n    "tsBuildInfoFile": ".tsbuildinfo"\n  }\n}\n\`\`\`\n\n**Project References:** Split large monorepos into smaller TypeScript projects that compile independently.\n\n**Compiler Performance Profiling:**\n\`\`\`bash\ntsc --diagnostics  # Shows compilation time breakdown\ntsc --listFiles    # Shows all files included in compilation\n\`\`\`\n\n**\`strict\` mode enables:**\n- \`strictNullChecks\`: null/undefined must be handled explicitly\n- \`strictFunctionTypes\`: stricter function type checks\n- \`noImplicitAny\`: disallow implicit \`any\` type`,
        mcqs: [
          {
            question: "What does enabling `strict: true` in tsconfig.json do?",
            options: [
              "Prevents any type from being used anywhere in the codebase",
              "Enables a set of stricter type checking rules including strictNullChecks",
              "Forces all files to use ES modules",
              "Disables incremental compilation"
            ],
            answer: 1
          },
          {
            question: "What does `noUncheckedIndexedAccess` do in TypeScript?",
            options: [
              "Prevents array indices from being used in type parameters",
              "Makes array/object access return `T | undefined` to force null checks",
              "Disables dynamic property access on objects",
              "Requires all array indices to be typed as `number`"
            ],
            answer: 1
          },
          {
            question: "What is the purpose of TypeScript `paths` in tsconfig?",
            options: [
              "Specifies the output directory for compiled files",
              "Defines path aliases for cleaner import statements",
              "Lists external libraries to include in compilation",
              "Configures the TypeScript language server path"
            ],
            answer: 1
          }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 4. Python for Data Science (id: "4")
  // ════════════════════════════════════════════════════════════════════════════
  {
    courseId: "4",
    topics: [
      {
        title: "Python Environments & Scientific Stack Setup",
        description: `Setting up a proper Python environment is the foundation of productive data science work.\n\n**Virtual Environments:**\nAlways work in isolated environments to avoid dependency conflicts.\n\`\`\`bash\npython -m venv .venv\nsource .venv/bin/activate  # macOS/Linux\n.venv\\Scripts\\activate     # Windows\n\`\`\`\n\n**conda vs pip:**\n- **conda**: Manages both Python packages AND non-Python dependencies (C libraries). Best for scientific computing.\n- **pip**: Python-only package manager. Works with any Python project.\n\n**The Scientific Stack:**\n- \`numpy\` — Fast numerical arrays\n- \`pandas\` — Data manipulation with DataFrames\n- \`matplotlib\` / \`seaborn\` — Data visualization\n- \`scikit-learn\` — Machine learning algorithms\n- \`jupyter\` — Interactive notebooks\n\n\`\`\`bash\npip install numpy pandas matplotlib seaborn scikit-learn jupyterlab\n\`\`\``,
        mcqs: [
          {
            question: "What is the primary advantage of using a Python virtual environment?",
            options: [
              "It speeds up Python execution",
              "It isolates project dependencies to avoid conflicts",
              "It enables GPU acceleration for numpy",
              "It automatically installs the latest Python version"
            ],
            answer: 1
          },
          {
            question: "What does `conda` manage that `pip` does not?",
            options: [
              "Python source files",
              "Non-Python dependencies like C libraries and system packages",
              "Virtual environments exclusively",
              "Jupyter notebook configurations"
            ],
            answer: 1
          },
          {
            question: "Which library provides the DataFrame data structure in Python?",
            options: ["numpy", "scipy", "pandas", "matplotlib"],
            answer: 2
          }
        ]
      },
      {
        title: "NumPy Fundamentals & Array Operations",
        description: `**NumPy** is the foundation of scientific computing in Python. Its \`ndarray\` is orders of magnitude faster than Python lists for numerical operations.\n\n**Creating Arrays:**\n\`\`\`python\nimport numpy as np\na = np.array([1, 2, 3])\nb = np.zeros((3, 4))     # 3x4 matrix of zeros\nc = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]\nd = np.linspace(0, 1, 5) # [0, 0.25, 0.5, 0.75, 1.0]\n\`\`\`\n\n**Vectorized Operations (no loops needed!):**\n\`\`\`python\na = np.array([1, 2, 3])\nprint(a * 2)        # [2, 4, 6]\nprint(a ** 2)       # [1, 4, 9]\nprint(np.sqrt(a))   # [1.0, 1.414, 1.732]\n\`\`\`\n\n**Broadcasting:**\nNumPy automatically expands arrays of compatible shapes for element-wise operations.\n\n**Indexing & Slicing:**\n\`\`\`python\nm = np.array([[1,2,3],[4,5,6],[7,8,9]])\nprint(m[1, 2])   # 6\nprint(m[:, 1])   # [2, 5, 8] — second column\nprint(m[m > 4])  # Boolean indexing: [5, 6, 7, 8, 9]\n\`\`\``,
        mcqs: [
          {
            question: "What is the primary advantage of NumPy arrays over Python lists for numerical computing?",
            options: [
              "NumPy arrays can store mixed types like strings and numbers",
              "NumPy operations are vectorized and execute in compiled C code, making them much faster",
              "NumPy arrays automatically resize when you append elements",
              "NumPy arrays support recursive data structures"
            ],
            answer: 1
          },
          {
            question: "What does NumPy broadcasting allow?",
            options: [
              "Sending arrays across a network",
              "Element-wise operations on arrays of compatible but different shapes",
              "Broadcasting events from one array to subscribed listeners",
              "Automatically reshaping arrays to match a target shape"
            ],
            answer: 1
          },
          {
            question: "What does `m[m > 4]` do with a NumPy array `m`?",
            options: [
              "Returns elements at indices greater than 4",
              "Returns a boolean array indicating which elements are greater than 4",
              "Filters and returns elements whose values are greater than 4",
              "Raises an IndexError for values out of bounds"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Pandas DataFrames & Data Wrangling",
        description: `**Pandas** is the workhorse of data manipulation in Python. Its \`DataFrame\` is a 2D labeled data structure — like a spreadsheet in memory.\n\n**Creating DataFrames:**\n\`\`\`python\nimport pandas as pd\ndf = pd.DataFrame({\n    'name': ['Alice', 'Bob', 'Carol'],\n    'score': [95, 82, 78],\n    'grade': ['A', 'B', 'C']\n})\n\`\`\`\n\n**Essential Operations:**\n\`\`\`python\ndf.head()              # First 5 rows\ndf.describe()          # Statistical summary\ndf['score'].mean()     # Column mean\ndf[df['score'] > 80]   # Filter rows\ndf.groupby('grade').mean()  # Group by\ndf.sort_values('score', ascending=False)  # Sort\n\`\`\`\n\n**Handling Missing Data:**\n\`\`\`python\ndf.isnull().sum()      # Count missing values\ndf.dropna()            # Remove rows with NaN\ndf.fillna(df.mean())   # Fill with column mean\n\`\`\`\n\n**Merging DataFrames:**\n\`\`\`python\npd.merge(df1, df2, on='id', how='left')  # Left join\n\`\`\``,
        mcqs: [
          {
            question: "What does `df.describe()` return in pandas?",
            options: [
              "The column names and their data types",
              "A statistical summary (count, mean, std, min, max, quartiles) of numerical columns",
              "A description of the DataFrame's memory usage",
              "The first 5 rows of the DataFrame"
            ],
            answer: 1
          },
          {
            question: "What does `df.fillna(df.mean())` do?",
            options: [
              "Removes all rows containing NaN values",
              "Fills NaN values in each column with that column's mean",
              "Replaces all values with the DataFrame mean",
              "Creates a new column with the mean values"
            ],
            answer: 1
          },
          {
            question: "What does `df.groupby('grade').mean()` produce?",
            options: [
              "Groups rows by grade and returns the mean of numerical columns for each group",
              "Sorts the DataFrame by grade and computes a running mean",
              "Creates a pivot table with grade as the index",
              "Returns the grade with the highest mean score"
            ],
            answer: 0
          }
        ]
      },
      {
        title: "Data Visualization with Matplotlib & Seaborn",
        description: `Visualization is how you communicate insights from data. Python offers two primary libraries:\n\n**Matplotlib (low-level, full control):**\n\`\`\`python\nimport matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(10, 6))\nax.plot(x, y, color='blue', linewidth=2, label='Sales')\nax.set_title('Monthly Sales')\nax.set_xlabel('Month')\nax.legend()\nplt.show()\n\`\`\`\n\n**Seaborn (high-level, beautiful defaults):**\n\`\`\`python\nimport seaborn as sns\n\n# Correlation heatmap\nsns.heatmap(df.corr(), annot=True, cmap='coolwarm')\n\n# Distribution plot\nsns.histplot(df['score'], kde=True)\n\n# Scatter with regression line\nsns.regplot(x='study_hours', y='score', data=df)\n\`\`\`\n\n**When to use which:**\n- Matplotlib: Custom, precise control for publication figures\n- Seaborn: Quick, beautiful statistical visualizations\n- Plotly: Interactive, web-embeddable charts`,
        mcqs: [
          {
            question: "What does `sns.heatmap(df.corr(), annot=True)` visualize?",
            options: [
              "A geographic heatmap of the data",
              "A color-coded matrix of correlation coefficients between columns",
              "The frequency distribution of each column",
              "A heatmap of missing values in the DataFrame"
            ],
            answer: 1
          },
          {
            question: "What does the `kde=True` parameter in `sns.histplot()` add?",
            options: [
              "A key density encoding for categorical data",
              "A Kernel Density Estimate curve overlaid on the histogram",
              "A cumulative distribution function line",
              "Color encoding based on density values"
            ],
            answer: 1
          },
          {
            question: "When is Plotly preferred over Matplotlib for data visualization?",
            options: [
              "When you need the most customizable static figures",
              "When creating charts for academic papers",
              "When you need interactive, web-embeddable charts",
              "When working with geospatial data exclusively"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Statistical Analysis & Hypothesis Testing",
        description: `Data science requires rigorous statistical thinking. Understanding distributions, central tendency, and hypothesis testing separates good from great analysts.\n\n**Descriptive Statistics:**\n- **Mean**: Sum / Count (sensitive to outliers)\n- **Median**: Middle value (robust to outliers)\n- **Standard Deviation**: Average spread from mean\n- **Percentiles/Quartiles**: Distribution shape\n\n**Probability Distributions:**\n- **Normal**: Bell curve, defined by μ and σ\n- **Binomial**: Success/failure trials\n- **Poisson**: Count of events in fixed time\n\n**Hypothesis Testing:**\n1. Define H₀ (null) and H₁ (alternative)\n2. Choose significance level α (typically 0.05)\n3. Compute test statistic (t-test, z-test, chi-square)\n4. Compute p-value\n5. If p < α, reject H₀\n\n\`\`\`python\nfrom scipy import stats\nt_stat, p_value = stats.ttest_ind(group_a, group_b)\nprint(f\"p-value: {p_value:.4f}\")\n\`\`\``,
        mcqs: [
          {
            question: "Why is the median often preferred over the mean when data has outliers?",
            options: [
              "The median is always larger than the mean",
              "The median is robust to extreme values and isn't skewed by outliers",
              "The median is easier to compute mathematically",
              "The median includes all data points in its calculation"
            ],
            answer: 1
          },
          {
            question: "What does a p-value of 0.03 mean when the significance level α is 0.05?",
            options: [
              "There is a 3% probability that the null hypothesis is true",
              "The result is not statistically significant",
              "We reject the null hypothesis because p < α",
              "The effect size is 3% larger than expected"
            ],
            answer: 2
          },
          {
            question: "What type of test compares means between two independent groups?",
            options: ["Chi-square test", "ANOVA", "Independent samples t-test", "Pearson correlation"],
            answer: 2
          }
        ]
      },
      {
        title: "Machine Learning Pipeline Basics with Scikit-learn",
        description: `**scikit-learn** provides a consistent API for machine learning in Python. Its \`fit/predict/transform\` paradigm works uniformly across all algorithms.\n\n**The ML Pipeline:**\n1. Load & split data\n2. Preprocess (scale, encode)\n3. Train model\n4. Evaluate performance\n5. Tune hyperparameters\n\n\`\`\`python\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train)\nX_test = scaler.transform(X_test)\n\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\n\npredictions = model.predict(X_test)\nprint(f\"Accuracy: {accuracy_score(y_test, predictions):.2%}\")\n\`\`\`\n\n**Key Metrics:**\n- Accuracy, Precision, Recall, F1-Score (classification)\n- MAE, RMSE, R² (regression)`,
        mcqs: [
          {
            question: "Why do we call `scaler.fit_transform(X_train)` but only `scaler.transform(X_test)`?",
            options: [
              "It's a performance optimization for larger datasets",
              "The scaler must learn statistics only from training data to prevent data leakage",
              "X_test doesn't need normalization",
              "fit_transform is not available for test data"
            ],
            answer: 1
          },
          {
            question: "What metric is most appropriate for imbalanced classification datasets?",
            options: ["Accuracy", "Mean Squared Error", "F1-Score", "R-squared"],
            answer: 2
          },
          {
            question: "What does `test_size=0.2` mean in `train_test_split`?",
            options: [
              "20 samples are reserved for testing",
              "20% of the data is reserved for the test set",
              "The test split uses 20 random seeds",
              "80% of test features are selected"
            ],
            answer: 1
          }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 5. Next.js 15 App Router
  // ════════════════════════════════════════════════════════════════════════════
  {
    courseId: "5",
    topics: [
      {
        title: "Next.js App Router Structural Topology",
        description: `Next.js 15's App Router replaces the Pages Router with a file-system based routing system that maps directly to React Server Components.\n\n**Directory Structure:**\n\`\`\`\napp/\n├── layout.tsx          # Root layout (shared across all routes)\n├── page.tsx            # Homepage (/)\n├── about/\n│   └── page.tsx        # /about route\n├── blog/\n│   ├── [slug]/\n│   │   └── page.tsx    # /blog/:slug dynamic route\n│   └── layout.tsx      # Blog-specific layout\n└── (auth)/             # Route group (no URL segment)\n    ├── login/page.tsx\n    └── register/page.tsx\n\`\`\`\n\n**File Conventions:**\n- \`page.tsx\`: Publicly accessible route UI\n- \`layout.tsx\`: Shared UI wrapper (persists across navigations)\n- \`loading.tsx\`: Suspense loading state\n- \`error.tsx\`: Error boundary UI\n- \`not-found.tsx\`: 404 UI\n- \`route.ts\`: API endpoint handler`,
        mcqs: [
          {
            question: "What does a `layout.tsx` file do in Next.js App Router?",
            options: [
              "It defines CSS styles for the page",
              "It wraps pages with shared UI that persists across navigations",
              "It handles API requests at the layout level",
              "It configures the HTML head metadata for a route"
            ],
            answer: 1
          },
          {
            question: "What is the purpose of a Route Group `(auth)` in Next.js App Router?",
            options: [
              "It creates protected routes that require authentication",
              "It groups routes together without adding a URL segment",
              "It creates a nested API route handler",
              "It generates static pages for all routes in the group"
            ],
            answer: 1
          },
          {
            question: "What Next.js file convention handles 404 errors?",
            options: ["error.tsx", "fallback.tsx", "not-found.tsx", "404.tsx"],
            answer: 2
          }
        ]
      },
      {
        title: "Server Components vs Client Components",
        description: `The App Router's most fundamental concept: **by default, all components are Server Components**.\n\n**Server Components:**\n- Run only on the server — never shipped to the browser\n- Can directly access databases, file system, secrets\n- Zero JavaScript bundle size impact\n- Cannot use hooks (\`useState\`, \`useEffect\`) or browser APIs\n\n\`\`\`tsx\n// app/users/page.tsx — Server Component (no 'use client')\nasync function UsersPage() {\n  const users = await db.query('SELECT * FROM users');\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}\n\`\`\`\n\n**Client Components:**\nAdd \`'use client'\` directive at the top. Can use hooks, event handlers, browser APIs.\n\n\`\`\`tsx\n'use client';\nimport { useState } from 'react';\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}\n\`\`\`\n\n**Rule:** Only leaf components that need interactivity should be Client Components. Keep as much as possible on the server.`,
        mcqs: [
          {
            question: "What is the default component type in Next.js App Router?",
            options: [
              "Client Component",
              "Server Component",
              "Shared Component",
              "Hybrid Component"
            ],
            answer: 1
          },
          {
            question: "What directive marks a component as a Client Component in Next.js?",
            options: ["'use browser'", "'use client'", "'client only'", "'interactive'"],
            answer: 1
          },
          {
            question: "Which of the following can a Server Component do that a Client Component cannot?",
            options: [
              "Use useState and useEffect hooks",
              "Handle click events",
              "Directly query a database without an API layer",
              "Access browser localStorage"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Server Actions & Form Mutations Deep Dive",
        description: `**Server Actions** are async functions that run on the server, invoked directly from client components — eliminating the need for manual API route creation for mutations.\n\n**Defining a Server Action:**\n\`\`\`tsx\n// app/actions.ts\n'use server';\n\nexport async function createUser(formData: FormData) {\n  const name = formData.get('name') as string;\n  await db.insert({ table: 'users', values: { name } });\n  revalidatePath('/users'); // Refresh cached data\n}\n\`\`\`\n\n**Using in a Form:**\n\`\`\`tsx\n// Works without JavaScript! Progressive enhancement.\n<form action={createUser}>\n  <input name=\"name\" />\n  <button type=\"submit\">Create</button>\n</form>\n\`\`\`\n\n**Using with useFormState / useFormStatus:**\n\`\`\`tsx\n'use client';\nimport { useFormStatus } from 'react-dom';\nfunction SubmitButton() {\n  const { pending } = useFormStatus();\n  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;\n}\n\`\`\`\n\nServer Actions support **progressive enhancement** — they work even without JavaScript enabled.`,
        mcqs: [
          {
            question: "What directive marks a function as a Server Action?",
            options: ["'use server action'", "'server'", "'use server'", "'async server'"],
            answer: 2
          },
          {
            question: "What does `revalidatePath('/users')` do in a Server Action?",
            options: [
              "Redirects the user to the /users route",
              "Invalidates the cached data for the /users route, triggering a refetch",
              "Validates form data for the /users form",
              "Re-runs authentication checks for the /users page"
            ],
            answer: 1
          },
          {
            question: "What does `useFormStatus` provide in Next.js?",
            options: [
              "Validation state for form inputs",
              "The current user's session status",
              "A `pending` boolean indicating if the parent form action is submitting",
              "Error messages from server-side validation"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Hybrid Rendering with PPR & Static Exports",
        description: `Next.js 15 introduces **Partial Prerendering (PPR)** — a groundbreaking rendering mode that combines the best of static and dynamic rendering at the page level.\n\n**How PPR Works:**\nThe static shell of a page is generated at build time (fast, cacheable). Dynamic parts are wrapped in \`<Suspense>\` boundaries and streamed from the server at request time.\n\n\`\`\`tsx\n// next.config.ts\nexport default { experimental: { ppr: true } };\n\n// app/page.tsx\nimport { Suspense } from 'react';\nexport default function HomePage() {\n  return (\n    <>\n      <StaticHero />  {/* Served from CDN instantly */}\n      <Suspense fallback={<Skeleton />}>\n        <DynamicFeed /> {/* Streamed from server */}\n      </Suspense>\n    </>\n  );\n}\n\`\`\`\n\n**Static Export:**\nFor fully static sites with no server:\n\`\`\`ts\nexport const dynamic = 'force-static';\nexport const revalidate = 3600; // ISR: refresh every hour\n\`\`\`\n\n**Rendering Modes Summary:**\n- SSG (Static): Build-time, fastest\n- ISR (Incremental Static): Revalidates after interval\n- SSR: Per-request server rendering\n- PPR: Static shell + dynamic streaming`,
        mcqs: [
          {
            question: "What is Partial Prerendering (PPR) in Next.js 15?",
            options: [
              "A mode that partially pre-renders the first 50% of a page",
              "A rendering strategy that serves a static shell from CDN while streaming dynamic content",
              "A technique for pre-rendering only the above-the-fold content",
              "A build optimization that skips generating static pages for dynamic routes"
            ],
            answer: 1
          },
          {
            question: "What does `export const revalidate = 3600` do in a Next.js page?",
            options: [
              "Forces the page to always be server-rendered",
              "Generates the page statically and revalidates it every 3600 seconds (ISR)",
              "Sets a 3600ms timeout for server-side data fetching",
              "Caches API responses for 3600 requests"
            ],
            answer: 1
          },
          {
            question: "In PPR, what is the role of `<Suspense>` boundaries?",
            options: [
              "They mark components that should be excluded from the build",
              "They wrap dynamic sections that will be streamed from the server at request time",
              "They indicate components that require client-side rendering",
              "They define fallback routes for dynamic segments"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Route Handlers & Middleware Security API",
        description: `**Route Handlers** are Next.js's equivalent of API routes. They live in \`route.ts\` files and handle HTTP methods.\n\n\`\`\`ts\n// app/api/users/route.ts\nimport { NextRequest, NextResponse } from 'next/server';\n\nexport async function GET(request: NextRequest) {\n  const users = await db.getUsers();\n  return NextResponse.json(users);\n}\n\nexport async function POST(request: NextRequest) {\n  const body = await request.json();\n  const user = await db.createUser(body);\n  return NextResponse.json(user, { status: 201 });\n}\n\`\`\`\n\n**Middleware:**\nMiddleware runs on the Edge before requests reach route handlers. Perfect for auth guards, redirects, and A/B testing.\n\n\`\`\`ts\n// middleware.ts (root of project)\nimport { NextResponse } from 'next/server';\nexport function middleware(request: NextRequest) {\n  const token = request.cookies.get('session')?.value;\n  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {\n    return NextResponse.redirect(new URL('/login', request.url));\n  }\n  return NextResponse.next();\n}\nexport const config = { matcher: ['/dashboard/:path*'] };\n\`\`\``,
        mcqs: [
          {
            question: "Where do Route Handlers live in Next.js App Router?",
            options: [
              "In the `pages/api` directory",
              "In `route.ts` files within the `app` directory",
              "In the `middleware.ts` file at the project root",
              "In `handler.ts` files alongside page.tsx"
            ],
            answer: 1
          },
          {
            question: "What makes Next.js Middleware different from route handlers?",
            options: [
              "Middleware runs after the response is sent",
              "Middleware runs on the Edge before requests reach pages or API routes",
              "Middleware can only handle GET requests",
              "Middleware doesn't have access to request cookies"
            ],
            answer: 1
          },
          {
            question: "What does `NextResponse.next()` do in middleware?",
            options: [
              "Redirects to the next route in the matcher config",
              "Continues to the next middleware in the chain or the route handler",
              "Fetches data for the next page render",
              "Triggers a server-side re-render of the current page"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Advanced Caching & Tag-Based Revalidations",
        description: `Next.js 15's caching model is powerful but complex. Understanding it is essential for building fast, correct applications.\n\n**The Caching Layers:**\n1. **Request Memoization**: \`fetch()\` calls with the same URL/options are deduplicated within a single server render\n2. **Data Cache**: Persisted across requests and deployments. Opt-in via \`cache: 'force-cache'\`\n3. **Full Route Cache**: Statically rendered route HTML/RSC payload cached on CDN\n4. **Router Cache**: Client-side cache of route segments in the browser\n\n**On-Demand Revalidation:**\n\`\`\`ts\nimport { revalidateTag, revalidatePath } from 'next/cache';\n\n// Tag cache entries when fetching\nconst data = await fetch('/api/posts', { next: { tags: ['posts'] } });\n\n// Invalidate by tag in a Server Action or API route\nrevalidateTag('posts'); // Clears all data tagged 'posts'\n\`\`\`\n\n**Opting out of caching:**\n\`\`\`ts\nconst data = await fetch('/api/live', { cache: 'no-store' }); // Always fresh\n\`\`\``,
        mcqs: [
          {
            question: "What does `cache: 'force-cache'` do for a `fetch()` call in Next.js?",
            options: [
              "Forces the browser to cache the response",
              "Stores the response in Next.js's persistent Data Cache across requests",
              "Bypasses all caching layers",
              "Forces a CDN to cache the response for 1 hour"
            ],
            answer: 1
          },
          {
            question: "What does `revalidateTag('posts')` do?",
            options: [
              "Adds a 'posts' tag to all uncached routes",
              "Invalidates all cached data entries tagged with 'posts'",
              "Revalidates only the /posts route",
              "Forces the client router to refetch post data"
            ],
            answer: 1
          },
          {
            question: "What is Request Memoization in Next.js?",
            options: [
              "Caching responses persistently across multiple server requests",
              "Deduplicating identical fetch() calls within a single server render",
              "Storing API responses in Redis for reuse",
              "Caching static pages on the CDN between deployments"
            ],
            answer: 1
          }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 6. Microservices Architecture
  // ════════════════════════════════════════════════════════════════════════════
  {
    courseId: "6",
    topics: [
      {
        title: "Monolith to Microservice Decomposition Patterns",
        description: `Microservices decompose a monolithic application into small, independently deployable services. But decomposition strategy matters enormously.\n\n**Strangler Fig Pattern:**\nGradually replace monolith functionality. Build new features as microservices. Route traffic incrementally to new services until the monolith is "strangled" away.\n\n**Domain-Driven Design (DDD) Decomposition:**\nSplit services along **Bounded Contexts** — areas of the business with clear ownership and language. User Management, Order Processing, Inventory are natural bounded contexts.\n\n**Decompose by Business Capability:**\nOrganize services around what the business does, not the technical layers (not "database service" or "UI service").\n\n**Anti-patterns to avoid:**\n- **Nanoservices**: Services too small to be meaningful — high coordination overhead\n- **Distributed Monolith**: Services that are coupled through shared databases — worst of both worlds\n\n**Rule of thumb:** A service should be ownable by a small team (2-pizza rule). If it requires cross-team coordination to change, it's probably not properly bounded.`,
        mcqs: [
          {
            question: "What is the Strangler Fig pattern?",
            options: [
              "Shutting down the monolith immediately and migrating all functionality at once",
              "Gradually replacing monolith functionality with microservices while routing traffic incrementally",
              "Wrapping the entire monolith in a Docker container",
              "Using database migrations to split monolith tables into separate databases"
            ],
            answer: 1
          },
          {
            question: "What is a 'Distributed Monolith' anti-pattern?",
            options: [
              "A monolith deployed across multiple geographic regions",
              "Microservices that are tightly coupled through shared databases, providing no real independence",
              "A monolith that uses microservice-like internal modules",
              "Multiple services sharing a single deployment pipeline"
            ],
            answer: 1
          },
          {
            question: "What is a Bounded Context in Domain-Driven Design?",
            options: [
              "A limit on the size of a microservice codebase",
              "An area of the business with clear ownership, specific language, and well-defined boundaries",
              "A database schema shared between multiple services",
              "A network boundary enforced by an API gateway"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Inter-Service Communication Patterns",
        description: `Microservices must communicate. Choosing the right communication pattern is critical for performance and reliability.\n\n**Synchronous Communication:**\n- **REST**: Simple, widely understood. Use for request/response where immediate response needed.\n- **gRPC**: Binary protocol over HTTP/2. Strongly typed via Protocol Buffers. 10x faster than REST for internal services.\n\n**Asynchronous Communication:**\n- **Message Queues** (RabbitMQ): Service A sends message; Service B processes it later. Decoupling and resilience.\n- **Event Streaming** (Kafka): Events are published to topics; multiple consumers can subscribe.\n\n**When to use which:**\n| Pattern | Use When |\n|---|---|\n| REST | Public APIs, simple CRUD |\n| gRPC | High-throughput internal services |\n| Message Queue | Task delegation, fire-and-forget |\n| Event Streaming | Audit logs, multiple consumers, replay |`,
        mcqs: [
          {
            question: "What is the main advantage of gRPC over REST for internal microservice communication?",
            options: [
              "gRPC is simpler to implement than REST",
              "gRPC uses binary serialization (Protocol Buffers) over HTTP/2, making it significantly faster",
              "gRPC doesn't require any client libraries",
              "gRPC automatically generates database schemas"
            ],
            answer: 1
          },
          {
            question: "When is asynchronous message queue communication preferred over synchronous REST?",
            options: [
              "When you need an immediate response from the other service",
              "When services need to be decoupled and the caller doesn't need an immediate response",
              "When the payload is larger than 1MB",
              "When the services are deployed in the same container"
            ],
            answer: 1
          },
          {
            question: "What protocol does gRPC use for transport?",
            options: ["HTTP/1.1", "WebSocket", "HTTP/2", "TCP directly"],
            answer: 2
          }
        ]
      },
      {
        title: "Database-Per-Service Pattern",
        description: `One of the most important microservices principles: **each service owns its own database**. No service accesses another service's database directly.\n\n**Why database-per-service?**\n- Services can use the best DB technology for their needs (Postgres for orders, Redis for sessions, MongoDB for catalogs)\n- Independent deployments — schema changes don't break other services\n- Clear data ownership and security boundaries\n\n**The Challenge: Queries Across Services**\nYou can't do a SQL JOIN across service databases. Solutions:\n\n1. **API Composition**: API gateway calls multiple services and aggregates data in-memory.\n\n2. **CQRS (Command Query Responsibility Segregation)**: Maintain a separate read model (materialized view) that aggregates data from multiple services via events.\n\n3. **Saga Pattern**: For transactions that span multiple services (covered in next chapter).\n\n**Shared Database Anti-Pattern:**\nSharing a database couples services tightly — one service's schema change can break another service. This is the "Distributed Monolith" anti-pattern.`,
        mcqs: [
          {
            question: "What is the Database-Per-Service pattern?",
            options: [
              "Each microservice has its own dedicated database that no other service can directly access",
              "All microservices share a single database with separate schemas",
              "Each service uses a different database technology",
              "Services access databases through a shared ORM layer"
            ],
            answer: 0
          },
          {
            question: "What is CQRS?",
            options: [
              "A caching strategy for microservice APIs",
              "Separating read (query) and write (command) operations into different models",
              "A database sharding strategy for microservices",
              "A consistency protocol for distributed transactions"
            ],
            answer: 1
          },
          {
            question: "How does API Composition solve cross-service data aggregation?",
            options: [
              "It performs SQL JOINs across service databases",
              "An API gateway or aggregator calls multiple service APIs and combines the results",
              "Services share a read-only replica database for queries",
              "Event streaming automatically aggregates data into a shared store"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Saga Pattern & Distributed Transactions",
        description: `Distributed transactions across microservices are extremely hard. The **Saga Pattern** manages this by breaking a transaction into a sequence of local transactions with compensating transactions for rollback.\n\n**Choreography-Based Saga:**\nServices react to events. No central coordinator. Service A completes → emits event → Service B listens and proceeds.\n\n**Orchestration-Based Saga:**\nA central orchestrator tells each service what to do and manages the workflow.\n\n**Example: Order Processing Saga**\n1. Order Service: Create order → emit \`OrderCreated\`\n2. Payment Service: Charge customer → emit \`PaymentProcessed\`\n3. Inventory Service: Reserve items → emit \`InventoryReserved\`\n4. Shipping Service: Schedule delivery → emit \`ShipmentScheduled\`\n\n**Compensating Transactions (Rollback):**\nIf step 3 fails, Saga triggers:\n- \`RefundPayment\` (compensates step 2)\n- \`CancelOrder\` (compensates step 1)\n\n**Eventual Consistency:**\nSagas achieve *eventual* consistency — there may be brief moments of inconsistency during the transaction.`,
        mcqs: [
          {
            question: "What is the key difference between Choreography and Orchestration Sagas?",
            options: [
              "Choreography uses REST; Orchestration uses message queues",
              "Choreography: services react to events independently. Orchestration: a central coordinator directs services.",
              "Orchestration is faster; Choreography is more reliable",
              "Choreography is used for reads; Orchestration for writes"
            ],
            answer: 1
          },
          {
            question: "What is a compensating transaction in the Saga pattern?",
            options: [
              "A transaction that adds compensation/tip to financial transactions",
              "A rollback action that undoes a previous step if a later step fails",
              "A transaction that balances the load across services",
              "An audit log entry for distributed transactions"
            ],
            answer: 1
          },
          {
            question: "What consistency model do Sagas provide?",
            options: [
              "Strong consistency — all services are consistent at all times",
              "Eventual consistency — services may be briefly inconsistent but converge",
              "Causal consistency — operations maintain causal ordering",
              "Linearizability — all operations appear instantaneous"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Dockerizing Services & Kubernetes Orchestration",
        description: `Microservices shine when each service is packaged as a container and orchestrated by Kubernetes.\n\n**Dockerfile Best Practices:**\n\`\`\`dockerfile\n# Multi-stage build — small production image\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nEXPOSE 3000\nCMD [\"node\", \"dist/server.js\"]\n\`\`\`\n\n**Kubernetes Key Concepts:**\n- **Pod**: Smallest deployable unit (wraps containers)\n- **Deployment**: Manages Pod replicas, rolling updates\n- **Service**: Stable network endpoint for Pods\n- **Ingress**: HTTP routing and TLS termination\n- **ConfigMap / Secret**: Configuration and credentials injection\n- **HPA (Horizontal Pod Autoscaler)**: Auto-scale based on CPU/memory`,
        mcqs: [
          {
            question: "What is the purpose of a multi-stage Docker build?",
            options: [
              "To run multiple services in a single container",
              "To create a small production image by separating build and runtime dependencies",
              "To enable parallel container startup",
              "To cache Docker layers across different projects"
            ],
            answer: 1
          },
          {
            question: "What is a Kubernetes Deployment?",
            options: [
              "A single container instance in Kubernetes",
              "The process of pushing Docker images to a registry",
              "A Kubernetes resource that manages Pod replicas and handles rolling updates",
              "A network policy that controls traffic between services"
            ],
            answer: 2
          },
          {
            question: "What does a Kubernetes HPA (Horizontal Pod Autoscaler) do?",
            options: [
              "Automatically updates container images when new versions are available",
              "Automatically scales the number of Pod replicas based on metrics like CPU usage",
              "Horizontally partitions database storage across pods",
              "Routes traffic between pods based on load metrics"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "API Gateway Configuration",
        description: `The **API Gateway** is the single entry point for all client requests to the microservices backend. It handles cross-cutting concerns so individual services don't have to.\n\n**API Gateway Responsibilities:**\n- **Request Routing**: Route \`/orders/*\` to Order Service, \`/users/*\` to User Service\n- **Authentication**: Validate JWT tokens centrally — services get pre-authenticated requests\n- **Rate Limiting**: Protect services from abuse\n- **SSL Termination**: Handle HTTPS at the gateway; internal services use HTTP\n- **Load Balancing**: Distribute requests across service instances\n- **Response Transformation**: Aggregate multiple service responses into one\n- **Circuit Breaking**: Stop calling failing services, return fallbacks\n\n**Popular Gateways:**\n- **Kong**: Lua-based, plugin ecosystem, high performance\n- **AWS API Gateway**: Managed, serverless-friendly\n- **NGINX**: Reverse proxy + gateway capabilities\n- **Traefik**: Kubernetes-native, auto-discovery\n\n**Circuit Breaker Pattern:**\nIf a downstream service fails N times, the circuit "opens" — requests fail fast instead of waiting for timeouts.`,
        mcqs: [
          {
            question: "What is SSL termination at an API gateway?",
            options: [
              "Blocking SSL connections from untrusted clients",
              "Handling HTTPS decryption at the gateway so internal services communicate via HTTP",
              "Renewing SSL certificates automatically for all services",
              "Encrypting traffic between microservices"
            ],
            answer: 1
          },
          {
            question: "What does the Circuit Breaker pattern do when a downstream service is failing?",
            options: [
              "It retries the request with exponential backoff indefinitely",
              "It opens the circuit — requests fail fast and return a fallback instead of waiting for timeouts",
              "It reroutes requests to a different geographic region",
              "It scales up additional instances of the failing service"
            ],
            answer: 1
          },
          {
            question: "Why is centralized authentication at the API Gateway beneficial?",
            options: [
              "Individual services don't need to implement authentication logic separately",
              "It makes authentication faster by using specialized hardware",
              "It allows services to share user session data in memory",
              "It prevents clients from sending invalid HTTP headers"
            ],
            answer: 0
          }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 7. Machine Learning Fundamentals (id: "7")
  // ════════════════════════════════════════════════════════════════════════════
  {
    courseId: "7",
    topics: [
      {
        title: "Introduction to Machine Learning Paradigms",
        description: `Machine Learning is the science of making computers learn from data without being explicitly programmed.\n\n**Three Learning Paradigms:**\n\n**1. Supervised Learning:**\nTrain on labeled examples (input → output pairs). The algorithm learns a mapping function.\n- Examples: Email spam detection, house price prediction, image classification\n- Algorithms: Linear Regression, Decision Trees, SVM, Neural Networks\n\n**2. Unsupervised Learning:**\nFind patterns in unlabeled data. No ground truth provided.\n- Examples: Customer segmentation, anomaly detection, dimensionality reduction\n- Algorithms: K-Means, DBSCAN, PCA, Autoencoders\n\n**3. Reinforcement Learning:**\nAn agent learns by taking actions in an environment and receiving rewards/penalties.\n- Examples: Game AI (AlphaGo), robot control, recommendation systems\n- Algorithms: Q-Learning, PPO, Actor-Critic\n\n**The ML Workflow:**\nProblem Definition → Data Collection → EDA → Preprocessing → Modeling → Evaluation → Deployment`,
        mcqs: [
          {
            question: "What distinguishes supervised learning from unsupervised learning?",
            options: [
              "Supervised learning uses neural networks; unsupervised uses statistical methods",
              "Supervised learning trains on labeled data; unsupervised finds patterns in unlabeled data",
              "Supervised learning requires a GPU; unsupervised runs on CPU",
              "Supervised learning is for classification; unsupervised is for regression"
            ],
            answer: 1
          },
          {
            question: "Which type of ML does a game-playing AI use when it learns from wins and losses?",
            options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Semi-supervised Learning"],
            answer: 2
          },
          {
            question: "What is an example of an unsupervised learning task?",
            options: [
              "Predicting house prices from features",
              "Classifying emails as spam or not spam",
              "Grouping customers into segments based on purchase behavior",
              "Detecting objects in images using labeled training data"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Linear & Logistic Regression in Depth",
        description: `**Linear Regression** models the relationship between features and a continuous target variable.\n\n**Model:**\nŷ = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ\n\n**Cost Function (MSE):**\nJ(β) = (1/2m) Σ(ŷᵢ - yᵢ)²\n\n**Gradient Descent:**\nIteratively update weights to minimize cost:\nβⱼ := βⱼ - α × ∂J/∂βⱼ\n\n**Assumptions:** Linearity, homoscedasticity, no multicollinearity, independence.\n\n**Logistic Regression:**\nFor binary classification. Applies sigmoid function to linear output:\nσ(z) = 1 / (1 + e⁻ᶻ)\n\nOutput is probability (0-1). Threshold (e.g., 0.5) determines class label.\n\n**Log Loss (Cross-Entropy):**\nJ = -(1/m) Σ [yᵢ log(ŷᵢ) + (1-yᵢ) log(1-ŷᵢ)]\n\n**Regularization:**\n- L1 (Lasso): Promotes sparsity (some weights → 0)\n- L2 (Ridge): Shrinks all weights toward zero, prevents overfitting`,
        mcqs: [
          {
            question: "What is the purpose of the sigmoid function in logistic regression?",
            options: [
              "To make the model linear",
              "To squash the output to a probability between 0 and 1",
              "To apply L2 regularization",
              "To compute the gradient of the cost function"
            ],
            answer: 1
          },
          {
            question: "What does L1 regularization (Lasso) do to model weights?",
            options: [
              "Shrinks all weights proportionally toward zero",
              "Promotes sparsity by driving some weights exactly to zero",
              "Adds a penalty based on squared weight values",
              "Prevents gradient descent from converging"
            ],
            answer: 1
          },
          {
            question: "What is the cost function used to train linear regression?",
            options: [
              "Cross-entropy loss",
              "Hinge loss",
              "Mean Squared Error (MSE)",
              "Binary Cross-entropy"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Decision Trees, Random Forests & Gradient Boosting",
        description: `Tree-based models are among the most powerful and interpretable ML algorithms for tabular data.\n\n**Decision Tree:**\nSplits data at each node based on the feature that maximizes information gain (or minimizes Gini impurity). Pure leaf nodes = perfect predictions. High risk of overfitting.\n\n**Random Forest:**\nEnsemble of decision trees, each trained on a **bootstrap sample** of the data (bagging) with a random subset of features at each split. Final prediction = majority vote (classification) or mean (regression).\n\n**Key advantage:** Reduces variance through averaging — robust to overfitting.\n\n**Gradient Boosting (XGBoost, LightGBM):**\nBuilds trees **sequentially**. Each new tree corrects the residual errors of all previous trees. Uses gradient descent in function space.\n\n**Why Gradient Boosting wins competitions:**\n- Handles missing values natively\n- Works well on heterogeneous tabular data\n- Built-in regularization\n- Extremely efficient (LightGBM uses histogram-based splitting)\n\n**When to use:**\n- Random Forest: Quick baseline, feature importance\n- XGBoost/LightGBM: Best performance on structured data`,
        mcqs: [
          {
            question: "What is 'bagging' in the context of Random Forests?",
            options: [
              "Removing redundant features from training data",
              "Training each tree on a bootstrap sample (random sample with replacement) of the training data",
              "Aggregating predictions using weighted averaging",
              "Pruning decision tree nodes to prevent overfitting"
            ],
            answer: 1
          },
          {
            question: "How does Gradient Boosting differ from Random Forest in tree construction?",
            options: [
              "Gradient Boosting uses bagging; Random Forest uses boosting",
              "Random Forest builds trees in parallel; Gradient Boosting builds them sequentially to correct previous errors",
              "Gradient Boosting uses deeper trees; Random Forest uses shallow stumps",
              "They are identical except for the voting mechanism"
            ],
            answer: 1
          },
          {
            question: "What metric does a Decision Tree use to decide the best split?",
            options: [
              "Mean Squared Error at the leaf nodes",
              "Information Gain or Gini Impurity reduction",
              "Euclidean distance between data points",
              "Cosine similarity of feature vectors"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Model Evaluation, Overfitting & Cross-Validation",
        description: `A model that performs perfectly on training data but poorly on new data is **overfit**. Proper evaluation prevents this.\n\n**The Bias-Variance Tradeoff:**\n- **High Bias (Underfitting)**: Model too simple — misses patterns in both train and test\n- **High Variance (Overfitting)**: Model too complex — fits noise in training data\n- **Goal**: Find the sweet spot (low bias, low variance)\n\n**Cross-Validation (k-Fold):**\nSplit data into k folds. Train on k-1 folds, test on the remaining fold. Repeat k times. Average scores.\n\`\`\`python\nfrom sklearn.model_selection import cross_val_score\nscores = cross_val_score(model, X, y, cv=5)\nprint(f\"CV Score: {scores.mean():.2f} ± {scores.std():.2f}\")\n\`\`\`\n\n**Classification Metrics:**\n- **Precision**: TP / (TP + FP) — of predicted positives, how many are actually positive?\n- **Recall**: TP / (TP + FN) — of actual positives, how many did we find?\n- **F1**: Harmonic mean of Precision and Recall\n- **ROC-AUC**: Area under ROC curve (higher = better separation)`,
        mcqs: [
          {
            question: "What is overfitting in machine learning?",
            options: [
              "A model that takes too long to train",
              "A model that performs well on training data but poorly on unseen data due to learning noise",
              "A model that is too simple to capture patterns in the data",
              "A model that uses too many training epochs"
            ],
            answer: 1
          },
          {
            question: "What does k-fold cross-validation prevent?",
            options: [
              "The model from using all available data for training",
              "Overfitting to a specific train/test split, giving a more robust performance estimate",
              "The use of validation data during hyperparameter tuning",
              "Gradient descent from diverging"
            ],
            answer: 1
          },
          {
            question: "When is Recall more important than Precision?",
            options: [
              "When false positives are more costly than false negatives",
              "When false negatives are more costly than false positives (e.g., cancer detection)",
              "When the dataset is perfectly balanced",
              "When optimizing for overall accuracy"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Feature Engineering & Selection Mastery",
        description: `**Feature engineering** — creating the right input features — often has more impact on model performance than algorithm choice.\n\n**Numerical Feature Techniques:**\n- **Scaling**: StandardScaler (z-score), MinMaxScaler (0-1 range)\n- **Log Transform**: For right-skewed distributions\n- **Polynomial Features**: Capture non-linear relationships\n- **Binning**: Convert continuous to categorical (age groups)\n\n**Categorical Feature Encoding:**\n- **One-Hot Encoding**: Binary columns for each category (avoid for high cardinality)\n- **Label Encoding**: Integer codes (only for ordinal features)\n- **Target Encoding**: Replace category with target mean (powerful but prone to leakage)\n- **Embeddings**: For high-cardinality categoricals in neural networks\n\n**Feature Selection:**\n- **Filter Methods**: Correlation, mutual information (fast, model-agnostic)\n- **Wrapper Methods**: Recursive Feature Elimination (RFE) — expensive but accurate\n- **Embedded Methods**: Feature importance from tree models (efficient)\n\n**The Golden Rule:** Never include features that would leak target information from the future.`,
        mcqs: [
          {
            question: "Why should One-Hot Encoding be avoided for high-cardinality categorical features?",
            options: [
              "It is slower to compute than label encoding",
              "It creates an enormous number of sparse columns, increasing dimensionality significantly",
              "It can only handle binary categories",
              "It introduces multicollinearity into the feature set"
            ],
            answer: 1
          },
          {
            question: "What is target encoding?",
            options: [
              "Encoding the target variable as a binary label",
              "Replacing a categorical value with the mean of the target variable for that category",
              "Ordinal encoding based on the target's distribution",
              "Encoding features using the model's predicted targets"
            ],
            answer: 1
          },
          {
            question: "What is the 'golden rule' of feature engineering?",
            options: [
              "Always scale numerical features before training",
              "Never include features that leak target information from the future",
              "Use polynomial features for all regression problems",
              "Apply PCA before any tree-based model"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Neural Networks & Deep Learning Basics",
        description: `Deep learning uses multi-layered neural networks to learn hierarchical representations from raw data.\n\n**Anatomy of a Neural Network:**\n- **Input Layer**: Receives raw features\n- **Hidden Layers**: Transform data through weighted connections and activation functions\n- **Output Layer**: Produces predictions\n\n**Activation Functions:**\n- **ReLU**: max(0, x) — most common hidden layer activation. Solves vanishing gradient.\n- **Sigmoid**: Output ∈ (0,1) — use for binary classification output\n- **Softmax**: Converts outputs to probabilities summing to 1 — for multi-class\n\n**Backpropagation:**\nUse chain rule to compute gradients of loss w.r.t. each weight. Update weights via gradient descent.\n\n**Regularization:**\n- **Dropout**: Randomly zero out neurons during training (prevents co-adaptation)\n- **Batch Normalization**: Normalize activations within mini-batches (faster training)\n- **Weight Decay**: L2 regularization on weights\n\n**Frameworks:** PyTorch (research-friendly, dynamic graphs), TensorFlow/Keras (production-ready, static graphs)`,
        mcqs: [
          {
            question: "Why is ReLU preferred over sigmoid as a hidden layer activation function?",
            options: [
              "ReLU outputs a probability between 0 and 1",
              "ReLU solves the vanishing gradient problem and is computationally simple",
              "ReLU ensures all activations are normalized",
              "ReLU is the only activation function that supports backpropagation"
            ],
            answer: 1
          },
          {
            question: "What does Dropout regularization do during training?",
            options: [
              "Removes neurons with small weights from the network permanently",
              "Randomly sets a fraction of neuron activations to zero, preventing overfitting",
              "Reduces the learning rate when validation loss plateaus",
              "Normalizes neuron outputs within each mini-batch"
            ],
            answer: 1
          },
          {
            question: "What algorithm is used to train neural networks by computing gradients?",
            options: ["Forward propagation", "Backpropagation", "Stochastic gradient ascent", "Principal component analysis"],
            answer: 1
          }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 8. Android Compose (id: "8")
  // ════════════════════════════════════════════════════════════════════════════
  {
    courseId: "8",
    topics: [
      {
        title: "Jetpack Compose Fundamentals",
        description: `**Jetpack Compose** is Android's modern declarative UI toolkit — UI is described as functions of state, and Compose automatically updates the UI when state changes.\n\n**The Mental Model:**\n\`\`\`kotlin\n@Composable\nfun Greeting(name: String) {\n    Text(text = \"Hello, $name!\")\n}\n\`\`\`\n\nCompose functions are annotated with \`@Composable\`. They describe what the UI should look like given the current state, not how to mutate it.\n\n**Key Principles:**\n- **Declarative**: Describe the UI for each state; Compose figures out updates\n- **Unidirectional Data Flow**: State flows down; events flow up\n- **Recomposition**: When state changes, affected composables automatically recompose\n\n**Basic Building Blocks:**\n- \`Text\`, \`Button\`, \`Image\` — basic UI elements\n- \`Column\`, \`Row\`, \`Box\` — layout containers\n- \`LazyColumn\`, \`LazyRow\` — efficient scrolling lists\n- \`Scaffold\` — standard Material layout structure (TopBar, BottomBar, FAB)`,
        mcqs: [
          {
            question: "What annotation marks a function as a Jetpack Compose UI component?",
            options: ["@Component", "@UI", "@Composable", "@View"],
            answer: 2
          },
          {
            question: "What is recomposition in Jetpack Compose?",
            options: [
              "Recreating the entire Activity when state changes",
              "Automatically re-running affected Composable functions when their state inputs change",
              "Rebuilding the entire Compose tree on every frame",
              "Combining multiple composables into a single rendering pass"
            ],
            answer: 1
          },
          {
            question: "Which Compose component should you use for a large scrollable list?",
            options: ["Column", "Box", "LazyColumn", "ScrollableRow"],
            answer: 2
          }
        ]
      },
      {
        title: "State Management in Compose",
        description: `State is the engine of Compose UIs. Understanding how to manage it correctly is essential for building correct, performant apps.\n\n**remember and mutableStateOf:**\n\`\`\`kotlin\n@Composable\nfun Counter() {\n    var count by remember { mutableStateOf(0) }\n    Button(onClick = { count++ }) {\n        Text(\"Count: $count\")\n    }\n}\n\`\`\`\n\n- \`mutableStateOf\`: Creates observable state\n- \`remember\`: Retains state across recompositions (but not configuration changes)\n- \`rememberSaveable\`: Survives configuration changes (screen rotation)\n\n**State Hoisting:**\nMove state up to the parent to make composables stateless and reusable.\n\n**ViewModel for screen-level state:**\n\`\`\`kotlin\n@HiltViewModel\nclass HomeViewModel @Inject constructor() : ViewModel() {\n    var count by mutableStateOf(0)\n        private set\n    fun increment() { count++ }\n}\n\`\`\`\n\nScreens collect ViewModel state and pass it down as parameters.`,
        mcqs: [
          {
            question: "What is the difference between `remember` and `rememberSaveable`?",
            options: [
              "remember is faster; rememberSaveable uses the disk",
              "remember survives recompositions; rememberSaveable additionally survives configuration changes",
              "rememberSaveable is only for saving to a database",
              "They are identical — `rememberSaveable` is just a newer API name"
            ],
            answer: 1
          },
          {
            question: "What is State Hoisting in Jetpack Compose?",
            options: [
              "Moving state into a database for persistence",
              "Lifting state up to the parent composable to make child composables stateless and reusable",
              "Caching state in a ViewModel to survive process death",
              "Sharing state between multiple screens using a SharedViewModel"
            ],
            answer: 1
          },
          {
            question: "Why should screen-level UI state be stored in a ViewModel rather than in `remember`?",
            options: [
              "ViewModels are faster than in-composition state",
              "ViewModels survive configuration changes (like rotation) and separate UI state from UI logic",
              "The `remember` API doesn't support complex data types",
              "ViewModels automatically synchronize state across multiple screens"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Navigation in Compose with NavController",
        description: `**Jetpack Navigation Compose** provides type-safe navigation between screens using a NavController.\n\n**Setup:**\n\`\`\`kotlin\n// build.gradle\nimplementation(\"androidx.navigation:navigation-compose:2.7.7\")\n\`\`\`\n\n**NavHost definition:**\n\`\`\`kotlin\n@Composable\nfun AppNavGraph() {\n    val navController = rememberNavController()\n    NavHost(navController, startDestination = \"home\") {\n        composable(\"home\") { HomeScreen(navController) }\n        composable(\"profile/{userId}\") { backStack ->\n            val userId = backStack.arguments?.getString(\"userId\")\n            ProfileScreen(userId)\n        }\n    }\n}\n\`\`\`\n\n**Navigation with arguments:**\n\`\`\`kotlin\n// Navigate to profile\nnavController.navigate(\"profile/$userId\")\n\`\`\`\n\n**Deep Links:** Configure NavHost to respond to Intent deep links from external apps or notifications.\n\n**Back Stack Management:**\n- \`popBackStack()\`: Go back one screen\n- \`popUpTo(\"home\") { inclusive = true }\`: Clear to root`,
        mcqs: [
          {
            question: "What does `rememberNavController()` do in Jetpack Compose Navigation?",
            options: [
              "Creates a persistent navigation state that survives process death",
              "Creates and remembers a NavController for managing navigation state",
              "Automatically generates navigation routes from composable names",
              "Registers all navigation destinations at app startup"
            ],
            answer: 1
          },
          {
            question: "How do you pass a userId argument in Compose Navigation?",
            options: [
              "Using a shared ViewModel between composables",
              "Defining the route as `\"profile/{userId}\"` and navigating to `\"profile/$userId\"`",
              "Passing it as a parameter to the NavHost composable",
              "Using a Bundle as in traditional Fragment navigation"
            ],
            answer: 1
          },
          {
            question: "What does `popUpTo(\"home\") { inclusive = true }` do?",
            options: [
              "Adds a popup dialog above the home screen",
              "Clears the back stack including the home destination itself",
              "Navigates to home and adds it to the back stack again",
              "Marks all screens up to home as excluded from the back stack"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Coroutines & Flow for Async Android",
        description: `Android apps are heavily asynchronous. **Kotlin Coroutines** and **Flow** are the modern tools for managing this.\n\n**Coroutines Basics:**\n\`\`\`kotlin\n// In a ViewModel:\nviewModelScope.launch {\n    val users = repository.getUsers()  // suspend function\n    _uiState.value = UiState.Success(users)\n}\n\`\`\`\n\n**Dispatchers:**\n- \`Dispatchers.Main\`: UI updates\n- \`Dispatchers.IO\`: Network calls, file operations\n- \`Dispatchers.Default\`: CPU-intensive work\n\n**Flow:**\nCold stream — starts emitting only when collected. Used for data streams from databases, sensors, events.\n\n\`\`\`kotlin\n// Room DAO returns Flow automatically:\n@Query(\"SELECT * FROM users\")\nfun getAllUsers(): Flow<List<User>>\n\n// Collect in ViewModel:\nrepository.users.collect { users ->\n    _uiState.value = UiState.Success(users)\n}\n\`\`\`\n\n**StateFlow:**\nHot stream. Always has a current value. Perfect for UI state.\n\n**collectAsState() in Compose:**\n\`\`\`kotlin\nval uiState by viewModel.uiState.collectAsStateWithLifecycle()\n\`\`\``,
        mcqs: [
          {
            question: "What is `viewModelScope` used for in Android?",
            options: [
              "Scoping database queries to the ViewModel",
              "A CoroutineScope that automatically cancels when the ViewModel is destroyed",
              "Limiting the ViewModel's access to certain Android permissions",
              "Providing a lifecycle-aware context for the ViewModel"
            ],
            answer: 1
          },
          {
            question: "What Dispatcher should you use for network calls in Kotlin Coroutines?",
            options: ["Dispatchers.Main", "Dispatchers.Default", "Dispatchers.IO", "Dispatchers.Unconfined"],
            answer: 2
          },
          {
            question: "What is the difference between Flow and StateFlow?",
            options: [
              "Flow is hot (always active); StateFlow is cold (only active when collected)",
              "Flow is cold (starts on collection); StateFlow is hot (always has a current value)",
              "StateFlow is for UI; Flow is for database operations only",
              "They are identical with different API names"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Dependency Injection with Hilt",
        description: `**Hilt** is Android's recommended dependency injection framework, built on Dagger. It eliminates the need to manually create and manage object graphs.\n\n**Setup:**\n\`\`\`kotlin\n@HiltAndroidApp\nclass MyApp : Application()\n\`\`\`\n\n**Inject a ViewModel:**\n\`\`\`kotlin\n@HiltViewModel\nclass HomeViewModel @Inject constructor(\n    private val repository: UserRepository\n) : ViewModel()\n\n// In a Composable:\n@Composable\nfun HomeScreen(viewModel: HomeViewModel = hiltViewModel()) {\n    // viewModel automatically injected by Hilt\n}\n\`\`\`\n\n**Defining a Module:**\n\`\`\`kotlin\n@Module\n@InstallIn(SingletonComponent::class)\nobject NetworkModule {\n    @Provides\n    @Singleton\n    fun provideRetrofit(): Retrofit = Retrofit.Builder()\n        .baseUrl(BASE_URL)\n        .build()\n}\n\`\`\`\n\n**Scopes:**\n- \`@Singleton\`: One instance per app lifetime\n- \`@ActivityScoped\`: One per Activity\n- \`@ViewModelScoped\`: One per ViewModel`,
        mcqs: [
          {
            question: "What annotation marks a ViewModel for Hilt injection?",
            options: ["@Injectable", "@Component", "@HiltViewModel", "@Provide"],
            answer: 2
          },
          {
            question: "What does `@Singleton` scope mean in Hilt?",
            options: [
              "The dependency is created anew for every injection point",
              "One instance of the dependency exists per Activity",
              "One instance of the dependency exists for the entire app lifetime",
              "The dependency is stored in a singleton database"
            ],
            answer: 2
          },
          {
            question: "What annotation marks an Application class for Hilt to generate the app's dependency graph?",
            options: ["@HiltApp", "@HiltApplication", "@HiltAndroidApp", "@ApplicationComponent"],
            answer: 2
          }
        ]
      },
      {
        title: "Room Database & Repository Pattern",
        description: `**Room** is Android's SQLite abstraction library that provides compile-time SQL verification.\n\n**Three Components:**\n\n**1. Entity (Database Table):**\n\`\`\`kotlin\n@Entity(tableName = \"users\")\ndata class User(\n    @PrimaryKey val id: Int,\n    val name: String,\n    val email: String\n)\n\`\`\`\n\n**2. DAO (Data Access Object):**\n\`\`\`kotlin\n@Dao\ninterface UserDao {\n    @Query(\"SELECT * FROM users\")\n    fun getAll(): Flow<List<User>>\n    \n    @Insert(onConflict = OnConflictStrategy.REPLACE)\n    suspend fun insert(user: User)\n    \n    @Delete\n    suspend fun delete(user: User)\n}\n\`\`\`\n\n**3. Database:**\n\`\`\`kotlin\n@Database(entities = [User::class], version = 1)\nabstract class AppDatabase : RoomDatabase() {\n    abstract fun userDao(): UserDao\n}\n\`\`\`\n\n**Repository Pattern:**\nAbstracts data sources (Room, network). ViewModel talks to Repository, not DAO directly.`,
        mcqs: [
          {
            question: "What does `@Entity` annotation do in Room?",
            options: [
              "Marks a class as an injectable dependency",
              "Marks a data class as a database table definition",
              "Creates a DAO interface for the class",
              "Defines a relationship between two tables"
            ],
            answer: 1
          },
          {
            question: "Why does a Room DAO query return `Flow<List<User>>` instead of `List<User>`?",
            options: [
              "Flow is faster than synchronous list returns",
              "Flow automatically emits updated lists whenever the database changes",
              "Room requires Flow for all multi-row queries",
              "Flow prevents blocking the main thread"
            ],
            answer: 1
          },
          {
            question: "What is the purpose of the Repository pattern in Android architecture?",
            options: [
              "To store data in a version control repository",
              "To abstract data sources (database, network) so the ViewModel doesn't need to know the origin",
              "To cache ViewModel instances across configuration changes",
              "To provide type-safe API calls using Retrofit"
            ],
            answer: 1
          }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 9. AI Prompt Engineering (id: "9")
  // ════════════════════════════════════════════════════════════════════════════
  {
    courseId: "9",
    topics: [
      {
        title: "Foundations of Large Language Models",
        description: `**Large Language Models (LLMs)** are neural networks trained on vast amounts of text data to predict the next token. Understanding how they work helps you prompt them more effectively.\n\n**The Transformer Architecture:**\n- **Self-Attention**: Each token "attends" to all other tokens to understand context\n- **Multi-Head Attention**: Multiple attention heads capture different relationships\n- **Feed-Forward Layers**: Process attention outputs through dense transformations\n\n**Key Concepts:**\n- **Tokens**: LLMs don't process words — they process tokens (roughly 3/4 of a word on average)\n- **Context Window**: Maximum tokens the model can process at once (GPT-4: 128K, Claude: 200K)\n- **Temperature**: Controls randomness. 0 = deterministic, 1 = creative, >1 = chaotic\n- **Top-p (nucleus) sampling**: Sample from the smallest set of tokens whose probability exceeds p\n\n**How Training Works:**\n1. Pre-training on massive web corpus (unsupervised)\n2. Instruction fine-tuning on curated Q&A pairs (supervised)\n3. RLHF (Reinforcement Learning from Human Feedback) for alignment`,
        mcqs: [
          {
            question: "What does 'temperature' control in LLM generation?",
            options: [
              "The speed of token generation",
              "The computational temperature of the GPU during inference",
              "The randomness/creativity of the model's outputs",
              "The maximum length of the generated response"
            ],
            answer: 2
          },
          {
            question: "What is a 'context window' in an LLM?",
            options: [
              "The browser window where prompts are entered",
              "The maximum number of tokens the model can process as input at once",
              "The window of time during which a model's output is cached",
              "The attention span of a single transformer head"
            ],
            answer: 1
          },
          {
            question: "What is RLHF used for in LLM training?",
            options: [
              "Reducing the model's computational requirements",
              "Aligning the model's outputs to human preferences through human feedback",
              "Generating synthetic training data automatically",
              "Removing biases from the pre-training corpus"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Prompt Design Principles & Patterns",
        description: `Effective prompting is about communication precision. LLMs are powerful but literal — they do exactly what you ask.\n\n**Core Principles:**\n\n**1. Be Specific and Explicit:**\n❌ "Write a summary"\n✅ "Write a 3-sentence executive summary of the following article, targeting a non-technical C-suite audience"\n\n**2. Provide Context:**\nInclude role, goal, audience, format, and constraints.\n\n**3. Show Examples (Few-Shot):**\nProvide 2-3 examples of the desired output format before your actual request.\n\n**4. Break Complex Tasks:**\nSplit multi-step tasks into sequential prompts. Chain outputs together.\n\n**Key Prompt Patterns:**\n- **Persona Pattern**: "Act as a senior software architect reviewing this PR"\n- **Few-Shot Pattern**: Provide examples of input → output pairs\n- **Chain-of-Thought (CoT)**: "Think step by step before answering"\n- **Tree of Thought (ToT)**: Explore multiple reasoning paths\n- **ReAct**: Interleave reasoning and action steps\n\n**Format Specification:**\nSpecify output format explicitly: JSON, Markdown table, numbered list, CSV, etc.`,
        mcqs: [
          {
            question: "What is Chain-of-Thought (CoT) prompting?",
            options: [
              "Chaining multiple API calls together",
              "Prompting the model to show its reasoning step-by-step before giving the final answer",
              "Using a chain of different LLM models for a task",
              "Providing a chain of examples from hardest to easiest"
            ],
            answer: 1
          },
          {
            question: "What is Few-Shot prompting?",
            options: [
              "Prompting with as few words as possible",
              "Providing 2-3 examples of the desired input-output format in the prompt",
              "Using the model with a low temperature for precise outputs",
              "Firing multiple API calls simultaneously"
            ],
            answer: 1
          },
          {
            question: "Why is specificity important in prompt design?",
            options: [
              "LLMs generate faster with specific prompts",
              "LLMs are literal — vague prompts lead to generic, often incorrect outputs",
              "Specific prompts use fewer tokens, reducing cost",
              "LLMs have word filters that block vague language"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Advanced Reasoning & CoT Techniques",
        description: `Advanced prompting techniques dramatically improve LLM reasoning quality for complex tasks.\n\n**Zero-Shot Chain-of-Thought:**\nSimply adding "Let's think step by step" to a prompt significantly improves reasoning:\n\n> Q: Roger has 5 tennis balls. He buys 2 more cans of 3 balls each. How many does he have?\n> Let's think step by step.\n\n**Tree of Thoughts (ToT):**\nAsks the model to explore multiple solution paths, evaluate them, and backtrack if needed — like a search algorithm applied to reasoning.\n\n**Self-Consistency:**\nGenerate multiple independent chain-of-thought responses and take the majority answer. Reduces reasoning errors.\n\n**Least-to-Most Prompting:**\nBreak a hard problem into easier sub-problems and solve them sequentially.\n\n**Structured Output Techniques:**\n\`\`\`\nAnalyze this code bug. Format your response as:\n{\n  \"root_cause\": \"...\",\n  \"affected_files\": [...],\n  \"fix\": \"...\",\n  \"prevention\": \"...\"\n}\n\`\`\`\n\n**Prompt Injection Awareness:**\nMalicious user inputs can override system prompts. Always sanitize user inputs in production AI applications.`,
        mcqs: [
          {
            question: "What does 'Self-Consistency' prompting do to improve accuracy?",
            options: [
              "Ensures the model stays consistent with previous answers",
              "Generates multiple independent reasoning chains and takes the majority answer",
              "Forces the model to check its own work for errors",
              "Uses a secondary model to validate the primary model's outputs"
            ],
            answer: 1
          },
          {
            question: "What is Prompt Injection?",
            options: [
              "Optimizing prompts by adding additional context",
              "A security attack where malicious user input overrides system-level instructions",
              "Injecting variables into prompt templates dynamically",
              "Adding few-shot examples to improve prompt quality"
            ],
            answer: 1
          },
          {
            question: "What is the key idea behind Least-to-Most prompting?",
            options: [
              "Starting with the hardest sub-task and working down to easier ones",
              "Breaking complex problems into simpler sub-problems solved sequentially",
              "Using the minimum number of tokens possible per prompt",
              "Prioritizing shorter responses over detailed explanations"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "RAG (Retrieval-Augmented Generation)",
        description: `**RAG** combines the generative power of LLMs with the precision of retrieval systems — solving the hallucination and knowledge cutoff problems.\n\n**How RAG Works:**\n1. User asks a question\n2. Query is converted to an **embedding** (dense vector)\n3. Embeddings search a **vector database** for similar documents\n4. Retrieved context + original query sent to LLM\n5. LLM generates an answer grounded in retrieved facts\n\n**Why RAG Beats Fine-Tuning for Knowledge:**\n- No retraining required for new information\n- Citations and source attribution are possible\n- Works with private/enterprise data\n\n**Key Components:**\n- **Embeddings**: Dense numerical representations of text (OpenAI Ada, Cohere, BGE)\n- **Vector Databases**: Pinecone, Weaviate, pgvector, Qdrant, Chroma\n- **Chunking Strategy**: How you split documents into retrievable units\n- **Reranking**: Use a cross-encoder to rerank retrieved candidates before LLM\n\n**Advanced RAG Patterns:**\n- **HyDE**: Generate a hypothetical document, use its embedding for retrieval\n- **Multi-Query**: Generate multiple query reformulations for better recall`,
        mcqs: [
          {
            question: "What problem does RAG primarily solve?",
            options: [
              "Slow inference speed in large language models",
              "LLM hallucinations and outdated knowledge cutoffs by grounding answers in retrieved documents",
              "The high cost of fine-tuning LLMs on domain-specific data",
              "Prompt injection security vulnerabilities"
            ],
            answer: 1
          },
          {
            question: "What is a vector database used for in a RAG system?",
            options: [
              "Storing the LLM model weights",
              "Storing prompt templates for different use cases",
              "Storing document embeddings for fast similarity search",
              "Caching LLM API responses to reduce costs"
            ],
            answer: 2
          },
          {
            question: "What is the 'chunking strategy' in RAG?",
            options: [
              "How API rate limiting is applied to retrieval queries",
              "The method of splitting documents into smaller, retrievable text units",
              "The way vector search results are batched before sending to the LLM",
              "A technique for compressing embeddings to save storage"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Fine-Tuning LLMs for Specific Domains",
        description: `**Fine-tuning** adapts a pre-trained LLM to a specific task or domain using supervised examples.\n\n**When to Fine-Tune:**\n- You need a specific output style/format consistently\n- You have a unique domain with specialized terminology\n- Prompt-based approaches are too inconsistent\n- You want to reduce inference costs (smaller fine-tuned model vs. large prompted model)\n\n**Fine-Tuning Techniques:**\n\n**Full Fine-Tuning:**\nUpdate all model weights. Most powerful but requires significant GPU resources.\n\n**LoRA (Low-Rank Adaptation):**\nAdd small trainable "adapter" matrices to frozen base model layers. Only a fraction of parameters trained — 100x more efficient.\n\n\`\`\`python\nfrom peft import LoraConfig, get_peft_model\nconfig = LoraConfig(r=8, lora_alpha=32, target_modules=[\"q\", \"v\"])\nmodel = get_peft_model(base_model, config)\n\`\`\`\n\n**QLoRA:**\nQuantize the base model to 4-bit, then apply LoRA. Fine-tune 7B models on a single consumer GPU.\n\n**Dataset Requirements:**\n- High quality > high quantity\n- Diverse examples covering edge cases\n- Consistent format (instruction + input + output)\n- 1K-100K examples depending on task complexity`,
        mcqs: [
          {
            question: "What is LoRA (Low-Rank Adaptation)?",
            options: [
              "A technique that fine-tunes all model weights with low learning rates",
              "Adding small trainable adapter matrices to frozen model layers, training only a fraction of parameters",
              "A method for reducing the context window during fine-tuning",
              "A data augmentation technique for LLM training datasets"
            ],
            answer: 1
          },
          {
            question: "What does QLoRA add to the LoRA technique?",
            options: [
              "Quantized query attention for faster fine-tuning",
              "Quantizing the base model to 4-bit to enable fine-tuning on consumer GPUs",
              "Quality scoring of training examples during fine-tuning",
              "Queue-based batch processing for large datasets"
            ],
            answer: 1
          },
          {
            question: "When should you choose fine-tuning over prompt engineering?",
            options: [
              "When you want to give the model access to recent information",
              "When you need consistent output style/format and domain-specific knowledge that prompting alone can't achieve",
              "When you need to reduce the model's context window",
              "Fine-tuning is always preferred over prompt engineering"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Building AI Agents & Tool Use",
        description: `**AI Agents** are LLMs that can take actions — browse the web, execute code, call APIs, and manage files — to complete complex, multi-step tasks.\n\n**ReAct Framework (Reasoning + Acting):**\nThe agent alternates between:\n1. **Thought**: Reason about what to do\n2. **Action**: Call a tool\n3. **Observation**: Receive tool output\n4. Repeat until task complete\n\n**Tool Use with Function Calling:**\n\`\`\`python\ntools = [{\n    \"name\": \"search_web\",\n    \"description\": \"Search the internet for current information\",\n    \"parameters\": {\n        \"query\": {\"type\": \"string\", \"description\": \"Search query\"}\n    }\n}]\n\nresponse = client.chat.completions.create(\n    model=\"gpt-4\",\n    messages=messages,\n    tools=tools\n)\n\`\`\`\n\n**Agent Frameworks:**\n- **LangChain**: Comprehensive agent toolkit with many integrations\n- **LlamaIndex**: Optimized for RAG + agent workflows\n- **CrewAI**: Multi-agent collaboration framework\n- **AutoGen**: Microsoft's multi-agent conversation framework\n\n**Safety Considerations:**\n- Sandbox code execution environments\n- Limit agent permissions (least privilege)\n- Human-in-the-loop for critical actions`,
        mcqs: [
          {
            question: "What is the ReAct framework for AI agents?",
            options: [
              "A React.js framework for building AI chat interfaces",
              "An interleaved Reasoning + Acting loop where the agent thinks, acts with tools, and observes results",
              "A reinforcement learning algorithm for training agents",
              "A retrieval augmented generation framework"
            ],
            answer: 1
          },
          {
            question: "What does 'Function Calling' enable in LLM APIs?",
            options: [
              "Calling Python functions from within the LLM's training process",
              "Structuring the LLM's output to invoke predefined tools with specific parameters",
              "Calling multiple LLMs in parallel to compare outputs",
              "Defining custom activation functions for the model"
            ],
            answer: 1
          },
          {
            question: "What security principle should guide agent tool permissions?",
            options: [
              "Maximum privilege to enable all possible tasks",
              "Least privilege — grant only the minimum permissions necessary for the task",
              "Agents should only use read-only tools",
              "All agent actions should be encrypted end-to-end"
            ],
            answer: 1
          }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 10. SQL & Database Mastery (id: "10")
  // ════════════════════════════════════════════════════════════════════════════
  {
    courseId: "10",
    topics: [
      {
        title: "Relational Database Foundations",
        description: `Relational databases organize data into tables with defined relationships. Understanding the foundations is essential before diving into optimization.\n\n**Core Concepts:**\n- **Table (Relation)**: A collection of rows (tuples) with defined columns (attributes)\n- **Primary Key**: Uniquely identifies each row. Cannot be null.\n- **Foreign Key**: References the primary key of another table. Enforces referential integrity.\n- **Constraints**: Rules enforced by the database (NOT NULL, UNIQUE, CHECK, DEFAULT)\n\n**Normalization:**\nReduces data redundancy and inconsistency.\n- **1NF**: Atomic values, no repeating groups\n- **2NF**: 1NF + no partial dependencies on composite keys\n- **3NF**: 2NF + no transitive dependencies\n- **BCNF**: Stronger version of 3NF\n\n**ACID Properties:**\n- **Atomicity**: Transaction is all-or-nothing\n- **Consistency**: Database transitions between valid states\n- **Isolation**: Concurrent transactions appear sequential\n- **Durability**: Committed data survives failures`,
        mcqs: [
          {
            question: "What does a Foreign Key enforce in a relational database?",
            options: [
              "Uniqueness of values in a column",
              "Referential integrity — the value must exist in the referenced table's primary key",
              "The order of columns in a table",
              "That a column cannot contain null values"
            ],
            answer: 1
          },
          {
            question: "What does ACID 'Atomicity' guarantee?",
            options: [
              "Each column stores only atomic (indivisible) values",
              "A transaction either completes entirely or has no effect at all",
              "Transactions are isolated from concurrent operations",
              "Data persists even after a system crash"
            ],
            answer: 1
          },
          {
            question: "What does Third Normal Form (3NF) require beyond 2NF?",
            options: [
              "All columns must have atomic values",
              "No partial dependencies on composite keys",
              "No transitive dependencies (non-key attributes must depend directly on the primary key)",
              "All tables must have a single-column primary key"
            ],
            answer: 2
          }
        ]
      },
      {
        title: "Advanced SQL Queries & Window Functions",
        description: `Mastering SQL means going beyond basic CRUD. Advanced queries unlock powerful data analysis capabilities.\n\n**JOINs:**\n\`\`\`sql\n-- INNER JOIN: only matching rows\nSELECT u.name, o.total\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;\n\n-- LEFT JOIN: all users, even without orders\nSELECT u.name, COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id;\n\`\`\`\n\n**Window Functions (Game-Changer!):**\n\`\`\`sql\n-- Rank users by sales within each department\nSELECT\n    name,\n    department,\n    sales,\n    RANK() OVER (PARTITION BY department ORDER BY sales DESC) as dept_rank,\n    SUM(sales) OVER (PARTITION BY department) as dept_total,\n    LAG(sales) OVER (ORDER BY date) as prev_month_sales\nFROM employees;\n\`\`\`\n\n**CTEs (Common Table Expressions):**\n\`\`\`sql\nWITH top_customers AS (\n    SELECT user_id, SUM(total) as lifetime_value\n    FROM orders\n    GROUP BY user_id\n    HAVING SUM(total) > 10000\n)\nSELECT u.name, tc.lifetime_value\nFROM top_customers tc\nJOIN users u ON tc.user_id = u.id;\n\`\`\``,
        mcqs: [
          {
            question: "What is the difference between `RANK()` and `DENSE_RANK()` window functions?",
            options: [
              "RANK() starts from 0; DENSE_RANK() starts from 1",
              "RANK() leaves gaps after ties (1,1,3); DENSE_RANK() doesn't (1,1,2)",
              "They are identical in behavior",
              "DENSE_RANK() is only available in PostgreSQL"
            ],
            answer: 1
          },
          {
            question: "What does `PARTITION BY` do in a window function?",
            options: [
              "Splits the table into separate physical partitions",
              "Defines groups within which the window function calculation is performed independently",
              "Filters rows before the window function is applied",
              "Sorts results within each window frame"
            ],
            answer: 1
          },
          {
            question: "What is a CTE (Common Table Expression) used for?",
            options: [
              "Creating permanent table views in the database",
              "Defining a temporary named result set within a query for better readability and reuse",
              "Caching query results across multiple sessions",
              "Creating transaction-safe temporary tables"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Database Indexing & Query Optimization",
        description: `Slow queries are one of the most common performance problems. Proper indexing is the solution.\n\n**How Indexes Work:**\nAn index is a separate data structure (usually a B-Tree) that stores column values with pointers to the full rows. Instead of scanning every row (full table scan), queries can use the index for O(log n) lookups.\n\n**Types of Indexes:**\n- **B-Tree**: Default. Good for equality and range queries (=, <, >, BETWEEN)\n- **Hash**: Only equality (=). Faster than B-Tree for exact matches.\n- **GIN**: Good for JSONB, arrays, full-text search in PostgreSQL\n- **Partial Index**: Index only a subset of rows (e.g., \`WHERE status = 'active'\`)\n- **Composite Index**: Index on multiple columns. Column order matters!\n\n**EXPLAIN ANALYZE:**\n\`\`\`sql\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@example.com';\n\`\`\`\nShows execution plan — look for "Seq Scan" (bad) vs "Index Scan" (good).\n\n**When indexes hurt:**\n- Write-heavy tables (indexes slow INSERT/UPDATE/DELETE)\n- Low-cardinality columns (boolean, status with few values)`,
        mcqs: [
          {
            question: "What data structure do most relational databases use for default indexes?",
            options: ["Hash table", "B-Tree", "Red-Black Tree", "Skip list"],
            answer: 1
          },
          {
            question: "What does `EXPLAIN ANALYZE` do in PostgreSQL?",
            options: [
              "Automatically creates optimal indexes for a query",
              "Shows the query execution plan with actual timing and row estimates",
              "Analyzes the entire database for query patterns",
              "Explains the SQL syntax of a given query"
            ],
            answer: 1
          },
          {
            question: "When can adding an index hurt performance?",
            options: [
              "When the column has high cardinality (many unique values)",
              "On write-heavy tables, as indexes add overhead to INSERT/UPDATE/DELETE operations",
              "When the table has more than 1 million rows",
              "When the query uses ORDER BY"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "Transactions, Locks & Concurrency Control",
        description: `In multi-user databases, concurrent transactions can cause problems. Understanding isolation levels and locking is critical.\n\n**Concurrency Anomalies:**\n- **Dirty Read**: Reading uncommitted data from another transaction\n- **Non-Repeatable Read**: Same query returns different results within one transaction\n- **Phantom Read**: New rows appear in repeated range queries\n\n**Isolation Levels (SQL Standard):**\n| Level | Dirty Read | Non-Repeatable | Phantom |\n|---|---|---|---|\n| READ UNCOMMITTED | Possible | Possible | Possible |\n| READ COMMITTED | Prevented | Possible | Possible |\n| REPEATABLE READ | Prevented | Prevented | Possible |\n| SERIALIZABLE | Prevented | Prevented | Prevented |\n\n**MVCC (Multi-Version Concurrency Control):**\nPostgreSQL, MySQL InnoDB use MVCC — readers don't block writers. Each transaction sees a consistent snapshot of the database.\n\n**Deadlocks:**\nTransaction A holds lock on table 1, wants table 2. Transaction B holds table 2, wants table 1. Neither can proceed. DB detects and kills one.`,
        mcqs: [
          {
            question: "What is a 'Dirty Read' in database concurrency?",
            options: [
              "Reading data from a corrupted table",
              "Reading uncommitted data from another transaction that may later be rolled back",
              "Reading data without proper authentication",
              "Reading from an index that is out of sync with the table"
            ],
            answer: 1
          },
          {
            question: "What isolation level prevents all three concurrency anomalies?",
            options: ["READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE", "READ UNCOMMITTED"],
            answer: 2
          },
          {
            question: "What is MVCC (Multi-Version Concurrency Control)?",
            options: [
              "A locking strategy where only one transaction can run at a time",
              "A concurrency mechanism where readers don't block writers by maintaining multiple data versions",
              "A version control system integrated into the database",
              "Multiple write transactions sharing a single lock on a row"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "PostgreSQL Advanced Features",
        description: `PostgreSQL is the most advanced open-source relational database. Its unique features enable use cases impossible in other databases.\n\n**JSONB — Best of Both Worlds:**\n\`\`\`sql\nCREATE TABLE products (\n    id SERIAL PRIMARY KEY,\n    name TEXT,\n    metadata JSONB\n);\n\n-- Query inside JSON\nSELECT name, metadata->>'color' as color\nFROM products\nWHERE metadata @> '{\"in_stock\": true}';\n\n-- GIN index for JSONB\nCREATE INDEX idx_metadata ON products USING GIN(metadata);\n\`\`\`\n\n**Full-Text Search:**\n\`\`\`sql\nSELECT title FROM articles\nWHERE to_tsvector('english', content) @@ to_tsquery('react & hooks');\n\`\`\`\n\n**Table Partitioning:**\n\`\`\`sql\nCREATE TABLE orders (\n    id BIGSERIAL, order_date DATE\n) PARTITION BY RANGE (order_date);\n\nCREATE TABLE orders_2024 PARTITION OF orders\nFOR VALUES FROM ('2024-01-01') TO ('2025-01-01');\n\`\`\`\n\n**Logical Replication:** Stream changes to replicas or event consumers (like Debezium CDC).`,
        mcqs: [
          {
            question: "What is the advantage of JSONB over JSON storage in PostgreSQL?",
            options: [
              "JSONB stores data as text; JSON stores it as binary",
              "JSONB stores data in binary format and supports GIN indexing for fast queries",
              "JSONB preserves key insertion order; JSON normalizes it",
              "JSONB has a smaller storage size due to compression"
            ],
            answer: 1
          },
          {
            question: "What does `to_tsvector` and `to_tsquery` enable in PostgreSQL?",
            options: [
              "Converting TypeScript types to vector embeddings",
              "Performing full-text search on text columns",
              "Querying JSONB fields using text predicates",
              "Converting SQL queries to TypeScript interfaces"
            ],
            answer: 1
          },
          {
            question: "What is table partitioning in PostgreSQL?",
            options: [
              "Splitting table columns into separate tables for normalization",
              "Dividing a large table into smaller physical sub-tables based on partition key values",
              "Creating separate schemas for different table categories",
              "Replicating a table across multiple servers"
            ],
            answer: 1
          }
        ]
      },
      {
        title: "NoSQL Databases & When to Use Them",
        description: `Not all data fits neatly into tables. NoSQL databases trade some relational guarantees for horizontal scalability and flexible schemas.\n\n**Types of NoSQL:**\n\n**Document Stores (MongoDB, Firestore):**\nStore JSON-like documents. Flexible schema — documents in the same collection can have different fields. Good for catalogs, user profiles, content.\n\n**Key-Value Stores (Redis, DynamoDB):**\nSimple key → value. Ultra-fast (Redis: in-memory). Good for caching, sessions, counters.\n\n**Column-Family (Cassandra, HBase):**\nOptimized for wide-column writes and time-series data. Eventual consistency. Linear horizontal scaling.\n\n**Graph (Neo4j, Amazon Neptune):**\nNodes and edges for relationship-heavy data. Fraud detection, social networks, recommendation engines.\n\n**CAP Theorem:**\nA distributed system can guarantee only 2 of: Consistency, Availability, Partition tolerance.\n- CP: MongoDB, Redis\n- AP: Cassandra, DynamoDB\n- CA: Traditional RDBMS (not distributed)\n\n**When to choose NoSQL:**\n- Flexible/evolving schema\n- Massive horizontal scale\n- Specific access patterns (time-series, graphs, documents)`,
        mcqs: [
          {
            question: "What does the CAP Theorem state about distributed databases?",
            options: [
              "All distributed systems must have Consistency, Availability, and Partition tolerance",
              "A distributed system can only guarantee 2 of: Consistency, Availability, Partition tolerance",
              "Consistency is always sacrificed in distributed databases",
              "Partition tolerance is optional in well-designed distributed systems"
            ],
            answer: 1
          },
          {
            question: "Which type of NoSQL database is best suited for social network relationship queries?",
            options: [
              "Document store (MongoDB)",
              "Key-value store (Redis)",
              "Graph database (Neo4j)",
              "Column-family store (Cassandra)"
            ],
            answer: 2
          },
          {
            question: "What makes Redis suitable for session storage and caching?",
            options: [
              "Redis supports complex SQL-like queries on cached data",
              "Redis is an in-memory key-value store with sub-millisecond latency",
              "Redis automatically replicates data to multiple regions",
              "Redis has native support for JSON document storage"
            ],
            answer: 1
          }
        ]
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// Generic topic generator for courses without explicit content
// ─────────────────────────────────────────────────────────────────────────────

function generateGenericTopics(courseId: string, chapters: string[]): TopicContent[] {
  return chapters.map((chapter, index) => ({
    title: chapter.replace(/^\d+\.\s*/, ""),
    description: `This module covers the essential concepts and practical applications of **${chapter.replace(/^\d+\.\s*/, "")}**.\n\nYou'll explore the core principles, industry best practices, and real-world use cases that define this topic. By the end of this section, you'll have hands-on understanding of how these concepts apply in professional environments.\n\n**Learning Objectives:**\n- Understand the theoretical foundations\n- Apply key concepts in practical scenarios\n- Analyze common patterns and anti-patterns\n- Build production-ready implementations\n\nThis module is part of a progressive curriculum designed to take you from foundational understanding to professional mastery in this domain.`,
    mcqs: [
      {
        question: `Which of the following best describes the primary goal of "${chapter.replace(/^\d+\.\s*/, "")}"?`,
        options: [
          "Memorizing syntax rules and API documentation",
          "Understanding core concepts and applying them effectively in real-world scenarios",
          "Copying existing patterns without understanding the underlying principles",
          "Avoiding this topic in professional work environments"
        ],
        answer: 1
      },
      {
        question: `When working professionally with the concepts in module ${index + 1}, what approach leads to the best outcomes?`,
        options: [
          "Using the first solution that seems to work",
          "Ignoring best practices in favor of speed",
          "Applying structured thinking, testing, and iterative improvement",
          "Relying solely on documentation without practical application"
        ],
        answer: 2
      },
      {
        question: `What is the most important skill to develop when mastering "${chapter.replace(/^\d+\.\s*/, "")}"?`,
        options: [
          "Keyboard shortcuts for your IDE",
          "The ability to copy-paste from Stack Overflow",
          "Deep conceptual understanding combined with practical hands-on experience",
          "Memorizing all API method names"
        ],
        answer: 2
      }
    ]
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export function getCourseContent(courseId: string, chapters?: string[]): TopicContent[] {
  const explicit = ALL_COURSE_CONTENT.find((c) => c.courseId === courseId);
  if (explicit) return explicit.topics;
  
  // Generate generic content for courses without explicit entries
  const fallbackChapters = chapters || [
    "1. Fundamental Concepts & Environment Setup",
    "2. Developing Base Building Blocks & Modules",
    "3. Managing States & Data Pipelines",
    "4. Component Architecture & Scalable Scoping",
    "5. Secure Authentication & Middleware APIs",
    "6. Real-world Deployment & Performance Optimization"
  ];
  
  return generateGenericTopics(courseId, fallbackChapters);
}
