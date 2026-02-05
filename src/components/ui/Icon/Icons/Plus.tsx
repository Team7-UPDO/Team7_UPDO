// props : name, size
//  ㄴ name: plus
//  ㄴ size: 32

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgPlus = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 32 32"
    role="img">
    <path stroke="#fff" strokeLinecap="round" strokeWidth={2} d="M8 16h16M16 24V8" />
  </svg>
);
export default SvgPlus;
