const mineflayer = require('mineflayer');

const botArgs = {
    host: 'infernomc.progamer.me', 
    port: 25565,                  
    username: 'SpecBot_247',
    password: 'YOUR_PASSWORD_HERE', // Set your bot's password here
    version: false                
};

function createBot() {
    const bot = mineflayer.createBot(botArgs);

    // This handles the Login Plugin
    bot.on('messagestr', (message) => {
        const msg = message.toLowerCase();
        
        if (msg.includes('/login')) {
            console.log('Login requested. Sending password...');
            bot.chat(`/login ${botArgs.password}`);
        } 
        else if (msg.includes('/register')) {
            console.log('Register requested. Registering...');
            bot.chat(`/register ${botArgs.password} ${botArgs.password}`);
        }
    });

    bot.on('spawn', () => {
        console.log('Bot spawned! Waiting to ensure login completes...');
        
        // Wait 5 seconds after spawn, then enter spectator mode
        setTimeout(() => {
            bot.chat('/gamemode spectator');
        }, 5000);

        // Anti-AFK Loop: Small movement every 20 seconds
        if (!bot.afkInterval) {
            bot.afkInterval = setInterval(() => {
                const actions = ['forward', 'back', 'left', 'right', 'jump'];
                const randomAction = actions[Math.floor(Math.random() * actions.length)];
                
                bot.setControlState(randomAction, true);
                setTimeout(() => bot.setControlState(randomAction, false), 1000);
            }, 20000);
        }
    });

    bot.on('end', () => {
        console.log('Disconnected. Reconnecting in 10 seconds...');
        if (bot.afkInterval) clearInterval(bot.afkInterval);
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => console.log('Error:', err));
    bot.on('kicked', (reason) => console.log('Kicked for:', reason));
}

createBot();
