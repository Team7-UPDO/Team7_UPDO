// props : name, size
//  ㄴ name: alarm
//  ㄴ size: 24
import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgAlarm = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="img">
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.667}
      d="M6.667 6 5 7.667M18.333 6 20 7.667"
    />
    <path
      fill="#fff"
      d="M12.5 6a6.667 6.667 0 1 1-.001 13.333A6.667 6.667 0 0 1 12.5 6m2.188 3.933a.834.834 0 0 0-1.172.13l-1.19 1.486-1.864-1.242a.833.833 0 1 0-.924 1.386l2.34 1.56c.45.3 1.055.207 1.393-.215l1.546-1.934a.833.833 0 0 0-.13-1.171"
    />
  </svg>
);
export default SvgAlarm;
