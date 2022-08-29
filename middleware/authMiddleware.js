const jwt = require("jsonwebToken");

module.exports = (req, res, next) =>{
    try{
    
    const token = req.headers["authorization"].split(" ")[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if (err){
            return res.status(401).send({
                message: "Auth failed1",
                success: false
            });
        }else{
            req.body.userId = decoded.id;
            next() //call next function
        }
    })
    }catch (error){
        return res.status(401).send({
            message: "Auth failed2",
            success: false
        });
    }
};