// props : name, size
//  ㄴ name: visibility_on
//  ㄴ size: 20, 24

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgVisibilityOn = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="img">
    <path
      fill="#333"
      d="M12.002 15.577q1.7 0 2.887-1.19t1.188-2.89-1.19-2.886-2.89-1.188-2.887 1.19-1.187 2.89 1.19 2.886 2.89 1.188M12 14.2q-1.125 0-1.913-.787A2.6 2.6 0 0 1 9.3 11.5q0-1.125.787-1.913A2.6 2.6 0 0 1 12 8.8q1.125 0 1.912.787.788.789.788 1.913t-.788 1.912A2.6 2.6 0 0 1 12 14.2m0 4.3q-3.157 0-5.776-1.685a12.6 12.6 0 0 1-4.18-4.432 1.8 1.8 0 0 1-.183-.434 1.75 1.75 0 0 1 .183-1.332 12.6 12.6 0 0 1 4.18-4.432Q8.84 4.5 12 4.5q3.157 0 5.776 1.685a12.6 12.6 0 0 1 4.18 4.432q.125.216.182.434a1.76 1.76 0 0 1-.182 1.332 12.6 12.6 0 0 1-4.18 4.432Q15.157 18.5 12 18.5m0-1.5a9.55 9.55 0 0 0 5.187-1.488A9.77 9.77 0 0 0 20.8 11.5a9.77 9.77 0 0 0-3.613-4.013A9.54 9.54 0 0 0 12 6a9.55 9.55 0 0 0-5.188 1.487A9.77 9.77 0 0 0 3.2 11.5a9.77 9.77 0 0 0 3.612 4.012A9.55 9.55 0 0 0 12 17"
    />
  </svg>
);
export default SvgVisibilityOn;
