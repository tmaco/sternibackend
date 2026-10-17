# NBA Fantasy Backend 🏀

A robust Node.js backend application designed to power an NBA Fantasy platform. This project acts as a data orchestration engine that ingests, processes, and serves consolidated NBA player statistics and injury statuses by integrating with the MySportsFeeds API through a daily batch workflow.

---

## 🚀 Key Features

* **Automated Data Ingestion:** Consumes structured sports data from MySportsFeeds API endpoints.
* **Post-Game Batch Processor:** Downloads and processes comprehensive box scores and advanced performance metrics daily, once data is fully consolidated by the official provider.
* **Roster Status Synchronization:** Updates player availability and injury reports to keep fantasy lineups accurate for the upcoming matchdays.
* **Secure Architecture:** Built using clean environment variable management (`dotenv`) to safely handle cloud database clusters and API credentials.
* **Cloud Ready:** Structured to support dual storage systems, utilizing local assets alongside AWS S3 buckets for media and avatar storage.

---

## 🛠️ Tech Stack

* **Runtime Environment:** Node.js
* **Database:** MongoDB Atlas (Cloud Hosted)
* **External APIs:** MySportsFeeds API
* **Cloud Services:** AWS S3 (Amazon Simple Storage Service)
* **Environment Management:** Dotenv
* **Package Manager:** Yarn

---

## ⚙️ Configuration & Environment Variables

The project uses a strict configuration pattern to isolate environment variables from production logic, making it highly secure and scalable. 

To run this project, create a `.env` file in the root directory and populate it with your credentials:

```env
# Server Configuration
PORT=3000
API_VERSION=v1
SECRET_KEY=your_jwt_secret_key_here

# MongoDB Atlas Cloud Configuration
USER_DB=your_atlas_user
PASS_DD=your_atlas_password
HOST_DB=your_atlas_cluster_host.mongodb.net
DB_NAME=NBA

# Local & Cloud Storage Settings
UPLOADPATH=./uploads/avatar/
S3_BUCKET=your_s3_bucket_name

# Third-Party Integrations (MySportsFeeds & AWS)
API_KEY=your_mysportsfeeds_api_key
PASSWORD=your_mysportsfeeds_password
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-2
```

---

## 📈 Architecture & Data Flow (Interview Highlights)

### 1. Authentication & Security
The system initializes securely by loading runtime secrets into `process.env`. The authentication flow for the sports data provider abstracts credentials away from the core codebase:
```javascript
const { API_KEY, PASSWORD } = require('./config');
msf.authenticate(API_KEY, PASSWORD);
```

### 2. Post-Game Data Pipeline (Batch Flow)
* **Fetch:** Triggers scheduled requests to MySportsFeeds the day after the games to retrieve final, validated statistics.
* **Transform:** Parsed data is normalized into clean JSON schemas, filtering out unnecessary payloads and structuring metrics for quick analytical queries.
* **Load:** Historical statistics and updated player availability are stored atomically inside the remote MongoDB Atlas cluster.

---

## 🚦 Getting Started

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Set up your environment:**
   Create a `.env` file in the root directory and configure the variables as shown above.

3. **Run the application:**
   * For development (with hot-reload via `nodemon`):
     ```bash
     yarn dev
     ```
   * For production:
     ```bash
     yarn start
     ```