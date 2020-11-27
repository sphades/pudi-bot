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

const users = new Map();
let newUserChannel = ''
let defaultSong = 'https://www.youtube.com/watch?v=KZ9l85fOq1Y'
let songMap = new Map();
let booleanMap = new Map();

client.on("guildMemberAdd", (member) => {
    newUsers.set(member.id, member.user);
});

client.on("guildMemberRemove", (member) => {
    if (newUsers.has(member.id)) newUsers.delete(member.id);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (booleanMap.get(newMember.guild.id) === undefined) {
        booleanMap.set(newMember.guild.id, true)
        console.log('missing stuff')
    }
    if (songMap.get(newMember.guild.id) === undefined) {
        songMap.set(newMember.guild.id, defaultSong)
        console.log('missing song')
    }
    if (users.get(newMember.id) === undefined){
        users.set(newMember.id, defaultSong)
        console.log('missing user');
    }
    newUserChannel = newMember.channel;
    let oldUserChannel = oldMember.channel;
    // if(oldUserChannel === undefined && newUserChannel !== undefined) {
        
    //     // User Joins a voice channel
   
    //  } else if(newUserChannel === undefined){
   
    //    // User leaves a voice channel
        
    // }

    var song = users.get(newMember.id)
    if (booleanMap.get(newMember.guild.id)) {
        try {
            console.log("Joined vc with id " + newUserChannel);
            newUserChannel.join().then(connection => {
                console.log('played something')
                connection.play(ytdl(song, { begin: '1m' })).on("finish", () => {
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
    if (message.content.startsWith(`${prefix}pudipudi`)) {
        newUserChannel.leave();
    }
    else if (message.content.startsWith(`${prefix}set`)) {
        var user = message.content.split(" ")[1]
        var newSong = message.content.split(" ")[2]
        var userID = client.users.find(user).id;
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
    else if (message.content.startsWith(`${prefix}set`)) {
        return message.channel.send("!change [youtube link] ")
    }
});

client.login(token);
