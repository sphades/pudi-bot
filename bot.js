const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");

const client = new Discord.Client();

client.once("ready", () => {
    console.log("Ready!");
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnect!");
});

let newUserChannel = ''

client.on('voiceStateUpdate', (oldMember, newMember) => {
    newUserChannel = newMember.channel;
    let oldUserChannel = oldMember.channelID;
    let song = 'https://www.youtube.com/watch?v=KZ9l85fOq1Y' //pudi 
    try {
        console.log("Joined vc with id "+newUserChannel);
        newUserChannel.join().then(connection => {
            console.log('played something')
            connection.play(ytdl(song,{begin:'1m'})).on("finish", () => {
              newUserChannel.leave();
            }).on("error", error => console.error(error));
        })

    } catch (err) {
        console.log(err);
    }
    
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.content.startsWith(`${prefix}stop`)) {
        newUserChannel.leave();
    }
});

client.login(token);

//client.login(process.env.BOT_TOKEN);