import { Toolkit } from "./types";
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
      },
    },
  },
  {
    node: document.querySelector('.toolbar'),
    listeners: {
      click: (e: Event) => {
        const toolbarItems = document.querySelectorAll('.toolbar-item');
        toolbarItems.forEach((i) => i.classList.remove('active'));
        const target = e.target as Element;
        target.classList.add('active');
      },
    },
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
    },
  },
  {
    node: document.getElementById('select'),
    listeners: {
      click: () => {
        if (canvas.state.currentToolkit !== Toolkit.SELECT) {
          canvas.unregisterEventListeners(canvas.state.currentToolkit, canvas);
        }
        canvas.registerEventListeners(Toolkit.SELECT, canvas);
        canvas.state.currentToolkit = Toolkit.SELECT;
      },
    },
  },
];

nodes.forEach((nodeObj) => {
  Object.entries(nodeObj.listeners).forEach(([key, value]) => {
    nodeObj.node?.addEventListener(key, value);
  });
});

let dropdown = document.getElementById('dropdown-btn');
let dropdownContent = document.querySelector('.dropdown-content');
dropdown?.addEventListener('click', () => {
  dropdownContent?.classList.toggle('show');
});
