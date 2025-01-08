export function move() {
    const { player, cursors } = window.gameVars;

    function changeOrientation() {
        const currentAnim = player.anims.currentAnim.key;
        const lastOrientation = window.gameVars.lastOrientation;
        if (!currentAnim.endsWith(lastOrientation)) {
            const orientation = currentAnim.replace(lastOrientation === 'Right' ? 'Left' : 'Right', '');
            player.anims.play(`${orientation}${lastOrientation}`, true);
        }
    }

    function movePlayer(direction, speedType, speedValue) {
        window.gameVars.isWalking = true;
        player.setVelocityX(direction * speedValue);
        player.anims.play(`player${speedType}${window.gameVars.lastOrientation}`, true);
    }

    function jumpMove() {
        if (cursors.rightKey.isDown) {
            player.setVelocityX(100);
        } else if (cursors.leftKey.isDown) {
            player.setVelocityX(-100);
        } else {
            player.setVelocityX(0);
        }
    }

    function jump() {
        if (!window.gameVars.isJumping && player.body.touching.down) {
            window.gameVars.isJumping = true;
            player.setVelocityY(-400);
            player.anims.play(`playerJumpUp${window.gameVars.lastOrientation}`, true);
            jumpMove();
        } else if (window.gameVars.isJumping && !player.body.touching.down && !window.gameVars.hasDoubleJump && window.gameVars.canDoubleJump === true) {
            window.gameVars.hasDoubleJump = true;
            window.gameVars.isJumping = true;
            player.setVelocityY(-400);
            player.anims.play(`playerDoubleJump${window.gameVars.lastOrientation}`, true);
            jumpMove();
        } else if (player.body.velocity.y < 0 && !window.gameVars.hasDoubleJump) {
            player.anims.play(`playerJumpUp${window.gameVars.lastOrientation}`, true);
            jumpMove();
        } else if (player.body.velocity.y > 0) {
            player.anims.play(`playerJumpDown${window.gameVars.lastOrientation}`, true);
            jumpMove();
        } else if (player.body.touching.down) {
            player.anims.play(`playerLand${window.gameVars.lastOrientation}`, true);
            player.once('animationcomplete', () => {
                player.setVelocityX(0);
                window.gameVars.isJumping = false;
                window.gameVars.hasDoubleJump = false;
                window.gameVars.canDoubleJump = false;
            });
        }
    }

    function slide() {
        const currentTime = Date.now();
        const speed = window.gameVars.lastOrientation === 'Left'? -300 : 300
        if (!window.gameVars.isSliding && player.body.touching.down && (currentTime - window.gameVars.lastSlide >= 300 || window.gameVars.lastSlide === 0)) {
            player.anims.play(`playerSlide${window.gameVars.lastOrientation}`, true);
            window.gameVars.isSliding = true;
            player.setVelocityX(speed);
            window.gameVars.startingSlide = currentTime;
        } else if (window.gameVars.isSliding && player.body.touching.down && !player.anims.currentAnim.key.startsWith('playerSlide')) {
            player.setVelocityX(speed);
            player.anims.play(`playerSlide${window.gameVars.lastOrientation}`, true);
        }
    
        if (window.gameVars.isSliding && currentTime - window.gameVars.startingSlide >= 500) {
            window.gameVars.isSliding = false;
            window.gameVars.lastSlide = currentTime;
            player.setVelocityX(0);
        }
    }

    function fall() {
        window.gameVars.isFalling = true;
        player.anims.play(`playerLand${window.gameVars.lastOrientation}`, true);
        player.once('animationcomplete', () => {
            player.setVelocityX(0);
            window.gameVars.isFalling = false;
        });
    }

    // Update state when not touching the ground
    if (!player.body.touching.down && !window.gameVars.isJumping) {
        window.gameVars.isJumping = true;
    }

    // Movements
    if (cursors.leftKey.isDown && player.body.touching.down && !window.gameVars.isJumping && !window.gameVars.isSliding) {
        movePlayer(-1, cursors.runKey.isDown ? 'Run' : 'Walk', cursors.runKey.isDown ? 200 : 100);
    }
    if (cursors.rightKey.isDown && player.body.touching.down && !window.gameVars.isJumping && !window.gameVars.isSliding) {
        movePlayer(1, cursors.runKey.isDown ? 'Run' : 'Walk', cursors.runKey.isDown ? 200 : 100);
    }

    // Stop moving while jumping, falling or sliding
    if ((!cursors.rightKey.isDown && !cursors.leftKey.isDown) || window.gameVars.isJumping || window.gameVars.isSliding) {
        if (window.gameVars.isWalking) {
            player.setVelocityX(0);
        }
        window.gameVars.isWalking = false;
    }

    // Idle
    if (!window.gameVars.isWalking && !window.gameVars.isJumping && player.body.touching.down) {
        player.anims.play(`playerIdle${window.gameVars.lastOrientation}`, true);
    }

    // Jump
    if (cursors.jumpKey.isDown || window.gameVars.isJumping) {
        window.gameVars.isSliding = false;
        jump();
    }

    // Double jump key handler
    if (cursors.jumpKey.isDown && window.gameVars.canDoubleJump === false) {
        window.gameVars.canDoubleJump = 'first';
    } else if (!cursors.jumpKey.isDown && window.gameVars.canDoubleJump === 'first') {
        window.gameVars.canDoubleJump = 'second';
    } else if (cursors.jumpKey.isDown && window.gameVars.canDoubleJump === 'second') {
        window.gameVars.canDoubleJump = true;
    }

    // Fall
    if (!player.body.touching.down && !window.gameVars.isJumping && !window.gameVars.isFalling) {
        window.gameVars.isSliding = false;
        fall();
    }

    // Slide
    if ((cursors.slideKey.isDown && window.gameVars.player.body.speed >= 200) || window.gameVars.isSliding) {
        window.gameVars.isJumping = false;
        window.gameVars.isFalling = false;
        slide();
    }
    
    // Handle orientation
    if (cursors.rightKey.isDown) {
        window.gameVars.lastOrientation = 'Right';
        changeOrientation();
    } else if (cursors.leftKey.isDown) {
        window.gameVars.lastOrientation = 'Left';
        changeOrientation();
    }
}