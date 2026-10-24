export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const primaryNav: NavLink[] = [
  { label: "Why Fidan", href: "https://fidan.dev/#why-fidan" },
  { label: "Docs", href: "https://docs.fidan.dev/", external: true },
  { label: "Releases", href: "https://fidan.dev/releases" },
  { label: "Dal", href: "https://dal.fidan.dev", external: true },
  {
    label: "GitHub",
    href: "https://github.com/fidan-lang/fidan",
    external: true,
  },
];

export const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Why Fidan", href: "https://fidan.dev/#why-fidan" },
      { label: "Install", href: "https://fidan.dev/#install" },
      { label: "Releases", href: "https://fidan.dev/releases" },
    ],
  },
  {
    title: "Docs",
    links: [
      {
        label: "Getting Started",
        href: "https://docs.fidan.dev/getting-started/install",
        external: true,
      },
      {
        label: "Language",
        href: "https://docs.fidan.dev/language/variables-and-types",
        external: true,
      },
      {
        label: "Toolchains",
        href: "https://docs.fidan.dev/toolchains/interpreter",
        external: true,
      },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Dal Registry", href: "https://dal.fidan.dev", external: true },
      {
        label: "VS Code Extension",
        href: "https://marketplace.visualstudio.com/items?itemName=fidan.fidan",
        external: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/fidan-lang/fidan",
        external: true,
      },
    ],
  },
] satisfies Array<{ title: string; links: NavLink[] }>;

export const heroSnippet = `
use std.async
use std.io

action main {
    parallel {
        task { io.print("native work") }
        task { io.print("real threads") }
    }

    concurrent {
        task {
            await async.sleep(40)
            io.print("cooperative scheduling")
        }
    }

    io.print("Compiler-grounded tooling.")
}

main()`;

export const featureCards = [
  {
    title: "Native without the ceremony",
    description:
      "Fidan keeps the language surface compact, but still gives you interpreter, JIT, Cranelift AOT, and LLVM AOT in one toolchain.",
    eyebrow: "Execution",
  },
  {
    title: "Concurrency that reads like intent",
    description:
      "Use parallel for real threads, concurrent for structured same-thread work, and spawn/await when you want explicit handles.",
    eyebrow: "Concurrency",
  },
  {
    title: "Interop that does not fight you",
    description:
      "Reach native libraries directly with @extern instead of pretending every problem belongs inside a managed sandbox.",
    eyebrow: "Interop",
  },
  {
    title: "Tooling built into the language story",
    description:
      "Tracing, replay, packaging, diagnostics, formatting, LSP support, and compiler-grounded AI explain/fix/improve workflows are part of the product, not an afterthought.",
    eyebrow: "Tooling",
  },
] as const;

export const proofStats = [
  {
    value: "4",
    label: "execution modes",
    note: "interpreter, JIT, Cranelift AOT, LLVM AOT",
  },
  {
    value: "@extern",
    label: "native interop",
    note: "native libraries stay reachable",
  },
  {
    value: "Dal",
    label: "package flow",
    note: "first-party registry and publishing path",
  },
  {
    value: "AI",
    label: "native workflows",
    note: "fix, improve, and explain stay inside the toolchain",
  },
] as const;

export const switchCards = [
  {
    eyebrow: "Python → Fidan",
    title: "Readable code, multiple execution paths.",
    description:
      "Explore readable syntax with an interpreter, selective JIT, and native AOT backends. Validate your workload rather than assuming a performance equivalence.",
  },
  {
    eyebrow: "Rust → Fidan",
    title: "A different language and ownership model.",
    description:
      "Fidan combines static analysis with managed runtime values and native compilation. It does not claim Rust safety or performance guarantees.",
  },
  {
    eyebrow: "C++ → Fidan",
    title: "Native integration with explicit boundaries.",
    description:
      "You still target real native software, but with built-in diagnostics, formatting, LSP support, replay tooling, and a first-party package flow.",
  },
] as const;

export const compareRows = [
  {
    name: "Python",
    edge: "Integrated AOT builds and package tooling.",
    nuance:
      "Consider the syntax, packaging and supported backends against your application requirements.",
  },
  {
    name: "Rust",
    edge: "Different syntax and a managed runtime model.",
    nuance:
      "Compare ownership, diagnostics, dependencies and measured behavior for your workload.",
  },
  {
    name: "C++",
    edge: "Human-readable language design with integrated tooling and package flow.",
    nuance:
      "Use native interop where required, with explicit ABI and deployment checks.",
  },
] as const;

export const installCommands = [
  {
    label: "Windows PowerShell",
    language: "powershell",
    command: "iwr https://fidan.dev/install.ps1 -UseBasicParsing | iex",
  },
  {
    label: "macOS / Linux",
    language: "bash",
    command: "curl -fsSL https://fidan.dev/install.sh | sh",
  },
  {
    label: "From release archive",
    language: "url",
    command:
      "Download the latest release from https://github.com/fidan-lang/fidan/releases/latest and add fidan to your PATH.",
  },
] as const;

export const marketingSections = {
  whyHeading: "Why Fidan is designed this way",
  whyIntro:
    "Fidan is an AI-native general-purpose programming language and compiler toolchain. Its design connects human-readable code, native backends and AI tools grounded in structured compiler knowledge.",
  reliability:
    "The toolchain already ships with broad tests, multiple execution backends, tracing, replay, packaging workflows, and AI-assisted explain, fix, and improve paths grounded in diagnostics, inferred types, reads and writes, symbols, call graphs, and static traces. The documentation distinguishes released functionality, upcoming candidate APIs and backend limitations.",
  ecosystem:
    "Dal gives Fidan a first-party package story, and the runtime stays open to native libraries through @extern so you are never boxed in.",
} as const;
