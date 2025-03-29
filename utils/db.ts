import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

interface Data {
  granterGrants: any[];
  granteeGrants: any[];
}

const defaultData: Data = { granterGrants: [], granteeGrants: [] };
const db = new Low<Data>(new JSONFile<Data>("db.json"), defaultData);

// Initialize the database
async function initDB() {
  try {
    await db.read();

    // If db.data is undefined (in case of an empty db.json), initialize it with default data
    if (!db.data) {
      db.data = { granterGrants: [], granteeGrants: [] };
      await db.write();
    }
  } catch (error) {
    console.error("Error reading the database:", error);
    // If reading the file fails (e.g., file doesn't exist), initialize db.data
    db.data = { granterGrants: [], granteeGrants: [] };
    await db.write();
  }
}

export const addGranterGrant = async (grant: any) => {
  await initDB();

  if (!db.data) {
    db.data = { granterGrants: [], granteeGrants: [] };
  }

  const exists = db.data.granterGrants.some(
    (existingGrant) =>
      existingGrant.granter === grant.granter &&
      existingGrant.permission === grant.permission &&
      existingGrant.expiration === grant.expiration
  );

  if (!exists) {
    db.data.granterGrants.push(grant);
    await db.write();
  }
};

export const getGranterGrants = async () => {
  await initDB();
  return db.data!.granterGrants; // Since we've initialized db.data, it should be safe to access
};

export const addGranteeGrant = async (grant: any) => {
  await initDB();

  if (!db.data) {
    db.data = { granterGrants: [], granteeGrants: [] };
  }

  const exists = db.data.granteeGrants.some(
    (existingGrant) =>
      existingGrant.grantee === grant.grantee &&
      existingGrant.permission === grant.permission &&
      existingGrant.expiration === grant.expiration
  );

  if (!exists) {
    db.data.granteeGrants.push(grant);
    await db.write();
  }
};

export const getGranteeGrants = async () => {
  await initDB();
  return db.data!.granteeGrants; // Since we've initialized db.data, it should be safe to access
};

initDB();
