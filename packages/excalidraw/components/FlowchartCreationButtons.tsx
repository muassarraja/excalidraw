import { sceneCoordsToViewportCoords } from "@excalidraw/common";
import { getElementAbsoluteCoords } from "@excalidraw/element";

import type {
  ElementsMap,
  NonDeletedExcalidrawElement,
} from "@excalidraw/element/types";

import type { LinkDirection } from "@excalidraw/element";

import { useExcalidrawAppState } from "./App";
import { ElementCanvasButton } from "./MagicButton";
import { PlusIcon } from "./icons";

import "./FlowchartCreationButtons.scss";

import type { AppState } from "../types";
import type { CSSProperties } from "react";

const BUTTON_SIZE = 32;
const BUTTON_GAP = 8;

const getViewportBounds = (
  element: NonDeletedExcalidrawElement,
  appState: AppState,
  elementsMap: ElementsMap,
) => {
  const [x1, y1, x2, y2] = getElementAbsoluteCoords(element, elementsMap);
  const topLeft = sceneCoordsToViewportCoords(
    { sceneX: x1, sceneY: y1 },
    appState,
  );
  const bottomRight = sceneCoordsToViewportCoords(
    { sceneX: x2, sceneY: y2 },
    appState,
  );

  return {
    left: topLeft.x - appState.offsetLeft,
    top: topLeft.y - appState.offsetTop,
    right: bottomRight.x - appState.offsetLeft,
    bottom: bottomRight.y - appState.offsetTop,
  };
};

const getButtonStyle = (
  direction: LinkDirection,
  bounds: ReturnType<typeof getViewportBounds>,
): CSSProperties => {
  switch (direction) {
    case "up":
      return {
        left: (bounds.left + bounds.right - BUTTON_SIZE) / 2,
        top: bounds.top - BUTTON_GAP - BUTTON_SIZE,
      };
    case "right":
      return {
        left: bounds.right + BUTTON_GAP,
        top: (bounds.top + bounds.bottom - BUTTON_SIZE) / 2,
      };
    case "down":
      return {
        left: (bounds.left + bounds.right - BUTTON_SIZE) / 2,
        top: bounds.bottom + BUTTON_GAP,
      };
    case "left":
      return {
        left: bounds.left - BUTTON_GAP - BUTTON_SIZE,
        top: (bounds.top + bounds.bottom - BUTTON_SIZE) / 2,
      };
  }
};

const directionLabels: Record<LinkDirection, string> = {
  up: "Add node above",
  right: "Add node to the right",
  down: "Add node below",
  left: "Add node to the left",
};

export const FlowchartCreationButtons = ({
  element,
  elementsMap,
  onCreateNode,
}: {
  element: NonDeletedExcalidrawElement;
  elementsMap: ElementsMap;
  onCreateNode(direction: LinkDirection): void;
}) => {
  const appState = useExcalidrawAppState();

  if (
    appState.contextMenu ||
    appState.newElement ||
    appState.resizingElement ||
    appState.isRotating ||
    appState.selectedElementsAreBeingDragged ||
    appState.openMenu ||
    appState.viewModeEnabled
  ) {
    return null;
  }

  const bounds = getViewportBounds(element, appState, elementsMap);

  return (
    <div className="flowchart-creation-buttons">
      {(["up", "right", "down", "left"] as const).map((direction) => (
        <div
          className="flowchart-creation-buttons__button"
          key={direction}
          style={getButtonStyle(direction, bounds)}
        >
          <ElementCanvasButton
            title={directionLabels[direction]}
            icon={PlusIcon}
            checked={false}
            onChange={() => onCreateNode(direction)}
          />
        </div>
      ))}
    </div>
  );
};
