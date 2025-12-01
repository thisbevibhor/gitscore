import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuditHistory({ audits }: { audits: any[] }) {
    if (!audits || audits.length === 0) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {audits.map((audit) => (
                        <div
                            key={audit.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    Score: {audit.score}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(audit.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-sm font-bold">
                                {audit.score}/100
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
