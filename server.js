const express = require("express");
const mongoose = require("mongoose");
const UrlShorten = require("./models/url");
const TotalUrls = require("./models/total");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://urlShort:xjWov3uTvjOpDzEq@cluster0-shard-00-00.nmn34.mongodb.net:27017,cluster0-shard-00-01.nmn34.mongodb.net:27017,cluster0-shard-00-02.nmn34.mongodb.net:27017/url-shortener?ssl=true&replicaSet=atlas-zpsfn8-shard-0&authSource=admin&retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const urls = await UrlShorten.find({}).limit(8).sort({ expire_at: -1 });
  const total = await TotalUrls.findOne();
  res.render("index", { urls, host: req.get("host") + "/" , total: total.count });
});

app.post("/shortenUrl", async (req, res) => {
  UrlShorten.create({
    originalUrl: req.body.originalUrl,
  }, (err, url) => {
    if (err) {
      console.log(err);
      res.send("Error creating URL");
    }
      res.redirect("/");
  });
  const totalurl = await TotalUrls.findOne({});
  if (totalurl) {
    totalurl.count++;
    totalurl.save();
  } else {
    TotalUrls.create({
      count: 1,
    }, (err, totalurl) => {
      if (err) {
        console.log(err);
      }
    });
  }
});

app.get("/:shortUrl", async (req, res) => {
  const url = await UrlShorten.findOne({ shortUrl: req.params.shortUrl });
  if (!url) {
    res.send("URL not found");
  }
  url.clicks++;
  url.save();
  res.redirect(url.originalUrl);
});


app.listen(port, () => {
  console.log('listening on port ' + port);
});
