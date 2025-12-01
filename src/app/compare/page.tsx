import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CompareForm } from "@/components/compare-form"

export default async function ComparePage() {
    const session = await auth()

    if (!session?.user?.id) {
        return redirect("/")
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Compare Profiles
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        See how two GitHub profiles stack up against each other
                    </p>
                </div>

                <CompareForm />

                <div className="text-center text-sm text-muted-foreground">
                    <p>Compare any two public GitHub profiles to see who has the higher employability score.</p>
                </div>
            </div>
        </div>
    )
}
