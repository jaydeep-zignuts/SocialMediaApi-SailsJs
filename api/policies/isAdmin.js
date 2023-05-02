const jwt= require('jsonwebtoken');

module.exports=async function(req, res, proceed){
    try{
        console.log("inside policies==>");
        // const token=req.headers.authorization.split(" ")[1];
        const token=req.cookies['token']
        console.log("Mytokrn",token);
        const decoded= jwt.verify(token, 'secret');
        req.userData=decoded;
        if(req.userData['role']==='user'){
            return res.status(403).json({
                message:"Unauthorized"
            })
        }
        proceed();
    }catch(error){
        return res.status(401).json({
            message:'Auth Failed '
        });
    }
        
}        