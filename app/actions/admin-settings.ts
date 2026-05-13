'use server'

import { revalidatePath } from 'next/cache'
import { getAdminSession } from '@/lib/admin-auth'
import { updateSettings } from '@/lib/admin-settings'
import { redirect } from 'next/navigation'

export async function saveAdminSettingsAction(formData: FormData) {
  const admin = await getAdminSession()
  if (!admin) redirect('/admin-login')

  const stripeSettingsJson = formData.get('stripeSettings')
  
  if (stripeSettingsJson) {
    const stripeSettings = JSON.parse(stripeSettingsJson as string)
    await updateSettings('stripe', stripeSettings)
  }

  revalidatePath('/administrator')
}
