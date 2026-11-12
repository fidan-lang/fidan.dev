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
var day = 3
var day_name = check day {
    1 => "Monday"
    2 => "Tuesday"
    3 => "Wednesday"
    _ => "Weekend"
}
print("{day_name}")`;

// Commands are run from a clone of fidan-lang/fidan after installing Fidan.
export const aiDemoCommands = `fidan check test/examples/check_val.fdn
fidan explain test/examples/check_val.fdn --line 2

# Optional: a configured provider is required for model-assisted explain.
fidan toolchain add ai-analysis --version 1.0.6
fidan exec ai setup
fidan explain test/examples/check_val.fdn --line 2 --ai "Explain this branch selection"`;

export const featureCards = [
  {
    title: "Native builds, one continuous workflow",
    description:
      "Keep your iteration loop short, then build a native executable. Interpreter, selective JIT, Cranelift AOT and optional LLVM AOT share one toolchain.",
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
    title: "Ask the compiler, not just the source text",
    description:
      "Compiler-derived types, diagnostics, symbols and call relationships provide structured context to AI explain, fix and improve workflows and MCP tools.",
    eyebrow: "AI tooling",
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
    title: "Keep the flow. Go native.",
    description:
      "Start with expressive, human-readable code, iterate with the interpreter and selective JIT, then build a native executable. Diagnostics, formatting and packages follow the same workflow.",
  },
  {
    eyebrow: "Rust → Fidan",
    title: "Native builds. Less ceremony.",
    description:
      "Make intent explicit with readable types, actions and concurrency. Managed runtime values and compiler-backed tooling offer a different route to native software.",
  },
  {
    eyebrow: "Go → Fidan",
    title: "A familiar toolchain mindset. An AI-native direction.",
    description:
      "Bring a toolchain-first mindset to expressive actions and collections, native builds, explicit parallel work and DAL packages. Let AI workflows use the compiler knowledge behind your code.",
  },
] as const;

export const compareRows = [
  {
    name: "Python",
    edge: "Take readable code from an interactive run to a native build.",
    nuance:
      "Keep exploration, diagnostics and packaging in the same workflow as your program grows.",
  },
  {
    name: "Rust",
    edge: "Express native intent with a managed runtime model.",
    nuance:
      "Try readable declarations, explicit concurrency and integrated AI analysis with a different ownership model.",
  },
  {
    name: "Go",
    edge: "Build around a compiler-grounded AI workflow.",
    nuance:
      "Explore expressive actions, collection syntax, explicit parallel work and integrated packages in an AI-native language.",
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
  seoTitle: "Fidan | Compiler-Grounded AI and Native Programming",
  seoDescription:
    "Open-source programming language with compiler-grounded AI tooling: structured diagnostics, inferred types, static analysis, native backends and MCP integration.",
  heroBadge: "Compiler-grounded AI. Native execution. Open source.",
  heroTitle: "Write code. Give AI",
  heroAccentLabel: "compiler",
  heroAccent: "context.",
  heroLead:
    "What if your AI assistant could query the compiler instead of relying on source text alone? Fidan combines compiler-derived types, diagnostics and program relationships with AI explain/fix workflows, MCP tools and native execution backends.",
  whyHeading: "Compiler context for AI. Native tooling for developers.",
  whyIntro:
    "Fidan pairs an expressive language with compiler-derived program facts that AI tools can use. Explore the analysis first, then native execution, editor support and packages.",
  reliability:
    "AI-native means giving development tools access to diagnostics, inferred types, symbols, reads and writes, call graphs and static traces. Explain, fix and improve can work from that structured compiler knowledge alongside source text.",
  ecosystem:
    "Move from editor feedback to packages and native libraries without leaving the ecosystem: LSP support, DAL, a REPL, build tools and @extern interop are part of the same development story.",
} as const;
