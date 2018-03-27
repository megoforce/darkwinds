---
layout: page
title: About
permalink: /about/
---

Darkwinds is an online trading card game wheretwo players confront each other in a sea battleof ships.While the smart contract handles the owner-ship  of  tokens,  game  matches  occur  off-chain,in a webGL website running the Metamask webextension  or  compatible  thin  wallets.

A game server  is  responsible for matchmaking between two   adversaries,   validating   the   signature   ofboth  players,  thus  verfying  the  ownership  ofboth  player  decks.While  the  official  gameserver will be the only endorsed way of playingDarkwinds, other developers are free to read theABIs and access players cards to create differentgame  modes,  tournaments  or  applications  thatconnect to the game.Game  servers  only  require  a  signed  messagefrom  the  user  wallet  to  verify  ownership.   Theuser private keys are never read or stored.