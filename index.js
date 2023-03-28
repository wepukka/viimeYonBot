require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const { currentDay, previousDay } = require("./utils");
const { textToBox } = require("./textUtils");
const viimeyoSchema = require("./mongooseSchema");
const schedule = require("node-schedule");
const database = require("./mongoose");
const axios = require("axios");
const { fetchTodaysGames, fetchLastNightGames } = require("./nhlApi");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Fetch video urls from youtube API
const fetchVideosFromApi = async () => {
  let midnight = currentDay() + "T00:00:00Z";
  let videoArray = [];
  let url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&type=video&part=snippet&channelId=UCZtDQulSu6Ar7X6B_5SftTQ&maxResults=10&order=date&publishedAfter=${midnight}`;
  await axios.get(url).then((response) => {
    const data = response.data;
    data.items.map((data) => {
      videoArray.push(data.id.videoId);
    });
  });
  return videoArray;
};

// Fetch video urls from database
const fetchVideosFromDb = async () => {
  let videos = await viimeyoSchema.find({});

  return videos.length === 0 ? [] : videos[0].videos;
};

// Post video to channel
const postYoutubeVideo = async (channel, id) => {
  await channel.send(
    "https://youtube.com/watch?v=" + id + "&ab_channel=Viimeyönänärit"
  );
  console.log("New video posted");
};

// Save video schema
const saveToDb = async (videos) => {
  new viimeyoSchema({ videos: videos })
    .save()
    .then(() => {
      console.log("Videos saved");
    })
    .catch((err) => {
      console.log(err);
    });
};

const postVideos = async () => {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    let newVideoBool = false;
    let oldVideos = await fetchVideosFromDb();
    let newVideos = await fetchVideosFromApi();

    for (i in newVideos) {
      let newVideo = newVideos[i];

      // IF new video is not in database, post to channel //
      if (!oldVideos.includes(newVideo)) {
        newVideoBool = true;

        await postYoutubeVideo(channel, newVideo);
      }
    }

    // IF new video is posted, update database with new video array //
    if (newVideoBool) {
      await viimeyoSchema.deleteMany({});
      await saveToDb(newVideos);
    }
  } catch (err) {
    console.log(err);
  }
};

// Check for new videos every hour
const viimeYo = new schedule.RecurrenceRule();
viimeYo.minute = 0;

schedule.scheduleJob(viimeYo, function () {
  postVideos();
});

// NHL RESULTS //

const postResults = async () => {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    let games = await fetchLastNightGames();

    let dateRange = previousDay("fi") + " - " + currentDay("fi");
    let nhlScores = dateRange;

    if (games.length === 0) {
      return channel.send(textToBox(nhlScores + "\n\n" + "NO GAMES FOUND"));
    }

    games.map((game) => {
      // Extra strings to adjust scores to same position //
      let homeEs = new Array(25 - game.home.name.length).join("-");
      let awayEs = new Array(25 - game.away.name.length).join("-");

      let homeName = game.home.name + homeEs;
      let awayName = game.away.name + awayEs;

      let homeScore = game.home.score;
      let awayScore = game.away.score;

      // Winner mark //
      homeScore > awayScore
        ? (homeScore = homeScore + " < W")
        : (awayScore = awayScore + " < W");

      nhlScores +=
        "\n\n" +
        "HOME: " +
        homeName +
        " " +
        homeScore +
        "\n" +
        "AWAY: " +
        awayName +
        " " +
        awayScore;
    });

    return channel.send(textToBox(nhlScores));
  } catch (err) {
    console.log(err);
  }
};

const nhlResults = new schedule.RecurrenceRule();
nhlResults.hour = 9;
nhlResults.minute = 0;

schedule.scheduleJob(nhlResults, function () {
  postResults();
});

client.once("ready", async () => {
  client.user.setPresence({
    activities: [{ name: "Searching for new videos" }],
  });
  database.connect();
});

client.login(process.env.BOT_TOKEN);
