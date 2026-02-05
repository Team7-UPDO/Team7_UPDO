// props : name, size
//  ㄴ name: heart
//  ㄴ size: 24
//  ㄴ fill: 'full' | 'lined'

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  fill: 'full' | 'lined';
};
const SvgHeart = ({ size = 24, fill, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill={fill === 'full' ? 'var(--color-purple-300)' : 'var(--color-gray-50)'}
    viewBox="0 0 24 24"
    role="img">
    <path
      fill="current"
      d="M22.1 9.1C22 5.7 19.3 3 15.9 3c-1.1 0-2.8.8-3.5 2.1-.1.3-.5.3-.6 0-.8-1.2-2.4-2-3.6-2-3.3 0-6.1 2.7-6.2 6v.2c0 1.7.7 3.3 1.9 4.5v.1c.1.1 4.9 4.3 7.1 6.2.6.5 1.5.5 2.1 0 2.2-1.9 6.9-6.1 7.1-6.2v-.1c1.2-1.1 1.9-2.7 1.9-4.5z"
    />
  </svg>
);
export default SvgHeart;
