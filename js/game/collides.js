export function checkCollides() {
    const player = window.gameVars.player;
    const lastPos = window.gameVars.lastPos || { x: player.x, y: player.y, size: player.width };

    if (window.gameVars.isCollide) {
        const collidedObject = window.gameVars.collidesGroup.getChildren().find(obj =>
            this.physics.overlap(player, obj)
        );

        if (collidedObject) {
            player.x = lastPos.x;
            player.y = lastPos.y;

            player.x += player.x < collidedObject.x ? -2 : 2;
        }

        window.gameVars.isCollide = false;
    } else {
        window.gameVars.lastPos = {
            x: player.x,
            y: player.y,
            size: player.width
        };
    }

    if (player.width !== lastPos.size) {
        const sizeDelta = player.width - lastPos.size;

        player.x -= sizeDelta / 2;
    }
}