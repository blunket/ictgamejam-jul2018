var suntheme = document.getElementById("suntheme");
suntheme.volume = 0.4;
var moontheme = document.getElementById("moontheme");
moontheme.volume = 0.5;
var gametheme = document.getElementById("gametheme");
gametheme.volume = 0.3;

var starFireSound = new Audio('../music/star.mp3');
starFireSound.volume = 0.2;

var fireballSound = new Audio('../music/fireball.mp3');
fireballSound.volume = 0.2;

var laserSound = new Audio('../music/laser.mp3');
laserSound.volume = 0.2;

var anvilSound = new Audio('../music/anvil.mp3');
anvilSound.volume = 0.75;

var hitSound = new Audio('../music/punch.mp3');
hitSound.volume = 0.75;

var $player = $("#player");
var playerXVel = 0;
var playerYVel = 0;

var stars = [];
var lasers = [];
var $window = $(window);
var isEarthEmergency = false;
var lastEmergency = 0;
var earthEmergencyX = 0;
var earthEmergencyY = 0;
var lastHitter = 'sun'; // affects the game over animation

var gameIsOver = false;

var lvl = 0;

$(function() {

    function sunsTurn() {
        $("#story").removeClass("moon earth").addClass("sun");
    }

    function moonsTurn() {
        $("#story").removeClass("sun earth").addClass("moon");
    }

    function earthsTurn() {
        $("#story").removeClass("sun moon").addClass("earth");
    }

    $sun = $("#sun");
    $moon = $("#moon");
    $earth = $("#earth");
    $sunimg = $("#sun img");
    $moonimg = $("#moon img");
    $earthimg = $("#earth img");

    function shakeMoon(dir, times) {
        $moonimg.shake({direction: dir, times: times})
    }

    function shakeEarth(dir, times) {
        $earthimg.shake({direction: dir, times: times})
    }

    $("#overlayprotector").show();

    moontheme.pause();
    suntheme.play();
    sunsTurn();

    var t = new Typed('#typedjs', {
        strings: [
            'It\'s a beautiful day out here in outer space.',
            'Truly, ^600I am the light of this world.',
            'I am shining bright.^500 I am stellar.^500<br>^100I am ^100.^100.^100. absolutely,^100 blindingly,^100 stunningly,^100 unfathomably,^100 stunningly radiant.',
            'Bask in my magnificence and glory.',
            'WELL, WELL, WELL',
            'IF IT ISN\'T THE SUN', // 5
            'Waxing Gibbous!!^500 What in space are you doing here???',
            'THAT\'S RIGHT PUNK',
            'IT\'S ME, THE WAXING GIBBOUS',
            'What do you want???',
            'I\'VE LIVED IN YOUR SHADOW FAR TOO LONG',
            'I WILL HAVE IT NO LONGER',
            'What are you talking about,^200 Gibbous???^100 I don\'t even cast a shadow!',
            'DON\'T PLAY DUMB WITH ME, SUNNY',
            'EVERYONE ALWAYS COMPARES ME TO YOU',
            'EVERYONE HAS ALWAYS CALLED YOU THE BRIGHTER ONE',
            'EVERYONE HAS LEFT ME IN THE DARK',
            'DO YOU KNOW WHAT IT\'S LIKE ONLY COMING OUT AT NIGHT',
            'guys^200 please',
            'let\'s all calm down',
            'STAY OUT OF THIS, EARTH',
            'I\'M ABOUT TO PUT THIS NERD IN HIS PLACE',
            'oh god help us'
        ],
        smartBackspace: false,
        backDelay: 2000,
        onComplete: (typed) => {
            setTimeout(() => {
                showControls(typed)
            }, 5000)
        },
        preStringTyped: (pos, typed) => {
            if (pos == 3) {
                $sunimg.attr('src', '../assets/sun-haughty.svg');
                $sun.css("opacity", 1);
                $("#particle").css("opacity", 1);
            } else if (pos == 4) {
                moonsTurn();
                $moon.css("opacity", 1);
                $sun.css("opacity", 0);
                suntheme.pause();
                moontheme.play();
            } else if (pos == 6) {
                $sunimg.attr('src', '../assets/sun.svg');
                sunsTurn();
                $moon.css("opacity", 0);
                $sun.css("opacity", 1);
            } else if (pos == 7) {
                moonsTurn();
                $sun.css("left", "calc(50% - 400px)")
                $moon.css({"opacity": 1, "left": "calc(50% + 100px)"});
            } else if (pos == 9) {
                sunsTurn();
            } else if (pos == 10) {
                $moonimg.attr('src', '../assets/moon-miffed.svg');
                moonsTurn();
                shakeMoon('up', 5);
            } else if (pos == 12) {
                sunsTurn();
            } else if (pos == 13) {
                moonsTurn();
                shakeMoon('up', 5);
            } else if (pos == 14) {
                $moonimg.attr('src', '../assets/moon-butthurt.svg');
            } else if (pos == 16) {
                shakeMoon('up', 5);
            } else if (pos == 18) {
                $moonimg.attr('src', '../assets/moon-miffed.svg');
                $earth.css("opacity", 1);
                earthsTurn();
            } else if (pos == 20) {
                moonsTurn();
                $moonimg.attr('src', '../assets/moon.svg');
                shakeMoon('up', 3);
            } else if (pos == 22) {
                earthsTurn();
                shakeEarth('right', 4);
            }
        }
    })

    document.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            showControls(t)
        }
    })
})

function showControls(typed) {
    $("#story").fadeOut(() => {
        $("#particle").css("opacity", 1);
        moontheme.pause()
        suntheme.pause()
        suntheme.currentTime = 0
        suntheme.play()
        $("#story").remove()
        typed.destroy()
        $("#controls").fadeIn()
        $(window).one('click, keypress', startGame)
    })
}

var keysDown = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'arrowup': false,
    'arrowleft': false,
    'arrowdown': false,
    'arrowright': false,
};
document.onkeydown = document.onkeyup = e => {
    e = e || event;
    keysDown[e.key.toLowerCase()] = e.type == 'keydown';
}

function startGame() {
    $("#controls").fadeOut(() => {
        moontheme.pause()
        suntheme.pause()
        gametheme.currentTime = 0
        gametheme.play()

        $("#player").show().css({
            left: ($(window).width() / 2) - 30,
            top: ($(window).height() / 2) - 30
        })
        $("#moon-character").show().css({
            right: 30,
            top: ($(window).height() / 2) - 75
        })
        $("#sun-character").show().css({
            left: 30,
            top: ($(window).height() / 2) - 75
        })

        $("#game").fadeIn()
        $("#healthbar").fadeIn()
        $("#healthbar-green").fadeIn()
        gameLoop()
        slowLevelUp()
        randomSunActionLoop()
        randomMoonActionLoop()
        randomMoonMovementLoop()
        randomSunMovementLoop()

        $(window).on('click, keydown', e => {
            if (e.type == 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
                return;
            }
            if (gameIsOver) {
                return;
            }
            if (Date.now() - lastEmergency > 10000) {
                earthEmergency();
            } else {
                anvilSound.pause();
                anvilSound.currentTime = 0;
                anvilSound.play();
                $("#player img").shake({ direction: 'left', distance: 10, times: 2 })
            }
        })
    })
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

var $gamediv = $("#game-div");
class FireBallParticle {
    constructor(x, y, xVel, yVel) {
        let imgsrc = getRandomItem(['fireball-1.svg', 'fireball-2.svg', 'fireball-3.svg']);
        this.img = new Image()
        this.img.src = '../assets/' + imgsrc;
        this.xVel = xVel ? xVel : 10;
        this.yVel = yVel ? yVel : 0;
        let $img = $(this.img)
        $img.addClass('fireball').css({
            'left': x,
            'top': y,
        })
        $gamediv.append($img)
    }
    step() {
        let $img = $(this.img)
        $img.css({
            'left': $img.position().left + this.xVel,
            'top': $img.position().top - this.yVel
        })
    }
}

class StarParticle {
    constructor(x, y, xVel, yVel) {
        let imgsrc = getRandomItem(['stars-1.svg', 'stars-2.svg', 'stars-3.svg']);
        this.img = new Image()
        this.img.src = '../assets/' + imgsrc;
        this.xVel = xVel ? xVel : 10;
        this.yVel = yVel ? yVel : 0;
        let $img = $(this.img)
        $img.addClass('star').css({
            'left': x,
            'top': y,
        })
        $gamediv.append($img)
    }
    step() {
        let $img = $(this.img)
        $img.css({
            'left': $img.position().left - this.xVel,
            'top': $img.position().top - this.yVel
        })
    }
}

class LaserParticle {
    constructor(x, y, xVel, yVel, length) {
        let imgsrc = getRandomItem(['stars-1.svg', 'stars-2.svg', 'stars-3.svg']);
        this.xVel = xVel ? xVel : 10;
        this.yVel = yVel ? yVel : 0;
        let $laserdiv = $('<div class="laser"></div>')
        this.laserdiv = $laserdiv[0];
        $laserdiv.css('width', length).css({
            'left': x,
            'top': y,
        })
        $gamediv.append($laserdiv)
    }
    step() {
        let $laserdiv = $(this.laserdiv)
        let laserPos = $laserdiv.position();
        if (laserPos.top < 0) {
            $laserdiv.css('top', $window.height() - 5)
        } else if (laserPos.top > $window.height()) {
            $laserdiv.css('top', 5)
        }
        laserPos = $laserdiv.position();
        $laserdiv.css({
            'left': laserPos.left + this.xVel,
            'top': laserPos.top + this.yVel
        })
    }
}

function starGrenade() {
    let $moon = $("#moon-character")
    starFireSound.currentTime = 0
    starFireSound.volume = 0.75
    starFireSound.play()
    let x = $moon.position().left - 5;
    let y = $moon.position().top + 75;
    let particle = new StarParticle(x, y, 5 + lvl, 0)
    let face = getRandomItem(['stars-face-1.svg', 'stars-face-2.svg', 'stars-face-3.svg']);
    particle.img.src = '../assets/' + face;
    particle.img.classList.add('grenade')
    stars.push(particle)
}

var radiansArrayCache = {}

// returns an array of evenly-spaced angles (in radians) for any number of bullets
function getRadiansArray(bullets) {
    if (radiansArrayCache.hasOwnProperty(bullets)) {
        return radiansArrayCache[bullets]
    }
    let nums = [];
    for (i = 0; i < bullets; i++) {
        let degs = i * (360 / bullets);
        nums.push((degs * Math.PI) / 180);
    }
    radiansArrayCache[bullets] = nums;
    return nums;
}

function starExplosion(x, y) {
    let explosions = randInt(1, 3 + lvl);
    let speed = 15 + lvl;
    for (let a = 0; a < explosions; a++) {
        setTimeout(() => {
            let numstars = randInt(3, 10 + lvl);
            let angles = getRadiansArray(numstars);
            starFireSound.currentTime = 0;
            starFireSound.volume = 0.6;
            starFireSound.play();
            for (let i = 0; i < numstars; i++) {
                let xVel = speed * Math.cos(angles[i]);
                let yVel = speed * Math.sin(angles[i]);
                let prt = new StarParticle(x, y, xVel, yVel);
                stars.push(prt)
            }
        }, 500 * a)
    }
}

function starConeSpray() {
    let amount = randInt(10 + lvl, 25 + lvl)
    let $moon = $("#moon-character")
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            starFireSound.currentTime = 0
            starFireSound.volume = 0.2
            starFireSound.play()
            let l = $moon.position().left - 5;
            let h = $moon.position().top + 75;
            let yVel = randInt(-10, 10)
            let prt = new StarParticle(l, h, 15, yVel);
            if (Math.random() < .3) {
                prt.img.classList.add('big');
            }
            stars.push(prt)
        }, 200 * i)
    }
}

function fireballSpray() {
    let amount = randInt(10 + lvl, 25 + lvl)
    let $sun = $("#sun-character")
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            fireballSound.currentTime = 0
            fireballSound.volume = 0.8
            fireballSound.play()
            let l = $sun.position().left - 5;
            let h = randInt(50, $window.height() - 50);
            let yVel = randInt(-10, 10)
            let prt = new FireBallParticle(l, h, 10, yVel);
            stars.push(prt)
        }, 200 * i)
    }
}

function bigFireballSpray() {
    let amount = randInt(lvl, 10 + lvl)
    let $sun = $("#sun-character")
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            fireballSound.currentTime = 0
            fireballSound.volume = 1
            fireballSound.play()
            let l = $sun.position().left - 5;
            let h = randInt(50, $window.height() - 50);
            let yVel = randInt(-10, 10)
            let prt = new FireBallParticle(l, h, 6, yVel);
            prt.img.classList.add('big');
            stars.push(prt)
        }, 600 * i)
    }
}

function starLineSpray() {
    let lines = randInt(4, 4 + lvl)
    let $moon = $("#moon-character")
    for (let l = 0; l < lines; l++) {
        let lineAmt = randInt(3, 3 + lvl)
        setTimeout(() => {
            starFireSound.currentTime = 0
            starFireSound.volume = 0.35
            starFireSound.play()
            for (let i = 0; i < lineAmt; i++) {
                let l = $moon.position().left;
                let h = Math.floor(Math.random() * $window.height())
                let yVel = randInt(-10, 10)
                stars.push(new StarParticle(l, h, 15, 0))
            }
        }, 1000 * l)
    }
}

function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

function gameLoop() {
    let sunPos = $("#sun-character").position()
    let moonPos = $("#moon-character").position()
    if (!gameIsOver) {
        let playerPos = $player.position()
        if (playerPos.left < 5) {
            $player.css('left', $window.width() - 10)
        } else if (playerPos.left > $window.width() - 5) {
            $player.css('left', 10)
        }
        if (playerPos.top < 5) {
            $player.css('top', $window.height() - 10)
        } else if (playerPos.top > $window.height() - 5) {
            $player.css('top', 10)
        }
    }
    playerPos = $player.position()

    for (let i = 0; i < lasers.length; i++) {
        let laser = lasers[i];
        laser.step();
        let $laserdiv = $(laser.laserdiv);
        let laserPos = $laserdiv.position();
        if (isEarthEmergency) {
            let laserX = laserPos.left + $laserdiv.width() / 2;
            if (dist(laserX, laserPos.top, earthEmergencyX, earthEmergencyY) < 300) {
                // 300 comes from 30 * 10 (30 = emergency's initial radius, *10 because it's scaled)
                $laserdiv.remove()
                lasers.splice(i, 1)
                continue;
            }
        }
        if (playerPos.top + 30 > (laserPos.top - 30) && playerPos.top + 30 < (laserPos.top + 30) && playerPos.left + 30 > (laserPos.left - 30) && playerPos.left + 30 < laserPos.left + $laserdiv.width()) {
            lastHitter = 'sun';
            playerHit()
            $laserdiv.remove()
            lasers.splice(i, 1)
            continue;
        }
        if (laserPos.left < 0 - $laserdiv.width() || laserPos.left > $window.width()) {
            $laserdiv.remove()
            lasers.splice(i, 1)
        }
    }
    for (let i = 0; i < stars.length; i++) {
        stars[i].step()
        let $img = $(stars[i].img)
        let starPos = $img.position()
        if (starPos.left < -25 || starPos.left > $window.width() || starPos.top < 5 || starPos.top > $window.height() - 5) {
            $img.remove()
            stars.splice(i, 1)
            continue;
        }
        let starHitBoxOffset = 0;
        if ($img.hasClass('big')) {
            starHitBoxOffset = 25
        } else if ($img.hasClass('grenade')) {
            starHitBoxOffset = 60
        }

        if (isEarthEmergency) {
            if (dist(starPos.left + 10 + starHitBoxOffset, starPos.top + 10 + starHitBoxOffset, earthEmergencyX, earthEmergencyY) < 300) {
                // 300 comes from 30 * 10 (30 = emergency's initial radius, *10 because it's scaled)
                $img.remove()
                stars.splice(i, 1)
                continue;
            }
        }

        if (stars[i] instanceof StarParticle) { // sun shouldn't get hit by his own particles
            if (dist(sunPos.left + 75, sunPos.top + 75, starPos.left + 10, starPos.top + 10) < 75 + starHitBoxOffset) {
                sunHit();
            }
        }
        if (dist(playerPos.left + 30, playerPos.top + 30, starPos.left + 10, starPos.top + 10) < 25 + starHitBoxOffset) {
            lastHitter = 'moon';
            playerHit();
        }

        if (starPos.left < $window.width() / 2 && Math.random() < 0.3 && $img.hasClass('grenade')) {
            starExplosion(starPos.left, starPos.top)
            $img.remove()
            stars.splice(i, 1)
        }
    }
    if (!gameIsOver) {
        if (keysDown.w || keysDown.arrowup) { playerYVel -= 2 }
        if (keysDown.a || keysDown.arrowleft) { playerXVel -= 2 }
        if (keysDown.s || keysDown.arrowdown) { playerYVel += 2 }
        if (keysDown.d || keysDown.arrowright) { playerXVel += 2 }

        if (playerXVel < -20) {
            playerXVel = -20;
        } else if (playerXVel > 20) {
            playerXVel = 20;
        }

        if (playerYVel < -20) {
            playerYVel = -20;
        } else if (playerYVel > 20) {
            playerYVel = 20;
        }

        if (dist(sunPos.left + 75, sunPos.top + 75, playerPos.left + 30, playerPos.top + 30) < 100) {
            lastHitter = 'sun';
            playerHit()
        } else if (dist(moonPos.left + 75, moonPos.top + 75, playerPos.left + 30, playerPos.top + 30) < 100) {
            lastHitter = 'moon';
            playerHit()
        }

        $player.css({
            left: playerPos.left + playerXVel,
            top: playerPos.top + playerYVel,
        })
    }
    setTimeout(gameLoop, 40);
}


function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomMoonMovementLoop() {
    setTimeout(() => {
        if (Math.random() < 0.75) {
            let topPos = randInt(100, $window.height() - 100);
            $("#moon-character").animate({
                'top': topPos
            }, randInt(1500, 2500))
        }
        randomMoonMovementLoop()
    }, randInt(2500, 4000))
}

function randomSunMovementLoop() {
    setTimeout(() => {
        if (Math.random() < 0.5) {
            let topPos = randInt(100, $window.height() - 100);
            $("#sun-character").animate({
                'top': topPos
            }, randInt(1500, 2500))
        }
        randomSunMovementLoop()
    }, randInt(2500, 4000))
}

function randomMoonActionLoop() {
    let lvlOffset = 200 * lvl;
    if (lvlOffset > 3500) {
        lvlOffset = 3500;
    }
    setTimeout(() => {
        let whichAction = Math.random();
        if (lvl < 2) {
            starConeSpray()
        } else if (lvl < 4) {
            if (whichAction < 0.4) {
                starConeSpray()
            } else {
                starLineSpray()
            }
        } else {
            if (whichAction < 0.25) {
                starConeSpray()
            } else if (whichAction < 0.5) {
                starLineSpray()
            } else {
                starGrenade()
            }
        }
        randomMoonActionLoop()
    }, randInt(5400 - lvlOffset, 9000 - lvlOffset))
}

function singleLaser() {
    let $sun = $("#sun-character")
    let sunPos = $sun.position();
    laserSound.currentTime = 0
    laserSound.volume = 0.75
    laserSound.play()
    let laserLen = randInt(150 + (lvl * 10), 300 + (lvl * 20));
    let x = sunPos.left - laserLen;
    let y = sunPos.top + 75;
    let yVel = 0;
    if (lvl > 3 && Math.random() < 0.4) {
        yVel = randInt(-10, 10)
    }
    let particle = new LaserParticle(x, y, 6 + lvl, yVel, laserLen)
    lasers.push(particle)
}

function randomSunActionLoop() {
    let lvlOffset = 200 * lvl;
    if (lvlOffset > 3500) {
        lvlOffset = 3500;
    }
    setTimeout(() => {
        let whichAction = Math.random();
        if (lvl < 2) {
            singleLaser()
        } else if (lvl < 4) {
            if (whichAction < 0.4) {
                singleLaser()
            } else {
                fireballSpray()
            }
        } else {
            if (whichAction < 0.3) {
                singleLaser()
            } else if (whichAction < 0.6) {
                fireballSpray()
            } else {
                bigFireballSpray()
            }
        }
        randomSunActionLoop();
    }, randInt(4400 - lvlOffset, 9000 - lvlOffset))
}

var sunHits = 0;

function sunHit() {
    if ($('.hit, .laughing').length > 0) {
        return;
    }
    sunHits++;
    let $sun = $("#sun-character img")
    let $moon = $("#moon-character img")

    $sun.addClass('hit')
    if (sunHits % 5 == 0) {
        $sun.addClass('hit')
        $moon.attr('src', '../assets/moon.svg').addClass('laughing')
    }
    setTimeout(() => {
        $sun.removeClass('hit laughing')
        $moon.removeClass('hit laughing').attr('src', '../assets/moon-miffed.svg')
    }, 1500)
}

var playerHits = 0;

function playerHit() {
    if ($('.playerhit').length > 0) {
        return;
    }
    if (gameIsOver) {
        return;
    }
    hitSound.pause();
    hitSound.currentTime = 0;
    hitSound.play();
    playerHits++;

    $player.addClass('playerhit')
    $("#healthbar-green").css('width', 100 - ((playerHits / 10) * 100) + "%")

    if (playerHits >= 10) {
        triggerGameOver()
    }

    setTimeout(() => {
        $player.removeClass('playerhit')
    }, 3000)
}

function triggerGameOver() {
    $player.animate({
        left: $window.width() / 2,
        top: $window.height() / 2,
    })

    if (lastHitter == 'sun') {
        damnToHell()
    } else {
        sendToTheMoon()
    }

    gameIsOver = true;
}

function damnToHell() {
    let amount = randInt(200, 300)
    let $sun = $("#sun-character")
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            fireballSound.currentTime = 0
            fireballSound.volume = 0.8
            fireballSound.play()
            let l = $sun.position().left - 5;
            let h = randInt(50, $window.height() - 50);
            let yVel = randInt(-10, 10)
            let prt = new FireBallParticle(l, h, 10, yVel);
            prt.img.classList.add('massive');
            stars.push(prt)
        }, 100 * i)
    }
}

function sendToTheMoon() {
    let amount = randInt(200, 300)
    let $moon = $("#moon-character")
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            starFireSound.currentTime = 0
            starFireSound.volume = 0.8
            starFireSound.play()
            let l = $moon.position().left - 5;
            let h = $moon.position().top + 75;
            let yVel = randInt(-10, 10)
            let prt = new StarParticle(l, h, 10, yVel);
            prt.img.classList.add('massive');
            stars.push(prt)
        }, 100 * i)
    }
}

function slowLevelUp() {
    setTimeout(() => {
        if (!gameIsOver) {
            lvl++;
            let $levelUpText = $("#levelUpText")
            $levelUpText.fadeIn(300);
            $levelUpText.css('transform', 'scale(1.3)');
            setTimeout(() => {
                $levelUpText.fadeOut(() => {
                    $levelUpText.css('transform', 'scale(1.0)')
                });
            }, 800)
            slowLevelUp()
        }
    }, 10000)
}

function earthEmergency() {
    $ee = $("#earthEmergency");
    let playerPos = $player.position()
    earthEmergencyX = playerPos.left + 30;
    earthEmergencyY = playerPos.top + 30;
    $ee.css({
        'transform': 'scale(1.0)',
        'width': '60px',
        'height': '60px',
        'left': earthEmergencyX,
        'top': earthEmergencyY,
    });
    $ee.fadeIn(300);
    $ee.css('transform', 'scale(10)');
    isEarthEmergency = true;
    lastEmergency = Date.now();
    setTimeout(() => {
        $ee.fadeOut(500, () => {
            isEarthEmergency = false;
        })
    }, 1000)
}
