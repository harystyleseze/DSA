import Database from "better-sqlite3";

const db = new Database("database.sqlite");

// Initialize tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS granterGrants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    granter TEXT,
    permission TEXT,
    expiration TEXT
  );
  CREATE TABLE IF NOT EXISTS granteeGrants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grantee TEXT,
    permission TEXT,
    expiration TEXT
  );
`);

export const addGranterGrant = (grant: any) => {
  const stmt = db.prepare(
    "INSERT INTO granterGrants (granter, permission, expiration) VALUES (?, ?, ?)"
  );
  stmt.run(grant.granter, grant.permission, grant.expiration);
};

export const getGranterGrants = () => {
  const stmt = db.prepare("SELECT * FROM granterGrants");
  return stmt.all();
};

export const addGranteeGrant = (grant: any) => {
  const stmt = db.prepare(
    "INSERT INTO granteeGrants (grantee, permission, expiration) VALUES (?, ?, ?)"
  );
  stmt.run(grant.grantee, grant.permission, grant.expiration);
};

export const getGranteeGrants = () => {
  const stmt = db.prepare("SELECT * FROM granteeGrants");
  return stmt.all();
};
