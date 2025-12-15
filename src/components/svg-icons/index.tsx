"use client";
import ProhibitBold from "./prohibit";
import LineDiagonal from "./diagonal";
import Snowflake from "./snowflake";
import Diamond from "./diamond";
import styles from "./svgButton.module.css";
import { Button } from "../button/button";

interface ButtonSVGProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  svgName: "classic" | "diagonal" | "snow" | "diamond";
  active?: boolean;
}

const svgAvailable = {
  classic: ProhibitBold,
  diagonal: LineDiagonal,
  snow: Snowflake,
  diamond: Diamond,
};

export const SVGButton = ({
  svgName,
  className,
  active,
  ...props
}: React.PropsWithChildren<ButtonSVGProps>) => {
  return (
    <Button
      className={`${styles.svgButton} ${className} ${
        active ? styles.active : ""
      }`}
      {...props}
    >
      {svgAvailable[svgName]({ size: "20", color: "var(--card)" })}
    </Button>
  );
};
