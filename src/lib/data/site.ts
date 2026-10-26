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
    title: "AI that starts with compiler knowledge",
    description:
      "Give explain, fix and improve workflows structured diagnostics, types, symbols and program relationships. Formatting, LSP, tracing and replay stay close at hand.",
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
  seoTitle: "Fidan — AI-Native, Native-First Programming",
  seoDescription:
    "An AI-native, native-first programming language with expressive syntax, native execution backends and compiler-grounded AI tooling in one developer ecosystem.",
  heroBadge: "AI-native by design. Native-first by architecture.",
  heroTitle: "Expressive code. Native software.",
  heroAccentLabel: "AI-native",
  heroAccent: "from the compiler up.",
  heroLead:
    "Write human-readable code and take it from a quick run to a native binary in one toolchain. Fidan connects expressive syntax, native execution and an integrated developer ecosystem with AI tools that can work from compiler knowledge, alongside source text.",
  whyHeading: "More from your language. Less around it.",
  whyIntro:
    "Fidan brings expressive code, native execution and compiler-grounded AI into one developer ecosystem. Spend less effort connecting tools and more time expressing what your software should do.",
  reliability:
    "AI-native means giving development tools access to diagnostics, inferred types, symbols, reads and writes, call graphs and static traces. Explain, fix and improve can work from that structured compiler knowledge alongside source text.",
  ecosystem:
    "Move from editor feedback to packages and native libraries without leaving the ecosystem: LSP support, DAL, a REPL, build tools and @extern interop are part of the same development story.",
} as const;
