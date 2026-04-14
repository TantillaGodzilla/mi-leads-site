"use client"

import { useEffect, useMemo, useState } from "react"

type ReferralRow = {
  fullName: string
  dealership: string
  contactNumber: string
}

type LeadFormData = {
  first_name: string
  last_name: string
  has_nickname: boolean
  nickname: string
  phone: string
  email: string
  sales_license: string
  license_process: string
  experience: string
  wants_forum: string
  wants_updates: string
  beta_interest: string
  nda_comfort: string
  phone_platform: string
  dealership_name: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  postal: string
  specializations: string[]
  branded_dealership: string
  manufacturer_primary: string
  manufacturer_secondary: string
  manufacturer_extra_1: string
  manufacturer_extra_2: string
  manufacturer_extra_3: string
  manufacturer_extra_4: string
  dealership_size: string
  dealership_sales: string
  personal_sales: string
  personal_specializations: string[]
  limited_brands: string
  limited_brand_names: string
  hear_about_us: string
  referral_first_name: string
  referral_last_name: string
  knows_anyone: string
  referrals: ReferralRow[]
  certify_accuracy: boolean
  comments: string
}

const EMPTY_REFERRAL = (): ReferralRow => ({
  fullName: "",
  dealership: "",
  contactNumber: "",
})

const EMPTY: LeadFormData = {
  first_name: "",
  last_name: "",
  has_nickname: false,
  nickname: "",
  phone: "",
  email: "",
  sales_license: "",
  license_process: "",
  experience: "",
  wants_forum: "",
  wants_updates: "",
  beta_interest: "",
  nda_comfort: "",
  phone_platform: "",
  dealership_name: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "Tennessee",
  postal: "",
  specializations: [],
  branded_dealership: "",
  manufacturer_primary: "",
  manufacturer_secondary: "",
  manufacturer_extra_1: "",
  manufacturer_extra_2: "",
  manufacturer_extra_3: "",
  manufacturer_extra_4: "",
  dealership_size: "",
  dealership_sales: "",
  personal_sales: "",
  personal_specializations: [],
  limited_brands: "",
  limited_brand_names: "",
  hear_about_us: "",
  referral_first_name: "",
  referral_last_name: "",
  knows_anyone: "",
  referrals: Array.from({ length: 5 }, EMPTY_REFERRAL),
  certify_accuracy: false,
  comments: "",
}

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
]

const ALL_MAKES = [
  "Acura","Alfa Romeo","AMC","Aston Martin","Audi","Bentley","BMW","Buick",
  "Cadillac","Chevrolet","Chrysler","Daewoo","Datsun","Dodge","Eagle",
  "Ferrari","Fiat","Fisker","Ford","Genesis","Geo","GMC","Honda","Hummer",
  "Hyundai","Infiniti","Isuzu","Jaguar","Jeep","Kia","Lamborghini",
  "Land Rover","Lexus","Lincoln","Lotus","Lucid","Maserati","Maybach",
  "Mazda","McLaren","Mercedes-Benz","Mercury","Mini","Mitsubishi","Nissan",
  "Oldsmobile","Plymouth","Polestar","Pontiac","Porsche","Ram","Rivian",
  "Rolls-Royce","Saab","Saturn","Scion","Sterling","Subaru","Suzuki",
  "Tesla","Toyota","Volkswagen","Volvo",
].sort()

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px",
  borderRadius: 10, fontSize: 15,
  border: "1px solid rgba(168,85,247,0.25)",
  background: "rgba(255,255,255,0.04)",
  color: "#f0eeff", outline: "none",
  boxSizing: "border-box",
}

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" }

const optStyle: React.CSSProperties = { color: "#1a0a2e", background: "#fff" }

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 88,
  fontFamily: "inherit",
  lineHeight: 1.5,
}

const labelStyle: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: 6,
  fontSize: 13, fontWeight: 600,
  color: "rgba(240,238,255,0.55)", letterSpacing: "0.04em",
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section style={{ border: "1px solid rgba(168,85,247,0.2)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 18px",
        background: "rgba(123,47,190,0.12)",
        fontSize: 14, fontWeight: 700,
        color: "rgba(240,238,255,0.8)",
        letterSpacing: "0.03em",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <span style={{ fontSize: 12, opacity: 0.5 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{
          padding: "18px",
          display: "flex", flexDirection: "column", gap: 16,
          background: "rgba(255,255,255,0.01)",
        }}>
          {children}
        </div>
      )}
    </section>
  )
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
      {options.map((option) => {
        return (
          <label
            key={option}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 14, fontWeight: 400,
              color: "rgba(240,238,255,0.7)",
              letterSpacing: 0,
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              checked={value === option}
              onChange={() => onChange(option)}
              style={{ accentColor: "#a855f7", width: 15, height: 15, cursor: "pointer", flexShrink: 0 }}
            />
            {option}
          </label>
        )
      })}
    </div>
  )
}

function CheckGroup({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
  columns?: number
}) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option))
      return
    }
    onChange([...value, option])
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: "8px 16px",
      marginTop: 2,
    }}>
      {options.map((option) => {
        return (
          <label
            key={option}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 14, fontWeight: 400,
              color: "rgba(240,238,255,0.7)",
              letterSpacing: 0,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => toggle(option)}
              style={{ accentColor: "#a855f7", width: 15, height: 15, cursor: "pointer", flexShrink: 0 }}
            />
            {option}
          </label>
        )
      })}
    </div>
  )
}

function SingleAutocomplete({
  options, value, onChange, placeholder = "Type to search...", disabled = false,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)

  useEffect(() => { setQuery(value) }, [value])

  const filtered = query.length > 0 && query !== value
    ? options.filter((option) => option.toLowerCase().startsWith(query.toLowerCase())).slice(0, 8)
    : []

  const select = (option: string) => {
    onChange(option)
    setQuery(option)
    setOpen(false)
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={query}
          onChange={(event) => { setQuery(event.target.value); onChange(""); setOpen(true) }}
          onKeyDown={(event) => {
            if (event.key === "Enter") { event.preventDefault(); if (filtered[0]) select(filtered[0]) }
            if (event.key === "Escape") setOpen(false)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          disabled={disabled}
          style={{ ...inputStyle, flex: 1, opacity: disabled ? 0.4 : 1 }}
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(""); setQuery("") }}
            style={{
              padding: "0 14px", borderRadius: 10,
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "rgba(240,238,255,0.5)", fontSize: 18,
              cursor: "pointer", lineHeight: 1,
            }}
          >
            x
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#1e0a3c",
          border: "1px solid rgba(168,85,247,0.3)",
          borderRadius: 10, zIndex: 50, overflow: "hidden",
        }}>
          {filtered.map((option) => (
            <div
              key={option}
              onMouseDown={() => select(option)}
              style={{ padding: "10px 14px", fontSize: 14, color: "#f0eeff", cursor: "pointer" }}
              onMouseEnter={(event) => (event.currentTarget.style.background = "rgba(168,85,247,0.15)")}
              onMouseLeave={(event) => (event.currentTarget.style.background = "transparent")}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function LeadForm() {
  const [form, setForm] = useState<LeadFormData>(EMPTY)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errMsg, setErrMsg] = useState("")

  const phoneDigits = form.phone.replace(/\D/g, "")
  const phoneValid = phoneDigits.length === 10
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)

  const showLicenseFollowUp = form.sales_license === "No" || form.sales_license === "Don't know"
  const showBetaFollowUps = form.beta_interest === "Yes!" || form.beta_interest === "Maybe?"
  const showBrandedQuestion = form.specializations.includes("New") || form.specializations.includes("Certified Pre-owned (From Manufacturer)")
  const showSingleManufacturer = form.branded_dealership === "Yes"
  const showMultipleManufacturers = form.branded_dealership === "Yes Multiple! (Jeep, Chrysler)"
  const showBrandLimit = form.specializations.length > 0
  const showLimitedBrandNames = form.limited_brands === "Yes"
  const showReferralName = form.hear_about_us === "**Referral**"
  const showReferralRows = form.knows_anyone === "Yes" || form.knows_anyone === "Maybe"

  const referralCount = useMemo(
    () => form.referrals.filter((row) => row.fullName || row.dealership || row.contactNumber).length,
    [form.referrals],
  )

  const setField = <K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const setReferralField = (index: number, key: keyof ReferralRow, value: string) => {
    setForm((current) => ({
      ...current,
      referrals: current.referrals.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)),
    }))
  }

  const validate = () => {
    if (!form.first_name || !form.last_name) return "Please enter your full name."
    if (form.has_nickname && !form.nickname.trim()) return "Please enter your nickname."
    if (!phoneValid) return "Please enter a valid 10-digit phone number."
    if (!emailValid) return "Please enter a valid email address."
    if (!form.sales_license) return "Please answer the sales license question."
    if (showLicenseFollowUp && !form.license_process) return "Please tell us whether you are in the process of getting your license."
    if (!form.experience) return "Please choose your experience level."
    if (!form.wants_forum || !form.wants_updates || !form.beta_interest) return "Please finish the program preference questions."
    if (showBetaFollowUps && (!form.nda_comfort || !form.phone_platform)) return "Please complete the beta-testing follow-up questions."
    if (!form.dealership_name.trim()) return "Please enter your dealership name."
    if (!form.address_line_1.trim() || !form.city.trim() || !form.state || !form.postal.trim()) return "Please complete the dealership address."
    if (form.specializations.length === 0) return "Please choose at least one dealership specialization."
    if (showBrandedQuestion && !form.branded_dealership) return "Please answer the manufacturer-branded dealership question."
    if (showSingleManufacturer && !form.manufacturer_primary.trim()) return "Please enter the dealership manufacturer."
    if (showMultipleManufacturers && (!form.manufacturer_primary.trim() || !form.manufacturer_secondary.trim())) return "Please enter at least two manufacturers for the multi-brand dealership."
    if (!form.dealership_size || !form.dealership_sales || !form.personal_sales) return "Please complete the dealership size and sales questions."
    if (showBrandLimit && !form.limited_brands) return "Please answer whether you are limited to certain brands."
    if (showLimitedBrandNames && !form.limited_brand_names.trim()) return "Please list the brands you are limited to."
    if (!form.hear_about_us) return "Please tell us how you heard about Mi-Leads."
    if (showReferralName && (!form.referral_first_name.trim() || !form.referral_last_name.trim())) return "Please enter the referring colleague's name."
    if (!form.certify_accuracy) return "Please certify that the information is accurate."
    return ""
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validate()
    if (validationError) {
      setStatus("error")
      setErrMsg(validationError)
      return
    }

    setStatus("sending")
    setErrMsg("")

    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          submitted_from: "mi-leads-site",
          referral_count: referralCount,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Submission failed")
      }

      setStatus("success")
      setForm(EMPTY)
    } catch (error) {
      setStatus("error")
      setErrMsg(error instanceof Error ? error.message : "Submission failed")
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <label style={labelStyle}>
            First Name *
            <input value={form.first_name} onChange={(event) => setField("first_name", event.target.value)} style={inputStyle} required />
          </label>
          <label style={labelStyle}>
            Last Name *
            <input value={form.last_name} onChange={(event) => setField("last_name", event.target.value)} style={inputStyle} required />
          </label>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 400, color: "rgba(240,238,255,0.7)", letterSpacing: 0, cursor: "pointer" }}>
          <input type="checkbox" checked={form.has_nickname} onChange={(event) => setField("has_nickname", event.target.checked)} style={{ accentColor: "#a855f7", width: 15, height: 15, cursor: "pointer", flexShrink: 0 }} />
          Nickname / alternate name?
        </label>

        {form.has_nickname ? (
          <label style={labelStyle}>
            Nickname *
            <input value={form.nickname} onChange={(event) => setField("nickname", event.target.value)} placeholder="What do others call you?" style={inputStyle} />
          </label>
        ) : null}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <label style={labelStyle}>
            Phone Number *
            <div style={{ position: "relative" }}>
              <input type="tel" value={form.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="(615) 000-0000" style={{ ...inputStyle, paddingRight: 40, border: form.phone ? (phoneValid ? "1px solid rgba(74,222,128,0.5)" : "1px solid rgba(239,68,68,0.5)") : inputStyle.border }} />
              {form.phone ? <span style={{ position: "absolute", top: "50%", right: 14, transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>{phoneValid ? "✓" : "✕"}</span> : null}
            </div>
            <span style={{ fontSize: 12, color: "rgba(240,238,255,0.3)", fontWeight: 400, letterSpacing: 0 }}>Personal phone over desk phone or masked number preferred.</span>
          </label>

          <label style={labelStyle}>
            E-mail *
            <div style={{ position: "relative" }}>
              <input type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} placeholder="ex: email@yahoo.com" style={{ ...inputStyle, paddingRight: 40, border: form.email ? (emailValid ? "1px solid rgba(74,222,128,0.5)" : "1px solid rgba(239,68,68,0.5)") : inputStyle.border }} />
              {form.email ? <span style={{ position: "absolute", top: "50%", right: 14, transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>{emailValid ? "✓" : "✕"}</span> : null}
            </div>
            <span style={{ fontSize: 12, color: "rgba(240,238,255,0.3)", fontWeight: 400, letterSpacing: 0 }}>Personal email over dealership email preferred.</span>
          </label>
        </div>

        <div style={labelStyle}>
          Do You Have a Valid Automotive Sales License in Tennessee? *
          <RadioGroup options={["Yes", "No", "Don't know"]} value={form.sales_license} onChange={(next) => setField("sales_license", next)} />
        </div>

        {showLicenseFollowUp ? <div style={labelStyle}>Are you in the process of getting one? *<RadioGroup options={["Yes! Will have one soon", "Have to check with my dealership", "Not planning on it ????"]} value={form.license_process} onChange={(next) => setField("license_process", next)} /></div> : null}

        <label style={labelStyle}>
          How many years experience do you have? *
          <select value={form.experience} onChange={(event) => setField("experience", event.target.value)} style={selectStyle}>
            <option value="" style={optStyle}>Please Select</option>
            <option value="<1 year" style={optStyle}>&lt;1 year</option>
            <option value="1-2 years" style={optStyle}>1-2 years</option>
            <option value="2-5 years" style={optStyle}>2-5 years</option>
            <option value="5-9 years" style={optStyle}>5-9 years</option>
            <option value="10-15 years" style={optStyle}>10-15 years</option>
            <option value="15+ years" style={optStyle}>15+ years</option>
          </select>
        </label>
      </div>

      <Section title="Pilot Preferences">
        <div style={labelStyle}>Would you be interested in joining a Community Forum or Groupchat for early-adopter leads testing and program roll-outs? *<RadioGroup options={["Yes", "No"]} value={form.wants_forum} onChange={(next) => setField("wants_forum", next)} /></div>
        <div style={labelStyle}>Would you like semi-regular updates about the lead network program through text/email before August? *<RadioGroup options={["That's Fine", "No"]} value={form.wants_updates} onChange={(next) => setField("wants_updates", next)} /></div>
        <div style={labelStyle}>Would you be interested in eventually beta-testing a phone app for leads? *<RadioGroup options={["Yes!", "No", "Maybe?"]} value={form.beta_interest} onChange={(next) => setField("beta_interest", next)} /></div>

        {showBetaFollowUps ? (
          <>
            <div style={labelStyle}>Would you be comfortable signing a Non-Disclosure Agreement (NDA) for beta-testing? *<RadioGroup options={["Yes", "No", "Perhaps"]} value={form.nda_comfort} onChange={(next) => setField("nda_comfort", next)} /></div>
            <div style={labelStyle}>What cell phone platform do you use? *<RadioGroup options={["IOS (iPhone)", "Android", "I have both"]} value={form.phone_platform} onChange={(next) => setField("phone_platform", next)} /></div>
          </>
        ) : null}
      </Section>

      <Section title="Dealership Information">
        <label style={labelStyle}>
          Dealership Name *
          <input value={form.dealership_name} onChange={(event) => setField("dealership_name", event.target.value)} placeholder="As it appears on Google" style={inputStyle} />
        </label>

        <div style={{ display: "grid", gap: 16 }}>
          <label style={labelStyle}>
            Street Address *
            <input value={form.address_line_1} onChange={(event) => setField("address_line_1", event.target.value)} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            Street Address 2
            <input value={form.address_line_2} onChange={(event) => setField("address_line_2", event.target.value)} style={inputStyle} />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <label style={labelStyle}>
              City *
              <input value={form.city} onChange={(event) => setField("city", event.target.value)} style={inputStyle} />
            </label>

            <label style={labelStyle}>
              State *
              <select value={form.state} onChange={(event) => setField("state", event.target.value)} style={selectStyle}>
                {STATES.map((state) => (
                  <option key={state} value={state} style={optStyle}>{state}</option>
                ))}
              </select>
            </label>

            <label style={labelStyle}>
              Zip Code *
              <input value={form.postal} onChange={(event) => setField("postal", event.target.value)} style={inputStyle} />
            </label>
          </div>
        </div>

        <div style={labelStyle}>
          Dealership Specialization(s)? New / Used / Certified *
          <CheckGroup
            options={["New", "Used", "Certified Pre-owned (From Manufacturer)"]}
            value={form.specializations}
            onChange={(next) => setField("specializations", next)}
            columns={1}
          />
        </div>

        {showBrandedQuestion ? (
          <div style={labelStyle}>
            Is this a manufacturer-branded dealership? *
            <RadioGroup options={["Yes", "No", "Yes Multiple! (Jeep, Chrysler)"]} value={form.branded_dealership} onChange={(next) => setField("branded_dealership", next)} />
          </div>
        ) : null}

        {showSingleManufacturer ? (
          <label style={labelStyle}>
            Which Manufacturer? *
            <SingleAutocomplete
              options={ALL_MAKES}
              value={form.manufacturer_primary}
              onChange={(value) => setField("manufacturer_primary", value)}
              placeholder="Type a manufacturer..."
            />
          </label>
        ) : null}

        {showMultipleManufacturers ? (
          <div style={{ display: "grid", gap: 16 }}>
            <label style={labelStyle}>
              Manufacturer 1 *
              <SingleAutocomplete
                options={ALL_MAKES}
                value={form.manufacturer_primary}
                onChange={(value) => setField("manufacturer_primary", value)}
                placeholder="Type a manufacturer..."
              />
            </label>
            <label style={labelStyle}>
              Manufacturer 2 *
              <SingleAutocomplete
                options={ALL_MAKES}
                value={form.manufacturer_secondary}
                onChange={(value) => setField("manufacturer_secondary", value)}
                placeholder="Type a manufacturer..."
              />
            </label>
            <label style={labelStyle}>
              Manufacturer 3
              <SingleAutocomplete
                options={ALL_MAKES}
                value={form.manufacturer_extra_1}
                onChange={(value) => setField("manufacturer_extra_1", value)}
                placeholder="Optional"
              />
            </label>
            <label style={labelStyle}>
              Manufacturer 4
              <SingleAutocomplete
                options={ALL_MAKES}
                value={form.manufacturer_extra_2}
                onChange={(value) => setField("manufacturer_extra_2", value)}
                placeholder="Optional"
              />
            </label>
            <label style={labelStyle}>
              Manufacturer 5
              <SingleAutocomplete
                options={ALL_MAKES}
                value={form.manufacturer_extra_3}
                onChange={(value) => setField("manufacturer_extra_3", value)}
                placeholder="Optional"
              />
            </label>
            <label style={labelStyle}>
              Manufacturer 6
              <SingleAutocomplete
                options={ALL_MAKES}
                value={form.manufacturer_extra_4}
                onChange={(value) => setField("manufacturer_extra_4", value)}
                placeholder="Optional"
              />
            </label>
          </div>
        ) : null}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <label style={labelStyle}>
            Size: How many sales reps typically work at your dealership total? *
            <select value={form.dealership_size} onChange={(event) => setField("dealership_size", event.target.value)} style={selectStyle}>
              <option value="">Please Select</option>
              {["~1-5 Reps/Consultants", "~5-10", "~10-15", "~15-20", "~20-30", "~30-40", "~40-50", "~50+", "No idea"].map((option) => (
                <option key={option} value={option} style={optStyle}>{option}</option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Sales: How many vehicles does your dealership typically sell a month? *
            <select value={form.dealership_sales} onChange={(event) => setField("dealership_sales", event.target.value)} style={selectStyle}>
              <option value="">Please Select</option>
              {["~20-50", "~50-100", "~100-150", "~150-200", "~200-300", "~300-400", "~400+", "No idea"].map((option) => (
                <option key={option} value={option} style={optStyle}>{option}</option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            How many vehicles do you typically sell a month? *
            <select value={form.personal_sales} onChange={(event) => setField("personal_sales", event.target.value)} style={selectStyle}>
              <option value="">Please Select</option>
              {["~5-10", "~10-15", "~15-20", "~20-25", "~25-35", "~35-50", "~50-70", "~70+", "Prefer not to say", "Just starting out so not sure"].map((option) => (
                <option key={option} value={option} style={optStyle}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={labelStyle}>
          Do you personally sell new / used / certified at this dealership?
          <CheckGroup
            options={["New", "Used", "Certified Pre-owed"]}
            value={form.personal_specializations}
            onChange={(next) => setField("personal_specializations", next)}
            columns={1}
          />
        </div>

        {showBrandLimit ? (
          <div style={labelStyle}>
            Are you personally limited to only selling one or some brands at your dealership? *
            <RadioGroup options={["Nope!", "Yes"]} value={form.limited_brands} onChange={(next) => setField("limited_brands", next)} />
          </div>
        ) : null}

        {showLimitedBrandNames ? (
          <label style={labelStyle}>
            Which Brand(s) is that? *
            <input value={form.limited_brand_names} onChange={(event) => setField("limited_brand_names", event.target.value)} placeholder="e.g., Only work in the GMC side" style={inputStyle} />
            <span style={{ fontSize: 12, color: "rgba(240,238,255,0.3)", fontWeight: 400, letterSpacing: 0 }}>List the brands you are limited to.</span>
          </label>
        ) : null}
      </Section>

      <Section title="Knowledge Source">
        <label style={labelStyle}>
          How did you hear about us? *
          <select value={form.hear_about_us} onChange={(event) => setField("hear_about_us", event.target.value)} style={selectStyle}>
            <option value="" style={optStyle}>Please Select</option>
            {[
              "Outreach Seth Milo",
              "Outreach Carlos Velasquez",
              "Outreach Devonte Reynolds",
              "Outreach Alexander Nguyen",
              "**Referral**",
              "Facebook",
              "Instagram",
              "Tik-Tok",
              "YouTube",
              "Lead Workshop",
              "Social Media Ad Campaign",
              "Flyer",
            ].map((option) => (
              <option key={option} value={option} style={optStyle}>{option}</option>
            ))}
          </select>
        </label>

        {showReferralName ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <label style={labelStyle}>
              Referring Colleague First Name *
              <input value={form.referral_first_name} onChange={(event) => setField("referral_first_name", event.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Referring Colleague Last Name *
              <input value={form.referral_last_name} onChange={(event) => setField("referral_last_name", event.target.value)} style={inputStyle} />
            </label>
          </div>
        ) : null}

        <div style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(168,85,247,0.1)", background: "transparent", color: "rgba(240,238,255,0.32)", fontSize: 12, lineHeight: 1.7 }}>
          Referrals are encouraged. Valid referrals can count toward future perks, but they need a real first and last name and will be verified.
        </div>

        <div style={labelStyle}>
          Know anyone who may be interested in this pilot program that we have not contacted yet?
          <RadioGroup options={["Yes", "No", "Maybe"]} value={form.knows_anyone} onChange={(next) => setField("knows_anyone", next)} />
        </div>

        {showReferralRows ? (
          <div style={{ display: "grid", gap: 14 }}>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: "rgba(240,238,255,0.28)" }}>
              Add any referrals you want us to follow up with. Leaving rows blank is fine.
            </p>

            {form.referrals.map((row, index) => (
              <div key={index} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, padding: "14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(168,85,247,0.08)" }}>
                <label style={labelStyle}>
                  Full Name
                  <input value={row.fullName} onChange={(event) => setReferralField(index, "fullName", event.target.value)} style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Dealership
                  <input value={row.dealership} onChange={(event) => setReferralField(index, "dealership", event.target.value)} style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Contact Number
                  <input value={row.contactNumber} onChange={(event) => setReferralField(index, "contactNumber", event.target.value)} style={inputStyle} />
                </label>
              </div>
            ))}
          </div>
        ) : null}
      </Section>

      <Section title="Finishing Up">
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, fontWeight: 400, color: "rgba(240,238,255,0.7)", letterSpacing: 0, cursor: "pointer" }}>
          <input type="checkbox" checked={form.certify_accuracy} onChange={(event) => setField("certify_accuracy", event.target.checked)} style={{ accentColor: "#a855f7", width: 15, height: 15, cursor: "pointer", flexShrink: 0, marginTop: 2 }} />
          <span style={{ lineHeight: 1.6 }}>I certify that the information in this request form is accurate to the best of my knowledge.</span>
        </label>

        <div style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(168,85,247,0.1)", background: "transparent", color: "rgba(240,238,255,0.32)", fontSize: 12, lineHeight: 1.7 }}>
          Once submitted, the applicant should be contacted by text or email within 24 hours. Limited to one request per person.
        </div>

        <label style={labelStyle}>
          Questions, Comments, Suggestions for us here!!
          <textarea value={form.comments} onChange={(event) => setField("comments", event.target.value)} style={textareaStyle} />
        </label>

        {status === "error" ? <p style={{ margin: 0, fontSize: 13, color: "rgba(239,68,68,0.8)" }}>{errMsg}</p> : null}
        {status === "success" ? <p style={{ margin: 0, fontSize: 13, color: "rgba(74,222,128,0.8)" }}>Submitted. For local preview, this may be a mock success if no webhook is attached yet.</p> : null}

        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            padding: "16px 22px",
            borderRadius: 999,
            border: "none",
            cursor: status === "sending" ? "not-allowed" : "pointer",
            background: status === "sending" ? "rgba(123,47,190,0.4)" : "linear-gradient(135deg, var(--purple) 0%, var(--purple-mid) 100%)",
            boxShadow: status === "sending" ? "none" : "0 0 32px var(--purple-glow)",
            color: "#fff",
            fontWeight: 900,
            fontSize: 16,
          }}
        >
          {status === "sending" ? "Submitting..." : "Submit Mi-Leads Request"}
        </button>
      </Section>
    </form>
  )
}
