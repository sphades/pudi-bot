const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const Keyv = require('keyv');
const KeyvFile = require('keyv-file').KeyvFile
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

const users = new Keyv({store: new KeyvFile({filename:'storage.json',})});
users.on('error', err => console.error('Keyv connection error:', err));
let newUserChannel = ''
let defaultSong = 'https://www.youtube.com/watch?v=KZ9l85fOq1Y'
let booleanMap = new Map();

client.on('voiceStateUpdate',  async (oldMember, newMember) => {
    let oldVoice = oldMember.channelID; 
    let newVoice = newMember.channelID;
    console.log(oldVoice)
    console.log(newVoice)
    let important = false; 
    if(oldVoice !== newVoice) {
        if(!oldMember.streaming && !oldMember.selfVideo && !newMember.streaming && !newMember.selfVideo){
            important = true;
        }
     }
    if (important){
    newUserChannel = newMember.channel;
    if (newUserChannel === null) {
        console.log('someone left')
        if (oldMember.channel.members.size - 1 == 0) { //if only one in server, bot leave
            oldMember.channel.leave();
        }
        return
    }
    if (newMember.id === '781557440902463508') return; //if the new addition is the bot, ignore
    if (newMember.id === '235088799074484224') return; //ignore music bot 
    if (booleanMap.get(newMember.guild.id) === undefined) {
        booleanMap.set(newMember.guild.id, true)
        console.log('Add Bool for this server')
    }
    if (await users.get(newMember.member.id) === undefined) {
        await users.set(newMember.member.id, defaultSong)
        console.log('Add user');
    }

    console.log(newMember.member.id)
    console.log(newMember.member.displayName)
    var song = await users.get(newMember.member.id)
    await console.log(song)
    if (booleanMap.get(newMember.guild.id)) {
        try {
            console.log("Joined vc with id " + newUserChannel);
            const connection = await newUserChannel.join()
            const dispatcher = await connection.play(ytdl(song, { filter: 'audioonly' }))
            dispatcher.on("finish", () => {
                newUserChannel.leave();
            })
            dispatcher.on('error', console.error);
        } catch (err) {
            console.log(err);
        }
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
        if (message.author.id !== message.guild.owner.id) {
            //some message saying that your not the owner}
            message.channel.send("You are not the owner.")
            return;
        }
        try {
            var split = message.content.split(" ")
            var user = split[1]
            var newSong = split[2]
            var temp = client.users.cache.find(u => u.tag === user); //try a different method to find number of users
            if (temp === undefined) { message.channel.send("User not found"); return }
            else {
                let userID = temp.id
                console.log(userID)
                await users.set(userID, newSong)
                await console.log(users.get(userID))
                await message.channel.send(`${newSong} set for ${client.users.cache.get(userID)}`)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    else if (message.content.startsWith(`${prefix}toggle`)) {
        booleanMap.set(message.guild.id, !booleanMap.get(message.guild.id))
    }
    else if (message.content.startsWith(`${prefix}list`)) {
        
    }
    else if (message.content.startsWith(`${prefix}reset`)){
        await users.clear();
        await message.channel.send("All users resetted")
    }
});

//only server owner can !set (done)
//only save information into json (done)
//show list of people with set songs ()
//only run on joining (done)

client.login(token);
