"use server"

import { auth } from "@/auth"

// Helper function to fetch and score a GitHub profile
async function fetchAndScoreProfile(username: string) {
    const userRes = await fetch(`https://api.github.com/users/${username}`)
    if (!userRes.ok) return { error: `GitHub user '${username}' not found` }
    const user = await userRes.json()

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    const repos = await reposRes.json()

    let score = 0
    const breakdown: Array<{
        label: string
        score: number
        max: number
        passed?: boolean
        value?: number
    }> = []

    // Bio Check (+10)
    if (user.bio) {
        score += 10
        breakdown.push({ label: "Has Bio", score: 10, max: 10, passed: true })
    } else {
        breakdown.push({ label: "Has Bio", score: 0, max: 10, passed: false })
    }

    // Avatar Check (+5)
    if (user.avatar_url) {
        score += 5
        breakdown.push({ label: "Has Avatar", score: 5, max: 5, passed: true })
    } else {
        breakdown.push({ label: "Has Avatar", score: 0, max: 5, passed: false })
    }

    // Public Repos (+20 max)
    const repoScore = Math.min(user.public_repos * 2, 20)
    score += repoScore
    breakdown.push({ label: "Public Repos", score: repoScore, max: 20, value: user.public_repos })

    // Followers (+15 max)
    const followerScore = Math.min(user.followers, 15)
    score += followerScore
    breakdown.push({ label: "Followers", score: followerScore, max: 15, value: user.followers })

    // Account Age (+10)
    const createdYear = new Date(user.created_at).getFullYear()
    const currentYear = new Date().getFullYear()
    const ageScore = Math.min((currentYear - createdYear) * 2, 10)
    score += ageScore
    breakdown.push({ label: "Account Age (Years)", score: ageScore, max: 10, value: currentYear - createdYear })

    // Recent Activity (+20)
    const hasRecent = repos.some((r: any) => {
        const diff = new Date().getTime() - new Date(r.updated_at).getTime()
        return diff < 7 * 24 * 60 * 60 * 1000
    })
    if (hasRecent) {
        score += 20
        breakdown.push({ label: "Recent Activity (<7 days)", score: 20, max: 20, passed: true })
    } else {
        breakdown.push({ label: "Recent Activity (<7 days)", score: 0, max: 20, passed: false })
    }

    // Company/Location (+20)
    if (user.company || user.location) {
        score += 20
        breakdown.push({ label: "Professional Info", score: 20, max: 20, passed: true })
    } else {
        breakdown.push({ label: "Professional Info", score: 0, max: 20, passed: false })
    }

    return {
        username: user.login,
        name: user.name || user.login,
        avatar: user.avatar_url,
        score: Math.min(score, 100),
        breakdown
    }
}

export async function compareProfiles(username1: string, username2: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    if (!username1 || !username2) {
        return { error: "Both usernames are required" }
    }

    if (username1.toLowerCase() === username2.toLowerCase()) {
        return { error: "Please enter two different usernames" }
    }

    try {
        const [profile1, profile2] = await Promise.all([
            fetchAndScoreProfile(username1),
            fetchAndScoreProfile(username2)
        ])

        if ("error" in profile1) return profile1
        if ("error" in profile2) return profile2

        return {
            profile1,
            profile2,
            winner: profile1.score > profile2.score ? profile1.username :
                profile2.score > profile1.score ? profile2.username : "tie"
        }
    } catch (error) {
        console.error("Compare Error:", error)
        return { error: "Failed to compare profiles: " + (error as Error).message }
    }
}
