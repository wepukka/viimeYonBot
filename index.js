require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const { currentDay, previousDay } = require("./utils");
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
};

// Check for new videos every hour
const viimeYo = new schedule.RecurrenceRule();
viimeYo.minute = 0;

schedule.scheduleJob(viimeYo, function () {
  postVideos();
});

// NHL RESULTS //

const postResults = async () => {
  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  let games = await fetchLastNightGames();

  let nhlScores = previousDay("fi") + " - " + currentDay("fi");

  games.map((game) => {
    // Extra strings to make team names same length, easier to check scores //
    var homeEs = new Array(25 - game.home.name.length).join("-");
    var awayEs = new Array(25 - game.away.name.length).join("-");

    nhlScores +=
      "\n\n" +
      "HOME: " +
      game.home.name +
      homeEs +
      " " +
      game.home.score +
      "   Current record: " +
      `${game.home.record.wins}-${game.home.record.losses}-${game.home.record.ot}` +
      "\n" +
      "AWAY: " +
      game.away.name +
      awayEs +
      " " +
      game.away.score +
      "   Current record: " +
      `${game.away.record.wins}-${game.away.record.losses}-${game.away.record.ot}`;
  });

  return channel.send("```" + nhlScores + "```");
};

const nhlResults = new schedule.RecurrenceRule();
nhlResults.hour = 9;

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
