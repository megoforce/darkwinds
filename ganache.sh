#!/bin/bash
####
## Name: ganache.sh
## Description: Launches the ganache-cli with 11 accounts containing 150,000 Ether, gasPrice 1wei, gasLimit 8 million gas
##  which reflects the current gasLimit at the time of writing.
####

ganache-cli --port 7545 --account="0xe348fc12cad2bcd2aa36974d37d63e9576eba150de29ab12befb6575eae89920, 150000000000000000000000" \
                        --account="0xc6d7384572d21c5bc62894049d0b52917ee2757df1457963bbea0400aab021a5, 150000000000000000000000" \
                        --account="0x8621e85a52ca50e4d618ce1ae138353d9abbf6b8e443a4bb53a3f4ccce76f127, 150000000000000000000000" \
                        --account="0x33a470ab3465be945f8d64c0138cd044ea3889c6a4fe15af38b9242d12a3b007, 150000000000000000000000" \
                        --account="0x89c695ae9b51786104bb5c942c0b20488427c42aa88c952f534447518c7e0ed7, 150000000000000000000000" \
                        --account="0x9331ccda469ac3b99af49549761608f0bebafbe59d8174dc249083ed0ee6cc16, 150000000000000000000000" \
                        --account="0x46e16fb52898e1c7b559208c4f2cf9906e2b6786dfac29243901df1cb14fd7ee, 150000000000000000000000" \
                        --account="0x33486a3252e95f746a3c7c2709cc83e755ec3bdd5ac7f0f026535137a51b3a4f, 150000000000000000000000" \
                        --account="0x91c723006a599f988229619b16db848a62fba55dc30e46f994274aa0746cb3da, 150000000000000000000000" \
                        --account="0x573c908a83ea29ad4f1b7563de915265bf9aad985a38971c5ea954b5f7edd395, 150000000000000000000000" \
                        --account="0x47cdb0b72433cadf4b31d5e7be9a6c9a0aeee1aad9f4311fb2691c719c340a8f, 150000000000000000000000" \
                        -g 8 -l 7000000