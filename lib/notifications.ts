import { Resend } from 'resend'
import { supabaseAdmin } from './supabase'

const resendApiKey = process.env.RESEND_API_KEY
const toEmail = process.env.NOTIFICATIONS_TO_EMAIL || 'blues@example.com' // Seeded/reviewer email

export async function triggerNotification(applicationId: string) {
  // 1. Fetch the application details
  const { data: application, error: fetchError } = await supabaseAdmin
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .single()

  if (fetchError || !application) {
    console.error(`[Notification Error] Failed to fetch application ${applicationId}:`, fetchError)
    return
  }

  // 2. Insert or find the pending notification record
  const { data: notification, error: notifError } = await supabaseAdmin
    .from('notifications')
    .insert({
      application_id: applicationId,
      status: 'pending',
    })
    .select()
    .single()

  if (notifError || !notification) {
    console.error(`[Notification Error] Failed to create notification log for ${applicationId}:`, notifError)
    return
  }

  // 3. Verify Resend configuration
  if (!resendApiKey) {
    const errorMsg = 'RESEND_API_KEY is not configured.'
    console.error(`[Notification Failed] ${errorMsg}`)
    await supabaseAdmin
      .from('notifications')
      .update({
        status: 'failed',
        error_message: errorMsg,
      })
      .eq('id', notification.id)
    return
  }

  // 4. Send email using Resend
  const resend = new Resend(resendApiKey)

  try {
    const { data: emailData, error: sendError } = await resend.emails.send({
      from: 'Marcus Vale Mentorship <onboarding@resend.dev>',
      to: toEmail,
      subject: `New Mentorship Application from ${application.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #111;">New Mentorship Application</h2>
          <p><strong>Name:</strong> ${application.name}</p>
          <p><strong>Email:</strong> ${application.email}</p>
          <p><strong>Experience:</strong> ${application.experience}</p>
          <p><strong>Markets Traded:</strong> ${application.market}</p>
          
          <h3 style="margin-top: 20px; color: #333;">Biggest Challenge</h3>
          <p style="background: #f9f9f9; padding: 10px; border-left: 3px solid #c6a06a;">${application.challenge}</p>
          
          <h3 style="margin-top: 20px; color: #333;">Current Process</h3>
          <p style="background: #f9f9f9; padding: 10px; border-left: 3px solid #c6a06a;">${application.process}</p>
          
          <h3 style="margin-top: 20px; color: #333;">8-Week Goal</h3>
          <p style="background: #f9f9f9; padding: 10px; border-left: 3px solid #c6a06a;">${application.goal}</p>
          
          <p><strong>Commitment Level:</strong> ${application.commitment}</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" style="background: #c6a06a; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 3px; font-weight: bold;">
              Review Application in Dashboard
            </a>
          </div>
        </div>
      `,
    })

    if (sendError) {
      throw sendError
    }

    // 5. Update log on success
    await supabaseAdmin
      .from('notifications')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', notification.id)

    console.log(`[Notification Success] Email notification sent successfully for application ${applicationId}`)
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`[Notification Failed] Failed to send email for ${applicationId}:`, error)

    // Update log on failure
    await supabaseAdmin
      .from('notifications')
      .update({
        status: 'failed',
        error_message: errorMsg,
      })
      .eq('id', notification.id)
  }
}
