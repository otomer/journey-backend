module.exports = function(mongoose) {
  var Test = new mongoose.Schema({
    name: { type: String, index: true },
    id: mongoose.Schema.ObjectId,
    text: String
  });

  var journeyDataList = new mongoose.Schema({
    title: String,
    text: String,
    createdDate: { type: Date, default: Date.now },
    reminderDate: { type: Date, default: Date.now },
    isReminder: { type: Boolean, default:false},
    status: Number,
    expertIsInitiator: { type: Boolean, default:false}
  });
  
  var journeySchema = new mongoose.Schema({
    clientID: {
      type: Number,
      required: true},
    expertID: {
        type: Number,
        required: true},
    journeyDataList: [journeyDataList ]
  });

  var PushUserSchema = new mongoose.Schema({
    clientID: {
      type: Number,
      required: true},
    oneSignalUserId: {
        type: String,
        required: true}
  });
  
  var models = {
    Test: mongoose.model("Test", Test),
    Journey: mongoose.model( 'Journey', journeySchema ),
    JourneyDataList: mongoose.model( 'JourneyDataList', journeyDataList ),
    PushUser: mongoose.model( 'PushUserSchema', PushUser )
  };

  return models;
};



