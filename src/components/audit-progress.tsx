"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2, CircleDot } from "lucide-react"

interface AuditStep {
    label: string
    key: string
    status: "pending" | "running" | "complete"
    score?: number
    max?: number
    passed?: boolean
}

interface AuditProgressProps {
    isRunning: boolean
    reportData?: {
        breakdown: Array<{
            label: string
            score: number
            max: number
            passed?: boolean
            value?: number
        }>
    }
    finalScore?: number
    onComplete?: () => void
}

const AUDIT_STEPS = [
    { label: "Checking Bio", key: "Has Bio" },
    { label: "Checking Avatar", key: "Has Avatar" },
    { label: "Counting Public Repos", key: "Public Repos" },
    { label: "Analyzing Followers", key: "Followers" },
    { label: "Checking Account Age", key: "Account Age (Years)" },
    { label: "Scanning Recent Activity", key: "Recent Activity (<7 days)" },
    { label: "Reviewing Professional Info", key: "Professional Info" },
]

export function AuditProgress({ isRunning, reportData, finalScore, onComplete }: AuditProgressProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(-1)
    const [steps, setSteps] = useState<AuditStep[]>(
        AUDIT_STEPS.map((s) => ({ ...s, status: "pending" as const }))
    )
    const [showFinalScore, setShowFinalScore] = useState(false)

    useEffect(() => {
        if (!isRunning || !reportData) return

        // Reset state
        setCurrentStepIndex(-1)
        setShowFinalScore(false)
        setSteps(AUDIT_STEPS.map((s) => ({ ...s, status: "pending" as const })))

        // Start the animation sequence
        let stepIndex = 0
        const interval = setInterval(() => {
            if (stepIndex >= AUDIT_STEPS.length) {
                clearInterval(interval)
                setTimeout(() => {
                    setShowFinalScore(true)
                    onComplete?.()
                }, 300)
                return
            }

            const step = AUDIT_STEPS[stepIndex]
            const breakdownItem = reportData.breakdown.find((b) => b.label === step.key)

            setSteps((prev) =>
                prev.map((s, i) => {
                    if (i === stepIndex) {
                        return {
                            ...s,
                            status: "complete",
                            score: breakdownItem?.score,
                            max: breakdownItem?.max,
                            passed: breakdownItem?.passed,
                        }
                    }
                    if (i === stepIndex + 1) {
                        return { ...s, status: "running" }
                    }
                    return s
                })
            )
            setCurrentStepIndex(stepIndex)
            stepIndex++
        }, 600)

        return () => clearInterval(interval)
    }, [isRunning, reportData, onComplete])

    if (!isRunning && !showFinalScore) return null

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {showFinalScore ? (
                        "Analysis Complete"
                    ) : (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Analyzing Profile...
                        </>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {steps.map((step, index) => (
                    <div
                        key={step.key}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${step.status === "complete"
                                ? "bg-green-500/10 border border-green-500/30"
                                : step.status === "running"
                                    ? "bg-blue-500/10 border border-blue-500/30"
                                    : "bg-muted/50 border border-transparent opacity-50"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {step.status === "complete" ? (
                                <Check className="h-5 w-5 text-green-500" />
                            ) : step.status === "running" ? (
                                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                            ) : (
                                <CircleDot className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span className={step.status === "pending" ? "text-muted-foreground" : ""}>
                                {step.label}
                            </span>
                        </div>
                        {step.status === "complete" && step.score !== undefined && (
                            <span className={`text-sm font-medium ${step.passed === false ? "text-red-400" : "text-green-400"}`}>
                                +{step.score}/{step.max}
                            </span>
                        )}
                    </div>
                ))}

                {showFinalScore && finalScore !== undefined && (
                    <div className="mt-6 p-6 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-center animate-in fade-in zoom-in duration-500">
                        <div className="text-lg text-muted-foreground mb-2">Your Employability Score</div>
                        <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {finalScore}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">out of 100</div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
