const _ = require('lodash');
const $ = require("jquery");
let objects = [
    {
        type: 'x-tile',
        top: 3,
        left: 1
    },
    {
        type: 'x-tile',
        top: 5,
        left: 6
    },
    {
        type: 'x-tile',
        top: 6,
        left: 6
    },
    {
        type: 'flower-tile',
        top: 1,
        left: 4,
        isEntered: false,
        show: true,


        runBehavior: function (name) {
            let self = this;

            if (name === 'onEnter') {

                if (self.isEntered === false) {
                    if (_.has(player, 'flowers')) {
                        player.flowers += 1;
                    } else {
                        player.flowers = 1;
                    }

                    console.log(player.flowers);
                    this.isEntered = true;
                    this.show = false;
                }
            }
        }
    }
];

//generate some more flowers...
class Flower {
    constructor(top, left) {
        this.type = "flower-tile";
        this.top = top;
        this.left = left;
        this.isEntered = false;
        this.show = true;
    }

    runBehavior(name, player) {
        let self = this;
        console.log(player)
        if (name === 'onEnter') {

            if (self.isEntered === false) {
                if (_.has(player, 'flowers')) {
                    player.flowers += 1;
                } else {
                    player.flowers = 1;
                }

                console.log(player.flowers);
                this.isEntered = true;
                this.show = false;
            }
        }
    }
}
objects.push(new Flower(1, 1));
_.times(500, function() {

    let top = _.random(0,99);
    let left = _.random(0,99);
    if (getObjectsOnTile(objects, top, left).length === 0){
        objects.push(new Flower(top, left))
    }
});

function getObjectsHtml(objects, top, left) {
    let html = '';
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].top === top
            && objects[i].left === left
            && objects[i].show !== false
        ) {
            html += '<div class="' + objects[i].type + '"></div>';
        }
    }

    if (html.length > 0) {
        return html;
    }
    return '<div class="ground-tile"></div>';
}

function getObjectsOnTile(objects, top, left) {
    let objList = [];
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].top === top
            && objects[i].left === left
            && objects[i].show !== false
        ) {
            objList.push(objects[i])
        }
    }
    return objList;
}


const canvasHeight = 100;
const canvasWidth = 100;


let divClearBoth = '<div style="clear:both"></div>';
let player = {
    position: {
        top: 2,
        left: 2
    },
    health: 100,
    html: '<div class="player-tile"></div>',
    moveRight: function () {
        let oldPosition = _.cloneDeep(player.position);
        if (this.position.left + 1 < canvasWidth) {
            this.position.left += 1;
            this.html = '<div class="player-tile-right"></div>';
        }
        this.move(oldPosition, player.position);
    },
    moveLeft: function () {
        let oldPosition = _.cloneDeep(player.position);
        if (this.position.left > 0) {
            this.position.left -= 1;
            this.html = '<div class="player-tile-left"></div>';
        }
        this.move(oldPosition, player.position);
    },
    moveDown: function () {
        let oldPosition = _.cloneDeep(player.position);
        if (this.position.top < canvasHeight - 1) {
            this.position.top += 1;
            this.html = '<div class="player-tile-down"></div>';
        }
        this.move(oldPosition, player.position);
    },
    moveUp: function () {
        let oldPosition = _.cloneDeep(player.position);
        if (this.position.top > 0) {
            this.position.top -= 1;
            this.html = '<div class="player-tile-up"></div>';
        }
        this.move(oldPosition, player.position);
    }, move: function (oldPosition, newPosition) {
        let objectsOnTile = getObjectsOnTile(objects, newPosition.top, newPosition.left);
        if (objectsOnTile.length > 0) {
            _.forEach(objectsOnTile, function (object) {
                try {
                    object.runBehavior('onEnter', player);
                } catch (e) {
                    console.log('no behavior found...');
                }

            })
        }
        else {
            console.log('no objects on this tile')
        }
    }
};


function redrawCanvas() {
    let marginVertical = 6;
    let marginHorizontal = 6;
    let canvasString = '';
    for (let i = 0; i < canvasHeight; i++) {
        let topMargin = player.position.top - marginVertical;
        let bottomMargin = player.position.top + marginVertical;
        if (i < topMargin || i > bottomMargin) {
            continue;
        }


        let lineString = '';
        for (let j = 0; j < canvasWidth; j++) {
            let symbol = '';
            let leftMargin = player.position.left - marginHorizontal;
            let rightMargin = player.position.left + marginHorizontal;

            if (j < leftMargin || j > rightMargin) {
                continue;
            }
            let monsterHtml = getObjectsHtml(objects, i, j);
            if (player.position.top === i && player.position.left === j) {
                monsterHtml = player.html;
            }
            lineString += monsterHtml;


        }
        canvasString += lineString + divClearBoth;
    }
    $("#myDiv").html(canvasString);


    let playerElement = $('#player');
    playerElement
        .find('.player-position')
        .html('Left: ' + player.position.left + '; Top: ' + player.position.top + ';');
    playerElement
        .find('.player-health')
        .html(player.health);
    if (_.has(player, 'flowers')) {
        $('#player')
            .find('.player-flowers')
            .html('Flowers: ' + player.flowers);

    }
}

redrawCanvas();


let checkPlayerKey = require('./checkKey');
let checkKey = function checkKey(e) {
    checkPlayerKey(e, player);
    redrawCanvas();
};

document.onkeydown = checkKey;