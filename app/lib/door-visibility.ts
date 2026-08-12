const DOOR_OPENING_HIDE_VIEWPORTS = 2.15;

export const hasPassedDoorOpening = (
  scrollOffset: number,
  viewportHeight: number,
) => scrollOffset >= Math.max(1, viewportHeight) * DOOR_OPENING_HIDE_VIEWPORTS;
