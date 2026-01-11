const mineflayer = require('mineflayer');
const http = require('http');

// 1. DUMMY SERVER (Stops Render from killing the process)
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Spectator Bot is Online');
}).listen(process.env.PORT || 3000);

const botArgs = {
    host: '57.128.115.134', 
    port: 27811,                  
    username: 'Spectator',
    password: 'spectator123',
    version: '1.20.1',        // Force version for stability
    physicsEnabled: false,    // Fix for 1.20.2+ connection bugs
    checkTimeoutInterval: 60000 
};

function createBot() {
    console.log(`[${new Date().toLocaleTimeString()}] Attempting connection...`);
    const bot = mineflayer.createBot(botArgs);

    // 2. REGISTER/LOGIN LOGIC
    bot.on('messagestr', (message) => {
        const msg = message.toLowerCase();
        if (msg.includes('/register')) {
            console.log('Sending Registration...');
            setTimeout(() => bot.chat(`/register ${botArgs.password} ${botArgs.password}`), 2000);
        } else if (msg.includes('/login')) {
            console.log('Sending Login...');
            setTimeout(() => bot.chat(`/login ${botArgs.password}`), 2000);
        }
    });

    bot.on('spawn', () => {
        console.log('✔ SUCCESS: Bot spawned in world.');
        
        // Re-enable physics after safe spawn
        bot.physicsEnabled = true;

        // 3. THE RTP LOOP (Runs every 6 minutes)
        if (!bot.rtpInterval) {
            bot.rtpInterval = setInterval(() => {
                console.log('Executing /rtp...');
                bot.chat('/rtp');
            }, 360000); 
        }
    });

    // 4. DETAILED ERROR LOGGING
    bot.on('kicked', (reason) => {
        console.log('❌ KICKED BY SERVER:', reason);
    });

    bot.on('error', (err) => {
        console.log('❌ CONNECTION ERROR:', err.message);
    });

    // 5. AUTO-RECONNECT (45 second cooldown)
    bot.on('end', () => {
        console.log('✘ Connection lost. Waiting 45s to retry...');
        if (bot.rtpInterval) clearInterval(bot.rtpInterval);
        setTimeout(createBot, 45000); 
    });
}

createBot();
