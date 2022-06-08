import { Toolkit } from "./types";
import { AppImpl } from "./app";

let app = new AppImpl(document.getElementById('canvas') as HTMLCanvasElement);
const tools = [
  {
    node: document.getElementById('rectangle'),
    listeners: {
      click: () => {
        if (app.state.currentToolkit !== Toolkit.RECTANGLE) {
          app.unregisterEventListeners(app.state.currentToolkit);
        }
        app.registerEventListeners(Toolkit.RECTANGLE);
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
          app.unregisterEventListeners(app.state.currentToolkit);
        }
        app.registerEventListeners(Toolkit.ELLIPSE);
        app.state.currentToolkit = Toolkit.ELLIPSE;
      },
    },
  },
  {
    node: document.getElementById('select'),
    listeners: {
      click: () => {
        if (app.state.currentToolkit !== Toolkit.SELECT) {
          app.unregisterEventListeners(app.state.currentToolkit);
        }
        app.registerEventListeners(Toolkit.SELECT);
        app.state.currentToolkit = Toolkit.SELECT;
      },
    },
  },
  {
    node: document.getElementById('association'),
    listeners: {
      click: () => {
        if (app.state.currentToolkit !== Toolkit.ASSOCIATION) {
          app.unregisterEventListeners(app.state.currentToolkit);
        }
        app.registerEventListeners(Toolkit.ASSOCIATION);
        app.state.currentToolkit = Toolkit.ASSOCIATION;
      },
    },
  },
  {
    node: document.getElementById('generalization'),
    listeners: {
      click: () => {
        if (app.state.currentToolkit !== Toolkit.GENERALIZATION) {
          app.unregisterEventListeners(app.state.currentToolkit);
        }
        app.registerEventListeners(Toolkit.GENERALIZATION);
        app.state.currentToolkit = Toolkit.GENERALIZATION;
      },
    },
  },
  {
    node: document.getElementById('composition'),
    listeners: {
      click: () => {
        if (app.state.currentToolkit !== Toolkit.COMPOSITION) {
          app.unregisterEventListeners(app.state.currentToolkit);
        }
        app.registerEventListeners(Toolkit.COMPOSITION);
        app.state.currentToolkit = Toolkit.COMPOSITION;
      },
    },
  },
];

tools.forEach((nodeObj) => {
  Object.entries(nodeObj.listeners).forEach(([key, value]) => {
    nodeObj.node?.addEventListener(key, value);
  });
});
