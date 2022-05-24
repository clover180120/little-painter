import { Toolkit } from "./constant";
import Canvas from "./canvas";

let canvas = new Canvas(document.getElementById('canvas') as HTMLCanvasElement);

const nodes = [
  {
    node: document.getElementById('rectangle'),
    listeners: {
      click: () => {
        if (canvas.state.currentToolkit !== Toolkit.RECTANGLE) {
          canvas.unregisterEventListeners(canvas.state.currentToolkit, canvas);
        }
        canvas.registerEventListeners(Toolkit.RECTANGLE, canvas);
        canvas.state.currentToolkit = Toolkit.RECTANGLE;
      }
    }
  },
  {
    node: document.querySelector('.toolbar'),
    listeners: {
      click: (e: Event) => {
        const toolbarItems = document.querySelectorAll('.toolbar-item');
        toolbarItems.forEach(i => i.classList.remove('active'));
        const target = e.target as Element;
        target.classList.add('active');
      }
    }
  },
  {
    node: document.getElementById('ellipse'),
    listeners: {
      click: () => {
        if (canvas.state.currentToolkit !== Toolkit.ELLIPSE) {
          canvas.unregisterEventListeners(canvas.state.currentToolkit, canvas);
        }
        canvas.registerEventListeners(Toolkit.ELLIPSE, canvas);
        canvas.state.currentToolkit = Toolkit.ELLIPSE;
      },
    }
  }
]

nodes.forEach((nodeObj) => {
  Object.entries(nodeObj.listeners).forEach(([key, value]) => {
    nodeObj.node?.addEventListener(key, value)
  })
})
