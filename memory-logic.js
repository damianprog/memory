(() => {
    const board = document.querySelector(".board");
    const levelDropdown = document.querySelector("select");
    const movesCounter = document.querySelector(".moves-counter");
    const timeCounter = document.querySelector(".time-counter");

    let timeCounterInterval = "";

    let cardsMaxQty = parseInt(levelDropdown[2].value);
    let cardsCurrentQty = parseInt(levelDropdown[0].value);

    let cardsHTML = "";

    for (let i = 0; i < cardsMaxQty; i++) {
        cardsHTML = cardsHTML.concat("<div class='card'><div class='card-front'></div><div class='card-back'></div></div>");
    }

    board.insertAdjacentHTML('beforeend', cardsHTML);

    let cardElements = document.querySelectorAll(".card");

    let minutesSeconds = "";
    const startTimer = () => {
        timeCounterInterval = window.setInterval(() => {
            minutesSeconds = timeCounter.innerHTML.split(":");
            minutesSeconds[1] = parseInt(minutesSeconds[1]) + 1;
            if (minutesSeconds[1] > 59) {
                minutesSeconds[1] = 0;
                minutesSeconds[0] = parseInt(minutesSeconds[0]) + 1;
            }

            if (minutesSeconds[0] < 10) minutesSeconds[0] = minutesSeconds[0].toString().padStart(2, '0');
            if (minutesSeconds[1] < 10) minutesSeconds[1] = minutesSeconds[1].toString().padStart(2, '0');

            timeCounter.innerHTML = `${minutesSeconds[0]}:${minutesSeconds[1]}`;
        }, 1000);
    };

    const setBoardWidth = () => {
        const boardWidth = ((cardsCurrentQty / 4) * 128) - 15;
        board.style.width = `${boardWidth}px`;
    };

    const setCards = () => {
        cardElements.forEach((card, index) => {
            card.style.opacity = index >= cardsCurrentQty ? 0 : 1;
            card.style.pointerEvents = "auto";
        });
    };

    const shuffleCards = () => {
        let cardNumbers = [...Array(cardsCurrentQty).keys()];

        for (let i = 0; i < cardsCurrentQty; i++) {
            const cardRandomIndex = Math.floor(Math.random() * cardNumbers.length);
            const card = cardElements[cardNumbers[cardRandomIndex]];

            const cardBack = card.querySelector(".card-back");
            cardBack.style.background = `url('img/animal_${Math.floor(i / 2)}.jpg')`;

            cardNumbers.splice(cardRandomIndex, 1);
        }
    }

    setBoardWidth();
    setCards();
    shuffleCards();

    levelDropdown.addEventListener("change", event => {
        cardsCurrentQty = parseInt(event.target.value);
        cardsLeftQty = cardsCurrentQty ;
        window.clearInterval(timeCounterInterval);
        movesCounter.innerHTML = "0";
        timeCounter.innerHTML = "00:00";
        setBoardWidth();
        setCards();
        shuffleCards();
    });

    let reversedCard = "";
    let cardsLeftQty = cardsCurrentQty ;

    const winBoard = document.querySelector(".win-board");
    const winBoardTime = document.querySelector(".win-board-time");
    const winBoardMoves = document.querySelector(".win-board-moves");
    const winBoardDifficulty = document.querySelector(".win-board-difficulty");

    const resolveWin = () => {
        if (cardsLeftQty == 0) {
            window.clearInterval(timeCounterInterval);
            winBoard.style.display = "block";
            winBoardTime.innerHTML = timeCounter.innerHTML;
            winBoardMoves.innerHTML = movesCounter.innerHTML;
            winBoardDifficulty.innerHTML = levelDropdown.options[levelDropdown.selectedIndex].text;
        }
    }

    const winBoardRestart = document.querySelector(".win-board-restart");

    winBoardRestart.addEventListener("click", () => {
        winBoard.style.display = "none";
        movesCounter.innerHTML = "0";
        timeCounter.innerHTML = "00:00";
        cardsLeftQty = cardsCurrentQty ;
        setCards();
        shuffleCards();
    });

    cardElements.forEach(card => {
        card.addEventListener("click", () => {
            card.style.transform = "rotateY(180deg)";
            console.log("Card clicked!");
            if (reversedCard == "") {
                reversedCard = card;
            } else if (!card.isSameNode(reversedCard)) {
                const reversedCardBack = reversedCard.querySelector(".card-back");
                const currentCardBack = card.querySelector(".card-back");
                const reversedCardBackBgImg = getComputedStyle(reversedCardBack).backgroundImage;
                const currentCardBackBgImg = getComputedStyle(currentCardBack).backgroundImage;

                movesCounter.innerHTML = parseInt(movesCounter.innerHTML) + 1;

                board.style.pointerEvents = "none";
                setTimeout(() => {
                    if (reversedCardBackBgImg == currentCardBackBgImg) {
                        card.style.opacity = 0;
                        reversedCard.style.opacity = 0;
                        card.style.pointerEvents = "none";
                        reversedCard.style.pointerEvents = "none";
                        cardsLeftQty -= 2;
                    }
                    card.style.transform = "none";
                    reversedCard.style.transform = "none";
                    board.style.pointerEvents = "auto";
                    reversedCard = "";
                    resolveWin();
                }, 1500);
            }
            if (movesCounter.innerHTML == "0") startTimer();
        });
    });
})();