"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function ScoreCard({ audit }: { audit: any }) {
    if (!audit) return null

    const { score, reportData } = audit
    const breakdown = reportData?.breakdown || []

    // Determine color based on score
    const getColor = (score: number) => {
        if (score >= 90) return "text-green-500"
        if (score >= 70) return "text-blue-500"
        if (score >= 50) return "text-yellow-500"
        return "text-red-500"
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Overall Score</CardTitle>
                    <CardDescription>Based on your profile analysis</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pt-6">
                    <div className={`text-6xl font-bold ${getColor(score)}`}>
                        {score}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                        / 100 Points
                    </div>

                    <div className="mt-8 w-full space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Employability Rating</span>
                            <span className="font-bold">{score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Work"}</span>
                        </div>
                        <Progress value={score} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>breakdown</CardTitle>
                    <CardDescription>Where you gained points</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {breakdown.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{item.label}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{item.score}/{item.max}</span>
                                {item.passed !== undefined && (
                                    <Badge variant={item.passed ? "default" : "destructive"}>
                                        {item.passed ? "Pass" : "Fail"}
                                    </Badge>
                                )}
                                {item.value !== undefined && (
                                    <Badge variant="outline">
                                        {item.value}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
