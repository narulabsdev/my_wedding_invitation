type Rectangle = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

export const isPointInsideContainedImage = (
  point: Point,
  box: Rectangle,
  naturalWidth: number,
  naturalHeight: number,
) => {
  if (naturalWidth <= 0 || naturalHeight <= 0) return false;

  const scale = Math.min(box.width / naturalWidth, box.height / naturalHeight);
  const renderedWidth = naturalWidth * scale;
  const renderedHeight = naturalHeight * scale;
  const left = box.left + (box.width - renderedWidth) / 2;
  const top = box.top + (box.height - renderedHeight) / 2;

  return point.x >= left && point.x <= left + renderedWidth &&
    point.y >= top && point.y <= top + renderedHeight;
};
