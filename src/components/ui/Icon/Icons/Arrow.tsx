// props : name, size
//  ㄴ name: arrow
//  ㄴ size: 16

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgArrow = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    role="img">
    <path
      stroke="#757575"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m5 7.535 3.536 3.536 3.535-3.536"
    />
  </svg>
);
export default SvgArrow;
