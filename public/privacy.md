# Privacy Policy (FERPA & COPPA Compliance)

This policy governs the SISMMS by NAS application, operated by Nearaj's AI Services (NAS).

## 1. Our Role and Authorization (FERPA Mandate)

NAS operates as a **"School Official"** with a legitimate educational interest. This status is granted by the school administration, which authorizes us to manage student educational records.

## 2. PII Collected and Purpose

We adhere to the principle of data minimization and only collect the following Personally Identifiable Information (PII) necessary for educational functions:

* **Personal Data:** Student Name, Date of Birth, Class, Guardian Name, Email, and Phone Number.
* **Educational Records:** Attendance data (Daily Logs), Grades (Assignments), and Financial Transactions.

We **do not collect** social security numbers or sensitive Protected Health Information (PHI).

## 3. Data Sharing and Security

We **DO NOT SELL PII**. We only share PII with third-party vendors required to operate the service (e.g., cloud database, email service). These vendors operate under a strict **"direct control"** agreement.

* **Platform Disclosure:** Your data is stored securely in the **Supabase** database (our primary vendor) and delivered via **Vercel** (our hosting vendor).
* **Security:** All data is protected by **Role-Based Access Control (RLS)**, ensuring only authorized users (Admin, Teacher, Guardian) can view specific records.

## 4. Parental Rights (FERPA Mandate)

Parents and eligible students have the right to:

* **Inspect and Review** the student's records.
* **Request Amendment** of records they believe are inaccurate.
* **Opt-out** of the disclosure of "directory information."

---

## 2. 📝 Terms of Service (TOS) & Data Governance

This TOS details the architectural platform and the mandatory **Data Retention Policy** required by state law.

* **Action:** Manually create a file named **`terms.md`** inside your local **`public/`** folder and paste the content below.

```markdown
# Terms of Service & Data Governance

## 1. Service Scope and Architecture

This service, SISMMS by NAS, is provided solely for educational and administrative functions as authorized by the school.

* **Full Stack Disclosure:** This application operates on a secure platform stack consisting of **Vercel** (Front-End/Deployment) and **Supabase** (Database/Back-End). External logic tools like **Make** and **Bubble** are used for specialized automation functions.
* **Security:** Access is governed by **Row-Level Security (RLS)**. Any attempt to bypass this security is a material breach of these terms.

## 2. Data Retention and Disposition (Wisconsin State Law)

We adhere strictly to data retention and disposition laws.

* **Minimum Retention Period:** We are legally required to retain public records for **not less than seven (7) years** from the date of creation, as mandated by State Public Records Law.
* **Data Disposition Process:** When data is marked for permanent deletion (e.g., after the 7-year minimum period), the school district must adhere to State regulations.
    * The system will automatically flag data and require a **60-day notification period** to the Wisconsin Historical Society before final destruction.

## 3. Account Termination

NAS reserves the right to suspend or terminate any user account that violates RLS policies, attempts unauthorized data access, or violates the spirit of these terms.