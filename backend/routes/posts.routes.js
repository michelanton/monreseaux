const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/posts");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// GET tout les posts auth,  auth, auth,auth,auth,auth,
router.get('/posts',   postCtrl.allPosts);  
// GET un post
router.get('/posts/:id',  postCtrl.postIdCtrl); 
// POST un post
router.post('/posts',  multer, postCtrl.createPost); 
// DELETE un post
router.delete('/posts/:id',  postCtrl.supPostCtrl); 
// GET tout les comments d'un user
router.get('/posts/user/comment/:id',   postCtrl.commentUserIdCtrl);
// GET tout les posts d'un user
router.get('/posts/user/:id',  postCtrl.postUserIdCtrl);
// GET tout les comments
router.get('/comments',   postCtrl.commentAllCtrl);
// DELETE un comment d'un USER
router.delete('/comments/:id',  postCtrl.supCommentCtrl);
// GET tout les comments d'un post
router.get('/posts/comments/:id',  postCtrl.commentsIdCtrl); 
// GET un user par son id
router.get('/post/comment/:id',  postCtrl.commentPostCtrl); 
// DELETE un comment par son id
router.delete('/post/comment/:id',  postCtrl.supComment); 
// POST un comment
router.post('/posts/comments/:id', postCtrl.writeCommentCtrl);  


module.exports = router;