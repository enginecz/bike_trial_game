export interface FixedStepLoopOptions {
  fixedDeltaTimeMs: number;
  maxFrameTimeMs: number;
  update(deltaTimeSeconds: number): void;
  render(alpha: number): void;
}

export interface FixedStepLoop {
  start(): void;
  stop(): void;
}

export function createFixedStepLoop(options: FixedStepLoopOptions): FixedStepLoop {
  let animationFrameId = 0;
  let accumulatorMs = 0;
  let lastTimeMs = 0;
  let running = false;

  function frame(timeMs: number) {
    if (!running) {
      return;
    }

    if (lastTimeMs === 0) {
      lastTimeMs = timeMs;
    }

    const elapsedMs = Math.min(timeMs - lastTimeMs, options.maxFrameTimeMs);
    lastTimeMs = timeMs;
    accumulatorMs += elapsedMs;

    while (accumulatorMs >= options.fixedDeltaTimeMs) {
      options.update(options.fixedDeltaTimeMs / 1000);
      accumulatorMs -= options.fixedDeltaTimeMs;
    }

    const alpha = accumulatorMs / options.fixedDeltaTimeMs;
    options.render(alpha);

    animationFrameId = window.requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) {
        return;
      }

      running = true;
      accumulatorMs = 0;
      lastTimeMs = 0;
      animationFrameId = window.requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      window.cancelAnimationFrame(animationFrameId);
    },
  };
}
