export interface DebugOverlay {
  getLines(): string[];
  setLines(lines: string[]): void;
}

export function createDebugOverlay(): DebugOverlay {
  let lines: string[] = [];

  return {
    getLines() {
      return lines;
    },
    setLines(nextLines) {
      lines = nextLines;
    },
  };
}
