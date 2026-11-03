### What is Next.js and Why Use it



Perfect. Let's change our approach a little. Since you already know React, we won't learn Next.js as an entirely new technology. We'll learn Next.js by comparing everything with the React + Vite development you've already done.

Whenever we introduce a new concept, we'll ask:

1. How do we do this in React?
2. How does Next.js do it?
3. Why does Next.js provide this feature?
4. When should we use it?

We'll also maintain proper notes that you can save in your GitHub repository.

# Lesson 01 – Introduction to Next.js

## 1. What exactly is Next.js?

First, let's understand what we already have.

You use React to build applications. React provides:

- Components
- Props and State
- Hooks
- Context API
- Component-based UI
- Virtual DOM
- Event handling

But React itself doesn't provide everything needed to build a complete web application.

For example, React doesn't have its own official routing system, built-in backend API system, or complete server-rendering framework.

We install additional libraries and tools to handle these requirements.

That's where Next.js comes in.

Next.js is a React framework that provides additional tools and features to build complete web applications, including routing, server-side rendering, data fetching, backend endpoints and optimizations.

Think about it this way:

## React + Vite

You assemble the tools you need.

React

Vite

React Router

Axios

Express

SEO setup

## Next.js

A framework that provides many of these capabilities together.

[Telemetry | Next.js by Vercel - The React Framework](https://images.openai.com/static-rsc-4/JN4FNWLKryVhoosX9FoROWM0aEliEzdkUDEXmWQ-5rSoMtCfpZLjSYarwKMlSqsIeYP7Lc2kXezwSSTRBH6LC7M7VrLUGBSye8-dBm7evq0PZkx-odBCf0M-H-Ejh1WClgfajjRaZPcsXwomA1AHaK1YrujpR1_V-YdFCKHUrkc?purpose=inline)

Next.js Framework

Built on top of React

Routing · Rendering · Data Fetching · API · Optimization

One important clarification: Next.js doesn't mean you no longer need Express, Axios or other libraries. It provides alternatives for some use cases, but you can still use them when appropriate.

## 2. Why do we need Next.js when we already have React?

Let's take an example from your LMS project.

Imagine your LMS has these pages:

- Home page
- Browse courses
- Course details
- Student dashboard
- Instructor dashboard
- Admin dashboard

You built this using React + Vite.

Everything works, right? So why would someone choose Next.js?

There are a few important reasons.

### Reason 1: SEO (Search Engine Optimization)

Suppose someone searches Google for:

`Best React courses for beginners`

You want your LMS course page to appear in Google results.

With a typical React + Vite application:

The browser receives a basic HTML document and JavaScript files. React then renders the page in the browser.

Google can process JavaScript, but it may require additional rendering and indexing work.

With Next.js:

The server can generate HTML containing the page content before sending it to the browser.

This makes the initial content available in the HTML and can make search engine indexing easier.

For example:

```
React + Vite:

Browser
   ↓
HTML + JavaScript
   ↓
React executes
   ↓
Course content appears


Next.js (SSR):

Next.js Server
   ↓
Fetch course data
   ↓
Generate HTML
   ↓
Browser receives HTML
   ↓
Course content appears
```

This is particularly useful for public-facing pages such as:

- Course listings
- Product pages
- Blogs
- Landing pages
- Documentation

### Reason 2: Built-in routing

In your React + Vite application, you probably use React Router.

For example:

```
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

In Next.js, using the App Router, routing is based on folders and files.

```
app/
│
├── page.tsx
│
├── courses/
│   └── page.tsx
│
└── about/
    └── page.tsx
```

That's it!

| React Router                | Next.js                |
| --------------------------- | ---------------------- |
| `<Route path="/" />`        | `app/page.tsx`         |
| `<Route path="/courses" />` | `app/courses/page.tsx` |
| `<Route path="/about" />`   | `app/about/page.tsx`   |

This is called File-System Based Routing.

### Reason 3: Backend capabilities

In your existing MERN application, you have:

```
Frontend (React + Vite)
        |
        | Axios API requests
        ↓
Backend (Node + Express)
        |
        ↓
MongoDB
```

You maintain separate frontend and backend applications.

Next.js also provides backend functionality through Route Handlers.

For example:

```
Next.js Application
       |
       ├── Frontend UI
       |
       ├── Server Components
       |
       ├── Route Handlers
       |
       └── Database communication
```

You can create an API endpoint inside the Next.js project itself.

Example:

`app/api/users/route.ts`

```
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Users fetched successfully",
  });
}
```

This creates a GET endpoint at:

`/api/users`

So, for many applications, you can build both frontend and backend using Next.js.

However, Next.js doesn't force you to replace an existing Express backend. You can continue using Node + Express with Next.js as your frontend framework.

### Reason 4: Rendering flexibility

This is probably the biggest technical difference we'll explore.

In your React + Vite application, you generally work with Client-Side Rendering (CSR).

In Next.js, you get multiple rendering options:

| Rendering | When HTML is generated                                                        |
| --------- | ----------------------------------------------------------------------------- |
| CSR       | In the browser                                                                |
| SSR       | On the server for a request                                                   |
| SSG       | Ahead of time during build                                                    |
| ISR       | Static content can be regenerated after a configured interval or revalidation |

For example, think about your LMS:

| Page                 | Suitable approach                  |
| -------------------- | ---------------------------------- |
| Public home page     | Static rendering                   |
| Course details       | Static or dynamic server rendering |
| Student dashboard    | Dynamic rendering                  |
| Instructor dashboard | Dynamic rendering                  |

The important thing is that you can choose different rendering strategies for different pages.

### Reason 5: Built-in optimizations

Next.js provides several features that otherwise may require additional configuration or libraries.

| Feature            | React + Vite                         | Next.js        |
| ------------------ | ------------------------------------ | -------------- |
| Image optimization | Configure separately                 | `next/image`   |
| Font optimization  | Configure separately                 | `next/font`    |
| Metadata / SEO     | Additional setup                     | Metadata API   |
| File-based routing | React Router or another router       | Built-in       |
| Server rendering   | Additional solution needed           | Built-in       |
| API endpoints      | Separate backend or another solution | Route Handlers |

## 3. Important distinction: React vs Vite vs Next.js

I want you to understand this properly because many beginners confuse these three.

[File:React.svg - Wikimedia Commons](https://images.openai.com/static-rsc-4/7xLwZ4scX4fnuMMhGGC1cqLT77iXYre5xJdgpd7WX1KQ_p3g1RPDF7yr_WadpTqTOOQqdyWXwfoJZwqVjziB4ZjkWfqXFUA5ZzmEP0gz1yPlo8186Lx7bp_RlOKNJMYunWYIIcau9pEjVKeCiiL7F2AY3pRccI_LGvBv9WXSfHU?purpose=inline)

React

UI library

Helps you build user interfaces using components, state, props and hooks.

[Vite Logo PNG,  Vector (AI, EPS, CDR, PDF, SVG) - iconLogoVector](https://images.openai.com/static-rsc-4/3z0Km4avLxM07hDPhEKDfS7e7PZ2lL2d3cwaKeEzgNJv9dyl98qGYk571u4SaDifiikdYK2hz1shWLZ9XF_Yxb2nSviCVF-CT-lxbC7LskalbJ4GtZ76GhzgB_MZk2WTQc3IigAMSX0g3wNU9KhgeUkOGefHiGbg1uJSTHBED1E?purpose=inline)

Vite

Build tool and development server

Helps you develop, bundle and build your frontend application.

[Next.js Sanity CMS Starter | Schema UI Starter](https://images.openai.com/static-rsc-4/DSDkG6Hirfu5BDCL-4UrHQ7DwjZ2ICRXoXBJZodx7lF0NWIKujGOKmdKCzjFsAXzKfOfLQgFETXH3p2TWEOJQuxKK5F1Hf2CeKULeun1PhpDQ_GaDckzv0o3gfga9pro7MmYE9AoIdrdXk1ZCAl-WmwnamWSYW9SF6jJKrgLaqo?purpose=inline)

Next.js

React framework

Provides an application structure, routing, rendering, server capabilities and optimizations.

A simple way to remember:

- React = Building the UI.
- Vite = Developing and building the application.
- Next.js = A framework that organizes and provides more capabilities for the whole application.

Next.js uses its own build and development tooling, so you don't normally set up Vite separately in a Next.js project.

## 4. Does every React developer need to learn Next.js?

No. React + Vite is still an excellent choice.

Let's understand when to use each.

| Requirement                | My recommendation                   |
| -------------------------- | ----------------------------------- |
| Admin dashboard            | React + Vite                        |
| Internal management system | React + Vite                        |
| Public e-commerce website  | Next.js                             |
| SEO-focused blog           | Next.js                             |
| Marketing website          | Next.js                             |
| Full-stack web application | Either, depending on requirements   |
| Existing MERN application  | No need to migrate just for Next.js |

For example, your LMS has both public course pages and private student/instructor dashboards. Next.js could be a good choice if you're building a new version and want server rendering and SEO capabilities.

But your existing MERN LMS doesn't need to be rewritten just because Next.js exists.

## 5. The biggest thing to remember

Next.js is not a replacement for React.

In fact:

- Next.js uses React components.
- You still write JSX and TSX.
- You still use props.
- You still use `useState` and `useEffect` in Client Components.
- You still use JavaScript or TypeScript.
- You still work with APIs and databases.

The difference is how the application is structured and where different parts of the application execute.

For example:

```
React + Vite
    |
    ├── React components
    ├── React Router
    ├── Axios
    ├── Redux
    └── Express backend (separate)

Next.js
    |
    ├── React components
    ├── Built-in App Router
    ├── Server Components
    ├── Client Components
    ├── Server-side data fetching
    ├── Route Handlers
    └── Rendering optimizations
```

One important detail: Next.js Server Components are not simply the same thing as SSR. Server Components determine where component code executes, while SSR and static rendering describe how HTML is produced. We'll study this distinction separately.

# 6. Our actual notes – Lesson 01

These are the points worth saving in your `notes/01-introduction.md`.

01 – Introduction to Next.js

Notes

Definition

Next.js is a React framework used to build full-stack web applications. It provides features such as file-based routing, server-side rendering, static rendering, data fetching, API endpoints and performance optimizations.

Why Next.js?

1. Built-in routing.
2. SEO-friendly rendering capabilities.
3. Server-side rendering and static generation.
4. Backend functionality through Route Handlers.
5. Image, font and performance optimizations.
6. Integrated application structure.

React vs Vite vs Next.js

| Technology | Purpose         |
| ---------- | --------------- |
| React      | UI library      |
| Vite       | Build tool      |
| Next.js    | React framework |

Key takeaway

Next.js is built on React. We don't stop writing React code when we start using Next.js. We get additional framework capabilities around React.

&#x20;Copy notes

## 7. Before moving forward – one question

I want to make sure this fundamental difference is clear.

Imagine you're developing an e-commerce website.

You have a product page displaying product name, price, description and images.

Why might Next.js be a better choice than a typical React + Vite setup for this page?

Explain it in your own words. Don't worry about giving a perfect answer.

After that, we'll move to Lesson 02: Creating a Next.js + TypeScript project and understanding its folder structure.












### next.js folder structure compare to the MERN 

Let's understand this using your existing MERN LMS project. That will make Next.js folder structure much easier because you already know how we organize React, Express, controllers, models, routes and middleware.

The biggest difference is:

In MERN, we generally maintain separate frontend and backend applications. In Next.js, frontend and backend capabilities can live inside one Next.js application.

# Lesson 02 – Next.js Folder Structure vs MERN

## 1. First, your familiar MERN structure

A typical MERN application might look like this:

my-lms/

&#x20;client/

React + Vite

src/

components/

pages/

layouts/

redux/

hooks/

services/

App.tsx

main.tsx

public/

package.json

Frontend application

&#x20;server/

Node + Express

controllers/

models/

routes/

middlewares/

services/

config/

utils/

app.js

server.js

package.json

Backend application

docker-compose.yml

README.md

You already understand this architecture:

- `client` handles UI.
- `server` handles backend logic.
- `controllers` handle incoming requests.
- `models` define MongoDB schemas.
- `routes` define API endpoints.
- `middlewares` handle authentication, validation, etc.

Now let's see how Next.js organizes things.

## 2. Next.js folder structure

Let's create a hypothetical project called `nextjs-lms`.

nextjs-lms/

Single application

&#x20;app/

Most important

layout.tsx

page.tsx

globals.css

loading.tsx

error.tsx

not-found.tsx

Routing and application UI

courses/

page.tsx

[courseId]/

page.tsx

dashboard/

page.tsx

api/

courses/

route.ts

&#x20;components/

Navbar.tsx

Footer.tsx

CourseCard.tsx

&#x20;lib/

db.ts

utils.ts

auth.ts

models/

services/

hooks/

store/

public/

types/

next.config.ts

tsconfig.json

package.json

This is an example structure, not a mandatory structure. Next.js gives you conventions for certain files and folders, while you decide how to organize the rest.

## 3. Let's compare the important folders one by one

### A. `app/` – The heart of Next.js

This is where Next.js App Router works.

In React + Vite, you might have:

```
src/
  App.tsx
  main.tsx
  pages/
```

In Next.js:

```
app/
  layout.tsx
  page.tsx
  courses/
    page.tsx
```

The important files:

| File            | Purpose                      |
| --------------- | ---------------------------- |
| `page.tsx`      | Defines a page/route         |
| `layout.tsx`    | Shared UI around child pages |
| `loading.tsx`   | Loading UI                   |
| `error.tsx`     | Error UI                     |
| `not-found.tsx` | Not-found UI                 |
| `route.ts`      | API endpoint                 |

For example:

```
app/
  page.tsx
  about/
    page.tsx
  courses/
    page.tsx
```

Produces:

| File                   | URL        |
| ---------------------- | ---------- |
| `app/page.tsx`         | `/`        |
| `app/about/page.tsx`   | `/about`   |
| `app/courses/page.tsx` | `/courses` |

Notice something interesting: we don't need React Router to define these routes.

### B. `components/` – Same as React

You already know this.

```
components/
  Navbar.tsx
  Footer.tsx
  CourseCard.tsx
  Button.tsx
```

We create reusable React components here.

Example:

```
export default function CourseCard() {
  return (
    <div>
      <h2>React Masterclass</h2>
      <p>Learn React from scratch</p>
    </div>
  );
}
```

One important thing: components outside `app/` are not automatically routes. They are just reusable components.

### C. `models/` – Similar to your Express backend

In your MERN backend, you have:

```
server/
  models/
    User.model.js
    Course.model.js
    Payment.model.js
```

In Next.js, you can maintain a similar structure:

```
models/
  User.ts
  Course.ts
  Payment.ts
```

For example, you can define Mongoose schemas and connect to MongoDB from your Next.js server-side code.

### D. `lib/` – Shared server-side utilities

This is a commonly used folder in Next.js projects.

Example:

```
lib/
  db.ts
  auth.ts
  utils.ts
```

Possible responsibilities:

- `db.ts` – Database connection.
- `auth.ts` – Authentication helpers.
- `utils.ts` – Reusable utility functions.

Think of it as a place for shared application logic, not a special Next.js folder.

### E. `app/api/` – Your Express routes equivalent

This is particularly important for understanding the MERN comparison.

In Express:

```
// routes/user.routes.js

router.get("/users", getUsers);
```

In Next.js:

```
app/
  api/
    users/
      route.ts
```

Inside `route.ts`:

```
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Users fetched successfully",
  });
}
```

This creates:

```
GET /api/users
```

Similarly, you can export:

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`

These are called Route Handlers.

One distinction: `route.ts` is for HTTP endpoints, while `page.tsx` is for UI pages.

## 4. MERN vs Next.js – Complete mapping

This is the most useful comparison to save in your notes.

| MERN (Express)          | Next.js equivalent                                                            |
| ----------------------- | ----------------------------------------------------------------------------- |
| `client/src/pages`      | `app/.../page.tsx`                                                            |
| React Router            | App Router                                                                    |
| `client/src/components` | `components/`                                                                 |
| `server/models`         | `models/`                                                                     |
| `server/controllers`    | `controllers/` or `services/`                                                 |
| `server/routes`         | `app/api/.../route.ts`                                                        |
| `server/middlewares`    | `middleware.ts` / `proxy.ts` and other server utilities, depending on purpose |
| `server/config`         | `lib/` or `config/`                                                           |
| `server/utils`          | `lib/` or `utils/`                                                            |
| Redux store             | `store/`                                                                      |
| React hooks             | `hooks/`                                                                      |
| `.env`                  | `.env.local`                                                                  |

Important: These are conceptual equivalents, not exact one-to-one replacements. You can still maintain separate controllers, services, models and middleware folders in Next.js.

## 5. What about `layout.tsx`?

This is another important concept.

In your React application, you might have:

```
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Your routes */}
      </Routes>
      <Footer />
    </>
  );
}
```

In Next.js, we use `layout.tsx` for shared layouts.

```
// app/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

Here, `children` represents the current page or nested layout.

For example:

```
app/
  layout.tsx
  page.tsx
  about/
    page.tsx
```

Both the home page and about page use the root layout.

You can also create nested layouts, such as a separate dashboard layout.

## 6. A few files you should recognize

| File             | Purpose                                |
| ---------------- | -------------------------------------- |
| `package.json`   | Dependencies and scripts               |
| `next.config.ts` | Next.js configuration                  |
| `tsconfig.json`  | TypeScript configuration               |
| `.env.local`     | Local environment variables            |
| `public/`        | Static assets                          |
| `node_modules/`  | Installed packages                     |
| `.next/`         | Generated build and development output |

A useful distinction:

- `public/` is similar to the public folder in Vite.
- `.next/` is generated by Next.js; you generally don't edit it manually.
- `next.config.ts` contains Next.js-specific configuration.

# 7. Final understanding

MERN architecture

React + Vite

UI, components, routing

HTTP requests

Express + Node.js

Routes, controllers, middleware, services

MongoDB

Next.js architecture

Next.js Application

Frontend

Pages, components, layouts

Backend

Route handlers, services

MongoDB

The Next.js architecture can still use an external backend and database. It simply gives you the option to keep more functionality within one application.

# 8. Notes for GitHub

Save this as `notes/02-folder-structure.md`.

Lesson 02 – Next.js Folder Structure

1\. `app/` – Main directory for App Router, pages, layouts and route handlers.

2\. `components/` – Reusable UI components.

3\. `models/` – Database schemas, such as Mongoose models.

4\. `lib/` – Shared utilities, database connections and authentication helpers.

5\. `hooks/` – Custom React hooks.

6\. `store/` – Redux or other global state management.

7\. `public/` – Static assets.

8\. `app/api/` – Backend HTTP endpoints using Route Handlers.

Important files:

- `page.tsx` – Page component.
- `layout.tsx` – Shared layout.
- `loading.tsx` – Loading UI.
- `error.tsx` – Error UI.
- `route.ts` – API endpoint.

Key takeaway: Unlike a typical MERN project, Next.js can combine frontend and backend functionality inside a single application. Its folder structure is convention-based, especially inside `app/`.

&#x20;Copy notes

## 9. Check your understanding

1\. Which file creates a UI route in Next.js?

route.ts

page.tsx

layout.tsx

Incorrect. page.tsx defines a UI route.

2\. What is the equivalent of an Express GET endpoint in Next.js?

app/api/users/route.ts

app/users/page.tsx

components/users.tsx

Correct! route.ts handles HTTP requests.

3\. Where do we generally put reusable UI components?

models/

components/

public/

Correct! components/ is used for reusable UI components.

Score: 2/3

Retry

Next lesson: Let's create our actual Next.js + TypeScript project using `npx create-next-app` and understand every generated file, including `layout.tsx`, `page.tsx`, `globals.css`, `next.config.ts` and `tsconfig.json`. We'll learn by running the project, not just reading its structure.