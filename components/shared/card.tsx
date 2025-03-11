import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className || ""}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: CardProps) => {
  return (
    <div className={`text-lg font-semibold mb-2 ${className || ""}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }: CardProps) => {
  return (
    <div className={`mb-2 ${className || ""}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className }: CardProps) => {
  return (
    <div className={`border-t mt-4 pt-2 ${className || ""}`}>
      {children}
    </div>
  );
};
