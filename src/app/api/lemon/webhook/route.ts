import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

// LemonSqueezy Webhook Handler
// Docs: https://docs.lemonsqueezy.com/guides/developer-guide/webhooks

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text()
        const signature = req.headers.get("X-Signature") || ""

        // Verify webhook signature
        const secret = process.env.LEMON_WEBHOOK_SECRET
        if (!secret) {
            console.error("LEMON_WEBHOOK_SECRET not configured")
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
        }

        const hmac = crypto.createHmac("sha256", secret)
        const digest = hmac.update(rawBody).digest("hex")

        if (signature !== digest) {
            console.error("Invalid webhook signature")
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
        }

        const payload = JSON.parse(rawBody)
        const eventName = payload.meta?.event_name

        console.log("LemonSqueezy webhook received:", eventName)

        // Handle order completed event
        if (eventName === "order_created") {
            const customData = payload.meta?.custom_data
            const userId = customData?.user_id
            const customerEmail = payload.data?.attributes?.user_email

            if (!userId && !customerEmail) {
                console.error("No user identifier in webhook payload")
                return NextResponse.json({ error: "Missing user identifier" }, { status: 400 })
            }

            // Find user by ID (passed in custom_data) or by email
            let user
            if (userId) {
                user = await prisma.user.findUnique({ where: { id: userId } })
            } else if (customerEmail) {
                user = await prisma.user.findUnique({ where: { email: customerEmail } })
            }

            if (!user) {
                console.error("User not found for webhook:", userId || customerEmail)
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            }

            // Upgrade user to premium
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isPremium: true,
                    premiumSince: new Date(),
                    lsCustomerId: payload.data?.attributes?.customer_id?.toString(),
                },
            })

            console.log("User upgraded to premium:", user.id)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("Webhook error:", error)
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
    }
}

// LemonSqueezy may send GET requests to verify the endpoint
export async function GET() {
    return NextResponse.json({ status: "ok" })
}
