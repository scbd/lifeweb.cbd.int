var projectSchema = new Schema({
  lead_contact: String,
  countries: [String],
  title: String,
  timeframe: Number,
  thumbnail: String,
  abstract: String,
  organizations: [String],
  aichi_targets: {String},
  national_alignment: {
    NBSAP: String,
    other: String,
  },
  ecological_contribution: String,
  climate_contribution: {String},
  institutional_context: [{
    name: String,
    role: String,
  }],
  budget: [{
    activity: String,
    result: String,
    cost: Number,
  }],
  donors: [{
    name: String,
    description: String,
    funding: Number,
    date_donated: Date,
    facilitated_by_lifeweb: Boolean,
  }],
  Keywords: [String],
  Images: {[
    url: String,
    title: String,
    Description: String,
  ]},
  protected_areas: [String],
  maps: [{
    url: String,
    title: String,
    Description: String,
  }],
  coordinates: {
    lon: Number,
    lat: Number,
  },
  attachments: [{
    url: String,
    title: String,
    Description: String,
    keywords: [String],
  }],
  expiry_duration: Number,  //number of years. Defaults to 1.
  additional_information: String,
});
