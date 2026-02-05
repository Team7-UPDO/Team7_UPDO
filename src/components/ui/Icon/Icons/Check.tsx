// props : name, size
//  ㄴ name: check
//  ㄴ size: 20, 24

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgCheck = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="img">
    <circle cx={12} cy={12} r={9} fill="url(#check_svg__a)" />
    <path
      stroke="#FAFAF8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="m8.5 11.825 2.509 2.508L15.342 10"
    />
    <defs>
      <linearGradient
        id="check_svg__a"
        x1={12}
        x2={12}
        y1={3}
        y2={21}
        gradientUnits="userSpaceOnUse">
        <stop stopColor="#B994FF" />
        <stop offset={1} stopColor="#C2E5FF" />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgCheck;
