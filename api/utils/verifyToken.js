import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return next(res.status(401).json("You are not authentificated!"));
  } else{
    jwt.verify(token, "secretkey", (err, user) => {
      if (err) return next(res.status(403).json("Token is not valid!"));
      req.user = user;
      next();
    });
  }

  
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === +req.params.userId || req.user.id === +req.query.userId || req.user.id === +req.body.userId || req.user.isAdmin ) {
      next();
    } else {
      console.log("Problem in verify user func", req.query.userId)
      return next(res.status(403).json("You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!!req.user.isAdmin) {
      next();
    } else {
      console.log("ver admin")
      return next(res.status(403).json("You are not admin authorized!"));
    }
  });
};

