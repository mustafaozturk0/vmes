import { Tooltip, TooltipProps, styled } from "@mui/material";

export const TooltipWrapper = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip
      {...props}
      classes={{ popper: className }}
      placement="bottom-end"
    />
  )
)(({ theme }) => ({}));
