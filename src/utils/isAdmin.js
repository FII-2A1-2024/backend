

function isAdmin(req,res,next){

    const userRole = req.user.role;
     if(userRole==='admin') next();
else  {
    return res.status(403).json({ error: 'Forbidden: Unauthorized access' });
}
}
module.exports= isAdmin;