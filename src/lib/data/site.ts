export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const primaryNav: NavLink[] = [
  { label: "Why Fidan", href: "/#why-fidan" },
  { label: "Docs", href: "https://docs.fidan.dev/", external: true },
  { label: "Releases", href: "/releases" },
  { label: "Dal", href: "https://dal.fidan.dev", external: true },
  { label: "GitHub", href: "https://github.com/fidan-lang/fidan", external: true }
];

export const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Why Fidan", href: "/#why-fidan" },
      { label: "Install", href: "/#install" },
      { label: "Releases", href: "/releases" }
    ]
  },
  {
    title: "Docs",
    links: [
      { label: "Getting Started", href: "https://docs.fidan.dev/getting-started/install", external: true },
      { label: "Language", href: "https://docs.fidan.dev/language/variables-and-types", external: true },
      { label: "Toolchains", href: "https://docs.fidan.dev/toolchains/interpreter", external: true }
    ]
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Dal Registry", href: "https://dal.fidan.dev", external: true },
      { label: "VS Code Extension", href: "https://marketplace.visualstudio.com/items?itemName=fidan.fidan", external: true },
      { label: "GitHub", href: "https://github.com/fidan-lang/fidan", external: true }
    ]
  }
] satisfies Array<{ title: string; links: NavLink[] }>;

export const heroSnippet = `
use std.async as async
use std.io as io

action main {
    parallel {
        task io.print("native work")
        task io.print("real threads")
    }

    concurrent {
        task {
            await async.sleep(40)
            io.print("cooperative scheduling")
        }
    }

    io.print("Built for native speed.")
}`;

export const featureCards = [
  {
    title: "Native without the ceremony",
    description:
      "Fidan keeps the language surface compact, but still gives you interpreter, JIT, Cranelift AOT, and LLVM AOT in one toolchain.",
    eyebrow: "Execution"
  },
  {
    title: "Concurrency that reads like intent",
    description:
      "Use parallel for real threads, concurrent for structured same-thread work, and spawn/await when you want explicit handles.",
    eyebrow: "Concurrency"
  },
  {
    title: "Interop that does not fight you",
    description:
      "Reach native libraries directly with @extern instead of pretending every problem belongs inside a managed sandbox.",
    eyebrow: "Interop"
  },
  {
    title: "Tooling built into the language story",
    description:
      "Tracing, replay, packaging, diagnostics, formatting, and LSP support are part of the product, not an afterthought.",
    eyebrow: "Tooling"
  }
] as const;

export const proofStats = [
  { value: "4", label: "execution modes", note: "interpreter, JIT, Cranelift AOT, LLVM AOT" },
  { value: "@extern", label: "native interop", note: "native libraries stay reachable" },
  { value: "Dal", label: "package flow", note: "first-party registry and publishing path" }
] as const;

export const switchCards = [
  {
    eyebrow: "Python → Fidan",
    title: "Leave runtime drag behind.",
    description:
      "Ship native binaries, keep a smaller syntax surface than systems languages, and stop treating packaging and deployment like a second project."
  },
  {
    eyebrow: "Rust → Fidan",
    title: "Keep the performance, drop the ceremony.",
    description:
      "Fidan stays native-first, but reaches that point with faster iteration, fewer concepts to juggle, and one coherent toolchain."
  },
  {
    eyebrow: "C++ → Fidan",
    title: "Modern product feel without legacy baggage.",
    description:
      "You still target real native software, but with built-in diagnostics, formatting, LSP support, replay tooling, and a first-party package flow."
  }
] as const;

export const compareRows = [
  {
    name: "Python",
    edge: "Native binaries, AOT compilation, and tighter packaging.",
    nuance: "Python still wins on ecosystem size and notebook/data ubiquity."
  },
  {
    name: "Rust",
    edge: "Far less syntax and concept overhead for day-to-day iteration.",
    nuance: "Rust still wins on formal safety guarantees and ecosystem maturity."
  },
  {
    name: "C++",
    edge: "A dramatically simpler language surface with modern tooling and built-in package flow.",
    nuance: "C++ still has the deepest optimizer maturity and legacy footprint."
  }
] as const;

export const installCommands = [
  {
    label: "Windows PowerShell",
    language: "powershell",
    command: "iwr https://fidan.dev/install.ps1 -UseBasicParsing | iex"
  },
  {
    label: "macOS / Linux",
    language: "bash",
    command: "curl -fsSL https://fidan.dev/install.sh | sh"
  },
  {
    label: "From release archive",
    language: "url",
    command: "Download the latest release from https://github.com/fidan-lang/fidan/releases/latest and add fidan to your PATH."
  }
] as const;

export const marketingSections = {
  whyHeading: "Why teams switch to Fidan",
  whyIntro:
    "Fidan is built for people who want native performance, real deployment targets, and integrated tooling without drowning in the old tradeoffs.",
  reliability:
    "The toolchain already ships with broad tests, multiple execution backends, tracing, replay, and packaging workflows. The goal is not novelty. The goal is a fast, coherent system that feels tight everywhere.",
  ecosystem:
    "Dal gives Fidan a first-party package story, and the language runtime stays open to native libraries through @extern so you are never boxed in."
} as const;
