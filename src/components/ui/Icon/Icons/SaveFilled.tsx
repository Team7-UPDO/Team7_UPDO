// props : name, size
//  ㄴ name: save_filed
//  ㄴ size: 40, 48, 60

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgSaveFilled = ({ size = 24, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 60 60"
    role="img">
    <circle cx={30} cy={30} r={29.5} fill="none" stroke="var(--color-purple-400)" />
    <path
      fill="var(--color-purple-400)"
      stroke="var(--color-purple-400)"
      strokeWidth={2}
      d="m19.934 32.544 9.381 8.813c.325.304.487.457.685.457s.36-.153.685-.458l9.38-8.812a6.94 6.94 0 0 0 .732-9.31l-.412-.531c-2.624-3.383-7.892-2.815-9.736 1.048a.719.719 0 0 1-1.298 0c-1.844-3.863-7.111-4.43-9.735-1.048l-.413.531a6.94 6.94 0 0 0 .731 9.31Z"
    />
  </svg>
);

export default SvgSaveFilled;
