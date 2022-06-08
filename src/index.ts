import { Toolkit } from "./types";
import { AppImpl } from "./app";

let app = new AppImpl(document.getElementById('canvas') as HTMLCanvasElement);
const tools = [
  {
    node: document.getElementById('rectangle'),
    listeners: {
      click: () => {
        if (app.state.currentToolkit !== Toolkit.RECTANGLE) {
          app.unregisterEventListeners(app.state.currentToolkit, app);
        }
        app.registerEventListeners(Toolkit.RECTANGLE, app);
        app.state.currentToolkit = Toolkit.RECTANGLE;
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
        if (app.state.currentToolkit !== Toolkit.ELLIPSE) {
          app.unregisterEventListeners(app.state.currentToolkit, app);
        }
        app.registerEventListeners(Toolkit.ELLIPSE, app);
        app.state.currentToolkit = Toolkit.ELLIPSE;
      },
    },
  },
  {
    node: document.getElementById('select'),
    listeners: {
      click: () => {
        if (app.state.currentToolkit !== Toolkit.SELECT) {
          app.unregisterEventListeners(app.state.currentToolkit, app);
        }
        app.registerEventListeners(Toolkit.SELECT, app);
        app.state.currentToolkit = Toolkit.SELECT;
      },
    },
  },
];

tools.forEach((nodeObj) => {
  Object.entries(nodeObj.listeners).forEach(([key, value]) => {
    nodeObj.node?.addEventListener(key, value);
  });
});
