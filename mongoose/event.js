var eventSchema = new Schema({
  name: String,
  type: String, //side, meetings, round table
  description: String,
  location: {
    address: String,
    country: String,
    coordinates: {
      lon: Number,
      lat: Number,
    },
  },
  start: Date,
  end: Date, //optional
  project: String, //preferably in reference to lifeweb projects
  organizations: [String], //preferably in reference to lifeweb orgs
  Images: {[
    filename: String,
    title: String,
    Description: String,
  ]},
  documents: {[
    filename: String,
    title: String,
    Description: String,
  ]},
  cover_image: String,
});
