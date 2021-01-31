const jwt = require('jsonwebtoken');
const redis = require("redis");

function readAppel(req, res) {

    if (req.session.logged) {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log("a");

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
                    res.status(200).json({ 'msg': 'Appel' });
                } else {
                    client.incr(token, redis.print);
                    client.get(token, function (err, cpt) {
                        if (err) throw err;
                        if (!(cpt > 10)) {
                            res.status(200).json({ 'msg': 'Appel' });
                        } else {
                            res.status(400).json({ msg: "please wait 10 min" });
                        }
                    })
                }
            })
        } catch (error) {
            console.error(error.message);
            res.status(400).json({ msg: "unauthorized access" });
        }
    }
    else {
        res.status(400).json({ msg: "please sign in" });
    }

}

module.exports.readAppel = readAppel;