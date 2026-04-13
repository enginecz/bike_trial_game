import type { Camera } from './camera';
import type { PhysicsRenderState } from '../physics/simulation';
import type { BikeDefinition } from '../data/bikes';
import type { BikeRenderBody } from '../physics/bike';
import type { Level } from '../world/level';
import type { OverlayLegendEntry } from '../game/debug-hud';
import type { BikeLocalPoint, BikeRenderingBody } from '../data/bikes/shared';

declare const __APP_HEADER_TEXT__: string;

export interface RenderScene {
  activeBike: BikeDefinition;
  camera: Camera;
  controlsLines: string[];
  gridVisible: boolean;
  level: Level;
  physics: PhysicsRenderState;
  statsLines: string[];
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

    const minX = Math.floor(camera.position.x - width * 0.5 / camera.zoom.current) - 1;
    const maxX = Math.ceil(camera.position.x + width * 0.5 / camera.zoom.current) + 1;
    const minY = Math.floor(camera.position.y - height * 0.32 / camera.zoom.current) - 1;
    const maxY = Math.ceil(camera.position.y + height * 0.68 / camera.zoom.current) + 1;

    context.beginPath();
    for (let x = minX; x <= maxX; x += 1) {
      if (x % 10 === 0) {
        continue;
      }

      context.moveTo(x, minY);
      context.lineTo(x, maxY);
    }

    for (let y = minY; y <= maxY; y += 1) {
      if (y % 10 === 0) {
        continue;
      }

      context.moveTo(minX, y);
      context.lineTo(maxX, y);
    }

    context.lineWidth = 1 / camera.zoom.current;
    context.strokeStyle = '#202020';
    context.stroke();

    context.beginPath();
    for (let x = Math.floor(minX / 10) * 10; x <= maxX; x += 10) {
      context.moveTo(x, minY);
      context.lineTo(x, maxY);
    }

    for (let y = Math.floor(minY / 10) * 10; y <= maxY; y += 10) {
      context.moveTo(minX, y);
      context.lineTo(maxX, y);
    }

    context.lineWidth = 2 / camera.zoom.current;
    context.strokeStyle = '#303030';
    context.stroke();

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
    const renderDefinition = scene.activeBike.rendering;
    const frameOnly = renderDefinition?.frameOnly ?? false;
    const overlayMode = scene.suspensionDebugEnabled;
    const showReferenceRendering = !overlayMode;
    const frameColor = overlayMode ? '#ffb703' : '#f6f6f6';
    const headAxisColor = overlayMode ? '#ffb703' : '#ffb703';
    const swingarmColor = overlayMode ? '#ffd166' : '#ffd166';
    const forkColor = overlayMode ? '#7bdff2' : '#7bdff2';
    const rearWheelColor = overlayMode ? '#a0e426' : '#a0e426';
    const frontWheelColor = overlayMode ? '#c77dff' : '#c77dff';
    const riderColor = overlayMode ? '#ff99c8' : '#ff99c8';

    context.save();
    applyWorldTransform(scene.camera, width, height);

    context.lineWidth = screenPixelsToWorld(scene.camera, 2);

    if (showReferenceRendering && renderDefinition?.frameTriangle) {
      context.strokeStyle = frameColor;
      drawAttachedTriangle(context, bike, renderDefinition.frameTriangle.points, renderDefinition.frameTriangle.localTo);
    } else if (!frameOnly) {
      context.strokeStyle = frameColor;
      drawLine(context, bike.frameRearPivot.x, bike.frameRearPivot.y, bike.frame.position.x, bike.frame.position.y);
      drawLine(context, bike.frame.position.x, bike.frame.position.y, bike.frameFrontPivot.x, bike.frameFrontPivot.y);
    }

    if (showReferenceRendering && renderDefinition?.headAxisLine) {
      const start = transformAttachedPoint(bike, renderDefinition.headAxisLine.start, renderDefinition.headAxisLine.startLocalTo);
      const end = transformAttachedPoint(bike, renderDefinition.headAxisLine.end, renderDefinition.headAxisLine.endLocalTo);
      context.strokeStyle = headAxisColor;
      drawLine(context, start.x, start.y, end.x, end.y);
    }

    if (showReferenceRendering && renderDefinition?.forkTriangle) {
      context.strokeStyle = forkColor;
      drawAttachedTriangle(context, bike, renderDefinition.forkTriangle.points, renderDefinition.forkTriangle.localTo);
    }

    if (showReferenceRendering && renderDefinition?.frontWheelCircle) {
      const wheelCenter = transformAttachedPoint(bike, renderDefinition.frontWheelCircle.center, renderDefinition.frontWheelCircle.localTo);
      context.strokeStyle = frontWheelColor;
      drawCircle(context, wheelCenter.x, wheelCenter.y, renderDefinition.frontWheelCircle.radius, false);
    }

    if (showReferenceRendering && renderDefinition?.swingarmTriangle) {
      context.strokeStyle = swingarmColor;
      drawAttachedTriangle(context, bike, renderDefinition.swingarmTriangle.points, renderDefinition.swingarmTriangle.localTo);
    }

    if (showReferenceRendering && renderDefinition?.rearWheelCircle) {
      const wheelCenter = transformAttachedPoint(bike, renderDefinition.rearWheelCircle.center, renderDefinition.rearWheelCircle.localTo);
      context.strokeStyle = rearWheelColor;
      drawCircle(context, wheelCenter.x, wheelCenter.y, renderDefinition.rearWheelCircle.radius, false);
    }

    if (showReferenceRendering && renderDefinition?.riderTriangle) {
      context.strokeStyle = riderColor;
      drawAttachedTriangle(context, bike, renderDefinition.riderTriangle.points, renderDefinition.riderTriangle.localTo);
    }

    if (showReferenceRendering && renderDefinition?.shockLine) {
      const start = transformAttachedPoint(bike, renderDefinition.shockLine.start, renderDefinition.shockLine.startLocalTo);
      const end = transformAttachedPoint(bike, renderDefinition.shockLine.end, renderDefinition.shockLine.endLocalTo);
      context.strokeStyle = '#ef476f';
      drawLine(context, start.x, start.y, end.x, end.y);
    }

    if (showReferenceRendering && renderDefinition?.frontSuspensionLine) {
      const start = transformAttachedPoint(
        bike,
        renderDefinition.frontSuspensionLine.start,
        renderDefinition.frontSuspensionLine.startLocalTo,
      );
      const end = transformAttachedPoint(
        bike,
        renderDefinition.frontSuspensionLine.end,
        renderDefinition.frontSuspensionLine.endLocalTo,
      );
      context.strokeStyle = '#ef476f';
      drawLine(context, start.x, start.y, end.x, end.y);
    }

    if (!frameOnly) {
      context.strokeStyle = rearWheelColor;
      drawCircle(context, bike.rearWheel.position.x, bike.rearWheel.position.y, bike.rearWheel.radius, false);
      context.strokeStyle = frontWheelColor;
      drawCircle(context, bike.frontWheel.position.x, bike.frontWheel.position.y, bike.frontWheel.radius, false);
      context.strokeStyle = riderColor;
      drawCircle(context, bike.rider.position.x, bike.rider.position.y, bike.rider.radius, false);

      context.strokeStyle = swingarmColor;
      drawLine(context, bike.rearWheelAnchor.x, bike.rearWheelAnchor.y, bike.frameRearPivot.x, bike.frameRearPivot.y);
      context.strokeStyle = forkColor;
      drawLine(context, bike.frameFrontPivot.x, bike.frameFrontPivot.y, bike.forkFrontAxle.x, bike.forkFrontAxle.y);
      context.strokeStyle = riderColor;
      drawLine(context, bike.frame.position.x, bike.frame.position.y, bike.rider.position.x, bike.rider.position.y);
    }

    if (overlayMode) {
      context.strokeStyle = '#bdb2ff';
      drawBodyAxis(context, bike.frame.position.x, bike.frame.position.y, bike.frame.angle, 0.7);
      if (!frameOnly) {
        drawBodyAxis(context, bike.swingarm.position.x, bike.swingarm.position.y, bike.swingarm.angle, 0.45);
        drawBodyAxis(context, bike.fork.position.x, bike.fork.position.y, bike.fork.angle, 0.55);
      }
    }

    context.restore();
  }

  function drawSuspensionDebug(scene: RenderScene, width: number, height: number) {
    if (!scene.suspensionDebugEnabled) {
      return;
    }

    const { bike } = scene.physics;
    const renderDefinition = scene.activeBike.rendering;
    const frameOnly = renderDefinition?.frameOnly ?? false;

    context.save();
    applyWorldTransform(scene.camera, width, height);

    context.lineWidth = screenPixelsToWorld(scene.camera, 2);

    context.strokeStyle = '#ffd166';
    if (frameOnly) {
      drawTriangleFromPoints(context, bike.frameRearPivot, bike.rearWheelAnchor, bike.rearShockSwingarmAnchor);
    } else {
      drawLine(context, bike.frameRearPivot.x, bike.frameRearPivot.y, bike.rearWheelAnchor.x, bike.rearWheelAnchor.y);
    }
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
    drawAnchorMarker(context, scene.camera, bike.frame.position.x, bike.frame.position.y, '#ffb703');
    drawAnchorMarker(context, scene.camera, bike.swingarm.position.x, bike.swingarm.position.y, '#ffd166');
    drawAnchorMarker(context, scene.camera, bike.fork.position.x, bike.fork.position.y, '#7bdff2');
    drawAnchorMarker(context, scene.camera, bike.rider.position.x, bike.rider.position.y, '#ff99c8');
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

  function drawOverlayLegend(entries: OverlayLegendEntry[], width: number, height: number) {
    if (entries.length === 0) {
      return;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const panelWidth = 520;
    const panelX = Math.max(460, width - panelWidth - 160);
    const panelY = Math.max(Math.floor(height * 0.5), 92);
    const lineHeight = 22;
    const panelHeight = 20 + (entries.length + 1) * lineHeight;

    context.fillStyle = 'rgba(12, 12, 12, 0.82)';
    context.fillRect(panelX, panelY, panelWidth, panelHeight);

    context.strokeStyle = '#323232';
    context.lineWidth = 1;
    context.strokeRect(panelX, panelY, panelWidth, panelHeight);

    context.font = '700 14px monospace';
    context.fillStyle = '#f0f0f0';
    context.fillText('Overlay Legend', panelX + 14, panelY + 24);

    context.font = '14px monospace';
    entries.forEach((entry, index) => {
      context.fillStyle = entry.color;
      context.fillText(entry.label, panelX + 14, panelY + 46 + index * lineHeight);
    });
  }

  function drawTerrainLegend(entries: OverlayLegendEntry[], width: number, height: number) {
    if (entries.length === 0) {
      return;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const panelWidth = 420;
    const panelX = Math.max(560, width - panelWidth - 220);
    const panelY = Math.max(Math.floor(height * 0.5) + 270, 362);
    const lineHeight = 22;
    const panelHeight = 20 + (entries.length + 1) * lineHeight;

    context.fillStyle = 'rgba(12, 12, 12, 0.82)';
    context.fillRect(panelX, panelY, panelWidth, panelHeight);

    context.strokeStyle = '#323232';
    context.lineWidth = 1;
    context.strokeRect(panelX, panelY, panelWidth, panelHeight);

    context.font = '700 14px monospace';
    context.fillStyle = '#f0f0f0';
    context.fillText('Terrain Legend', panelX + 14, panelY + 24);

    context.font = '14px monospace';
    entries.forEach((entry, index) => {
      context.fillStyle = entry.color;
      context.fillText(entry.label, panelX + 14, panelY + 46 + index * lineHeight);
    });
  }

  function drawLabels(width: number, height: number) {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.fillStyle = '#f4f4f4';
    const titleText = 'Bike Trial Game';
    const suffixText = __APP_HEADER_TEXT__.startsWith(titleText) ? __APP_HEADER_TEXT__.slice(titleText.length) : '';

    context.font = '700 14px monospace';
    context.fillText(titleText, 24, 30);

    if (suffixText) {
      const titleWidth = context.measureText(titleText).width;
      context.font = '14px monospace';
      context.fillText(suffixText, 24 + titleWidth, 30);
    }
  }

  function drawHudPanel(title: string, lines: string[], panelX: number, panelY: number, panelWidth: number) {
    if (lines.length === 0) {
      return;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const lineHeight = 22;
    const panelHeight = 20 + (lines.length + 1) * lineHeight;

    context.fillStyle = 'rgba(12, 12, 12, 0.82)';
    context.fillRect(panelX, panelY, panelWidth, panelHeight);

    context.strokeStyle = '#323232';
    context.lineWidth = 1;
    context.strokeRect(panelX, panelY, panelWidth, panelHeight);

    context.fillStyle = '#f0f0f0';
    context.font = '700 14px monospace';
    context.fillText(title, panelX + 14, panelY + 24);

    context.font = '14px monospace';
    lines.forEach((line, index) => {
      context.fillText(line, panelX + 14, panelY + 46 + index * lineHeight);
    });
  }

  return {
    resize,
    render(scene) {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      clear(width, height);
      if (scene.gridVisible) {
        drawGrid(scene.camera, width, height);
      }
      drawTerrain(scene, width, height);
      drawTerrainDebug(scene, width, height);
      drawBike(scene, width, height);
      drawSuspensionDebug(scene, width, height);
      drawLabels(width, height);
      drawHudPanel('Controls', scene.controlsLines, Math.max(24, width - 430 - 160 - Math.floor(width / 6)), 26, 860);
      drawHudPanel('Stats', scene.statsLines, 24, 56, 430);
      drawOverlayLegend(scene.suspensionDebugEnabled ? scene.overlayLegendEntries : [], width, height);
      drawTerrainLegend(scene.terrainDebugEnabled ? scene.terrainLegendEntries : [], width, height);
    },
  };
}

function drawFrameTriangle(
  context: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  angle: number,
  points: Array<{ x: number; y: number }>,
) {
  if (points.length < 3) {
    return;
  }

  const transformedPoints = points.map((point) => rotateAndTranslatePoint(point.x, point.y, originX, originY, angle));

  context.beginPath();
  context.moveTo(transformedPoints[0].x, transformedPoints[0].y);

  for (let index = 1; index < transformedPoints.length; index += 1) {
    context.lineTo(transformedPoints[index].x, transformedPoints[index].y);
  }

  context.closePath();
  context.stroke();
}

function drawAttachedTriangle(
  context: CanvasRenderingContext2D,
  bike: PhysicsRenderState['bike'],
  points: BikeLocalPoint[],
  localTo: BikeRenderingBody | undefined,
) {
  const body = getAttachedBody(bike, localTo);
  drawFrameTriangle(context, body.position.x, body.position.y, body.angle, points);
}

function drawTriangleFromPoints(
  context: CanvasRenderingContext2D,
  pointA: { x: number; y: number },
  pointB: { x: number; y: number },
  pointC: { x: number; y: number },
) {
  context.beginPath();
  context.moveTo(pointA.x, pointA.y);
  context.lineTo(pointB.x, pointB.y);
  context.lineTo(pointC.x, pointC.y);
  context.closePath();
  context.stroke();
}

function rotateAndTranslatePoint(localX: number, localY: number, originX: number, originY: number, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: originX + localX * cos - localY * sin,
    y: originY + localX * sin + localY * cos,
  };
}

function transformAttachedPoint(
  bike: PhysicsRenderState['bike'],
  point: BikeLocalPoint,
  localTo: BikeRenderingBody | undefined,
) {
  const body = getAttachedBody(bike, localTo);
  return rotateAndTranslatePoint(point.x, point.y, body.position.x, body.position.y, body.angle);
}

function getAttachedBody(bike: PhysicsRenderState['bike'], localTo: BikeRenderingBody | undefined): BikeRenderBody {
  switch (localTo) {
    case 'swingarm':
      return bike.swingarm;
    case 'fork':
      return bike.fork;
    case 'rider':
      return bike.rider;
    case 'rearWheel':
      return bike.rearWheel;
    case 'frontWheel':
      return bike.frontWheel;
    case 'frame':
    default:
      return bike.frame;
  }
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
