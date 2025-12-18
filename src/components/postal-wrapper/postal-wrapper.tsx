"use client";

import { ReactNode } from "react";
import styles from "./postal-wrapper.module.css";

interface PostalWrapperProps {
  flip: boolean;
  readonly?: boolean;
  onFlip?: () => void;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}

export const PostalWrapper = ({
  flip,
  readonly = false,
  onFlip,
  children,
  className = "",
  innerClassName = "",
  innerRef,
}: PostalWrapperProps) => {
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!readonly || !onFlip) return;

    // Don't flip if interacting with form elements
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea, button, select, a") && !readonly) {
      return;
    }

    if (e.type === "touchend") {
      e.preventDefault();
    }
    onFlip();
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      role={readonly ? "button" : undefined}
      aria-pressed={readonly ? flip : undefined}
      tabIndex={readonly ? 0 : undefined}
      onClick={readonly ? handleInteraction : undefined}
      onTouchEnd={readonly ? handleInteraction : undefined}
    >
      <div
        className={`${styles.postalWrapper} ${readonly ? styles.readonly : ""}`}
      >
        <div
          ref={innerRef}
          className={`${styles.postalInner} ${
            flip ? styles.flip : ""
          } ${innerClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
