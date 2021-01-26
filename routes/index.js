//Access the router on Express 
const router = require('express').Router();

const jwt = require('jsonwebtoken');

const redis = require("redis");

//Access the controllers
const controller = require('../controllers/index');

//READ
router.get("/appel", (req, res) => {

    if (req.session.logged) {
        const token = req.header('Authorization').replace('Bearer ', '');

        const client = redis.createClient();

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log(payload._id)

            const client = redis.createClient();

            client.on("error", function (error) {
                console.error(error);
            });

            client.exists(token, function (err, reply) {
                if (err) throw err;

                if (reply == 0) {
                    client.incr(token, redis.print);
                    client.expire(token, 600); // 600 : 10 min
                    controller.readAppel(req, res);
                } else {
                    client.incr(token, redis.print);
                    client.get(token, function (err, cpt) {
                        if (err) throw err;
                        if (!(cpt > 10)) {
                            controller.readAppel(req, res);
                        } else {
                            res.status(400).json({ msg: "please wait 10 min" });
                        }
                    })
                }


            })


        } catch (error) {
            console.error(error.message);
        }
    }
    else {
        res.status(400).json({ msg: "please sign in" });
    }
});

module.exports = router;