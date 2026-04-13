export interface DebugOverlay {
  getControlsLines(): string[];
  getStatsLines(): string[];
  setPanels(controlsLines: string[], statsLines: string[]): void;
}

export function createDebugOverlay(): DebugOverlay {
  let controlsLines: string[] = [];
  let statsLines: string[] = [];

  return {
    getControlsLines() {
      return controlsLines;
    },
    getStatsLines() {
      return statsLines;
    },
    setPanels(nextControlsLines, nextStatsLines) {
      controlsLines = nextControlsLines;
      statsLines = nextStatsLines;
    },
  };
}
