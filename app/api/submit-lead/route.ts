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

const toString = (value: unknown) => typeof value === "string" ? value : ""
const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
const toReferralArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is { fullName?: string; dealership?: string; contactNumber?: string } =>
        typeof item === "object" && item !== null,
      )
    : []

async function sbPost(supabaseUrl: string, key: string, table: string, payload: Record<string, unknown>) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Prefer": "return=representation",
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Supabase insert into ${table} failed (${res.status}): ${text}`)
  }
  return res.json() as Promise<Record<string, unknown>[]>
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

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

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      ok: true,
      mocked: true,
      message: "Supabase not configured. Local preview submission accepted.",
    })
  }

  const referrals = toReferralArray(body.referrals)
    .map((row) => ({
      full_name: toString(row.fullName).trim(),
      dealership: toString(row.dealership).trim(),
      contact_number: toString(row.contactNumber).trim(),
    }))
    .filter((row) => row.full_name || row.dealership || row.contact_number)

  const manufacturers = [
    toString(body.manufacturer_primary),
    toString(body.manufacturer_secondary),
    toString(body.manufacturer_extra_1),
    toString(body.manufacturer_extra_2),
    toString(body.manufacturer_extra_3),
    toString(body.manufacturer_extra_4),
  ].map((m) => m.trim()).filter(Boolean)

  try {
    // 1. Insert main submission row
    const [submission] = await sbPost(supabaseUrl, supabaseKey, "submissions", {
      source: "mi-leads-site",
      submission_type: "rep_signup",
      status: "received",
      raw_form_data_json: body,
    })
    const submissionId = submission.id as string

    // 2. Insert all child records in parallel
    await Promise.all([
      sbPost(supabaseUrl, supabaseKey, "contacts", {
        submission_id: submissionId,
        first_name: toString(body.first_name).trim(),
        last_name: toString(body.last_name).trim(),
        nickname: toString(body.nickname).trim() || null,
        phone: toString(body.phone).trim(),
        email: toString(body.email).trim(),
      }),
      sbPost(supabaseUrl, supabaseKey, "dealerships", {
        submission_id: submissionId,
        name: toString(body.dealership_name).trim(),
        address_line_1: toString(body.address_line_1).trim(),
        address_line_2: toString(body.address_line_2).trim() || null,
        city: toString(body.city).trim(),
        state: toString(body.state).trim(),
        postal: toString(body.postal).trim(),
        branded_dealership: toString(body.branded_dealership).trim() || null,
        dealership_size: toString(body.dealership_size).trim() || null,
        dealership_sales: toString(body.dealership_sales).trim() || null,
      }),
      sbPost(supabaseUrl, supabaseKey, "applicant_profiles", {
        submission_id: submissionId,
        sales_license: toString(body.sales_license).trim(),
        license_process: toString(body.license_process).trim() || null,
        experience: toString(body.experience).trim(),
        personal_sales: toString(body.personal_sales).trim(),
        limited_brands: toString(body.limited_brands).trim() || null,
        limited_brand_names: toString(body.limited_brand_names).trim() || null,
      }),
      sbPost(supabaseUrl, supabaseKey, "submission_preferences", {
        submission_id: submissionId,
        wants_forum: toString(body.wants_forum).trim() || null,
        wants_updates: toString(body.wants_updates).trim() || null,
        beta_interest: toString(body.beta_interest).trim() || null,
        nda_comfort: toString(body.nda_comfort).trim() || null,
        phone_platform: toString(body.phone_platform).trim() || null,
        certify_accuracy: Boolean(body.certify_accuracy),
        comments: toString(body.comments).trim() || null,
      }),
      sbPost(supabaseUrl, supabaseKey, "submission_attribution", {
        submission_id: submissionId,
        hear_about_us: toString(body.hear_about_us).trim(),
        referral_first_name: toString(body.referral_first_name).trim() || null,
        referral_last_name: toString(body.referral_last_name).trim() || null,
        knows_anyone: toString(body.knows_anyone).trim() || null,
      }),
      // Dealership specializations
      ...toStringArray(body.specializations).map((value) =>
        sbPost(supabaseUrl, supabaseKey, "submission_specializations", {
          submission_id: submissionId,
          scope: "dealership",
          value,
        }),
      ),
      // Personal specializations
      ...toStringArray(body.personal_specializations).map((value) =>
        sbPost(supabaseUrl, supabaseKey, "submission_specializations", {
          submission_id: submissionId,
          scope: "personal",
          value,
        }),
      ),
      // Manufacturers
      ...manufacturers.map((manufacturer_name, index) =>
        sbPost(supabaseUrl, supabaseKey, "submission_manufacturers", {
          submission_id: submissionId,
          manufacturer_name,
          position: index + 1,
        }),
      ),
      // Referrals
      ...referrals.map((row) =>
        sbPost(supabaseUrl, supabaseKey, "submission_referrals", {
          submission_id: submissionId,
          ...row,
        }),
      ),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Supabase insert failed:", err)
    return NextResponse.json({ error: "Failed to save submission" }, { status: 502 })
  }
}
