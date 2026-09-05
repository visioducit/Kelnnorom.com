import { useState, useEffect, useRef } from 'react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { X, ArrowUpRight, GripHorizontal } from 'lucide-react';
import { useCms } from '@/lib/cms-store';

export function WhatsAppFloatingWidget() {
  const { state } = useCms();
  const [isOpen, setIsOpen] = useState(false);

  // Position state (null = initial bottom-right default)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialPosX: number;
    initialPosY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
    hasMoved: false,
  });

  const buttonRef = useRef<HTMLDivElement | null>(null);

  const phone = state.settings?.whatsappNumber || '+2348054397057';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const defaultText = encodeURIComponent(
    state.settings?.whatsappPrefillText ||
      'Hello Kel, I would like to discuss an operational advisory inquiry.'
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultText}`;

  // Initialize position to bottom right once mounted and handle window resizes
  useEffect(() => {
    const updateInitialOrClampedPos = () => {
      const btnSize = 56;
      const margin = 24;
      const maxX = Math.max(12, window.innerWidth - btnSize - margin);
      const maxY = Math.max(12, window.innerHeight - btnSize - margin);

      setPosition((prev) => {
        if (!prev) {
          return { x: maxX, y: maxY };
        }
        return {
          x: Math.min(Math.max(12, prev.x), maxX),
          y: Math.min(Math.max(12, prev.y), maxY),
        };
      });
    };

    updateInitialOrClampedPos();
    window.addEventListener('resize', updateInitialOrClampedPos);
    return () => window.removeEventListener('resize', updateInitialOrClampedPos);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with primary mouse button or single touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const targetEl = buttonRef.current;
    if (!targetEl) return;

    targetEl.setPointerCapture(e.pointerId);

    const currentX = position?.x ?? (window.innerWidth - 80);
    const currentY = position?.y ?? (window.innerHeight - 80);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: currentX,
      initialPosY: currentY,
      hasMoved: false,
    };

    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    // Check if moved past click threshold (5px)
    if (Math.hypot(deltaX, deltaY) > 5) {
      dragStartRef.current.hasMoved = true;
    }

    const btnSize = 56;
    const maxX = Math.max(12, window.innerWidth - btnSize - 12);
    const maxY = Math.max(12, window.innerHeight - btnSize - 12);

    const newX = Math.min(Math.max(12, dragStartRef.current.initialPosX + deltaX), maxX);
    const newY = Math.min(Math.max(12, dragStartRef.current.initialPosY + deltaY), maxY);

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setIsDragging(false);

    // If it was just a click (not dragged), toggle popup
    if (!dragStartRef.current.hasMoved) {
      setIsOpen((prev) => !prev);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDragging(false);
  };

  // Determine popup position relative to widget (opens above if in lower half, below if in upper half)
  const isUpperHalf = position ? position.y < window.innerHeight / 2 : false;
  const isLeftHalf = position ? position.x < window.innerWidth / 2 : false;

  return (
    <div
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        transform: position ? `translate3d(${position.x}px, ${position.y}px, 0)` : undefined,
        left: 0,
        top: 0,
        touchAction: 'none',
      }}
      className={`fixed z-50 select-none print:hidden cursor-grab active:cursor-grabbing ${
        !position ? 'bottom-6 right-6' : ''
      }`}
      aria-label="Movable WhatsApp chat widget"
    >
      {/* Expanded Quick Chat Box */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className={`absolute w-80 sm:w-96 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-2xl p-5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 z-50 cursor-default ${
            isUpperHalf ? 'top-16 mt-2' : 'bottom-16 mb-2'
          } ${isLeftHalf ? 'left-0' : 'right-0'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center border border-[#25D366]/40">
                <WhatsAppIcon size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--foreground)] tracking-tight">
                  Kel Nnorom — Executive Chat
                </div>
                <div className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Direct WhatsApp Channel
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
              aria-label="Close WhatsApp chat card"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)] mb-4 leading-relaxed">
            <p className="font-medium text-[var(--foreground)] mb-1">
              Start an operational inquiry or advisory consultation:
            </p>
            <p>
              Direct access for leadership teams, founders, and enterprises exploring operations, supply chain, or digital scaling.
            </p>
          </div>

          {/* Action Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm transition-all shadow-lg shadow-[#25D366]/25"
          >
            <WhatsAppIcon size={18} />
            <span>Open WhatsApp</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative group">
        <div
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center border-2 border-emerald-200/50 shadow-2xl shadow-[#25D366]/40 transition-transform duration-150 ${
            isDragging ? 'scale-110 shadow-emerald-500/60 ring-4 ring-emerald-400/30' : 'hover:scale-105'
          }`}
          title="Drag to reposition, click to chat on WhatsApp"
        >
          <WhatsAppIcon size={26} />

          {/* Subtle Drag Handle Grip Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black/70 backdrop-blur-xs text-white/90 flex items-center justify-center border border-white/20 shadow-xs">
            <GripHorizontal size={11} className="text-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

