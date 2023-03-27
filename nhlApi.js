const axios = require("axios");
const { previousDay } = require("./utils");

const fetchLastNightGames = async () => {
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
};

module.exports = { fetchLastNightGames };

/*    console.log(game.teams.away.team.name);
console.log(game.teams.away.leagueRecord);
console.log(game.teams.away.score);
console.log(game.teams.home.team.name);
console.log(game.teams.home.leagueRecord);
console.log(game.teams.home.score); */
