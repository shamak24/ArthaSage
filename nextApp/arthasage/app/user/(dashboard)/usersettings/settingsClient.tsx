"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  IconBuildingBank,
  IconCheck,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconEdit,
  IconLoader2,
  IconLogout,
  IconMail,
  IconMapPin,
  IconShieldCheck,
  IconTrash,
  IconUnlink,
  IconUser,
  IconX,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { deleteFinancialAccount } from "@/lib/actions/deleteAccount"

// ─── Types ────────────────────────────────────────────────────────────────────

type BetterAuthSession = {
  id: string
  token: string
  expiresAt: Date | string
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date | string
}

type LinkedAccount = {
  id: string
  name: string
  provider: string
  type: string
  isSimulated: boolean
  transactionCount: number
  holdingCount: number
}

type Props = {
  userId: string
  name: string
  email: string
  image: string | null
  emailVerified: boolean
  createdAt: Date | string
  currentToken: string
  accounts: LinkedAccount[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function parseUserAgent(ua: string | null | undefined) {
  if (!ua) return { label: "Unknown device", isMobile: false }
  const mobile = /android|iphone|ipad|mobile/i.test(ua)
  let browser = "Unknown browser"
  if (/chrome/i.test(ua) && !/edge|opr/i.test(ua)) browser = "Chrome"
  else if (/firefox/i.test(ua)) browser = "Firefox"
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari"
  else if (/edg/i.test(ua)) browser = "Edge"
  else if (/opr/i.test(ua)) browser = "Opera"
  let os = ""
  if (/windows/i.test(ua)) os = "Windows"
  else if (/mac os/i.test(ua)) os = "macOS"
  else if (/android/i.test(ua)) os = "Android"
  else if (/ios|iphone|ipad/i.test(ua)) os = "iOS"
  else if (/linux/i.test(ua)) os = "Linux"
  return { label: [browser, os].filter(Boolean).join(" · "), isMobile: mobile }
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatSessionDate(date: Date | string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ─── Linked Accounts Card ────────────────────────────────────────────────────

function LinkedAccountsCard({ accounts: initial }: { accounts: LinkedAccount[] }) {
  const router = useRouter()
  const [accounts, setAccounts] = useState<LinkedAccount[]>(initial ?? [])
  const [deleting, setDeleting] = useState<string | null>(null)

  async function delink(id: string) {
    setDeleting(id)
    try {
      const { redirectToOnboarding } = await deleteFinancialAccount(id)
      setAccounts((prev) => prev.filter((a) => a.id !== id))
      if (redirectToOnboarding) {
        toast.success("All accounts delinked — redirecting to onboarding…")
        router.push("/user/onboarding")
      } else {
        toast.success("Account delinked")
      }
    } catch {
      toast.error("Failed to delink account")
    }
    setDeleting(null)
  }

  const banks = accounts.filter((a) => a.type === "bank")
  const demat = accounts.filter((a) => a.type === "demat")
  const other = accounts.filter((a) => a.type !== "bank" && a.type !== "demat")

  const sections = [
    { label: "Bank Accounts", icon: "🏦", items: banks },
    { label: "Demat / Portfolio", icon: "📈", items: demat },
    ...(other.length > 0 ? [{ label: "Other", icon: "📁", items: other }] : []),
  ].filter((s) => s.items.length > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBuildingBank className="size-4" />
          Linked Accounts
        </CardTitle>
        <CardDescription>
          Remove a linked account to stop syncing its data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {accounts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No accounts linked
          </p>
        ) : (
          sections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.icon} {section.label}
              </p>
              <div className="space-y-2">
                {section.items.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{account.provider}</p>
                        {account.isSimulated && (
                          <Badge variant="secondary" className="text-xs">
                            Simulated
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {account.type === "bank"
                          ? `${account.transactionCount} transactions`
                          : `${account.holdingCount} holdings`}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => delink(account.id)}
                      disabled={deleting === account.id}
                    >
                      {deleting === account.id ? (
                        <IconLoader2 className="size-3.5 animate-spin" />
                      ) : (
                        <IconUnlink className="size-3.5" />
                      )}
                      Delink
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

// ─── Profile Card ─────────────────────────────────────────────────────────────

function ProfileCard({
  name: initialName,
  email,
  image,
  emailVerified,
}: Pick<Props, "name" | "email" | "image" | "emailVerified">) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [draft, setDraft] = useState(initialName)
  const [loading, setLoading] = useState(false)

  async function saveName() {
    if (!draft.trim() || draft === name) {
      setEditing(false)
      return
    }
    setLoading(true)
    const { error } = await authClient.updateUser({ name: draft.trim() })
    if (error) {
      toast.error("Failed to update name")
    } else {
      setName(draft.trim())
      setEditing(false)
      toast.success("Name updated")
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconUser className="size-4" />
          Profile
        </CardTitle>
        <CardDescription>Your public profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <Separator />

        {/* Name field */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Display Name</label>
          {editing ? (
            <div className="flex gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveName()
                  if (e.key === "Escape") { setEditing(false); setDraft(name) }
                }}
                autoFocus
                className="h-9"
              />
              <Button
                size="sm"
                onClick={saveName}
                disabled={loading}
                className="shrink-0"
              >
                {loading ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconCheck className="size-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setEditing(false); setDraft(name) }}
                disabled={loading}
                className="shrink-0"
              >
                <IconX className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
              <span className="text-sm">{name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => setEditing(true)}
              >
                <IconEdit className="size-3.5" />
                <span className="ml-1.5 text-xs">Edit</span>
              </Button>
            </div>
          )}
        </div>

        {/* Email field */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Email Address</label>
          <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
            <div className="flex items-center gap-2">
              <IconMail className="size-3.5 text-muted-foreground" />
              <span className="text-sm">{email}</span>
            </div>
            {emailVerified ? (
              <Badge className="gap-1 bg-green-500/10 text-green-600 hover:bg-green-500/10 border-green-500/20">
                <IconShieldCheck className="size-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                Unverified
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Sessions Card ────────────────────────────────────────────────────────────

function SessionsCard({ currentToken }: { currentToken: string }) {
  const [sessions, setSessions] = useState<BetterAuthSession[]>([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)

  async function fetchSessions() {
    const { data } = await authClient.listSessions()
    setSessions((data as BetterAuthSession[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchSessions() }, [])

  async function revoke(token: string) {
    setRevoking(token)
    const { error } = await authClient.revokeSession({ token })
    if (error) {
      toast.error("Failed to revoke session")
    } else {
      setSessions((prev) => prev.filter((s) => s.token !== token))
      toast.success("Session revoked")
    }
    setRevoking(null)
  }

  async function revokeAll() {
    setRevoking("all")
    const { error } = await authClient.revokeOtherSessions()
    if (error) {
      toast.error("Failed to revoke sessions")
    } else {
      setSessions((prev) => prev.filter((s) => s.token === currentToken))
      toast.success("All other sessions revoked")
    }
    setRevoking(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconDeviceDesktop className="size-4" />
              Active Sessions
            </CardTitle>
            <CardDescription className="mt-1">
              Devices currently signed in to your account
            </CardDescription>
          </div>
          {sessions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 text-destructive hover:text-destructive hover:border-destructive/50"
              onClick={revokeAll}
              disabled={revoking === "all"}
            >
              {revoking === "all" ? (
                <IconLoader2 className="size-3.5 animate-spin" />
              ) : (
                <IconTrash className="size-3.5" />
              )}
              Revoke others
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
              <Skeleton className="size-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))
        ) : sessions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No active sessions found
          </p>
        ) : (
          sessions.map((session) => {
            const isCurrent = session.token === currentToken
            const { label, isMobile } = parseUserAgent(session.userAgent)
            return (
              <div
                key={session.id}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-lg border p-4",
                  isCurrent && "border-primary/30 bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {isMobile
                      ? <IconDeviceMobile className="size-4" />
                      : <IconDeviceDesktop className="size-4" />
                    }
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{label}</p>
                      {isCurrent && (
                        <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/10 border-primary/20">
                          Current
                        </Badge>
                      )}
                    </div>
                    {session.ipAddress && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconMapPin className="size-3" />
                        {session.ipAddress}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Expires {formatSessionDate(session.expiresAt)}
                    </p>
                  </div>
                </div>
                {!isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => revoke(session.token)}
                    disabled={revoking === session.token}
                  >
                    {revoking === session.token ? (
                      <IconLoader2 className="size-4 animate-spin" />
                    ) : (
                      <IconLogout className="size-4" />
                    )}
                  </Button>
                )}
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SettingsClient({
  name,
  email,
  image,
  emailVerified,
  createdAt,
  currentToken,
  accounts,
}: Props) {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and account security
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard
            name={name}
            email={email}
            image={image}
            emailVerified={emailVerified}
          />
          <LinkedAccountsCard accounts={accounts} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Account info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">{formatDate(createdAt)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Auth method</span>
                <Badge variant="secondary" className="text-xs">Email & Password</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className="text-xs bg-green-500/10 text-green-600 hover:bg-green-500/10 border-green-500/20">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <SessionsCard currentToken={currentToken} />

          {/* Danger zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-destructive">
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => authClient.signOut()}
              >
                <IconLogout className="size-4" />
                Sign out of all devices
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
