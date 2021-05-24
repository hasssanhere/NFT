const User = require('../models/user')

const isAdmin = async (req, res, next) =>{
   try {
    const user = await User.findById(req.user.payload.id)
    if (user && user.role === "admin") {
        next()
        return
    }
    return res.status(400).send({ error: 'only admin' })
    }catch(err){
        return res.status(500).send({ error: 'internal error' })
    }
}

module.exports = {
    isAdmin
};
