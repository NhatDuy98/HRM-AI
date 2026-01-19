import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, id, ...props }, ref) => {
        // Generate random ID if not provided for label accessibility
        const uniqueId = id || React.useId();

        return (
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id={uniqueId}
                    className={cn(
                        "h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={uniqueId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
