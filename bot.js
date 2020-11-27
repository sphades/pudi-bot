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
let booleanMap = new Map();

client.on('voiceStateUpdate', (oldMember, newMember) => {
    //ideally just check that its someone joining the server
    // if (oldMember !== null) {
    //     if (!oldMember.channel.members.size-1)
    //         { //if only one in server, leave
    //             oldMember.channel.leave();
    //         }
    // }
    newUserChannel = newMember.channel;
    if(newUserChannel === null){
        console.log('someone left')
        if (oldMember.channel.members.size-1 == 0)
            { //if only one in server, bot leave
                oldMember.channel.leave();
            }
      }
    if (newMember.id === '781557440902463508') return; //if the new addition is the bot, ignore
    if (booleanMap.get(newMember.guild.id) === undefined) {
        booleanMap.set(newMember.guild.id, true)
        console.log('Add Bool for this server')
    }
    if (users.get(newMember.member.id) === undefined){
        users.set(newMember.member.id, defaultSong)
        console.log('Add user');
    }
    
    console.log(newMember.member.id)
    console.log(newMember.member.displayName)
    var song = users.get(newMember.member.id)
    console.log(song)
    if (booleanMap.get(newMember.guild.id)) {
        try {
            console.log("Joined vc with id " + newUserChannel);
            newUserChannel.join().then(connection => {
                connection.play(ytdl(song)).on("finish", () => {
                    //newUserChannel.leave(); //need to figure this out
                    console.log('played finish')
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
        if (message.author.id !== message.guild.owner.id)  
        {
             //some message saying that your not the owner}
            message.channel.send("You are not the owner.")
            return;
            }   
        try{
        var split = message.content.split(" ")
        var user = split[1]
        var newSong = split[2]
        //console.log(client.users.cache)
        var userID = client.users.cache.find(u => u.tag === user).id; //try a different method to find number of users
        console.log(userID)
        users.set(userID, newSong)
        console.log(users.get(userID))
        message.channel.send(`${newSong} set for ${client.users.cache.get(userID)}`)
        }
        catch (err) {
            console.log(err)
        }
    }
    else if (message.content.startsWith(`${prefix}toggle`)) {
        booleanMap.set(message.guild.id, !booleanMap.get(message.guild.id))
    }
    else if (message.content.startsWith(`${prefix}list`)) {
        users.forEach( x => {
            console.log(x)
            message.channel.send(`${x.id} current song is ${x}`)
        })
    }
});

//only server owner can !set
//only save information into json
//show list of people with set songs

client.login(token);
