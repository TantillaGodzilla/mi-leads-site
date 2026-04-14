import { NextResponse } from "next/server"

const REQUIRED = [
  "first_name",
  "last_name",
  "phone",
  "email",
  "sales_license",
  "experience",
  "dealership_name",
  "city",
  "state",
  "postal",
  "hear_about_us",
] as const

export async function POST(req: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const missing = REQUIRED.filter((key) => !body[key] || String(body[key]).trim() === "")
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 })
  }

  const toString = (value: unknown) => typeof value === "string" ? value : ""
  const toStringArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
  const toReferralArray = (value: unknown) =>
    Array.isArray(value)
      ? value.filter((item): item is { fullName?: string; dealership?: string; contactNumber?: string } =>
          typeof item === "object" && item !== null,
        )
      : []

  const referrals = toReferralArray(body.referrals)
    .map((row) => ({
      full_name: toString(row.fullName).trim(),
      dealership: toString(row.dealership).trim(),
      contact_number: toString(row.contactNumber).trim(),
    }))
    .filter((row) => row.full_name || row.dealership || row.contact_number)

  const normalizedPayload = {
    source: "mi-leads-site",
    submitted_at: new Date().toISOString(),
    summary: {
      full_name: `${toString(body.first_name).trim()} ${toString(body.last_name).trim()}`.trim(),
      phone: toString(body.phone).trim(),
      email: toString(body.email).trim(),
      dealership_name: toString(body.dealership_name).trim(),
      state: toString(body.state).trim(),
      hear_about_us: toString(body.hear_about_us).trim(),
    },
    contact: {
      first_name: toString(body.first_name).trim(),
      last_name: toString(body.last_name).trim(),
      has_nickname: Boolean(body.has_nickname),
      nickname: toString(body.nickname).trim(),
      phone: toString(body.phone).trim(),
      email: toString(body.email).trim(),
    },
    licensing: {
      sales_license: toString(body.sales_license).trim(),
      license_process: toString(body.license_process).trim(),
      experience: toString(body.experience).trim(),
    },
    pilot_preferences: {
      wants_forum: toString(body.wants_forum).trim(),
      wants_updates: toString(body.wants_updates).trim(),
      beta_interest: toString(body.beta_interest).trim(),
      nda_comfort: toString(body.nda_comfort).trim(),
      phone_platform: toString(body.phone_platform).trim(),
    },
    dealership: {
      dealership_name: toString(body.dealership_name).trim(),
      address_line_1: toString(body.address_line_1).trim(),
      address_line_2: toString(body.address_line_2).trim(),
      city: toString(body.city).trim(),
      state: toString(body.state).trim(),
      postal: toString(body.postal).trim(),
      specializations: toStringArray(body.specializations),
      branded_dealership: toString(body.branded_dealership).trim(),
      manufacturers: [
        toString(body.manufacturer_primary).trim(),
        toString(body.manufacturer_secondary).trim(),
        toString(body.manufacturer_extra_1).trim(),
        toString(body.manufacturer_extra_2).trim(),
        toString(body.manufacturer_extra_3).trim(),
        toString(body.manufacturer_extra_4).trim(),
      ].filter(Boolean),
      dealership_size: toString(body.dealership_size).trim(),
      dealership_sales: toString(body.dealership_sales).trim(),
      personal_sales: toString(body.personal_sales).trim(),
      personal_specializations: toStringArray(body.personal_specializations),
      limited_brands: toString(body.limited_brands).trim(),
      limited_brand_names: toString(body.limited_brand_names).trim(),
    },
    attribution: {
      hear_about_us: toString(body.hear_about_us).trim(),
      referral_first_name: toString(body.referral_first_name).trim(),
      referral_last_name: toString(body.referral_last_name).trim(),
      knows_anyone: toString(body.knows_anyone).trim(),
      referrals,
    },
    finishing_up: {
      certify_accuracy: Boolean(body.certify_accuracy),
      comments: toString(body.comments).trim(),
    },
    raw_form_data: body,
  }

  if (!webhookUrl) {
    return NextResponse.json({
      ok: true,
      mocked: true,
      payload: normalizedPayload,
      message: "Webhook not configured yet. Local preview submission accepted.",
    })
  }

  try {
    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedPayload),
    })

    if (!n8nRes.ok) {
      console.error("n8n webhook returned", n8nRes.status)
      return NextResponse.json({ error: "Failed to submit lead" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("n8n fetch failed:", err)
    return NextResponse.json({ error: "Failed to reach webhook" }, { status: 502 })
  }
}
