# viimeYonBot
Simple Discordbot to post new videos to my friend groups discord channel from [Viimeyonanarit](https://www.youtube.com/channel/UCZtDQulSu6Ar7X6B_5SftTQ) youtube channel.

Searches new videos every hour. Video urls are saved to mongodb and comparison between videos from youtube api and mongdodb is made to determine if fetched video is recently posted.

## Usage
ViimeYonBot is not in public use, so to use this bot with current settings you would need to set up your own bot, youtube Api key & Mongo database and set needed values to .env file.

.env would look like this

BOT_TOKEN = token found in discord developer, when bot is created

CHANNEL_ID = The channel id where you want videos to be posted

DB_SRV = mongodb connection string

YOUTUBE_API_KEY = apikey created in youtube developer 

**You also need to have Node.js and npm installed & run "npm install" in source foulder** [Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Links
[YoutubeDeveloper](https://developers.google.com/youtube/v3)
[MongoDB](https://www.mongodb.com/cloud/atlas/lp/try4?utm_content=controlhterms&utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_core_prosp-brand_gic-null_emea-fi_ps-all_desktop_eng_lead&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624398&adgroup=115749707663&cq_cmp=12212624398&gclid=Cj0KCQjwn9CgBhDjARIsAD15h0CnZ-G0TS18v-gdBoY01azK8u5YkUvkDpBmxXxsNnuBnbUoFEuP9NcaArIZEALw_wcB)
[DiscordDeveloper](https://discord.com/developers/docs/intro)

## Result
![Viimeyön](https://user-images.githubusercontent.com/83569026/235128739-68806683-1ad0-4ea7-9488-7ca39f433edb.png)
