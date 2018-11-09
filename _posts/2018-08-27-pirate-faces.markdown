---
layout: post
title:  "Making pirate faces of Ethereum addresses"
date:   2018-08-27 10:00:00 -0400
categories: Art
thumbnail: "http://localhost:4000/img/posts/pirate-faces.png"
excerpt: "Making pirate faces of Ethereum addresses"
featured_image: "https://playdarkwinds.com/img/posts/players-screen-pirates.png.PNG"

---

If you are a [Darkwinds](https://www.playdarkwinds.com) player and you were wondering where the heck your avatar comes from, this post will answer your question. And if you’re not a player (yet) this might be interesting to you.  When we’re born we don’t chose how we want to look or what gender we will have, neither our skin colour, besides many other things related to our fenotype. Those decisions are taken by our genes, from our progenitors. Is all about chances and probabilities.


Ethereum addresses are composed by hexadecimal notation: it means that its numbers are from 0 to 9 and letters from A to F. This notation gave us 16 characters: 0 1 2 3 4 5 6 7 8 9 A B C D E F. These addresses are made up randomly, and the posibility of having to equals is impossible. It means that an Ethereum wallet carrier can’t decide the combination of characters in its address.


Unlike social networks, where users create their profiles and upload a profile picture, in the blockchain you can’t do that: the only way other users can identify you is only by your address. We think this is a great input.

In Darkwinds, as players battle each other, they need to identify each other. As Darkwinds is our own platform, we would have been able to let users upload their own picture (as they can do now with their names that is locally storaged, not in the blockchain for the reasons we mentioned earlier in this post).

Instead of that, we thought: what if we create the player’s avatars with art generated according to the
randomness of their addresses? That’s why we created an algorithm that works with the combination of three cool things: the SVG standard (scalable vector graphics), JS and the addresses of our players. The first element is really good to render graphics in any browser and is a great way to [draw with code](https://www.w3schools.com/graphics/svg_intro.asp). The second one is a key element in our game, and the third, is what involves our players in the process.

To give an example. Let’s take this Ethereum address:

**0xB25d2e4276a4E539741Ca11b590B9447B26A8051**

Forget about 0x. Take as our first character the B. The B is easily transformed into an integer. In this case is 11. Let’s say that if and address has in its first character an odd number, and is greather than 7, our pirate will have long hair. Let’s take the 2 next to the B. Let’s say that if the second character is an even, our pirate will have a nice hat, otherwise, the pirate will have a headscarf. If we keep doing the same exercise with every character, we are able to play with the genes of our pirates, composed by the characters of their addresses.


![alt text](/img/posts/players-screen-pirates.png.PNG "Pirates playing")

*Pirates playing*

![alt text](/img/posts/pirate-faces.png "Ethereum transactions from Etherscan but seen with faces instead the numbers and letters of addresses")

*Ethereum transactions from Etherscan but seen with faces instead the numbers and letters of addresses*