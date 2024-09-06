import { IPolygonOptions } from "./PolygonOptions";

export const polygonOptionsList: IPolygonOptions[] = [
  {
    type: "Triangle",
    defaultCoordinates: [
      [90, 0],
      [180, 180],
      [0, 180],
    ],
    shape: `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <polygon points="30,0 60,60 0,60" fill="#213150" stroke="#213150" />
      </svg>`,
    color: "rgba(0, 0, 255, 0.3)",
  },
  {
    type: "Square",
    defaultCoordinates: [
      [0, 0],
      [180, 0],
      [180, 180],
      [0, 180],
    ],
    shape: `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="0"
          y="0"
          width="60"
          height="60"
          fill="#213150"
          stroke="#213150"
        />
      </svg>`,
    color: "rgba(0, 0, 255, 0.3)",
  },
  {
    type: "Pentagon",
    defaultCoordinates: [
      [90, 0],
      [174, 66],
      [138, 174],
      [42, 174],
      [6, 66],
    ],
    shape: `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="30,0 60,20 54,60 6,60 0,20"
          fill="#213150"
          stroke="#213150"
        />
      </svg>`,
    color: "rgba(0, 0, 255, 0.3)",
  },
  {
    type: "Hexagon",
    defaultCoordinates: [
      [90, 0],
      [180, 60],
      [180, 150],
      [90, 210],
      [0, 150],
      [0, 60],
    ],
    shape: `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="30,0 60,30 60,60 30,90 0,60 0,30"
          fill="#213150"
          stroke="#213150"
        />
      </svg>`,
    color: "rgba(0, 0, 255, 0.3)",
  },
];
