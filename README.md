# admission-tokensystem
# Token-Based Admission Scheduling System

A high-concurrency, resilient admission scheduling platform designed for colleges to automate student time-slot allocations via interactive emails and SMS. Built to handle short admission windows (1–2 days) without race conditions, downtime, or security leaks.

---

## Key Features

* **One-Click Slot Confirmation:** Interactive, tokenized emails sent to students to select their preferred time slot on mobile/desktop.
* **Concurrency Protection:** Row-level database locking (`SELECT FOR UPDATE`) to prevent double-booking time slots during peak traffic.
* **Background Messaging Queue:** Asynchronous job processing via Redis to send high volumes of emails/SMS without blocking the web server.
* **Automatic Default Allocation:** Scheduled Cron/Celery jobs to automatically assign remaining late-day slots to unconfirmed students before deadlines.
* **Rural Student Support:** Fallback SMS integration and an internal walk-in desk view for physical token issuance.
* **KEA Data Privacy:** Secure cryptographic tokenization ensures master student lists and registration data are never publicly exposed.

---

## Tech Stack

* **Backend API:** Node.js (Express)
* **Database:** PostgreSQL (with ACID transactions & connection pooling)
* **Task Queue / Cache:** Redis + BullMQ
* **Data Processing & Cron Engine:** Python (Pandas, SQLAlchemy, APScheduler)
* **Admin Dashboard:** Python (Streamlit / Reflex)
* **Email / SMS Infrastructure:** Amazon SES / Resend / Fast2SMS

---

## Repository Structure

```text
.
├── backend/                # Node.js Express API & BullMQ Queue Workers
│   ├── src/
│   │   ├── controllers/    # Atomic transaction handlers
│   │   ├── routes/         # REST API endpoints
│   │   └── queues/         # Redis BullMQ worker configurations
│   └── package.json
├── data_engine/            # Python scripts for CSV parsing & Cron tasks
│   ├── scripts/            # KEA CSV parser & sanitizer
│   └── cron/               # Default slot allocation engine
├── admin_panel/            # Python admin dashboard for staff/professors
└── docker-compose.yml      # Local dev environment setup (PostgreSQL + Redis)