var express = require('express');
var router = express.Router();
const { auth } = require("../../middleware/auth");
const Article = require("../models/articles")

/* GET home page. */
router.post('/addArticle', auth, async function (req, res, next) {
  const {title, description, picture, author} = req.body;
  console.log("AUTH", auth);
  console.log("USER", req.user)
  // console.log("reqBody AddArticle-------->", req.body);dd
  
  try {
    // console.log({title, description, author});

    const createdArticle = await Article.create({
      title,
      description,
      picture,
      author,
      userId: req.user.id
    });

    res.json({ result: createdArticle, message: "Article added successfuly" });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });

  }
});

router.post("/updateArticle/:id", auth, async (req, res) => {
  console.log("req body of update ------>", req.body);
  
  const { title, description, picture, author } = req.body;
  const { id } = req.params;
  console.log("je suis dans le router update", id);
  
  try {
    const isArticleExist = await Article.findById( id);
    if(!isArticleExist) {
      return res.status(404).json({ result: false, error: "Not Founnnnnnd" })
    }

    const updatedArticle = await Article.updateOne(
      {_id:id},
      { $set: { title, description, picture, author  } }
    );
    res.json({ result: updatedArticle, message: "Article is modified" });

  } catch (error) {
    res.status(500).json({ result: false, error: error.message });

  }
});

router.delete("/deleteArticle/:id", auth, async (req, res) => {

  const { id } = req.params;
  console.log("reqparams id------------>", id);
  try {
    const isArticleExist = await Article.findById( id);
    if(!isArticleExist) {
      return res.status(404).json({ result: false, error: "Not Founnnnnnd" })
    }

    const deletedArticle = await Article.deleteOne({_id: id})

    res.json({ result: deletedArticle, message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }

});

router.get("/displayArticles", async (req, res) => {
  try {
    // console.log({requser: req.cookies.jwt});
    
    const articles = await Article.find();
    res.json({ result: articles, message: "All articles are displayed" });

  } catch (error) {
    return res.status(401).json({ result: error, error: "Not Authorized" });

  }
});

router.get("/articleById/:id", async (req, res) => {
  const { id } = req.params;
  console.log("req parama id in update function ---->", id);
  
  try {
    const articleById = await Article.findById(id);
    res.json({result: articleById, message: "article find"})
  } catch (error) {
    return res.status(404).json({ result: error, error: "The server can not find the requested resource. " });
  }
})


 

module.exports = router;
