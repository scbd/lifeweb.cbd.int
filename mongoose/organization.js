var organizationSchema = new Schema({
  name: String,
  type: String, //implementing organization or donor
  acronym: String,
  phone: String,
  email: String,
  social: {
    website: String,
    facebook: String,
    twitter: String,
    google: String,
    other_links: [String],
  },
});
