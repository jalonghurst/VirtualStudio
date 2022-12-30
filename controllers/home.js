module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs", {url: req.url});
  },

  getAbout: (req, res) => {
    res.render("about.ejs", {url: req.url})
  }
};
