export enum Toolkit {
  RECTANGLE,
  ELLIPSE,
  SELECT,
}

export type SelectedShape = {
  top: { x: number; y: number };
  bottom: { x: number; y: number };
  left: { x: number; y: number };
  right: { x: number; y: number };
};

export type RectSelection = SelectedShape;
export type EllipseSelection = SelectedShape;

export type Rect = {
  startX: number;
  startY: number;
  selectedPointX?: number;
  selectedPointY?: number;
  width: number;
  height: number;
  selected?: boolean;
  selectedShape?: RectSelection;
};
export type Ellipse = {
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
};