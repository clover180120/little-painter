import { EllipseSelection, RectSelection } from './types';

export abstract class Shape {
  startX: number;
  startY: number;
  selectedStartX: number;
  selectedStartY: number;
  zIndex: number;
  selected: boolean;
  selectedShape?: RectSelection | EllipseSelection | undefined

  constructor(
    startX: number,
    startY: number,
    selectedStartX: number,
    selectedStartY: number,
    zIndex: number,
    selected: boolean,
    selectedShape?:RectSelection | EllipseSelection | undefined
  ) {
    this.startX = startX;
    this.startY = startY;
    this.selectedStartX = selectedStartX;
    this.selectedStartY = selectedStartY;
    this.zIndex = zIndex;
    this.selected = selected;
    this.selectedShape = selectedShape
  }
  abstract isShapeSelected(x: number, y: number): boolean;
  abstract draw(): void;
  abstract drawPoints(): void;
  abstract calcPointsPosition(x: number, y: number): RectSelection;
}

export interface Rect {
  startX: number;
  startY: number;
  selectedPointX?: number;
  selectedPointY?: number;
  width: number;
  height: number;
  selected?: boolean;
  selectedShape?: RectSelection;
  zIndex?: number;
  isShapeSelected(x: number, y: number): boolean;
};

export class RectShape extends Shape implements Rect {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  selectedShape?: RectSelection;
  constructor(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    selectedStartX: number,
    selectedStartY: number,
    width: number,
    height: number,
    selected: boolean,
    zIndex: number,
    selectedShape?: RectSelection,
  ) {
    super(startX, startY, selectedStartX, selectedStartY, zIndex, selected);
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.selectedShape = selectedShape
  };

  isShapeSelected(x: number, y: number): boolean {
    const node = new Path2D();
    node.rect(this.startX, this.startY, this.width, this.height);
    return this.ctx.isPointInPath(node, x, y);
  };

  draw() {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.rect(
      this.startX,
      this.startY,
      this.width,
      this.height,
    );
    this.ctx.fillStyle = '#FFF';
    this.ctx.fillRect(
      this.startX,
      this.startY,
      this.width,
      this.height,
    );
    this.ctx.stroke();
    this.ctx.save();
  };

  drawPoints() {
    if (this.selected && this.selectedShape) {
      Object.values(this.selectedShape).map(({ x, y }) => {
        if (!this.ctx) return;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = '#3a3a3a';
        this.ctx.fill();
        this.ctx.stroke();
      });
    }
  };

  calcPointsPosition(startX: number, startY: number) {
    return {
      top: {
        x: startX + this.width / 2,
        y: startY,
      },
      bottom: {
        x: startX + this.width / 2,
        y: startY + this.height,
      },
      left: {
        x: startX,
        y: startY + this.height / 2,
      },
      right: {
        x: startX + this.width,
        y: startY + this.height / 2,
      },
    };
  }
}

export interface Ellipse {
  startX: number;
  startY: number;
  selectedPointX?: number;
  selectedPointY?: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  selected?: boolean;
  selectedShape?: EllipseSelection;
  node?: Path2D;
  zIndex?: number;
  isShapeSelected(x: number, y: number): boolean;
};

export class EllipseShape extends Shape implements Ellipse {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  selectedShape?: EllipseSelection;
  constructor(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    selectedStartX: number,
    selectedStartY: number,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    selected: boolean,
    zIndex: number,
    selectedShape?: EllipseSelection,
  ) {
    super(startX, startY, selectedStartX, selectedStartY, zIndex, selected);
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.centerX = centerX;
    this.centerY = centerY;
    this.selectedShape = selectedShape;
  };

  isShapeSelected(x: number, y: number): boolean {
    const node = new Path2D();
    node.ellipse(this.startX, this.startY, this.width, this.height, 0, 0, 2 * Math.PI);
    return this.ctx.isPointInPath(node, x, y);
  };

  draw() {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.ellipse(
      this.startX,
      this.startY,
      this.width,
      this.height,
      0,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.fillStyle = '#FFF';
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.save();
  };

  drawPoints() {
    if (this.selected && this.selectedShape) {
      Object.values(this.selectedShape).map(({ x, y }) => {
        if (!this.ctx) return;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = '#3a3a3a';
        this.ctx.fill();
        this.ctx.stroke();
      });
    }
  };

  calcPointsPosition(centerX: number, centerY: number) {
    return {
      top: {
        x: centerX,
        y: centerY - this.height,
      },
      bottom: {
        x: centerX,
        y: centerY + this.height,
      },
      left: {
        x: centerX - this.width,
        y: centerY,
      },
      right: {
        x: centerX + this.width,
        y: centerY,
      },
    };
  }
}