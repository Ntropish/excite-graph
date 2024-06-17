/**
 * Scale a rectangle by a certain amount, optionally around a given origin.
 * @param {Rect} rect - The rectangle to scale.
 * @param {V2 | number} amount - The amount to scale the rectangle. If this is a `V2`, the rectangle will be scaled in the x and y directions independently. If this is a number, the rectangle will be uniformly scaled in both directions.
 * @param {V2} [origin] - The point to scale the rectangle around. If this is not provided, the rectangle will be scaled around its own origin (its top-left corner).
 * @return {Rect} The scaled rectangle.
 */
export default function scaleRect(
  rect: DOMRect,
  amount: DOMPoint | number,
  origin?: DOMPoint
): DOMRect {
  const newRect = DOMRect.fromRect(rect);

  if (typeof amount === "number") {
    if (origin) {
      newRect.x = origin.x + (newRect.x - origin.x) * amount;
      newRect.y = origin.y + (newRect.y - origin.y) * amount;
    }
    newRect.width *= amount;
    newRect.height *= amount;
  } else {
    if (origin) {
      newRect.x = origin.x + (newRect.x - origin.x) * amount.x;
      newRect.y = origin.y + (newRect.y - origin.y) * amount.y;
    }
    newRect.width *= amount.x;
    newRect.height *= amount.y;
  }

  return newRect;
}
