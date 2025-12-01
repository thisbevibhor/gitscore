"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AuditProgress } from "@/components/audit-progress"
import { auditProfileWithProgress } from "@/app/actions/audit"

interface AuditFormProps {
    defaultUsername?: string
}

export function AuditForm({ defaultUsername }: AuditFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [username, setUsername] = useState(defaultUsername || "")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [auditResult, setAuditResult] = useState<{
        score: number
        reportData: { breakdown: any[] }
    } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim()) return

        setIsAnalyzing(true)
        setError(null)
        setAuditResult(null)

        startTransition(async () => {
            const result = await auditProfileWithProgress(username)

            if ("error" in result) {
                setError(result.error || "Unknown error occurred")
                setIsAnalyzing(false)
                return
            }

            setAuditResult(result)
        })
    }

    const handleComplete = () => {
        // After animation completes, redirect to dashboard
        setTimeout(() => {
            router.push("/dashboard")
            router.refresh()
        }, 2000)
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub Username"
                    className="max-w-xs"
                    disabled={isAnalyzing}
                />
                <Button type="submit" disabled={isAnalyzing || !username.trim()}>
                    {isAnalyzing ? "Analyzing..." : "Analyze Profile"}
                </Button>
            </form>

            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            <AuditProgress
                isRunning={isAnalyzing && auditResult !== null}
                reportData={auditResult?.reportData}
                finalScore={auditResult?.score}
                onComplete={handleComplete}
            />
        </div>
    )
}
