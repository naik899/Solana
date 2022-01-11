const web3 = require("@solana/web3.js");
const prompt = require('prompt');
const {transferSOL, airDropSol, getWalletBalance} = require('./solana');


const userWallet = web3.Keypair.generate();
const publicKey = userWallet.publicKey.toString();
console.log(publicKey);


//Treasury
const secretKey=[
    111, 188,  76, 169,  30, 105, 254,  33, 228,  66,  56,
    215,   9,  37,  51, 188, 188, 188,  20, 224, 228, 115,
     17, 163, 151, 105, 113, 251, 105, 177,  28, 157, 125,
    202, 195, 203, 253, 137,  26, 209,   7,   2,  66, 193,
     76, 241, 203, 168, 213,   5, 226,  11, 142,  44, 125,
    191, 167, 172, 166, 207, 176, 137, 210,  27
]

const treasuryWallet= web3.Keypair.fromSecretKey(Uint8Array.from(secretKey));




const getRandomNumber = () => {
    return Math.floor(Math.random() * (5 - 1) + 1);
    //return Math.floor(Math.random() * (max - min) + min)
}


const driverFunction = async () => {

    await airDropSol(publicKey);
    await getWalletBalance(publicKey);

    await getWalletBalance(treasuryWallet.publicKey.toString());

    let stake = 0;
    let ratio = 0;

    prompt.start();

    prompt.get([{
        name: 'amount',
        description: 'What is the amount of SOL you want to stake?'
    }],
        async (err, result) => {
            stake = Number(result.amount)
            if (stake <= 2.5) {
                prompt.get([{
                    name: 'ratio',
                    description: 'What is the ratio of your staking?'
                }],
                    async (err, result) => {
                        let ratArray = result.ratio.split(":");
                        ratio = Number(ratArray[1]);

                        console.log("You will need to pay " + stake + " to move forward");

                        let returnAmount = stake * ratio;
                        console.log("You will get " + returnAmount + " if guessing the number correctly");

                        let numb = 1;
                        prompt.get([{
                            name: 'number',
                            description: 'Guess the random number from 1-5 (both 1,5 included)?'
                        }], async (err1, result1) => {
                            numb = Number(result1.number);
                            if (numb >= 1 && numb <= 5) {
                                let signature = await transferSOL(userWallet, treasuryWallet, stake);
                                console.log("Signature of payment for playing the game is :" + signature);

                                let randomNumber = getRandomNumber();
                                if (numb == randomNumber) {
                                    console.log("Your guess is absolutely correct");
                                    signature = await transferSOL(treasuryWallet, userWallet, returnAmount);
                                    console.log("Signature of winning the game is :" + signature);
                                }
                                else {
                                    console.log("Better luck next time");
                                    await getWalletBalance(treasuryWallet.publicKey.toString());
                                }
                            }
                            else {
                                console.log("You have entered invalid response");
                            }
                        }
                        )




                    }
                )


            }

            else {
                console.log("Stake cannot be more than 2.5 SOL");
            }
        }
    )




}

driverFunction();