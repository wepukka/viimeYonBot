const axios = require("axios");
const { previousDay } = require("./utils");

const fetchLastNightGames = async () => {
  try {
    const yesterday = previousDay();
    const url = `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${yesterday}&endDate=${yesterday}`;

    const lastNightGames = [];

    await axios.get(url).then((response) => {
      const data = response.data;

      data.dates[0].games.map((game) => {
        lastNightGames.push({
          away: {
            name: game.teams.away.team.name,
            record: game.teams.away.leagueRecord,
            score: game.teams.away.score,
          },
          home: {
            name: game.teams.home.team.name,
            record: game.teams.home.leagueRecord,
            score: game.teams.home.score,
          },
        });
      });
    });
    return lastNightGames;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { fetchLastNightGames };
