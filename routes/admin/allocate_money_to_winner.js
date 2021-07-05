const express = require('express');
const router = express.Router();

const auth = require('../../middleware/admin_auth');
const { Pool } = require('../../models/pool');
const { User } = require('../../models/user');

router.post('/', auth, async (req, res) => {
    let admin = req.admin;
    if (!admin.poolId) return res.status(400).send('Admin has not been allocated a pool');

    try {
        let pool = await Pool.findById(admin.poolId);

        if (!pool) return res.status(400).send('Pool is not present ');

        if (!pool.isPoolRoundRunning) return res.status(400).send('Pool round is not started yet');

        if (pool.roundMoneyNonAdders.length > 0) return res.status(400).send('Some users are remaining to add periodic  money in current round');


        let noOfTokens = 0;
        let tokens = [];
        for (i in pool.users) {

            let _id = pool.users[i];
            let user = await User.findById(_id).select({ score: 1 });

            noOfTokens += user.score;
            for (let j = 1; j <= user.score; j++) {
                tokens.push(user._id);
            }

        }

        let winner_token_no = Math.floor(Math.random() * noOfTokens);
        let winner_id = tokens[winner_token_no];

        return res.send({ winner_token_no, winner_id });
    }
    catch (ex) {
        return res.status(400).send(ex.message);
    }




});

module.exports = router;