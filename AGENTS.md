# AGENTS.md

## Project: College Club Event Management Website

This file contains the permanent development rules for this project.

You are the AI development agent working with the project owner. Read and follow this file before making changes.

The goal is to build a simple, professional, responsive, secure, and deployable college club event-management website while keeping the code understandable enough for the project owner to study and maintain.

---

## 1. CORE PROJECT GOAL

Build one coherent application with two sides.

### Student/User Side
- Home
- Events
- Event details
- Event registration

### Admin Side
- Admin login
- Dashboard
- Event management
- Registration management

Do not add major features outside this scope unless the project owner explicitly requests them.

---

## 2. FIXED TECHNOLOGY STACK

Preferred stack:

- HTML / JSX
- JavaScript
- React
- Vite
- React Router
- Plain CSS
- CSS variables where useful
- Supabase
- PostgreSQL through Supabase
- Supabase Authentication
- Supabase Storage when needed
- GitHub
- Vercel

Do not replace the stack without asking first.

---

## 3. DEPENDENCY RULE

Keep dependencies minimal.

Do NOT install a new package simply because it is convenient.

If a new package appears necessary:

1. Stop before installing it.
2. Explain what problem it solves.
3. Explain why the current stack cannot reasonably solve it.
4. Explain what the project owner would need to learn.
5. Explain any deployment or maintenance impact.
6. Ask for approval.
7. Install only after approval.

Never silently install libraries.

---

## 4. DESIGN DIRECTION

The visual direction is:

**Minimal + Professional**

Prioritize:
- Clean layouts
- Strong typography
- Clear hierarchy
- Consistent spacing
- Professional colors
- Simple navigation
- Clear buttons
- Good readability
- Responsive layouts
- Subtle, purposeful animations

Avoid:
- Excessive gradients
- Excessive animations
- Too many colors
- Unnecessary decoration
- Overloaded cards
- Huge sections with little useful information
- Effects that reduce usability

Do not turn the website into a flashy template.

---

## 5. CSS RULE

Use Plain CSS.

Prefer:
- Component-specific CSS where appropriate
- CSS variables for repeated values
- Clear class names
- Responsive media queries
- Reusable design tokens

Do not introduce Tailwind, Bootstrap, Material UI, or another styling framework without approval.

---

## 6. SIMPLE CODE RULE

The project owner is learning while building this application.

Code must prioritize:

1. Readability
2. Simplicity
3. Correctness
4. Maintainability
5. Security
6. Performance

Do not use complicated patterns just to make the project look advanced.

Prefer straightforward JavaScript and React.

Use meaningful names such as:
- event
- events
- registration
- registrations
- eventId
- handleSubmit
- handleDelete

Avoid meaningless names such as x, abc, temp, thing, data2 unless genuinely appropriate for a tiny local context.

---

## 7. DO NOT OVERENGINEER

If a simple solution is sufficient, use it.

Do not introduce unnecessary:
- State-management libraries
- Abstraction layers
- Custom frameworks
- Services
- APIs
- Database tables
- Components

The goal is a reliable application, not maximum technical complexity.

---

## 8. APPLICATION STRUCTURE

Expected public routes:

- /
- /events
- /events/:id
- /register/:id

Expected admin routes:

- /admin/login
- /admin
- /admin/events
- /admin/registrations

Use React Router.

Do not create unnecessary routes.

---

## 9. STUDENT SIDE

### Home

Approximately:

Navbar
→ Club introduction / Hero
→ Featured event
→ Upcoming events
→ Explore events
→ Footer

Purpose:

Club introduction → important event → upcoming events → event discovery.

Do not overload Home.

### Events

Include:
- Page heading
- Search by event name
- Category filter
- Event cards

Each card:
- Event name
- Date
- Time
- Venue
- Short description
- View details / Register action

### Event Details

Show:
- Event name
- Category
- Date
- Time
- Venue
- Full description
- Registration information
- Register button

### Registration

Fields:
- Name
- Email
- College
- Year
- Phone number

Show a clear success state after successful registration.

---

## 10. ADMIN SIDE

### Admin Login

Use Supabase Authentication.

Never create a custom password system in frontend code.

### Dashboard

Keep it simple:
- Total events
- Upcoming events
- Total registrations

### Event Management

Admin can:
- Add event
- View events
- Edit event
- Delete event

### Registration Management

Admin can:
- View registrations
- Search registrations
- Filter registrations

Do not add unnecessary admin functionality without approval.

---

## 11. DATABASE

Keep the initial database simple.

### events

Expected fields:
- id
- title
- category
- description
- date
- start_time
- venue
- image_url
- created_at
- updated_at

### registrations

Expected fields:
- id
- event_id
- name
- email
- college
- year
- phone
- created_at

Relationship:

One event → many registrations.

Do not add database fields or tables without a reason.

If the database structure needs a significant change, ask first.

---

## 12. DATABASE SECURITY

Use Supabase Row Level Security (RLS).

Conceptually:

Student:
- Read events
- Create registration

Student must NOT:
- Create events
- Edit events
- Delete events
- Read all registrations

Admin:
- Create events
- Read events
- Update events
- Delete events
- Read registrations

Database authorization must enforce these rules.

Do not treat hidden frontend pages as security.

---

## 13. SECRETS AND ENVIRONMENT VARIABLES

Never put secrets directly into source code.

Never commit:
- .env
- .env.local
- Database passwords
- Supabase service-role keys
- Private API keys
- Authentication secrets

Use environment variables.

Only frontend-safe variables should use the VITE_ prefix.

Never expose the Supabase service-role key in frontend code.

Configure production variables in Vercel.

---

## 14. NO LOCALHOST IN PRODUCTION

Localhost is allowed for development.

Production code must not depend on:
- http://localhost:3000
- http://localhost:4000
- http://localhost:5173
- Any other development-only URL

Do not hardcode local API URLs into production logic.

---

## 15. ADMIN SECURITY

Do not protect /admin only by hiding a button.

Admin access must use:
1. Authentication
2. Authorization
3. Database security / RLS

Conceptually:

Authenticated?
→ Authorized admin?
→ Dashboard

Otherwise deny access.

---

## 16. FORM VALIDATION

Validate:
- Name required
- Email valid
- College required
- Year valid
- Phone valid

Show clear validation messages.

Do not rely exclusively on frontend validation for important security or data-integrity rules.

---

## 17. DUPLICATE REGISTRATION

Prevent accidental duplicate registration for the same event according to the project's registration policy.

Conceptually:

Student submits
→ Check existing registration
→ Already registered?
  - Yes → Show appropriate message
  - No → Create registration

Where appropriate, enforce important uniqueness rules at database level.

---

## 18. UI STATES

Data-driven pages should handle:

- Loading
- Success
- Empty
- Error

Examples:

Loading:
"Loading events..."

Empty:
"No upcoming events."

Error:
"Unable to load events."
"Try Again"

Never leave users with a blank page when data is loading or unavailable.

---

## 19. RESPONSIVE DESIGN

The website must work on:
- Mobile
- Tablet
- Laptop
- Desktop

Check:
- Navbar
- Event cards
- Search/filter controls
- Forms
- Buttons
- Images
- Dashboard
- Tables
- Spacing
- Text wrapping

Do not simply shrink desktop layouts.

Design sensible mobile behavior.

---

## 20. ACCESSIBILITY

Use semantic HTML.

Examples:
- button for actions
- anchor/link for navigation
- logical heading order
- labels associated with form fields
- useful alt text for meaningful images

Do not rely only on color to communicate important information.

Maintain readable contrast.

---

## 21. COMPONENT RULE

Create reusable components when repetition exists.

Possible components:
- Navbar
- Footer
- EventCard
- SearchBar
- Filter
- Button
- Modal

Do not create excessive tiny components.

Use components when they improve readability or reuse.

---

## 22. EXISTING CODE RULE

Before changing an existing file:

1. Read it.
2. Understand it.
3. Identify what the current task requires.
4. Make the smallest reasonable change.
5. Preserve existing functionality.

Do not rewrite working code simply because you prefer another style.

Do not refactor unrelated files during a feature task.

Necessary changes are allowed for:
- Real bugs
- Security issues
- Deployment issues
- Required architecture changes
- Changes required for the current feature

For a non-trivial existing-code change, explain:
- What changed
- Why
- What existing behavior was preserved

Avoid unnecessary changes.

---

## 23. DEVELOPMENT WORKFLOW

Do not build the whole project in one step.

Use:

PLAN
→ INSPECT
→ ASK IF NEEDED
→ IMPLEMENT ONE SMALL FEATURE
→ RUN
→ TEST
→ FIX
→ EXPLAIN
→ COMMIT
→ NEXT FEATURE

Do not combine unrelated major features unless explicitly requested.

---

## 24. PLANNING GATE

For any significant feature:

1. Read this AGENTS.md.
2. Inspect relevant existing files.
3. Explain your understanding.
4. Give the implementation plan.
5. List files you intend to create/change.
6. Mention any new dependency.
7. Mention architectural, database, authentication, or deployment impact.
8. Ask for approval if a significant decision is required.

Then wait for approval before implementation.

For small obvious implementation details that do not materially affect architecture, approval is not necessary.

---

## 25. MAJOR DECISIONS REQUIRE APPROVAL

Ask before changing:
- Framework
- Database architecture
- Authentication architecture
- Routing strategy
- Styling framework
- Major UI direction
- Deployment architecture
- Database schema significantly
- Adding a significant dependency
- Replacing a major existing implementation

Do not silently make major architectural decisions.

---

## 26. EXPLANATION STYLE

After implementation, provide:

### What changed
Important changes.

### Files changed
Files created or modified.

### How it works
Important logic.

### Testing
What was tested.

### Problems
Known issues or limitations.

Do not simply say "Done."

The project owner wants to understand the project.

---

## 27. NEVER HIDE ERRORS

If something fails, do not pretend it works.

Clearly report:
- Problem
- Likely cause
- What was checked
- What was changed
- What remains unresolved

Never invent:
- APIs
- Database fields
- Credentials
- Routes
- Files
- Configuration
- Test results

If uncertain about an important fact, say so and ask.

---

## 28. TESTING

Before considering a feature complete, check:
- Application starts
- Feature works
- Console errors
- Broken links
- Form validation
- Loading state
- Error state
- Empty state
- Responsive behavior
- Existing functionality

For database features additionally check:
- Data insertion
- Data retrieval
- Data update
- Data deletion where applicable
- Authentication
- Authorization
- RLS permissions

---

## 29. PRODUCTION BUILD

Before deployment:

npm run build

The production build must succeed.

Verify:
- Environment variables
- Supabase connection
- Routes
- Authentication
- RLS
- Registration
- Admin features
- Responsive UI

Development mode does not guarantee production success.

---

## 30. VERCEL DEPLOYMENT

Architecture:

GitHub
→ Vercel
→ React + Vite

Supabase:
- PostgreSQL
- Authentication
- Storage

Before production:
1. Confirm build succeeds.
2. Confirm production environment variables.
3. Confirm Supabase project.
4. Confirm RLS.
5. Confirm routes.
6. Test student flow.
7. Test admin flow.
8. Test registration.
9. Test mobile UI.

Ensure direct navigation to React routes works on Vercel.

---

## 31. GIT

Use meaningful commits.

Examples:
- Initial project setup
- Create global styles
- Add navbar
- Build home page
- Add events page
- Add event details
- Add registration form
- Connect Supabase
- Add admin authentication
- Add event CRUD
- Add registration management

Avoid meaningless messages such as:
- update
- final
- final2
- test
- changes

Commit stable milestones.

---

## 32. FEATURE DEVELOPMENT ORDER

Preferred order:

1. Project setup
2. Global CSS/design system
3. Navbar and Footer
4. Home page
5. Events page
6. Event details
7. Registration UI
8. Supabase setup
9. Events database
10. Connect events to database
11. Registration database
12. Connect registration
13. Admin authentication
14. Admin dashboard
15. Admin event CRUD
16. Admin registration management
17. Responsive testing
18. Security review
19. Production build
20. Vercel deployment

Do not jump ahead unnecessarily.

---

## 33. DO NOT CHANGE THE PROJECT'S "MOOD"

Maintain consistency throughout the project.

Do not suddenly change:
- Color system
- Typography
- Border radius
- Button style
- Card style
- Spacing
- Navigation
- Animation style
- Coding conventions

Every new feature should feel like part of the same application.

If a new design direction seems necessary, ask first.

---

## 34. PROJECT DECISIONS TO PRESERVE

Current decisions:

- Minimal + Professional UI
- Plain CSS
- React + Vite
- JavaScript
- React Router
- Supabase
- PostgreSQL
- Supabase Auth
- Vercel
- GitHub
- Simple readable code
- Minimal dependencies
- Ask before major decisions
- Avoid unnecessary changes

Do not silently reverse these decisions.

---

## 35. PRIORITY ORDER

When rules conflict, prioritize:

1. Security
2. Correctness
3. Existing approved architecture
4. Simplicity
5. Maintainability
6. User experience
7. Performance
8. Visual polish

Never sacrifice security merely to make implementation easier.

---

## 36. FINAL PRINCIPLE

The purpose of this project is not merely to generate code.

The purpose is to build a real application the project owner can understand.

Always aim for:

Simple
+
Readable
+
Consistent
+
Secure
+
Responsive
+
Tested
+
Deployable

Do not optimize for more code.

Optimize for the right code.

---

## CURRENT TASK RULE

At the beginning of every new task:

1. Read this file.
2. Inspect the current project.
3. Understand existing code before modifying it.
4. Identify what the task actually requires.
5. Do not make unrelated changes.
6. Ask before significant architectural decisions.
7. Implement only the requested scope.
8. Test the result.
9. Explain the result.

This rule applies throughout the entire lifetime of the project.
