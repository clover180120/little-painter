"use strict";
// import { App } from './app';
// import { Shape } from './shapes';
// import { SelectedShape } from './types';
// export const onGroup = (e: MouseEvent, app: App) => {
//   const selectedShapes = app.state.shapeList.filter((shape) => shape.selected);
//   if (selectedShapes.length === 0) return;
//   selectedShapes.forEach(shape => shape.isInGroup = true);
//   const range = calcGroupRange(selectedShapes);
//   const { x, y, w, h } = range;
//   app.state.groupList.push(new Group(selectedShapes, app.ctx, x, y, w, h));
//   const { canvasRect } = app;
//   if (!app.ctx) return;
//   app.ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
//   app.state.groupList.forEach((group) => {
//     group.drawSelection();
//     group.draw();
//   });
// }
// const calcGroupRange = (shapeList: Shape[]) => {
//   const allStartX: number[] = [];
//   const allStartY: number[] = [];
//   const allEndX: number[] = [];
//   const allEndY: number[] = [];
//   shapeList.forEach((shape) => {
//     if (shape.selected) {
//       allStartX.push(shape.startX);
//       allStartY.push(shape.startY);
//       allEndX.push(shape.startX + shape.width);
//       allEndY.push(shape.startY + shape.height);
//     }
//   })
//   const minStartX = Math.min(...allStartX);
//   const minStartY = Math.min(...allStartY);
//   const maxEndX = Math.max(...allEndX);
//   const maxEndY = Math.max(...allEndY);
//   return {
//     x: minStartX,
//     y: minStartY,
//     w: maxEndX - minStartX,
//     h: maxEndY - minStartY,
//   }
// }
// export class Group {
//   shapeList: Shape[];
//   ctx: CanvasRenderingContext2D | null;
//   x: number;
//   y: number;
//   w: number;
//   h: number;
//   constructor(shapeList: Shape[], ctx: CanvasRenderingContext2D | null, x: number, y: number, w: number, h: number) {
//     this.shapeList = shapeList;
//     this.ctx = ctx;
//     this.x = x;
//     this.y = y;
//     this.w = w;
//     this.h = h;
//   }
//   drawSelection(): void {
//     const selection = this.calcSelection();
//     Object.values(selection).map(({ x, y }) => {
//       if (!this.ctx) return;
//       this.ctx.beginPath();
//       this.ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
//       this.ctx.fillStyle = '#3a3a3a';
//       this.ctx.fill();
//       this.ctx.stroke();
//     });
//   }
//   draw(): void {
//     if (!this.ctx) return;
//     this.ctx.beginPath();
//     this.ctx.rect(
//       this.x,
//       this.y,
//       this.w,
//       this.h
//     );
//     this.ctx.stroke();
//     this.ctx.save();
//   }
//   calcSelection(): SelectedShape {
//     const maxXShape = this.shapeList.reduce((p, c) => (p.selectedShape?.right.x as number) <= (c.selectedShape?.right.x as number) ? c : p);
//     const minXShape = this.shapeList.reduce((p, c) => (p.selectedShape?.left.x as number) >= (c.selectedShape?.left.x as number) ? c : p);
//     const maxYShape = this.shapeList.reduce((p, c) => (p.selectedShape?.bottom.y as number) <= (c.selectedShape?.bottom.y as number) ? c : p);
//     const minYShape = this.shapeList.reduce((p, c) => (p.selectedShape?.top.y as number) >= (c.selectedShape?.top.y as number) ? c : p);
//     return {
//       left: {
//         x: minXShape.selectedShape?.left.x as number,
//         y: ((maxYShape.selectedShape?.bottom.y as number) - (minYShape.selectedShape?.top.y as number)) / 2 + (minYShape.selectedShape?.top.y as number),
//       },
//       right: {
//         x: maxXShape.selectedShape?.right.x as number,
//         y: ((maxYShape.selectedShape?.bottom.y as number) - (minYShape.selectedShape?.top.y as number)) / 2 + (minYShape.selectedShape?.top.y as number),
//       },
//       top: {
//         x: (maxXShape.selectedShape?.right.x as number - (minXShape.selectedShape?.left.x as number)) / 2 + (minXShape.selectedShape?.left.x as number),
//         y: minYShape.selectedShape?.top.y as number,
//       },
//       bottom: {
//         x: (maxXShape.selectedShape?.right.x as number - (minXShape.selectedShape?.left.x as number)) / 2 + (minXShape.selectedShape?.left.x as number),
//         y: maxYShape.selectedShape?.bottom.y as number,
//       },
//     }
//   }
// }
