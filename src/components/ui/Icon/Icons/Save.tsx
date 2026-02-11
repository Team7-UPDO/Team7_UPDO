// props : name, size
//  ㄴ name: save
//  ㄴ size: 48

import type { SVGProps } from 'react';
import * as React from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgSave = ({ size = 48, ...props }: IconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 48 48"
    role="img">
    <circle cx={24} cy={24} r={23.5} fill="#FFF" stroke="#b994ff" />
    <path
      fill="url(#save_svg__a)"
      d="M20.59 17.555a1.245 1.245 0 0 1 1.76 0l7.343 7.343c.039-.065.088-.198.088-.415 0-.34-2.036-4.073-.452-4.753 1.584-.678 2.716 4.3 3.395 5.545s2.15 3.621-1.019 7.13c-3.169 3.507-7.808 1.81-9.392.226-.731-.73-1.424-1.447-2.044-2.096l-.017-.015-4.642-4.641a1.245 1.245 0 0 1 1.761-1.76l3.475 3.474.172-.154-5.181-5.181a1.245 1.245 0 0 1 1.76-1.76l5.27 5.268.171-.156-5.617-5.616a1.245 1.245 0 0 1 1.76-1.76l5.705 5.704.17-.155-4.466-4.468a1.245 1.245 0 0 1 0-1.76"
    />
    <path
      stroke="#b994ff"
      strokeLinecap="round"
      strokeWidth={1.193}
      d="M24.397 14.972c.421-.016 1.424.148 2.061.934.638.786.813 1.752.821 2.137M27.17 13.295c.262-.01.882.095 1.277.587.396.492.506 1.095.511 1.335M19.338 32.634c-.418.057-1.431-.007-2.144-.726-.712-.719-.982-1.663-1.028-2.045M16.744 34.577c-.258.035-.886-.007-1.328-.457a2.44 2.44 0 0 1-.64-1.279"
    />
    <defs>
      <linearGradient
        id="save_svg__a"
        x1={15.246}
        x2={33.662}
        y1={25.828}
        y2={25.828}
        gradientUnits="userSpaceOnUse">
        <stop stopColor="#b994ff" />
        <stop offset={1} stopColor="#f3a7cf" />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgSave;
