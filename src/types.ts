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
