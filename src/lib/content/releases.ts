export type ReleaseNote = {
  version: string;
  date: string;
  title: string;
  summary: string;
  highlights: string[];
  installNotes: string[];
  body: string;
  githubUrl?: string;
  latest?: boolean;
};

export const releases: ReleaseNote[] = [
  {
    version: "1.0.0",
    date: "2026-04-01",
    title: "Fidan 1.0.0",
    summary:
      "The first stable Fidan release: four execution modes, clean concurrency primitives, native interop, a real package workflow, and a polished toolchain story.",
    highlights: [
      "Interpreter, JIT, Cranelift AOT, and LLVM AOT are all release-tested.",
      "Structured concurrency with parallel, concurrent, spawn, and await.",
      "Toolchain packaging, release builds, tracing, replay, and VS Code support.",
      "Dal package publishing and package ignore support.",
    ],
    installNotes: [
      "Use the installer for your platform or download the release archive.",
      "If you need portable binaries, keep the default target CPU or pass --target-cpu explicitly.",
      "If you need maximum local performance, use --release.",
    ],
    body: `## Stable foundation

Fidan 1.0.0 is about coherence. The language, the toolchains, the package story, and the editor tooling now feel like one product instead of a stack of disconnected parts.

## Highlights

- Four execution modes with shared semantics.
- Native package flow with Dal.
- Stronger docs, diagnostics, formatter, and LSP foundations.
- Release builds now default to an aggressive optimization preset while still allowing explicit target CPU overrides.

## What this release is not

It is not a promise that the language will stop evolving. It is a promise that the foundation is solid enough to build on.`,
    latest: true,
  },
  {
    version: "0.9.0",
    date: "2026-02-12",
    title: "Fidan 0.9.0",
    summary:
      "The release that solidified the modern compiler pipeline and moved the ecosystem toward a stable 1.0 launch.",
    highlights: [
      "Toolchain packaging and DAL workflow matured.",
      "AOT examples and regression coverage expanded.",
      "Language ergonomics and diagnostics improved.",
    ],
    installNotes: [
      "Upgrade to 1.0.0 unless you specifically need to compare pre-stable behavior.",
    ],
    body: `## The road to 1.0

Fidan 0.9.0 focused on cleaning up the compiler pipeline, improving diagnostics, and stress-testing the runtime across more examples and deployment paths.`,
  },
];

export const latestRelease =
  releases.find((release) => release.latest) ?? releases[0];

export function pickLatestRelease(entries: ReleaseNote[]): ReleaseNote {
  return entries.find((release) => release.latest) ?? entries[0];
}

for (const release of releases) {
  if (!release.version || !release.title || !release.summary) {
    throw new Error(
      `Invalid release metadata for version ${release.version || "<missing>"}`,
    );
  }
}
