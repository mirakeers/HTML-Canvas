//Created by Myra Keersmaekers
//Concept based on 'Salary Cat' (https://itunes.apple.com/us/app/salary-cat/id1047533696?mt=8)


window.addEventListener("load", init);

var myCanvas;
var ctx;
var width;
var height;

var gameloop;
var animating = true;
var muted = false;
var gameStarted = false;
var gamePaused = false;
var gameOver = false;

var buildinglist = [];
var enemylist = [];


var files = [];
var clouds;
var ssKitten;
var ground;
var dog;
var hedge;
var totalFilesLoaded = 0;

var cloudpos = 0;
var cloudspeed = 1.5;

var hedgepos = 0;
var hedgespeed = 3;

var groundpos = 0;
var groundspeed = 8;

var buildinggap = 150;

var enemiesPerBuilding = 2;
var enemiesAvoided = 0;

var kitten;

var ascending;

var colorsLight = ["#b5dbca", "#fbcdad", "#ccd5e8", "#f3cae1", "#e5eec9", "#fff2ae"];
var colorsDark = ["#6abfa4", "#f18b64", "#8da0cb", "#df8ab9", "#a6ca59", "#ffd92f"];





function init() {
    initFiles();
    initCanvas();
    console.log(randomInt(1, 2));
}

function initFiles() {
    //init files
    
    ssKitten = new Image();
    ssKitten.src = "img/cat.png";
    /*http://www.gameart2d.com/uploads/3/0/9/1/30917885/catndog.zip*/
    files.push(ssKitten);
    
    clouds = new Image();
    clouds.src = "img/video-game-clouds.jpg";
    /*http://archive.beefjack.com/files/2011/10/video-game-clouds.jpg*/
    files.push(clouds);
    
    ground = new Image();
    ground.src = "img/ground.png";
    /*http://www.matim-dev.com/uploads/1/5/8/0/15804842/7477761_orig.png*/
    files.push(ground);
    
    dog = new Image();
    dog.src = "img/enemy.png";
    /*http://www.gameart2d.com/uploads/3/0/9/1/30917885/catndog.zip*/
    files.push(dog);
    
    hedge = new Image();
    hedge.src = "img/hedge.png";
    /*http://www.gameart2d.com/uploads/3/0/9/1/30917885/catndog.zip*/
    files.push(hedge);
    
    music = new Audio();
    music.src = "mp3/music.mp3";
    /* Crash Team Racing - Menu Screen Music (https://www.youtube.com/watch?v=GqhxxX81dwA)*/
    //files.push(music);
    
}

function initCanvas() {
    myCanvas = document.getElementById("myCanvas");
    if(isCanvasSupported() && doesCanvasExist(myCanvas)) {
        ctx = myCanvas.getContext('2d');
        width = myCanvas.width;
        height = myCanvas.height;
        startTheApp();
    }
}

function startTheApp() {
    console.log("app started");
    for(var i = 0; i < files.length; i++) {
        files[i].onload = function() {
            if(allFilesLoaded()) {
                beginTheGame();
            }
        };
    }
}


function beginTheGame() {
    console.log("game began");
    music.loop = true;
    music.play();
    
    window.onkeypress = function(e) {
        
        if(e.charCode == 32) { //SPACE-bar
            kitten.running = false;
            kitten.counterx = 0;
            kitten.jumping = true;
        } 
        if(!gameOver && gameStarted) {
            if(e.charCode == 13) { //ENTER
                if(gamePaused) {
                    gamePaused = false;
                    animating = true;
                } else {
                    gamePaused = true;
                    drawOverlay("Press ENTER to continue");
                    animating = false;
                }                
            } 
        }

        if(e.charCode == 77 || e.charCode == 109) { //M-KEY
            muteMusic();
        }
        gameStarted = true;  
        
        if(gameOver) {
            gameOver = false;
            animating = true;
            buildinglist = [];
            enemylist = [];
            enemiesAvoided = 0;
            clearInterval(gameloop);
            initAnimation();
        }
    };
    
    initAnimation();
}

function muteMusic() {
    if(muted) {
        muted = false;
        music.play();
    } else {
        muted = true;
        music.pause();
    }
    
}
function drawOverlay(message, score) {
    //startAnimation(); //draw everything one last time
    
    ctx.save();
    
    
    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, 0, width, height); // draw overlay
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 60px 'Open Sans'"
    ctx.fillText(message, width/2, height/2); //write message
    
    if(arguments.length == 2) {
        ctx.font = "bold 120px 'Consolas'"
        ctx.fillText(score, width/2, height/4);
    }
       
    ctx.restore();
}




//Animation



function initAnimation() {
    initKitten();
    newBuilding(100);
    newBuilding(100 + buildinglist[0].width + buildinggap);
    newBuilding(100 + 2  * (buildinglist[0].width + buildinggap));
    console.log("animation initialized");
    gameloop = setInterval(startAnimation, 20);
}

function startAnimation() {
    if(animating) {
        
        ctx.clearRect(0, 0, width, height);
        updateClouds();
        updateHedge();
        updateGround();
        updateBuildings();
        updateEnemies();
        checkIfHit();
        drawInfo();
        
        updateKitten();
        if(!gameStarted) {
            drawOverlay("Press any key to start");
        }
    }
    
}

function stopAnimation() {
    animating = false;
    setTimeout(500);
    drawOverlay("Press any key to start again.", enemiesAvoided);
}


function initKitten() {
    //Create new kitten and place him in the left bottom corner
    kitten = new Kitten();
    kitten.x = 30 + kitten.width;
    kitten.y = height - ground.height;
}

function updateKitten() {
    var refreshrate = 1/5; //Slow down the spritesheet - how greater the refreshrate, how quicker the kitten runs
    
    kitten.counterx += refreshrate;

    if(kitten.running) {
        
        kitten.vely = 0;
        kitten.gravity = 0;
        
        if(kitten.counterx > 7) {
           kitten.counterx = 0;
        };
        ctx.drawImage(ssKitten, Math.floor(kitten.counterx) * 542, 0, 542, 474, kitten.x - kitten.width + 40, kitten.y - kitten.height + 5, kitten.width, kitten.height);
        
        checkIfStandingOnPlatform();
        //WHERE:
        //ssKitten --> the image
        //Math.floor(kitten.counterx) * 542 --> clip the image on xpos 0, 542, 1084,...
        //0 --> clip the image on ypos 0
        //542 --> width of the clip mask
        //474 --> height of the clip mask
        //kitten.x - kitten.width + 40 --> drawpos x: take the xpos of the kitten, substract the width of the kitten (now we draw on the right side of the xpos), add 20 to adjust (xpos = kitten's feet)
        //kitten.y - kitten.height + 5 --> drawpos y: take the ypos of the kitten, substract the height of the kitten (now we draw on top of the ypos), add 20 to adjust (ypos = kittens feet)
        //kitten.width --> width of the image;
        //kitten.height --> height of the image
    }
    if (kitten.jumping) {
        kitten.vely = 17;
        kitten.gravity += 0.8;
        if(kitten.gravity <= kitten.vely) {
            ascending = true;
        } else {
            ascending = false;
        }
        kitten.y -= kitten.vely;
        kitten.y += kitten.gravity;
        ctx.drawImage(ssKitten, Math.floor(kitten.counterx) * 542, 474, 542, 474, kitten.x - kitten.width + 40, kitten.y - kitten.height + 5, kitten.width, kitten.height);
        if(kitten.counterx > 7) {
            kitten.counterx = 2; //keep looping the sprite, but not the first 2 images
        }
        
        checkIfStandingOnPlatform();
    }
    
    if(kitten.falling) {
        kitten.vely = 5;
        kitten.gravity += 0.7;
        kitten.y += kitten.vely;
        ctx.drawImage(ssKitten, Math.floor(kitten.counterx) * 542, 474, 542, 474, kitten.x - kitten.width + 40, kitten.y - kitten.height + 5, kitten.width, kitten.height);
        if(kitten.counterx > 7) {
            kitten.counterx = 2; //keep looping the sprite, but not the first 2 images
        }
        checkIfStandingOnPlatform();
    }
    
    if (kitten.dying) {
        ctx.drawImage(ssKitten, Math.floor(kitten.counterx) * 542, 948, 542, 474, kitten.x - kitten.width + 40, kitten.y - kitten.height + 5, kitten.width, kitten.height);
        if(kitten.counterx > 9) {
            stopAnimation();
        }
    }
}

function updateClouds() {
    ctx.save();
    
    if(!kitten.dying) {
        cloudpos -= cloudspeed;
    }
    if(cloudpos < - clouds.width) {
        cloudpos = 0;
    }

    ctx.translate(cloudpos, 0);
    
    var pattern = ctx.createPattern(clouds, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(cloudpos, 0, width * 3, height);
    
    ctx.restore();
}

function updateHedge() {
    ctx.save();
    
    if(!kitten.dying) {
        hedgepos -= hedgespeed;
    }
    if(hedgepos < - hedge.width) {
        hedgepos = 0;
    }

    ctx.translate(hedgepos, height - ground.height - hedge.height);
    
    var pattern = ctx.createPattern(hedge, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(hedgepos, 0, width * 3, hedge.height);
    
    ctx.restore();
}

function updateGround() {
    ctx.save();
    
    if(!kitten.dying) {
        groundpos -= groundspeed;
    }
    if(groundpos < - ground.width) {
        groundpos = 0;
    }
    
    ctx.translate(groundpos, height - ground.height);
    var pattern = ctx.createPattern(ground, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(groundpos, 0, width * 3, ground.height);
    
    ctx.restore();
}

function updateBuildings() {
    for(var i = 0; i < buildinglist.length; i++) {
        var building = buildinglist[i];
        
        if(!kitten.dying) {
            building.x -= groundspeed;
        }
        updatePlatforms(building);
        drawBuilding(building);
    }
    
    var lastBuilding = buildinglist[buildinglist.length - 1];
    if(lastBuilding.x < width - lastBuilding.width) {
        newBuilding(width + buildinggap);
        var building = buildinglist[buildinglist.length - 1];
        if(gameStarted) {
           createNewEnemies(building);
        }
    }
    var firstBuilding = buildinglist[0]; 
    if(firstBuilding.x < 0 - firstBuilding.width) {
       buildinglist.shift();
    }
}


function updatePlatforms(building) {
    for(var i =0; i < building.platforms.length; i++) {
        building.platforms[i].x = building.x;
        building.platforms[i].y = building.y + (building.platforms[i].pos * building.height/3);
    }
}

function newBuilding(x) {
    var building = new Building();
    building.x = x;
    building.y = height - ground.height - building.height;
    updatePlatforms(building);
    buildinglist.push(building);
}

function drawBuilding(building) {
    ctx.fillStyle = colorsLight[building.color];
    ctx.fillRect(building.x, building.y, building.width, building.height);
    
    
    ctx.fillStyle = colorsDark[building.color];
    for(var i =0; i < building.platforms.length - 1; i++) {
        ctx.fillRect(building.platforms[i].x, building.platforms[i].y, building.platforms[i].width, building.platforms[i].height);
    }
}

function createNewEnemies(building) {
    var enemy1 = new Enemy();
    var enemy2 = new Enemy();
    
    var positionleft = randomInt(0, 3);
    var platformleft = building.platforms[positionleft];
    enemy1.x = platformleft.x + 30;
    enemy1.y = platformleft.y/* - enemy1.height*/;
    
    var positionright = randomInt(0, 3);
    if (positionright == positionleft) {
        if(positionright == 3) {
            positionright = 0;
        } else {
            positionright += 1;
        }
    }
    var platformright = building.platforms[positionright];
    enemy2.x = platformright.x + building.width - 30 - enemy2.width;
    enemy2.y = platformright.y;
    
    enemylist.push(enemy1);
    enemylist.push(enemy2);
}

function updateEnemies() {
    for(var i = 0; i < enemylist.length; i++) {
        var enemy = enemylist[i];
        if(!kitten.dying) {
            enemy.x -= groundspeed;
        }
        ctx.fillStyle= "#FF0000";
        //ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.drawImage(dog, enemy.x, enemy.y - enemy.height, enemy.width, enemy.height);
        
        if(enemy.x < -width/2) {
            enemylist.splice(i, 1);
        }
    }
    
}


function checkIfStandingOnPlatform() {
    for(var j = 0; j < buildinglist.length; j++) {
        var building = buildinglist[j];
        
        if(kitten.running &&
           between(kitten.x, x + building.width, x + building.width + buildinggap) &&
          kitten.y != height - ground.height) {
            //If the kitten had fallen off a platform, but not the bottom platform (= the floor)
            console.log("this is true");
            kitten.running = false;
            kitten.jumping = false;
            kitten.counterx = 2
            kitten.falling = true;
        }
        
        
        for(var i =0; i < building.platforms.length; i++) {
            var y = building.platforms[i].y;
            var x = building.platforms[i].x;
            
            if (between(kitten.y, y - 10, y + 10) &&
               between(kitten.x, x, x + building.width) &&
               !ascending) {
                kitten.y = y;
                kitten.jumping = false;
                kitten.falling = false;
                kitten.running = true;
            }            
        }
    }
    if(kitten.y > height - ground.height) {
        kitten.y = height - ground.height;
        kitten.jumping = false;
        kitten.running = true;
    }
    
}

function checkIfHit() {
    for(var i = 0; i < enemylist.length; i++) {
        var enemy = enemylist[i];
        /*console.log(enemy.y);
        console.log(kitten.y)*/
        if(between(kitten.x, enemy.x, enemy.x + enemy.width)
          && kitten.y == enemy.y
          && !kitten.dying) {
            console.log("HIT");
            gameOver = true;
            kitten.counterx = 0;
            kitten.running = false;
            kitten.falling = false;
            kitten.jumping = false;
            kitten.dying = true;
        }
    }
}


function drawInfo() {
    ctx.save();
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFF";
    ctx.lineWidth = 5;
    ctx.font = "bold 40px 'Consolas'"
    ctx.strokeText(updateScore(), 20, 40);
    ctx.fillText(updateScore(), 20, 40);
    
    var str;
    
    if(gamePaused) {
        str = "l";
    } else {
        str = "a";
    }
    ctx.font = "40px 'icons'"
    ctx.textAlign = "right";
    ctx.strokeText(str, width - 20, 40);
    ctx.fillText(str, width - 20, 40);
    
    if(muted) {
        str = "m";
    } else {
        str = "u";
    }
    ctx.strokeText(str, width - 60, 40);
    ctx.fillText(str, width - 60, 40);
    
    ctx.restore();
}

function updateScore() {
    for(var i = 0; i < enemylist.length; i++) {
        if(!enemylist[i].avoided) {
            if(kitten.x > enemylist[i].x + 20) {
                enemylist[i].avoided = true;
                enemiesAvoided += 1;
            }
        }
        
    }
    return enemiesAvoided;
}






//Objects

function Kitten() {
    this.counterx = 0;
    this.x = 0;
    this.y = 0;
    this.width = 108.4;
    this.height = 94.8;
    this.vely = 0;
    this.gravity = 0;
    this.running = true;
    this.jumping = false;
    this.falling = false;
    this.dying = false;
}


var colorcounter = randomInt(0, colorsLight.length);

function Building() {
    colorcounter ++;
    if(colorcounter >= colorsLight.length) {
        colorcounter = 0;
    }
    
    this.x = 0;
    this.y = 0;
    this.height = 350;
    this.width = 300;
    this.color = colorcounter;
    this.platforms = [
        new Platform(0, this.height, this.width),
        new Platform(1, this.height, this.width),
        new Platform(2, this.height, this.width),
        new Platform(3, this.height, this.width)
    ];
}

function Platform(pos, buildingheight, buildingwidth) {
    this.pos = pos;
    this.x = 0;
    this.y = this.pos * buildingheight/3;
    this.width = buildingwidth;
    this.height = 20;
}

function Enemy() {
    this.x;
    this.y;
    this.width = 57;
    this.height = this.width * (dog.height/dog.width);
    this.avoided = false;
}

//Other functions

function circle(mx, my, radius) {
    ctx.beginPath();
    ctx.arc(mx, my, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function randomInt(a, b) {
    return Math.round(a + (Math.random() * (b - a)));
}

function deg(deg) {
    return deg/360.0 * 2*Math.PI;
}

function between(x, a, b) {
        return x >= a && x <= b;
}

function allFilesLoaded() {
    totalFilesLoaded +=1;
    if(totalFilesLoaded == files.length) {
        return true;
    }
}


function isCanvasSupported(){
    var check = document.createElement("canvas");
    return !!(check.getContext && check.getContext('2d'));
}

function doesCanvasExist(canvas){
    return !!(canvas);
}