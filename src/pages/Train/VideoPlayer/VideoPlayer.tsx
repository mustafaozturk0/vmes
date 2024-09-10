import { Box, Card } from "@mui/material";
import Konva from "konva";
import React, { useContext, useEffect, useRef } from "react";
import { Stage, Layer, Line, Text } from "react-konva";

import { useTypedSelector } from "../../../store/hooks";
import { selectedCameraId } from "../../../slices/camera/cameraSlice";
import { SocketContext } from "../../../contexts/SocketContext";
import { usePolygons } from "../../../contexts/PolygonContext";
import { MockVideoPlayer } from "./MockVideoPlayer";
import colors from "../../../utils/colors";
import { PolygonDto } from "../../../api/swagger/swagger.api";

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

  const socket = useContext(SocketContext);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<{ ctx: CanvasRenderingContext2D | null }>({
    ctx: null,
  });

  const [detects, setDetects] = React.useState<string>("");

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

  const handlePolygonClick = (polygonIndex: number) => {
    if (selectedPolygonIndex === polygonIndex) {
      setSelectedPolygonIndex(null);
    } else {
      setSelectedPolygonIndex(polygonIndex);
    }
  };

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

    socket.on("detect", (data: any) => {
      if (data?.polygonId === polygons[0]?.id) {
        setDetects(data.class);
      }
    });

    return () => {
      socket.off("frame");
      socket.off("detect");
      setImageLoaded(false);
      socket.emit("leave", {
        room: "" + cameraId,
      });
      setDetects("");
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
                <Text
                  x={polygons[0]?.points?.[0]?.[0] ?? 0}
                  y={(polygons[0]?.points?.[0]?.[1] ?? 0) - 20}
                  fill={"red"}
                  fontSize={20}
                  text={detects || " "}
                ></Text>
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
                      onClick={() => handlePolygonClick(polygonIndex)}
                    />
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
