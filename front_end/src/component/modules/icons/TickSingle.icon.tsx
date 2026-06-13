import { SVGProps } from 'react';
const TickSingleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.2em"
    height="1.2em"
    viewBox="0 0 15 15"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M14.707 3L5.5 12.207L.293 7L1 6.293l4.5 4.5l8.5-8.5z"
      clipRule="evenodd"
    />
  </svg>
);

export default TickSingleIcon;
