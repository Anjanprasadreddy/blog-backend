const User = require('../models/User');  

exports.getUsers = async(req,res)=>{
    try{
        const users = await User.find({}, {name:1 ,email:1 ,role:1}); // Get only necessary fields
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.makeUserAdmin = async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if(user.role==='user'){
            user.role = 'admin';
        }else{
            user.role = 'user';   
        }
        await user.save();

        res.json({ message: 'User upgraded to admin successfully' });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}