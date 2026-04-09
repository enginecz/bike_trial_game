export interface CameraTarget {
  targetX: number;
  targetY: number;
  lookAheadX?: number;
  lookAheadY?: number;
  zoom?: number;
}

export interface Camera {
  readonly zoom: {
    current: number;
  };
  readonly position: {
    x: number;
    y: number;
  };
  update(deltaTimeSeconds: number, target: CameraTarget): void;
}

export function createCamera(): Camera {
  const position = {
    x: 0,
    y: 0,
  };
  const zoom = {
    current: 40,
  };

  const followStrengthX = 5;
  const followStrengthY = 3.5;
  const zoomStrength = 4;

  return {
    zoom,
    position,
    update(deltaTimeSeconds, target) {
      const targetX = target.targetX + (target.lookAheadX ?? 0);
      const targetY = target.targetY + (target.lookAheadY ?? 0);
      const blendX = Math.min(1, followStrengthX * deltaTimeSeconds);
      const blendY = Math.min(1, followStrengthY * deltaTimeSeconds);
      const blendZoom = Math.min(1, zoomStrength * deltaTimeSeconds);

      position.x += (targetX - position.x) * blendX;
      position.y += (targetY - position.y) * blendY;
      zoom.current += ((target.zoom ?? 40) - zoom.current) * blendZoom;
    },
  };
}
