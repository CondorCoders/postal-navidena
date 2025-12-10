type DiamondProps = {
    size: string;
    color?: string | "#000000";
};
      
const Diamond = ({ size, color }: DiamondProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="none" stroke={color} stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"/></svg>
);

export default Diamond;