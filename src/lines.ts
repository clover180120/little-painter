import { Shape } from './shapes';
import { ConnectionPorts } from './types';

export abstract class Line {
  fromShape: Shape;
  toShape: Shape;
  ctx: CanvasRenderingContext2D;

  constructor(fromShape: Shape, toShape: Shape, ctx: CanvasRenderingContext2D) {
    this.fromShape = fromShape;
    this.toShape = toShape;
    this.ctx = ctx;
  }
  abstract drawLine(): void;
  findConnectionPort(): ConnectionPorts | null {
    if (this.fromShape.selectedShape && this.toShape.selectedShape) {
      let minDistance = Number.MAX_VALUE;
      let connectionPorts: ConnectionPorts = {
        from: {x: 0, y: 0},
        to: {x: 0, y: 0},
      };
      for (const fromPoint of Object.values(this.fromShape.selectedShape)) {
        for (const toPoint of Object.values(this.toShape.selectedShape)) {
          const xDiff = fromPoint.x - toPoint.x;
          const yDiff = fromPoint.y - toPoint.y;
          const dist = Math.sqrt((Math.pow(xDiff, 2) + Math.pow(yDiff, 2)));
          if (dist < minDistance) {
            minDistance = dist;
            connectionPorts.from = fromPoint;
            connectionPorts.to = toPoint;
          }
        }
      }
      return connectionPorts;
    }
    return null;
  };
}

export class AssociationLine extends Line {
  drawLine(): void {
    const connectionPorts = this.findConnectionPort();
    if (connectionPorts) {
      this.ctx.beginPath();
      this.ctx.moveTo(connectionPorts.from.x, connectionPorts.from.y);
      this.ctx.lineTo(connectionPorts.to.x, connectionPorts.to.y);
      this.ctx.stroke();
    }
  }
}

export class GeneralizationLine extends Line {
  drawLine(): void {
    const connectionPorts = this.findConnectionPort();
    if (connectionPorts) {
      const adx = connectionPorts.to.x - connectionPorts.from.x;
      const ady = connectionPorts.to.y - connectionPorts.from.y;
      const middleX = adx * 0.9 + connectionPorts.from.x;
      const middleY = ady * 0.9 + connectionPorts.from.y;
      const tdx = connectionPorts.to.x - middleX;
      const tdy = connectionPorts.to.y - middleY;
      this.ctx.beginPath();
      this.ctx.moveTo(connectionPorts.from.x, connectionPorts.from.y);
      this.ctx.lineTo(middleX, middleY);
      this.ctx.moveTo(middleX + 0.5 * tdy, middleY - 0.5 * tdx);
      this.ctx.lineTo(middleX - 0.5 * tdy, middleY + 0.5 * tdx);
      this.ctx.lineTo(connectionPorts.to.x, connectionPorts.to.y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }
}

export class CompositionLine extends Line {
   drawLine(): void {
    const connectionPorts = this.findConnectionPort();
    if (connectionPorts) {
      const adx = connectionPorts.to.x - connectionPorts.from.x; 
      const ady = connectionPorts.to.y - connectionPorts.from.y;
      const middleStartX = adx * 0.9 + connectionPorts.from.x;
      const middleStartY = ady * 0.9 + connectionPorts.from.y;
      const middleX = adx * 0.95 + connectionPorts.from.x;
      const middleY = ady * 0.95 + connectionPorts.from.y;
      const tdx = connectionPorts.to.x - middleX;
      const tdy = connectionPorts.to.y - middleY;
      this.ctx.beginPath();
      this.ctx.moveTo(connectionPorts.from.x, connectionPorts.from.y);
      this.ctx.lineTo(middleStartX, middleStartY);
      this.ctx.lineTo(middleX + 0.5 * tdy, middleY - 0.5 * tdx);
      this.ctx.lineTo(connectionPorts.to.x, connectionPorts.to.y);
      this.ctx.lineTo(middleX - 0.5 * tdy, middleY + 0.5 * tdx);
      this.ctx.lineTo(middleStartX, middleStartY);
      this.ctx.stroke();
    }
  }
}
