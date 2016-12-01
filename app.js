var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
    	session.sendTyping();
        session.send("Hello... I'm a decision bot.");
        session.beginDialog('/menu');
    },
    function (session, results) {
        session.endConversation("Goodbye until next time...");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "Choose an option:", 'Flip A Coin|Roll Dice|Magic 8-Ball|huuhaa|Quit');
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('/flipCoin');
                break;
            case 1:
                session.beginDialog('/rollDice');
                break;
            case 2:
                session.beginDialog('/magicBall');
                break;
            case 3:
                session.beginDialog('/huuhaa');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function (session) {
        // Reload menu
        session.replaceDialog('/menu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });

bot.dialog('/flipCoin', [
    function (session, args) {
        builder.Prompts.choice(session, "Choose heads or tails.", "heads|tails", { listStyle: builder.ListStyle.list })
    },
    function (session, results) {
        var flip = Math.random() > 0.5 ? 'heads' : 'tails';
        if (flip == results.response.entity) {
            session.endDialog("It's %s. YOU WIN!", flip);
        } else {
            session.endDialog("Sorry... It was %s. you lost :(", flip);
        }
    }
]);

bot.dialog('/rollDice', [
    function (session, args) {
        builder.Prompts.number(session, "How many dice should I roll?");
    },
    function (session, results) {
        if (results.response > 0) {
            var msg = "I rolled:";
            for (var i = 0; i < results.response; i++) {
                var roll = Math.floor(Math.random() * 6) + 1;
                msg += ' ' + roll.toString(); 
            }
            session.endDialog(msg);
        } else {
            session.endDialog("Ummm... Ok... I rolled air.");
        }
    }
]);

bot.dialog('/magicBall', [
    function (session, args) {
    	session.sendTyping();
        builder.Prompts.text(session, "What is your question?");
    },
    function (session, results) {
        // Use the SDK's built-in ability to pick a response at random.
        builder.Prompts.text(session, "This is easy :)");        
        session.endDialog(magicAnswers);
    }
]);

var magicAnswers = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
];

bot.dialog('/huuhaa', [
    function (session, args) {
        builder.Prompts.text(session, "What is huuhaa is in you head");
    },
    function (session, results) {
        // Use the SDK's built-in ability to pick a response at random.
        builder.Prompts.text(session, ":)");        
    },
    function (session, results) {
        // Use the SDK's built-in ability to pick a response at random.
        builder.Prompts.text(session, "I agree");        
        session.endDialog(magicAnswers);
    }
]);