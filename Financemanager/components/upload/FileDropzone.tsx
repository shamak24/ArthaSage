"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileDropzoneProps {
    onUpload: (file: File) => Promise<void>
}

export function FileDropzone({ onUpload }: FileDropzoneProps) {
    const [isUploading, setIsUploading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setIsUploading(true)
        setError(null)

        try {
            await onUpload(file)
        } catch (err) {
            console.error(err)
            setError("Failed to upload file")
        } finally {
            setIsUploading(false)
        }
    }, [onUpload])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv']
        },
        maxFiles: 1
    })

    return (
        <div
            {...getRootProps()}
            className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 bg-muted/50 hover:bg-muted/80",
                isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25",
                isUploading && "pointer-events-none opacity-50"
            )}
        >
            <input {...getInputProps()} />

            {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            ) : (
                <Upload className="h-10 w-10 text-muted-foreground" />
            )}

            <div className="space-y-1">
                <p className="font-mono text-sm font-medium">
                    {isUploading ? "Uploading..." : "Drop CSV file here"}
                </p>
                <p className="text-xs text-muted-foreground">
                    or click to browse
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-destructive text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}
