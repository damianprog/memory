(() => {
    const board = document.querySelector(".board");
    const levelDropdown = document.querySelector("select");
    const movesCounter = document.querySelector(".moves-counter");
    const timeCounter = document.querySelector(".time-counter");

    let timeCounterInterval = "";

    let cardsMaxQty = parseInt(levelDropdown[2].value);
    let difficultyCardsQty = parseInt(levelDropdown[0].value);

    let cardsHTML = "";

    const createCardElements = () => {
        for (let i = 0; i < cardsMaxQty; i++) {
            cardsHTML = cardsHTML.concat("<div class='card'><div class='card-front'></div><div class='card-back'></div></div>");
        }
    
        board.insertAdjacentHTML('beforeend', cardsHTML);
    };

    createCardElements();

    let minutesSeconds = "";

    const incrementTime = () => {
        minutesSeconds = timeCounter.innerHTML.split(":");
        minutesSeconds[1] = parseInt(minutesSeconds[1]) + 1;
        if (minutesSeconds[1] > 59) {
            minutesSeconds[1] = 0;
            minutesSeconds[0] = parseInt(minutesSeconds[0]) + 1;
        }

        if (minutesSeconds[0] < 10) minutesSeconds[0] = minutesSeconds[0].toString().padStart(2, '0');
        if (minutesSeconds[1] < 10) minutesSeconds[1] = minutesSeconds[1].toString().padStart(2, '0');

        timeCounter.innerHTML = `${minutesSeconds[0]}:${minutesSeconds[1]}`;
    };

    const startTimer = () => {
        timeCounterInterval = window.setInterval(() => {
            incrementTime();
        }, 1000);
    };

    const setBoardWidth = () => {
        const boardWidth = ((difficultyCardsQty / 4) * 128) - 15;
        board.style.width = `${boardWidth}px`;
    };

    let cardElements = document.querySelectorAll(".card");

    const setCards = () => {
        cardElements.forEach((card, index) => {
            card.style.opacity = index >= difficultyCardsQty ? 0 : 1;
            card.style.pointerEvents = index >= difficultyCardsQty ? "none" : "";
        });
    };

    const shuffleCards = () => {
        let cardNumbers = [...Array(difficultyCardsQty).keys()];

        for (let i = 0; i < difficultyCardsQty; i++) {
            const randomCardIndex = Math.floor(Math.random() * cardNumbers.length);
            const randomCard = cardElements[cardNumbers[randomCardIndex]];

            const randomCardBack = randomCard.querySelector(".card-back");
            randomCardBack.style.background = `url('img/animal_${Math.floor(i / 2)}.jpg')`;

            cardNumbers.splice(randomCardIndex, 1);
        }
    }

    setBoardWidth();
    setCards();
    shuffleCards();

    const resetCounters = () => {
        cardsLeftQty = difficultyCardsQty ;
        movesCounter.innerHTML = "0";
        timeCounter.innerHTML = "00:00";
    };

    levelDropdown.addEventListener("change", event => {
        difficultyCardsQty = parseInt(event.target.value);
        window.clearInterval(timeCounterInterval);
        resetCounters();
        setBoardWidth();
        setCards();
        shuffleCards();
    });

    let cardsLeftQty = difficultyCardsQty ;

    const winBoard = document.querySelector(".win-board");
    const winBoardTime = document.querySelector(".win-board-time");
    const winBoardMoves = document.querySelector(".win-board-moves");
    const winBoardDifficulty = document.querySelector(".win-board-difficulty");

    const resolveWin = () => {
        window.clearInterval(timeCounterInterval);
        winBoard.style.display = "block";
        winBoardTime.innerHTML = timeCounter.innerHTML;
        winBoardMoves.innerHTML = movesCounter.innerHTML;
        winBoardDifficulty.innerHTML = levelDropdown.options[levelDropdown.selectedIndex].text;
    };

    const determineWin = () => {
        if (cardsLeftQty == 0) {
            resolveWin();
        }
    }

    const winBoardRestart = document.querySelector(".win-board-restart");

    winBoardRestart.addEventListener("click", () => {
        winBoard.style.display = "none";
        resetCounters();
        setCards();
        shuffleCards();
    });

    const incrementMoves = () => {
        movesCounter.innerHTML = parseInt(movesCounter.innerHTML) + 1;
    };

    const areDifferentCards = (firstCard, secondCard) => {
        return !firstCard.isSameNode(secondCard);
    };

    const hideCardsPair = (firstCard,secondCard) => {
        firstCard.style.opacity = 0;
        secondCard.style.opacity = 0;
    };

    let reversedCard = "";

    cardElements.forEach(card => {
        card.addEventListener("click", () => {
            card.style.transform = "rotateY(180deg)";
            
            if (movesCounter.innerHTML == "0" && !reversedCard) startTimer();

            if (reversedCard == "") reversedCard = card;

            if (areDifferentCards(card, reversedCard)) {
                const reversedCardBack = reversedCard.querySelector(".card-back");
                const currentCardBack = card.querySelector(".card-back");
                const reversedCardBackBgImg = getComputedStyle(reversedCardBack).backgroundImage;
                const currentCardBackBgImg = getComputedStyle(currentCardBack).backgroundImage;

                incrementMoves();

                board.style.pointerEvents = "none";
                setTimeout(() => {
                    if (reversedCardBackBgImg == currentCardBackBgImg) {
                        hideCardsPair(card, reversedCard);
                        card.style.pointerEvents = "none";
                        reversedCard.style.pointerEvents = "none";
                        cardsLeftQty -= 2;
                    }
                    card.style.transform = "none";
                    reversedCard.style.transform = "none";
                    board.style.pointerEvents = "auto";
                    reversedCard = "";
                    determineWin();
                }, 1500);
            }
        });
    });
})();