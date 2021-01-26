function readFalseData(req, res) {

    res.status(200).json({ 'msg': 'false data' });
}

module.exports.readFalseData = readFalseData;