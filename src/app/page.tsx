import { SignInButton } from "@/components/auth-buttons"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <main className="flex flex-col items-center text-center max-w-2xl gap-8">
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          v1.0 Public Beta
        </Badge>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent pb-4">
          GitScore
        </h1>

        <p className="text-xl text-muted-foreground">
          Analyze your GitHub profile for employability. Get a data-driven score and actionable insights to improve your developer portfolio.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <SignInButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 text-left w-full">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Instant Analysis</h3>
            <p className="text-sm text-muted-foreground">Get a score based on your public activity, stars, and consistency.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Actionable Tips</h3>
            <p className="text-sm text-muted-foreground">Learn exactly what recruiters are looking for in your profile.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Track Progress</h3>
            <p className="text-sm text-muted-foreground">Keep a history of your scores as you improve your portfolio.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
