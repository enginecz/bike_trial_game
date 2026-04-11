import type { Camera } from './camera';
import type { PhysicsRenderState } from '../physics/simulation';
import type { Level } from '../world/level';
import type { OverlayLegendEntry } from '../game/debug-hud';

export interface RenderScene {
  camera: Camera;
  debugLines: string[];
  level: Level;
  physics: PhysicsRenderState;
  suspensionDebugEnabled: boolean;
  terrainDebugEnabled: boolean;
  overlayLegendEntries: OverlayLegendEntry[];
  terrainLegendEntries: OverlayLegendEntry[];
}

export interface Renderer {
  resize(): void;
  render(scene: RenderScene): void;
}

export function createRenderer(canvas: HTMLCanvasElement): Renderer {
  const canvasContext = canvas.getContext('2d');
  let pixelRatio = 1;

  if (!canvasContext) {
    throw new Error('Canvas 2D context could not be created.');
  }

  const context: CanvasRenderingContext2D = canvasContext;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width === Math.floor(width * dpr) && canvas.height === Math.floor(height * dpr)) {
      pixelRatio = dpr;
      return;
    }

    pixelRatio = dpr;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  function clear(width: number, height: number) {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#171717');
    gradient.addColorStop(1, '#090909');

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function applyWorldTransform(camera: Camera, width: number, height: number) {
    context.setTransform(
      camera.zoom.current * pixelRatio,
      0,
      0,
      -camera.zoom.current * pixelRatio,
      (width * 0.5 - camera.position.x * camera.zoom.current) * pixelRatio,
      (height * 0.68 + camera.position.y * camera.zoom.current) * pixelRatio,
    );
  }

  function drawGrid(camera: Camera, width: number, height: number) {
    context.save();
    applyWorldTransform(camera, width, height);

    context.lineWidth = 1 / camera.zoom.current;
    context.strokeStyle = '#202020';

    for (let x = -40; x <= 80; x += 2) {
      context.beginPath();
      context.moveTo(x, -10);
      context.lineTo(x, 10);
      context.stroke();
    }

    for (let y = -10; y <= 10; y += 2) {
      context.beginPath();
      context.moveTo(-40, y);
      context.lineTo(80, y);
      context.stroke();
    }

    context.restore();
  }

  function drawTerrain(scene: RenderScene, width: number, height: number) {
    context.save();
    applyWorldTransform(scene.camera, width, height);

    scene.level.collisionChains.forEach((chain) => {
      context.lineWidth = screenPixelsToWorld(scene.camera, 2);
      context.strokeStyle = '#f0f0f0';

      context.beginPath();
      context.moveTo(chain.points[0].x, chain.points[0].y);

      for (let index = 1; index < chain.points.length; index += 1) {
        context.lineTo(chain.points[index].x, chain.points[index].y);
      }

      context.stroke();
    });

    context.restore();
  }

  function drawTerrainDebug(scene: RenderScene, width: number, height: number) {
    if (!scene.terrainDebugEnabled) {
      return;
    }

    context.save();
    applyWorldTransform(scene.camera, width, height);

    scene.level.collisionChains.forEach((chain) => {
      chain.segments.forEach((segment) => {
        const midX = (segment.start.x + segment.end.x) * 0.5;
        const midY = (segment.start.y + segment.end.y) * 0.5;

        context.strokeStyle = '#4cc9f0';
        context.lineWidth = screenPixelsToWorld(scene.camera, 1);
        context.beginPath();
        context.moveTo(midX, midY);
        context.lineTo(midX, midY + 0.6);
        context.stroke();
      });

      chain.points.forEach((point) => {
        context.fillStyle = '#8ae6c1';
        context.beginPath();
        context.arc(point.x, point.y, screenPixelsToWorld(scene.camera, 4), 0, Math.PI * 2);
        context.fill();
      });
    });

    context.fillStyle = '#ffd166';
    context.beginPath();
    context.arc(scene.level.spawn.x, scene.level.spawn.y, screenPixelsToWorld(scene.camera, 6), 0, Math.PI * 2);
    context.fill();

    scene.level.testSpawns.forEach((spawn) => {
      context.fillStyle = '#ffd166';
      context.beginPath();
      context.arc(spawn.position.x, spawn.position.y, screenPixelsToWorld(scene.camera, 6), 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  function drawBike(scene: RenderScene, width: number, height: number) {
    const { bike } = scene.physics;
    const overlayMode = scene.suspensionDebugEnabled;
    const frameColor = overlayMode ? '#ffb703' : '#f6f6f6';
    const swingarmColor = overlayMode ? '#ffd166' : '#f6f6f6';
    const forkColor = overlayMode ? '#7bdff2' : '#f6f6f6';
    const rearWheelColor = overlayMode ? '#a0e426' : '#f6f6f6';
    const frontWheelColor = overlayMode ? '#c77dff' : '#f6f6f6';
    const riderColor = overlayMode ? '#ff99c8' : '#f6f6f6';

    context.save();
    applyWorldTransform(scene.camera, width, height);

    context.lineWidth = screenPixelsToWorld(scene.camera, 2);

    context.strokeStyle = rearWheelColor;
    drawCircle(context, bike.rearWheel.position.x, bike.rearWheel.position.y, bike.rearWheel.radius, false);
    context.strokeStyle = frontWheelColor;
    drawCircle(context, bike.frontWheel.position.x, bike.frontWheel.position.y, bike.frontWheel.radius, false);
    context.strokeStyle = riderColor;
    drawCircle(context, bike.rider.position.x, bike.rider.position.y, bike.rider.radius, false);

    context.strokeStyle = swingarmColor;
    drawLine(context, bike.rearWheelAnchor.x, bike.rearWheelAnchor.y, bike.frameRearPivot.x, bike.frameRearPivot.y);
    context.strokeStyle = frameColor;
    drawLine(context, bike.frameRearPivot.x, bike.frameRearPivot.y, bike.frame.position.x, bike.frame.position.y);
    drawLine(context, bike.frame.position.x, bike.frame.position.y, bike.frameFrontPivot.x, bike.frameFrontPivot.y);
    context.strokeStyle = forkColor;
    drawLine(context, bike.frameFrontPivot.x, bike.frameFrontPivot.y, bike.forkFrontAxle.x, bike.forkFrontAxle.y);
    context.strokeStyle = riderColor;
    drawLine(context, bike.frame.position.x, bike.frame.position.y, bike.rider.position.x, bike.rider.position.y);

    if (overlayMode) {
      context.strokeStyle = '#bdb2ff';
      drawBodyAxis(context, bike.frame.position.x, bike.frame.position.y, bike.frame.angle, 0.7);
      drawBodyAxis(context, bike.swingarm.position.x, bike.swingarm.position.y, bike.swingarm.angle, 0.45);
      drawBodyAxis(context, bike.fork.position.x, bike.fork.position.y, bike.fork.angle, 0.55);
    }

    context.restore();
  }

  function drawSuspensionDebug(scene: RenderScene, width: number, height: number) {
    if (!scene.suspensionDebugEnabled) {
      return;
    }

    const { bike } = scene.physics;

    context.save();
    applyWorldTransform(scene.camera, width, height);

    context.lineWidth = screenPixelsToWorld(scene.camera, 2);

    context.strokeStyle = '#ffd166';
    drawLine(context, bike.frameRearPivot.x, bike.frameRearPivot.y, bike.rearWheelAnchor.x, bike.rearWheelAnchor.y);
    drawLine(context, bike.frameFrontPivot.x, bike.frameFrontPivot.y, bike.frontSliderCurrent.x, bike.frontSliderCurrent.y);
    drawLine(context, bike.frontSliderCurrent.x, bike.frontSliderCurrent.y, bike.frontWheelAnchor.x, bike.frontWheelAnchor.y);

    context.strokeStyle = '#ef476f';
    drawLine(context, bike.rearShockFrameAnchor.x, bike.rearShockFrameAnchor.y, bike.rearShockSwingarmAnchor.x, bike.rearShockSwingarmAnchor.y);
    drawLine(context, bike.frontSliderBase.x, bike.frontSliderBase.y, bike.frontSliderCurrent.x, bike.frontSliderCurrent.y);

    context.strokeStyle = '#67d6ff';
    drawLine(context, bike.rearAxleMinLimit.x, bike.rearAxleMinLimit.y, bike.rearAxleMaxLimit.x, bike.rearAxleMaxLimit.y);
    drawLine(context, bike.frontAxleMin.x, bike.frontAxleMin.y, bike.frontAxleMax.x, bike.frontAxleMax.y);

    drawAnchorMarker(context, scene.camera, bike.rearWheel.position.x, bike.rearWheel.position.y, '#ffffff');
    drawAnchorMarker(context, scene.camera, bike.frontWheel.position.x, bike.frontWheel.position.y, '#ffffff');
    drawAnchorMarker(context, scene.camera, bike.frameRearPivot.x, bike.frameRearPivot.y, '#ffd166');
    drawAnchorMarker(context, scene.camera, bike.rearWheelAnchor.x, bike.rearWheelAnchor.y, '#ffd166');
    drawAnchorMarker(context, scene.camera, bike.frameFrontPivot.x, bike.frameFrontPivot.y, '#ffd166');
    drawAnchorMarker(context, scene.camera, bike.frontWheelAnchor.x, bike.frontWheelAnchor.y, '#ffd166');
    drawAnchorMarker(context, scene.camera, bike.rearShockFrameAnchor.x, bike.rearShockFrameAnchor.y, '#ef476f');
    drawAnchorMarker(context, scene.camera, bike.rearShockSwingarmAnchor.x, bike.rearShockSwingarmAnchor.y, '#ef476f');
    drawAnchorMarker(context, scene.camera, bike.frontSliderBase.x, bike.frontSliderBase.y, '#ef476f');
    drawAnchorMarker(context, scene.camera, bike.frontSliderCurrent.x, bike.frontSliderCurrent.y, '#ef476f');
    drawAnchorMarker(context, scene.camera, bike.frontAxleMin.x, bike.frontAxleMin.y, '#67d6ff');
    drawAnchorMarker(context, scene.camera, bike.frontAxleMax.x, bike.frontAxleMax.y, '#67d6ff');
    drawAnchorMarker(context, scene.camera, bike.rearAxleMinLimit.x, bike.rearAxleMinLimit.y, '#67d6ff');
    drawAnchorMarker(context, scene.camera, bike.rearAxleMaxLimit.x, bike.rearAxleMaxLimit.y, '#67d6ff');

    context.restore();
  }

  function drawOverlayLegend(entries: OverlayLegendEntry[], width: number) {
    if (entries.length === 0) {
      return;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const panelWidth = 520;
    const panelX = Math.max(460, width - panelWidth - 160);
    const panelY = 92;
    const lineHeight = 22;
    const panelHeight = 20 + (entries.length + 1) * lineHeight;

    context.fillStyle = 'rgba(12, 12, 12, 0.82)';
    context.fillRect(panelX, panelY, panelWidth, panelHeight);

    context.strokeStyle = '#323232';
    context.lineWidth = 1;
    context.strokeRect(panelX, panelY, panelWidth, panelHeight);

    context.font = '14px monospace';
    context.fillStyle = '#f0f0f0';
    context.fillText('Overlay Legend', panelX + 14, panelY + 24);

    entries.forEach((entry, index) => {
      context.fillStyle = entry.color;
      context.fillText(entry.label, panelX + 14, panelY + 46 + index * lineHeight);
    });
  }

  function drawTerrainLegend(entries: OverlayLegendEntry[], width: number) {
    if (entries.length === 0) {
      return;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const panelWidth = 420;
    const panelX = Math.max(560, width - panelWidth - 220);
    const panelY = 362;
    const lineHeight = 22;
    const panelHeight = 20 + (entries.length + 1) * lineHeight;

    context.fillStyle = 'rgba(12, 12, 12, 0.82)';
    context.fillRect(panelX, panelY, panelWidth, panelHeight);

    context.strokeStyle = '#323232';
    context.lineWidth = 1;
    context.strokeRect(panelX, panelY, panelWidth, panelHeight);

    context.font = '14px monospace';
    context.fillStyle = '#f0f0f0';
    context.fillText('Terrain Legend', panelX + 14, panelY + 24);

    entries.forEach((entry, index) => {
      context.fillStyle = entry.color;
      context.fillText(entry.label, panelX + 14, panelY + 46 + index * lineHeight);
    });
  }

  function drawLabels(width: number, height: number) {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.fillStyle = '#f4f4f4';
    context.font = '600 28px Arial';
    context.fillText('Bike Trial Game', 24, 42);

    context.fillStyle = '#bfbfbf';
    context.font = '16px Arial';
    context.fillText('Physics slice: Planck multibody bike, fixed timestep, simple debug rendering', 24, 68);

    context.strokeStyle = '#2d2d2d';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(24, height - 110);
    context.lineTo(width - 24, height - 110);
    context.stroke();
  }

  function drawDebugOverlay(lines: string[], width: number) {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const panelWidth = 396;
    const panelX = 24;
    const panelY = 92;
    const lineHeight = 22;
    const panelHeight = 20 + lines.length * lineHeight;

    context.fillStyle = 'rgba(12, 12, 12, 0.82)';
    context.fillRect(panelX, panelY, panelWidth, panelHeight);

    context.strokeStyle = '#323232';
    context.lineWidth = 1;
    context.strokeRect(panelX, panelY, panelWidth, panelHeight);

    context.fillStyle = '#f0f0f0';
    context.font = '14px monospace';

    lines.forEach((line, index) => {
      context.fillText(line, panelX + 14, panelY + 24 + index * lineHeight);
    });
  }

  return {
    resize,
    render(scene) {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      clear(width, height);
      drawGrid(scene.camera, width, height);
      drawTerrain(scene, width, height);
      drawTerrainDebug(scene, width, height);
      drawBike(scene, width, height);
      drawSuspensionDebug(scene, width, height);
      drawLabels(width, height);
      drawDebugOverlay(scene.debugLines, width);
      drawOverlayLegend(scene.suspensionDebugEnabled ? scene.overlayLegendEntries : [], width);
      drawTerrainLegend(scene.terrainDebugEnabled ? scene.terrainLegendEntries : [], width);
    },
  };
}

function drawAnchorMarker(context: CanvasRenderingContext2D, camera: Camera, x: number, y: number, color: string) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, screenPixelsToWorld(camera, 4.5), 0, Math.PI * 2);
  context.fill();
}

function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, filled: boolean) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  filled ? context.fill() : context.stroke();
}

function drawLine(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

function drawBodyAxis(context: CanvasRenderingContext2D, x: number, y: number, angle: number, length: number) {
  drawLine(context, x, y, x + Math.cos(angle) * length, y + Math.sin(angle) * length);
}

function screenPixelsToWorld(camera: Camera, pixels: number): number {
  return pixels / camera.zoom.current;
}
