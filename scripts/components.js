function Board() {
    this.element = document.getElementById('game');
    this.element.innerHTML = "";
    
    this.dungeons = new Dungeons();
    this.playerPanel = new Panel();
    this.monsterPanel = new Panel();

    this.playerPanel.element.className += ' player';
    this.monsterPanel.element.className += ' monster';

    this.setUp = function() {
        this.element.appendChild(this.monsterPanel.element);
        this.element.appendChild(this.dungeons.element);
        this.element.appendChild(this.playerPanel.element);
    };

}

function Panel() {
    this.element = document.createElement('div');
    this.element.className = 'panel';
    
    var image = document.createElement('img');
    image.className = 'panel__img';
    var stats = new Stats();
    stats.element.className = 'panel__stats';

    this.element.appendChild(image);
    this.element.appendChild(stats.element);

    this.addImage = function(url) {
        this.element.children[0].src = url;
    };
    
    this.update = function(newStats) {
        for(var stat in newStats) {
            this.element.getElementsByClassName(stat)[1].innerHTML = newStats[stat].toString();
        }
    };
    
}

function Stats() {
    this.element = document.createElement('div'); 
    var prefix = './pics/';
    var stats = [
        {name: "attack", icon:"sword.png"},
        {name: "defense", icon:"shield.png"},
        {name: "speed", icon:"boots.png"},
        {name: "level", icon:"star.png"}
    ];
    
    stats.forEach(function(stat){
        var element = document.createElement('div');
        element.className = 'stat';
        element.id = stat.name;
        var img = document.createElement('img'); 
        img.src = prefix+stat.icon;
        img.className = 'stat__img '+stat.name;
        var value = document.createElement('span');
        value.innerHTML = '0';
        value.className = 'stat__value '+stat.name;
        element.appendChild(img);
        element.appendChild(value);
        this.element.appendChild(element);
    }.bind(this));
    
}

function Monster() {
    this.url = 'pics/monster.png';
    this.element = document.createElement('img');
    this.element.src = this.url; 
    this.element.id = 'monster';
    this.found = false;
    this.dungeonAt = -1;
    this.stats = {
        attack: 5,
        defense: 5
    };
    this.element.addEventListener('click', function(event){
        if(this.dungeonAt == player.dungeonAt)
            fight();
        event.stopPropagation();
    }.bind(this));
}

function Player() {
    this.url = 'pics/player.png';
    this.element = document.createElement('img');
    this.element.src = this.url; 
    this.element.id = 'player';
    this.stats = {
        attack: 0,
        defense: 0,
        speed: 0,
        level: 0,
    };
    this.dungeonAt = -1;

    this.updateStats = function(stat, mult) {
        this.stats[stat] = eval(this.stats[stat].toString() + mult);
    };
    
}

function Treasure() {
    this.closed = 'pics/closedTreasure.png';
    this.opened = 'pics/treasure.png';
    this.numOfTreasures = 1;
    this.dungeonAt = -1;
    this.message = 'You found a treasure!';
    this.stats = ["attack","defense"];
    this.multipliers = ["+1","+2","+3"]; 
    this.element = document.createElement('img');
    this.element.src = this.closed;
    this.element.id = 'treasure';
    this.element.addEventListener('click', function(event) {
        if(this.dungeonAt == player.dungeonAt && this.numOfTreasures>0) {
            var mult = this.multipliers[Math.floor(Math.random()*this.multipliers.length)];
            var stat = this.stats[Math.floor(Math.random()*this.stats.length)];  
            alert(this.message + '\n' + mult + ' ' + stat);
            updatePlayerStats(stat, mult);
            updatePlayerPanel();
            this.numOfTreasures--;
            if(this.numOfTreasures==0)
                this.element.src = this.opened;
        }
        event.stopPropagation();
    }.bind(this));
}

function Dungeons() {
    this.element = document.createElement('div');
    this.element.className = 'dungeons';
    this.dungeons = [];
    for(var i=0; i<9; i++) {
        var dungeon = new Dungeon();
        dungeon.element.id = i;
        this.element.appendChild(dungeon.element);
        this.dungeons.push(dungeon);
    }
    
}

function Dungeon() {
    this.element = document.createElement('div');
    this.element.className = 'dungeon dungeon--closed';
    this.opened = false;
    this.canMove = true;
    this.empty = true;

    for(var j=0; j<4; j++) {
        var quadrant = document.createElement('div'); 
        quadrant.className = 'quadrant quadrant'+j;
        this.element.appendChild(quadrant);
    }

    this.open = function() {
        this.opened = true;
        this.element.classList.remove('dungeon--closed');
        this.element.classList.add('dungeon--opened');
        onOpen(this.element.id); 
    };

    this.element.addEventListener('click',function() {
        if(this.canMove) {
            if(!this.opened)
                this.open();
            movePlayer(this.element.id);
            updateCanMove();
        }
    }.bind(this));
}