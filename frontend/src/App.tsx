import { useState } from 'react';

type DiagramNode = { id: number; x: number; y: number; label: string };

const initialNodes: DiagramNode[] = [
  { id: 1, x: 80, y: 100, label: 'Client' },
  { id: 2, x: 320, y: 100, label: 'API' },
  { id: 3, x: 560, y: 100, label: 'Database' }
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const addNode = () => {
    const id = Date.now();
    setNodes((current) => [
      ...current,
      { id, x: 80 + (current.length % 3) * 240, y: 240 + Math.floor(current.length / 3) * 120, label: 'New component' }
    ]);
  };

  const renameSelected = () => {
    if (selectedId === null) return;
    const label = window.prompt('Component name', nodes.find((node) => node.id === selectedId)?.label);
    if (label?.trim()) setNodes((current) => current.map((node) => node.id === selectedId ? { ...node, label: label.trim() } : node));
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div><strong>Diagram Interview Prep</strong><span className="subtitle">Basic diagram canvas</span></div>
        <div className="actions"><button onClick={addNode}>＋ Add component</button><button onClick={renameSelected} disabled={selectedId === null}>Rename selected</button></div>
      </header>
      <section className="workspace">
        <aside><h2>Getting started</h2><p>Select a component to rename it, or add a new component to the canvas.</p><div className="status">✓ App is running</div><small>API: {import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}</small></aside>
        <div className="canvas-wrap">
          <svg className="canvas" viewBox="0 0 760 520" role="img" aria-label="Diagram canvas">
            {nodes.slice(0, -1).map((node, index) => { const next = nodes[index + 1]; return <line key={`line-${node.id}`} x1={node.x + 80} y1={node.y + 30} x2={next.x} y2={next.y + 30} className="connector" />; })}
            {nodes.map((node) => <g key={node.id} onClick={() => setSelectedId(node.id)} className={selectedId === node.id ? 'node selected' : 'node'}><rect x={node.x} y={node.y} width="160" height="60" rx="10" /><text x={node.x + 80} y={node.y + 36} textAnchor="middle">{node.label}</text></g>)}
          </svg>
        </div>
      </section>
    </main>
  );
}
