import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Get a Lucide icon component by its name
 * @param iconName - The name of the Lucide icon (e.g., "Boxes", "Shield")
 * @returns The icon component or a default icon if not found
 */
export function getIconByName(iconName: string): LucideIcon {
    if (!LucideIcons) {
        console.error("LucideIcons module not loaded");
        return (() => null) as unknown as LucideIcon;
    }

    const IconComponent = (LucideIcons as any)[iconName];

    if (!IconComponent) {
        console.warn(`Icon "${iconName}" not found, using default`);
        return LucideIcons.HelpCircle || LucideIcons.AlertCircle || (() => null) as unknown as LucideIcon;
    }

    return IconComponent as LucideIcon;
}
