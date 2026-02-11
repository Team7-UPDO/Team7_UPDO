// props : name, size
//  ㄴ name: person
//  ㄴ size: 16

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgPerson = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    role="img">
    <circle cx={8} cy={5.334} r={2.667} fill="#111827" />
    <path
      fill="#111827"
      d="M3.559 11.547c.44-1.862 2.289-2.88 4.203-2.88h.476c1.914 0 3.763 1.018 4.204 2.88.085.36.153.738.19 1.121.037.367-.264.666-.632.666H4c-.368 0-.669-.3-.632-.666a9 9 0 0 1 .19-1.12"
    />
  </svg>
);
export default SvgPerson;
