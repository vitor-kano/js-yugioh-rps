const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardsSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector(".card-box.framed#computer-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector(".card-box.framed#player-cards"),
    },
    actions: {button: document.getElementById("next-duel"),}
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    }, 
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function drawSelectCard(id){
    state.cardsSprites.avatar.src = cardData[id].img;
    state.cardsSprites.name.innerText = cardData[id].name;
    state.cardsSprites.type.innerText = "Attribute: " + cardData[id].type;
}

async function removeAllCardsImages(){
    let cards = state.playerSides.computerBox;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => {
        img.remove();
    })

    cards = state.playerSides.player1Box;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => {
        img.remove();
    })
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    } else if(playerCard.loseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }
    await playAudio(duelResults);
    return duelResults.toUpperCase();
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}` 
}

async function setCardsField(cardId){
    //remove cartas das mãos
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
    
    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value){
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } else{
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails(){
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";
    state.cardsSprites.avatar.src = "";
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', `${pathImages}card-back.png`);
    cardImage.setAttribute('data-id', idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });
    };
    return cardImage;
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        console.log(randomIdCard);
        const cardImage = await createCardImage(randomIdCard, fieldSide);
    
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardsSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try{
        audio.play();
    } catch{}
}

function init(){
    showHiddenCardFieldsImages(false);
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
    const bgm = document.getElementById("bgm");
    //bgm.play();
}

init();