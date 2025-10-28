import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button";

// Types
export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "success";
  disabled?: boolean;
  loading?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "success" | "warning" | "danger";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  actions?: ModalAction[];
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

// Modal sizes
const modalSizes: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-[min(100vw,80rem)] mx-4",
};

// Header icon per variant (ukuran konsisten + tanpa margin internal yang ganggu layout)
const IconSuccess = () => (
  <div className="p-2 bg-green-100 rounded-full flex items-center justify-center">
    <svg
      className="w-5 h-5 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  </div>
);
const IconWarning = () => (
  <div className="p-2 bg-yellow-100 rounded-full flex items-center justify-center">
    <svg
      className="w-5 h-5 text-yellow-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L5.232 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  </div>
);
const IconDanger = () => (
  <div className="p-2 bg-red-100 rounded-full flex items-center justify-center">
    <svg
      className="w-5 h-5 text-red-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>
);

const HeaderIcon: React.FC<{ variant: NonNullable<ModalProps["variant"]> }> = ({
  variant,
}) => {
  if (variant === "success") return <IconSuccess />;
  if (variant === "warning") return <IconWarning />;
  if (variant === "danger") return <IconDanger />;
  return null;
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-b-white"></div>
);

// Util: ambil elemen fokusable untuk focus trap
const getFocusable = (node: HTMLElement | null) =>
  node
    ? (Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
      ) as HTMLElement[])
    : [];

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  variant = "default",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  actions = [],
  className = "",
  overlayClassName = "",
  contentClassName = "",
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useMemo(
    () =>
      title ? `modal-title-${Math.random().toString(36).slice(2)}` : undefined,
    [title]
  );
  const descId = useMemo(
    () =>
      description
        ? `modal-desc-${Math.random().toString(36).slice(2)}`
        : undefined,
    [description]
  );

  // Handle escape key
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  // Overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) onClose();
  };

  // Focus mgmt: trap + restore
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;
    const panel = panelRef.current;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    // Set initial focus to first focusable (atau close button)
    const focusables = getFocusable(panel);
    (focusables[0] ?? panel)?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panel) return;
      const nodes = getFocusable(panel);
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = "unset";
      // Restore focus
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  // Panel konten
  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-hidden={false}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-100 transition-opacity" />

      {/* Modal Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className={[
          "relative w-full bg-white",
          modalSizes[size],
          "rounded-2xl border shadow-2xl",
          "outline-none",
          "max-h-[85vh] flex flex-col", // supaya konten bisa scroll
          "transform transition-all duration-200",
          "data-[enter]:opacity-0 data-[enter]:translate-y-2 data-[enter]:scale-95",
          "data-[enter-done]:opacity-100 data-[enter-done]:translate-y-0 data-[enter-done]:scale-100",
          className,
        ].join(" ")}
        // flag sederhana untuk animasi enter (tanpa lib)
        data-enter-done
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-black/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-6 pb-3">
            <div className="flex items-start gap-3">
              <HeaderIcon variant={variant} />
              <div className="min-w-0">
                {title && (
                  <h3
                    id={titleId}
                    className="text-lg font-semibold text-gray-900 truncate"
                  >
                    {title}
                  </h3>
                )}
                {description && (
                  <p id={descId} className="mt-1 text-sm text-gray-600">
                    {description}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 h-px bg-gray-200/70" />
          </div>
        )}

        {/* Content (scrollable) */}
        <div className={`px-6 py-4 overflow-y-auto ${contentClassName}`}>
          {children}
        </div>

        {/* Footer Actions (sticky) */}
        {actions.length > 0 && (
          <div className="px-6 pb-6 pt-3">
            <div className="h-px bg-gray-200/70 mb-4" />
            <div className="flex flex-wrap items-center justify-end gap-3">
              {actions.map((action, idx) => (
                <div>
                  {" "}
                  <Button
                    key={idx}
                    onClick={action.onClick}
                    disabled={action.disabled || action.loading}
                    // className={[
                    //   "px-4 py-2 rounded-lg font-medium transition-all",
                    //   "disabled:opacity-50 disabled:cursor-not-allowed",
                    //   "active:scale-95 inline-flex items-center gap-2",
                    //   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    //   buttonVariants[action.variant || "secondary"],
                    // ].join(" ")}
                  >
                    {action.loading && <LoadingSpinner />}
                    {action.label}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
