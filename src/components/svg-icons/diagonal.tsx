type LineDiagonalProps = {
    size: string;
    color?: string | "#000000";
};
      
const LineDiagonal = ({ size,color }: LineDiagonalProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5" d="m21.25 2.75l-18.5 18.5"/></svg>
);

export default LineDiagonal;