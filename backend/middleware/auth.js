//verif authentification//

const jwt = require("jsonwebtoken"); 
const dotenv = require("dotenv"); 
dotenv.config({path: '.env'});


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; 
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) { 
      //comparaison id utilisateur ET celui du token//
      /////si id utilisateur différent de user id on envoie une erreur////
      throw "user ID non valable";
    } else {next();}
      ///si ok on passe l'exécution///////////////////////////
  } catch {
    res.status(403).json({
      error: new Error("unauthorized request"),
    });
  }
};

