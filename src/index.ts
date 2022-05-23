import { Toolkit } from "./constant";
import Canvas from "./canvas";

let canvas = new Canvas(document.getElementById('canvas') as HTMLCanvasElement);
const rectBtn = document.getElementById('rectangle')
rectBtn?.addEventListener('click', () => {
  rectBtn.classList.add('active');
  if (canvas.state.currentToolkit !== Toolkit.RECTANGLE) {
    canvas.unregisterEventListeners(canvas.state.currentToolkit, canvas);
  }
  canvas.registerEventListeners(Toolkit.RECTANGLE, canvas);
  canvas.state.currentToolkit = Toolkit.RECTANGLE;
})
const ellipseBtn = document.getElementById('ellipse')
ellipseBtn?.addEventListener('click', () => {
  ellipseBtn.classList.add('active');
  if (canvas.state.currentToolkit !== Toolkit.ELLIPSE) {
    canvas.unregisterEventListeners(canvas.state.currentToolkit, canvas);
  }
  canvas.registerEventListeners(Toolkit.ELLIPSE, canvas);
  canvas.state.currentToolkit = Toolkit.ELLIPSE;
})