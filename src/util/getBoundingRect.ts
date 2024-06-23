function getBoundingRect(points: DOMPoint[], padding: number = 0): DOMRect {
  if (points.length === 0) {
    throw new Error("At least one point is required");
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return new DOMRect(
    minX - padding,
    minY - padding,
    maxX - minX + 2 * padding,
    maxY - minY + 2 * padding
  );
}

export default getBoundingRect;
