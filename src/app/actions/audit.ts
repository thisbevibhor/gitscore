"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function auditProfile(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const username = formData.get("username") as string
    if (!username) return { error: "Username is required" }

    // Paywall check: 1 free audit for non-premium users
    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isPremium: true }
    })
    const auditCount = await prisma.audit.count({
        where: { userId: session.user.id }
    })
    if (auditCount >= 1 && !dbUser?.isPremium) {
        return { error: "paywall", message: "Upgrade to run more audits" }
    }

    try {
        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`)
        if (!userRes.ok) return { error: "GitHub user not found" }
        const user = await userRes.json()

        // Fetch repos
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
        const repos = await reposRes.json()

        // Calculate Score
        let score = 0
        const report: any = { breakdown: [] }

        // 1. Bio Check (+10)
        if (user.bio) {
            score += 10
            report.breakdown.push({ label: "Has Bio", score: 10, max: 10, passed: true })
        } else {
            report.breakdown.push({ label: "Has Bio", score: 0, max: 10, passed: false })
        }

        // 2. Avatar Check (+5)
        if (user.avatar_url) {
            score += 5
            report.breakdown.push({ label: "Has Avatar", score: 5, max: 5, passed: true })
        }

        // 3. Public Repos (+20 max)
        const repoScore = Math.min(user.public_repos * 2, 20)
        score += repoScore
        report.breakdown.push({ label: "Public Repos", score: repoScore, max: 20, value: user.public_repos })

        // 4. Followers (+15 max)
        const followerScore = Math.min(user.followers, 15)
        score += followerScore
        report.breakdown.push({ label: "Followers", score: followerScore, max: 15, value: user.followers })

        // 5. Account Age (+10)
        const createdYear = new Date(user.created_at).getFullYear()
        const currentYear = new Date().getFullYear()
        const ageScore = Math.min((currentYear - createdYear) * 2, 10)
        score += ageScore
        report.breakdown.push({ label: "Account Age (Years)", score: ageScore, max: 10, value: currentYear - createdYear })

        // 6. Recent Activity (Mock: based on updated_at of repos) (+20)
        // In a real app we'd check commit streak via events API
        const hasRecent = repos.some((r: any) => {
            const diff = new Date().getTime() - new Date(r.updated_at).getTime()
            return diff < 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        if (hasRecent) {
            score += 20
            report.breakdown.push({ label: "Recent Activity (<7 days)", score: 20, max: 20, passed: true })
        } else {
            report.breakdown.push({ label: "Recent Activity (<7 days)", score: 0, max: 20, passed: false })
        }

        // 7. Company/Location (+10)
        if (user.company || user.location) {
            score += 20
            report.breakdown.push({ label: "Professional Info", score: 20, max: 20, passed: true })
        } else {
            report.breakdown.push({ label: "Professional Info", score: 0, max: 20, passed: false })
        }

        // Cap score at 100
        score = Math.min(score, 100)

        // Save to DB
        const savedAudit = await prisma.audit.create({
            data: {
                userId: session.user.id,
                score,
                reportData: report,
            },
        })
        console.log("Audit saved successfully:", savedAudit.id)

        revalidatePath("/dashboard")
        return { success: true }

    } catch (error) {
        console.error("Audit Error:", error)
        return { error: "Failed to audit profile: " + (error as Error).message }
    }
}

// New function for progressive UI - returns full report data
export async function auditProfileWithProgress(username: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    if (!username) return { error: "Username is required" }

    // Paywall check: 1 free audit for non-premium users
    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isPremium: true }
    })
    const auditCount = await prisma.audit.count({
        where: { userId: session.user.id }
    })
    if (auditCount >= 1 && !dbUser?.isPremium) {
        return { error: "paywall", message: "Upgrade to run more audits" }
    }

    try {
        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`)
        if (!userRes.ok) return { error: "GitHub user not found" }
        const user = await userRes.json()

        // Fetch repos
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
        const repos = await reposRes.json()

        // Calculate Score
        let score = 0
        const breakdown: Array<{
            label: string
            score: number
            max: number
            passed?: boolean
            value?: number
        }> = []

        // 1. Bio Check (+10)
        if (user.bio) {
            score += 10
            breakdown.push({ label: "Has Bio", score: 10, max: 10, passed: true })
        } else {
            breakdown.push({ label: "Has Bio", score: 0, max: 10, passed: false })
        }

        // 2. Avatar Check (+5)
        if (user.avatar_url) {
            score += 5
            breakdown.push({ label: "Has Avatar", score: 5, max: 5, passed: true })
        } else {
            breakdown.push({ label: "Has Avatar", score: 0, max: 5, passed: false })
        }

        // 3. Public Repos (+20 max)
        const repoScore = Math.min(user.public_repos * 2, 20)
        score += repoScore
        breakdown.push({ label: "Public Repos", score: repoScore, max: 20, value: user.public_repos })

        // 4. Followers (+15 max)
        const followerScore = Math.min(user.followers, 15)
        score += followerScore
        breakdown.push({ label: "Followers", score: followerScore, max: 15, value: user.followers })

        // 5. Account Age (+10)
        const createdYear = new Date(user.created_at).getFullYear()
        const currentYear = new Date().getFullYear()
        const ageScore = Math.min((currentYear - createdYear) * 2, 10)
        score += ageScore
        breakdown.push({ label: "Account Age (Years)", score: ageScore, max: 10, value: currentYear - createdYear })

        // 6. Recent Activity (+20)
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

        // 7. Company/Location (+20)
        if (user.company || user.location) {
            score += 20
            breakdown.push({ label: "Professional Info", score: 20, max: 20, passed: true })
        } else {
            breakdown.push({ label: "Professional Info", score: 0, max: 20, passed: false })
        }

        // Cap score at 100
        score = Math.min(score, 100)

        // Save to DB
        await prisma.audit.create({
            data: {
                userId: session.user.id,
                score,
                reportData: { breakdown },
            },
        })

        revalidatePath("/dashboard")
        return { score, reportData: { breakdown } }

    } catch (error) {
        console.error("Audit Error:", error)
        return { error: "Failed to audit profile: " + (error as Error).message }
    }
}
