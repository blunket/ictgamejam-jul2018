var suntheme = document.getElementById("suntheme");
suntheme.volume = 0.4;
var moontheme = document.getElementById("moontheme");
moontheme.volume = 0.5;
var gametheme = document.getElementById("gametheme");
gametheme.volume = 0.3;

var starFireSound = new Audio('../music/laser.mp3');
starFireSound.volume = 0.2;

var $player = $("#player");
var playerXVel = 0;
var playerYVel = 0;

var stars = [];
var $document = $(document);

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
            'LOOK WHO IT IS', // 5
            'IF IT ISN\'T THE SUN',
            'Waxing Gibbous!!',
            'What in space are you doing here???',
            'THAT\'S RIGHT PUNK',
            'IT\'S ME, THE WAXING GIBBOUS', // 10
            'What do you want???',
            'I\'VE LIVED IN YOUR SHADOW FAR TOO LONG',
            'BUT I WILL TOLERATE IT NO LONGER',
            'What are you talking about,^200 Gibbous???^100 I don\'t even cast a shadow!',
            'DON\'T PLAY DUMB WITH ME, SUNNY',  // 15
            'EVERYONE HAS ALWAYS COMPARED US',
            'EVERYONE HAS ALWAYS CALLED YOU THE BRIGHT ONE',
            'EVERYONE HAS LEFT ME IN THE DARK',
            'DO YOU KNOW WHAT IT\'S LIKE, ONLY COMING OUT AT NIGHT',
            'guys^200 please', // 20
            'let\'s all calm down', // 21
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
            } else if (pos == 7) {
                $sunimg.attr('src', '../assets/sun.svg');
                sunsTurn();
                $moon.css("opacity", 0);
                $sun.css("opacity", 1);
            } else if (pos == 9) {
                moonsTurn();
                $sun.css("left", "calc(50% - 400px)")
                $moon.css({"opacity": 1, "left": "calc(50% + 100px)"});
            } else if (pos == 11) {
                sunsTurn();
            } else if (pos == 12) {
                $moonimg.attr('src', '../assets/moon-miffed.svg');
                moonsTurn();
                shakeMoon('up', 5);
            } else if (pos == 14) {
                sunsTurn();
            } else if (pos == 15) {
                moonsTurn();
                shakeMoon('up', 5);
            } else if (pos == 16) {
                $moonimg.attr('src', '../assets/moon-butthurt.svg');
            } else if (pos == 18) {
                shakeMoon('up', 5);
            } else if (pos == 20) {
                $moonimg.attr('src', '../assets/moon-miffed.svg');
                $earth.css("opacity", 1);
                earthsTurn();
            } else if (pos == 22) {
                moonsTurn();
                $moonimg.attr('src', '../assets/moon.svg');
                shakeMoon('up', 3);
            } else if (pos == 24) {
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
        $(window).one('click', startGame)
    })
}

var keysDown = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
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
        gameLoop()
        randomMoonActionLoop()
        randomMoonMovementLoop()
        randomSunMovementLoop()
    })
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

var $gamediv = $("#game-div");
class StarParticle {
    constructor(x, y, xVel, yVel) {
        let imgsrc = getRandomItem(['stars-1.svg', 'stars-2.svg', 'stars-3.svg'])
        this.img = new Image()
        this.img.src = '../assets/' + imgsrc;
        this.xVel = xVel ? xVel : 10;
        this.yVel = yVel ? yVel : 0;
        let $img = $(this.img)
        let $moon = $("#moon-character")
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

function starConeSpray() {
    let amount = randInt(15, 30)
    let $moon = $("#moon-character")
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            starFireSound.currentTime = 0
            starFireSound.volume = 0.2
            starFireSound.play()
            let l = $moon.position().left;
            let h = $moon.position().top;
            let yVel = randInt(-10, 10)
            stars.push(new StarParticle(l, h, 15, yVel))
        }, 200 * i)
    }
}

function starLineSpray() {
    let lines = randInt(4, 8)
    let $moon = $("#moon-character")
    for (let l = 0; l < lines; l++) {
        let lineAmt = randInt(3, 8)
        setTimeout(() => {
            starFireSound.currentTime = 0
            starFireSound.volume = 0.35
            starFireSound.play()
            for (let i = 0; i < lineAmt; i++) {
                let l = $moon.position().left;
                let h = Math.floor(Math.random() * $document.height())
                let yVel = randInt(-10, 10)
                stars.push(new StarParticle(l, h, 15, 0))
            }
        }, 800 * l)
    }
}

function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

function gameLoop() {
    let sunPos = $("#sun-character").position()
    let playerPos = $player.position()
    for (let i = 0; i < stars.length; i++) {
        stars[i].step()
        let $img = $(stars[i].img)
        let starPos = $img.position()
        if (starPos.left < -25) {
            $img.remove()
            stars.splice(i, 1)
        }
        if (dist(sunPos.left + 75, sunPos.top + 75, starPos.left + 10, starPos.top + 10) < 75) {
            sunHit();
        }
        if (dist(playerPos.left + 30, playerPos.top + 30, starPos.left + 10, starPos.top + 10) < 25) {
            playerHit();
        }
    }

    if (keysDown.a) { playerXVel -= 2 }
    if (keysDown.d) { playerXVel += 2 }
    if (keysDown.w) { playerYVel -= 2 }
    if (keysDown.s) { playerYVel += 2 }

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

    $player.css({
        left: playerPos.left + playerXVel,
        top: playerPos.top + playerYVel,
    })
    setTimeout(gameLoop, 50);
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomMoonMovementLoop() {
    setTimeout(() => {
        if (Math.random() < 0.75) {
            $("#moon-character").animate({
                'top': randInt(100, $document.height() - 300)
            }, randInt(1500, 2500))
        }
        randomMoonMovementLoop()
    }, randInt(2500, 4000))
}
function randomSunMovementLoop() {
    setTimeout(() => {
        if (Math.random() < 0.5) {
            $("#sun-character").animate({
                'top': randInt(100, $document.height() - 300)
            }, randInt(1500, 2500))
        }
        randomSunMovementLoop()
    }, randInt(2500, 4000))
}

function randomMoonActionLoop() {
    if (Math.random() < 0.5) {
        starConeSpray()
    } else {
        starLineSpray()
    }
    setTimeout(randomMoonActionLoop, randInt(5000, 10000))
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
    playerHits++;

    $player.addClass('playerhit')
    /*
    if (playerHits % 5 == 0) {
        $sun.addClass('hit')
        $moon.attr('src', '../assets/moon.svg').addClass('laughing')
    }
    */
    setTimeout(() => {
        $player.removeClass('playerhit')
    }, 3000)
}
