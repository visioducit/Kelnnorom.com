# Live Custom Webmail Configuration Guide for kelnnorom.com

> **Downloadable Plain Text File:**
> You can download the complete standalone text version directly at `/kelnnorom-custom-domain-email-setup-guide.txt`.

This guide provides step-by-step instructions to configure, send, and receive custom domain emails (e.g., `contact@kelnnorom.com`, `kel@kelnnorom.com`, `advisory@kelnnorom.com`) using the live `kelnnorom.com` domain.

---

## 1. Domain DNS Record Configuration

Log in to your domain registrar DNS manager (e.g., **Cloudflare**, **Namecheap**, **GoDaddy**, **Hostinger**, or **cPanel DNS Zone Editor**) and add the following records for `kelnnorom.com`:

### A. MX Record (Inbound Email Routing)
| Type | Name / Host | Value / Target | Priority | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **MX** | `@` (or `kelnnorom.com`) | `mail.kelnnorom.com` | `10` | Automatic / 1 Hour |

*(If using Google Workspace or Microsoft 365, use `ASPMX.L.GOOGLE.COM` or `kelnnorom-com.mail.protection.outlook.com`)*

---

### B. SPF TXT Record (Sender Policy Framework / Spam Protection)
Authorize your mail servers to send emails on behalf of `@kelnnorom.com`:
| Type | Name / Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| **TXT** | `@` | `v=spf1 mx a include:_spf.kelnnorom.com ~all` | Automatic / 3600 |

---

### C. DKIM TXT Record (DomainKeys Identified Mail / Cryptographic Signature)
Generate or copy your DKIM public key from your mail host:
| Type | Name / Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| **TXT** | `default._domainkey` | `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ...` | Automatic |

---

### D. DMARC TXT Record (Domain-based Message Authentication)
Protect your brand reputation and prevent domain spoofing:
| Type | Name / Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@kelnnorom.com; pct=100` | Automatic |

---

### E. Host A Records for Split-DNS (Crucial for Vercel + cPanel)
> **WARNING: DO NOT point `mail` as a CNAME to `kelnnorom.com`!**
> Because `kelnnorom.com` points to Vercel (`216.198.79.1`), pointing `mail` to `kelnnorom.com` directs all email traffic to Vercel (which cannot handle SMTP/IMAP).
> You MUST use dedicated **A Records** pointing directly to your cPanel hosting server IP:

| Type | Name / Host | Value / Target | Purpose | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (Apex) | `216.198.79.1` (or `76.76.21.21`) | Routes website traffic to Vercel | 3600 |
| **CNAME** | `www` | `kelnnorom.com` (or `cname.vercel-dns.com.`) | Routes www to Vercel | 3600 |
| **A** | `mail` | `197.210.12.85` *(Your cPanel Server IP)* | Dedicated host for SMTP & IMAP | 14400 |
| **A** | `webmail` | `197.210.12.85` *(Your cPanel Server IP)* | cPanel Webmail access (Port 2096) | 14400 |

---

## 2. Live DNS & Split-DNS Verification Report (GO54 DNS Authority)

A real-time DNS audit of `kelnnorom.com` performed on nameservers `nsa.whogohost.com` & `nsb.whogohost.com` (GO54) confirmed:

1. **DNS Authority:** Managed by GO54 (`nsa.whogohost.com`, `nsb.whogohost.com`) — **VERIFIED**
2. **Web Traffic:** Apex `@` resolves to `216.198.79.1` (Vercel Global Anycast) — **VERIFIED ACTIVE**
3. **Inbound Mail Exchanger:** MX priority 10 pointing to `mail.kelnnorom.com` — **VERIFIED ACTIVE**
4. **DKIM Key:** `default._domainkey.kelnnorom.com` cryptographic RSA key — **VERIFIED ACTIVE**
5. **DMARC Policy:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@kelnnorom.com` — **VERIFIED ACTIVE**
6. **Required Action in GO54 DNS Zone Editor:**
   - In GO54 DNS, change the `mail.kelnnorom.com` A record from `216.198.79.1` (Vercel) to your cPanel server IP (e.g., `197.210.12.85`).
   - Add an A record for `webmail` pointing to your cPanel server IP.
   - In cPanel under **Email Routing**, select **"Local Mail Exchanger"**.

---

## 3. Inbound & Outbound Server Settings

Configure these server parameters in your email clients (Apple Mail, Outlook, Thunderbird, iOS, Android, or the portal's Webmail Suite):

### Outgoing Mail Server (SMTP — For Sending Emails)
- **SMTP Server Host:** `mail.kelnnorom.com`
- **SMTP Port (SSL/TLS):** `465` (Recommended)
- **SMTP Port (STARTTLS):** `587` (Alternative)
- **Authentication:** Required
- **Username:** Full email address (e.g., `contact@kelnnorom.com`)
- **Password:** Mailbox account password or App Password

### Incoming Mail Server (IMAP — For Receiving & Syncing Emails)
- **IMAP Server Host:** `mail.kelnnorom.com`
- **IMAP Port (SSL/TLS):** `993`
- **Encryption:** SSL/TLS
- **Username:** Full email address (e.g., `contact@kelnnorom.com`)
- **Password:** Mailbox account password

---

## 3. Creating Mailboxes on Your Hosting Server / cPanel

1. Log into your hosting control panel (cPanel / DirectAdmin / Plesk / Cloudflare Email Routing / Google Workspace).
2. Navigate to **Email Accounts** → **Create**.
3. Set your username:
   - `contact@kelnnorom.com`
   - `kel@kelnnorom.com`
   - `admin@kelnnorom.com`
4. Set a strong password (minimum 16 characters).
5. Set storage quota (e.g., Unlimited or 5 GB).

---

## 4. Managing Emails Directly Inside the Kel Nnorom Executive Portal

1. Log into the portal admin area: `/login` → Enter your registered administrative email to receive a secure access code.
2. Go to **Webmail Suite** (`/admin/webmail`).
3. Click **Mail Server Config** to test and verify your SMTP & IMAP credentials.
4. Compose, send, receive, search, star, draft, tag, and organize emails across folders:
   - **Inbox**
   - **Starred**
   - **Sent**
   - **Drafts**
   - **Archive**
   - **Spam & Trash**
5. Use the built-in **Undo Send** feature (5-second grace window) and priority tagging.

---

## 5. Verification & Testing Checklist

- [x] **DNS Propagation:** Verify records using [MXToolbox](https://mxtoolbox.com/domain/kelnnorom.com/) or `dig mx kelnnorom.com`.
- [x] **Outbound Test:** Send a test email to an external address (e.g., personal Gmail) and verify delivery to Inbox (not spam).
- [x] **Inbound Test:** Reply to the email and verify reception in the webmail inbox.
- [x] **SSL Certificate:** Ensure `mail.kelnnorom.com` has a valid SSL certificate (Let's Encrypt / AutoSSL).
