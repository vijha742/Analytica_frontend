# Analytica Github

A platform that helps developers track and analyze GitHub activity of their peers, making it easier to find experts, track contributions, and discover collaboration opportunities.

## Core Features

### User Data Tracking
- Total contributions and activity metrics
- GitHub achievements and custom achievements
- Technology stack and language expertise
- Profile information (picture, name, followers/following)
- Recent activity and contribution patterns
- Advanced metrics:
  - Code Review Participation Rate
  - Documentation Quality Score
  - Community Engagement metrics
  - Project Maintenance Score
  - Code Quality Indicators
  - Collaboration Score
  - Open Source Contribution Impact
  - Technical Writing Score

### Custom Achievements
- Fast Shipping: Quick PR merges
- Documentation Champion: Comprehensive READMEs and docs
- Code Quality Guardian: High-quality PR reviews
- Community Builder: Active in discussions
- Bug Hunter: Effective issue reporting
- Code Mentor: Helpful code reviews
- Consistency King: Regular contribution patterns
- Language Polyglot: Contributions in multiple languages
- Open Source Advocate: Active in open source projects
- Code Cleaner: Improving code quality in existing projects

## Tech Stack

### Frontend
- Next.js with TypeScript
- Tailwind CSS for styling
- Light/Dark mode support
- Responsive design for all devices

### Backend
- Spring Boot
- Supabase for database and authentication
- GitHub GraphQL API for data fetching
- Rate limiting and caching implementation

### Authentication
- GitHub OAuth
- Gmail
- Email/Password

### Deployment
- Frontend: Vercel (free tier)
- Backend: Railway.app/Render.com (free tier with GitHub Student Pack)

## Execution Plan

### V0 - Foundation (Week 1-2)
- [x] Set up project structure
- [ ] Implement basic GitHub data fetching
- [ ] Create user addition system
- [ ] Design and implement basic desktop UI
- [ ] Set up authentication system

### V1 - Basic UI (Week 3-4)
- [ ] Develop landing page
- [ ] Create about page
- [x] Implement mobile UI
- [ ] Set up basic routing
- [ ] Implement light/dark mode

### V2 - User Interface Enhancement (Week 5-6)
- [ ] Create users display page
- [ ] Implement responsive design
- [ ] Revamp desktop UI
- [ ] Add basic user profiles
- [ ] Implement data refresh system

### V3 - Core Features (Week 7-8)
- [ ] Develop homepage
- [ ] Enhance about page
- [ ] Implement achievement system
- [ ] Add basic metrics tracking
- [ ] Set up data caching

### V4 - Data Management (Week 9-10)
- [ ] Implement Supabase integration
- [ ] Create daily/weekly rankings
- [ ] Add weighted scoring system
- [ ] Implement data refresh intervals
- [ ] Set up rate limiting

### V5 - Analytics & Dashboard (Week 11-12)
- [ ] Create user dashboard
- [ ] Implement analytics page
- [ ] Add user registration system
- [ ] Develop private repository access
- [ ] Create recommendation system

## Technical Considerations

### Rate Limiting
- Implement caching for frequently accessed data
- Use webhooks for real-time updates
- Batch requests where possible
- Implement exponential backoff for retries
- Store data locally and update incrementally

### Data Refresh Strategy
- 10-minute interval for regular users
- Admin privileges for manual refresh
- Queue system for updates
- Prioritize active users' data
- Incremental updates

### Dashboard Features
- Activity Overview
  - Daily commit graph
  - Commit patterns
  - Language distribution
- Code Quality
  - Commit message quality
  - PR review participation
  - Documentation contributions
- Community
  - Connection recommendations
  - Language-based peer matching
  - Collaboration opportunities
- Personal Stats
  - Basic profile information
  - Achievement showcase
  - Contribution trends

## Contributing
[To be added]

## License
[To be added]
