// props : name, size
//  ㄴ name: edit
//  ㄴ size: 20, 24

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgEdit = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="img">
    <path
      fill="#737373"
      d="M3.75 14.25h1.069l7.331-7.331-1.069-1.069-7.331 7.331zM3 15.75a.73.73 0 0 1-.534-.216A.73.73 0 0 1 2.25 15v-1.819a1.48 1.48 0 0 1 .431-1.05l9.469-9.45q.225-.206.497-.319.272-.112.572-.112t.581.112.487.338l1.032 1.05q.226.207.328.487a1.63 1.63 0 0 1 0 1.135 1.4 1.4 0 0 1-.328.497l-9.45 9.45a1.481 1.481 0 0 1-1.05.431zm8.606-9.356-.525-.544 1.069 1.069z"
    />
  </svg>
);
export default SvgEdit;
