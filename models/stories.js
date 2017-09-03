const mongoose = require('mongoose');

// Story Schema

const StorySchema = mongoose.Schema({
    title: {
        type: String
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: {
        type: String
    },
    coordinates: {
        type: String
    }
});

const Story = module.exports = mongoose.model('Story', StorySchema);

module.exports.getAllByAuthorId = function(id, callback) {
    Story.find({author: id}, callback);
}

module.exports.save = function(newStory, callback) {
    newStory.save(newStory, callback);
}
