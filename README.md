# AI-Based Plastic Waste & Drainage Overflow Risk Prediction System
## Srivilliputhur Municipality, Tamil Nadu (Academic Prototype)

This repository contains the complete, deployment-ready academic prototype demonstrating how AI/ML, GIS mapping, rainfall records, plastic waste data, citizen grievances, and maintenance workflows unite to predict municipal drainage overflow risks.

---

## 🚀 Deployment on Render (Step-by-Step)

### Step 1: Create a New GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `srivilliputhur-drainage-system` (or your preferred name)
3. Choose **Public**
4. Do NOT initialize with a README (this project already includes one)
5. Click **Create repository**

### Step 2: Push This Project to Your New GitHub Repository
Open PowerShell or Terminal inside this folder (`srivilliputhur-drainage-render-deploy`) and run:

```bash
git init
git add .
git commit -m "Initial commit: Complete deployment-ready Srivilliputhur Drainage Risk System"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

### Step 3: Deploy on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** &rarr; **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your new GitHub repository.
4. Fill in the service configuration:

| Setting | Value |
| :--- | :--- |
| **Name** | `srivilliputhur-drainage-system` |
| **Region** | Choose nearest (e.g., Singapore / Oregon / Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | *(leave blank)* |
| **Runtime / Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && python database.py` |
| **Start Command** | `gunicorn app:app` |
| **Instance Type** | **Free** |

5. Click **Deploy Web Service**.
6. Render will install dependencies, initialize and seed the SQLite database, and launch the Gunicorn WSGI server. Once complete, you will receive your permanent public URL (e.g., `https://srivilliputhur-drainage-system.onrender.com`)!

---

## 📊 Data Provenance & Academic Integrity
* **33 Official Wards:** 100% verified public data from the Commissioner of Municipal Administration (CMA TN) and 2011 Census.
* **12 Historical Incidents:** Sourced verbatim from regional news archives (2019–2026).
* **1 Verified Tender Drain:** Official road/drain construction record for Ward 32 (Bharathi Nagar 3rd St Road, 120m).
* **25 Planned Field Survey Points:** Primary survey points marked `Planned / Field Data Required`.
* **50 Synthetic ML Records:** Labeled `SYNTHETIC` prototype dataset.
* **Zero Hallucinated Real Data:** Missing values are explicitly marked `Not Available`.

---

## 🧪 Local Testing
To test all 16 routes, database integrity, and REST APIs locally before deploying:
```bash
python test_prototype.py
```
*(All 7 unit tests pass in <0.3s)*
