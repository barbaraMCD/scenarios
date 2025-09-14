"use client"

import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button.tsx"
import { BarChart3, LayoutDashboard, Download, Upload } from "lucide-react"
import { cn } from "@/lib/utils.ts"

interface NavigationProps {
    onImport?: () => void
    onExport?: () => void
}

const Navigation = ({ onImport, onExport }: NavigationProps) => {
    return (
        <div className="flex items-center justify-between gap-4 mb-10">
            <nav className="flex items-center gap-2">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        cn(
                            "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            "border border-input bg-background",
                            isActive ? "bg-primary text-primary-foreground border-primary" : "bg-transparent",
                        )
                    }
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/graphs"
                    className={({ isActive }) =>
                        cn(
                            "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            "border border-input bg-background",
                            isActive ? "bg-primary text-primary-foreground border-primary" : "bg-transparent",
                        )
                    }
                >
                    <BarChart3 className="h-4 w-4" />
                    Graphs
                </NavLink>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onImport}
                    className="flex items-center gap-2"
                    disabled
                >
                    <Upload className="h-4 w-4" />
                    Import
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    className="flex items-center gap-2"
                    disabled
                >
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>
        </div>
    )
}

export default Navigation;
