---
layout: post
title:  "Matchmaking"
date:   2018-09-27 14:00:00 -0400
categories: Engineering
thumbnail: "https://playdarkwinds.com/img/posts/darkwinds-pirate.jpg"
excerpt: "Matchmaking"
featured_image: "https://playdarkwinds.com/img/posts/darkwinds-pirate.jpg"

---

Today I want to talk about matchmaking. Matchmaking is important for a game like Darkwinds because it allows players to duel opponents from all over the world. Whenever someone enters the game, it expects two things: to be paired with another person of the same relative strength (in other words, the match must be fair), and to do so in a timely fashion. 

![Aye aye!](/img/posts/darkwinds-pirate.jpg)

In order to match players according to their strength ingame, we have to measure how much better is one against another. For Darkwinds, we are using TrueSkill which allows us to have a fair, online ranking of competitive players. To get ranked, a player must first play 12 competitive matches which allows us to get a good probabilistic estimate about the player's real skill.

Even when we will always try to match players to a near 50% probability of win for both sides, there can be times when that is not possible (for example, when most players are asleep or at work). We then will wait for a small amount of time and steadily decrease the win probability needed. That might mean that the match can be unfair, but the system will not decrease the loser's rating or increase the winner's rating by much as the result was somewhat expected.

Along with the Matchmaking update, we will be having regular competitive seasons. What does this mean? We will have 3-month seasons, starting today with Season 0 which will end on December 31st, 2018. On each season, players will compete with one another to get to the top of the ranking, and when the season ends the top players (32 in Season 0) will be invited to the Post Season Invitational, one of the premier Darkwinds tournaments which will determine who is the best Darkwinds player! Stay tuned for more information about the Post Season Invitational.

As we push this update today, we will be starting Season 0 of the Darkwinds Competitive Ranking! Do you have what it takes to be the best?

Keep on playing!
