const mineflayer = require('mineflayer');
const http = require('http');

// 1. KEEP-ALIVE SERVER (For Render)
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is active and RTP-ing!');
}).listen(process.env.PORT || 3000);

const botArgs = {
    host: 'infernomc.progamer.me', // Change this
    port: 25565,             
    username: 'Spectator',   // Bot's name
    password: 'spectator123', // Bot's password
    version: '1.20.1'        // Set to your server version
};

function createBot() {
    console.log(`--- Connecting as ${botArgs.username} ---`);
    const bot = mineflayer.createBot(botArgs);

    // 2. AUTHENTICATION LOGIC (Register or Login)
    bot.on('messagestr', (message) => {
        const msg = message.toLowerCase();
        
        if (msg.includes('/register')) {
            console.log('Registering new account...');
            // Most plugins use: /register <pass> <pass>
            setTimeout(() => bot.chat(`/register ${botArgs.password} ${botArgs.password}`), 2000);
        } 
        else if (msg.includes('/login')) {
            console.log('Logging in...');
            setTimeout(() => bot.chat(`/login ${botArgs.password}`), 2000);
        }
    });

    bot.on('spawn', () => {
        console.log('✔ Bot is in the server!');

        // 3. THE RTP LOOP (Anti-AFK)
        // Sends /rtp every 5 to 8 minutes
        if (!bot.rtpInterval) {
            bot.rtpInterval = setInterval(() => {
                console.log('Sending /rtp to prevent AFK kick...');
                bot.chat('/rtp');
            }, (5 * 60000) + (Math.random() * 3 * 60000));
        }
    });

    // Error & Kick handling
    bot.on('kicked', (reason) => console.log('Kicked for:', reason));
    bot.on('error', (err) => console.log('Error:', err));

    // Reconnect Logic
    bot.on('end', () => {
        console.log('✘ Connection lost. Reconnecting in 45 seconds...');
        if (bot.rtpInterval) clearInterval(bot.rtpInterval);
        setTimeout(createBot, 45000); 
    });
}

createBot();
