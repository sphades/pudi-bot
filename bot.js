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
let defaultSong = 'https://www.youtube.com/watch?v=KZ9l85fOq1Y'
let songMap = new Map();
let booleanMap = new Map();

client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (booleanMap.get(newMember.guild.id) === undefined){
        booleanMap.set(newMember.guild.id,true)
        console.log('missing stuff')
    }
    if (songMap.get(newMember.guild.id) === undefined){
        songMap.set(newMember.guild.id,defaultSong)
        console.log('missing song')
    }
    newUserChannel = newMember.channel;
    //let oldUserChannel = oldMember.channelID;
    var song = songMap.get(newMember.guild.id)
    if (booleanMap.get(newMember.guild.id)){
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
    }
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.content.startsWith(`${prefix}stop`)) {
        newUserChannel.leave();
    }
    else if (message.content.startsWith(`${prefix}change`)) {
        var temp = message.content.split(" ")[1]
        songMap.set(message.guild.id,temp)
        console.log(songMap.get(message.guild.id))
    }
    else if (message.content.startsWith(`${prefix}reset`)) {
        songMap.set(message.guild.id,defaultSong)
        console.log(songMap.get(message.guild.id))
    }
    else if (message.content.startsWith(`${prefix}toggle`)) {
     booleanMap.set(message.guild.id,!booleanMap.get(message.guild.id))
    }
    else if (message.content.startsWith(`${prefix}help`)){
        return message.channel.send("!change [youtube link] ")
    }
});

client.login(token);
