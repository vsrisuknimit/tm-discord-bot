export const HELP_GENERAL = `Here are the commands available on Curiosity:
    \`$lfg\` = send a looking-for-game message (available in <#739776164297441391>)
    \`$card\` = look up a card 
    \`$team\` = generate teams from a list of people
    \`$setup\` = ask the players about game set up (only available in game rooms (chat))
    \`$marsmeme\` = get Terraforming Mars meme (available in most places for chatting)
    \`$search\` = search for life (available in <#751040806386663456>)
    \`$poll\` = construct a poll (available in most places for chatting)
    \`$d\` = roll a die 
    \`$flip\` = flip a coin 

These commands below are available only in <#737945098695999562>:
    \`$rover\` = check front facing camera of Curiosity rover  
    \`$weather\` = check most recently available weather on Mars at Elysium Planitia
    \`$apod\` = get the astronomy picture of the day

Type \`$help [command]\` to ask for help with the specific command.`;

export const HELPLFG = `**TL;DR**: \`$lfg\` can be used to send out a nicely formatted looking for game message. Type \`$lfg [# player] [expansion] [custom option]\` in <#739776164297441391>. For example, \`$lfg 4 pvcto wgt draft random vp\`.

**Details**
**1st arg**: number of players wanted. 0 for any. 22 for 2 v 2 format.
**2nd arg**: expansion, p for prelude, v for venus, c for colony, t for turmoil, o for promo. You can write in any order. You can also use 'all' or 'any' instead.
**3rd+ args**: 'wgt' for world government terraforming, 'vp' for real-time vp, 'draft' for round draft, 'full draft' for both round and initial drafts, 'random' for randomized milestones and awards, 'fast' for fast mode (no end turn option). You can write these terms in any order. Default is 'any/i don't care' for all of these options. To turn anything off put '-' (minus sign) in front of the term like '-vp -wgt'. Use 'off' if you want turn everything off.

**Alternative commands**
\`$lfg everything [number of player]\` to set everything to on.
\`$lfg anything [number of player]\` if you you are up for any expansion and any custom option. No need to specify the number if looking for any player count.
\`$lfg room\` will give you a quiet chat room to use.

LFG messages will delete themselves after 1 hr if no one signs up or after 2.5 hr if the quorum is not reached.`;

export const HELP_2V2 = `**Rules for 2 v 2**
1. Four players. You sit across from your teammate.
2. You can look at your teammate's cards at any time.
3. You can talk to your teammate privately at any time.
4. At end game, combine the score of your team and compare that to the other team's.
5. Unfriendly tie. You split points if tie for an award (3 pts if tie for first, 1 if tie for second).
6. Ban Poseidon and Philares.`;

export const HELP_ROVER =
  '`$rover [YYYY-MM-DD]` to get a photo taken by front facing hazard avoidance camera of Curiosity rover on that given day. The most recent photo is typically 2-3 before the current date. If not provided a date, a photo from 2 days before today will be used.';

export const HELP_WEATHER =
  '`$weather` to get the most recently available weather data from Insight Mars lander.';

export const HELP_CARD =
  "`$card [card name]` such as `$card tech demo` to pull up the image of the card and a link to Simon' database. Card name does not have to be a perfect match.";

export const HELP_MEME = `\`$marsmeme\` - to pull a random meme.
\`$marsmeme [meme key]\` - to pull out that specific meme.
\`$marsmeme list\` - to show the list of all meme keys.
\`$marsmeme set [meme key] [url of image file] [meme title]\` - to add a meme to the database.
\`$marsmeme delete [meme key]\` - to delete a meme.`;

export const HELP_APOD =
  '`$apod` to retrieve astronomy picture of the day. Powered by NASA API: https://apod.nasa.gov/apod/astropix.html';

export const HELP_POLL = `\`$poll ["question"] [optional answers]\` creates a poll. The command takes in one argument for a yes or no question such as \`$poll "Are you a robot?"\` or up to five arguments for the question statement and 1-4 answers. Each argument is separated by space or grouped together by "quotation mark". No need for quotation mark if no space in the option. For example, \`$poll "What is Rover?" dog car "mars robot"\``;

export const HELP_SETUP = `\`$setup\` sends out a short questionaire about how you and other players would like to set up a game. This can only be used in one of the game rooms (chat).`;

export const HELP_FLIP = `\`$flip\` flips a coin.`;

export const HELP_D = `\`$d [number]\` rolls a d[number] die. For example, \`$d 6\` or \`$d 20\`. If a number is not provided, d6, a six-sided die, will be used by default. You can also use \`$roll\` \`$d6\` or \`$dice\` instead.`;

export const HELP_SEARCH = `\`$search\` to test your luck and search for life.`;

export const HELP_CHANGELOG = `Check the changelog to see what is recently added to the repo: https://github.com/bafolts/terraforming-mars/wiki/Changelog`;

export const HELP_DRAFT = `The initial draft is done in two phases:
**Phase 1**: You get one pack of five project cards. Choose 1 card and pass the remaining to the left. Get 4 cards from players on your right, choose 1 and pass the remaining to the left. Repeat until you get 5 cards.
**Phase 2**: You get another pack of five cards. Do the same as in phase 1 but pass the cards to the right instead.

(If prelude expansion is used, 4 prelude cards are dealt at the beginning of phase 1, but not drafted until the end of phase 2. Pick 1 prelude cards, pass the remaining to the left. Repeat until you have 4 preludes.)

Then you decide which project cards to keep and which 2 prelude cards to use.`;

export const HELP_MUSIC = `Here is a playlist of space-themed music to listen while playing Terraforming Mars: https://melodice.org/playlist/terraforming-mars-2016/`;

export const HELP_TEAM = `$team [number of team] [list of people] will randomly generate specified number of teams from the given list which could be @users or simple text names.`;

export const HELP_FAQ = `Here is a comprehensive FAQs of Terraforming Mars: https://drive.google.com/file/d/1IkXKjiDdAlNqe2hOnUJkzEVjW5VtmBax/view?usp=sharing`;

export const HELP_BUG = `You can report the bug in <#742721510376210583> channel or even better at the Github repo https://github.com/bafolts/terraforming-mars/issues.`;

export const HELP_GLOBALEVENTS = `\`\`\`
Distribution of ALL global events
+------------+-----+--------+-------+
|            | top | bottom | total |
+------------+-----+--------+-------+
| mars first | 7   | 6      | 13    |
+------------+-----+--------+-------+
| scientists | 7   | 5      | 11    |
+------------+-----+--------+-------+
| unity      | 6   | 7      | 13    |
+------------+-----+--------+-------+
| greens     | 4   | 7      | 11    |
+------------+-----+--------+-------+
| reds       | 5   | 6      | 11    |
+------------+-----+--------+-------+
| kelvinists | 7   | 5      | 12    |
+------------+-----+--------+-------+\`\`\``;

export const HELP_POSITIVEEVENTS = `\`\`\`
Distribution of POSITIVE global events
+------------+-----+--------+-------+
|            | top | bottom | total |
+------------+-----+--------+-------+
| mars first | 3   | 3      | 6     |
+------------+-----+--------+-------+
| scientists | 6   | 4      | 10    |
+------------+-----+--------+-------+
| unity      | 3   | 6      | 9     |
+------------+-----+--------+-------+
| greens     | 2   | 3      | 5     |
+------------+-----+--------+-------+
| reds       | 4   | 1      | 5     |
+------------+-----+--------+-------+
| kelvinists | 1   | 2      | 3     |
+------------+-----+--------+-------+
\`\`\``;

export const HELP_DEMO = `http://terraforming-mars.herokuapp.com/`;

export const HELP_BETA = `http://fplbg.com:8080`;

export const HELP_INFLUENCE = `Normally, you can achieve a maximum of 3 influence:
  - 1 for Chairman
  - 1 for Party Leader of the Dominant Party
  - 1 for any amount of non-Leader delegates in the Dominant Party
A card "Event Analyst" provides one extra influence on top of this.`;
