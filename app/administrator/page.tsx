import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  BarChart3,
  CreditCard,
  FileText,
  FolderOpen,
  LayoutTemplate,
  LogOut,
  Search,
  Settings,
  Users,
  Zap,
  SquareKanban,
} from 'lucide-react'


import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminPlansEditor } from '@/components/admin-plans-editor'
import { deleteAdminSession, getAdminSession } from '@/lib/admin-auth'
import { getAdminDashboardData } from '@/lib/admin-dashboard'
import { saveAllPlansAction, updatePlanStatusAction } from '@/lib/plans'
import { sql } from '@/lib/db'


export const dynamic = 'force-dynamic'

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'categories', label: 'Categories', icon: FolderOpen },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'plans', label: 'Plans', icon: SquareKanban },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function money(cents: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(cents / 100)
}

function date(value: string | Date | null) {
  if (!value) return 'N/A'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

async function logoutAdmin() {
  'use server'

  await deleteAdminSession()
  redirect('/admin-login')
}



async function updateTemplateFlag(formData: FormData) {
  'use server'

  const admin = await getAdminSession()
  if (!admin) redirect('/admin-login')

  const templateId = Number(formData.get('templateId'))
  const field = String(formData.get('field') || '')
  const nextValue = formData.get('nextValue') === 'true'

  if (!Number.isInteger(templateId)) return

  if (field === 'is_active') {
    await sql`
      UPDATE templates
      SET is_active = ${nextValue}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${templateId}
    `
  }

  if (field === 'is_featured') {
    await sql`
      UPDATE templates
      SET is_featured = ${nextValue}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${templateId}
    `
  }

  revalidatePath('/administrator')
}

async function updateCategoryStatus(formData: FormData) {
  'use server'

  const admin = await getAdminSession()
  if (!admin) redirect('/admin-login')

  const categoryId = Number(formData.get('categoryId'))
  const nextValue = formData.get('nextValue') === 'true'

  if (!Number.isInteger(categoryId)) return

  await sql`
    UPDATE categories
    SET is_active = ${nextValue}
    WHERE id = ${categoryId}
  `

  revalidatePath('/administrator')
}

async function updateUserCredits(formData: FormData) {
  'use server'

  const admin = await getAdminSession()
  if (!admin) redirect('/admin-login')

  const userId = Number(formData.get('userId'))
  const creditsAvailable = Number(formData.get('creditsAvailable'))

  if (!Number.isInteger(userId)) return

  await sql`
    UPDATE user_credits
    SET credits_available = ${creditsAvailable},
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
  `

  revalidatePath('/administrator')
}

type PageProps = {
  searchParams?: Promise<{
    section?: string
    q?: string
  }>
}

export default async function AdministratorPage({ searchParams }: PageProps) {
  const admin = await getAdminSession()
  if (!admin) redirect('/admin-login')

  const params = await searchParams
  const section = navItems.some((item) => item.id === params?.section)
    ? params?.section || 'overview'
    : 'overview'
  const search = params?.q?.trim() || ''
  const data = await getAdminDashboardData(search)

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Letterise
            </Link>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Administrator</h1>
            <p className="text-sm text-muted-foreground">
              Signed in as {admin.email}
            </p>
          </div>

          <form action={logoutAdmin}>
            <Button variant="outline" type="submit">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </header>

      <div className="container mx-auto grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const selected = section === item.id

            return (
              <Button
                key={item.id}
                variant={selected ? 'default' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link href={`/administrator?section=${item.id}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </aside>

        <main className="space-y-6">
          {section === 'overview' && (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Users" value={data.stats.users} icon={Users} />
                <StatCard label="Documents" value={data.stats.documents} icon={FileText} />
                <StatCard label="Templates" value={data.stats.templates} icon={LayoutTemplate} />
                <StatCard label="Revenue" value={money(data.stats.revenueCents)} icon={CreditCard} />
                <StatCard label="Active Subscriptions" value={data.stats.activeSubscriptions} icon={Zap} />
                <StatCard label="Credits Used" value={data.stats.creditsUsed} icon={Zap} />
                <StatCard label="Active Categories" value={data.stats.activeCategories} icon={FolderOpen} />
              </section>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>Latest generated documents from customers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.recentDocuments.length === 0 ? (
                    <EmptyState message="No documents have been generated yet." />
                  ) : (
                    data.recentDocuments.map((doc) => (
                      <div key={doc.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_160px_140px] md:items-center">
                        <div className="min-w-0">
                          <div className="font-medium">{doc.title}</div>
                          <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>{doc.email || 'Unknown user'}</span>
                            <span>{doc.template_name || 'Deleted template'}</span>
                            {doc.category_name && <Badge variant="secondary">{doc.category_name}</Badge>}
                          </div>
                        </div>
                        <Badge variant={doc.status === 'finalized' ? 'default' : 'secondary'}>
                          {doc.status || 'draft'}
                        </Badge>
                        <div className="text-sm text-muted-foreground">{date(doc.created_at)}</div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {section === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Review accounts, documents, credits, and active subscriptions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="flex max-w-md gap-2">
                  <input type="hidden" name="section" value="users" />
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input name="q" defaultValue={search} placeholder="Search users" className="pl-9" />
                  </div>
                  <Button type="submit" variant="outline">Search</Button>
                </form>

                {data.users.length === 0 ? (
                  <EmptyState message="No users found." />
                ) : (
                  data.users.map((user) => (
                    <div key={user.id} className="grid gap-4 rounded-lg border p-4 xl:grid-cols-[1.4fr_1fr_220px] xl:items-center">
                      <div>
                        <div className="font-medium">{user.full_name || 'Unnamed user'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="mt-2 text-xs text-muted-foreground">Joined {date(user.created_at)}</div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{Number(user.document_count)} documents</Badge>
                        <Badge variant="secondary">{Number(user.credits_used)} used</Badge>
                        <Badge>{user.active_plan || 'No plan'}</Badge>
                      </div>

                      <form action={updateUserCredits} className="flex items-end gap-2">
                        <input type="hidden" name="userId" value={user.id} />
                        <div className="flex-1 space-y-1">
                          <Label htmlFor={`credits-${user.id}`}>Credits</Label>
                          <Input
                            id={`credits-${user.id}`}
                            name="creditsAvailable"
                            type="number"
                            min="0"
                            defaultValue={Number(user.credits_available)}
                          />
                        </div>
                        <Button type="submit" variant="outline">Save</Button>
                      </form>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {section === 'templates' && (
            <Card>
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>Control which document templates are visible and featured.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.templates.map((template) => (
                  <div key={template.id} className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[1fr_260px] lg:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-medium">{template.name}</h2>
                        <Badge variant={template.is_active ? 'default' : 'secondary'}>
                          {template.is_active ? 'Active' : 'Hidden'}
                        </Badge>
                        {template.is_featured && <Badge variant="secondary">Featured</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {template.category_name || 'Uncategorized'} / {template.slug}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <ToggleTemplateButton
                        templateId={template.id}
                        field="is_active"
                        nextValue={!template.is_active}
                        label={template.is_active ? 'Hide' : 'Show'}
                      />
                      <ToggleTemplateButton
                        templateId={template.id}
                        field="is_featured"
                        nextValue={!template.is_featured}
                        label={template.is_featured ? 'Unfeature' : 'Feature'}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {section === 'categories' && (
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Match the frontend category library and hide categories when needed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.categories.map((category) => (
                  <div key={category.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-[1fr_160px] md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-medium">{category.name}</h2>
                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                          {category.is_active ? 'Active' : 'Hidden'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {category.slug} / {Number(category.template_count)} templates
                      </div>
                    </div>

                    <form action={updateCategoryStatus}>
                      <input type="hidden" name="categoryId" value={category.id} />
                      <input type="hidden" name="nextValue" value={String(!category.is_active)} />
                      <Button type="submit" variant="outline" className="w-full">
                        {category.is_active ? 'Hide' : 'Show'}
                      </Button>
                    </form>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {section === 'payments' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest credit and subscription payments.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.transactions.length === 0 ? (
                    <EmptyState message="No transactions yet." />
                  ) : (
                    data.transactions.map((transaction) => (
                      <div key={transaction.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_120px_120px] md:items-center">
                        <div>
                          <div className="font-medium">{transaction.email || 'Unknown user'}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.transaction_type} / {transaction.credits_purchased || 0} credits
                          </div>
                        </div>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                        <div className="text-sm font-medium">{money(Number(transaction.amount_cents))}</div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {section === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardDescription>Authentication and environment settings for this dashboard.</CardDescription>
                  <CardDescription>Environment settings required for this dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <ConfigItem label="Admin user table" configured={true} />
                  <ConfigItem label="Admin JWT secret" configured={Boolean(process.env.ADMIN_JWT_SECRET)} />
                  <ConfigItem label="Database URL" configured={Boolean(process.env.DATABASE_URL)} />
                  <ConfigItem label="Stripe secret" configured={Boolean(process.env.STRIPE_SECRET_KEY)} />
                  <ConfigItem label="Stripe webhook secret" configured={Boolean(process.env.STRIPE_WEBHOOK_SECRET)} />
                </CardContent>
              </Card>

              
            </div>
          )}

           {section === 'plans' && (
            <Card>
              <CardHeader>
                <CardTitle>Plans Management</CardTitle>
                <CardDescription>Create and manage credit and monthly plans from one place.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminPlansEditor initialPlans={data.plans as any[]} action={saveAllPlansAction} />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: typeof Users
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}

function ToggleTemplateButton({
  templateId,
  field,
  nextValue,
  label,
}: {
  templateId: number
  field: 'is_active' | 'is_featured'
  nextValue: boolean
  label: string
}) {
  return (
    <form action={updateTemplateFlag}>
      <input type="hidden" name="templateId" value={templateId} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="nextValue" value={String(nextValue)} />
      <Button type="submit" variant="outline">{label}</Button>
    </form>
  )
}

function ConfigItem({ label, configured }: { label: string; configured: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <span className="text-sm font-medium">{label}</span>
      <Badge variant={configured ? 'default' : 'secondary'}>
        {configured ? 'Configured' : 'Missing'}
      </Badge>
    </div>
  )
}
