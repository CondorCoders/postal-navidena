"use client";
import ProhibitBold from "./prohibit";
import LineDiagonal from "./diagonal";
import Snowflake from "./snowflake";
import Diamond from "./diamond";
import styles from "./svgButton.module.css";

interface ButtonSVGProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  svgName: "classic" |
  "diagonal" |
  "snow" |
  "diamond";
}

export const SVGButton = ({
  svgName,
  className,
  ...props
}: React.PropsWithChildren<ButtonSVGProps>) => {
  const svgAvailable = {
    classic: ProhibitBold,
    diagonal: LineDiagonal,
    snow: Snowflake,
    diamond: Diamond
  };
  return (
    <button className={`${styles.svgButton} ${className}`} {...props}>
      {svgAvailable[svgName]({size: "20", color: "var(--card-text)"})}
    </button>
  );
};
