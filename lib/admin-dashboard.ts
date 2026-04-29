import 'server-only'

import { sql } from '@/lib/db'

export type AdminDashboardData = {
  stats: {
    users: number
    documents: number
    templates: number
    activeCategories: number
    activeSubscriptions: number
    revenueCents: number
    creditsUsed: number
  }
  recentDocuments: any[]
  users: any[]
  categories: any[]
  templates: any[]
  transactions: any[]
  plans: any[]
}

function toNumber(value: unknown) {
  return Number(value ?? 0)
}

export async function getAdminDashboardData(search = ''): Promise<AdminDashboardData> {
  const searchTerm = `%${search}%`

  const [
    statsRows,
    recentDocuments,
    users,
    categories,
    templates,
    transactions,
    plans,
  ] = await Promise.all([
    sql`
      SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM documents) AS documents,
        (SELECT COUNT(*) FROM templates) AS templates,
        (SELECT COUNT(*) FROM categories WHERE is_active = true) AS active_categories,
        (SELECT COUNT(*) FROM user_subscriptions WHERE status = 'active') AS active_subscriptions,
        (SELECT COALESCE(SUM(amount_cents), 0) FROM transactions WHERE status = 'completed') AS revenue_cents,
        (SELECT COALESCE(SUM(credits_used), 0) FROM user_credits) AS credits_used
    `,
    sql`
      SELECT
        d.id,
        d.title,
        d.status,
        d.credits_used,
        d.created_at,
        u.email,
        t.name AS template_name,
        c.name AS category_name
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN templates t ON d.template_id = t.id
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY d.created_at DESC
      LIMIT 12
    `,
    sql`
      SELECT
        u.id,
        u.email,
        u.full_name,
        u.created_at,
        COALESCE(uc.credits_available, 0) AS credits_available,
        COALESCE(uc.credits_used, 0) AS credits_used,
        (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id) AS document_count,
        (
          SELECT p.name
          FROM user_subscriptions us
          JOIN subscription_plans p ON us.plan_id = p.id
          WHERE us.user_id = u.id AND us.status = 'active'
          ORDER BY us.created_at DESC
          LIMIT 1
        ) AS active_plan
      FROM users u
      LEFT JOIN user_credits uc ON uc.user_id = u.id
      WHERE ${search === ''}
        OR u.email ILIKE ${searchTerm}
        OR COALESCE(u.full_name, '') ILIKE ${searchTerm}
      ORDER BY u.created_at DESC
      LIMIT 40
    `,
    sql`
      SELECT
        c.id,
        c.name,
        c.slug,
        c.description,
        c.display_order,
        c.is_active,
        COUNT(t.id) AS template_count
      FROM categories c
      LEFT JOIN templates t ON t.category_id = c.id
      GROUP BY c.id
      ORDER BY c.display_order, c.name
    `,
    sql`
      SELECT
        t.id,
        t.name,
        t.slug,
        t.description,
        t.estimated_length,
        t.is_featured,
        t.is_active,
        t.updated_at,
        c.name AS category_name
      FROM templates t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY c.display_order, t.name
      LIMIT 80
    `,
    sql`
      SELECT
        tr.id,
        tr.amount_cents,
        tr.credits_purchased,
        tr.transaction_type,
        tr.status,
        tr.created_at,
        u.email
      FROM transactions tr
      LEFT JOIN users u ON tr.user_id = u.id
      ORDER BY tr.created_at DESC
      LIMIT 25
    `,
    sql`
      SELECT
        id,
        name,
        description,
        price_cents,
        credits_per_month,
        is_active,
        created_at
      FROM subscription_plans
      ORDER BY price_cents
    `,
  ])

  const stats = statsRows[0] || {}

  return {
    stats: {
      users: toNumber(stats.users),
      documents: toNumber(stats.documents),
      templates: toNumber(stats.templates),
      activeCategories: toNumber(stats.active_categories),
      activeSubscriptions: toNumber(stats.active_subscriptions),
      revenueCents: toNumber(stats.revenue_cents),
      creditsUsed: toNumber(stats.credits_used),
    },
    recentDocuments,
    users,
    categories,
    templates,
    transactions,
    plans,
  }
}
