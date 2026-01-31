#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'guest',
    time_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NOT NULL,
    title TEXT NOT NULL,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hidden BOOLEAN DEFAULT false,

    CONSTRAINT fk_user
        FOREIGN KEY (userid)
        REFERENCES users(id)
        ON DELETE CASCADE
);
`;

const databaseUrl = process.argv[2];

if (!databaseUrl) {
  console.error("❌ Please provide a database URL");
  process.exit(1);
}

async function main() {
  console.log("🌱 Seeding database...");
  const client = new Client({ connectionString: databaseUrl });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("✅ Done");
}

main();
