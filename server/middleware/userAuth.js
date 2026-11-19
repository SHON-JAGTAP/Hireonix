import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token)  {
        return res.status(401).json({success: false, message: "Unauthorized"})
    }

    try {
        
         
     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
     
     if (tokenDecode.id) {
        req.userId = tokenDecode.id
     }else {
          return res.status(401).json({success: false, message: "Unauthorized"});
     }

     next();

    } catch (error) {
        res.status(401).json({success: false, message: "Unauthorized"});
    }

}

export default userAuth;
