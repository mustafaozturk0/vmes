import * as React from "react";
import { useEffect, useMemo } from "react";
import { Alert, Grid } from "@mui/material";
import { PowerInput, TableRestaurant } from "@mui/icons-material";
import { CloseSquare, MinusSquare, PlusSquare } from "./TreeExpandIcons";
import { useTranslation } from "react-i18next";
import { DndProvider } from "react-dnd";
import {
  MultiBackend,
  Tree,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { useSnackbar } from "notistack";
import "./factoryTree.css";
import { useAppDispatch, useTypedSelector } from "../../store/hooks";
import { useGetFactoryTreeMutation } from "../../api/factory/factoryApi";
import {
  SelectedTreeNode,
  setExpandedNodeIdsReducer,
  SelectedTreeNodeType,
  selectFactoryTree,
  expandedNodeIdsSelector,
  selectedTreeNodeSelector,
  setSelectedTreeNodeReducer,
} from "../../slices/factory/factorySlice";
import {
  LineDto,
  LineTreeDto,
  PolygonDto,
} from "../../api/swagger/swagger.api";
import { setSelectedCameraId } from "../../slices/camera/cameraSlice";
import { usePolygons } from "../../contexts/PolygonContext";

interface TreeViewProps {
  defaultExpanded: string[];
  onSelectCallback?: (data: SelectedTreeNode) => void;
}

export default function EngineeringTree({ onSelectCallback }: TreeViewProps) {
  const [t] = useTranslation("common");
  const dispatch = useAppDispatch();
  const factoryTree: LineTreeDto[] = useTypedSelector(selectFactoryTree);
  const [treeData, setTreeData] = React.useState<any[]>([]);
  const [getFactoryTree] = useGetFactoryTreeMutation();
  const { enqueueSnackbar } = useSnackbar();
  const expandedIds = useTypedSelector(expandedNodeIdsSelector);
  const selectedTreeNode = useTypedSelector(selectedTreeNodeSelector);
  const ref = React.useRef(null);
  const { setPolygons } = usePolygons();

  useEffect(() => {
    getFactoryTree()
      .unwrap()
      .catch((error) => {
        enqueueSnackbar(t("factory.error"), {
          variant: "error",
        });
      });
  }, []);

  useEffect(() => {
    const treeData: React.SetStateAction<any[]> = [];

    const treeBuf = JSON.parse(JSON.stringify(factoryTree));
    treeBuf?.forEach(
      (
        line: {
          id: string;
          name: any;
          polygons: any[];
        },
        index: any
      ) => {
        treeData.push({
          id: line?.id + "+" + SelectedTreeNodeType.FactoryLine,
          text: line?.name,
          droppable: false,
          parent: 0,
          extra: {
            type: SelectedTreeNodeType.FactoryLine,
            canExpand: true,
          },
        });

        const polygons = line?.polygons || [];
        polygons?.forEach(
          (
            polygon: {
              id: string;
              name: any;
            },
            index: any
          ) => {
            treeData.push({
              id: polygon?.id + "+" + SelectedTreeNodeType.FactoryStation,
              text: polygon?.name,
              droppable: false,
              parent: line?.id + "+" + SelectedTreeNodeType.FactoryLine,
              extra: {
                type: SelectedTreeNodeType.FactoryStation,
                canExpand: false,
              },
            });
          }
        );
      }
    );

    setTreeData(treeData);
  }, [factoryTree]);

  const getNodeIcon = (
    node: any,
    isOpen: boolean,
    onToggle: React.MouseEventHandler<HTMLSpanElement> | undefined
  ) => {
    const smallIconSize = "24px";
    const largeIconSize = "26px";
    let icon = <PowerInput sx={{ fontSize: largeIconSize }} />;
    let color = "inherit";

    switch (node.extra.type) {
      case SelectedTreeNodeType.FactoryLine:
        color = "inherit";
        icon = <PowerInput sx={{ fontSize: largeIconSize }} />;
        break;
      case SelectedTreeNodeType.FactoryStation:
        color = "inherit";
        icon = <TableRestaurant sx={{ fontSize: smallIconSize }} />;
        break;

      default:
        icon = <PowerInput sx={{ fontSize: largeIconSize }} />;
        break;
    }

    const onClickTreeItem = (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      handleNodeSelect(node);
      if (node.extra.type === SelectedTreeNodeType.FactoryStation) {
        const parentLineId = node.parent.split("+")[0];
        const line = factoryTree.find((i) => i.id === Number(parentLineId));
        //@ts-ignore
        const polygon = line?.polygons.find(
          (i) => Number(i.id) === Number(node.id.split("+")[0])
        );
        const cameraId = polygon?.cameraId;
        setPolygons([polygon] as PolygonDto[]);
        dispatch(setSelectedCameraId(cameraId as unknown as string));
      }
    };

    const isSelected = selectedTreeNode?.node?.id === node.id;
    function getLabelInfo() {
      if (!node.extra.type) return "";
      switch (node.extra.type) {
        case SelectedTreeNodeType.FactoryLine:
          return t("factory.line");

        case SelectedTreeNodeType.FactoryMachine:
          return t("factory.machine");

        default:
          return "";
      }
    }
    return (
      <div
        style={{
          display: "flex",
          backgroundColor: isSelected
            ? "rgba(85, 105, 255, 0.3)"
            : "transparent",
          paddingRight: isSelected ? "8px" : "0px",
          borderRadius: isSelected ? "2px" : "0px",
          paddingLeft: "5px",
          boxSizing: "border-box",
          transition: "background-color 0.3s ease-in-out", // Adding a transition for smooth effect
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(200, 200, 200, 0.3)"; // Gray highlight on hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isSelected
            ? "rgba(85, 105, 255, 0.3)"
            : "transparent";
        }}
      >
        <span
          onClick={onToggle}
          style={{
            listStyle: "none",
            display: "flex",
            alignItems: "end",
            width: "fit-content",
          }}
        >
          {isOpen && node.extra.canExpand && (
            <MinusSquare sx={{ cursor: "pointer" }} />
          )}
          {!isOpen && node.extra.canExpand && (
            <PlusSquare sx={{ cursor: "pointer" }} />
          )}
          {!node.extra.canExpand && (
            <CloseSquare sx={{ cursor: "pointer", color: "gray" }} />
          )}
          <span
            style={{ listStyle: "none" }}
            onClick={onClickTreeItem}
            title={getLabelInfo()}
          >
            {node.text}
          </span>
        </span>
      </div>
    );
  };

  const handleNodeSelect = (node: any) => {
    if (onSelectCallback)
      onSelectCallback({ node: node, type: node.extra.type });

    dispatch(
      setSelectedTreeNodeReducer({
        node: node,
        type: node.extra.type,
      })
    );
  };

  return treeData && treeData.length > 0 ? (
    <div
      style={{
        padding: "2px 1px 1px 0px",
        display: "flex",
        justifyContent: "space-between",
        maxHeight: "calc(100vh - 230px)",
        overflowY: "auto",
      }}
    >
      <div style={{ width: "100%", marginLeft: "-32px", marginTop: "-10px" }}>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Tree
            sort={false}
            onDrop={console.log}
            tree={treeData}
            rootId={0}
            initialOpen={expandedIds}
            ref={ref}
            onChangeOpen={(ids) =>
              dispatch(setExpandedNodeIdsReducer(ids as number[]))
            }
            canDrag={(node) => {
              //@ts-ignore
              return node.extra.draggable;
            }}
            //@ts-ignore
            canDrop={(node: FactoryTree, target: any) => {
              return false;
            }}
            render={(node: any, { isOpen, onToggle, depth }) => {
              return (
                <div
                  style={{
                    marginLeft: depth == 6 ? depth * -20 : depth * -25,
                    marginTop: depth,
                    display: "block",
                  }}
                  id={node.id.toString()}
                  className="parent-hover"
                >
                  <Grid container>
                    <Grid xs={12} item>
                      {getNodeIcon(node, isOpen, onToggle)}
                    </Grid>
                  </Grid>
                </div>
              );
            }}
          />
        </DndProvider>
      </div>
    </div>
  ) : (
    <Alert severity="info">{t("factory.noData")}</Alert>
  );
}
