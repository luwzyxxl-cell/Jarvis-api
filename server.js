const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "JARVIS API aktif 🤖"
  });
});

app.get("/api/github/:username", async (req, res) => {

  const username = req.params.username;

  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    return res.status(400).json({
      error: "Geçersiz kullanıcı adı"
    });
  }

  try {

    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      {
        headers: {
          "Accept": "application/vnd.github+json",
          "User-Agent": "JARVIS-App"
        }
      }
    );

    if (response.status === 404) {
      return res.status(404).json({
        error: "Kullanıcı bulunamadı"
      });
    }

    if (!response.ok) {
      return res.status(502).json({
        error: "GitHub API hatası"
      });
    }

    const user = await response.json();

    res.json({
      username: user.login,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar_url,
      followers: user.followers,
      repositories: user.public_repos,
      location: user.location,
      profile: user.html_url
    });

  } catch (error) {

    res.status(500).json({
      error: "Sunucu hatası"
    });

  }

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("JARVIS API aktif 🤖");
});
