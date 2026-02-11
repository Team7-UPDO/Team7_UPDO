// props : name, size
//  ㄴ name: edit_btn
//  ㄴ size: 40

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgEditBtn = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 40 40"
    role="img">
    <rect width={39} height={39} x={0.5} y={0.5} fill="#fff" rx={19.5} />
    <rect width={39} height={39} x={0.5} y={0.5} stroke="#DDD" rx={19.5} />
    <path
      fill="#737373"
      d="M13 27h1.425l9.775-9.775-1.425-1.425L13 25.575zm-1 2a.97.97 0 0 1-.713-.288A.97.97 0 0 1 11 28v-2.425a1.98 1.98 0 0 1 .575-1.4l12.625-12.6q.3-.275.663-.425.362-.15.762-.15t.775.15.65.45l1.375 1.4q.3.275.438.65a2.17 2.17 0 0 1 0 1.512 1.9 1.9 0 0 1-.438.663l-12.6 12.6a1.975 1.975 0 0 1-1.4.575zm11.475-12.475-.7-.725 1.425 1.425z"
    />
  </svg>
);
export default SvgEditBtn;
