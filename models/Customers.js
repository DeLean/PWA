const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ZipsSchema = new Schema({
    username: {
        type: String
    },
    name: {
        type: String
    },
    birthdate: {
        type: Date
    },
    email: {
        type: String
    }
});

module.exports = Main = mongoose.model("zips", ZipsSchema);
