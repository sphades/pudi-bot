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

let users = new Map();
let newUserChannel = ''
let defaultSong = 'https://www.youtube.com/watch?v=KZ9l85fOq1Y'
// let songMap = new Map();
let booleanMap = new Map();

client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (newMember.id === '781557440902463508') return;
    if (newMember === null) return;
    if (booleanMap.get(newMember.guild.id) === undefined) {
        booleanMap.set(newMember.guild.id, true)
        console.log('Add Bool for this server')
    }
    // if (songMap.get(newMember.guild.id) === undefined) {
    //     songMap.set(newMember.guild.id, defaultSong)
    //     console.log('missing song')
    // }
    if (users.get(newMember.member.id) === undefined){
        users.set(newMember.member.id, defaultSong)
        console.log('Add user');
    }
    newUserChannel = newMember.channel;
    //let oldUserChannel = oldMember.channel;
    console.log(newMember.member.id)
    console.log(newMember.member.displayName)
    var song = users.get(newMember.member.id)
    console.log(song)
    if (booleanMap.get(newMember.guild.id)) {
        try {
            console.log("Joined vc with id " + newUserChannel);
            newUserChannel.join().then(connection => {
                connection.play(ytdl(song)).on("finish", () => {
                    newUserChannel.leave();
                    console.log('played something')
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
    if (message.content.startsWith(`${prefix}pudi`)) {
        newUserChannel.leave();
    }
    else if (message.content.startsWith(`${prefix}set`)) {
        var split = message.content.split(" ")
        var user = split[1] + split[2]
        var newSong = split[3]
        var userID = client.users.cache.find(u => u.tag === user).id;
        console.log(userID)
        users.set(userID, newSong)
        console.log(users.get(userID))
    }
    // else if (message.content.startsWith(`${prefix}reset`)) {
    //     songMap.set(message.guild.id, defaultSong)
    //     console.log(songMap.get(message.guild.id))
    // }
    else if (message.content.startsWith(`${prefix}toggle`)) {
        booleanMap.set(message.guild.id, !booleanMap.get(message.guild.id))
    }
});

client.login(token);
