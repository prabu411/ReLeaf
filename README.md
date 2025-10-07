
````markdown
# 🌱 EcoCampus: Gamified Sustainability Dashboard

**Project Type:** Web-based Gamified Platform  
**Purpose:** Increase student engagement in campus sustainability initiatives by tracking eco-friendly actions, rewarding participation, and visualizing impact.

---

## **Project Overview**

EcoCampus is a **gamified web application** designed to motivate students to adopt sustainable practices on campus. By tracking eco-actions, awarding points, badges, and tiers, and displaying real-time leaderboards, EcoCampus turns environmental responsibility into a **fun and measurable experience**.

**Core Objectives:**
- Encourage eco-friendly behavior among students
- Gamify participation with points, badges, tiers, and streaks
- Provide admins/faculty with analytics and reports
- Visualize individual and collective progress through dashboards

---

## **Default Login Credentials**

- **Email:** `sustainable@sece.ac.in`  
- **Password:** `sece@123`  
- **Roles:** Student / Admin (distinguished by role flag in DB)

> ⚠️ For MVP, these default credentials allow immediate testing and onboarding.

---

## **MVP Features**

1. **Student & Admin Login** – Secure access, role-based dashboard
2. **Eco-Action Tracking** – Submit actions like recycling, reusable bottle use, walking/cycling
3. **Points & Rewards System** – Actions convert into points; milestone rewards and badges
4. **Leaderboard / Scoreboard** – Real-time ranking with tiers, badges, streaks, and filters
5. **Progress Visualization** – Charts & dashboards show impact and trends
6. **Gamified Challenges & Quests** – Weekly/monthly tasks to motivate participation
7. **Admin Analytics & Reports** – Track participation, top performers, and engagement trends

---

## **Gamification Model**

### **Points System**
| Action | Points |
|--------|--------|
| Reusable bottle use | 10 |
| Recycling paper/plastic | 15 |
| Walking/cycling to campus | 20 |
| Eco-event participation | 50 |
| Weekly eco-challenges | 30 |

### **Tiers**
| Tier | Points | Recognition |
|------|--------|------------|
| Bronze | 0–100 | Starter tier |
| Silver | 101–250 | Unlock badges & mini challenges |
| Gold | 251–500 | Highlighted on leaderboard |
| Platinum | 501+ | Special recognition & featured |

### **Badges & Achievements**
- **Recycling Champion:** Recycle 10+ items  
- **Reusable Hero:** 7-day consecutive reusable bottle use  
- **Green Event Participant:** Attend 3 eco-events  
- **Streak Master:** 7-day continuous action streak  

### **Streaks & Bonus Points**
- Daily streak: +20 points  
- Weekly streak: +50 points  
- Streaks visually displayed on leaderboard  

---

## **Leaderboard Features**

- Real-time updates for all students  
- Top 3 performers visually highlighted  
- Filter by department, year, or activity type  
- Columns: Rank | Name | Total Points | Weekly Points | Badges | Tier | Streak  
- Dynamic badges and streak icons encourage competition  

---

## **High-Level User Stories**

**Student Users**
1. As a student, I want to submit my eco-actions, so that I earn points and badges.  
2. As a student, I want to view the leaderboard, so that I can compete with peers.  
3. As a student, I want to track my streaks and tier progression, so that I am motivated to stay consistent.

**Admin Users**
1. As an admin, I want to view analytics and reports, so that I can monitor participation and reward top performers.

---

## **Recommended Technology Stack**

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| Real-Time | Socket.io (leaderboard updates) |
| Hosting | Vercel (Frontend) + Render/Heroku (Backend) |

---

## **Data Flow Concept**

1. Student submits an eco-action.  
2. System verifies the submission.  
3. Points, badges, and streaks are updated.  
4. Leaderboard updates in real-time.  
5. Notifications sent to student for rewards and tier progression.  
6. Admin dashboard updates for analytics and reporting.

---

## **Getting Started**

1. Clone the repository  
   ```bash
   git clone <repository-url>
````

2. Install dependencies (Frontend & Backend)

   ```bash
   cd frontend && npm install
   cd backend && npm install
   ```
3. Start the backend server

   ```bash
   npm start
   ```
4. Start the frontend server

   ```bash
   npm start
   ```
5. Login using default credentials:

   * Email: `sustainable@sece.ac.in`
   * Password: `sece@123`

---

## **Future Enhancements**

* Mobile app version for iOS and Android
* Sensor integration for automated eco-action tracking
* Campus-wide event leaderboards and reward redemption system
* Social sharing for achievements and badges

---

## **License**

MIT License – Free for educational and non-commercial use

---

```

