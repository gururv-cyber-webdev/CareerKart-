import React from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';

const RoadmapChart = ({ roadmapSteps }) => {
  const nodes = roadmapSteps.map((label, index) => ({
    id: `${index}`,
    data: { label },
    position: { x: 200, y: index * 120 },
  }));

  const edges = roadmapSteps.slice(1).map((_, i) => ({
    id: `e${i}-${i + 1}`,
    source: `${i}`,
    target: `${i + 1}`,
    type: 'smoothstep',
  }));

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <ReactFlow elements={[...nodes, ...edges]}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default RoadmapChart;
