module.exports = function(mongoose) {
  var Test = new mongoose.Schema({
    name: { type: String, index: true },
    id: mongoose.Schema.ObjectId,
    text: String
  });

  var models = {
    Test: mongoose.model("Test", Test)
  };

  return models;
};
