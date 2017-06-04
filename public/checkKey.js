
module.exports = function (e, player){

    e = e || window.event;

    if (e.keyCode == '38') {
        player.moveUp();
    }
    else if (e.keyCode == '40') {
        player.moveDown();

    }
    else if (e.keyCode == '37') {
        player.moveLeft()

    }
    else if (e.keyCode == '39') {
        player.moveRight()
    }
};