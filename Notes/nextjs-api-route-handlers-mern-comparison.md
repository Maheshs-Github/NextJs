# Next.js API Route Handlers --- MERN / Express Comparison

> Learning notes for a developer familiar with React, Node.js, Express,
> MongoDB and Mongoose.
>
> Focus: Next.js App Router, TypeScript, Route Handlers, and the
> email-verification APIs built in this project.

------------------------------------------------------------------------

## 1. Big picture: Express vs Next.js

Both Express and Next.js can handle HTTP requests such as `GET`, `POST`,
`PATCH`, `PUT` and `DELETE`.

The main difference is how routes are registered.

### Express (MERN)

``` js
import express from "express";

const app = express();

app.use(express.json());

app.post("/api/register", (req, res) => {
  const { email, password } = req.body;

  return res.status(201).json({
    success: true,
    message: "Registered",
  });
});

app.listen(8000);
```

In Express:

-   We create an Express application.
-   We register routes using `app.get()`, `app.post()`, or an
    `express.Router()`.
-   `express.json()` parses incoming JSON request bodies.
-   The parsed data is available through `req.body`.
-   We send responses using `res.status().json()` or other response
    methods.
-   We start the server using `app.listen()`.

### Next.js App Router

File: `src/app/api/register/route.ts`

``` ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  return NextResponse.json(
    {
      success: true,
      message: "Registered",
    },
    { status: 201 }
  );
}
```

In Next.js App Router:

-   The folder structure defines the URL.
-   A `route.ts` file defines an HTTP endpoint.
-   Exported functions such as `GET`, `POST`, `PATCH`, `PUT` and
    `DELETE` handle their respective HTTP methods.
-   The incoming request uses the Web `Request` API.
-   `request.json()` reads and parses a JSON request body.
-   We return a `Response` or `NextResponse`.
-   Next.js manages the server; we do not call `app.listen()` in a Route
    Handler.

**Key idea:** An App Router `route.ts` file is the closest equivalent to
an Express route/controller endpoint. A `page.tsx` file is for UI, not
an API endpoint.

------------------------------------------------------------------------

## 2. How does the folder structure define the API URL?

Example:

``` text
src/
└── app/
    └── api/
        ├── register/
        │   └── route.ts
        ├── verify-email/
        │   └── route.ts
        └── users/
            └── route.ts
```

These files create the following endpoints:

  File                              URL
  --------------------------------- ---------------------
  `app/api/register/route.ts`       `/api/register`
  `app/api/verify-email/route.ts`   `/api/verify-email`
  `app/api/users/route.ts`          `/api/users`

The `api` folder is just a URL segment. The special filename is
`route.ts`.

### Important distinction

-   `page.tsx` → renders a page / UI.
-   `route.ts` → handles HTTP requests and returns HTTP responses.

For example:

``` text
src/app/verify-email/page.tsx
```

renders the verification page at `/verify-email`.

But:

``` text
src/app/api/verify-email/route.ts
```

handles the API request at `/api/verify-email`.

They are separate routes and can coexist.

------------------------------------------------------------------------

## 3. Why do we export `GET`, `POST`, etc.?

In Express, we write:

``` js
app.get("/api/users", handler);
app.post("/api/users", handler);
app.put("/api/users", handler);
app.delete("/api/users", handler);
```

In a Next.js Route Handler, we export functions named after HTTP
methods:

``` ts
export async function GET(request: Request) {
  // Handle GET request
}

export async function POST(request: Request) {
  // Handle POST request
}

export async function PUT(request: Request) {
  // Handle PUT request
}

export async function PATCH(request: Request) {
  // Handle PATCH request
}

export async function DELETE(request: Request) {
  // Handle DELETE request
}
```

Next.js looks at the incoming HTTP method and calls the matching
exported function.

Example: if the client sends a `POST` request to `/api/register`,
Next.js calls the exported `POST()` function in `register/route.ts`.

We do not need to write an Express-style route registration statement.

### Supported method exports

Common Route Handler methods are:

-   `GET`
-   `POST`
-   `PUT`
-   `PATCH`
-   `DELETE`
-   `HEAD`
-   `OPTIONS`

If a method is not implemented, Next.js handles it with a
`405 Method Not Allowed` response where applicable.

------------------------------------------------------------------------

## 4. What is `request: Request`?

Consider:

``` ts
export async function POST(request: Request) {
  // ...
}
```

`Request` is a standard Web API type. Next.js Route Handlers use the Web
Request and Response APIs.

The `request` parameter represents the incoming HTTP request.

It contains information such as:

-   Request body
-   HTTP method
-   URL
-   Headers
-   Other request metadata

It is not the same object as Express's `req`, although both represent an
incoming request.

In Next.js, the parameter name is not special. This also works:

``` ts
export async function POST(req: Request) {
  const body = await req.json();
}
```

The type `Request` is what matters; `request` or `req` is just the
variable name.

------------------------------------------------------------------------

## 5. Why `request.json()` instead of `req.body`?

### Express

``` js
app.use(express.json());

app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
});
```

Express needs JSON body-parsing middleware such as `express.json()` to
parse JSON request bodies and populate `req.body`.

### Next.js

``` ts
export async function POST(request: Request) {
  const { email, password } = await request.json();
}
```

The Web `Request` API provides the asynchronous `.json()` method. It
reads the request body and parses the JSON into a JavaScript value.

There is no need to install or configure Express's `express.json()`
middleware in a Next.js Route Handler.

### Why do we write `await`?

Reading the request body is asynchronous.

``` ts
const body = await request.json();
```

After it completes, `body` contains the parsed JavaScript value.

For example, if the client sends:

``` json
{
  "email": "mahesh@example.com",
  "password": "secret123"
}
```

Then:

``` ts
const body = await request.json();

console.log(body.email);
console.log(body.password);
```

### Important: the body is read once

Request body methods such as `json()`, `text()` and `formData()` consume
the body.

Do not normally call `request.json()` twice on the same request.

Prefer:

``` ts
const body = await request.json();
const { email, password } = body;
```

Also validate the parsed value. A request can contain invalid JSON or a
value with the wrong shape. `request.json()` does not automatically
validate your application's fields.

------------------------------------------------------------------------

## 6. `NextResponse.json()` vs Express `res.status().json()`

### Express

``` js
return res.status(201).json({
  success: true,
  message: "User created",
});
```

### Next.js

``` ts
return NextResponse.json(
  {
    success: true,
    message: "User created",
  },
  { status: 201 }
);
```

Both send a JSON response with an HTTP status code.

`NextResponse` is provided by `next/server`. Its static `.json()` method
creates a JSON HTTP response.

### Do we always need `NextResponse`?

No. The standard Web API `Response` also has a JSON helper:

``` ts
return Response.json(
  {
    success: true,
    message: "User created",
  },
  { status: 201 }
);
```

Use `NextResponse` when you need its Next.js-specific features, such as
certain cookie or redirect response helpers. For ordinary JSON
responses, either approach can work.

### Common status codes

  Status   Meaning                 Example
  -------- ----------------------- --------------------------
  `200`    OK                      Successful verification
  `201`    Created                 User registered
  `400`    Bad Request             Missing or invalid input
  `401`    Unauthorized            Authentication required
  `403`    Forbidden               User is not allowed
  `404`    Not Found               User does not exist
  `409`    Conflict                Email already registered
  `500`    Internal Server Error   Unexpected server error

The HTTP status is separate from a JSON field such as `success: true` or
`success: false`. Return the correct status as well as a useful response
body.

------------------------------------------------------------------------

## 7. Reading query parameters

Suppose the URL is:

``` text
/api/users?role=admin&page=2
```

In a Route Handler:

``` ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const role = searchParams.get("role");
  const page = searchParams.get("page");

  return Response.json({ role, page });
}
```

Express equivalent:

``` js
app.get("/api/users", (req, res) => {
  const role = req.query.role;
  const page = req.query.page;

  return res.json({ role, page });
});
```

Comparison:

  Express            Next.js Route Handler
  ------------------ ----------------------------
  `req.query.role`   `searchParams.get("role")`
  `req.query.page`   `searchParams.get("page")`

`URLSearchParams.get()` returns a string or `null`. Convert and validate
values such as page numbers before using them.

------------------------------------------------------------------------

## 8. Reading request headers

Headers carry metadata about a request, such as content type or
authorization information.

Next.js:

``` ts
export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");

  return Response.json({
    authorization,
    contentType,
  });
}
```

Express:

``` js
app.get("/api/example", (req, res) => {
  const authorization = req.headers.authorization;
});
```

In Next.js, `request.headers` is a standard `Headers` object. Use
`.get()` to read a header.

Header names are case-insensitive.

------------------------------------------------------------------------

## 9. Dynamic route parameters

Suppose we want an endpoint for one user:

``` text
/api/users/123
```

Create:

``` text
src/app/api/users/[id]/route.ts
```

Example:

``` ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return Response.json({ userId: id });
}
```

In current Next.js App Router versions, `params` is asynchronous, so we
await it.

Express equivalent:

``` js
app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  return res.json({ userId: id });
});
```

Comparison:

  Express           Next.js
  ----------------- ---------------------
  `req.params.id`   `(await params).id`

The `[id]` folder name creates the dynamic URL segment.

------------------------------------------------------------------------

## 10. Connecting MongoDB with a Route Handler

A Route Handler can use Mongoose just like an Express controller.

Example:

``` ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    const users = await UserModel.find();

    return NextResponse.json(
      { success: true, users },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
```

The order matters:

1.  Connect to the database.
2.  Execute the Mongoose query.
3.  Return the HTTP response.
4.  Catch and handle unexpected errors.

There is no Express `req`/`res` pair here, but Mongoose operations are
the same.

------------------------------------------------------------------------

## 11. Understanding `try`, `catch` and `async/await`

Example:

``` ts
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Perform asynchronous work
    await dbConnect();

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

-   `async` allows the function to use `await`.
-   `await` waits for a Promise to settle.
-   `try` contains code that may throw an error.
-   `catch` handles errors thrown inside the `try` block.

A malformed JSON body can cause `request.json()` to throw, so it is
sensible to handle that error.

Do not expose internal exception details, database credentials or stack
traces to clients. Log useful server-side details and return a safe
message.

------------------------------------------------------------------------

# Part 2 --- Understanding our email verification APIs

We have been implementing email verification using:

-   Next.js App Router
-   TypeScript
-   MongoDB
-   Mongoose
-   Resend
-   Node.js `crypto`

The intended flow is:

``` text
Registration API
      |
      v
Validate registration data
      |
      v
Generate original verification token
      |
      v
Hash token with SHA-256
      |
      v
Save hash and expiry in MongoDB
      |
      v
Send original token in email link using Resend
      |
      v
User clicks verification link
      |
      v
Verification page reads token
      |
      v
Verification API receives token
      |
      v
Hash received token and find matching user
      |
      v
Check expiry
      |
      v
Set isVerified = true and clear token fields
```

## 12. Registration API --- what happens?

Example endpoint:

``` text
POST /api/sign-up
```

A simplified Route Handler:

``` ts
export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    const { verifyCode, hashedCode, verifyExpiry } =
      generateVerificationCode();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      verifyCode: hashedCode,
      verifyExpiry,
      isVerified: false,
    });

    await newUser.save();

    // Send verification email with the original verifyCode.

    return NextResponse.json(
      { success: true, message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
```

### Important variables

  Variable                          Meaning
  --------------------------------- ----------------------------------------
  `username`, `email`, `password`   Data received from the client
  `verifyCode`                      Original random token
  `hashedCode`                      SHA-256 hash stored in the database
  `verifyExpiry`                    Expiration timestamp
  `hashedPassword`                  Hashed password stored in the database
  `newUser`                         New Mongoose User document

### Why do we save the hash, not the original token?

If someone gets access to the database, they should not be able to
directly use the stored verification token.

We send the original token to the user's email but store only its hash
in MongoDB.

------------------------------------------------------------------------

## 13. Understanding Node.js crypto

Node.js provides the built-in `crypto` module.

No additional npm package is needed.

``` ts
import crypto from "crypto";
```

### Generate a random token

``` ts
const verifyCode = crypto.randomBytes(32).toString("hex");
```

-   `randomBytes(32)` generates 32 cryptographically secure random
    bytes.
-   `.toString("hex")` converts those bytes into a hexadecimal string.
-   The resulting token is 64 hexadecimal characters long.

### Hash the token

``` ts
const hashedCode = crypto
  .createHash("sha256")
  .update(verifyCode)
  .digest("hex");
```

What each method does:

  Method                   Purpose
  ------------------------ -----------------------------------------
  `createHash("sha256")`   Creates a SHA-256 hash object
  `update(verifyCode)`     Supplies the token as input
  `digest("hex")`          Produces the final hash as a hex string

### Set token expiry

``` ts
const verifyExpiry = new Date(
  Date.now() + 10 * 60 * 1000
);
```

`Date.now()` returns the current timestamp in milliseconds.

`10 * 60 * 1000` means ten minutes in milliseconds.

The result is a JavaScript `Date` object.

------------------------------------------------------------------------

## 14. Sending the email using Resend

The original token is included in the verification URL.

``` ts
const verificationUrl =
  `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyCode}`;
```

Then send the email:

``` ts
const { data, error } = await resend.emails.send({
  from: "My App <onboarding@resend.dev>",
  to: [email],
  subject: "Verify your email",
  react: VerificationEmail({
    username,
    verificationUrl,
  }),
});
```

Important:

-   `from` is the sender address configured with Resend.
-   `to` is an array of recipient email addresses.
-   `subject` is the email subject.
-   `react` is the React Email template.
-   `verificationUrl` contains the original token, not the hash.

The API key must remain server-side. Never expose it through a
`NEXT_PUBLIC_` environment variable.

------------------------------------------------------------------------

## 15. Verification API --- what happens?

Endpoint:

``` text
POST /api/verify-email
```

The client sends:

``` json
{
  "token": "original-token-from-email"
}
```

The Route Handler:

``` ts
export async function POST(request: Request) {
  try {
    await dbConnect();

    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await UserModel.findOne({
      verifyCode: hashedToken,
      verifyExpiry: { $gt: new Date() },
      isVerified: false,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification link",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Verification failed",
      },
      { status: 500 }
    );
  }
}
```

### Why hash the received token again?

During registration:

``` text
Original token -> SHA-256 -> Database
```

During verification:

``` text
Original token from email -> SHA-256 -> Compare with database
```

Both hashes match only when the correct original token is supplied.

### What does `$gt` mean?

``` ts
verifyExpiry: { $gt: new Date() }
```

`$gt` is a MongoDB comparison operator meaning **greater than**.

This condition checks that the stored expiry date is later than the
current time.

Other useful MongoDB comparison operators:

  Operator   Meaning
  ---------- -------------------------------
  `$gt`      Greater than
  `$gte`     Greater than or equal
  `$lt`      Less than
  `$lte`     Less than or equal
  `$ne`      Not equal
  `$in`      Matches any value in an array

### Why clear the verification fields?

``` ts
user.verifyCode = undefined;
user.verifyExpiry = undefined;
```

After successful verification, the token should no longer be usable.

Then:

``` ts
user.isVerified = true;
await user.save();
```

We persist the updated document in MongoDB.

------------------------------------------------------------------------

## 16. Route Handler vs page component

These two files serve different purposes.

### Verification page

File:

``` text
src/app/verify-email/page.tsx
```

Its responsibility:

-   Read the token from the URL.
-   Show a loading state.
-   Call the verification API.
-   Display success or failure to the user.

### Verification API

File:

``` text
src/app/api/verify-email/route.ts
```

Its responsibility:

-   Receive the token.
-   Hash and validate it.
-   Check expiry.
-   Update the MongoDB user document.
-   Return a JSON response.

**Remember:** The page handles the UI; the API performs the server-side
verification.

------------------------------------------------------------------------

# Part 3 --- Quick Express-to-Next.js reference

  -----------------------------------------------------------------------------------------------
  Concept                 Express                    Next.js App Router
  ----------------------- -------------------------- --------------------------------------------
  GET route               `app.get()`                `export async function GET()`

  POST route              `app.post()`               `export async function POST()`

  Request body            `req.body`                 `await request.json()`

  Query params            `req.query`                `new URL(request.url).searchParams`

  Route params            `req.params.id`            `await params`

  Headers                 `req.headers`              `request.headers.get()`

  JSON response           `res.json()`               `Response.json()`

  Status + JSON           `res.status(201).json()`   `NextResponse.json(data, { status: 201 })`

  Router file             `user.routes.js`           `app/api/users/route.ts`

  Start server            `app.listen()`             Managed by Next.js
  -----------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# Part 4 --- Questions to check your understanding

Try answering these without looking at the notes.

### Q1. Why do we export `POST()` in Next.js instead of writing `app.post()` like Express?

### Q2. What is the difference between `request.json()` and `req.body`?

### Q3. Why do we use `await` with `request.json()`?

### Q4. What is the difference between `page.tsx` and `route.ts`?

### Q5. Why do we use `NextResponse.json()`?

### Q6. Why do we store the hashed verification token instead of the original token?

### Q7. What does this MongoDB condition mean?

``` ts
verifyExpiry: { $gt: new Date() }
```

### Q8. Why do we set these fields to `undefined` after verification?

``` ts
user.verifyCode = undefined;
user.verifyExpiry = undefined;
```

------------------------------------------------------------------------

## Part 5 --- Important production notes

Before deploying the verification flow, make sure to address these:

1.  Validate incoming request data (Zod can be used).
2.  Enforce unique email and username constraints at the database level.
3.  Handle Resend failures so users can request a new verification
    email.
4.  Add rate limiting to registration and resend endpoints.
5.  Check `isVerified` during login if unverified accounts must not log
    in.
6.  Avoid exposing verification tokens in logs.
7.  Use a production domain and HTTPS.
8.  Consider atomic token consumption to prevent concurrent reuse.

The code snippets above are learning examples; add these protections
before treating the complete flow as production-ready.

------------------------------------------------------------------------

## Suggested learning order

-   [ ] Understand the Express vs Next.js routing difference.
-   [ ] Understand `Request` and `request.json()`.
-   [ ] Understand `Response.json()` and `NextResponse.json()`.
-   [ ] Practice query parameters and dynamic route parameters.
-   [ ] Understand how Mongoose works inside Route Handlers.
-   [ ] Dry-run the registration API.
-   [ ] Dry-run the verification API.
-   [ ] Build and test the verification page.

**Main takeaway:** Next.js Route Handlers do not replace Node.js or HTTP
concepts. They provide a filesystem-based way to define backend
endpoints, using standard Web Request and Response APIs instead of
Express's `req` and `res` objects.
