const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
      title: { type: String },
      url: {
        type: String, 
        unique: true
      },
      description: { type: String },
      date: { type: Date },

    }
);
PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('post', PostSchema);