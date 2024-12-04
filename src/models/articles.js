const mongoose = require("mongoose");
 
const articleSchema = mongoose.Schema({
    title: String,
    description: String,
    picture:String,
    author: String,
    userId: String
});

const Article = mongoose.model("articles", articleSchema);

module.exports = Article;