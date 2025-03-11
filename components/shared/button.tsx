import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", className, ...props }, ref) => {
    const baseStyles = "px-4 py-2 font-medium rounded-md transition";
    let variantStyles = "";

    if (variant === "default") {
      variantStyles = "bg-blue-600 text-white hover:bg-blue-700";
    } else if (variant === "outline") {
      variantStyles = "border border-gray-300 text-gray-700 hover:bg-gray-100";
    } else if (variant === "ghost") {
      variantStyles = "text-gray-700 hover:bg-gray-200";
    }

    return (
      <button ref={ref} className={`${baseStyles} ${variantStyles} ${className}`} {...props} />
    );
  }
);

Button.displayName = "Button";
export { Button };
