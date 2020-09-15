export function lfgConstruct(
  username: string,
  playercount: int,
  expansion: string,
  custom: string
) {
  const richEmbed = new discord.Embed();
  // Set title
  richEmbed.setTitle(username + ' is looking for a game now!');
  richEmbed.setColor(0xffd700);

  // Convert player count to string. Allow for non number like any or 2 v 2.
  var stringPCount;
  var pWant = 0;
  if (playercount == 22) {
    stringPCount = '2 vs 2';
    pWant = 4;
  } else if (2 <= playercount && playercount <= 5) {
    stringPCount = String(playercount);
    pWant = playercount;
  } else {
    stringPCount = 'any';
    pWant = Infinity;
  }
  richEmbed.addField({
    name: '# player',
    value: stringPCount,
    inline: true
  });

  // Setting up expansion icons
  if (expansion == null) {
    expansion = ' ';
  } else {
    expansion = expansion.toLowerCase();
  }

  var expansionicon = '';
  if (expansion == 'all') {
    expansionicon =
      preludeEmoji + venusEmoji + colonyEmoji + turmoilEmoji + promoEmoji;
  } else if (expansion == 'all-t') {
    expansionicon = preludeEmoji + venusEmoji + colonyEmoji + promoEmoji;
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
  if (!expansionicon.includes('exp')) {
    expansionicon = noEmoji;
  }
  richEmbed.addField({
    name: 'Expansions',
    value: expansionicon,
    inline: true
  });

  // Setting up custom set
  if (custom == null) {
    custom = ' ';
  } else {
    custom = custom.toLowerCase();
  }
  // World Government
  var wgt;
  if (custom.includes('wgt')) {
    wgt = yesEmoji;
  } else {
    wgt = noEmoji;
  }
  var roundDraft;
  var iniDraft;
  if (custom.includes('full draft')) {
    roundDraft = yesEmoji;
    iniDraft = yesEmoji;
  } else if (custom.includes('draft')) {
    roundDraft = yesEmoji;
    iniDraft = noEmoji;
  } else {
    roundDraft = noEmoji;
    iniDraft = noEmoji;
  }
  var milestonesAwards;
  if (custom.includes('random')) {
    milestonesAwards = 'randomized';
  } else {
    milestonesAwards = 'board-defined';
  }
  var realVP;
  if (custom.includes('vp')) {
    realVP = yesEmoji;
  } else {
    realVP = noEmoji;
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
  richEmbed.addField({
    name: 'Sign up',
    value: username,
    inline: true
  });
  richEmbed.setFooter({
    text:
      '(To sign up for this game, react with :choice_yes:. Remove the reaction to withdraw. This message will automatically be deleted when the sign up list becomes empty, after ~ 1 hour if no one else signs up, or after ~ 2.5 hr if quorum is not reached.)'
  });
  return richEmbed;
}
