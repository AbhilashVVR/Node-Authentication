const express = require("express");
const router = express.Router();
const verify = require("./verifyToken");
router.route("/").get(verify, (req, res) => {
  res.json({
    posts: {
      title: "my first post",
      description: "random data you shouldnt acsess",
    },
  });
});
module.exports = router;
