"use server"

import { auth } from "@/auth"

interface BreakdownItem {
    label: string
    score: number
    max: number
    passed?: boolean
    value?: number
}

export async function getRecommendations(breakdown: BreakdownItem[]) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return { error: "AI recommendations are not configured" }
    }

    // Build a summary of the profile analysis
    const profileSummary = breakdown.map(item => {
        return `${item.label}: ${item.score}/${item.max} (${item.passed === false ? "Failed" : "Passed"})`
    }).join("\n")

    const prompt = `You are a career advisor helping developers improve their GitHub profiles for job applications.

Based on this GitHub profile analysis:
${profileSummary}

Provide exactly 3 specific, actionable tips to improve this profile's employability score. Focus on the areas where the user lost points.

Format your response as a JSON array with 3 objects, each having:
- "title": A short, catchy title (max 6 words)
- "description": A specific, actionable tip (2-3 sentences max)
- "priority": "high", "medium", or "low" based on impact

Respond ONLY with the JSON array, no other text.`

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                }),
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Gemini API error:", errorText)
            return { error: "Failed to get AI recommendations" }
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
            return { error: "No recommendations generated" }
        }

        // Parse the JSON response (it might be wrapped in markdown code blocks)
        let jsonText = text.trim()
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.slice(7)
        }
        if (jsonText.startsWith("```")) {
            jsonText = jsonText.slice(3)
        }
        if (jsonText.endsWith("```")) {
            jsonText = jsonText.slice(0, -3)
        }

        const recommendations = JSON.parse(jsonText.trim())
        return { recommendations }
    } catch (error) {
        console.error("Recommendations error:", error)
        return { error: "Failed to generate recommendations" }
    }
}
