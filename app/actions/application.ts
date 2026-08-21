'use server'

import { applicationSchema, ApplicationInput } from '@/lib/validation'
import { supabaseAdmin } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { triggerNotification } from '@/lib/notifications'

// Submit Application Action (accessible by public)
export async function submitApplication(data: unknown) {
  // 1. Validate inputs server-side
  const parsed = applicationSchema.safeParse(data)
  if (!parsed.success) {
    // Return structured validation errors
    const fieldErrors: Record<string, string> = {}
    parsed.error.issues.forEach((err) => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as string] = err.message
      }
    })
    return { success: false, errors: fieldErrors }
  }

  const { name, email, experience, market, challenge, process, goal, commitment } = parsed.data

  try {
    // 2. Spam & Duplicate Prevention: check if this email submitted an application in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: existing, error: dupError } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('email', email)
      .gt('created_at', fiveMinutesAgo)
      .limit(1)

    if (dupError) {
      console.error('[Database Error] Failed to perform duplicate check:', dupError.message)
    }

    if (existing && existing.length > 0) {
      return {
        success: false,
        message: 'An application with this email was recently submitted. Please wait 5 minutes before trying again.',
      }
    }

    // 3. Insert application into Supabase
    const { data: newApp, error: insertError } = await supabaseAdmin
      .from('applications')
      .insert({
        name,
        email,
        experience,
        market,
        challenge,
        process,
        goal,
        commitment,
        status: 'new',
      })
      .select()
      .single()

    if (insertError || !newApp) {
      // Log failure without storing sensitive application content in logs
      console.error(`[Database Error] Application insertion failed for email ${email.replace(/(?<=.{2}).(?=.*@)/g, '*')}`)
      return { success: false, message: 'Something went wrong saving your application. Please try again.' }
    }

    // 4. Trigger email notification asynchronously (do not await to speed up user response)
    triggerNotification(newApp.id).catch((err) => {
      console.error(`[Notification Trigger Error] Failed to start notification for app ${newApp.id}:`, err)
    })

    return { success: true, id: newApp.id }
  } catch (err) {
    console.error('[Server Error] Exception in submitApplication action:', err)
    return { success: false, message: 'A server error occurred. Please try again later.' }
  }
}

// Helper to verify admin auth session
async function verifyAdminSession() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Seeded/reviewer email check. In production, this can also check for an 'admin' meta claim.
    if (error || !user || user.email !== 'blues@example.com') {
      return { authenticated: false, email: null }
    }
    return { authenticated: true, email: user.email }
  } catch {
    return { authenticated: false, email: null }
  }
}

// Update application status (Admin only)
export async function updateApplicationStatus(id: string, status: 'new' | 'reviewing' | 'accepted' | 'declined') {
  const { authenticated } = await verifyAdminSession()
  if (!authenticated) {
    return { success: false, message: 'Unauthorized. Admin session required.' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('applications')
      .update({
        status,
        reviewed_at: status !== 'new' && status !== 'reviewing' ? new Date().toISOString() : null,
      })
      .eq('id', id)

    if (error) {
      console.error(`[Database Error] Failed to update application status for ${id}:`, error.message)
      return { success: false, message: 'Failed to update status.' }
    }

    return { success: true }
  } catch (err) {
    console.error('[Server Error] Exception in updateApplicationStatus:', err)
    return { success: false, message: 'Server error occurred.' }
  }
}

// Add mentor note (Admin only)
export async function addMentorNote(id: string, notes: string) {
  const { authenticated } = await verifyAdminSession()
  if (!authenticated) {
    return { success: false, message: 'Unauthorized. Admin session required.' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('applications')
      .update({ notes })
      .eq('id', id)

    if (error) {
      console.error(`[Database Error] Failed to save mentor note for ${id}:`, error.message)
      return { success: false, message: 'Failed to save notes.' }
    }

    return { success: true }
  } catch (err) {
    console.error('[Server Error] Exception in addMentorNote:', err)
    return { success: false, message: 'Server error occurred.' }
  }
}

// Delete application (Admin only)
export async function deleteApplication(id: string) {
  const { authenticated } = await verifyAdminSession()
  if (!authenticated) {
    return { success: false, message: 'Unauthorized. Admin session required.' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`[Database Error] Failed to delete application ${id}:`, error.message)
      return { success: false, message: 'Failed to delete application.' }
    }

    return { success: true }
  } catch (err) {
    console.error('[Server Error] Exception in deleteApplication:', err)
    return { success: false, message: 'Server error occurred.' }
  }
}

// Retry email notification (Admin only)
export async function retryNotification(id: string) {
  const { authenticated } = await verifyAdminSession()
  if (!authenticated) {
    return { success: false, message: 'Unauthorized. Admin session required.' }
  }

  try {
    await triggerNotification(id)
    return { success: true }
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to retry notification.' }
  }
}
