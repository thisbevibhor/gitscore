import Link from "next/link"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, GitCompare, CreditCard, Sparkles, LogOut } from "lucide-react"

export async function Navbar() {
    const session = await auth()

    if (!session?.user) {
        return null
    }

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-8 flex h-14 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="font-bold text-xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-400" />
                        GitScore
                    </Link>
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link href="/analyze" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <Sparkles className="h-4 w-4" />
                            Analyze
                        </Link>
                        <Link href="/compare" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <GitCompare className="h-4 w-4" />
                            Compare
                        </Link>
                        <Link href="/pricing" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <CreditCard className="h-4 w-4" />
                            Pricing
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {session.user.image && (
                        <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="h-8 w-8 rounded-full"
                        />
                    )}
                    <form action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" })
                    }}>
                        <Button variant="ghost" size="sm" type="submit">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </div>
        </nav>
    )
}
