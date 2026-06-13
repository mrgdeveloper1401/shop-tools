import { SVGProps } from 'react';
const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.2em"
    height="1.2em"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.5 3.5v-1a1 1 0 0 0-1-1h-1m-2.5 9H1.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h1m10 4h-5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1M6.75.5h-4.5l.41 1.62a.49.49 0 0 0 .48.38h2.72a.49.49 0 0 0 .48-.38zm1.75 8h3m-3 2h3"
      strokeWidth={0.9}
    ></path>
  </svg>
);

export default CopyIcon;
