import type { ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
};

export function PrimaryButton({ fullWidth = true, className = "", ...props }: PrimaryButtonProps) {
  return <button className={`btn btn--primary ${fullWidth ? "btn--full" : ""} ${className}`.trim()} {...props} />;
}
