import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;   // the card to anchor to
  moves: string[];
  onClose: () => void;
  side?: "right" | "left";
};

export default function MovesPopover({
  open,
  anchorEl,
  moves,
  onClose,
  side = "right",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });

  const place = () => {
    if (!anchorEl || !ref.current) return;
    const a = anchorEl.getBoundingClientRect();
    const p = ref.current.getBoundingClientRect();
    const gap = 8;

    const preferRight = side === "right";
    const canRight = a.right + gap + p.width <= window.innerWidth;
    const canLeft = a.left - gap - p.width >= 0;

    const left = preferRight && canRight
      ? a.right + gap
      : canLeft
      ? a.left - gap - p.width
      : Math.min(Math.max(a.right + gap, 8), window.innerWidth - p.width - 8);

    let top = a.top + a.height / 2 - p.height / 2;
    top = Math.min(Math.max(top, 8), window.innerHeight - p.height - 8);

    setPos({ top, left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(place);
    return () => cancelAnimationFrame(id);
  }, [open, anchorEl, moves.length]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => place();
    const onResize = () => place();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, anchorEl]);

  if (!open) return null;

  return createPortal(
    <div
      ref={ref}
      style={{ position: "fixed", top: pos.top, left: pos.left }}
      className={clsx(
        "z-[9999] w-56 h-32 overflow-auto rounded-md border border-gray-300",
        "bg-white shadow-lg p-2 text-[11px] duration-400 ease-in-out"
      )}
      role="dialog"
    >
      {moves.length ? (
        <ul className="space-y-1 pr-1">
          {moves.map((m) => (
            <li key={m} className="px-2 py-1 rounded bg-blue-50 text-blue-800 capitalize">
              {m.replace(/-/g, " ")}
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-2 py-1 text-gray-600">No moves selected.</div>
      )}
    </div>,
    document.body
  );
}
