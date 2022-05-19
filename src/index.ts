import { Toolkit } from "./constant";
import Canvas from "./canvas";

let canvas = new Canvas(document.getElementById('canvas') as HTMLCanvasElement);
const rectBtn = document.getElementById('rectangle')
rectBtn?.addEventListener('click', () => {
  rectBtn.classList.add('active');
  if (canvas.state.currentToolkit) {
    canvas.unregisterEventListeners(canvas.state.currentToolkit);
  }
  canvas.registerEventListeners(Toolkit.RECTANGLE);
})
const ellipseBtn = document.getElementById('ellipse')
ellipseBtn?.addEventListener('click', () => {
  ellipseBtn.classList.add('active');
  if (canvas.state.currentToolkit) {
    canvas.unregisterEventListeners(canvas.state.currentToolkit);
  }
  canvas.registerEventListeners(Toolkit.ELLIPSE);
})