exports.isLoggedIn = function(req,res,next){
    if(req.user){
        
        next();

    }
    else{
        console.log("User not found")
        return res.status(401).send("Access denied");
    }
}