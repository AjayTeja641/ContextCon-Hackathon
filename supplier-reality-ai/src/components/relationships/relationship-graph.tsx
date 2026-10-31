"use client";

import React, { useState, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { RelationshipGraphData, GraphEntityNode, GraphRelationshipEdge } from "@/types";
import { Building2, User, MapPin, AlertTriangle, ShieldCheck, ExternalLink, Info } from "lucide-react";

interface RelationshipGraphProps {
  graphData: RelationshipGraphData;
}

// Custom Node Component with enterprise styling
function CustomEntityNode({ data }: { data: GraphEntityNode }) {
  const getIcon = () => {
    switch (data.entityType) {
      case "COMPANY":
        return <Building2 className="w-4 h-4 text-sky-400" />;
      case "FOUNDER":
      case "DIRECTOR":
        return <User className="w-4 h-4 text-indigo-400" />;
      case "ADDRESS":
        return <MapPin className="w-4 h-4 text-amber-400" />;
      case "PREVIOUS_VENTURE":
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBorderColor = () => {
    if (data.isPrimary) return "border-sky-500 shadow-sky-500/20";
    if (data.hasDiscrepancy) return "border-rose-500/80 shadow-rose-500/10";
    return "border-slate-800 hover:border-slate-700";
  };

  return (
    <div
      className={`px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs shadow-lg min-w-[190px] transition-all cursor-pointer ${getBorderColor()}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-600" />
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1 rounded-md bg-slate-800">{getIcon()}</div>
        <div className="flex-1 truncate">
          <div className="font-semibold text-slate-100 truncate">{data.label}</div>
          <div className="text-[10px] text-slate-400 truncate">{data.subLabel || data.entityType}</div>
        </div>
        {data.hasDiscrepancy && (
          <span title="Discrepancy or Regulatory Notice flagged">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-600" />
    </div>
  );
}

const nodeTypes = {
  custom: CustomEntityNode,
};

export function RelationshipGraph({ graphData }: RelationshipGraphProps) {
  const [selectedEntity, setSelectedEntity] = useState<GraphEntityNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphRelationshipEdge | null>(null);

  // Layout nodes radially / hierarchical
  const nodes: Node[] = useMemo(() => {
    const total = graphData.nodes.length;
    const centerX = 350;
    const centerY = 240;
    const radius = 220;

    return graphData.nodes.map((node, i) => {
      let x = centerX;
      let y = centerY;

      if (!node.isPrimary) {
        const angle = ((i - 1) / (total - 1 || 1)) * 2 * Math.PI - Math.PI / 2;
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      }

      return {
        id: node.id,
        type: "custom",
        position: { x, y },
        data: node,
      };
    });
  }, [graphData.nodes]);

  const edges: Edge[] = useMemo(() => {
    return graphData.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: e.isSuspicious,
      style: {
        stroke: e.isSuspicious ? "#f43f5e" : "#475569",
        strokeWidth: e.isSuspicious ? 2 : 1.5,
      },
      labelStyle: {
        fill: e.isSuspicious ? "#f43f5e" : "#94a3b8",
        fontSize: 10,
        fontWeight: 500,
      },
      data: e,
    }));
  }, [graphData.edges]);

  const onNodeClick = (_: any, node: Node) => {
    setSelectedEntity(node.data as unknown as GraphEntityNode);
    setSelectedEdge(null);
  };

  const onEdgeClick = (_: any, edge: Edge) => {
    setSelectedEdge(edge.data as unknown as GraphRelationshipEdge);
    setSelectedEntity(null);
  };

  return (
    <div className="relative w-full h-[580px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800 text-xs">
        <div className="font-semibold text-slate-200 flex items-center gap-2">
          <span>Entity &amp; Network Intelligence Graph</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
            {graphData.nodes.length} Nodes · {graphData.edges.length} Edges
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Click any node or connection edge to view forensic evidence &amp; citations
        </p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 fill-slate-300" />
        <MiniMap
          nodeColor={(n) => {
            const data = n.data as unknown as GraphEntityNode;
            if (data?.isPrimary) return "#0284c7";
            if (data?.hasDiscrepancy) return "#f43f5e";
            return "#475569";
          }}
          className="!bg-slate-900 !border-slate-800 rounded-lg"
        />
      </ReactFlow>

      {/* Inspector Side Drawer */}
      {(selectedEntity || selectedEdge) && (
        <div className="absolute right-4 top-4 bottom-4 w-80 bg-slate-900/95 backdrop-blur-lg border border-slate-800 rounded-xl p-4 shadow-2xl z-20 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {selectedEntity ? "Entity Inspector" : "Relationship Evidence"}
              </span>
              <button
                onClick={() => {
                  setSelectedEntity(null);
                  setSelectedEdge(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-300 p-1"
              >
                ✕
              </button>
            </div>

            {selectedEntity && (
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Label</div>
                  <div className="text-sm font-semibold text-slate-100">{selectedEntity.label}</div>
                  <div className="text-slate-400">{selectedEntity.subLabel}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Type</div>
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px] mt-0.5">
                    {selectedEntity.entityType}
                  </span>
                </div>

                {selectedEntity.hasDiscrepancy && (
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-[11px] flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Discrepancy Flag</div>
                      <div>This entity is associated with conflicting records or regulatory notices.</div>
                    </div>
                  </div>
                )}

                {selectedEntity.metadata && (
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-medium mb-1">
                      Attributes
                    </div>
                    <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                      {Object.entries(selectedEntity.metadata).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2">
                          <span className="text-slate-500">{k}:</span>
                          <span className="text-slate-300 text-right truncate">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedEdge && (
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Connection</div>
                  <div className="text-sm font-semibold text-slate-100">{selectedEdge.label}</div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    {selectedEdge.relationshipType}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Confidence</div>
                  <div className="text-slate-300 font-semibold">
                    {(selectedEdge.confidence * 100).toFixed(0)}% Corroborated
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-semibold text-indigo-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Evidence Excerpt</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {selectedEdge.evidenceText}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Source Reference</div>
                  <div className="text-slate-300 text-[11px] bg-slate-800/40 p-1.5 rounded border border-slate-700/50">
                    {selectedEdge.sourceReference}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Source: Supplier Reality Graph Layer · Neo4j/NetworkX format
          </div>
        </div>
      )}
    </div>
  );
}
