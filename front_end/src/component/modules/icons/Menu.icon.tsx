import { SVGProps } from 'react';
const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.6em"
    height="1.6em"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      d="M12 17h7M5 12h14M5 7h14"
    />
  </svg>
);

export default MenuIcon;
