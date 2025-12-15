type ProhibitBoldProps = {
  size: string;
  color?: string | "#000000";
};

const ProhibitBold = ({ size, color }: ProhibitBoldProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
  >
    <path
      fill={color}
      d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20Zm84 108a83.6 83.6 0 0 1-16.75 50.28L77.72 60.75A84 84 0 0 1 212 128Zm-168 0a83.6 83.6 0 0 1 16.75-50.28l117.53 117.53A84 84 0 0 1 44 128Z"
    />
  </svg>
);

export default ProhibitBold;
