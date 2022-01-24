const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');
const connection = require("../connectSql");
const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!\?@\.#\$%\^&\*])(?=.{8,})");
const dotenv = require("dotenv"); 
dotenv.config({path: '.env'});
// Signup
exports.signup = (req, res, next) => {
    const userObjet = req.body;
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    if (passwordRegex.test(userObjet.userPassword)) {
    let sql = "SELECT * FROM users WHERE email= ?";
      connection.query(sql, [req.body.userEmail], (err, results) => {
        if (err) {
          console.log("error: ", err);
        }
        if (results.length >= 1 ) {
          console.log("l'email existe deja")
          return res.status(409).json({message : "l'email existe deja"});
        }
        if (results.length == 0) {
          console.log("NO RESULT");
          bcrypt.hash(userObjet.userPassword, 10, (err, hash) => {
            if (err) {
              return res.satus(500).json({error: err})
            } else {
              console.log(hash);
              let signupQuery = `INSERT INTO users VALUES (null, ?, "${hash}", ?, ?, now(), null) `; 
              connection.query(signupQuery, [userObjet.userEmail, userObjet.userPseudo, imageUrl ],
              function (err, result)  { 
                if (!err) { 
                  res.status(201).json({ message: 'utilisateur créé , super!! !' })
                } else {
                      res.status(400).json({ error: err.code });
                } 
              })
            }
          })
        }
      })
    } else {
      return res.status(400).json({message : "le mot de passe ne remplis pas les regles, dsl !!"});
    }
}
// Login
exports.login =  (req, res, next) => {
  let loginQuery = `SELECT * FROM users where email = ?` ;   //"${req.body.email}"
  connection.query(loginQuery, [req.body.email] ,function (err, result) {
    if (req.body.email == process.env.ADMIN_EMAIL) {
      console.log("email ADMIN OK");
      // res.json({message : "cet email ADMIN"})
      if (!result) {
        res.status(400).send({ error: 'Utilisateur non trouvé !' });
      } else if (result.length > 0)
      {
        bcrypt.compare(req.body.password, result[0].password)
        .then(valid => {
          if (!valid) {
            return res.status(401).send ({ error: 'Mot de passe incorrect !' });
          } else {res.status(202).json
            ({ //Retourne le User Id, le pseudo et le Token
              id: result[0].id,
              pseudo: result[0].pseudo,
              email: result[0.].email,
              token: jwt.sign({ userId: result[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' }) 
            });
          }
        })
      } else {
        return res.status(401).send
            ({ error: "cet email n'est pas encore enregistré !" });
      }
    } else if (!result) {
      
      res.status(400).send({ error: 'Utilisateur non trouvé !' });
    } else if (result.length > 0)
    {
      console.log("email NORMAL OK");
      bcrypt.compare(req.body.password, result[0].password)
      .then(valid => {
        if (!valid) {
          return res.status(401).send ({ error: 'Mot de passe incorrect !' });
        } else {res.status(200).json
          ({ //Retourne le User Id, le pseudo et le Token
            id: result[0].id,
            pseudo: result[0].pseudo,
            email: result[0.].email,
            token: jwt.sign({ userId: result[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' }) 
          });
        }
      })
    } else {
      return res.status(401).send
          ({ error: "Cet email n'est pas encore enregistré, créez un compte !" });
    }
  })
}
// GET d'un user unique : posts.vue / axios userData()
exports.userEmail = (req, res) => { 
  let sql = "SELECT * FROM users WHERE email= ?";
  connection.query(sql, [req.params.email], (err, results) => {
    if (err) {
      console.log("error: ", err);
    };
    // console.log(results);
    res.send(JSON.stringify(results)); //
    // console.log(results);
    // console.log(req.params.email);
  });
}
// DELETE un user / superUser.vue / supUser(a)
exports.supUsrCtrl = (req, res, next) => {
  // console.log(req.params.id);
  let sqlDeletePost = "DELETE FROM users WHERE users.id = ?";
  connection.query(sqlDeletePost, [req.params.id], 
    (err, result) => {
      console.log(result)
      if (err) {
        return res.status(400).json({ message: "Le user n'a pas été suprimé !" })
      }
        return res.status(200).json({ message: 'User suprimé !' })
    })
}
// GET tout les user / superUser.vue / allUsers()
exports.userAll = (req, res, next) => {
  // console.log(req.originalurl)
  let sqlAllUser = "SELECT * FROM `users` ORDER BY users.date_user DESC"
  connection.query(sqlAllUser, function (err, result) {
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

