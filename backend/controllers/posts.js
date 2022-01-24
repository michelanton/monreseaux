
const connection = require("../connectSql");
// GET de touts les posts : posts.vue / axios getallpost()
exports.allPosts= (req, res, next) => {  
    let sql = "SELECT posts.title, users.pseudo, posts.description, users.id, posts.id, users.avatar_url, posts.user_id, posts.date, posts.media_url  FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.date DESC ";
    connection.query(sql, function (err, result) {   
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      } if (!result) {
        console.log(" il n'y a pas de posts");
        res.status(409).json({message: "il n'y pas de posts"});
      } 
      else if (result.length > 0) 
      {
       const Posts = [];
        for (let i = 0; i < result.length; i++) {
          Posts.push({
            id_numero: result[i].id,
            avatar_url: result[i].avatar_url,
            pseudo: result[i].pseudo,
            title: result[i].title,
            description: result[i].description,
            media_url: result[i].media_url,
            date_post: result[i].date,
            post_id: result[i].post_id,
            commentaires: result[i].nbcomment
          })
        }
          res.status(200).json(Posts);
          console.log(Posts);
      }
    });
};
// GET d'un post unique : postCommentaire.vue / axios thePost()
exports.postIdCtrl = (req, res, next) => {
    // console.log(req.originalurl)
    let sqlPostId = "SELECT posts.id AS postID, posts.title, posts.description, posts.media_url, users.id, users.avatar_url, users.pseudo, posts.date FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.id = ?"
    connection.query(sqlPostId, [req.params.id], function (err, result) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
        
      } else {
        if(result.length > 0) {
    
          res.send(JSON.stringify(result));
        }
      };
    })
};
// GET de touts les comments : superUser.vue / axios comments()
exports.commentAllCtrl= (req, res, next) => {  
  // console.log(req);
    let sqlAllComments = "SELECT comments.comment, posts.date AS datePost, posts.title, posts.description, posts.media_url, comments.id AS idComment, comments.user_id AS userIdComment, comments.post_id AS postIdComment, comments.date AS dateComment, users.id AS idUser, users.pseudo, users.avatar_url FROM comments INNER JOIN posts ON comments.post_id = posts.id INNER JOIN users ON comments.user_id = users.id ORDER BY comments.date DESC";
    connection.query(sqlAllComments, function (err, result) {   
      if (err) {
        console.log(err);
        return res.sendStatus(500);  
    } else {
        if(result.length > 0) {
          
          const Comments = [];
          for (let j = 0; j < result.length; j++) {
            Comments.push({
              idComment: result[j].idComment,
              comment: result[j].comment,
              dateComment: result[j].dateComment,
              datePost: result[j].datePost,
              title: result[j].title,
              postID: result[j].postID,
              description: result[j].description,
              media_url: result[j].media_url,
              pseudo: result[j].pseudo,
              avatar_url: result[j].avatar_url,
             

            })
            // console.log(result);
          }
          res.status(200).json(Comments);
          // console.log(Posts);
        }
      };
  });
};
// GET tout comments d'un post : postCommentaire.vue / axios  theComments()
exports.commentsIdCtrl= (req, res, next) => {
    let sqlCommentstId = "SELECT comments.comment, comments.id AS idComment, comments.user_id AS userIdComment, comments.post_id AS postIdComment, comments.date AS dateComment, users.id AS idUser, users.pseudo, users.avatar_url FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.post_id = ? ORDER BY comments.date DESC"
    connection.query(sqlCommentstId, [req.params.id], function (err, result) { 
      if (err) {
        console.log(err);
        return res.sendStatus(500);
        
      } else {
        if(result.length > 0) {
          console.log(result);
          res.send(JSON.stringify(result));
        }
      };
    })
};
// GET tout les posts d'un user //  profil / articles()
exports.postUserIdCtrl = (req, res, next) => {
  // console.log(req.originalurl)
  let sqlcommentsId = "SELECT * FROM `posts` WHERE posts.user_id = ? ORDER BY posts.date DESC"
  connection.query(sqlcommentsId, [req.params.id], function (err, result) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
      
    } else {
      if(result.length > 0) {
        console.log(result);
        res.send(JSON.stringify(result));
      }
    };
  })
};
// GET touts les comment d'un user : profil.vue / axios  comments()  
exports.commentUserIdCtrl = (req, res, next) => {
  // console.log(req.params.id)
  let sqlCommentId = "SELECT comments.id, comments.comment, posts.title, posts.description, posts.media_url, comments.date FROM `comments` INNER JOIN posts ON comments.post_id = posts.id  WHERE comments.user_id = ?"
  connection.query(sqlCommentId, [req.params.id], function (err, result) {
    if (err) {
      console.log(err);
      return res.sendStatus(500); 
    }
    if (!result) {
      res.status(409).json({message : "il n'y a pas de comments, dsl"})
    } else if (result.length > 0) {
        res.status(200).json(result);
    };
  })
};
// GET d'un user : postCommentaire.vue / axios  userCommnent(a)
exports.commentPostCtrl= (req, res, next) => {
    let sqlCommentstUser = "SELECT * FROM users  WHERE users.id = ?"
    connection.query(sqlCommentstUser, [req.params.id], function (err, result) { 
      if (err) {
        console.log(err);
        return res.sendStatus(500);
        
      } else {
        if(result.length > 0) {
          // console.log(result);
          res.send(JSON.stringify(result));
        }
      };
    })
};
// POST d'un comment : postCommentaire.vue / axios  writingComment()
exports.writeCommentCtrl = (req, res, next) => {
  console.log(req.body.avatar_url)
  let sqlWriteComment = "INSERT INTO comments VALUES (NULL, ?, ?, ?, NOW(), NULL, NULL)";
  connection.query(sqlWriteComment, [req.body.user_id, req.body.post_id, req.body.comment ], 
    (err, result) => {
      // console.log(result)
      if (!err) { 
          res.status(201).json({ message: 'Commentaire créé ! super!!' })
          console.log(result)
        }
      else {
        res.status(401).json({ error: err.code });
        console.log(err.code)
      }
    })
};
// POST un posts //  posts.vue axios sendPost()
exports.createPost = (req, res) => {
 
  const mediaUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  // console.log( mediaUrl);
  let sql = "INSERT INTO posts VALUES (NULL, ?, ?, ?, ?, NULL, NOW())";
  connection.query(sql, [req.body.user, req.body.title, req.body.description, mediaUrl ], (err, result) => {
    if (!err) { 
       res.status(201).json({ message: 'Post créé !' })
      //  console.log(result.id)
    } else {
      
      res.status(400).json({ error: err.code });
    } 
    // console.log(userObjet);
  })
}
// DELETE un post // profil.vue, superUserComments.vue / supPost(a)
exports.supPostCtrl = (req, res, next) => {
  // console.log("REQ: ", req);
  let sqlDeletePost = "DELETE FROM posts WHERE posts.id = ?";
  connection.query(sqlDeletePost, [req.params.id], 
    (err, result) => {
      
      // console.log(req.params.id);
      if (err) {
        return res.status(400).json({ message: "Post n'a pas été suprimé !" })
      }
        console.log("post supprimé!!");
        return res.status(200).json({ message: 'Post suprimé !' })

    })
}
// DELETE comment d'un user // profil / supPost(a)
exports.supCommentCtrl = (req, res, next) => {
  // console.log(req.params.id);
  let sqlDeleteComment = "DELETE FROM comments WHERE comments.id = ?";
  connection.query(sqlDeleteComment, [req.params.id], 
    (err, result) => {
      console.log(result);
      if (err) {
        return res.status(400).json({ message: "comments n'a pas été suprimé !" })
      }
        return res.status(200).json({ message: 'comments suprimé !' })
      
     
    })
}
// DELETE un comment  // superUser.vue / supComment(a)
exports.supComment = (req, res, next) => {
  // console.log(req.params.id);
  let sqlDeleteComment = "DELETE FROM comments WHERE comments.id = ?";
  connection.query(sqlDeleteComment, [req.params.id], 
    (err, result) => {
      console.log(result);
      if (err) {
        return res.status(400).json({ message: "comments n'a pas été suprimé !" })
      }
        return res.status(200).json({ message: 'comments suprimé !' })
      
     
    })
}






