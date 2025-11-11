Terms of Service & Data Governance

1. Service Scope and Architecture

This Terms of Service agreement governs your use of the SISMMS by NAS application, operated by Nearaj's AI Services (NAS). This service is provided solely for educational, administrative, and data governance functions as authorized by the school administration.

Platform Disclosure (Headless GNA Protocol)

This application operates on a secure, multi-platform technology stack. NAS acts as the Data Controller and manages the security of all third-party vendors listed below.

Vendor / Platform

Role

GNA Protocol Status

Supabase

Primary Database and Authentication Backend (DB-as-Truth).

Fully Controlled and Secured.

Vercel

Front-End Hosting and Deployment (Git-as-Truth).

Fully Controlled and deployed from GitHub.

Make

External Logic and Automation (e.g., scheduled notifications).

Future Use.

Bubble

External Logic and Specialized Dashboards.

Future Use.

2. Data Retention and Disposition (Wisconsin Legal Mandate)

NAS strictly adheres to the data retention mandates of the State of Wisconsin for public educational records.

Minimum Retention Period (Wis. Stat. § 16.61): We are legally required to retain all public educational records for a period of not less than seven (7) years from the date of creation, as mandated by State Public Records Law.

Data Destruction Protocol: When data is required to be permanently destroyed (e.g., after the 7-year minimum period):

NAS and the school district must adhere to the 60-day written notification process to the Wisconsin State Historical Society before the final destruction of public records.

3. Data Ownership and Security

Data Ownership: All student data and educational records entered into the SISMMS by NAS platform are and shall remain the property of the student and the school district.

Security Standard (RLS): All access to data is secured by Row-Level Security (RLS) policies applied directly to the Supabase database. Access is strictly controlled based on the user's verified role (Admin, Teacher, Guardian).

Prohibited Actions: Users are strictly forbidden from attempting to bypass RLS, perform unauthorized data scraping, or share login credentials. Any such attempt is considered a material breach of these terms.

4. Governing Law

These Terms are governed by the laws of the State of Wisconsin, U.S.A.