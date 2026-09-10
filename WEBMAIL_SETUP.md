# Executive Webmail Suite: Live Setup & Configuration Guide for kelnnorom.com

> **Downloadable Plain Text File:**
> You can download the complete standalone text version directly at `/kelnnorom-custom-domain-email-setup-guide.txt`.

This guide provides the complete setup walkthrough for custom domain emails (e.g., `contact@kelnnorom.com`, `kel@kelnnorom.com`, `advisory@kelnnorom.com`) on the live domain `kelnnorom.com`.

---

## Architecture Summary

| Component | Provider / Host | Target / Destination |
| :--- | :--- | :--- |
| **Domain Registrar & DNS** | GO54 (`go54.com`) | Authoritative nameservers: `nsa.whogohost.com`, `nsb.whogohost.com` |
| **Web Hosting (Live 200 OK)** | Vercel Global Edge | `@` -> `216.198.79.1` (A) and `www` -> `kelnnorom.com` (CNAME) |
| **Option 1: Cloud Mail (Recommended)** | **Zoho Mail (Free Tier)** | 5 Free Inboxes (5 GB each), cloud-managed MX (`mx.zoho.com`) |
| **Option 2: Self-Hosted Mail** | **cPanel / Webmail** | Hosted on GO54 cPanel Shared IP (`mail.kelnnorom.com`) |
| **Executive Management Portal** | Kel Nnorom Suite | Live at `https://kelnnorom.com/admin/webmail` |

---

## OPTION 1: ZOHO MAIL "FOREVER FREE PLAN" (RECOMMENDED)

Zoho Mail offers a 100% free plan for up to **5 business email accounts** (5 GB storage per user) with your custom domain `@kelnnorom.com`. 

### Why Zoho Mail is Recommended:
1. **Zero Server Maintenance:** No cPanel IP changes or port 465 timeouts.
2. **Top Deliverability:** Outbound mail is signed by Zoho's enterprise cloud infrastructure (straight to Gmail/Outlook inbox).
3. **Mobile & Web Apps:** Access via official Zoho Mail iOS/Android apps or directly via `mail.zoho.com` and your Executive Webmail Suite.

---

### Step 1: Sign Up for Zoho Mail Free Tier
1. Visit the [Zoho Mail Pricing Page](https://www.zoho.com/mail/zohomail-pricing.html).
2. Scroll to the very bottom of the page to find the **"Forever Free Plan"** (up to 5 users, 5GB/user, web access).
3. Click **Sign Up**.
4. Enter your custom domain: `kelnnorom.com` and complete the registration.

---

### Step 2: Verify Domain Ownership in GO54
1. In the Zoho Mail setup wizard, select **TXT Method** (or CNAME) to verify your domain.
2. Zoho will display a unique verification string (typically starting with `zoho-verification-code=zb...` or host `zb...`).
3. Log in to your **GO54 Account** (`go54.com`) &rarr; **Domains** &rarr; **Manage DNS** for `kelnnorom.com`.
4. Click **Add Record**:
   - **Type:** `TXT`
   - **Name / Host:** `@`
   - **Value:** *[Paste the verification code from Zoho]*
   - **TTL:** `3600`
5. Return to Zoho and click **Verify TXT Record**.

---

### Step 3: Add the 3 Zoho MX Records in GO54 (Crucial)
In your GO54 DNS Management Console, **delete** any existing MX records pointing to `mail.kelnnorom.com` or Vercel, and add the three Zoho MX records:

| Record Type | Host / Name | Destination / Target | Priority | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **MX** | `@` | `mx.zoho.com` | **10** | 3600 |
| **MX** | `@` | `mx2.zoho.com` | **20** | 3600 |
| **MX** | `@` | `mx3.zoho.com` | **50** | 3600 |

---

### Step 4: Add Zoho SPF, DKIM & DMARC in GO54
To ensure 100% inbox delivery and pass strict spam filters:

#### A. SPF Record (Sender Policy Framework)
In GO54 DNS, add or update the TXT record for `@`:
- **Type:** `TXT`
- **Host:** `@`
- **Value:** `v=spf1 include:zoho.com ~all`
- **TTL:** `3600`

#### B. DKIM Record (DomainKeys Identified Mail)
1. In the Zoho Mail Admin Console, navigate to **Email Authentication** &rarr; **DKIM**.
2. Click **Add Selector**. Enter selector name: `zoho`.
3. Zoho will generate a unique 2048-bit RSA public key.
4. In GO54 DNS, add a new TXT record:
   - **Type:** `TXT`
   - **Host / Name:** `zoho._domainkey`
   - **Value:** *[Paste the long public key string from Zoho]*
   - **TTL:** `3600`
5. In Zoho Admin Console, click **Verify / Activate**.

#### C. DMARC Record (Anti-Phishing Protection)
- **Type:** `TXT`
- **Host / Name:** `_dmarc`
- **Value:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@kelnnorom.com; pct=100; aspf=r;`
- **TTL:** `3600`

#### D. Custom Webmail URL (Optional)
- **Type:** `CNAME`
- **Host / Name:** `webmail`
- **Value:** `business.zoho.com`
- **TTL:** `3600`
*(Allows your team to log in directly at `https://webmail.kelnnorom.com`)*

---

### Step 5: Link Zoho Mail to the Executive Webmail Suite
1. Log in to the Kel Nnorom Portal (`https://kelnnorom.com/admin/webmail`).
2. Click **Mail Server & DNS** in the header.
3. Under the **Server & Protocols** tab, click the 1-Click preset button **"Zoho Mail (Free Tier)"**.
4. The system automatically populates:
   - **SMTP Host:** `smtppro.zoho.com`
   - **SMTP Port:** `465` (SSL)
   - **IMAP Host:** `imappro.zoho.com`
   - **IMAP Port:** `993` (SSL)
5. Enter your Zoho mailbox credentials:
   - **Username:** `kel@kelnnorom.com` (or `contact@kelnnorom.com`)
   - **Password:** Your Zoho Account Password (or generate an **App Specific Password** from *Zoho Accounts &rarr; Security &rarr; App Passwords* if 2FA is enabled).
6. Click **Save Configuration & Apply Presets**.
7. Click **Run Socket Test** under the **Diagnostics** tab to verify TLS handshake!

---

## OPTION 2: CPANEL MAIL HOSTING (GO54 SHARED IP)

If you prefer to host email accounts on your existing GO54 cPanel hosting package:

### 1. GO54 Split-DNS Configuration
Ensure your DNS records in GO54 match this topology:

| Type | Name / Host | Target / Value | Purpose | Status |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `216.198.79.1` | Vercel Web App | **Active & Verified (200 OK)** |
| **CNAME** | `www` | `kelnnorom.com` | Routes www to Vercel | **Active & Verified** |
| **MX** | `@` | `mail.kelnnorom.com` (Priority 10) | Inbound cPanel mail routing | Active |
| **A** | `mail` | *[Your cPanel Shared IP]* | Dedicated cPanel mail host | **Update in GO54 from Vercel IP to cPanel IP** |
| **A** | `webmail` | *[Your cPanel Shared IP]* | cPanel Webmail access (Port 2096) | **Update in GO54 from Vercel IP to cPanel IP** |
| **TXT** | `@` | `v=spf1 +a +mx +ip4:[cPanel IP] include:go54.com ~all` | SPF Email Authentication | Update in GO54 |
| **TXT** | `default._domainkey` | *[DKIM key from cPanel Email Deliverability]* | DKIM Cryptographic Key | Active |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@kelnnorom.com;` | DMARC Anti-Spoofing | Active |

### 2. Crucial cPanel Setting: Local Mail Exchanger
1. Log into your hosting cPanel dashboard.
2. Navigate to **Email &rarr; Email Routing**.
3. Select domain: `kelnnorom.com`.
4. Select **"Local Mail Exchanger"** (Do not use "Automatically Detect").
5. Click **Change**.

### 3. Server Connection Parameters
- **Outbound SMTP:** `mail.kelnnorom.com` (Port `465` SSL or `587` STARTTLS)
- **Inbound IMAP:** `mail.kelnnorom.com` (Port `993` SSL)

---

---

## Inbound & Outbound Protocols Reference

### Zoho Mail Protocols
- **Outbound SMTP:** `smtppro.zoho.com` | Port `465` (SSL) or Port `587` (TLS)
- **Inbound IMAP:** `imappro.zoho.com` | Port `993` (SSL)
- **Webmail Interface:** `https://mail.zoho.com` or `https://webmail.kelnnorom.com`
- **Authentication:** Zoho email & password / App-specific password

### cPanel Mail Protocols
- **Outbound SMTP:** `mail.kelnnorom.com` | Port `465` (SSL) or Port `587` (TLS)
- **Inbound IMAP:** `mail.kelnnorom.com` | Port `993` (SSL)
- **Webmail Interface:** `https://webmail.kelnnorom.com:2096`
- **Authentication:** cPanel mailbox email & password

---

## Verification & Deliverability Checklist

- [ ] **DNS Lookup:** Confirm MX records on [MXToolbox](https://mxtoolbox.com/domain/kelnnorom.com/).
- [ ] **SPF Test:** Verify `dig txt kelnnorom.com` returns the correct SPF record.
- [ ] **DKIM Alignment:** Ensure DKIM key validates with 2048-bit RSA signature.
- [ ] **Outbound Probe:** Send a test email from the Executive Webmail Suite (`/admin/webmail`) to an external inbox (e.g. Gmail) to verify delivery.
- [ ] **Inbound Reply:** Reply to the email and verify reception in the Webmail Suite.

---

## Managing Emails in the Kel Nnorom Executive Portal

1. Log into the portal admin area: `/admin/webmail`.
2. Click **Mail Server & DNS** to test and verify your SMTP & IMAP credentials.
3. Compose, send, receive, search, star, draft, tag, and organize emails across folders:
   - **Inbox**
   - **Starred**
   - **Sent**
   - **Drafts**
   - **Archive**
   - **Spam & Trash**
4. Use the built-in **Undo Send** feature (5-second grace window) and priority tagging.
