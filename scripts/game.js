var player, monster, board;
var homeId = 4;

reset();

// functions
function reset() {

    // create the board, player and monster
    board = new Board();
    board.setUp();

    player = new Player();
    monster = new Monster();

    // take images from player and monster to display in board
    board.monsterPanel.addImage(monster.url);
    board.playerPanel.addImage(player.url);

    // build the board

    // define home dungeon
    document.getElementById(homeId).classList.add('dungeon--home');

    // insert player in the first dungeon
    document.getElementsByClassName('dungeon--home')[0].getElementsByClassName('quadrant3')[0].appendChild(player.element)
    player.dungeonAt = homeId;

    // open home and set first moves
    board.dungeons.dungeons[homeId].open();
    updateCanMove();


}

function onOpen(dungeon) {
    var treasure = new Treasure();
    treasure.dungeonAt = dungeon;
    if(Math.random() < 0.8) {
        placeElement(dungeon,'quadrant0',treasure.element);
    }
}

function updatePlayerStats(stat, mult) {
    player.updateStats(stat,mult);
}

function updatePlayerPanel() {
    board.playerPanel.update(player.stats);
}

function updateCanMove() {

}

function movePlayer(dungeonId) {
    placeElement(dungeonId,'quadrant3',player.element);
    player.dungeonAt = dungeonId;
    if(!monster.found && player.dungeonAt != homeId) {
        if(Math.random() < 0.2) {
            placeElement(dungeonId,'quadrant1',monster.element);
            monster.dungeonAt = dungeonId;
            board.monsterPanel.update(monster.stats);
        }
    }
}

function fight() {
    if(player.stats.attack > monster.stats.defense)
        alert('YOU WIN !');
    else if(player.stats.defense < monster.stats.attack)
        alert("YOU LOSE !");
    window.location.href = 'index.html';    
}

function placeElement(dungeon, quadrant, element) {
    document.getElementById(dungeon).getElementsByClassName(quadrant)[0].appendChild(element);
}