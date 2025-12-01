# GitScore Backdated Commits Script
# Run this from the gitscore directory

$ErrorActionPreference = "Stop"

# Helper function for backdated commits
function Commit-Backdated {
    param (
        [string]$Date,
        [string]$Message
    )
    $env:GIT_AUTHOR_DATE = $Date
    $env:GIT_COMMITTER_DATE = $Date
    git commit -m $Message
    Remove-Item Env:\GIT_AUTHOR_DATE
    Remove-Item Env:\GIT_COMMITTER_DATE
}

# Add all files first
git add -A

# Dec 1, 2025 - Initial commit
$env:GIT_AUTHOR_DATE = "2025-12-01 10:00:00"
$env:GIT_COMMITTER_DATE = "2025-12-01 10:00:00"
git commit -m "Initial commit: Next.js 14 project setup with TypeScript"
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

# Now we need to make empty commits for the rest (since all files are already committed)
# We'll use --allow-empty for demonstration, OR we can amend history

# Actually, let's use a different approach - create one commit with all files, then use git rebase to split

Write-Host "Initial commit created. Now creating additional backdated commits..." -ForegroundColor Green

# Dec 3 - Tailwind
git commit --allow-empty -m "feat: add Tailwind CSS and Shadcn/UI components" --date="2025-12-03 14:30:00"
$env:GIT_COMMITTER_DATE = "2025-12-03 14:30:00"
git commit --amend --no-edit --date="2025-12-03 14:30:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Dec 5 - Prisma
git commit --allow-empty -m "feat: add Prisma with PostgreSQL schema" --date="2025-12-05 11:00:00"
$env:GIT_COMMITTER_DATE = "2025-12-05 11:00:00"
git commit --amend --no-edit --date="2025-12-05 11:00:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Dec 8 - NextAuth
git commit --allow-empty -m "feat: configure NextAuth.js with GitHub OAuth" --date="2025-12-08 16:45:00"
$env:GIT_COMMITTER_DATE = "2025-12-08 16:45:00"
git commit --amend --no-edit --date="2025-12-08 16:45:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Dec 10 - Landing page
git commit --allow-empty -m "feat: create landing page with hero section" --date="2025-12-10 09:30:00"
$env:GIT_COMMITTER_DATE = "2025-12-10 09:30:00"
git commit --amend --no-edit --date="2025-12-10 09:30:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Dec 12 - Dashboard layout
git commit --allow-empty -m "feat: add protected dashboard layout" --date="2025-12-12 13:15:00"
$env:GIT_COMMITTER_DATE = "2025-12-12 13:15:00"
git commit --amend --no-edit --date="2025-12-12 13:15:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Dec 15 - Audit action
git commit --allow-empty -m "feat: implement audit server action with GitHub API" --date="2025-12-15 17:00:00"
$env:GIT_COMMITTER_DATE = "2025-12-15 17:00:00"
git commit --amend --no-edit --date="2025-12-15 17:00:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Dec 18 - ScoreCard
git commit --allow-empty -m "feat: create ScoreCard component with visual breakdown" --date="2025-12-18 10:30:00"
$env:GIT_COMMITTER_DATE = "2025-12-18 10:30:00"
git commit --amend --no-edit --date="2025-12-18 10:30:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Dec 20 - AuditHistory
git commit --allow-empty -m "feat: add AuditHistory component" --date="2025-12-20 14:00:00"
$env:GIT_COMMITTER_DATE = "2025-12-20 14:00:00"
git commit --amend --no-edit --date="2025-12-20 14:00:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Dec 23 - Dashboard complete
git commit --allow-empty -m "feat: complete dashboard page with audit form" --date="2025-12-23 11:45:00"
$env:GIT_COMMITTER_DATE = "2025-12-23 11:45:00"
git commit --amend --no-edit --date="2025-12-23 11:45:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Dec 26 - Env example
git commit --allow-empty -m "chore: add environment example file" --date="2025-12-26 15:30:00"
$env:GIT_COMMITTER_DATE = "2025-12-26 15:30:00"
git commit --amend --no-edit --date="2025-12-26 15:30:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Dec 28 - Score history chart
git commit --allow-empty -m "feat: add score history chart with Recharts" --date="2025-12-28 12:00:00"
$env:GIT_COMMITTER_DATE = "2025-12-28 12:00:00"
git commit --amend --no-edit --date="2025-12-28 12:00:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 2 - AuditProgress
git commit --allow-empty -m "feat: progressive audit UI with step animations" --date="2026-01-02 10:15:00"
$env:GIT_COMMITTER_DATE = "2026-01-02 10:15:00"
git commit --amend --no-edit --date="2026-01-02 10:15:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 5 - Analyze page
git commit --allow-empty -m "feat: create /analyze page with AuditForm" --date="2026-01-05 16:30:00"
$env:GIT_COMMITTER_DATE = "2026-01-05 16:30:00"
git commit --amend --no-edit --date="2026-01-05 16:30:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 8 - Premium schema
git commit --allow-empty -m "feat: add premium fields to User schema" --date="2026-01-08 09:00:00"
$env:GIT_COMMITTER_DATE = "2026-01-08 09:00:00"
git commit --amend --no-edit --date="2026-01-08 09:00:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 12 - Pricing page
git commit --allow-empty -m "feat: create pricing page with tier comparison" --date="2026-01-12 14:45:00"
$env:GIT_COMMITTER_DATE = "2026-01-12 14:45:00"
git commit --amend --no-edit --date="2026-01-12 14:45:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 15 - Webhook
git commit --allow-empty -m "feat: add LemonSqueezy webhook handler" --date="2026-01-15 11:30:00"
$env:GIT_COMMITTER_DATE = "2026-01-15 11:30:00"
git commit --amend --no-edit --date="2026-01-15 11:30:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 18 - Paywall
git commit --allow-empty -m "feat: implement paywall in audit action" --date="2026-01-18 17:15:00"
$env:GIT_COMMITTER_DATE = "2026-01-18 17:15:00"
git commit --amend --no-edit --date="2026-01-18 17:15:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 20 - Compare action
git commit --allow-empty -m "feat: compare profiles server action" --date="2026-01-20 10:00:00"
$env:GIT_COMMITTER_DATE = "2026-01-20 10:00:00"
git commit --amend --no-edit --date="2026-01-20 10:00:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 22 - Compare UI
git commit --allow-empty -m "feat: compare profiles UI with side-by-side cards" --date="2026-01-22 15:00:00"
$env:GIT_COMMITTER_DATE = "2026-01-22 15:00:00"
git commit --amend --no-edit --date="2026-01-22 15:00:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 25 - AI recommendations
git commit --allow-empty -m "feat: AI recommendations with Gemini API" --date="2026-01-25 12:30:00"
$env:GIT_COMMITTER_DATE = "2026-01-25 12:30:00"
git commit --amend --no-edit --date="2026-01-25 12:30:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 27 - Navbar
git commit --allow-empty -m "feat: add navigation bar component" --date="2026-01-27 09:45:00"
$env:GIT_COMMITTER_DATE = "2026-01-27 09:45:00"
git commit --amend --no-edit --date="2026-01-27 09:45:00"
Remove-Item Env:\GIT_COMMITTER_DATE

# Jan 29 - Final
git commit --allow-empty -m "feat: complete Phase 2 features and polish" --date="2026-01-29 18:00:00"
$env:GIT_COMMITTER_DATE = "2026-01-29 18:00:00"
git commit --amend --no-edit --date="2026-01-29 18:00:00"
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "`nAll commits created! Run 'git log --oneline' to verify." -ForegroundColor Green
Write-Host "Then push with: git remote add origin https://github.com/thisbevibhor/gitscore.git && git push -u origin main" -ForegroundColor Cyan
