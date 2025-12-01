"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, AlertCircle, Lightbulb } from "lucide-react"
import { getRecommendations } from "@/app/actions/recommendations"

interface Recommendation {
    title: string
    description: string
    priority: "high" | "medium" | "low"
}

interface AIRecommendationsProps {
    breakdown: Array<{
        label: string
        score: number
        max: number
        passed?: boolean
        value?: number
    }>
}

const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

export function AIRecommendations({ breakdown }: AIRecommendationsProps) {
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGetRecommendations = async () => {
        setLoading(true)
        setError(null)

        const result = await getRecommendations(breakdown)

        if ("error" in result) {
            setError(result.error || "Failed to get recommendations")
            setLoading(false)
            return
        }

        setRecommendations(result.recommendations)
        setLoading(false)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    AI-Powered Recommendations
                </CardTitle>
                <CardDescription>
                    Get personalized tips to improve your employability score
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!recommendations && !loading && !error && (
                    <Button
                        onClick={handleGetRecommendations}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get AI Recommendations
                    </Button>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                        <span className="ml-2 text-muted-foreground">Analyzing your profile...</span>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleGetRecommendations}
                            className="ml-auto"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {recommendations && (
                    <div className="space-y-4">
                        {recommendations.map((rec, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg bg-muted/50 border space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-yellow-400" />
                                        <span className="font-medium">{rec.title}</span>
                                    </div>
                                    <Badge className={priorityColors[rec.priority]}>
                                        {rec.priority}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {rec.description}
                                </p>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleGetRecommendations}
                            className="w-full"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Get New Recommendations
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
