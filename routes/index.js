function index (req, res, next){
  res.send(200, "These are not the * you are looking for");
  return next();
};

module.exports = {
	index : index
}