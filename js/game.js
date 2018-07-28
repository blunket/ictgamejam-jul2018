var suntheme = document.getElementById("suntheme");
suntheme.volume = 0.4;
var moontheme = document.getElementById("moontheme");
moontheme.volume = 0.5;
var gametheme = document.getElementById("gametheme");
gametheme.volume = 0.5;

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
            'IT\'S ME', // 10
            'What do you want???',
            'I\'VE LIVED IN YOUR SHADOW FAR TOO LONG',
            'BUT I WILL TOLERATE IT NO LONGER',
            'What are you talking about,^200 Gibbous???^100 I don\'t even cast a shadow!',
            'DON\'T PLAY DUMB WITH ME, SUNNY',  // 15
            'EVERYONE HAS ALWAYS COMPARED US',
            'EVERYONE HAS ALWAYS CALLED YOU THE BRIGHT ONE',
            'EVERYONE HAS LEFT ME IN THE DARK',
            'DO YOU KNOW WHAT IT\'S LIKE, ONLY COMING OUT AT NIGHT',
            'DO YOU KNOW WHAT IT\'S LIKE TO BE FORGOTTEN', // 20
            'guys^200 please', // 21
            'let\'s all calm down', // 22
            'STAY OUT OF THIS, EARTH',
            'I\'M ABOUT TO PUT THIS NERD IN HIS PLACE',
            'oh god help us'
        ],
        smartBackspace: false,
        backDelay: 3000,
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
            } else if (pos == 21) {
                $moonimg.attr('src', '../assets/moon-miffed.svg');
                $earth.css("opacity", 1);
                earthsTurn();
            } else if (pos == 23) {
                moonsTurn();
                $moonimg.attr('src', '../assets/moon.svg');
                shakeMoon('up', 3);
            } else if (pos == 25) {
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

function startGame() {
    $("#controls").fadeOut(() => {
        moontheme.pause()
        suntheme.pause()
        gametheme.currentTime = 0
        gametheme.play()
    })
}
