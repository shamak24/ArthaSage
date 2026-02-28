"use client"

import * as React from "react"
import {
    CreditCard,
    FileText,
    Home,
    Laptop,
    Loader2,
    Moon,
    Plus,
    Search,
    Settings,
    Sun,
    Upload,
    User,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50">
                <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border shadow-sm">
                    Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">⌘</span>k</kbd> to open
                </p>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
                            <Home className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/import"))}>
                            <Upload className="mr-2 h-4 w-4" />
                            <span>Import Data</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => console.log("AI"))}>
                            <Laptop className="mr-2 h-4 w-4" />
                            <span>Ask AI Insights</span>
                            <CommandShortcut>⌘I</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">
                        <CommandItem onSelect={() => runCommand(() => router.push("/transactions/new"))}>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Add Transaction</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => console.log("Running anomaly check..."))}>
                            <Search className="mr-2 h-4 w-4" />
                            <span>Run Anomaly Detection</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem onSelect={() => runCommand(() => console.log("Profile"))}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => console.log("Settings"))}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => console.log("Settings"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
