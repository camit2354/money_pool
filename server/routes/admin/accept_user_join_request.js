const express = require('express') ;
const router = express.Router() ;

const auth = require('../../middleware/admin_auth') ;
const { Admin } = require('../../models/admin');
const {User} = require('../../models/user') ;
const {Pool} = require('../../models/pool');

router.post('/',auth, async(req,res)=>{
    let admin = await Admin.findById(req.admin._id) ;
    if(!admin) return res.status(400).send('Invalid AdminID') ;

    if(!admin.poolId) return res.status(400).send('Admin is not been assigned any pool') ;

    let pool = await Pool.findById(admin.poolId);
    if(!pool) return res.status(400).send('Pool with given ID dont exists') ;

    for(i in pool.joinRequests)
    {
        let ur = pool.joinRequests[i]

        try
        {
            let user = await User.findById(ur) ;        
            pool.joinRequests = pool.joinRequests.filter(id => id != ur) ;
            if(!user)
            {
            continue ;
            }

            pool.users.push(ur) ;
            user.pools_joined.push(pool._id) ; 
            user = await user.save() ;
            pool = await pool.save() ;

        }
        catch(ex)
        {
            return res.status(400).send(ex.message);
        }
        
    }

    return res.send('success');
}) ;

module.exports = router ;