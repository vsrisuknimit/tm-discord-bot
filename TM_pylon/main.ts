// Pylon bot for Terraforming Mars web app Discord server
// Written mostly by Jeep with helps from chosta and folks at Pylon discords

// Definte prefix for pylon. ! is currently used by Apollo.
const commands = new discord.command.CommandGroup({
  defaultPrefix: '$'
});

// Some constants specific to the TM Web App server
// Emoji ID
const preludeEmoji = '<:exp_prelude:743207309936689282>';
const venusEmoji = '<:exp_venus:743207309723041823>';
const colonyEmoji = '<:exp_colony:743207309894877265>';
const turmoilEmoji = '<:exp_turmoil:743207309525909597>';
const promoEmoji = '<:exp_promo:743207309903265891>';
const yesReaction = 'choice_yes:742725736565047346';
const noReaction = 'choice_no:742725736485355600';
const yesEmoji = `<:${yesReaction}>`;
const noEmoji = `<:${noReaction}>`;
const anyEmoji = '<:choice_any:748245986605924473>';
const microbeEmoji = '<:tag_microbe:742698267590262834>';
const sciEmoji = '<:tag_science:750082546380963986>';
const vpEmoji = '<:vp:742698267917418666>';
const trEmoji = '<:tr:743106789569986590>';
const cardEmoji = '<:card:742908104332804168>';
const jovianEmoji = '<:tag_jovian:742698267514503208>';

// User ID
const USERID_PYLON = '270148059269300224';

// Channel ID
const CHANNELID_lfg = '739776164297441391';
const CHANNELID_botTest = '745088154096369745';
const CHANNELID_generalchat = '737945098695999562';
const CHANNELID_phobos = '742838127730622585';
const CHANNELID_deimos = '742838198593650799';
const CHANNELID_europa = '742838245800542258';
const CHANNELID_ganymede = '743579949553942631';
const CHANNELID_titan = '743579990880157769';
const CHANNELID_gametalk = '742826825922904225';
const CHANNELID_gameresult = '746828659150684251';
const CHANNELID_tournament = '749499857240195133';
const CHANNELID_searchzone = '751040806386663456';

const GUILDID_TFMARS_WEB_APP = '737945098695999559';

const ROLE_ASSIGNMENT_MESSAGE_ID = '753188826092142604';
const ROLEID_BEGINNER = '748467469001424937';
const ROLEID_INTERMEDIATE = '748467638916874302';
const ROLEID_EXPERIENCED = '748467689193865253';
const ROLEID_LIFEFINDER = '750320147088015360';
const ROLEID_HERALD = '752880241084596324';

const COMMAND_COOLDOWN = 60;
const COMMAND_COOLWARNING =
  'This command was used recently (less than 1 hour ago).';

// import card library from another typescript file in pylon
import { cardID, microbeCards, otherLifeCards } from './cardlibrary';

import { playerPresets } from './gamepreset';

import {
  HELPLFG,
  HELP_GENERAL,
  HELP_2V2,
  HELP_ROVER,
  HELP_WEATHER,
  HELP_CARD,
  HELP_MEME,
  HELP_APOD,
  HELP_POLL,
  HELP_D,
  HELP_FLIP,
  HELP_SETUP,
  HELP_SEARCH,
  HELP_CHANGELOG,
  HELP_DRAFT,
  HELP_MUSIC,
  HELP_TEAM,
  HELP_FAQ,
  HELP_BUG,
  HELP_GLOBALEVENTS,
  HELP_POSITIVEEVENTS,
  HELP_BETA,
  HELP_INFLUENCE,
  HELP_DEMO
} from './helptext';

// import fuzzysort written by farzher at https://github.com/farzher/fuzzysort
// translate to ts by Alex at Pylon discord: https://owo.gg/snippets/2
import fuzzysort from './fuzzysort';

// Jeep's NASA API key
import { NASAAPIkey } from './apikey';

// Shorten filter system
const F = discord.command.filters;

// Pull all card names here once as a const
const cardNames = Array.from(cardID.keys());

// Card pulling system
commands.on(
  {
    name: 'card'
  },
  (args) => ({
    input: args.text()
  }),
  async (message, { input }) => {
    const cardQuery = input.toLowerCase();
    // Check if there is an exact match
    if (cardID.has(cardQuery)) {
      // Get the url to my github card images
      const geturl =
        'https://github.com/vsrisuknimit/tm-discord-bot/blob/master/TM_cards/' +
        cardID.get(cardQuery) +
        '-' +
        cardQuery.replace(/ /g, '_') +
        '.png?raw=true';
      console.log(geturl);
      // Constructing the rich embed and reply
      const richEmbed = new discord.Embed();
      //richEmbed.setTitle('Card name: ' + cardQuery);
      richEmbed.addField({
        name: cardQuery.toUpperCase(),
        value:
          '[link](https://ssimeonoff.github.io/cards-list#' +
          cardID.get(cardQuery) +
          ')'
      });
      richEmbed.setColor(0x657569);
      richEmbed.setImage({ url: geturl });
      await message.reply({ content: '', embed: richEmbed });
    } else {
      // If the key is not found, let's search on the database for a close match.
      const results = fuzzysort().go(cardQuery, cardNames);
      // Let's see what result we get
      console.log(results);
      // If we get any result at all, we can pull the first element which has the highest rank
      if (results[0] != undefined) {
        // We want to make sure that the rank is still a good match. I arbitarily pick -3000 after some tests.
        if (results[0].score > -3000) {
          console.log('Good score:' + results[0].score);
          // Get the best match card name
          const bestResult = results[0].target;
          console.log(bestResult);
          await message.reply(
            'Exact match not found. Do you mean "' + bestResult + '"?'
          );
          // Get the image url
          const geturl =
            'https://github.com/vsrisuknimit/tm-discord-bot/blob/master/TM_cards/' +
            cardID.get(bestResult) +
            '-' +
            bestResult.replace(/ /g, '_') +
            '.png?raw=true';
          console.log(geturl);
          // Construct the rich embed and reply
          const richEmbed = new discord.Embed();
          //richEmbed.setTitle('Card name: ' + bestResult);
          richEmbed.addField({
            name: bestResult.toUpperCase(),
            value:
              '[link](https://ssimeonoff.github.io/cards-list#' +
              cardID.get(bestResult) +
              ')'
          });
          richEmbed.setColor(0x657569);
          richEmbed.setImage({ url: geturl });
          await message.reply({ content: '', embed: richEmbed });
        } else {
          // If the best match has pretty bad score, we don't want to give that. Card not found
          console.log('Bad score:' + results[0].score);
          await message.reply('Card not found.');
        }
      } else {
        // If we don't get any match at all just say card not found.
        await message.reply('Card not found.');
      }
    }
  }
);

const searchforlifeKV = new pylon.KVNamespace('search for life');

commands.subcommand(
  {
    name: 'search',
    filters: F.or(
      F.isChannelId(CHANNELID_botTest),
      F.isChannelId(CHANNELID_searchzone)
    )
    //filters: F.canManageChannels()
  },
  (subcommand) => {
    subcommand.raw(
      { name: 'init', filters: F.canManageChannels() },
      async (message) => {
        await searchforlifeKV.put('winners', {
          list: [
            '372490639738273794',
            '390786155219648513',
            '183721137417486336',
            '261781818158612481',
            '699318073399836722'
          ],
          periodSearcher: []
        });
        message.reply(
          'Search KV reinitiated. Cleared all past winners. Role given was not revoked.'
        );
      }
    );

    subcommand.raw({ name: 'list' }, async (message) => {
      const winners = await searchforlifeKV.get('winners');
      console.log(winners.list);
      if (winners.list.length != 0) {
        var winnerNameList = [];
        for (let winnerid of winners.list) {
          const winnername = await discord.getUser(winnerid);
          winnerNameList.push(winnername.toMention());
        }
        await message.reply({
          content: `These are the previous life finders: ${winnerNameList.join(
            ', '
          )}`,
          allowedMentions: {}
        });
      } else {
        await message.reply('There has been no life found.');
      }
    });

    subcommand.default(
      (ctx) => ({}),
      async (message) => {
        const commandStat = await commandKV.get('search');
        var diff = Date.now() - commandStat.lastUseWhen;
        diff /= 1000 * 60; //(convert from millisec to min)
        console.log(diff);
        const search_COOLDOWN = 3;
        var winnerList = await searchforlifeKV.get('winners');
        if (winnerList.periodSearcher.includes(message.author.id)) {
          message.reply(
            'You have searched recently. Please wait 6 hours after your previous search before trying again.'
          );
        } else if (diff > search_COOLDOWN) {
          // Pull all card names here once as a const
          const totalProjectCards = 363;
          const cardNames = Array.from(cardID.keys()).slice(
            0,
            totalProjectCards
          );
          const randomCard =
            cardNames[Math.floor(Math.random() * totalProjectCards)];
          //const randomCard = 'search for life';
          const geturl =
            'https://github.com/vsrisuknimit/tm-discord-bot/blob/master/TM_cards/' +
            cardID.get(randomCard) +
            '-' +
            randomCard.replace(/ /g, '_') +
            '.png?raw=true';
          console.log('Your random card is ' + randomCard);
          var title = '';
          // Put in list of winner
          if (microbeCards.includes(randomCard)) {
            title =
              `${message.author.username} found life! ` +
              microbeEmoji +
              sciEmoji;

            // Assign a new role
            const guildMember = await discord
              .getGuild(GUILDID_TFMARS_WEB_APP)
              .then((c) => c?.getMember(message.author.id));
            await guildMember.addRole(ROLEID_LIFEFINDER);

            if (!winnerList.list.includes(message.author.id)) {
              winnerList.list.push(message.author.id);
            }
          } else if (randomCard == 'potatoes') {
            title =
              'You found potatoes. Matt Damon would be proud, space botanist!';
          } else if (otherLifeCards.includes(randomCard)) {
            title = "This ain't the life you are looking for. 😦";
          } else if (randomCard === 'search for life') {
            title =
              `${message.author.username} found the life finder!!!` +
              microbeEmoji +
              sciEmoji;

            // Assign a new role
            const guildMember = await discord
              .getGuild(GUILDID_TFMARS_WEB_APP)
              .then((c) => c?.getMember(message.author.id));
            await guildMember.addRole(ROLEID_HERALD);
          } else {
            title = 'No sign of life. 🔬';
          }
          //winnerList.periodSearcher = [message.author.id];
          if (!winnerList.periodSearcher.includes(message.author.id)) {
            winnerList.periodSearcher.push(message.author.id);
          }
          await searchforlifeKV.put('winners', {
            list: winnerList.list,
            periodSearcher: winnerList.periodSearcher
          });
          const richEmbed = new discord.Embed();
          richEmbed.setTitle(title);
          richEmbed.setImage({ url: geturl });
          richEmbed.setFooter({ text: 'Card: ' + randomCard });
          richEmbed.setColor(0xffffff);
          await message.reply({ content: '', embed: richEmbed });

          await commandKV.put('search', {
            lastUseAt: 'no_url',
            lastUseWhen: Date.now()
          });
        } else {
          message.reply(
            `Our rover is busy. Someone just searched recently. Please wait a bit (${search_COOLDOWN} min) before trying again.`
          );
        }
      }
    );
  }
);

pylon.tasks.cron('search-cleaner', '0 0 0/6 * * * *', async () => {
  console.log('log every 6 hours to clean up period searchers');
  const winners = await searchforlifeKV.get('winners');
  await searchforlifeKV.put('winners', {
    list: winners.list,
    periodSearcher: []
  });
  const searchChannel = await discord.getTextChannel(CHANNELID_searchzone);
  await searchChannel.sendMessage(
    'Search history cleared. Everyone can now search again.'
  );
});

commands.raw('changelog', async (message) => {
  message.reply(HELP_CHANGELOG);
});

commands.raw('beta', async (message) => {
  message.reply(HELP_BETA);
});

commands.raw('demo', async (message) => {
  message.reply(HELP_DEMO);
});

//coin flip
commands.raw({ name: 'flip', aliases: ['toss', 'coin'] }, async (message) => {
  if (Math.random() < 0.5) {
    await message.reply('👍 A coin is tossed. The result is HEAD.');
  } else {
    await message.reply('👍 A coin is tossed. The result is TAIL.');
  }
});

commands.on(
  {
    name: 'd',
    aliases: ['dice', 'd6', 'roll']
  },
  (args) => ({
    diceType: args.integerOptional()
  }),
  async (message, { diceType }) => {
    diceType = diceType ?? 6;
    const diceRoll = 1 + Math.floor(Math.random() * diceType);
    await message.reply(
      `${message.author.username} rolled a d${diceType} and they got ${diceRoll}!`
    );
  }
);

// Team generator

commands.on(
  {
    name: 'team',
    filters: F.or(
      F.isChannelId(CHANNELID_botTest),
      F.isChannelId(CHANNELID_generalchat),
      F.isChannelId(CHANNELID_gametalk),
      F.isChannelId(CHANNELID_lfg),
      F.isChannelId(CHANNELID_phobos),
      F.isChannelId(CHANNELID_deimos),
      F.isChannelId(CHANNELID_europa),
      F.isChannelId(CHANNELID_ganymede),
      F.isChannelId(CHANNELID_titan)
    )
  },
  (args) => ({
    numTeam: args.integer(),
    userText: args.text()
  }),
  async (message, { numTeam, userText }) => {
    // Parsing
    var myRegexp = /[^\s"]+|"([^"]*)"/gi;
    var argsArray = [];
    do {
      //Each call to exec returns the next regex match as an array
      var match = myRegexp.exec(userText);
      if (match != null) {
        //Index 1 in the array is the captured group if it exists
        //Index 0 is the matched text, which we use if no captured group exists
        argsArray.push(match[1] ? match[1] : match[0]);
      }
    } while (match != null);

    // Shuffle
    const shuffleList = shuffle(argsArray);
    console.log(shuffleList);

    // Chunkify
    const listTeam = chunkify(shuffleList, numTeam, true);
    console.log(listTeam);

    var teamPrint = '';
    const teamName = [
      'Alpha',
      'Beta',
      'Gamma',
      'Delta',
      'Epsilon',
      'Pi',
      'Rho',
      'Sigma',
      'Tau',
      'Chi',
      'Omega'
    ];
    for (let i in listTeam) {
      teamPrint += `Team ${teamName[i]}: ${listTeam[i].join(', ')}\n`;
    }
    await message.reply({ content: teamPrint, allowedMentions: {} });
  }
);

// Initiate KV commands
commands.raw(
  {
    name: 'commandInit',
    filters: discord.command.filters.canManageChannels()
  },
  async (message) => {
    await commandKV.clear();
    await commandKV.put('ping', { lastUseAt: '', lastUseWhen: 0 });
    await commandKV.put('apod', { lastUseAt: '', lastUseWhen: 0 });
    await commandKV.put('weather', { lastUseAt: '', lastUseWhen: 0 });
    await commandKV.put('rover', { lastUseAt: '', lastUseWhen: 0 });
    await commandKV.put('setup', { lastUseAt: '', lastUseWhen: 0 });
    await commandKV.put('search', { lastUseAt: '', lastUseWhen: 0 });
    await message.reply('Cleared and initiated command KV. Reset timing.');
  }
);

// Github repo: https://github.com/SliceOfBread/tm_cardmaker
commands.raw('design', (message) => {
  message.reply(
    'You can visit this nice web site to design your own TM card(s): https://sliceofbread.neocities.org/tm/tm_cardmaker.html'
  );
});

// Simon's card list
commands.raw(
  {
    name: 'allcards',
    aliases: ['allcard', 'cardlist']
  },
  (message) => {
    message.reply(
      "Visit Simon's card database to look at all the cards: https://ssimeonoff.github.io/cards-list"
    );
  }
);

// Simon's card list
commands.raw(
  {
    name: 'newhand',
    aliases: ['startinghand']
  },
  (message) => {
    message.reply(
      "Visit Simon's starting hand page to deal yourself a hand of cards and think about what to pick: https://ssimeonoff.github.io/setup"
    );
  }
);

// Catching all defeault command with the prefix
commands.defaultRaw(async (message) => {
  message.reply(`Not a valid command! \`$help\` for help.`);
});

// A help command
// Without an argument it gives the list of commands.
// With an argument, it tells what the command does and how to use it.
commands.subcommand(
  {
    name: 'help'
  },
  (subcommand) => {
    subcommand.raw({ name: 'lfg' }, async (message) => {
      await message.reply(HELPLFG);
    });

    subcommand.raw({ name: 'rover' }, async (message) => {
      await message.reply(HELP_ROVER);
    });

    subcommand.raw({ name: 'bug' }, async (message) => {
      await message.reply(HELP_BUG);
    });

    subcommand.raw({ name: 'influence' }, async (message) => {
      await message.reply(HELP_INFLUENCE);
    });

    subcommand.raw({ name: 'team' }, async (message) => {
      await message.reply(HELP_TEAM);
    });

    subcommand.raw(
      { name: 'event', aliases: ['ge', 'globalevents', 'events'] },
      async (message) => {
        await message.reply(HELP_GLOBALEVENTS);
      }
    );

    subcommand.raw(
      {
        name: '+event',
        aliases: [
          '+ge',
          '+globalevents',
          '+events',
          'positiveevent',
          'positiveevents'
        ]
      },
      async (message) => {
        await message.reply(HELP_POSITIVEEVENTS);
      }
    );

    subcommand.raw(
      { name: 'faq', aliases: ['faqs', 'rule', 'rules'] },
      async (message) => {
        await message.reply(HELP_FAQ);
      }
    );

    subcommand.raw({ name: 'draft' }, async (message) => {
      await message.reply(HELP_DRAFT);
    });

    subcommand.raw({ name: 'demo', aliases: ['server'] }, async (message) => {
      await message.reply(HELP_DEMO);
    });

    subcommand.raw({ name: 'weather' }, async (message) => {
      await message.reply(HELP_WEATHER);
    });

    subcommand.raw({ name: 'card' }, async (message) => {
      await message.reply(HELP_CARD);
    });

    subcommand.raw({ name: 'music' }, async (message) => {
      await message.reply(HELP_MUSIC);
    });

    subcommand.raw({ name: 'search' }, async (message) => {
      await message.reply(HELP_SEARCH);
    });

    subcommand.raw({ name: 'host' }, async (message) => {
      const richEmbed = new discord.Embed();
      richEmbed.setTitle('How to host the TM web app');
      richEmbed.setColor(0xffc0cb);
      richEmbed.addField({
        name: 'Host locally',
        value:
          '[link](https://docs.google.com/document/d/1y-QnffzkQtpasBkDAFQwBoqhLmUpVTzRPybtvmbktDQ/edit)',
        inline: true
      });
      richEmbed.addField({
        name: 'Host on Heroku',
        value:
          '[link](https://github.com/bafolts/terraforming-mars/wiki/Heroku-Setup)',
        inline: true
      }); /*
      richEmbed.addField({
        name: 'Set up with Docker',
        value:
          '[link](https://drive.google.com/file/d/14hOxxLrCjhWJimvCyuLc-2JRrXevFiR1/view)',
        inline: true
      });*/
      await message.reply({ content: '', embed: richEmbed });
    });

    subcommand.raw({ name: 'marsmeme' }, async (message) => {
      await message.reply(HELP_MEME);
    });

    subcommand.raw({ name: 'apod' }, async (message) => {
      await message.reply(HELP_APOD);
    });

    subcommand.raw({ name: 'poll' }, async (message) => {
      await message.reply(HELP_POLL);
    });

    subcommand.raw({ name: '2v2' }, async (message) => {
      await message.reply(HELP_2V2);
    });

    subcommand.raw(
      { name: 'd', aliases: ['d6', 'dice', 'roll'] },
      async (message) => {
        await message.reply(HELP_D);
      }
    );

    subcommand.raw({ name: 'flip' }, async (message) => {
      await message.reply(HELP_FLIP);
    });

    subcommand.raw({ name: 'beta' }, async (message) => {
      await message.reply(HELP_BETA);
    });

    subcommand.raw({ name: 'setup' }, async (message) => {
      await message.reply(HELP_SETUP);
    });
    subcommand.default(
      (ctx) => ({ key: ctx.stringOptional() }),
      async (message, { key }) => {
        await message.reply(HELP_GENERAL);
      }
    );
  }
);

// Sign up tournament function

// A key value store is to record active rooms.
const signupKV = new pylon.KVNamespace('signup');

commands.on(
  {
    name: 'signup',
    filters: F.canManageChannels()
  },
  (args) => ({
    text: args.text()
  }),
  async (message, { text }) => {
    //Parse the arguments seperated by space but grouped quotation marks
    var myRegexp = /[^\s"]+|"([^"]*)"/gi;
    var argsArray = [];
    do {
      //Each call to exec returns the next regex match as an array
      var match = myRegexp.exec(text);
      if (match != null) {
        //Index 1 in the array is the captured group if it exists
        //Index 0 is the matched text, which we use if no captured group exists
        argsArray.push(match[1] ? match[1] : match[0]);
      }
    } while (match != null);

    console.log(argsArray);

    // Construct the poll
    var pollMessage;
    if (argsArray.length != 4) {
      pollMessage = await message.reply(
        'A question and three sign-up choices must be provided.'
      );
    } else {
      const richEmbed = new discord.Embed();
      richEmbed.setTitle('📝 Sign up for ' + argsArray[0]);
      richEmbed.setColor(0x00ff00);
      const options = argsArray.slice(1);
      for (let i in options) {
        richEmbed.addField({
          name: numberChoices[i] + options[i],
          value: '\u200b',
          inline: true
        });
      }
      const signupMessage = await message.reply({
        content: '',
        embed: richEmbed
      });
      for (let i in options) {
        await signupMessage.addReaction(numberChoices[i]);
      }
      await signupKV.clear();
      await signupKV.put(signupMessage.id, {
        channel: signupMessage.channelId,
        signers: [[], [], []]
      });
    }
  }
);

// Add and remove names for sign up
// If add choice_yes, sign up
discord.on('MESSAGE_REACTION_ADD', async (evt) => {
  if (
    evt.emoji.name === '1️⃣' ||
    evt.emoji.name === '2️⃣' ||
    evt.emoji.name === '3️⃣'
  ) {
    // First get the message that is being react to
    const message = await discord
      .getChannel(evt.channelId)
      .then((c) => c?.getMessage(evt.messageId));

    // Next get the list of messageid from lfgCheckKV
    const keyList = await signupKV.list();

    // Only do this command if the reacted message is one of lfg messages in the KV
    if (keyList.includes(message.id)) {
      console.log('Reacted message is in the list.');

      // Retrieve the reactor
      const reactor = await discord.getUser(evt.userId);
      console.log('Reactor ID');
      console.log(reactor.id);

      // Retrieve the JSON
      const kvItem = await signupKV.get(message.id);
      console.log('kvItem');
      console.log(kvItem);

      var signUpOption = 0;
      if (evt.emoji.name === '1️⃣') {
        signUpOption = 0;
      } else if (evt.emoji.name === '2️⃣') {
        signUpOption = 1;
      } else if (evt.emoji.name === '3️⃣') {
        signUpOption = 2;
      }
      const signuList = kvItem.signers;

      console.log('kvSigners for option: ' + evt.emoji.name);
      console.log(signuList[signUpOption]); //test

      // Only attempt to add a name if the reactor is not already in the list of signers
      if (!signuList[signUpOption].includes(reactor.id)) {
        console.log('attempting to add a name');
        // Get the embed
        const signupEmbed = message.embeds[0];

        // Loop through the Embed to find the sign up field and add a name to it
        for (const i in signupEmbed.fields) {
          if (parseInt(i) == signUpOption) {
            if (kvItem.signers[signUpOption].length == 0) {
              signupEmbed.fields[i].value = evt.member.nick ?? reactor.username;
            } else {
              signupEmbed.fields[i].value += `\n${evt.member.nick ??
                reactor.username}`;
            }
            break;
          }
        }

        // Update the embed
        await message.edit(signupEmbed);

        kvItem.signers[signUpOption].push(reactor.id);
        const newSigners = kvItem.signers;
        console.log('new sign up sheet: ' + newSigners);

        // Updating the KV after adding a player
        await signupKV.put(message.id, {
          channel: kvItem.channel,
          signers: newSigners
        });
        console.log('Here is the updated kv item after adding the player.');
        console.log(await signupKV.get(message.id));
      } else {
        console.log('The player is already in the list. No action is taken.');
      }
    }
  }
});

// If remove choice_yes, remove signer
discord.on('MESSAGE_REACTION_REMOVE', async (evt) => {
  if (
    evt.emoji.name === '1️⃣' ||
    evt.emoji.name === '2️⃣' ||
    evt.emoji.name === '3️⃣'
  ) {
    // First get the message that is being react to
    const message = await discord
      .getChannel(evt.channelId)
      .then((c) => c?.getMessage(evt.messageId));

    // Next get the list of messageid from lfgCheckKV
    const keyList = await signupKV.list();
    console.log(keyList);

    // Only do this command if the reacted message is one of lfg messages in the KV
    if (keyList.includes(message.id)) {
      // Retrieve the reactor
      const reactor = await discord.getUser(evt.userId);

      // Retrieve the JSON
      const kvItem = await signupKV.get(message.id);
      console.log(
        'Checking if react remover id ' + reactor.id + ' is in the sign up:'
      );
      var signUpOption = 0;
      if (evt.emoji.name === '1️⃣') {
        signUpOption = 0;
      } else if (evt.emoji.name === '2️⃣') {
        signUpOption = 1;
      } else if (evt.emoji.name === '3️⃣') {
        signUpOption = 2;
      }
      console.log(kvItem.signers[signUpOption]);
      // Only attempt to do this if the react remover alraedy signed up
      if (kvItem.signers[signUpOption].includes(reactor.id)) {
        console.log('Yes, already signed up. So attempting to remove a name');

        // Get the embed
        const signupEmbed = message.embeds[0];

        console.log(
          'sign up sheet before deletion: ' + kvItem.signers[signUpOption]
        );
        //Remove the reactor remover from the signer list
        const index = kvItem.signers[signUpOption].indexOf(reactor.id, 0);
        if (index > -1) {
          kvItem.signers[signUpOption].splice(index, 1);
        }

        //delete kvItem.signers[reactor.id];
        console.log(
          'sign up sheet AFTER deletion: ' + kvItem.signers[signUpOption]
        );

        // Updating the KV
        await signupKV.put(message.id, {
          channel: kvItem.channel,
          time: kvItem.time,
          signers: kvItem.signers
        });

        console.log('Here is the updated kv item after adding the player.');
        console.log(await signupKV.get(message.id));

        // Looping through field to find sign up and remove the name there.
        for (const i in signupEmbed.fields) {
          if (parseInt(i) == signUpOption) {
            signupEmbed.fields[signUpOption].value = '';
            for (const signerid of kvItem.signers[signUpOption]) {
              const signerUser = await discord.getUser(signerid);
              const guildMember = await discord
                .getGuild(evt.guildId)
                .then((c) => c?.getMember(signerid));
              signupEmbed.fields[signUpOption].value += `${guildMember.nick ??
                signerUser.username}\n`;
            }
            if (signupEmbed.fields[signUpOption].value == '') {
              signupEmbed.fields[signUpOption].value = '\u200b';
            }
            break;
          }
        }

        // Update the embed
        await message.edit(signupEmbed);
      }
    }
  }
});

// Array of number emojis
const numberChoices = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

// Declared this previously const F = discord.command.filters;
// Poll function
commands.on(
  {
    name: 'poll',
    filters: F.not(F.isChannelId(CHANNELID_lfg))
  },
  (args) => ({
    text: args.text()
  }),
  async (message, { text }) => {
    //Parse the arguments seperated by space but grouped quotation marks
    var myRegexp = /[^\s"]+|"([^"]*)"/gi;
    var argsArray = [];
    do {
      //Each call to exec returns the next regex match as an array
      var match = myRegexp.exec(text);
      if (match != null) {
        //Index 1 in the array is the captured group if it exists
        //Index 0 is the matched text, which we use if no captured group exists
        argsArray.push(match[1] ? match[1] : match[0]);
      }
    } while (match != null);

    console.log(argsArray);

    // Construct the poll
    var pollMessage;
    if (argsArray.length > 5) {
      pollMessage = await message.reply(
        'Only four answers or fewer are allowed.'
      );
    } else if (argsArray.length == 1) {
      pollMessage = await message.reply('📊 Poll: ' + argsArray[0]);
      await pollMessage.addReaction(yesReaction);
      await pollMessage.addReaction(noReaction);
    } else {
      var pollString = '📊 Poll: ' + argsArray[0] + '\n\u200b';
      const options = argsArray.slice(1);
      for (let i in options) {
        pollString += '\n    ' + numberChoices[i] + ' ' + options[i];
      }
      pollString += '\n\u200b';
      pollMessage = await message.reply(pollString);
      for (let i in options) {
        await pollMessage.addReaction(numberChoices[i]);
      }
    }
  }
);

// A command to get an image from Curiosity rover
const roverURL1 =
  'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=';
const roverURL2 = '&camera=fhaz&api_key=';
commands.on(
  {
    name: 'rover',
    filters: F.or(
      F.isChannelId(CHANNELID_botTest),
      F.isChannelId(CHANNELID_generalchat)
    )
  },
  (args) => ({
    date: args.stringOptional()
  }),
  async (message, { date }) => {
    const commandStat = await commandKV.get('rover');
    var diff = Date.now() - commandStat.lastUseWhen;
    diff /= 1000 * 60; //(convert from millisec to min)
    console.log(diff);
    if (diff > COMMAND_COOLDOWN) {
      // If date is not provided, set date to 2 days before today.
      if (!date) {
        var d = new Date();
        d.setDate(d.getDate() - 2);
        date = d.toISOString().split('T')[0];
        console.log(date);
      }
      // Compose the url and fetch it.
      const req = await fetch(roverURL1 + date + roverURL2 + NASAAPIkey);
      // Parse the request's JSON body:
      const data = await req.json();
      // If no photo, says so.
      var messageURL = '';
      if (data['photos'].length == 0) {
        const mReply = await message.reply('no photo on this date');
        messageURL = `https://discordapp.com/channels/${message.guildId}/${mReply.channelId}/${mReply.id}`;
        // Otherwise, construct a rich embed to return the photo
      } else {
        const random = Math.floor(Math.random() * data['photos'].length);
        var randomImage = data['photos'][random];
        const richEmbed = new discord.Embed();
        richEmbed.setTitle('Here is what Mars Curiosity rover saw on ' + date);
        richEmbed.setColor(0x00ff00);
        richEmbed.setImage({ url: randomImage['img_src'] });
        const mReply = await message.reply({ content: '', embed: richEmbed });
        messageURL = `https://discordapp.com/channels/${message.guildId}/${mReply.channelId}/${mReply.id}`;
      }

      await commandKV.put('rover', {
        lastUseAt: messageURL,
        lastUseWhen: Date.now()
      });
    } else {
      message.reply(
        `${COMMAND_COOLWARNING} Please check out the previous call at: ${commandStat.lastUseAt}`
      );
    }
  }
);
// A command to return the weather
const insightURL1 = 'https://api.nasa.gov/insight_weather/?api_key=';
const insightURL2 = '&feedtype=json&ver=1.0';
commands.raw(
  {
    name: 'weather',
    filters: F.or(
      F.isChannelId(CHANNELID_botTest),
      F.isChannelId(CHANNELID_generalchat)
    )
  },
  async (message) => {
    const commandStat = await commandKV.get('weather');
    var diff = Date.now() - commandStat.lastUseWhen;
    diff /= 1000 * 60; //(convert from millisec to min)
    console.log(diff);
    if (diff > COMMAND_COOLDOWN) {
      // Compile the URL and fetch
      const req = await fetch(insightURL1 + NASAAPIkey + insightURL2);
      console.log(insightURL1 + NASAAPIkey + insightURL2);
      const data = await req.json();
      // Get the latest date
      const solKey = data['sol_keys'];
      if (solKey.length != 0) {
        const latestSol = solKey.slice(-1)[0];
        console.log('sol Key: ' + solKey);
        console.log('data from latest Sol: ' + data[latestSol]);
        // Extract the weather data.
        const latestDay = data[latestSol]['First_UTC'].substring(0, 10);
        const highTemp = data[latestSol]['AT']['mx'].toFixed(1) + ' °c';
        const lowTemp = data[latestSol]['AT']['mn'].toFixed(1) + ' °c';
        const aveTemp = data[latestSol]['AT']['av'].toFixed(1) + ' °c';

        const season = data[latestSol]['Season'];
        // Construct the rich embed to return the weather data
        const richEmbed = new discord.Embed();
        richEmbed.setTitle(
          'Here is the latest weather data measured by Insight Mars lander at Elysium Planitia:'
        );
        richEmbed.setColor(0xeb984e);
        richEmbed.addField({ name: 'Sol', value: latestSol, inline: true });
        richEmbed.addField({ name: 'Day', value: latestDay, inline: true });
        richEmbed.addField({ name: 'Season', value: season, inline: true });
        richEmbed.addField({ name: 'High', value: highTemp, inline: true });
        richEmbed.addField({ name: 'Low', value: lowTemp, inline: true });
        richEmbed.addField({ name: 'Average', value: aveTemp, inline: true });
        richEmbed.setFooter({
          text: 'Powered by NASA API: https://mars.nasa.gov/insight/weather/'
        });
        const mReply = await message.reply({ content: '', embed: richEmbed });
        await message.reply(
          'It is too cold, keep terraforming! <:p_temp:742916252325904424> <:party_kelvinists:743187620502438031> '
        );

        const messageURL = `https://discordapp.com/channels/${message.guildId}/${mReply.channelId}/${mReply.id}`;
        await commandKV.put('weather', {
          lastUseAt: messageURL,
          lastUseWhen: Date.now()
        });
      } else {
        message.reply('Data is not available.');
      }
    } else {
      message.reply(
        `${COMMAND_COOLWARNING} Please check out the previous call at: ${commandStat.lastUseAt}`
      );
    }
  }
);

// A command to return the weather
const apodURL = 'https://api.nasa.gov/planetary/apod?api_key=';
commands.raw(
  {
    name: 'apod',
    filters: F.or(
      F.isChannelId(CHANNELID_botTest),
      F.isChannelId(CHANNELID_generalchat)
    )
  },
  async (message) => {
    const commandStat = await commandKV.get('apod');
    var diff = Date.now() - commandStat.lastUseWhen;
    diff /= 1000 * 60; //(convert from millisec to min)
    console.log(diff);
    if (diff > COMMAND_COOLDOWN) {
      // Compile the URL and fetch
      const req = await fetch(apodURL + NASAAPIkey);
      console.log(apodURL + NASAAPIkey);
      const data = await req.json();
      // Get the latest date
      const title = data['title'];
      const imageURL = data['hdurl'];
      const imageDate = data['date'];
      var explanation = data['explanation'];
      if (!title) {
        await message.reply('The picture of the day is not available.');
      } else {
        if (explanation.length > 1020) {
          explanation = explanation.slice(0, 1020) + ' ...';
        }

        const richEmbed = new discord.Embed();
        richEmbed.setTitle('Astronomy Picture of the Day');
        richEmbed.setColor(0xeb984e);
        richEmbed.addField({
          name: 'Title',
          value: title,
          inline: false
        });
        richEmbed.addField({
          name: 'Explanation',
          value: explanation,
          inline: false
        });
        if (data['media_type'] == 'video') {
          richEmbed.addField({
            name: 'Youtube',
            value: `[link](${data['url']})`
          });
        } else {
          richEmbed.setImage({ url: imageURL });
        }
        richEmbed.setFooter({
          text:
            imageDate +
            ', powered by NASA API: https://apod.nasa.gov/apod/astropix.html'
        });
        const mReply = await message.reply({ content: '', embed: richEmbed });
        const messageURL = `https://discordapp.com/channels/${message.guildId}/${mReply.channelId}/${mReply.id}`;
        await commandKV.put('apod', {
          lastUseAt: messageURL,
          lastUseWhen: Date.now()
        });
      }
    } else {
      message.reply(
        `${COMMAND_COOLWARNING} Please check out the previous call at: ${commandStat.lastUseAt}`
      );
    }
  }
);

// A key value store is to record active rooms.
const gameEndKV = new pylon.KVNamespace('game end detection');

// A command to initiate room order
commands.raw(
  {
    name: 'gameEndInit',
    filters: discord.command.filters.canManageChannels()
  },
  async (message) => {
    gameEndKV.clear();
    await message.reply('Reinitate game end detection');
    gameEndKV.put('lastGG_check', {
      lastTyper: '0000',
      lastIn: 0,
      lastOut: 0,
      lastChannel: message.channelId,
      lastOutChannel: message.channelId
    });
  }
);

// A list of commands response to certain message.
discord.on('MESSAGE_CREATE', async (message) => {
  // If sentence starts containing text about end game and in the chat rooms.
  if (
    CHATROOMS.includes(message.channelId) ||
    message.channelId == CHANNELID_botTest
  ) {
    const ggText = message.content.toLowerCase();
    const ggRegexp = /\bgg\b/gi;
    const wpRegexp = /\bwp\b/gi;
    if (
      ggRegexp.test(ggText) ||
      wpRegexp.test(ggText) ||
      ggText.includes('well play') ||
      ggText.includes('good game')
    ) {
      console.log('gg text detected in one of the chat rooms.');
      console.log('message was: ' + message.content);
      const ggItem = await gameEndKV.get('lastGG_check');
      const sinceLastIn = (Date.now() - ggItem.lastIn) / (60 * 1000);
      const sinceLastOut = (Date.now() - ggItem.lastOut) / (60 * 1000);
      var newOutChannel = ggItem.lastOutChannel;
      var newLastOut = ggItem.lastOut;
      // If two gg in the same channel by two different people
      if (
        message.channelId == ggItem.lastChannel &&
        message.author.id != ggItem.lastTyper
      ) {
        console.log('gg text detected by different user in the same channel.');
        console.log(
          'Time since someone post gg in this channel: ' + sinceLastIn
        );
        console.log('Time since Curiosity answer gg: ' + sinceLastOut);
        //Two gg messages have to be within 3 minutes, last pylon gg message needs to be longer than 15 minutes or out in a different channel
        if (
          sinceLastIn < 3 &&
          (sinceLastOut > 15 || ggItem.lastOutChannel != message.channelId)
        ) {
          console.log(
            'gg typed by different user within 3 minutes and the program answer more than 15 minutes ago in this channel.'
          );
          await message.reply(
            `I hope you all had a great game. Feel free post the result to: <#${CHANNELID_gameresult}>.`
          );
          newLastOut = Date.now();
          newOutChannel = message.channelId;
        }
      }
      gameEndKV.put('lastGG_check', {
        lastTyper: message.author.id,
        lastIn: Date.now(),
        lastOut: newLastOut,
        lastChannel: message.channelId,
        lastOutChannel: newOutChannel
      });
    }
  }
});

// A list of commands response to certain message.
discord.on('MESSAGE_CREATE', async (message) => {
  const textmessage = message.content.toLowerCase();
  if (textmessage.includes('need more mc')) {
    await message.reply(
      'Where are those <:cube_mc:742698268122939442>/<:tag_earth:742698267716091975> cards?'
    );
  } else if (textmessage.includes('point per jovian')) {
    await message.reply(
      'Sweet <:vp:742698267917418666>/<:tag_jovian:742698267514503208>! Draw more <:card:742908104332804168>, gotta catch them all!'
    );
  } else if (textmessage.includes('i found life')) {
    await message.reply(
      '<:vp:742698267917418666> <:vp:742698267917418666> <:vp:742698267917418666> Congratulations!!! You found life <:tag_microbe:742698267590262834>! '
    );
  } else if (textmessage.includes('what is new?')) {
    await message.reply(HELP_CHANGELOG); // await message.reply(HELP_DRAFT);
  } else if (
    textmessage.includes('how') &&
    textmessage.includes('initial draft')
  ) {
    await message.reply(HELP_DRAFT);
  } else if (
    textmessage.includes('what color?') ||
    textmessage.includes('what color do you want')
  ) {
    if (
      CHATROOMS.includes(message.channelId) ||
      message.channelId == CHANNELID_botTest
    ) {
      await message.addReaction('🔴');
      await message.addReaction('🟢');
      await message.addReaction('🔵');
      await message.addReaction('🟡');
      await message.addReaction('⚫');
      await message.addReaction('🟣');
    }
  } else if (
    textmessage.includes('need') ||
    textmessage.includes('brb') ||
    (textmessage.includes('afk') && textmessage.includes('min'))
  ) {
    if (
      CHATROOMS.includes(message.channelId) ||
      message.channelId == CHANNELID_botTest ||
      message.channelId == CHANNELID_lfg
    ) {
      const myRegexp = /(need|needs|brb|afk)\ (\d+)\ min/gi;
      const match = myRegexp.exec(textmessage);
      console.log(match);
      if (match != null) {
        const minString = match[2];
        const minInt = parseInt(minString);
        if (minInt >= 3) {
          await timerSet(message, minInt);
        }
      }
    }
  }
});

// A key value store is to record active rooms.
const roomKV = new pylon.KVNamespace('active rooms');

// A command to initiate room order
commands.raw(
  {
    name: 'roomOrderInit',
    filters: discord.command.filters.canManageChannels()
  },
  async (message) => {
    await message.reply('Reinitate room order list');
    await roomKV.put('chatroom', { roomOrder: CHATROOMS });
    const chatroomObject = await roomKV.get('chatroom');
    console.log(chatroomObject.roomOrder);
  }
);

// Make an array of chat room.
const CHATROOMS = [
  CHANNELID_phobos,
  CHANNELID_deimos,
  CHANNELID_europa,
  CHANNELID_ganymede,
  CHANNELID_titan
];

// List to any message created in the chat room channels and move the active chat room to back of order
discord.on('MESSAGE_CREATE', async (message) => {
  // If the message is in the channel ID
  const channel = message.channelId;
  if (CHATROOMS.includes(channel)) {
    console.log('Message sent in the one of chat rooms');
    const chatroomObject = await roomKV.get('chatroom');
    const newOrder = chatroomObject.roomOrder;
    // Move the most recent messaged chat room to the last of the list.
    newOrder.push(newOrder.splice(newOrder.indexOf(channel), 1)[0]);
    console.log('Here is the new order:');
    console.log(newOrder);
    await roomKV.put('chatroom', { roomOrder: newOrder });
  }
});

/*
Turn lfg into subcommand
what we have now goes to default
subcommand help for help
allow for subcommand usual, chosta or whatever preset 
*/

// A command to send a nicely formatted lfg message.

commands.subcommand(
  {
    name: 'lfg',
    // Filter for just LFG channel and bot-test room
    filters: F.or(
      F.isChannelId(CHANNELID_lfg),
      F.isChannelId(CHANNELID_botTest)
    )
  },
  (subcommand) => {
    subcommand.raw(
      // If given $lfg help, return the help text.
      { name: 'help' },
      async (message) => {
        await message.reply(HELPLFG);
      }
    );

    subcommand.raw(
      // If given $lfg help, return the help text.
      { name: 'room' },
      async (message) => {
        // Obtain current room order
        const chatroomObject = await roomKV.get('chatroom');
        const newOrder = chatroomObject.roomOrder;
        // Pick the least active room in the front
        const roomToUse = newOrder[0];
        // Move the this room to the last of the list.
        newOrder.push(newOrder.splice(newOrder.indexOf(roomToUse), 1)[0]);
        // Update the KV
        await roomKV.put('chatroom', { roomOrder: newOrder });
        await message.reply(
          `Here is the quietest room for you: <#${roomToUse}>`
        );
      }
    );

    subcommand.raw(
      // If given $lfg help, return the help text.
      { name: 'clear', filters: discord.command.filters.canManageChannels() },
      async (message) => {
        console.log(await lfgCheckKV.list());
        await message.reply('lfg KV is cleared.');
        await lfgCheckKV.clear();
        console.log(await lfgCheckKV.list());
      }
    );

    subcommand.on(
      { name: 'everything', aliases: ['all'] },
      (args) => ({
        playercount: args.integerOptional()
      }),
      async (message, { playercount }) => {
        playercount = playercount ?? 3;
        await message.reply(
          `Let's do an everything preset lfg with ${playercount} players.`
        );
        // reply to the command with our embed
        await lfgPost(message, playercount, 'all', 'all');
      }
    );

    subcommand.on(
      { name: 'anything', aliases: ['any'] },
      (args) => ({
        playercount: args.integerOptional()
      }),
      async (message, { playercount }) => {
        playercount = playercount ?? 1;
        if (playercount > 1 && playercount <= 6) {
          await message.reply(
            `Let's do an anything lfg with ${playercount} players.`
          );
        } else {
          await message.reply(
            `Let's do an anything lfg with any number of players.`
          );
        }
        await lfgPost(message, playercount, 'any', 'any');
      }
    );

    subcommand.raw({ name: 'preset' }, async (message) => {
      //const presetGamers = game
      if (!playerPresets.has(message.author.id)) {
        await message.reply(
          `Sorry we don't have a preset for you. Use standard \`$lfg\` command or \`$lfg help\` for help.`
        );
      } else {
        await message.reply(
          `Let's do a preset lfg for ${message.member.nick ??
            message.author.username}.`
        );
        const setting = playerPresets.get(message.author.id);

        await lfgPost(
          message,
          setting.playercount,
          setting.expansion,
          setting.custom
        );
      }
    });

    // Otherwise follow the command as normal
    subcommand.default(
      (args) => ({
        playercount: args.integerOptional(),
        expansion: args.stringOptional(),
        custom: args.textOptional()
      }),
      async (message, { playercount, expansion, custom }) => {
        playercount = playercount ?? 3;
        expansion = expansion ?? 'any';
        // Convert player count to string. Allow for non number like any or 2 v 2.
        await lfgPost(message, playercount, expansion, custom);
      }
    );
  }
);

// If add choice_yes, sign up
discord.on('MESSAGE_REACTION_ADD', async (evt) => {
  if (
    evt.emoji.name === 'choice_yes' &&
    (evt.channelId == CHANNELID_lfg || evt.channelId == CHANNELID_botTest) &&
    evt.userId != USERID_PYLON
  ) {
    // First get the message that is being react to
    const message = await discord
      .getGuildTextChannel(evt.channelId)
      .then((c) => c?.getMessage(evt.messageId));

    // Next get the list of messageid from lfgCheckKV
    const keyList = await lfgCheckKV.list();

    // Only do this command if the reacted message is one of lfg messages in the KV
    if (keyList.includes(message.id)) {
      console.log('Reacted message is in the list.');

      // Retrieve the reactor
      const reactor = await discord.getUser(evt.userId);
      console.log('Reactor ID');
      console.log(reactor.id);

      // Clear everything except the choice.
      await message.deleteReaction(yesReaction, reactor.id);

      // Retrieve the JSON
      const kvItem = await lfgCheckKV.get(message.id);
      console.log('kvItem');
      console.log(kvItem);

      console.log('kvSigners');
      console.log(kvItem.signers); //test

      // Only attempt to add a name if the reactor is not already in the list of signers
      if (!kvItem.signers.includes(reactor.id)) {
        console.log('attempting to add a name');

        // Get the embed
        const lfgEmbed = message.embeds[0];

        // Loop through the Embed to find the sign up field and add a name to it
        for (const field of lfgEmbed.fields) {
          if (field.name === 'Sign up') {
            field.value =
              field.value +
              `\n${roleSquare(evt.member.roles)}${evt.member.nick ??
                reactor.username}`;
            break;
          }
        }

        // Update the embed
        await message.edit(lfgEmbed);

        // Let's update the kv item
        console.log('previous player have: ' + kvItem.playerHave);
        const newCount = kvItem.playerHave + 1;
        console.log('new player count: ' + newCount);
        kvItem.signers.push(reactor.id);
        const newSigners = kvItem.signers;
        console.log('new sign up sheet: ' + newSigners);

        // Updating the KV after adding a player
        await lfgCheckKV.put(message.id, {
          channel: kvItem.channel,
          time: kvItem.time,
          playerWant: kvItem.playerWant,
          playerHave: newCount,
          signers: newSigners
        });
        console.log('Here is the updated kv item after adding the player.');
        console.log(await lfgCheckKV.get(message.id));

        if (newCount >= kvItem.playerWant) {
          console.log('We have reached quorum');
          var signupPlayers = '';
          for (let playerid of kvItem.signers) {
            const player = await discord.getUser(playerid);
            signupPlayers += player.toMention() + ' ';
          }

          // Obtain current room order
          const chatroomObject = await roomKV.get('chatroom');
          const newOrder = chatroomObject.roomOrder;
          // Pick the least active room in the front
          const roomToUse = newOrder[0];
          // Move the this room to the last of the list.
          newOrder.push(newOrder.splice(newOrder.indexOf(roomToUse), 1)[0]);
          // Update the KV
          await roomKV.put('chatroom', { roomOrder: newOrder });

          await message.reply(
            'We have reached our quorum, ' +
              signupPlayers +
              "! Let's move to <#" +
              roomToUse +
              '> and play!'
          );

          // Welcome to new room and send a message.
          const roomChannel = await discord.getTextChannel(roomToUse);
          const welcomeMessage = await roomChannel.sendMessage(
            'Welcome ' + signupPlayers + ". Let's play!"
          );
          await commandKV.put('setup', {
            lastUseAt: roomToUse,
            lastUseWhen: Date.now()
          });
          await setupConstruct(welcomeMessage);

          // Add a thumbnail
          lfgEmbed.setTitle('Off to Mars!');

          // Add a thumbnail
          lfgEmbed.setThumbnail({ url: 'https://i.imgur.com/7E6udf6.jpg' });

          // Update the footer
          lfgEmbed.setFooter({
            text:
              'Quorum has been reached. This LFG message is no longer active. | Launched on '
          });

          lfgEmbed.setTimestamp(new Date().toISOString());

          await message.edit(lfgEmbed);

          // Remove from kv list
          await lfgCheckKV.delete(message.id);
        }
      } else {
        console.log('The player is already in the list. No action is taken.');
      }
    }
  }
});

// If add choice no, remove signer
discord.on('MESSAGE_REACTION_ADD', async (evt) => {
  if (
    evt.emoji.name === 'choice_no' &&
    (evt.channelId == CHANNELID_lfg || evt.channelId == CHANNELID_botTest) &&
    evt.userId != USERID_PYLON
  ) {
    // First get the message that is being react to
    const message = await discord
      .getGuildTextChannel(evt.channelId)
      .then((c) => c?.getMessage(evt.messageId));

    // Next get the list of messageid from lfgCheckKV
    const keyList = await lfgCheckKV.list();
    console.log(keyList);

    // Only do this command if the reacted message is one of lfg messages in the KV
    if (keyList.includes(message.id)) {
      // Retrieve the reactor
      const reactor = await discord.getUser(evt.userId);

      // Clear everything except the choice.
      await message.deleteReaction(noReaction, reactor.id);

      // Retrieve the JSON
      const kvItem = await lfgCheckKV.get(message.id);
      console.log(
        'Checking if react remover id ' + reactor.id + ' is in the sign up:'
      );
      console.log(kvItem.signers);
      // Only attempt to do this if the react remover alraedy signed up
      if (kvItem.signers.includes(reactor.id)) {
        console.log('Yes, already signed up. So attempting to remove a name');

        // Get the embed
        const lfgEmbed = message.embeds[0];

        // Let's update the kv item after removing
        const newCount = kvItem.playerHave - 1; // Increate current player count by 1

        console.log('sign up sheet before deletion: ' + kvItem.signers);
        //Remove the reactor remover from the signer list
        const index = kvItem.signers.indexOf(reactor.id, 0);
        if (index > -1) {
          kvItem.signers.splice(index, 1);
        }

        //delete kvItem.signers[reactor.id];
        console.log('sign up sheet AFTER deletion: ' + kvItem.signers);

        // Updating the KV
        await lfgCheckKV.put(message.id, {
          channel: kvItem.channel,
          time: kvItem.time,
          playerWant: kvItem.playerWant,
          playerHave: newCount,
          signers: kvItem.signers
        });

        console.log('Here is the updated kv item after adding the player.');
        console.log(await lfgCheckKV.get(message.id));

        // Looping through field to find sign up and remove the name there.
        for (const field of lfgEmbed.fields) {
          if (field.name == 'Sign up') {
            field.value = '';
            for (const signerid of kvItem.signers) {
              const signerUser = await discord.getUser(signerid);
              const guildMember = await discord
                .getGuild(evt.guildId)
                .then((c) => c?.getMember(signerid));
              field.value += `${roleSquare(
                guildMember.roles
              )}${guildMember.nick ?? signerUser.username}\n`;
            }
            if (field.value == '') {
              field.value = '\u200b';
            }
            break;
          }
        }

        // Update the embed
        await message.edit(lfgEmbed);
        // If no player on the sign up list, delete the message and remove the item from KV
        if (newCount == 0) {
          await message.delete();
          await lfgCheckKV.delete(message.id);
        }
      }
    }
  }
});

// Get role assignment

commands.raw(
  {
    name: 'rolesetup'
  },
  async () => {
    const roleMessage = await discord
      .getTextChannel('743789106282102785')
      .then((c) => c?.getMessage('753188826092142604'));
    roleMessage.addReaction('tag_mars:742723306204954745');
    roleMessage.addReaction('tag_venus:743033839693332551');
    roleMessage.addReaction('tag_jovian:742698267514503208');
  }
);

discord.on('MESSAGE_REACTION_ADD', async (evt) => {
  if (evt.messageId == ROLE_ASSIGNMENT_MESSAGE_ID) {
    const guildMember = await discord
      .getGuild(evt.guildId)
      .then((c) => c?.getMember(evt.userId));
    if (evt.emoji.name == 'tag_mars') {
      await guildMember.addRole(ROLEID_BEGINNER);
    } else if (evt.emoji.name == 'tag_venus') {
      await guildMember.addRole(ROLEID_INTERMEDIATE);
    } else if (evt.emoji.name == 'tag_jovian') {
      await guildMember.addRole(ROLEID_EXPERIENCED);
    }
  }
});

discord.on('MESSAGE_REACTION_REMOVE', async (evt) => {
  if (evt.messageId == ROLE_ASSIGNMENT_MESSAGE_ID) {
    const guildMember = await discord
      .getGuild(evt.guildId)
      .then((c) => c?.getMember(evt.userId));
    if (evt.emoji.name == 'tag_mars') {
      guildMember.removeRole(ROLEID_BEGINNER);
    } else if (evt.emoji.name == 'tag_venus') {
      guildMember.removeRole(ROLEID_INTERMEDIATE);
    } else if (evt.emoji.name == 'tag_jovian') {
      guildMember.removeRole(ROLEID_EXPERIENCED);
    }
  }
});

// A key value store is per server. Let's create one now, and call it "tags".
// 'tags' name cannot be changed. Otherwise the whole KV is toasted.
const memesKv = new pylon.KVNamespace('tags');

// Command a nd sub command to handle martian memes
commands.subcommand(
  {
    name: 'marsmeme',
    filters: F.or(
      F.isChannelId(CHANNELID_botTest),
      F.isChannelId(CHANNELID_generalchat),
      F.isChannelId(CHANNELID_gametalk),
      F.isChannelId(CHANNELID_gameresult),
      F.isChannelId(CHANNELID_phobos),
      F.isChannelId(CHANNELID_deimos),
      F.isChannelId(CHANNELID_europa),
      F.isChannelId(CHANNELID_ganymede),
      F.isChannelId(CHANNELID_titan)
    )
  },
  // Subcommand for setting meme, $marsmeme set key URL title
  (subcommand) => {
    subcommand.on(
      'set',
      (args) => ({
        memeKey: args.string(),
        memeURL: args.string(),
        memeTitle: args.text()
      }),
      async (message, { memeKey, memeURL, memeTitle }) => {
        // Save the tag to the database.
        await memesKv.put(memeKey, [memeURL, memeTitle]);
        // Reply to the user to say we've saved their tag. We're also using the `allowedMentions` feature here,
        // to make sure thet the message won't mention anyone, for example, if they made the tag key "@everyone",
        // it wouldn't ping everyone with `allowedMentions: {}`.
        await message.reply({
          content: `Alright, I've saved the meme for **${memeKey}**!`,
          allowedMentions: {}
        });
      }
    );

    subcommand.on(
      // This one is pretty self explanatory, once you've got the hang of commands. Here we're building a command
      // that is only usable by people with the MANGE_MESSAGES permission.
      { name: 'delete', filters: discord.command.filters.canManageChannels() },
      (ctx) => ({ key: ctx.string() }),
      async (message, { key }) => {
        // Delete the tag from the database.
        await memesKv.delete(key);
        // Reply with a confirmation message.
        await message.reply({
          content: `Alright, I've deleted the meme for **${key}**!`,
          allowedMentions: {}
        });
      }
    );

    subcommand.raw(
      // This one is pretty self explanatory, once you've got the hang of commands. Here we're building a command
      // that is only usable by people with the MANGE_MESSAGES permission.
      { name: 'list' },
      async (message) => {
        const keyList = await memesKv.list();
        await message.reply({
          content: `The ${
            keyList.length
          } keys in the memeKV are:\n${keyList.join(', ')}`,
          allowedMentions: {}
        });
      }
    );

    subcommand.raw(
      // This one is pretty self explanatory, once you've got the hang of commands. Here we're building a command
      // that is only usable by people with the MANGE_MESSAGES permission.
      { name: 'help' },
      async (message) => {
        message.reply(HELP_MEME);
      }
    );

    // And finally, let's have a default command handler, for if the command was neither "set" or "delete".
    subcommand.default(
      (ctx) => ({ key: ctx.stringOptional() }),
      async (message, { key }) => {
        // Retrieve the tag from the database. We are using `.get<string>(...)` as we have stored a string
        // in the database before.
        // If the value is null, randomly pull one meme
        var memeTitle = 'title';
        var memeURL = 'url';
        // if no key, assign a random key
        if (key == null) {
          const memeCount = await memesKv.count();
          const memeList = await memesKv.list();
          key = memeList[Math.floor(Math.random() * memeCount)];
        }
        // if has key but does not match
        const value = await memesKv.get<string>(key);
        if (value == null) {
          await message.reply({
            content: `Unknown meme: **${key}**`,
            allowedMentions: {}
          });
          // if key match (wanted or random)
        } else {
          // Otherwise, let's send back the tag value. Again, we're using `allowedMentions: {}` here
          // to ensure that the bot sending the tag is not able to ping anyone!
          const richEmbed = new discord.Embed();
          richEmbed.setTitle(value[1]);
          richEmbed.setColor(0x5499c7);
          /*richEmbed.setFooter({
            text:
              `Source: https://www.reddit.com/r/TerraformingMarsGame/comments/
              dodv5j/1000_members_contest_announcement/`
          });*/
          console.log(key);
          //richEmbed.addField({ title: 'meme key', value: <string>key });
          console.log(value[0]);
          richEmbed.setImage({ url: value[0] });
          await message.reply({
            content: 'meme key: ' + key,
            embed: richEmbed,
            allowedMentions: {}
          });
        }
      }
    );
  }
);

// Game option
commands.raw(
  {
    name: 'setup',
    filters: F.or(
      F.isChannelId(CHANNELID_botTest),
      F.isChannelId(CHANNELID_phobos),
      F.isChannelId(CHANNELID_deimos),
      F.isChannelId(CHANNELID_europa),
      F.isChannelId(CHANNELID_ganymede),
      F.isChannelId(CHANNELID_titan)
    )
  },
  async (message) => {
    const commandStat = await commandKV.get('setup');
    var diff = Date.now() - commandStat.lastUseWhen;
    diff /= 1000 * 60; //(convert from millisec to min)
    console.log(diff);
    // 5 minute cool down
    if (diff > 10 || commandStat.lastUseAt != message.channelId) {
      await commandKV.put('setup', {
        lastUseAt: message.channelId,
        lastUseWhen: Date.now()
      });
      await setupConstruct(message);
    } else {
      message.reply('`$setup` command was recently used in this channel.');
    }
  }
);

// A key value store is per server. Let's create one now, and call it "tags".
const lfgCheckKV = new pylon.KVNamespace('self destructing messages');

// A simple command, !ping -> Pong!
commands.raw('debug', async (message) => {
  const bugmessage = await discord
    .getGuildTextChannel('737945098695999562')
    .then((c) => c?.getMessage('749888166751633429'));
  const embed = bugmessage.embeds[0];
  console.log(embed.image.url);
  message.reply('Debugging the message without picture');
});

// A simple command, !ping -> Pong!
commands.raw('snap', async (message) => {
  const sdmessage = await message.reply('SNAP! (self destruct in ~3 min)');
  await lfgCheckKV.put(sdmessage.id, {
    channel: sdmessage.channelId,
    time: Date.now(),
    playerWant: 5,
    playerHave: 2,
    signers: ['626557246301667348']
  });
  console.log(await lfgCheckKV.items());
  const keyList = await lfgCheckKV.list();
  console.log(keyList);
  for (let key of keyList) {
    let item = await lfgCheckKV.get(key);
    console.log(item.channel);
    if (item.playerWant == item.playerHave) {
      console.log('We have reached quorum');
      var signupPlayers = '';
      for (let playerid of item.signers) {
        const player = await discord.getUser(playerid);
        signupPlayers += player.toMention() + ' ';
      }
    }
  }
  message.reply("We have reached our quorum. Let'play " + signupPlayers + '!');
});

// Jeep user id 626557246301667348

// A cron function to check the list of lfg messages.
pylon.tasks.cron('cleaning-snaps', '0 0/20 * * * * *', async () => {
  console.log('log every 5 minutes');
  const keyList = await lfgCheckKV.list();
  console.log(keyList);
  for (let key of keyList) {
    console.log('LFG message in list.');
    console.log(key);
    const game = await lfgCheckKV.get(key);
    console.log(game);
    const channel = game.channel;
    const lfgTime = game.time;
    const currentTime = Date.now();
    var diff = (currentTime - lfgTime) / 1000; // convert for millisec to sec
    diff /= 60; //convert to min
    console.log('diff: ' + diff);
    console.log('player count: ' + game.playerHave);
    // Check if the message is older than 1 hour (60 minutes).
    if ((diff > 60 && game.playerHave <= 1) || diff > 150) {
      console.log('attempting to delete the message');
      console.log('key: ' + key); // Check 1
      console.log('channel: ' + channel);
      // First get the message that is being react to
      const message = await discord
        .getGuildTextChannel(channel)
        .then((c) => c?.getMessage(key));
      /*const actualChannel = await discord.getGuildTextChannel(channel);
      console.log(actualChannel);
      await sleep(100);
      const message = await actualChannel.getMessage(key);*/
      console.log(message); // Check 2
      await message.delete();
      await lfgCheckKV.delete(key);
      console.log('message deleted');
    } else {
      console.log('Attempting to reorder the LFG message');
      // If it does not get deleted, reorder instead.
      const lfgChannel = await discord.getTextChannel(channel);
      const message = await lfgChannel.getMessage(key);

      // Add new message
      const reorderedLFG = await lfgChannel.sendMessage({
        content: '',
        embed: message.embeds[0]
      });
      console.log('Added a new message');

      await reorderedLFG.addReaction(yesReaction);
      await reorderedLFG.addReaction(noReaction);

      // Update LFG KV item

      await lfgCheckKV.put(reorderedLFG.id, {
        channel: channel,
        time: lfgTime,
        playerWant: game.playerWant,
        playerHave: game.playerHave,
        signers: game.signers
      });
      console.log('Added the reordered message to LFG KV.');

      // Delete old key
      console.log('Removing the old message from LFG KV.');
      await lfgCheckKV.delete(message.id);

      console.log('attempting to delete message after reordering.');
      // Delete old one
      await message.delete();
      console.log('message deleted.');
    }
  }
});

// Make KV to remember when a command is called recently
const commandKV = new pylon.KVNamespace('remember commands');

async function timerSet(message: discord.Message, timeLength: number) {
  const currentTimer = await timeKV.list();
  if (currentTimer.includes(message.author.id)) {
    await message.reply(
      `You still have a timer going, but I will replace that one with a new timer for ${timeLength} minute(s).`
    );
  } else {
    await message.reply(
      `Okay, I have set a timer for ${timeLength} minute(s).`
    );
  }
  await timeKV.put(message.author.id, {
    channel: message.channelId,
    timerStart: Date.now(),
    timerInterval: timeLength,
    timerMesID: message.id
  });
}

// Function to make set up message
async function setupConstruct(message) {
  const colorMessage = await message.reply(
    'What color would you like to play as?'
  );
  await colorMessage.addReaction('🔴');
  await colorMessage.addReaction('🟢');
  await colorMessage.addReaction('🔵');
  await colorMessage.addReaction('🟡');
  await colorMessage.addReaction('⚫');
  await colorMessage.addReaction('🟣');

  const expansionMessage = await message.reply('What expansion should we use?');
  await expansionMessage.addReaction('exp_prelude:743207309936689282');
  await expansionMessage.addReaction('exp_venus:743207309723041823');
  await expansionMessage.addReaction('exp_colony:743207309894877265');
  await expansionMessage.addReaction('exp_turmoil:743207309525909597');
  await expansionMessage.addReaction('exp_promo:743207309903265891');

  const corpMessage = await message.reply('How many corporations?');
  await corpMessage.addReaction('1️⃣');
  await corpMessage.addReaction('2️⃣');
  await corpMessage.addReaction('3️⃣');
  await corpMessage.addReaction('4️⃣');

  const draftMessage = await message.reply(
    '1) No draft? 2) Round draft? 3) Round+initial draft?'
  );
  await draftMessage.addReaction('1️⃣');
  await draftMessage.addReaction('2️⃣');
  await draftMessage.addReaction('3️⃣');

  const wgtChoices = await message.reply('Use world government terraforming?');
  await wgtChoices.addReaction(yesReaction);
  await wgtChoices.addReaction(noReaction);

  const maChoices = await message.reply('Randomize milestones and awards?');
  await maChoices.addReaction(yesReaction);
  await maChoices.addReaction(noReaction);

  const vpChoices = await message.reply('Show real-time VP?');
  await vpChoices.addReaction(yesReaction);
  await vpChoices.addReaction(noReaction);

  const tileChoices = await message.reply(
    'Randomize board tiles (ocean location and tile placement bonus)?'
  );
  await tileChoices.addReaction(yesReaction);
  await tileChoices.addReaction(noReaction);

  const fastChoices = await message.reply(
    'Fast mode (no end turn option, must take two actions)?'
  );
  await fastChoices.addReaction(yesReaction);
  await fastChoices.addReaction(noReaction);

  const banChoices = await message.reply(
    'Ban: <:tag_earth:742698267716091975> Point Luna, <:exp_colony:743207309894877265> Poseidon, <:cube_steel:743182342322913290> Manutech, <:tag_microbe:742698267590262834> Pharmacy Union, <:card:742908104332804168> Pluto? <:choice_no:742725736485355600> No ban?'
  );
  await banChoices.addReaction('tag_earth:742698267716091975');
  await banChoices.addReaction('exp_colony:743207309894877265');
  await banChoices.addReaction('cube_steel:743182342322913290');
  await banChoices.addReaction('tag_microbe:742698267590262834');
  await banChoices.addReaction('card:742908104332804168');
  await banChoices.addReaction('choice_no:742725736485355600');

  const communicationChoices = await message.reply('Text chat or voice chat?');
  await communicationChoices.addReaction('⌨️');
  await communicationChoices.addReaction('🔊');
}

// Function to post LFG message
async function lfgPost(
  message: discord.Message,
  playercount: number,
  expansion: string,
  custom: string
) {
  // Let's reconstruct the embed
  const richEmbed = new discord.Embed();

  // Set title and color
  richEmbed.setTitle(
    `${message.member.nick ??
      message.author.username} is looking for a game now!`
  );

  var color = 0xffd700;
  if (message.member.roles.includes(ROLEID_EXPERIENCED)) {
    color = 0xf7c583;
  } else if (message.member.roles.includes(ROLEID_INTERMEDIATE)) {
    color = 0x21afe2;
  } else if (message.member.roles.includes(ROLEID_BEGINNER)) {
    color = 0xe97119;
  }
  richEmbed.setColor(color);

  var playerString = '';
  var pWant = playercount;
  if (playercount > 1 && playercount <= 6) {
    playerString += playercount;
    pWant = playercount;
  } else if (playercount == 34) {
    playerString = '3 or 4';
    pWant = 4;
  } else if (playercount == 23) {
    playerString = '2 or 3';
    pWant = 3;
  } else if (playercount == 22) {
    playerString = '2 vs 2';
    pWant = 4;
  } else {
    playerString = 'any';
    pWant = 3;
  }

  richEmbed.addField({
    name: '# player',
    value: playerString,
    inline: true
  });

  // Setting up expansion icons
  if (expansion == null) {
    expansion = ' ';
  } else {
    expansion = expansion.toLowerCase();
  }

  var expansionicon = '';
  if (expansion == 'all' || expansion == 'everything') {
    expansionicon =
      preludeEmoji + venusEmoji + colonyEmoji + turmoilEmoji + promoEmoji;
  } else if (expansion == 'any' || expansion == 'anything') {
    expansionicon = anyEmoji;
  } else if (expansion == 'all-t') {
    expansionicon = preludeEmoji + venusEmoji + colonyEmoji + promoEmoji;
  } else if (expansion == 'base') {
    expansionicon = noEmoji;
  } else {
    if (expansion.includes('p')) {
      expansionicon += preludeEmoji;
    }
    if (expansion.includes('v')) {
      expansionicon += venusEmoji;
    }
    if (expansion.includes('c')) {
      expansionicon += colonyEmoji;
    }
    if (expansion.includes('t')) {
      expansionicon += turmoilEmoji;
    }
    if (expansion.includes('o')) {
      expansionicon += promoEmoji;
    }
  }
  if (expansionicon == '') {
    expansionicon = noEmoji;
  }
  richEmbed.addField({
    name: 'Expansions',
    value: expansionicon,
    inline: true
  });

  // Setting up custom options
  if (custom == null) {
    custom = ' ';
  }

  // Extract comment from custom
  var comment = '';
  const myRegexp = /"([^"]*)"/gi;
  const match = myRegexp.exec(custom);
  console.log('custom: ' + custom);
  console.log(match);
  if (match != null) {
    comment = match[1];
    console.log('comment: ' + comment);
    custom = custom.replace(match[0], '');
    console.log('custom: ' + custom);
  }

  custom = custom.toLowerCase();

  var wgt;
  var roundDraft;
  var iniDraft;
  var milestonesAwards;
  var realVP;

  if (custom.includes('off') || custom.includes('none')) {
    wgt = noEmoji;
    roundDraft = noEmoji;
    iniDraft = noEmoji;
    milestonesAwards = noEmoji;
    realVP = noEmoji;
  } else if (custom.includes('all') || custom.includes('everything')) {
    wgt = yesEmoji;
    roundDraft = yesEmoji;
    iniDraft = yesEmoji;
    milestonesAwards = yesEmoji;
    realVP = yesEmoji;
  } else {
    wgt = anyEmoji;
    roundDraft = anyEmoji;
    iniDraft = anyEmoji;
    milestonesAwards = anyEmoji;
    realVP = anyEmoji;
  }

  // WGT option
  if (custom.includes('-wgt')) {
    wgt = noEmoji;
  } else if (custom.includes('wgt')) {
    wgt = yesEmoji;
  }

  // Draft option
  if (custom.includes('full draft')) {
    roundDraft = yesEmoji;
    iniDraft = yesEmoji;
  } else if (custom.includes('-draft') || custom.includes('no draft')) {
    roundDraft = noEmoji;
    iniDraft = noEmoji;
  } else if (custom.includes('draft')) {
    roundDraft = yesEmoji;
    iniDraft = noEmoji;
  }

  // random milestones and awards
  if (custom.includes('-random')) {
    milestonesAwards = 'board-defined';
  } else if (custom.includes('random')) {
    milestonesAwards = 'randomized';
  }

  // Real time VP
  if (custom.includes('-vp')) {
    realVP = noEmoji;
  } else if (custom.includes('vp')) {
    realVP = yesEmoji;
  }

  richEmbed.addField({
    name: 'World government terraforming',
    value: wgt,
    inline: true
  });
  richEmbed.addField({
    name: 'Round drafting',
    value: roundDraft,
    inline: true
  });
  richEmbed.addField({
    name: 'Initial drafting',
    value: iniDraft,
    inline: true
  });
  richEmbed.addField({
    name: 'Milestones & awards',
    value: milestonesAwards,
    inline: true
  });
  richEmbed.addField({
    name: 'Real-time VP',
    value: realVP,
    inline: true
  });

  // Only add fast field if specified
  if (custom.includes('fast')) {
    richEmbed.addField({
      name: 'Fast Mode',
      value: yesEmoji,
      inline: true
    });
  }

  // Add ban if specified
  var banList = '';
  if (custom.includes('-pluna')) {
    banList += 'Point Luna\n';
  }
  if (custom.includes('-pluto')) {
    banList += 'Pluto\n';
  }
  if (banList != '') {
    richEmbed.addField({
      name: 'Blacklist',
      value: banList,
      inline: true
    });
  }

  richEmbed.addField({
    name: 'Sign up',
    value:
      roleSquare(message.member.roles) +
      (message.member.nick ?? message.author.username),
    inline: true
  });

  if (comment != '') {
    richEmbed.addField({
      name: 'Comment',
      value: comment,
      inline: false
    });
  }

  richEmbed.setFooter({
    text: '(Click on ✅ below to sign up or ❌ to withdraw.) | Searching since '
  });

  richEmbed.setTimestamp(new Date().toISOString());

  const lfgEmbedMessage = await message.reply({
    content: '',
    embed: richEmbed
  });

  await lfgEmbedMessage.addReaction(yesReaction);
  await lfgEmbedMessage.addReaction(noReaction);

  // Record this to the KV
  const currentTime = new Date();
  console.log(lfgEmbedMessage.id);
  console.log(currentTime);

  await lfgCheckKV.put(lfgEmbedMessage.id, {
    channel: lfgEmbedMessage.channelId,
    time: Date.now(),
    playerWant: pWant,
    playerHave: 1,
    signers: [message.author.id]
  });
  console.log(await lfgCheckKV.items());

  return lfgEmbedMessage;
}

// A key value store is per server. Let's create one now, and call it "tags".
const timeKV = new pylon.KVNamespace('timer');

// Command a nd sub command to handle timer
commands.subcommand(
  {
    name: 'timer',
    filters: F.or(
      F.isChannelId(CHANNELID_botTest),
      F.isChannelId(CHANNELID_lfg),
      F.isChannelId(CHANNELID_generalchat),
      F.isChannelId(CHANNELID_gametalk),
      F.isChannelId(CHANNELID_gameresult),
      F.isChannelId(CHANNELID_phobos),
      F.isChannelId(CHANNELID_deimos),
      F.isChannelId(CHANNELID_europa),
      F.isChannelId(CHANNELID_ganymede),
      F.isChannelId(CHANNELID_titan)
    )
  },
  // Subcommand for setting meme, $marsmeme set key URL title
  (subcommand) => {
    subcommand.raw(
      { name: 'clear', filters: discord.command.filters.canManageChannels() },
      async (message) => {
        await timeKV.clear();
        await message.reply('Timer KV is cleared.');
      }
    );

    subcommand.default(
      (ctx) => ({ period: ctx.integer() }),
      async (message, { period }) => {
        //await timeKV.clear();
        await timerSet(message, period);
      }
    );
  }
);

// A cron function to check the list of lfg messages.
pylon.tasks.cron('timer-check', '0 0/5 * * * * *', async () => {
  console.log('log every 5 minutes');
  const keyList = await timeKV.list();
  console.log(keyList);
  for (let key of keyList) {
    console.log(key);
    const timerItem = await timeKV.get(key);
    console.log(timerItem);
    const timerID = timerItem.timerMesID;
    const channel = timerItem.channel;
    const timeStart = timerItem.timerStart;
    const timerInterval = timerItem.timerInterval;
    const currentTime = Date.now();
    var diff = (currentTime - timeStart) / 1000; // convert for millisec to sec
    diff /= 60; //convert to min
    console.log('diff: ' + diff);
    // Check if the message is older than 1 hour (60 minutes).
    if (diff > timerInterval) {
      console.log('time is up');
      console.log('message id: ' + timerID);
      console.log('channel id: ' + channel);
      // First get the message that is being react to
      const message = await discord
        .getGuildTextChannel(channel)
        .then((c) => c?.getMessage(timerID));
      /*const actualChannel = await discord.getGuildTextChannel(channel);
      console.log(actualChannel);
      await sleep(100);
      const message = await actualChannel.getMessage(key);*/
      console.log(message); // Check 2
      const timeruser = await discord.getUser(key);
      await message.reply(
        `Timer is up. It has been ${timerInterval} minute(s), ${timeruser.toMention()}!`
      );
      await timeKV.delete(key);
      console.log('timer deleted.');
    }
  }
});

// Function: Knuth's shuffle
// Input: Any array
// Output: A copy of the array but elements are shuffled
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    var randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    var temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Function:
// Input:
// Output:
function chunkify(a, n, balanced) {
  if (n < 2) return [a];

  var len = a.length,
    out = [],
    i = 0,
    size;

  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, (i += size)));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, (i += size)));
    }
  } else {
    n--;
    size = Math.floor(len / n);
    if (len % size === 0) size--;
    while (i < size * n) {
      out.push(a.slice(i, (i += size)));
    }
    out.push(a.slice(size * n));
  }
  return out;
}

function roleSquare(roles: string[]) {
  if (roles.includes(ROLEID_EXPERIENCED)) {
    return '<:level_experienced:753545826068070510> ';
  } else if (roles.includes(ROLEID_INTERMEDIATE)) {
    return '<:level_intermediate:753546639985082458> ';
  } else if (roles.includes(ROLEID_BEGINNER)) {
    return '<:level_beginner:753546639725297675> ';
  } else {
    return '';
  }
}
