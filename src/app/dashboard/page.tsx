import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { auditProfile } from "@/app/actions/audit"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { ScoreCard } from "@/components/score-card"
import { AuditHistory } from "@/components/audit-history"
import { ScoreHistoryChart } from "@/components/score-history-chart"
import { AIRecommendations } from "@/components/ai-recommendations"
import { redirect } from "next/navigation"

export default async function Dashboard() {
    const session = await auth()

    // Handled by layout, but safe check
    if (!session?.user?.id) return redirect("/")

    const audits = await prisma.audit.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    })

    const latestAudit = audits[0]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <span>Welcome, {session.user.name}</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Audit Form */}
                <div className="flex items-center space-x-2 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <form action={async (formData) => {
                        "use server"
                        await auditProfile(formData)
                    }} className="flex w-full items-center space-x-2">
                        <Input
                            name="username"
                            placeholder="Enter GitHub Username to Audit"
                            className="max-w-xs"
                            defaultValue={session.user.name || ""}
                        />
                        <SubmitButton />
                    </form>
                </div>

                {/* Results */}
                {latestAudit ? (
                    <>
                        <ScoreCard audit={latestAudit} />
                        <AIRecommendations
                            breakdown={(latestAudit.reportData as any)?.breakdown || []}
                        />
                    </>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        No audits yet. Run one above!
                    </div>
                )}

                {/* Score History Chart */}
                <ScoreHistoryChart audits={audits} />

                {/* History */}
                <AuditHistory audits={audits.slice(1)} />
            </div>
        </div>
    )
}
