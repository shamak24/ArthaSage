"use client"

import * as React from "react"
import { AlertTriangle, X, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface AnomalyBannerProps {
    description: string
    amount: number
    location?: string
    timeAgo?: string
}

export function AnomalyBanner({
    description,
    amount,
    location = "Unknown Location",
    timeAgo = "recently",
}: AnomalyBannerProps) {
    const [visible, setVisible] = React.useState(true)

    if (!visible) return null

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="anomaly-banner"
                >
                    <div className="anomaly-banner-icon">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="anomaly-banner-content">
                        <div className="anomaly-banner-header">
                            <span className="anomaly-banner-title">Anomaly Detected</span>
                            <Badge className="anomaly-banner-badge">High Priority</Badge>
                        </div>
                        <p className="anomaly-banner-text">
                            Unusual transaction of <strong>${amount.toLocaleString()}</strong> detected at{" "}
                            <strong>{description}</strong>
                        </p>
                        <div className="anomaly-banner-meta">
                            {location && (
                                <span className="anomaly-banner-meta-item">
                                    <MapPin className="h-3 w-3" />
                                    {location}
                                </span>
                            )}
                            <span className="anomaly-banner-meta-item">
                                <Clock className="h-3 w-3" />
                                {timeAgo}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setVisible(false)}
                        className="anomaly-banner-close"
                        aria-label="Dismiss alert"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
