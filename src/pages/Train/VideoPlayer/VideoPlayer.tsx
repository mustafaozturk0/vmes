import { Box, Card } from "@mui/material";
import Konva from "konva";
import React, { useContext, useEffect, useRef } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import {
  useEditPolygonMutation,
  useDeletePolygonMutation,
} from "../../../api/polygon/polygonApi";
import { useTypedSelector } from "../../../store/hooks";
import { selectedCameraId } from "../../../slices/camera/cameraSlice";
import { SocketContext } from "../../../contexts/SocketContext";
import { usePolygons } from "../../../contexts/PolygonContext";
import { debounce } from "lodash";
import { MockVideoPlayer } from "./MockVideoPlayer";
import colors from "../../../utils/colors";
import { PolygonDto } from "../../../api/swagger/swagger.api";
import {
  selectedTreeNodeSelector,
  selectFactoryTree,
} from "../../../slices/factory/factorySlice";

interface VideoPlayerProps {
  width: number;
  showStage: boolean;
}
export const VideoPlayer = ({ width, showStage }: VideoPlayerProps) => {
  const fixedWidth = 640; //width;
  const fixedHeight = 480; //fixedWidth / aspectRatio;
  const stageRef = useRef<Konva.Stage | null>(null);
  const cameraId = useTypedSelector(selectedCameraId);
  const {
    polygons,
    setPolygons,
    selectedPolygonIndex,
    setSelectedPolygonIndex,
  } = usePolygons();

  const [deletePolygon] = useDeletePolygonMutation();
  const [editPolygon] = useEditPolygonMutation();
  const socket = useContext(SocketContext);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<{ ctx: CanvasRenderingContext2D | null }>({
    ctx: null,
  });
  const factoryTree = useTypedSelector(selectFactoryTree);
  const selectedTreeNode = useTypedSelector(selectedTreeNodeSelector);

  const [detects, setDetects] = React.useState<string[]>([]);

  useEffect(() => {
    window.addEventListener("keydown", handleDeleteKeyPress);
    return () => {
      window.removeEventListener("keydown", handleDeleteKeyPress);
    };
  }, [selectedPolygonIndex, polygons]);

  const scaleFactors = {
    x: fixedWidth / 640,
    y: fixedHeight / 480,
  };

  const handlePolygonDragMove = (
    e: Konva.KonvaEventObject<DragEvent>,
    polygonIndex: number
  ) => {
    const { x, y } = e.target.position();
    const newPolygons = polygons.map((polygon, pIndex) => {
      if (pIndex === polygonIndex) {
        return {
          ...polygon,
          x,
          y,
        };
      }
      return polygon;
    });
    setPolygons(newPolygons);
  };

  const handlePointDragMove = (
    e: Konva.KonvaEventObject<DragEvent>,
    polygonIndex: number,
    pointIndex: number
  ) => {
    const newPolygons = polygons.map((polygon, pIndex) => {
      if (pIndex === polygonIndex) {
        const newPoints = (polygon.points ?? []).map((point, pIndex) => {
          if (pIndex === pointIndex) {
            return [
              e.target.x() - (polygon.x ?? 0),
              e.target.y() - (polygon.y ?? 0),
            ];
          }
          return point;
        });
        return {
          ...polygon,
          points: newPoints,
        };
      }
      return polygon;
    });
    setPolygons(newPolygons);
  };

  const handlePolygonClick = (polygonIndex: number) => {
    if (selectedPolygonIndex === polygonIndex) {
      setSelectedPolygonIndex(null);
    } else {
      setSelectedPolygonIndex(polygonIndex);
    }
  };

  const handleDeleteKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Delete" && selectedPolygonIndex !== null) {
      setPolygons(
        polygons.filter((_, index) => index !== selectedPolygonIndex)
      );
      setSelectedPolygonIndex(null);

      debounceDeletePolygon(polygons[selectedPolygonIndex].id);
    }
  };

  const debounceDeletePolygon = debounce((polygonId) => {
    deletePolygon(polygonId).unwrap();
  }, 1000);
  const debouncedEditPolygon = debounce((polygon) => {
    const lineId = factoryTree.find(
      (i) => i.id === Number(selectedTreeNode?.node?.parent.split("+")[0])
    )?.id;

    editPolygon({
      id: polygon.id,
      lineId: Number(lineId),
      cameraId: Number(cameraId),
      name: polygon.name || "Area " + (polygons.length + 1),
      x: polygon.x,
      y: polygon.y,
      color: polygon.color,
      points: polygon.points,
      conditionPages: polygon.conditionPages,
    }).unwrap();
  }, 1000);

  const handleDragEnd = (
    e: Konva.KonvaEventObject<DragEvent>,
    polygonIndex: number
  ) => {
    const polygon = polygons[polygonIndex];
    debouncedEditPolygon({
      id: polygon.id,
      x: Number(e.target.x().toFixed(0)),
      y: Number(e.target.y().toFixed(0)),
      color: polygon.color,
      points: polygon.points,
      conditionPages: polygon.conditionPages,
    });
  };

  const handlePointDragEnd = (
    e: Konva.KonvaEventObject<DragEvent>,
    polygonIndex: number,
    pointIndex: number
  ) => {
    debounceEditMovePoint(e, polygonIndex, pointIndex);
  };

  const debounceEditMovePoint = debounce((e, polygonIndex, pointIndex) => {
    const newPolygons = polygons.map((polygon, pIndex) => {
      if (pIndex === polygonIndex) {
        const newPoints = (polygon.points ?? []).map((point, pIndex) => {
          if (pIndex === pointIndex) {
            return [
              e.target.x() - (polygon.x ?? 0),
              e.target.y() - (polygon.y ?? 0),
            ];
          }
          return point;
        });
        return {
          ...polygon,
          points: newPoints,
        };
      }
      return polygon;
    });
    setPolygons(newPolygons);
    debouncedEditPolygon(newPolygons[polygonIndex]);
  }, 1000);

  useEffect(() => {
    setImageLoaded(false);
  }, [cameraId]);

  useEffect(() => {
    if (!socket || !socket.connected) {
      console.error("Socket is not initialized or connected");
      return;
    }
    socket.emit("join", {
      room: "" + cameraId,
    });

    let drawing = false;

    socket.on("frame", (data) => {
      if (drawing) {
        return;
      }

      drawing = true;
      const bboxCount = new Float32Array(data, 0, 1)[0];
      let bboxData = new Float32Array([]);

      if (bboxCount > 0) {
        bboxData = new Float32Array(data, 4, bboxCount);
      }

      const frame = new Uint8Array(data, 4 + bboxCount * 4);
      const base64Frame =
        "data:image/jpeg;base64," +
        btoa(
          frame.reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

      if (imgRef.current) {
        imgRef.current.src = base64Frame;
      }
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        let ctx = ctxRef.current.ctx;

        if (!ctx) {
          ctx = canvas.getContext("2d");
          ctxRef.current.ctx = ctx;
        }

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          for (let i = 0; i < bboxData.length; i += 6) {
            const x = bboxData[i];
            const y = bboxData[i + 1];
            const x2 = bboxData[i + 2];
            const y2 = bboxData[i + 3];
            const confidence = bboxData[i + 4];
            const classId = bboxData[i + 5];

            ctx.strokeStyle = colors[classId % colors.length];
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, x2 - x, y2 - y);
          }
        }

        drawing = false;
        setImageLoaded(true);
      }
    });

    socket.on("detect", (data: string) => {
      setDetects([...detects, data]);
    });

    socket.on("not_detect", (data: string) => {
      let buf = detects.filter((d) => d !== data);
      setDetects(buf);
    });

    return () => {
      socket.off("frame");
      socket.off("detect");
      socket.off("not_detect");
      setImageLoaded(false);
      socket.emit("leave", {
        room: "" + cameraId,
      });
      setDetects([]);
    };
  }, [socket, cameraId]);

  const decideColor = (polygon: PolygonDto) => {
    if (detects.includes("" + polygon.id)) {
      return "rgba(255, 0, 0, 0.5)";
    }
    return polygon.color;
  };

  return (
    <Box
      style={{
        width: fixedWidth,
        height: fixedHeight,
        position: "relative",
      }}
    >
      <Card>
        <Box
          style={{
            position: "relative",
            padding: 0,
          }}
        >
          <img
            ref={imgRef}
            width={fixedWidth}
            height={fixedHeight}
            alt="trainVideo"
            style={{
              display: imageLoaded ? "block" : "none",
            }}
          />
          {!imageLoaded && <MockVideoPlayer />}
          <canvas
            ref={canvasRef}
            width={imgRef.current?.width || 640}
            height={imgRef.current?.height || 480}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "auto",
              display: imageLoaded ? "block" : "none",
            }}
          />

          {showStage && (
            <Stage
              width={fixedWidth}
              height={fixedHeight}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 2,
                pointerEvents: "auto",
                display: imageLoaded ? "block" : "none",
              }}
              ref={stageRef}
              scale={{ x: scaleFactors.x, y: scaleFactors.y }}
            >
              <Layer>
                {polygons.map((polygon, polygonIndex) => (
                  <React.Fragment key={polygonIndex}>
                    <Line
                      points={polygon?.points?.flat() || []}
                      closed
                      stroke={
                        selectedPolygonIndex === polygonIndex ? "red" : "blue"
                      }
                      fill={decideColor(polygon)}
                      strokeWidth={
                        selectedPolygonIndex === polygonIndex ? 2 : 0.5
                      }
                      x={polygon.x}
                      y={polygon.y}
                      draggable
                      onDragMove={(e) => handlePolygonDragMove(e, polygonIndex)}
                      onDragEnd={(e) => {
                        handleDragEnd(e, polygonIndex);
                      }}
                      onClick={() => handlePolygonClick(polygonIndex)}
                    />
                    {polygon.points?.map((point, pointIndex) => (
                      <Circle
                        key={pointIndex}
                        // @ts-ignore
                        x={point[0] + polygon?.x || 0}
                        // @ts-ignore
                        y={point[1] + polygon?.y ?? 0}
                        radius={8}
                        onDragEnd={(e) => {
                          handlePointDragEnd(e, polygonIndex, pointIndex);
                        }}
                        fill={
                          selectedPolygonIndex === polygonIndex ? "red" : "blue"
                        }
                        draggable
                        onDragMove={(e) =>
                          handlePointDragMove(e, polygonIndex, pointIndex)
                        }
                      />
                    ))}
                  </React.Fragment>
                ))}
              </Layer>
            </Stage>
          )}
        </Box>
      </Card>
    </Box>
  );
};
