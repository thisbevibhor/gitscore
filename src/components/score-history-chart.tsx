"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Audit {
    id: string
    score: number
    createdAt: Date
}

export function ScoreHistoryChart({ audits }: { audits: Audit[] }) {
    if (!audits || audits.length < 2) {
        return null // Don't show chart with less than 2 data points
    }

    // Transform data for Recharts (oldest first for proper timeline)
    const chartData = audits
        .slice()
        .reverse()
        .map((audit) => ({
            date: new Date(audit.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            score: audit.score,
        }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Score History</CardTitle>
                <CardDescription>Track your employability score over time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                className="text-xs fill-muted-foreground"
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                domain={[0, 100]}
                                className="text-xs fill-muted-foreground"
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="hsl(var(--chart-1))"
                                strokeWidth={2}
                                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
