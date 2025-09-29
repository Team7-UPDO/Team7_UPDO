import * as React from 'react';
import type { SVGProps } from 'react';
export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};
const SvgArrowDropdown = ({ size = 24, ...props }: IconProps) => (
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
      d="M12.715 15.465c-.317.3-.814.3-1.132 0l-5.778-5.459c-.542-.512-.18-1.423.566-1.423h11.557c.745 0 1.107.911.566 1.423z"
    />
  </svg>
);
export default SvgArrowDropdown;
