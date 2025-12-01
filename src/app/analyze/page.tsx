import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AuditForm } from "@/components/audit-form"

export default async function AnalyzePage() {
    const session = await auth()

    if (!session?.user?.id) {
        return redirect("/")
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Analyze GitHub Profile
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Enter a GitHub username to get a detailed employability score
                    </p>
                </div>

                <div className="bg-card rounded-lg border p-6 shadow-lg">
                    <AuditForm defaultUsername={session.user.name || ""} />
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    <p>We analyze public profile data, repositories, followers, and activity.</p>
                </div>
            </div>
        </div>
    )
}
