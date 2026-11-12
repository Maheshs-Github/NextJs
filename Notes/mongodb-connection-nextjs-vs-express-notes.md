# MongoDB Connection in Next.js vs Express.js

## 1. Why do we need a database connection?

Before performing database operations such as finding, creating,
updating, or deleting documents, our application must connect to
MongoDB.

We use **Mongoose** to connect Node.js applications to MongoDB.

``` bash
npm install mongoose
```

Add the MongoDB connection string to `.env.local` in Next.js or `.env`
in Express:

``` env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
```

-   Keep the connection string private.
-   Never commit `.env` or `.env.local` to Git.
-   In Next.js, do not use the `NEXT_PUBLIC_` prefix for database
    credentials. The connection must remain server-side.

------------------------------------------------------------------------

## 2. Express.js: Typical database connection

In a traditional Express application, the server usually starts once. We
connect to MongoDB before listening for incoming requests.

### Example: `config/db.js`

``` js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Example: `server.js`

``` js
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
```

### Express flow

1.  `server.js` starts.
2.  `connectDB()` is called.
3.  `mongoose.connect()` establishes the MongoDB connection.
4.  If the connection succeeds, `app.listen()` starts the HTTP server.
5.  Express handles incoming requests.

**Important:** In this common setup, the database connection is
established during application startup, not separately for every
request.

------------------------------------------------------------------------

## 3. Next.js: Database connection

Next.js is not usually started with our own `app.listen()` call. Next.js
manages the web server and invokes route handlers when requests arrive.

A route handler can call a shared database connection utility before
querying MongoDB.

### Example folder structure

``` text
src/
├── app/
│   └── api/
│       └── users/
│           └── route.ts
└── lib/
    └── dbConnect.ts
```

If your project does not use a `src` directory, put `app` and `lib`
directly in the project root.

### Example: `src/lib/dbConnect.ts`

``` ts
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Reuse the connection if this module already has a connected state.
  if (connection.isConnected === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing");
    }

    const db = await mongoose.connect(mongoUri);

    connection.isConnected = db.connections[0].readyState;

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

export default dbConnect;
```

### Example: `src/app/api/users/route.ts`

``` ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET /api/users failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch users",
      },
      { status: 500 }
    );
  }
}
```

The `@/` import alias works when it is configured in `tsconfig.json`.
For example, a project with `src` may use:

``` json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Adjust the alias if your project uses a different structure.

### Next.js flow

1.  The Next.js development or production server starts.
2.  A request reaches `/api/users`.
3.  Next.js invokes the `GET` route handler.
4.  `dbConnect()` checks whether a connection is already available.
5.  If needed, it connects to MongoDB.
6.  The route handler performs the database query and returns a
    response.

**Important:** `dbConnect.ts` is a utility file. You normally do not run
it directly. A route handler or another server-side function imports and
calls it.

------------------------------------------------------------------------

## 4. Express vs Next.js: Main differences

  ------------------------------------------------------------------------
  Topic                   Express.js              Next.js
  ----------------------- ----------------------- ------------------------
  Server startup          We create and start the Next.js manages the
                          Express server          server

  Typical connection call During application      From a server-side route
                          startup                 handler or server
                                                  function

  Connection utility      `connectDB()`           `dbConnect()`

  HTTP endpoint           Express                 `app/api/.../route.ts`
                          route/controller        

  Listen on a port        `app.listen()`          Not normally written by
                                                  us

  Database library        Mongoose                Mongoose

  Runtime for Mongoose    Node.js                 Node.js runtime
  ------------------------------------------------------------------------

The database connection itself uses the same Mongoose API in both
frameworks. The main difference is **where and when we call the
connection function**.

------------------------------------------------------------------------

## 5. Understanding the connection cache

In the Next.js example:

``` ts
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};
```

This creates a module-level object. It is initially empty:

``` ts
connection = {};
```

After a successful connection, we store Mongoose's connection state:

``` ts
connection.isConnected = db.connections[0].readyState;
```

Common Mongoose connection states:

    Value Meaning
  ------- ---------------
      `0` Disconnected
      `1` Connected
      `2` Connecting
      `3` Disconnecting

Then this check:

``` ts
if (connection.isConnected === 1) {
  return;
}
```

means: if this module's cached state says MongoDB is connected, do not
call `mongoose.connect()` again.

### Simple example

**First request:**

-   `connection.isConnected` is `undefined`.
-   The condition is false.
-   `mongoose.connect()` runs.
-   The state is stored as `1`.

**Second request:**

-   `connection.isConnected` is `1`.
-   The condition is true.
-   The function returns without reconnecting.

### Important limitation

This simple module-level cache is useful for learning, but it is not the
most robust production pattern for Next.js. During development, hot
reload can reload modules; in serverless or multi-instance deployments,
different instances can have separate memory. Also, a cached state can
become stale if the connection drops.

For a production Next.js application, a common improvement is to cache
the Mongoose connection **and the connection promise on `globalThis`**.
This helps reuse an in-progress or established connection across module
reloads within the same Node.js process. It does not create one shared
connection across separate serverless instances.

------------------------------------------------------------------------

## 6. Why use `throw error` instead of `process.exit(1)` in Next.js?

In an Express application, `process.exit(1)` is sometimes used during
startup when the database connection fails. It terminates the server
process because the application cannot safely start.

In a Next.js route handler, avoid calling `process.exit(1)` when a
request's database connection fails. It would terminate the whole
Node.js process, not just the current request.

Instead:

``` ts
catch (error) {
  console.error("Database connection failed:", error);
  throw error;
}
```

The calling route handler can catch the error and return an appropriate
HTTP response.

------------------------------------------------------------------------

## 7. Testing the Next.js connection

Create a temporary route:

`src/app/api/test-db/route.ts`

``` ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}
```

Start Next.js:

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000/api/test-db
```

A successful response should look like:

``` json
{
  "success": true,
  "message": "Database connected successfully"
}
```

Check the terminal for the connection log. Remove the temporary test
route when it is no longer needed.

------------------------------------------------------------------------

## 8. Key takeaways

-   Mongoose is used in both Express and Next.js to connect to MongoDB.
-   Express commonly connects once before starting its HTTP server.
-   Next.js route handlers call a shared connection utility when they
    need the database.
-   Reuse the connection instead of opening a new connection for every
    request.
-   Keep MongoDB credentials in server-only environment variables.
-   Do not use the Edge Runtime for Mongoose; use the Node.js runtime.
-   In Next.js, throw connection errors and handle them in the route
    handler rather than terminating the process.
-   For production Next.js deployments, prefer a `globalThis` cache that
    stores both the connection and its promise.

**Mental model:** Express starts its server after connecting to the
database. Next.js manages the server, and each database-using
server-side route makes sure a reusable database connection is available
before querying.
