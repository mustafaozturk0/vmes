import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export const ExpandArrow = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669 .281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
};
const buttonSize = 26;
export function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      fontSize="inherit"
      style={{ width: buttonSize, height: buttonSize }}
      {...props}
    >
      {/* Correct path for an arrow pointing downwards */}
      <path d="M11.707 8.293a1 1 0 0 0-1.414 0L8 10.586 5.707 8.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0 0-1.414z" />
    </SvgIcon>
  );
}

export function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      fontSize="inherit"
      style={{ width: buttonSize, height: buttonSize }}
      {...props}
    >
      <path d="M8.293 12.707a1 1 0 0 1 0-1.414L10.586 9l-2.293-2.293a1 1 0 1 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414 0z" />
    </SvgIcon>
  );
}

export function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      fontSize="inherit"
      style={{ width: buttonSize, height: buttonSize }}
      {...props}
    >
      {/* Adjusted path for a shorter horizontal line (minus symbol) */}
      <path d="M8 11h4a1 1 0 0 1 0 2H8a1 1 0 1 1 0-2z" />
    </SvgIcon>
  );
}
