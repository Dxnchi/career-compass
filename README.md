# 🧭 Career Compass

![Status](https://img.shields.io/badge/Status-Active_Development-success?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Mobile_Offline--First-blue?style=for-the-badge)
![Module](https://img.shields.io/badge/Module-DSW02b1-critical?style=for-the-badge)

Career Compass is an offline-first mobile application designed to seamlessly match high school students with eligible university programmes. By scanning report cards, our deterministic engine extracts grades and cross-references them with university admission requirements to provide accurate, instant feedback.

---

## 🛠️ Tech Stack

*   **Frontend:** ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB) Expo
*   **Backend:** ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) Express
*   **Database:** ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat&logo=sqlite&logoColor=white) Local Persistence

---

## 👥 The Engineering Team

| Team Member | Role / Feature Branch | Status |
| :--- | :--- | :--- |
| **Onkarabetse** | Project Management & Architecture Docs | 🟢 Active |
| **Maphoka** | UI/UX Design System | 🟢 Active |
| **Destiny** | Express Backend & Matching Engine API | 🟢 Active |
| **Lindo** | React Native & Camera UI | 🟢 Active |
| **Prince** | SQLite Local CRUD Architecture | 🟢 Active |
| **Clinton** | CI/CD, Profiling & Integration Testing | 🟢 Active |

---

## 🚀 Getting Started

<details>
<summary><b>Click to expand setup instructions</b></summary>
<br>

1. **Clone the repository:**
   `git clone https://github.com/[your-repo-link]/career-compass.git`
2. **Install Backend Dependencies:**
   `cd server && npm install`
3. **Run the API (Dev Mode):**
   `npm run dev`

</details>

---

## 🚨 Git Workflow Rules

To ensure a stable codebase, all contributors must adhere to the following workflow:

- [x] **No direct commits** to `main` or `development`.
- [x] **Branch Naming:** Use your assigned `feature/[name]` branch.
- [x] **Pull Requests:** All features must be merged into `development` via a reviewed PR.

<details>
<summary><b>View Daily Git Commands</b></summary>
<br>

1. `git pull origin development`
2. `git checkout feature/your-branch-name`
3. `git add .`
4. `git commit -m "feat: description of work"`
5. `git push -u origin feature/your-branch-name`

</details>
