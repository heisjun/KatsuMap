const { stores, users } = require("../app/_lib/placeholder-data");
const { db } = require("@vercel/postgres");
const bcrypt = require("bcrypt");

async function seedKatsuInfo(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "katsu_info" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS katsu_info (
        post_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        explain TEXT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        lat VARCHAR(255) NOT NULL,
        lng VARCHAR(255) NOT NULL,
        time TEXT NOT NULL,
        menu TEXT NOT NULL
      );
    `;

    console.log(`Created "katsu_info" table`);

    // Insert data into the "katsu_info" table
    const insertedKatsuInfos = await Promise.all(
      stores.map(
        (store) => client.sql`
        INSERT INTO katsu_info (post_id, name, title, explain, image_url, lat, lng, time, menu)
        VALUES (${store.post_id}, ${store.name}, ${store.title},${store.explain}, ${store.image_url},${store.lat},${store.lng},${store.time},${store.menu})
        ON CONFLICT (post_id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${insertedKatsuInfos.length} katsu_info`);

    return {
      createTable,
      customers: insertedKatsuInfos,
    };
  } catch (error) {
    console.error("Error seeding katsu_info:", error);
    throw error;
  }
}

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        //비밀번호 해쉬로 암호화
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await seedUsers(client);
  //await seedKatsuInfo(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
