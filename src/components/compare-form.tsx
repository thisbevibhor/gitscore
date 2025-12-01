"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Loader2, User } from "lucide-react"
import { compareProfiles } from "@/app/actions/compare"

interface ProfileResult {
    username: string
    name: string
    avatar: string
    score: number
    breakdown: Array<{
        label: string
        score: number
        max: number
        passed?: boolean
        value?: number
    }>
}

interface CompareResult {
    profile1: ProfileResult
    profile2: ProfileResult
    winner: string
}

export function CompareForm() {
    const [isPending, startTransition] = useTransition()
    const [username1, setUsername1] = useState("")
    const [username2, setUsername2] = useState("")
    const [result, setResult] = useState<CompareResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleCompare = (e: React.FormEvent) => {
        e.preventDefault()
        if (!username1.trim() || !username2.trim()) return

        setError(null)
        setResult(null)

        startTransition(async () => {
            const res = await compareProfiles(username1, username2)
            if ("error" in res) {
                setError(res.error || "Comparison failed")
                return
            }
            setResult(res as CompareResult)
        })
    }

    return (
        <div className="space-y-8">
            <form onSubmit={handleCompare} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                    <label htmlFor="user1" className="text-sm font-medium">First Profile</label>
                    <Input
                        id="user1"
                        value={username1}
                        onChange={(e) => setUsername1(e.target.value)}
                        placeholder="GitHub username"
                        disabled={isPending}
                    />
                </div>
                <div className="text-muted-foreground font-bold text-xl hidden sm:block">VS</div>
                <div className="flex-1 space-y-2">
                    <label htmlFor="user2" className="text-sm font-medium">Second Profile</label>
                    <Input
                        id="user2"
                        value={username2}
                        onChange={(e) => setUsername2(e.target.value)}
                        placeholder="GitHub username"
                        disabled={isPending}
                    />
                </div>
                <Button type="submit" disabled={isPending || !username1.trim() || !username2.trim()}>
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Comparing...
                        </>
                    ) : (
                        "Compare"
                    )}
                </Button>
            </form>

            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-center">
                    {error}
                </div>
            )}

            {result && (
                <div className="grid md:grid-cols-2 gap-6">
                    <ProfileCard
                        profile={result.profile1}
                        isWinner={result.winner === result.profile1.username}
                        otherScore={result.profile2.score}
                    />
                    <ProfileCard
                        profile={result.profile2}
                        isWinner={result.winner === result.profile2.username}
                        otherScore={result.profile1.score}
                    />
                </div>
            )}
        </div>
    )
}

function ProfileCard({
    profile,
    isWinner,
    otherScore
}: {
    profile: ProfileResult
    isWinner: boolean
    otherScore: number
}) {
    const scoreDiff = profile.score - otherScore

    return (
        <Card className={isWinner ? "border-yellow-500/50 bg-yellow-500/5" : ""}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="w-10 h-10 rounded-full"
                            />
                        ) : (
                            <User className="w-10 h-10 p-2 rounded-full bg-muted" />
                        )}
                        <div>
                            <div>{profile.name}</div>
                            <div className="text-sm text-muted-foreground">@{profile.username}</div>
                        </div>
                    </div>
                    {isWinner && (
                        <Badge className="bg-yellow-500 text-yellow-950">
                            <Trophy className="h-3 w-3 mr-1" />
                            Winner
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {profile.score}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                        {scoreDiff > 0 && <span className="text-green-400">+{scoreDiff}</span>}
                        {scoreDiff < 0 && <span className="text-red-400">{scoreDiff}</span>}
                        {scoreDiff === 0 && <span>Tied</span>}
                    </div>
                </div>

                <div className="space-y-3">
                    {profile.breakdown.map((item) => (
                        <div key={item.label} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>{item.label}</span>
                                <span className={item.passed === false ? "text-red-400" : "text-green-400"}>
                                    {item.score}/{item.max}
                                </span>
                            </div>
                            <Progress value={(item.score / item.max) * 100} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
