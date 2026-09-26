import uuid
from backend.app.core.database import SessionLocal, engine, Base
from backend.app.core.security import get_password_hash
from backend.app.models.user import User
from backend.app.models.profile import Profile
from backend.app.models.skill import Skill, UserSkill
from backend.app.models.evidence import SkillEvidence, EvidenceFile, VerificationReview
from backend.app.models.project import Project
from backend.app.models.experience import Experience
from backend.app.models.education import Education, Certification
from backend.app.models.job import Job, JobSkill
from backend.app.models.assessment import SkillAssessment, AssessmentQuestion
from backend.app.models.career import CareerPath, CareerPathStep

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_user = db.query(User).filter(User.email == "alex.morgan@example.com").first()
        if existing_user:
            print("Database already seeded with demo user.")
            return

        print("Seeding database with comprehensive SkillPilot data...")

        # 1. Create Demo User
        user = User(
            id=str(uuid.uuid4()),
            email="alex.morgan@example.com",
            password_hash=get_password_hash("password123")
        )
        db.add(user)
        db.flush()

        # 2. Create Profile
        profile = Profile(
            user_id=user.id,
            full_name="Alex Morgan",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
            headline="Frontend Engineer | React & TypeScript Specialist",
            location="San Francisco, CA (Hybrid / Remote)",
            bio="Frontend Engineer with 3+ years experience building accessible, responsive, and high-performance web applications using React, TypeScript, and modern web standards.",
            education_summary="B.S. in Computer Science, UC Berkeley (2022)",
            graduation_year=2022,
            target_roles=["Senior Frontend Engineer", "Full Stack Developer", "UI Platform Engineer"],
            career_preferences={
                "workMode": "Hybrid",
                "targetSalaryMin": 140000,
                "targetSalaryMax": 175000,
                "locations": ["San Francisco, CA", "Remote"],
                "industries": ["Fintech", "Developer Tools", "SaaS"]
            },
            metrics_cache={
                "overallReadiness": 78,
                "technicalDepth": 82,
                "portfolioEvidence": 61,
                "skillConfidence": 89,
                "marketAlignment": 91
            }
        )
        db.add(profile)

        # 3. Seed Skills Master Catalog
        skill_catalog = [
            ("React", "Frontend"),
            ("TypeScript", "Frontend"),
            ("JavaScript", "Frontend"),
            ("Tailwind CSS", "Frontend"),
            ("Next.js", "Frontend"),
            ("HTML5 / CSS3", "Frontend"),
            ("State Management (Zustand/Redux)", "Frontend"),
            ("GraphQL", "Frontend"),
            ("Node.js", "Backend"),
            ("Python", "Backend"),
            ("PostgreSQL", "Data"),
            ("REST APIs", "Backend"),
            ("Docker", "Cloud"),
            ("AWS", "Cloud"),
            ("Git & CI/CD", "Tools"),
            ("Unit & Integration Testing (Jest/Vitest)", "Tools"),
            ("Performance Optimization", "Frontend"),
            ("Web Accessibility (WCAG)", "Frontend"),
        ]

        skill_records = {}
        for name, category in skill_catalog:
            s = Skill(name=name, category=category)
            db.add(s)
            db.flush()
            skill_records[name] = s

        # 4. Seed Alex Morgan's User Skills with Verified Statuses & Confidences
        user_skills_data = [
            ("React", "Advanced", "Advanced", "VERIFIED", 92),
            ("JavaScript", "Expert", "Advanced", "VERIFIED", 95),
            ("Tailwind CSS", "Expert", "Advanced", "VERIFIED", 90),
            ("HTML5 / CSS3", "Expert", "Advanced", "VERIFIED", 94),
            ("State Management (Zustand/Redux)", "Advanced", "Advanced", "VERIFIED", 88),
            ("TypeScript", "Intermediate", None, "CLAIMED", 65),
            ("Next.js", "Intermediate", "Intermediate", "SUPPORTED", 75),
            ("Node.js", "Intermediate", "Intermediate", "SUPPORTED", 70),
            ("REST APIs", "Advanced", "Intermediate", "SUPPORTED", 78),
            ("Git & CI/CD", "Intermediate", "Intermediate", "SUPPORTED", 72),
            ("GraphQL", "Beginner", None, "CLAIMED", 45),
            ("Python", "Intermediate", None, "CLAIMED", 55),
            ("PostgreSQL", "Intermediate", None, "CLAIMED", 50),
            ("Docker", "Beginner", None, "CLAIMED", 40),
            ("AWS", "Beginner", None, "CLAIMED", 35),
            ("Unit & Integration Testing (Jest/Vitest)", "Intermediate", None, "CLAIMED", 60),
            ("Performance Optimization", "Intermediate", None, "CLAIMED", 65),
            ("Web Accessibility (WCAG)", "Intermediate", "Intermediate", "SUPPORTED", 76),
        ]

        user_skill_records = {}
        for s_name, claimed, verified, status, conf in user_skills_data:
            s = skill_records.get(s_name)
            if s:
                us = UserSkill(
                    user_id=user.id,
                    skill_id=s.id,
                    claimed_level=claimed,
                    verified_level=verified,
                    status=status,
                    confidence=conf
                )
                db.add(us)
                db.flush()
                user_skill_records[s_name] = us

        # 5. Seed Evidence & Reviews for Verified Skills
        # React Evidence
        react_us = user_skill_records.get("React")
        if react_us:
            ev_react = SkillEvidence(
                user_skill_id=react_us.id,
                evidence_type="GITHUB",
                title="Production Fintech Dashboard & Design System",
                description="Built an interactive real-time analytics dashboard with reusable React 18 component primitives, custom hooks, and virtualized tables rendering 10k+ rows at 60 FPS.",
                url="https://github.com/alexmorgan/fintech-react-dashboard",
                status="VERIFIED",
                relevance_score="High",
                quality_score="Strong",
                ai_confidence=92,
                metadata_json={
                    "personal_contribution": "100% solo architecture, custom React hooks, zero layout shift",
                    "relevant_paths": "src/components/Dashboard.tsx, src/hooks/useMetrics.ts"
                }
            )
            db.add(ev_react)
            db.flush()

            rev_react = VerificationReview(
                evidence_id=ev_react.id,
                status="VERIFIED",
                ai_confidence=92,
                relevance_score="High",
                quality_score="Strong",
                detected_level="Advanced",
                reasoning="Demonstrates clear mastery of React 18 concurrent rendering, custom memoization hooks, and performance-tuned state management with zero UI stutter.",
                strengths=[
                    "Clean modular architecture with compound component patterns",
                    "Efficient state selectors minimizing unnecessary re-renders",
                    "High test coverage with Vitest and React Testing Library"
                ],
                gaps=[
                    "Could demonstrate Server Components migration path"
                ]
            )
            db.add(rev_react)

        # JavaScript Evidence
        js_us = user_skill_records.get("JavaScript")
        if js_us:
            ev_js = SkillEvidence(
                user_skill_id=js_us.id,
                evidence_type="TECHNICAL_ASSESSMENT",
                title="Advanced JavaScript & Event Loop Mastery Assessment",
                description="Passed official SkillPilot proctored assessment covering closures, prototypes, asynchronous event loop scheduling, and memory leak profiling.",
                url="https://skillpilot.dev/verify/cert/js-alex-morgan-2024",
                status="VERIFIED",
                relevance_score="High",
                quality_score="Strong",
                ai_confidence=95
            )
            db.add(ev_js)
            db.flush()

            rev_js = VerificationReview(
                evidence_id=ev_js.id,
                status="VERIFIED",
                ai_confidence=95,
                relevance_score="High",
                quality_score="Strong",
                detected_level="Advanced",
                reasoning="Scored 96% on advanced event loop, microtask queuing, and prototype inheritance challenges.",
                strengths=["Flawless grasp of asynchronous primitives", "Optimal memory allocation patterns"],
                gaps=[]
            )
            db.add(rev_js)

        # 6. Seed Projects
        projects_data = [
            {
                "title": "Nova Fintech Dashboard",
                "role": "Lead Frontend Engineer",
                "description": "High-frequency trade monitoring web application featuring live WebSockets telemetry, sub-second chart rendering, and exportable financial reports.",
                "impact": "Processed 2M+ daily events with zero UI latency and 99.9% uptime.",
                "skills": ["React", "JavaScript", "Tailwind CSS", "Zustand", "REST APIs"],
                "url": "https://nova-dashboard.demo.app",
                "github_url": "https://github.com/alexmorgan/nova-fintech"
            },
            {
                "title": "Aura Design System",
                "role": "Frontend Architecture Contributor",
                "description": "Accessible multi-brand design system with 40+ atomic components conforming strictly to WCAG 2.1 AA accessibility guidelines.",
                "impact": "Adopted by 6 product teams, reducing frontend UI development cycle by 35%.",
                "skills": ["React", "HTML5 / CSS3", "Tailwind CSS", "Accessibility (WCAG)"],
                "url": "https://aura-ui.demo.app",
                "github_url": "https://github.com/alexmorgan/aura-design-system"
            },
            {
                "title": "OmniStore Headless Commerce",
                "role": "Full Stack Engineer",
                "description": "Headless storefront utilizing Next.js, Stripe payments, and PostgreSQL for order processing.",
                "impact": "Achieved 98+ Google Lighthouse Performance score on mobile and desktop.",
                "skills": ["Next.js", "Node.js", "PostgreSQL", "REST APIs"],
                "url": "https://omnistore.demo.app",
                "github_url": "https://github.com/alexmorgan/omnistore"
            }
        ]

        for p_info in projects_data:
            p = Project(
                user_id=user.id,
                title=p_info["title"],
                role=p_info["role"],
                description=p_info["description"],
                impact=p_info["impact"],
                skills=p_info["skills"],
                url=p_info["url"],
                github_url=p_info["github_url"]
            )
            db.add(p)

        # 7. Seed Experience
        exp1 = Experience(
            user_id=user.id,
            title="Frontend Engineer",
            company="TechFlow Solutions",
            location="San Francisco, CA (Hybrid)",
            period="2022 - Present",
            description="Developing enterprise customer portals, dynamic dashboards, and modular React design components.",
            technologies=["React", "JavaScript", "Tailwind CSS", "REST APIs", "Git & CI/CD"],
            highlights=[
                "Migrated legacy SPA to React 18, reducing bundle size by 42% and initial load time by 1.4s",
                "Authored 30+ accessible components utilized by over 50,000 active monthly business users",
                "Mentored 2 junior engineers and established team coding standards"
            ]
        )
        exp2 = Experience(
            user_id=user.id,
            title="Junior Web Developer Intern",
            company="StartupLab Labs",
            location="Berkeley, CA",
            period="2021 - 2022",
            description="Built responsive landing pages, interactive forms, and assisted in API integrations.",
            technologies=["JavaScript", "HTML5 / CSS3", "REST APIs"],
            highlights=[
                "Developed 8 dynamic marketing microsites with responsive mobile-first styling",
                "Integrated third-party analytics and optimized conversion funnel"
            ]
        )
        db.add(exp1)
        db.add(exp2)

        # 8. Seed Education & Certifications
        edu = Education(
            user_id=user.id,
            degree="Bachelor of Science in Computer Science",
            institution="University of California, Berkeley",
            field_of_study="Computer Science & Human-Computer Interaction",
            graduation_year=2022,
            details="Dean's Honors List. Coursework: Data Structures, Web Architecture, UI/UX Design, Distributed Systems."
        )
        db.add(edu)

        cert = Certification(
            user_id=user.id,
            name="Meta Certified Frontend Developer",
            issuer="Meta / Coursera",
            issue_date="Nov 2023",
            credential_id="META-FE-98317-AM",
            credential_url="https://coursera.org/verify/META-FE-98317-AM"
        )
        db.add(cert)

        # 9. Seed 10 Realistic Jobs with detailed skill requirements
        jobs_seed_data = [
            {
                "id": "job_vercel_senior_fe",
                "title": "Senior Frontend Engineer",
                "company": "Vercel",
                "location": "San Francisco, CA (Remote Friendly)",
                "employment_type": "Full-time",
                "work_mode": "Hybrid",
                "department": "Core Platform & Frameworks",
                "experience_level": "Senior",
                "experience_years_required": 3,
                "education_required": "Bachelor's in CS or equivalent experience",
                "salary_min": 155000,
                "salary_max": 195000,
                "growth_index": 94,
                "description": "We are seeking a talented Senior Frontend Engineer to build world-class developer experiences. You will collaborate closely with product designers to ship intuitive, blazingly fast interfaces powering millions of developers globally.",
                "responsibilities": [
                    "Architect and build high-performance web applications using React, Next.js, and TypeScript",
                    "Contribute to our core design system and ensure strict accessibility compliance",
                    "Profile web performance metrics (Core Web Vitals) and optimize edge rendering workflows"
                ],
                "benefits": ["Competitive Equity", "$3,000 WFH Stipend", "Unlimited PTO", "Full Health/Dental/Vision"],
                "required_skills": [
                    ("React", "critical", 3.0, "Advanced"),
                    ("TypeScript", "critical", 3.0, "Advanced"),
                    ("JavaScript", "high", 2.0, "Advanced"),
                    ("Tailwind CSS", "high", 2.0, "Advanced"),
                    ("Next.js", "high", 2.0, "Intermediate"),
                    ("HTML5 / CSS3", "medium", 1.2, "Advanced"),
                    ("Performance Optimization", "medium", 1.2, "Intermediate"),
                ]
            },
            {
                "id": "job_stripe_fullstack",
                "title": "Full Stack Developer",
                "company": "Stripe",
                "location": "San Francisco, CA",
                "employment_type": "Full-time",
                "work_mode": "Hybrid",
                "department": "Merchant Dashboard & Developer Experience",
                "experience_level": "Mid-Senior",
                "experience_years_required": 3,
                "education_required": "Bachelor's in Computer Science",
                "salary_min": 150000,
                "salary_max": 185000,
                "growth_index": 92,
                "description": "Join Stripe to help build the financial infrastructure of the internet. You will craft responsive user interfaces backed by scalable APIs handling billions in transactional volume.",
                "responsibilities": [
                    "Develop merchant dashboard features end-to-end with React and Node.js backend services",
                    "Design resilient RESTful APIs and ensure seamless database schema migrations",
                    "Partner with infrastructure engineers to guarantee 99.999% platform availability"
                ],
                "benefits": ["Top-tier compensation & equity", "401(k) 50% match", "Generous parental leave", "Annual learning stipend"],
                "required_skills": [
                    ("React", "critical", 3.0, "Advanced"),
                    ("TypeScript", "high", 2.0, "Intermediate"),
                    ("Node.js", "critical", 3.0, "Advanced"),
                    ("REST APIs", "high", 2.0, "Advanced"),
                    ("PostgreSQL", "medium", 1.2, "Intermediate"),
                    ("JavaScript", "medium", 1.2, "Advanced"),
                    ("Git & CI/CD", "medium", 1.2, "Intermediate"),
                ]
            },
            {
                "id": "job_airbnb_ui_platform",
                "title": "UI Platform Engineer",
                "company": "Airbnb",
                "location": "San Francisco, CA (Remote)",
                "employment_type": "Full-time",
                "work_mode": "Remote",
                "department": "Design Systems & Frontend Infrastructure",
                "experience_level": "Mid-Senior",
                "experience_years_required": 3,
                "education_required": "Bachelor's in CS / HCI or equivalent",
                "salary_min": 160000,
                "salary_max": 190000,
                "growth_index": 89,
                "description": "Build the foundational design primitives and UI toolkit empowering hundreds of frontend engineers across web and mobile platforms at Airbnb.",
                "responsibilities": [
                    "Design and maintain universal UI components adhering to WCAG 2.1 AA accessibility standards",
                    "Optimize build pipelines, linting rules, and headless UI architectures",
                    "Conduct automated visual regression testing and performance benchmarking"
                ],
                "benefits": ["$2,000 Annual Travel Credit", "Wellness Reimbursement", "Comprehensive Healthcare"],
                "required_skills": [
                    ("React", "critical", 3.0, "Advanced"),
                    ("JavaScript", "critical", 3.0, "Advanced"),
                    ("HTML5 / CSS3", "critical", 3.0, "Expert"),
                    ("Tailwind CSS", "high", 2.0, "Advanced"),
                    ("Web Accessibility (WCAG)", "critical", 3.0, "Advanced"),
                    ("TypeScript", "high", 2.0, "Intermediate"),
                    ("Unit & Integration Testing (Jest/Vitest)", "medium", 1.2, "Intermediate")
                ]
            },
            {
                "id": "job_linear_staff_fe",
                "title": "Frontend Engineer (Core App)",
                "company": "Linear",
                "location": "San Francisco, CA (Hybrid)",
                "employment_type": "Full-time",
                "work_mode": "Hybrid",
                "department": "Product Engineering",
                "experience_level": "Mid-Senior",
                "experience_years_required": 3,
                "education_required": "B.S. in CS or equivalent portfolio",
                "salary_min": 165000,
                "salary_max": 205000,
                "growth_index": 96,
                "description": "Linear is building the next-generation issue tracking and project management tool. We obsess over speed, keyboard ergonomics, and silky smooth 120 FPS animations.",
                "responsibilities": [
                    "Create ultra-responsive client-side interfaces with optimistic mutations and offline synchronization",
                    "Refine micro-interactions and custom keyboard shortcuts for peak user productivity",
                    "Maintain high performance across large dataset views without DOM bloat"
                ],
                "benefits": ["Competitive Equity", "State-of-the-art hardware setup", "Flexible working hours"],
                "required_skills": [
                    ("React", "critical", 3.0, "Advanced"),
                    ("TypeScript", "critical", 3.0, "Advanced"),
                    ("State Management (Zustand/Redux)", "critical", 3.0, "Advanced"),
                    ("JavaScript", "high", 2.0, "Advanced"),
                    ("Performance Optimization", "critical", 3.0, "Advanced"),
                    ("Tailwind CSS", "medium", 1.2, "Intermediate")
                ]
            },
            {
                "id": "job_figma_web_eng",
                "title": "Frontend Architect",
                "company": "Figma",
                "location": "San Francisco, CA",
                "employment_type": "Full-time",
                "work_mode": "Hybrid",
                "department": "Design Tools & Web Canvas",
                "experience_level": "Senior",
                "experience_years_required": 4,
                "education_required": "B.S. in Computer Science",
                "salary_min": 170000,
                "salary_max": 210000,
                "growth_index": 91,
                "description": "Architect the web collaboration layers connecting Figma's canvas engine to millions of concurrent designers and developers.",
                "responsibilities": [
                    "Design high-throughput frontend architectures handling real-time multi-user synchronization",
                    "Lead frontend technical standards and conduct architectural RFC reviews",
                    "Optimize memory utilization and canvas rendering lifecycle"
                ],
                "benefits": ["Lucrative Equity", "Daily Catered Meals", "Comprehensive Relocation Package"],
                "required_skills": [
                    ("JavaScript", "critical", 3.0, "Expert"),
                    ("TypeScript", "critical", 3.0, "Advanced"),
                    ("React", "critical", 3.0, "Advanced"),
                    ("Performance Optimization", "critical", 3.0, "Advanced"),
                    ("REST APIs", "medium", 1.2, "Intermediate"),
                    ("Git & CI/CD", "medium", 1.2, "Intermediate")
                ]
            },
            {
                "id": "job_notion_product_eng",
                "title": "Product Engineer",
                "company": "Notion",
                "location": "San Francisco, CA (Hybrid)",
                "employment_type": "Full-time",
                "work_mode": "Hybrid",
                "department": "Document Workspaces",
                "experience_level": "Mid-Level",
                "experience_years_required": 2,
                "education_required": "Bachelor's in CS or equivalent",
                "salary_min": 145000,
                "salary_max": 180000,
                "growth_index": 90,
                "description": "Craft intuitive, multiplayer workspace blocks and connected databases used by individuals and Fortune 500 enterprises alike.",
                "responsibilities": [
                    "Build dynamic block editors and collaborative workspace surfaces",
                    "Implement state synchronization logic across web and desktop apps",
                    "Collaborate directly with design and product leads on feature iterations"
                ],
                "benefits": ["Competitive Salary & Equity", "Commuter Benefits", "Health & Wellness Allowance"],
                "required_skills": [
                    ("React", "critical", 3.0, "Advanced"),
                    ("TypeScript", "high", 2.0, "Intermediate"),
                    ("JavaScript", "high", 2.0, "Advanced"),
                    ("State Management (Zustand/Redux)", "high", 2.0, "Intermediate"),
                    ("REST APIs", "medium", 1.2, "Intermediate"),
                    ("HTML5 / CSS3", "medium", 1.2, "Advanced")
                ]
            },
            {
                "id": "job_datadog_fullstack_cloud",
                "title": "Full Stack Cloud Engineer",
                "company": "Datadog",
                "location": "San Francisco, CA (Remote)",
                "employment_type": "Full-time",
                "work_mode": "Remote",
                "department": "Observability & APM Dashboards",
                "experience_level": "Mid-Senior",
                "experience_years_required": 3,
                "education_required": "B.S. in Computer Science",
                "salary_min": 150000,
                "salary_max": 185000,
                "growth_index": 88,
                "description": "Develop observability dashboards that visualize live telemetry, distributed traces, and cloud infrastructure metrics.",
                "responsibilities": [
                    "Build high-density data visualizations with React and modern graphing libraries",
                    "Design backend analytics microservices in Python or Node.js",
                    "Integrate cloud deployment telemetry via AWS and Docker containers"
                ],
                "benefits": ["Equity Grants", "Home Office Allowance", "401(k) Match"],
                "required_skills": [
                    ("React", "high", 2.0, "Advanced"),
                    ("Python", "critical", 3.0, "Intermediate"),
                    ("Node.js", "high", 2.0, "Intermediate"),
                    ("PostgreSQL", "high", 2.0, "Intermediate"),
                    ("Docker", "high", 2.0, "Intermediate"),
                    ("AWS", "medium", 1.2, "Intermediate"),
                    ("JavaScript", "medium", 1.2, "Advanced")
                ]
            },
            {
                "id": "job_ramp_lead_ui",
                "title": "UI Engineer (Financial Products)",
                "company": "Ramp",
                "location": "San Francisco, CA",
                "employment_type": "Full-time",
                "work_mode": "On-site",
                "department": "Corporate Cards & Spend Management",
                "experience_level": "Mid-Senior",
                "experience_years_required": 3,
                "education_required": "Bachelor's Degree",
                "salary_min": 160000,
                "salary_max": 195000,
                "growth_index": 95,
                "description": "Ramp is redefining corporate finance with automated spend controls, instant receipt matching, and intelligent savings analytics.",
                "responsibilities": [
                    "Ship pixel-perfect customer-facing workflows with React, Tailwind CSS, and TypeScript",
                    "Ensure seamless integration with core financial APIs and transaction ledgers",
                    "Drive frontend test automation and regression safety"
                ],
                "benefits": ["Substantial Equity Upside", "Daily Lunches & Dinners", "Full Medical Coverage"],
                "required_skills": [
                    ("React", "critical", 3.0, "Advanced"),
                    ("TypeScript", "critical", 3.0, "Advanced"),
                    ("Tailwind CSS", "critical", 3.0, "Advanced"),
                    ("JavaScript", "high", 2.0, "Advanced"),
                    ("REST APIs", "high", 2.0, "Intermediate"),
                    ("Unit & Integration Testing (Jest/Vitest)", "medium", 1.2, "Intermediate")
                ]
            },
            {
                "id": "job_netflix_web_apps",
                "title": "Senior Web Applications Engineer",
                "company": "Netflix",
                "location": "San Francisco, CA (Hybrid)",
                "employment_type": "Full-time",
                "work_mode": "Hybrid",
                "department": "Studio & Content Engineering",
                "experience_level": "Senior",
                "experience_years_required": 4,
                "education_required": "B.S. in Computer Science or equivalent",
                "salary_min": 180000,
                "salary_max": 230000,
                "growth_index": 90,
                "description": "Develop internal production applications empowering filmmakers, visual effects artists, and studio executives to bring global stories to life.",
                "responsibilities": [
                    "Design and implement responsive studio asset pipelines and scheduling tools",
                    "Optimize rendering of massive multimedia timelines and creative review surfaces",
                    "Partner cross-functionally with studio directors and technical leads"
                ],
                "benefits": ["Top of Market Compensation", "Employee Stock Option Plan", "Comprehensive Benefits"],
                "required_skills": [
                    ("React", "critical", 3.0, "Advanced"),
                    ("JavaScript", "critical", 3.0, "Expert"),
                    ("TypeScript", "high", 2.0, "Advanced"),
                    ("GraphQL", "high", 2.0, "Intermediate"),
                    ("State Management (Zustand/Redux)", "high", 2.0, "Advanced"),
                    ("REST APIs", "medium", 1.2, "Advanced")
                ]
            },
            {
                "id": "job_coinbase_react_native",
                "title": "React Native & Web Engineer",
                "company": "Coinbase",
                "location": "San Francisco, CA (Remote)",
                "employment_type": "Full-time",
                "work_mode": "Remote",
                "department": "Consumer App Platform",
                "experience_level": "Mid-Level",
                "experience_years_required": 2,
                "education_required": "B.S. in CS or equivalent",
                "salary_min": 140000,
                "salary_max": 175000,
                "growth_index": 87,
                "description": "Build universal cross-platform trading interfaces that provide millions of users secure access to the cryptoeconomy.",
                "responsibilities": [
                    "Develop cross-platform component modules for web and mobile",
                    "Integrate real-time order books and asset pricing WebSockets",
                    "Conduct security audits on client-side state encryption and signing workflows"
                ],
                "benefits": ["Remote First Culture", "Crypto Grant Rewards", "Full Health & Dental"],
                "required_skills": [
                    ("React", "critical", 3.0, "Advanced"),
                    ("JavaScript", "critical", 3.0, "Advanced"),
                    ("TypeScript", "high", 2.0, "Intermediate"),
                    ("REST APIs", "high", 2.0, "Intermediate"),
                    ("State Management (Zustand/Redux)", "medium", 1.2, "Intermediate"),
                    ("Git & CI/CD", "medium", 1.2, "Intermediate")
                ]
            }
        ]

        for job_info in jobs_seed_data:
            j = Job(
                id=job_info["id"],
                title=job_info["title"],
                company=job_info["company"],
                location=job_info["location"],
                employment_type=job_info["employment_type"],
                work_mode=job_info["work_mode"],
                department=job_info["department"],
                experience_level=job_info["experience_level"],
                experience_years_required=job_info["experience_years_required"],
                education_required=job_info["education_required"],
                salary_min=job_info["salary_min"],
                salary_max=job_info["salary_max"],
                growth_index=job_info["growth_index"],
                description=job_info["description"],
                responsibilities=job_info["responsibilities"],
                benefits=job_info["benefits"]
            )
            db.add(j)
            db.flush()

            for sk_name, imp, wt, min_lvl in job_info["required_skills"]:
                s = skill_records.get(sk_name)
                if not s:
                    s = Skill(name=sk_name, category="Frontend")
                    db.add(s)
                    db.flush()
                    skill_records[sk_name] = s

                js = JobSkill(
                    job_id=j.id,
                    skill_id=s.id,
                    importance=imp,
                    weight=wt,
                    minimum_level=min_lvl,
                    required=True
                )
                db.add(js)

        # 10. Seed Career Paths
        cp_fe = CareerPath(
            name="Senior Frontend Engineer Roadmap",
            target_role="Senior Frontend Engineer",
            description="Milestone pathway transitioning from intermediate React development to production-grade architecture, performance optimization, and verified TypeScript mastery."
        )
        db.add(cp_fe)
        db.flush()

        fe_steps = [
            ("React", 1, "Completed", "Core component architecture & hooks mastery", "Advanced"),
            ("JavaScript", 2, "Completed", "Deep event loop, asynchronous concurrency, and closures", "Advanced"),
            ("Tailwind CSS", 3, "Completed", "Responsive utility design and accessible layout primitives", "Advanced"),
            ("TypeScript", 4, "In Progress", "Generics, utility types, and strict type safety", "Advanced"),
            ("Next.js", 5, "Next Step", "App Router, Server Components, and Edge Middleware", "Intermediate"),
            ("Performance Optimization", 6, "Upcoming", "Core Web Vitals, code splitting, and bundle analysis", "Advanced"),
        ]

        for sk_name, order, duration, desc, req_lvl in fe_steps:
            s = skill_records.get(sk_name)
            if s:
                step = CareerPathStep(
                    career_path_id=cp_fe.id,
                    skill_id=s.id,
                    step_order=order,
                    estimated_duration=duration,
                    description=desc,
                    required_level=req_lvl
                )
                db.add(step)

        cp_fs = CareerPath(
            name="Full Stack Developer Roadmap",
            target_role="Full Stack Developer",
            description="Pathway expanding frontend core competence into backend microservices, SQL databases, and cloud containerization."
        )
        db.add(cp_fs)
        db.flush()

        fs_steps = [
            ("React", 1, "Completed", "Interactive UI frontend foundation", "Advanced"),
            ("Node.js", 2, "In Progress", "Express/Fastify backend API development and middleware", "Advanced"),
            ("PostgreSQL", 3, "Upcoming", "Relational database schema modeling, indexing, and queries", "Intermediate"),
            ("REST APIs", 4, "In Progress", "Secure token authentication and API contract design", "Advanced"),
            ("Docker", 5, "Upcoming", "Containerization and multi-stage production builds", "Intermediate"),
        ]

        for sk_name, order, duration, desc, req_lvl in fs_steps:
            s = skill_records.get(sk_name)
            if s:
                step = CareerPathStep(
                    career_path_id=cp_fs.id,
                    skill_id=s.id,
                    step_order=order,
                    estimated_duration=duration,
                    description=desc,
                    required_level=req_lvl
                )
                db.add(step)

        # 11. Seed Technical Skill Assessments with Questions
        assessments_data = [
            {
                "skill": "TypeScript",
                "title": "TypeScript Advanced Type System Assessment",
                "description": "Proctored assessment covering mapped types, conditional types, generic constraints, and discriminated unions.",
                "difficulty": "Advanced",
                "time_limit": 20,
                "passing_score": 75,
                "questions": [
                    {
                        "type": "multiple_choice",
                        "prompt": "Which TypeScript utility type constructs a type with all properties of T set to optional?",
                        "options": ["Required<T>", "Partial<T>", "Readonly<T>", "Record<K, T>"],
                        "correct": 1,
                        "points": 25
                    },
                    {
                        "type": "multiple_choice",
                        "prompt": "How do you enforce that a generic type parameter T must have an 'id' property of type string?",
                        "options": ["<T extends { id: string }>", "<T implements { id: string }>", "<T : { id: string }>", "<T with { id: string }>"],
                        "correct": 0,
                        "points": 25
                    },
                    {
                        "type": "code_challenge",
                        "prompt": "Write a TypeScript type 'DeepReadonly<T>' that recursively makes all nested object properties readonly.",
                        "code_snippet": "type DeepReadonly<T> = T extends Function ? T : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;",
                        "points": 50
                    }
                ]
            },
            {
                "skill": "React",
                "title": "React 18 Concurrent Rendering & Hooks Mastery",
                "description": "Evaluation of hooks lifecycle, memoization rules, custom state hooks, and useTransition.",
                "difficulty": "Advanced",
                "time_limit": 15,
                "passing_score": 80,
                "questions": [
                    {
                        "type": "multiple_choice",
                        "prompt": "When should you prefer useTransition over standard setState in React 18?",
                        "options": [
                            "To mark state updates as non-urgent transitions that do not block user typing or animations",
                            "To force synchronous DOM layout reads",
                            "To execute network fetch requests inside render",
                            "To replace useEffect entirely"
                        ],
                        "correct": 0,
                        "points": 50
                    },
                    {
                        "type": "multiple_choice",
                        "prompt": "Why is useCallback used when passing callback functions to memoized child components?",
                        "options": [
                            "It avoids recreating the function reference on every parent render, preserving child React.memo optimization",
                            "It guarantees the function runs in a background web worker",
                            "It automatically catches unhandled promise rejections",
                            "It speeds up initial bundle download"
                        ],
                        "correct": 0,
                        "points": 50
                    }
                ]
            },
            {
                "skill": "JavaScript",
                "title": "JavaScript Event Loop & Concurrency Assessment",
                "description": "Tests asynchronous task queue execution, microtasks vs macrotasks, and closures.",
                "difficulty": "Intermediate",
                "time_limit": 15,
                "passing_score": 75,
                "questions": [
                    {
                        "type": "multiple_choice",
                        "prompt": "In the JavaScript event loop, in what order do Microtasks (Promise.then) and Macrotasks (setTimeout) execute?",
                        "options": [
                            "All pending microtasks are drained before the next macrotask is processed from the queue",
                            "Macrotasks always take priority over microtasks",
                            "They execute in strictly alternating round-robin order",
                            "Microtasks only run when the browser window loses focus"
                        ],
                        "correct": 0,
                        "points": 50
                    },
                    {
                        "type": "multiple_choice",
                        "prompt": "What is the result of typeof NaN in JavaScript?",
                        "options": ["'number'", "'nan'", "'undefined'", "'object'"],
                        "correct": 0,
                        "points": 50
                    }
                ]
            }
        ]

        for a_data in assessments_data:
            s = skill_records.get(a_data["skill"])
            if s:
                sa = SkillAssessment(
                    skill_id=s.id,
                    title=a_data["title"],
                    description=a_data["description"],
                    difficulty=a_data["difficulty"],
                    time_limit_minutes=a_data["time_limit"],
                    passing_score=a_data["passing_score"]
                )
                db.add(sa)
                db.flush()

                for q_info in a_data["questions"]:
                    aq = AssessmentQuestion(
                        assessment_id=sa.id,
                        question_type=q_info["type"],
                        prompt=q_info["prompt"],
                        code_snippet=q_info.get("code_snippet"),
                        options=q_info.get("options"),
                        correct_option_index=q_info.get("correct"),
                        points=q_info["points"]
                    )
                    db.add(aq)

        db.commit()
        print("Database seeded successfully with all entities, jobs, skills, and assessments!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
