import { SVGProps } from 'react';
const ChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || '1em'}
    height={props.height || '1em'}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill={props.stroke || '#061619'}
      d="M10.6 12.71a1 1 0 0 1 0-1.42l4.59-4.58a1 1 0 1 0-1.41-1.42L9.19 9.88a3 3 0 0 0 0 4.24l4.59 4.59a1 1 0 0 0 1.41-1.42z"
    ></path>
  </svg>
);

export default ChevronLeftIcon;
