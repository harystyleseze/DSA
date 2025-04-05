import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || " ";

mongoose.connect(uri);

const grantSchema = new mongoose.Schema({
  granter: String,
  grantee: String,
  permission: String,
  expiration: String,
});

// Check if models already exist to prevent OverwriteModelError
const GranterGrant =
  mongoose.models.GranterGrant || mongoose.model("GranterGrant", grantSchema);
const GranteeGrant =
  mongoose.models.GranteeGrant || mongoose.model("GranteeGrant", grantSchema);

export const addGranterGrant = async (grant: any) => {
  const newGrant = new GranterGrant(grant);
  await newGrant.save();
};

export const getGranterGrants = async () => {
  return GranterGrant.find();
};

export const addGranteeGrant = async (grant: any) => {
  const newGrant = new GranteeGrant(grant);
  await newGrant.save();
};

export const getGranteeGrants = async () => {
  return GranteeGrant.find();
};
