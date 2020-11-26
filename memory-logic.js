(() => {
    const board = document.querySelector(".board");
    const levelDropdown = document.querySelector("select");

    let cardsMaxQty = parseInt(levelDropdown[2].value);
    let cardsCurrentQty = parseInt(levelDropdown[0].value);

    let cardsHTML = "";

    for (let i = 0; i < cardsMaxQty; i++) {
        cardsHTML = cardsHTML.concat("<div class='card'><div class='card-front'></div><div class='card-back'></div></div>");
    }

    board.insertAdjacentHTML('beforeend', cardsHTML);

    let cardElements = document.querySelectorAll(".card");

    const setBoardWidth = () => {
        const boardWidth = ((cardsCurrentQty / 4) * 128) - 15;
        board.style.width = `${boardWidth}px`;
    };

    const setCardsOpacity = () => {
        cardElements.forEach((card, index) => {
            card.style.opacity = index >= cardsCurrentQty ? 0 : 1;
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
    setCardsOpacity();
    shuffleCards();

    levelDropdown.addEventListener("change", event => {
        cardsCurrentQty = parseInt(event.target.value);
        setBoardWidth();
        setCardsOpacity();
        shuffleCards();
    });

    let reversedCard = "";

    cardElements.forEach(card => {
        card.addEventListener("click", () => {
            card.style.transform = "rotateY(180deg)";

            if (reversedCard == "") {
                reversedCard = card;
            } else if (!card.isSameNode(reversedCard)) {
                const reversedCardBack = reversedCard.querySelector(".card-back");
                const currentCardBack = card.querySelector(".card-back");
                const reversedCardBackBgImg = getComputedStyle(reversedCardBack).backgroundImage;
                const currentCardBackBgImg = getComputedStyle(currentCardBack).backgroundImage;;
                board.style.pointerEvents = "none";
                setTimeout(() => {
                    if (reversedCardBackBgImg == currentCardBackBgImg) {
                        card.style.opacity = 0;
                        reversedCard.style.opacity = 0;
                    }
                    card.style.transform = "none";
                    reversedCard.style.transform = "none";
                    board.style.pointerEvents = "auto";
                    reversedCard = "";
                }, 1500);
            }
        });
    });
})();