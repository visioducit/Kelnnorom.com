import React, { useState } from 'react';
import { systemNodes } from '@/content/site-data';
import { Layers, Activity, Database, Cpu, DollarSign, Users, TrendingUp } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  operations: <Activity className="w-4 h-4 text-[var(--accent-tech)]" />,
  data: <Database className="w-4 h-4 text-[var(--accent-tech)]" />,
  technology: <Cpu className="w-4 h-4 text-[var(--accent-tech)]" />,
  revenue: <DollarSign className="w-4 h-4 text-[var(--accent-gold)]" />,
  people: <Users className="w-4 h-4 text-[var(--accent-gold)]" />,
  growth: <TrendingUp className="w-4 h-4 text-[var(--accent-tech)]" />,
};

export function SystemMap() {
  const [activeNodeId, setActiveNodeId] = useState<string | null>('operations');

  const activeNode = systemNodes.find((n) => n.id === activeNodeId) || systemNodes[0];

  return (
    <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 lg:p-8 relative overflow-hidden shadow-sm">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--foreground) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} 
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border)] relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]">
            Operating System Map
          </span>
        </div>
        <div className="text-[11px] font-mono uppercase text-[var(--muted)]">
          One Operator × Six System Nodes
        </div>
      </div>

      {/* Main Desktop Interactive Visual */}
      <div className="hidden md:block relative w-full h-[400px] my-4 select-none">
        {/* SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--accent-tech)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {systemNodes.map((node) => {
            const isActive = activeNodeId === node.id;
            return (
              <line
                key={`line-${node.id}`}
                x1="50%"
                y1="50%"
                x2={`${node.position.x}%`}
                y2={`${node.position.y}%`}
                stroke={isActive ? 'var(--accent-gold)' : 'var(--border)'}
                strokeWidth={isActive ? '2' : '1'}
                strokeDasharray={isActive ? 'none' : '4 4'}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Center Node (Kel Nnorom) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center w-36 h-36 rounded-full bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)] shadow-lg p-3 text-center transition-transform duration-300 hover:scale-105">
          <div className="w-7 h-7 rounded-full bg-[var(--accent-gold)]/15 flex items-center justify-center mb-1 text-[var(--accent-gold)]">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[var(--foreground)] tracking-tight">KEL NNOROM</span>
          <span className="text-[10px] text-[var(--muted)] leading-tight mt-0.5">Integrator & Strategist</span>
        </div>

        {/* Peripheral System Nodes */}
        {systemNodes.map((node) => {
          const isActive = activeNodeId === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNodeId(node.id)}
              onMouseEnter={() => setActiveNodeId(node.id)}
              onFocus={() => setActiveNodeId(node.id)}
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-20 flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[var(--surface-elevated)] border-[var(--accent-gold)] text-[var(--foreground)] ring-2 ring-[var(--accent-gold)]/20 shadow-md scale-105'
                  : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent-tech)]'
              }`}
              aria-label={`Inspect ${node.label} system node`}
            >
              {iconMap[node.id] || <Activity className="w-3.5 h-3.5" />}
              <span>{node.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Nodes Stack */}
      <div className="md:hidden flex flex-wrap gap-2 my-4">
        {systemNodes.map((node) => {
          const isActive = activeNodeId === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNodeId(node.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                isActive
                  ? 'bg-[var(--surface-elevated)] border-[var(--accent-gold)] text-[var(--foreground)] font-semibold'
                  : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]'
              }`}
            >
              {iconMap[node.id]}
              <span>{node.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contextual Drawer / Node Details */}
      {activeNode && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] bg-[var(--surface-elevated)]/60 rounded-lg p-4 transition-all duration-300 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-tech)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                {activeNode.label} System Focus
              </h4>
            </div>
            <span className="text-[11px] text-[var(--muted)]">
              {activeNode.description}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--accent-gold)] mr-1">
              Verified Environments:
            </span>
            {activeNode.experiences.map((exp, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-[11px] font-medium bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--foreground)]"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
