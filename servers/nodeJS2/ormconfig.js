module.exports = {
  type: "mongodb",
  url: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ku5rn.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`,
  useNewUrlParser: true,
  synchronize: true,
  logging: false,
  entities: ["src/entity/*.js"],
  cli: {
    entitiesDir: "src/entity",
  },
};
