const gamesBoardContainer = document.querySelector("#gamesboard-container");
const optionContainer = document.querySelector(".option-container");
const flipButton = document.querySelector("#flip-button");

//option choosing
let angle = 0;
function flip() {
  const optionShips = Array.from(optionContainer.children);
  //IF statement for flipping the ships
  // if (angle === 0) {
  //   angle = 90;
  // } else {
  //   angle = 0;
  // }

  //More advanced way of getting the ships to flip without an IF statement
  angle = angle === 0 ? 90 : 0;
  optionShips.forEach(
    (optionShip) => (optionShip.style.transform = `rotate(${angle}deg)`)
  );
}

flipButton.addEventListener("click", flip);

//Creating boards
const width = 10;

function createBoard(color, user) {
  const gameBoardContainer = document.createElement("div");
  gameBoardContainer.classList.add("game-board");
  gameBoardContainer.style.backgroundColor = color;
  gameBoardContainer.id = user;

  for (let i = 0; i < width * width; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.id = i;
    gameBoardContainer.append(block);
  }

  gamesBoardContainer.append(gameBoardContainer);
}

createBoard("yellow", "player");
createBoard("pink", "computer");

//Creating Ships
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruiser = new Ship("cruiser", 3);
const battleship = new Ship("battleship", 4);
const carrier = new Ship("carrier", 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];

function addShipPiece(ship) {
  const allBoardBlocks = document.querySelectorAll("#computer div");
  let randomBoolean = Math.random() < 0.5;
  let isHorizontal = randomBoolean;
  let randomStartIndex = Math.floor(Math.random() * width * width);

  let validStart = isHorizontal
    ? randomStartIndex <= width * width - ship.length
      ? randomStartIndex
      : width * width - ship.length
    : randomStartIndex <= width * width - width * ship.length
    ? randomStartIndex
    : randomStartIndex - ship.length * width + width;

  let shipBlocks = [];

  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
    } else {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
    }
  }

  let valid;

  if (isHorizontal) {
    shipBlocks.every(
      (_shipBlock, index) =>
        (valid =
          shipBlocks[0].id % width !==
          width - (shipBlocks.length - (index + 1)))
    );
  } else {
    shipBlocks.every(
      (_shipBlock, index) =>
        (valid = shipBlocks[0].id < 90 + (width * index + 1))
    );
  }

  const notTaken = shipBlocks.every(
    (shipBlock) => !shipBlock.classList.contains("taken")
  );

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add("taken");
    });
  } else {
    addShipPiece(ship);
  }
}

ships.forEach((ship) => addShipPiece(ship));

//Drag player ships
let draggedShip;
const optionShips = Array.from(optionContainer.children);
optionShips.forEach((optionShip) =>
  optionShip.addEventListener("dragstart", dragstart)
);

const allPlayerBlocks = document.querySelectorAll("#player div");
allPlayerBlocks.forEach((playerBlock) => {
  playerBlock.addEventListener("dragover", dragOver);
  playerBlock.addEventListener("drop", dropShip);
});

function dragStart(e) {
  draggedShip = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dropShip() {
  const startId = e.target.id;
  const ship = ships[draggedShip.id];
}
