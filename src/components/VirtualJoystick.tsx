import React, { useRef, useState } from 'react';

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove }) => {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const maxRadius = 38;

  const updateFromClient = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }
    setKnobOffset({ x: dx, y: dy });
    // Up on screen (-dy) corresponds to forward movement (+y)
    onMove(dx / maxRadius, -dy / maxRadius);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    pointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClient(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    updateFromClient(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    pointerIdRef.current = null;
    setKnobOffset({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="Movement joystick"
      className="pointer-events-auto relative w-28 h-28 rounded-full bg-[#F7F6F2]/85 border border-[#1B2B23]/20 shadow-lg flex items-center justify-center touch-none select-none"
    >
      {/* Subtle cardinal ticks */}
      <div className="absolute top-2.5 w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/40" />
      <div className="absolute bottom-2.5 w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/40" />
      <div className="absolute left-2.5 w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/40" />
      <div className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/40" />

      {/* Thumb knob */}
      <div
        style={{
          transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)`,
        }}
        className="w-12 h-12 rounded-full bg-[#2D6A4F] border-2 border-[#F7F6F2] shadow-md transition-transform duration-75 ease-out flex items-center justify-center"
      >
        <div className="w-3.5 h-3.5 rounded-full bg-[#F7F6F2]/85" />
      </div>
    </div>
  );
};
