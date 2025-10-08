# Analytica

> Track GitHub developers you care about. Discover what they're building, learning, and contributing to.

A web platform that helps you monitor GitHub activity of developers you want to learn from - classmates, mentors, or inspiring creators. Get insights into their tech stack, contribution patterns, and project activity in one unified dashboard.

**Live Demo:**[Analytica](https://www.analytica-frontend.vercel.app)
**Tech Stack:** Spring Boot, Next.js, TypeScript, PostgreSQL

---

## Why Analytica?

Learning from others is hard when their activity is scattered across repositories, commits, and pull requests. Analytica solves this by:

- **Tracking developer activity** - See what projects they're working on, what languages they're using, and how active they are
- **Analyzing tech profiles** - Understand their expertise through language distribution, project complexity, and contribution patterns  
- **Finding similar developers** - Discover people with matching tech stacks and interests
- **Comparing progress** - Benchmark yourself against peers on contributions, repos, and languages

Built by a developer who wanted to learn from others' journeys without manually checking dozens of GitHub profiles.

---

## Features

### 📌 Pin & Monitor Users
- Track unlimited GitHub users organized by teams (Classmates, Friends, Colleagues, or custom teams)
- View at-a-glance metrics: contributions, repos, top languages, recent activity
- Real-time data refresh with one click
- Search users by username

### 📊 Detailed Analytics Dashboard
Dive deep into any developer's profile:
- **Activity Metrics:** Daily/weekly/monthly contribution graphs, total contributions, lines of code
- **Tech Stack Analysis:** Language distribution, versatility score, specialization metrics
- **Project Insights:** Repository activity timeline, complexity scores, star/fork counts
- **Documentation Quality:** README analysis across all projects (intro, installation, usage, contribution guides)
- **Learning Timeline:** Track when languages were learned, first used, and last active

### 🤝 Tech Matches
- Find developers with similar tech stacks using cosine similarity scoring
- Get up to 3 matches based on language usage and project overlap
- Discover potential collaborators or learning partners

### 🏆 Leaderboards
- **Local:** Rank your pinned users by contributions
- **Global:** Platform-wide rankings (daily/weekly/monthly - in progress)
- Filter by time period and metric type

### ⚖️ Compare Users
Head-to-head comparison on:
- Total contributions, repos, followers
- Pull requests, issues, commits
- Language expertise and project count
- Visual winner indicators

### 👤 Your Profile
- Personal dashboard with all analytics applied to your own GitHub
- Private repository analysis (coming soon - add your access token)
- Track your own growth over time

---

## Tech Stack

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- Dark/light mode support
- Fully responsive design

### Backend
- **Spring Boot** with Java 21
- **GraphQL** for GitHub API integration
- **PostgreSQL (Neon)** for data storage
- RESTful endpoints for frontend communication

### Deployment
- **Frontend:** Vercel
- **Backend:** Render (free tier - may take 30s-1min to wake up on first request)

---

## Getting Started

### Prerequisites
- Node.js 18+
- Java 21+
- PostgreSQL database
- GitHub Personal Access Token

### Installation

**Clone the repository:**
```bash
git clone https://github.com/vijha742/analytica.git
cd analytica
```

**Backend Setup:**
```bash
cd backend
./mvnw clean install
# Configure application.properties with your database and GitHub token
./mvnw spring-boot:run
```

**Frontend Setup:**
```bash
cd frontend
npm install
# Configure .env.local with backend API URL
npm run dev
```

Access the app at `http://localhost:3000`

---

## Usage

1. **Sign Up / Login** - Create an account (GitHub OAuth coming soon)
2. **Add Users** - Search and pin GitHub users you want to track
3. **Organize Teams** - Create custom teams or use default categories
4. **View Analytics** - Click any user to see detailed insights
5. **Compare & Match** - Use comparison tools to benchmark and find similar developers
6. **Track Progress** - Check leaderboards and your own profile dashboard

---

## Roadmap

### In Progress
- [ ] Daily/weekly/monthly leaderboard views
- [ ] Team update and delete functionality
- [ ] Enhanced comparison metrics (code review quality, documentation depth)
- [ ] Private repository analysis with user tokens

### Planned
- [ ] GitHub OAuth authentication
- [ ] Email notifications for significant user activity
- [ ] Collaborative features (share tech matches, team boards)
- [ ] Export analytics reports (PDF/CSV)

---

## Known Limitations

- **Backend Hosting:** Render free tier spins down after 15 minutes of inactivity. First request may take 30 seconds - 1 minute to wake up.
- **Database:** Neon free tier has 100 compute hours/month and 500MB storage. Sufficient for demo use.
- **Rate Limiting:** GitHub API has rate limits. Excessive refreshes may temporarily block data fetching.

For production use, sponsor if you can.

---

## Contributing

Contributions are welcome! If you'd like to improve Analytica:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Areas where help is needed:**
- Frontend UI/UX improvements
- Additional analytics metrics
- Performance optimization
- Mobile responsiveness
- Documentation

---

## About the Developer

Built by **Vikas Jha**.

**Connect:**
- GitHub: [@vijha742](https://github.com/vijha742)
- LinkedIn: [vijha742](https://linkedin.com/in/vijha742)
- Email: jhavikas2004@gmail.com

---

## License

MIT License [LICENSE]

---

## Acknowledgments

- GitHub GraphQL API for developer data
- All the developers whose profiles inspired this project
- Open source community for tools and libraries

---

**⭐ If you find Analytica useful, consider starring the repo!**
