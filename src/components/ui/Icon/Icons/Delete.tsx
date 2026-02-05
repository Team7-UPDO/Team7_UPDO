// props : name, size
//  ㄴ name: delete
//  ㄴ size: 24

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgDelete = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="img">
    <path stroke="#737373" strokeLinecap="round" strokeWidth={1.8} d="m5.5 5 13 13M18.5 5l-13 13" />
  </svg>
);
export default SvgDelete;
