import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function PricingPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return redirect("/")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isPremium: true }
    })

    const auditCount = await prisma.audit.count({
        where: { userId: session.user.id }
    })

    const hasUsedFreeTrial = auditCount >= 1

    // LemonSqueezy checkout URL (will be replaced with actual URL)
    const checkoutUrl = process.env.LEMON_CHECKOUT_URL || "#"

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Choose Your Plan
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Unlock unlimited profile audits with a one-time payment
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Free Tier */}
                    <Card className={!hasUsedFreeTrial ? "border-primary" : "opacity-75"}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Free Trial
                                {!hasUsedFreeTrial && <Badge>Available</Badge>}
                                {hasUsedFreeTrial && <Badge variant="secondary">Used</Badge>}
                            </CardTitle>
                            <CardDescription>
                                Try GitScore risk-free
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-4xl font-bold">$0</div>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>1 profile audit</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Full score breakdown</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Progressive analysis UI</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant="outline"
                                disabled={hasUsedFreeTrial}
                                asChild={!hasUsedFreeTrial}
                            >
                                {hasUsedFreeTrial ? (
                                    "Trial Used"
                                ) : (
                                    <a href="/analyze">Start Free Trial</a>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Premium Tier */}
                    <Card className={user?.isPremium ? "border-green-500" : "border-primary"}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Premium
                                {user?.isPremium && <Badge className="bg-green-500">Active</Badge>}
                                {!user?.isPremium && <Badge variant="default">Recommended</Badge>}
                            </CardTitle>
                            <CardDescription>
                                Unlimited audits forever
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-4xl font-bold">
                                $9
                                <span className="text-lg font-normal text-muted-foreground ml-1">
                                    one-time
                                </span>
                            </div>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span><strong>Unlimited</strong> profile audits</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Compare multiple profiles</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Score history & trends</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>AI-powered recommendations</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Priority support</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            {user?.isPremium ? (
                                <Button className="w-full bg-green-500 hover:bg-green-600" disabled>
                                    <Check className="h-4 w-4 mr-2" />
                                    Premium Active
                                </Button>
                            ) : (
                                <Button
                                    className="w-full"
                                    asChild
                                >
                                    <a href={checkoutUrl}>
                                        Upgrade Now
                                    </a>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    <p>Secure payment powered by LemonSqueezy. Cancel anytime.</p>
                </div>
            </div>
        </div>
    )
}
