# dQuiz — Live Multiplayer Quiz Platform

A full-featured multiplayer quiz platform built with vanilla HTML/CSS/JS + Firebase, deployable as a GitHub Pages static site.

## 📁 File Structure

```
dquiz/
├── index.html              ← Landing page
├── dashboard.html          ← Main user dashboard
├── discover.html           ← Browse public quizzes
├── leaderboard.html        ← Global XP / wins leaderboard
├── profile.html            ← User profile + achievements
├── 404.html                ← GitHub Pages 404
├── firestore.rules         ← Firestore security rules
├── firestore.indexes.json  ← Firestore composite indexes
│
├── auth/
│   ├── login.html          ← Email + Google sign-in
│   ├── signup.html         ← Create account
│   ├── forgot-password.html
│   └── logout.html
│
├── quiz/
│   ├── my-quizzes.html     ← List, edit, delete, duplicate
│   ├── create.html         ← Quiz builder
│   └── edit.html           ← Edit existing quiz (same as create)
│
├── game/
│   ├── join.html           ← Enter code + nickname to join
│   ├── host.html           ← Host lobby + game controls
│   └── play.html           ← Player game view
│
├── admin/
│   └── index.html          ← Admin panel (role-gated)
│
└── assets/
    ├── css/main.css        ← All shared styles
    └── js/
        ├── firebase-init.js ← Firebase app init
        └── utils.js         ← Shared utilities
```

## 🎮 How It Works

### Creating a quiz
1. Sign up / log in
2. Dashboard → **Create Quiz**
3. Add title, description, emoji cover
4. Add questions (text, 4 answers, mark correct, set timer + points)
5. Save → Host

### Hosting a game
1. **My Quizzes** → click **▶ Host**
2. A 6-digit code is generated automatically
3. Players go to `/game/join.html` and enter the code
4. Hit **Start Game** — questions advance under host control
5. See live answer stats, skip questions, end early

### Playing a game
1. Go to `/game/join.html`
2. Enter the code + a nickname (no account needed!)
3. Answer questions before the timer runs out
4. Earn points for correct + fast answers + streaks
5. See final podium and stats

### XP & Levels
- Win a game: **+200 XP**
- Top 3 finish: **+100 XP**
- Participate: **+50 XP**
- Host a game: **+100 XP**
- Level = `floor(totalXP / 500) + 1`

### Making a user admin
In Firestore Console, find `users/{uid}` and set `role: "admin"`.
Then they can access `/admin/`.

## 🔒 Security

All Firestore rules enforce:
- Users can only edit their own profile
- Quiz creators can only edit their own quizzes
- Players can only update their own player document
- Hosts control game state transitions
- Admins have elevated read/write on everything
- Scores can only be incremented via authenticated writes

## 🛠 Tech Stack

- **HTML5 / CSS3 / Vanilla JS** (ES Modules)
- **Firebase Auth** — email + Google
- **Cloud Firestore** — real-time listeners everywhere (no polling)
- **Firebase JS SDK v10** — loaded via CDN (no build step)
- **Google Fonts** — Space Grotesk + Inter
- **GitHub Pages** — free static hosting

## ⚠️ Notes

- No build step required — pure static files
- Firebase SDK loaded from `gstatic.com` CDN
- All real-time game updates use `onSnapshot` listeners
- Guest players (no account) can join games — XP only awarded to signed-in users
- Images in quizzes use external URLs only (no Firebase Storage)
