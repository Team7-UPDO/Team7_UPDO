// props : name, size
//  ㄴ name: logout
//  ㄴ size: 20, 24

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgLogout = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="img">
    <path
      fill="#F87171"
      d="M6 21q-.824 0-1.412-.587A1.93 1.93 0 0 1 4 19V5q0-.824.588-1.412A1.93 1.93 0 0 1 6 3h7v2H6v14h7v2zm11-4-1.375-1.45 2.55-2.55H10v-2h8.175l-2.55-2.55L17 7l5 5z"
    />
  </svg>
);
export default SvgLogout;
