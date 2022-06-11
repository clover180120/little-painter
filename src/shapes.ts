import { EllipseSelection, RectSelection, SelectedShape } from './types';

export abstract class Shape {
  startX: number;
  startY: number;
  selectedStartX: number;
  selectedStartY: number;
  width: number;
  height: number;
  zIndex: number;
  selected: boolean;
  selectedShape?: RectSelection | EllipseSelection | undefined;
  name?: string;

  constructor(
    startX: number,
    startY: number,
    selectedStartX: number,
    selectedStartY: number,
    width: number,
    height: number,
    zIndex: number,
    selected: boolean,
    selectedShape?: RectSelection | EllipseSelection | undefined,
    name?: string,
  ) {
    this.startX = startX;
    this.startY = startY;
    this.selectedStartX = selectedStartX;
    this.selectedStartY = selectedStartY;
    this.width = width;
    this.height = height;
    this.zIndex = zIndex;
    this.selected = selected;
    this.selectedShape = selectedShape;
    this.name = name;
  }
  abstract isShapeSelected(x: number, y: number): boolean;
  abstract draw(): void;
  abstract drawPoints(): void;
  abstract calcPointsPosition(x: number, y: number): SelectedShape;
  abstract fillText(): void;
}

export interface Rect {
  startX: number;
  startY: number;
  width: number;
  height: number;
  selected?: boolean;
  selectedShape?: RectSelection;
  zIndex?: number;
  isShapeSelected(x: number, y: number): boolean;
  name?: string;
};

export class RectShape extends Shape implements Rect {
  ctx: CanvasRenderingContext2D;
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
    name?: string,
  ) {
    super(startX, startY, selectedStartX, selectedStartY, width, height, zIndex, selected);
    this.ctx = ctx;
    this.selectedShape = selectedShape;
    this.name = name;
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

  calcPointsPosition(x: number, y: number) {
    return {
      top: {
        x: x + this.width / 2,
        y,
      },
      bottom: {
        x: x + this.width / 2,
        y: y + this.height,
      },
      left: {
        x,
        y: y + this.height / 2,
      },
      right: {
        x: x + this.width,
        y: y + this.height / 2,
      },
    };
  }

  fillText(): void {
    if (this.name) {
      this.ctx.fillStyle = '#3a3a3a';
      this.ctx.font = "20px Arial";
      this.ctx.fillText(this.name, (this.startX + this.width / 2) - (this.name.length * 4), this.startY + this.height / 2);
    }
  }
}

export interface Ellipse {
  startX: number;
  startY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  selected?: boolean;
  selectedShape?: EllipseSelection;
  zIndex?: number;
  isShapeSelected(x: number, y: number): boolean;
  name?: string;
};

export class EllipseShape extends Shape implements Ellipse {
  ctx: CanvasRenderingContext2D;
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
    name?: string,
  ) {
    super(startX, startY, selectedStartX, selectedStartY, width, height, zIndex, selected);
    this.ctx = ctx;
    this.centerX = centerX;
    this.centerY = centerY;
    this.selectedShape = selectedShape;
    this.name = name;
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

  calcPointsPosition(x: number, y: number) {
    return {
      top: {
        x,
        y: y - this.height,
      },
      bottom: {
        x,
        y: y + this.height,
      },
      left: {
        x: x - this.width,
        y,
      },
      right: {
        x: x + this.width,
        y,
      },
    };
  }

   fillText(): void {
    if (this.name) {
      this.ctx.fillStyle = '#3a3a3a';
      this.ctx.font = "20px Arial";
      this.ctx.fillText(this.name, this.startX -  this.name.length * 4, this.startY);
    }
  }
}