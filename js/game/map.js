export function loadMap(map) {
    const storedData = window.localStorage.getItem('data');
    const datas = JSON.parse(storedData);
    map.properties.forEach( (prop) => {
        if (prop.name === "name") {
            datas.lvl = prop.value;
            window.localStorage.setItem('data', JSON.stringify(datas));
        }
    });

    // Unload previous map
    window.gameVars.collidesGroup.clear(true);
    window.gameVars.utilitiesGroup.clear(true);

    // Load Layers
    map.layers.forEach(layerData => {
        const tilesetName = layerData.properties.find(prop => prop.name === 'tileset')?.value;
        if (tilesetName) {
            const tileset = map.addTilesetImage(tilesetName, tilesetName);
            map.createLayer(layerData.name, tileset, 0, 0);
        }
    });

    // Object layers
    const collidesLayer = map.getObjectLayer('collides');
    const spawnPointLayer = map.getObjectLayer('spawnPoint');
    const utilitiesLayer = map.getObjectLayer('utilities');

    // Collides
    collidesLayer.objects.forEach(obj => {
        window.gameVars.collidesGroup.create(obj.x, obj.y, null)
            .setVisible(false)
            .setSize(obj.width, obj.height)
            .setOffset(16, 16)
            .setOrigin(0, 0);
    });

    // Utilities
    utilitiesLayer.objects.forEach(obj => {
        if (obj.type === 'mapTp') {
            window.gameVars.utilitiesGroup.create(obj.x, obj.y, null)
                .setVisible(false)
                .setSize(obj.width, obj.height)
                .setOffset(16, 16)
                .setOrigin(0, 0)
                .setName(`mapTp${obj.name}`);
        }

        if (obj.type === 'Text') {
            let text, style;
            obj.properties.forEach( (prop) => {
                if (prop.name === 'text') {
                    text = prop.value;
                } else if (prop.name === 'style') {
                    style = prop.value;
                }
            });
            if (text !== undefined) {
                text = text.replace(/key\{(.+?)\}/g, (_, x) => datas.settings.keys[x] || `[${x} missing]`);
            } else {
                text = 'text undefined';
            }
            if (style === undefined) {
                style = {
                    font: '16px Daydream',
                    color: '#ffffff',
                    fontStyle: 'bold'
                };
            } else {
                style = JSON.parse(style);
            }
            this.add.text(obj.x, obj.y, text, style);
        }
    });

    // Spawn point
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    const spawnPoint = spawnPointLayer.objects.find(obj => obj.name === 'spawnPoint');
    
    window.gameVars.player.x = spawnPoint.x;
    window.gameVars.player.y = spawnPoint.y;

    return { map: map, spawnPoint };
}

export function checkMap() {
    this.physics.add.overlap(window.gameVars.player, window.gameVars.utilitiesGroup, (player, obj) => {
        if (obj.name.startsWith('mapTp')) {
            if (window.gameVars.map.map) {
                window.gameVars.map.map.destroy();
            }
            window.gameVars.map = obj.name.replace('mapTp', '');
        }
    });    
}