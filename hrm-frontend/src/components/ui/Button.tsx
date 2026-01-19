import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "link" | "outline" | "ghost";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variant === "primary" &&
                    "h-11 bg-[#0FA3B1] text-white hover:bg-[#0c8a96]", // Matching the teal color from image
                    variant === "link" && "text-[#0FA3B1] underline-offset-4 hover:underline",
                    variant === "outline" && "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900",
                    variant === "ghost" && "bg-transparent hover:bg-slate-100 text-slate-900",
                    className
                )}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
