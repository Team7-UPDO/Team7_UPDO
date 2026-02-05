// props : name, size
//  ㄴ name: filter
//  ㄴ size: 20

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgFilter = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    role="img">
    <path
      fill="#333"
      d="M8.25 13.5a.73.73 0 0 1-.534-.216.73.73 0 0 1-.216-.534q0-.319.216-.534A.73.73 0 0 1 8.25 12h1.5q.319 0 .534.216a.73.73 0 0 1 .216.534q0 .319-.216.534a.73.73 0 0 1-.534.216zm-3-3.75a.73.73 0 0 1-.534-.216A.73.73 0 0 1 4.5 9q0-.319.216-.534a.73.73 0 0 1 .534-.216h7.5q.319 0 .534.216A.73.73 0 0 1 13.5 9q0 .319-.216.534a.73.73 0 0 1-.534.216zM3 6a.73.73 0 0 1-.534-.216.73.73 0 0 1-.216-.534q0-.319.216-.534A.73.73 0 0 1 3 4.5h12q.319 0 .534.216a.73.73 0 0 1 .216.534q0 .319-.216.534A.73.73 0 0 1 15 6z"
    />
  </svg>
);
export default SvgFilter;
