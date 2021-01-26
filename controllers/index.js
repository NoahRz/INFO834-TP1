function readAppel(req, res) {

    res.status(200).json({ 'msg': 'Appel' });
}

module.exports.readAppel = readAppel;