import { newElement, Scene } from "@excalidraw/element";

import { AppFlowchart } from "./App.flowchart";

import type App from "./App";

describe("AppFlowchart", () => {
  it("creates and commits a bound node from a directional control", () => {
    const startNode = newElement({
      type: "rectangle",
      x: 100,
      y: 100,
      width: 160,
      height: 100,
    });
    const insertNewElements = vi.fn();
    const syncActionResult = vi.fn();
    const app = {
      state: {
        currentItemEndArrowhead: "arrow",
      },
      scene: new Scene([startNode], { skipValidation: true }),
      insertNewElements,
      setState: vi.fn(),
      revealIfHidden: vi.fn(),
      syncActionResult,
    } as unknown as App;

    new AppFlowchart(app).createNodeInDirection(startNode, "right");

    const [createdNode, arrow] = insertNewElements.mock.calls[0][0];
    expect(createdNode).toMatchObject({
      type: "rectangle",
      x: startNode.x + startNode.width + 100,
      y: startNode.y,
    });
    expect(arrow).toMatchObject({
      type: "arrow",
      elbowed: true,
      startBinding: { elementId: startNode.id },
    });
    expect(syncActionResult).toHaveBeenCalled();
  });
});
