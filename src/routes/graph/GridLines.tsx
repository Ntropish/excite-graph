import React, { useMemo } from "react";
import { scaleLinear } from "d3-scale";

interface GridProps {
  width: number;
  height: number;
  viewBoxRect: DOMRect; // Using DOMRect as the type for viewBoxRect
}

const Grid: React.FC<GridProps> = ({ width, height, viewBoxRect }) => {
  const xScale = scaleLinear()
    .domain([viewBoxRect.x, viewBoxRect.x + viewBoxRect.width])
    .range([0, width]);

  const yScale = scaleLinear()
    .domain([viewBoxRect.y, viewBoxRect.y + viewBoxRect.height])
    .range([0, height]);

  const minorX = xScale.ticks(Math.floor(viewBoxRect.width / 20));
  const minorY = yScale.ticks(Math.floor(viewBoxRect.height / 20));

  const horizontalLines = useMemo(() => {
    return minorY.map((tick) => {
      return (
        <line
          key={`horizontal-${tick}`}
          className="minor-grid-line"
          stroke="#e0e0e0"
          strokeWidth="0.5"
          x1={viewBoxRect.x}
          x2={viewBoxRect.x + viewBoxRect.width}
          y1={tick}
          y2={tick}
        />
      );
    });
  }, [minorY, viewBoxRect]);

  const verticalLines = useMemo(() => {
    return minorX.map((tick) => {
      return (
        <line
          key={`vertical-${tick}`}
          className="minor-grid-line"
          stroke="#e0e0e0"
          strokeWidth="0.5"
          x1={tick}
          x2={tick}
          y1={viewBoxRect.y}
          y2={viewBoxRect.y + viewBoxRect.height}
        />
      );
    });
  }, [minorX, viewBoxRect]);

  return (
    <>
      <g>
        {horizontalLines}
        {verticalLines}
      </g>
    </>
  );
};

export default Grid;
