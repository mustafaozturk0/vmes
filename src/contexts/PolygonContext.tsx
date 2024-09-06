import React, { createContext, useState, useContext, ReactNode } from "react";
import { PolygonDto } from "../api/swagger/swagger.api";

interface PolygonsContextType {
  polygons: PolygonDto[];
  setPolygons: (polygons: PolygonDto[]) => void;
  selectedPolygonIndex: number | null;
  setSelectedPolygonIndex: (index: number | null) => void;
}

const PolygonsContext = createContext<PolygonsContextType | undefined>(
  undefined
);
export const PolygonsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [polygons, setPolygons] = useState<PolygonDto[]>([]);
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState<
    number | null
  >(null);

  return (
    <PolygonsContext.Provider
      value={{
        polygons,
        setPolygons,
        selectedPolygonIndex,
        setSelectedPolygonIndex,
      }}
    >
      {children}
    </PolygonsContext.Provider>
  );
};

export const usePolygons = (): PolygonsContextType => {
  const context = useContext(PolygonsContext);
  if (!context) {
    throw new Error("usePolygons must be used within a PolygonsProvider");
  }
  return context;
};
