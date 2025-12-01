import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export function SignInButton() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("github", { redirectTo: "/dashboard" })
            }}
        >
            <Button type="submit" size="lg" className="gap-2">
                <Github className="w-5 h-5" />
                Sign in with GitHub
            </Button>
        </form>
    )
}
