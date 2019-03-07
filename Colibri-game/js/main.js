$(document).ready(function(){
    setSizes();
    $(window).on('resize', setSizes);
    $(window).on('keydown', function(ev){
        (ev.which === 123 || (ev.ctrlKey && (ev.which === 85 || ev.which === 83 || ev.which === 73 && ev.shiftKey))) && ev.preventDefault();
    });
    $(window).on('contextmenu', function(ev){
        ev.preventDefault();
    });

    window.stages = $('.stages img');
    var gamesArray = ['puzzle', 'numberGame', 'ballons', 'sudoku'];
    $.ajax({
        url: '../getUserInfo.php',
        method: 'post',
        data:{
            first: 'Hi!',
        },
    })
        .done(function(req){
            var req = JSON.parse(req);
            var n = (req === 'guest') ? 4 : (req) ? req.length : 4;
            for(var i = 0; i < 4; i++){
                var lock;
                if((n || n === 0) && i < n+1){
                    stages.eq(i).data('gameName', gamesArray[i]);
                    stages.eq(i).addClass('activeGame');
                    lock = $('<i class="fas fa-lock-open"></i>');

                }else{
                    lock = $('<i class="fas fa-lock"></i>');
                }
                var h3 = stages.eq(i).next('h3')[0];
                h3.insertBefore(lock[0], h3.childNodes[0]);
            }
            stages.one('click',openGame);
        });


    // for(var i = 0; i < 4; i++){
    //     var lock;
    //     if(i < 4){
    //         stages.eq(i).data('gameName', gamesArray[i]);
    //         stages.eq(i).addClass('activeGame');
    //         lock = $('<i class="fas fa-lock-open"></i>');
    //
    //     }else{
    //         lock = $('<i class="fas fa-lock"></i>');
    //     }
    //     var h3 = stages.eq(i).next('h3')[0];
    //     h3.insertBefore(lock[0], h3.childNodes[0]);
    // }
    // stages.one('click',openGame);

    function openGame(e, gn){
        var el = gn || $(e.target).data('gameName');
        if(!el) return;
        var isMobile = window.orientation !== undefined;
        stages.off('click');
        // isMobile && fullScreen('in');
        if(isMobile){
            fullScreen('in');
            $(window).on('resize', toFullScreen);
        }

        var section = $('<section class="game"></section>');
        var close = $('<button id="close">X</button>');
        var game;
        section[0].appendChild(close[0]);
        document.body.appendChild(section[0]);
        $('body').css({'overscroll-behavior-y': 'contain', overflow: 'hidden'});
        $('html').css({'overscroll-behavior-y': 'contain', overflow: 'hidden'});
        section.animate({
            display: 'block',
            width: '+=90%',
            height: '+=90%',
            top: '4%',
            left: '5%'
        },1000, function(){
            var rules;
            switch(el){
                case 'puzzle':
                    rules = 'Նկարի մասերը խառը դասավորված են էկրանի վրա: ' +
                        'Հաջորդ փուլ անցնելու համար պետք է ամբողջական նկարը վերականգնել առավելագույնը 5 րոպեում:';
                    showRules(section, rules, function(){game = new Puzzle();});
                    break;
                case 'sudoku':
                    rules = 'ՈՒնենք 9×9 չափի քառակուսի, որը բաժանված է 3×3 չափի քառակուսիների։ Քառակուսին ընդհանուր ունի 81 վանդակ։ ' +
                        'Պետք է ազատ վանդակները լրացնել 1-9 թվերով այնպես, որ չհամընկնեն ո՛չ հորիզոնական, ո՛չ ուղղահայաց և ո՛չ էլ 3×3 չափի քառակուսու մեջ։';
                    showRules(section, rules, function(){game = new Sudoku();});

                    break;
                case 'ballons':
                    rules = 'Էկրանի վրա տարբեր տեղերում հայտնվում են փուչիկներ և բարձրանում են վերև: Պետք է դրանք պայթեցնել՝ չթողնելով, որ հասնեն վերևի սահմանին: ' +
                    'Յուրաքանչյուր պայթեցված փուչիկի համար տրվում է 1 միավոր: Հաջորդ փուլ անցնելու համար պետք է հավաքել նվազագույնը 100 միավոր:';
                    showRules(section, rules, function(){game = new Ballons();});
                    break;
                case 'numberGame':
                    rules = 'Էկրանի վերին հատվածում հայտնվում են պատահական թվեր, որոնք իջնում են ներքև:\n' +
                        'Թվերը ջնջելու համար պետք է դրանք գրել տեքստային դաշտում: Յուրաքանչյուր ջնջված թվի համար տրվում է 1 միավոր:\n' +
                        'Հաջորդ փուլ անցնելու համար պետք է հավաքել նվազագույնը 40 միավոր:';
                    showRules(section, rules, function(){game = new Questions();});
                    break;
            }
            $('#logOut').css('display','none');
        });

        var closeButton = $('#close');
        closeButton.one('click',function  closeGame(ev){
            var full = $('<section class="promptContain"></section>');
            var div = $('<div class="prompt"><div>Դուրս գա՞լ խաղից։</div></div>');
            var answer = $('<div class="answer"><button id="Ok">Այո</button><button id="Cancel">Ոչ</button></div>');
            div[0].appendChild(answer[0])
            full[0].appendChild(div[0]);
            document.body.appendChild(full[0]);
            $('#Ok').focus();
            $(document).on('keyup', 'button', function(ev){
                ev.which === 37 && $('#Ok').focus();
                ev.which === 39 && $('#Cancel').focus();
            });

            var promise = new Promise(function(resolve, reject){
                div.on('click',function(ev){
                    var el = ev.target;
                    $(document).stop();
                    if(el.getAttribute('id') === 'Ok') resolve(el);
                    else if(el.getAttribute('id') === 'Cancel') reject(el);
                })

            });

            promise.then(function(){
                game && game.endGame();
                game = null;
                section.html('');
                div.remove();
                // isMobile && fullScreen('out');
                if(isMobile){
                    fullScreen('out');
                    $(window).off('resize', toFullScreen);
                }
                section && section.animate({
                    width: '-=80%',
                    height: '-=80%',
                    top: '50%',
                    left: '50%'
                },1000,function(){
                    section.animate({
                        top: '-=50%',
                        left: '100%',
                        width: '-=10%',
                        height: '-=10%',
                    }, 1000 , function(){
                        section.remove();
                        full.remove();
                        closeButton.off('click');
                        $('body').css({'overscroll-behavior-y': '', overflow: ''});
                        $('html').css({'overscroll-behavior-y': '', overflow: ''});
                        stages.one('click',openGame);
                        $(document).off('keyup', 'button');
                        $('#logOut').css('display','inline');
                    })

                })
            },function(){
                full.remove();
                closeButton.one('click',closeGame);
            });

        });

        function fullScreen(which){
            var doc = window.document;
            var docEl = doc.documentElement;

            var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
            var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
            if(which === 'in') requestFullScreen && docEl && requestFullScreen.call(docEl);
            else if(which === 'out') cancelFullScreen && doc && cancelFullScreen.call(doc);
        }
        function toFullScreen(){
            if(window.innerHeight !== screen.height){
                $(document).one('click', function(){
                    fullScreen('in');
                })
            }
        }
    }
    function setSizes(){
        $('.container').css({
            'height': window.innerHeight + 'px',
            'width': window.innerWidth + 'px'
        });
    }
    function Puzzle(){
        this.section = $('.game');
        this.bigDiv = $('<div></div>');
        this.title = $('<h2>Level 1: Puzzle</h2>');
        this.table = $('<div id="puzzle"></div>');
        this.pieces = null;
        this.timeouts = [];
        this.timer = null;
        this.puzzlePieces = null;
        var self = this;


        this.createTable = function(){
            var p = 0;
            for (var i = 0; i < 4; i++){
                var main = $('<main class="main"></main>');
                for (var j = 0; j < 6; j++){
                    var nest = $('<div class="nest"></div>');
                    main[0].appendChild(nest[0]);
                    p++;
                    $(nest).data('num',p);
                }
                var clear = $('<div class="clear"></div>');
                main[0].appendChild(clear[0]);
                this.table[0].appendChild(main[0]);
            }
            this.bigDiv[0].appendChild(this.title[0]);
            this.bigDiv[0].appendChild(this.table[0]);
            this.section[0].appendChild(this.bigDiv[0]);
            self.timer = new countScore(this.bigDiv);
            self.createPieces();
        };

        this.createPieces = function(){
            var puzzle1 = [
                ['puzzle1/1.png','puzzle1/2.png','puzzle1/3.png','puzzle1/4.png','puzzle1/5.png','puzzle1/6.png','puzzle1/7.png','puzzle1/8.png','puzzle1/9.png','puzzle1/10.png','puzzle1/11.png','puzzle1/12.png','puzzle1/13.png','puzzle1/14.png','puzzle1/15.png','puzzle1/16.png','puzzle1/17.png','puzzle1/18.png','puzzle1/19.png','puzzle1/20.png','puzzle1/21.png','puzzle1/22.png','puzzle1/23.png','puzzle1/24.png','puzzle1/background.jpg'],
                ['puzzle2/1.png','puzzle2/2.png','puzzle2/3.png','puzzle2/4.png','puzzle2/5.png','puzzle2/6.png','puzzle2/7.png','puzzle2/8.png','puzzle2/9.png','puzzle2/10.png','puzzle2/11.png','puzzle2/12.png','puzzle2/13.png','puzzle2/14.png','puzzle2/15.png','puzzle2/16.png','puzzle2/17.png','puzzle2/18.png','puzzle2/19.png','puzzle2/20.png','puzzle2/21.png','puzzle2/22.png','puzzle2/23.png','puzzle2/24.png','puzzle2/background.jpg']
            ];
            var p = 0;
            this.pieces = puzzle1[Math.floor(Math.random()*puzzle1.length)];
            this.table.css({
                'background': 'url(images/'+ this.pieces[this.pieces.length-1]+') no-repeat center',
                'background-size' : '100% 100%'
            });
            for (var i = 0; i < 4; i++){
                for (var j = 0; j < 6; j++){
                    var bigPiece = $('<img draggable="false" class="bigPiece" src="images/'+this.pieces[p]+'">');
                    p++;
                    $(bigPiece).css({
                        'top': (Math.floor(Math.random()*(parseInt(this.section.css('height'))-100)))+ 'px',
                        'left':( Math.floor(Math.random()*(parseInt(this.section.css('width'))-100))) + 'px',
                        'transform': 'rotate(' +Math.floor(Math.random()*180) + 'deg)'
                    });
                    $(bigPiece).data('num',p);
                    $('.nest')[p-1].appendChild(bigPiece[0]);
                }
            }
            self.puzzlePieces = $('.bigPiece');
        };



        this.puzzleEffect = function(){
            var promise = new Promise(function(resolve){
                var a = setTimeout(function(){
                    $(self.table).addClass('tableBackground');
                    var b = setTimeout(function(){

                        resolve(function(){
                            self.timeouts.push(a,b);
                            self.timer.go();
                            self.puzzlePieces.ready(function(){
                                self.puzzlePieces.animate({
                                    backgroundSize : '100%'
                                },1000,'linear',function(){
                                    $('.bigPiece').css('background-size','cover')
                                });
                            });
                            $(self.table).css({
                                'background' :  'rgba(255,255,255,0.4) url("images/puzzle1/bgg.png")',
                                'background-size' : '100% 100%'
                            });

                        });


                    },2950);
                },5000);

            });
            promise
                .then(
                    function(result){
                        result();
                    },function(a){console.log(a)}
                );
        };

        this.movePieces = function(){
            self.puzzlePieces.on('mousedown touchstart',function(e){
                e = e.originalEvent;
                var top = e.pageY - parseInt($(this).css('top')) || e.touches[0].clientY - parseInt($(this).css('top'));
                var left = e.pageX - parseInt($(this).css('left')) || e.touches[0].clientX - parseInt($(this).css('left'));
                var thisPiece = $(this);
                thisPiece.addClass('higher');
                $(document).on('mousemove touchmove',function(ev){
                    ev = ev.originalEvent;
                    var t = ev.pageY || ev.touches[0].clientY;
                    var l = ev.pageX || ev.touches[0].clientX;
                    thisPiece.css('top',t - top + 'px');
                    thisPiece.css('left',l - left + 'px');
                });
                $(this).one('mouseup touchend',function(el){
                    el = el.originalEvent;
                    thisPiece.removeClass('higher');
                    var td = $('.nest');
                    var cx = el.pageX || el.changedTouches[0].clientX;
                    var cy = el.pageY || el.changedTouches[0].clientY;
                    for (var i = 0; i < td.length; i++){
                        if(td.eq(i).data('num') === $(this).data('num') && (cy < td.eq(i).offset().top + parseInt(td.eq(i).css('height')) && (cy > td.eq(i).offset().top)) && (cx < td.eq(i).offset().left + parseInt(td.eq(i).css('width')) && (cx > td.eq(i).offset().left))){
                            // console.log($(this).index());
                            // console.log($(this).width(),$(this).height());
                            $(this).addClass('correct');
                            if($(this).data('num') <= 6 || ($(this).data('num') >12 && $(this).data('num') <= 18)){
                                if(($(this).data('num')% 6) % 2 !== 0){
                                    $(this).css({
                                        'left' : '-35%',
                                        'top' : 0
                                    });
                                }else {
                                    $(this).css({
                                        'top' : '-35%',
                                        'left' : 0
                                    });
                                }
                            }
                            if(($(this).data('num') >6 && $(this).data('num') <= 12) || ($(this).data('num') >18 && $(this).data('num') <= 24)){
                                if(($(this).data('num')% 6) % 2 !== 0){
                                    $(this).css({
                                        'top' : '-35%',
                                        'left' : 0
                                    });
                                }else {
                                    $(this).css({
                                        'left' : '-35%',
                                        'top' : '0'
                                    });
                                }
                            }
                            if($(this).data('num') % 6 === 1){
                                $(this).css('left', 0);

                            }
                            if($(this).data('num') <= 6){
                                $(this).css('top', 0);
                            }
                            td.eq(i).css('position','relative');
                            // td[i].appendChild(this);
                            td.eq(i).find('.bigPiece').addClass('pieces-animate');
                            // setTimeout(function(){
                            //     finalyPiece.find('img').addClass('animateEnd');
                            // },1000);
                            if($('.correct').length === $('.game img').length){
                                $.ajax({
                                    url: '../getUserInfo.php',
                                    method: 'post',
                                    dataType:'json',
                                    data:{
                                        addProgress : true,
                                        gameId : 1,
                                        time : self.timer.end().slice(5).split(" ").join(''),
                                        progress : 2,
                                        points: null
                                    },
                                })
                                    .done(function(req){
                                        setTimeout(function(){
                                            openNextStage(1,'numberGame');
                                            showAlert('Շնորհավորում ենք, դուք հաղթահարեցիք առաջին փուլը: <br>' + self.timer.end());
                                            if(stages.eq(1).data('gameName')){
                                                var h3 = stages.eq(1).next('h3')[0];
                                                var lock = $('<i class="fas fa-lock-open"></i>');
                                                h3.insertBefore(lock[0],h3.childNodes[0]);
                                                chooseOne('Սկսել նորից', 'Հաջորդ խաղ', self.play, 'numberGame' );
                                            }else{
                                                playAgainButton(function(){
                                                    self.play();
                                                })
                                            }
                                            self.clearTimeouts();



                                        },3000);
                                    });

                                }
                            $(this).off('mousedown touchstart');
                        }
                    }
                    $(document).off('mousemove touchmove');
                });
            });
        };
        this.clearTimeouts = function(){
            for (var i = 0; i < self.timeouts.length; i++){
                clearTimeout(self.timeouts[i]);
            }
            self.timeouts = [];

        };
        this.play = function(){
            topTen(1,'time');
            self.section.children().not('button').remove();
            self.bigDiv.html('');
            self.table.html('');
            self.table.removeClass('tableBackground');
            self.timer.end();
            self.createTable();
            self.puzzleEffect();
            self.movePieces();
            self.timeEnd();
        };
        this.timeEnd = function(){
            var lastTimeout = setTimeout(function(){
                showAlert('Այս խաղը անցնելու համար նախատեսված ժամանակն ավարտվել է: Փորձեք նորից:');
                self.timer.end();
                self.puzzlePieces.off('mousedown');
                self.puzzlePieces.off('touchstart');
                playAgainButton(function(){
                    self.play();
                });
            },305000000);
            self.timeouts.push(lastTimeout);
        };
        topTen(1,'time');
        this.createTable();
        this.puzzleEffect();
        this.movePieces();
        this.timeEnd();

        $(window).on('resize',resizePuzzle);
        function resizePuzzle(){
            self.puzzlePieces.each(function(){
                if(parseInt($(this).css('left')) > self.section.width())
                    $(this).css('left',( Math.floor(Math.random()*(parseInt(self.section.css('width'))-100))*90/$('body').width()) + '%');
                if(parseInt($(this).css('top')) > self.section.height())
                    $(this).css('top',(Math.floor(Math.random()*(parseInt(self.section.css('height'))-100))*90/$('body').height())+ '%');
            });
        }
        this.endGame = function(){
            self.clearTimeouts();
            $(window).off('resize',resizePuzzle);
        };
    }



    function Ballons(){
        var section = $('.game');
        var bigDiv = $('<div id="ballonBox"></div>');
        var game = $('<div id="ballonGame"></div>');
        setSizeGame();
        var score = $('<div><h2>Ձեր հաշիվը՝ 0</h2></div>');
        var title = $('<h2>Level 3: Ballons</h2>');
        this.o = 0;
        this.balls = [];
        var speed = 10000;
        var speedBalloon = 1000;
        var level = 1;
        var balloon=['blue-balloon.png','green-Balloon.gif','red-balloon.png','fish.png'];
        var l = balloon.length;
        var self = this;
        $(window).on('resize', setSizeGame);
        this.start = setInterval(addBallons,speedBalloon);
        function addBallons(){
            self.balls.push(new CreateBall());
        }
        function setSizeGame(){
            game.css({height: window.innerHeight * 0.7 + 'px'});
        }
        function CreateBall(){
            var i = Math.floor(Math.random() * l);
            this.el = $('<div><img src="images/ballon_game/'+ balloon[i] + '"></div>');
            var bal = this.el;
            if(i === l - 1){
                bal.attr('data-value', 1);
                bal.bonus = true;
            }
            game[0].appendChild(bal[0]);
            var left = (Math.random()) * 90;
            var top = (Math.random()) * 50;
            bal.css({'left' : left + '%', 'top' : 100 - top + '%'});
            bal.animate({top: '-=' + (100 - top) + '%', height: '50px', width: '50px'
            }, speed, function(){
                var sss = self.o;
                if(bal.bonus){
                    bal.remove();
                    return;
                }
                if(self.o >= 100){
                    openNextStage(3,'sudoku');

                    $.ajax({
                        url: '../getUserInfo.php',
                        method: 'post',
                        data:{
                            gameId: 3,
                            addProgress: true,
                            points: self.o,
                            time: null,
                            progress:4
                        },
                        dataType: 'json'
                    })
                        .done(function(req){
                            console.log(self.o);
                            showAlert('Շնորհավորում ենք, Դուք հաղթահարեցիք երրորդ փուլը: <br>  Դուք հավաքել եք ' + sss + ' միավոր');
                            chooseOne('Սկսել նորից', 'Հաջորդ խաղ', function(){ self.play() }, 'sudoku' );
                            var h3 = stages.eq(3).next('h3')[0];
                            var lock = $('<i class="fas fa-lock-open"></i>');
                            h3.insertBefore(lock[0],h3.childNodes[0]);
                        });

                }else if($('.game').length){
                    showAlert('Ձեզ պակասում է ' + (100 - self.o) + ' միավոր հաջորդ փուլ անցնելու համար: Փորձեք նորից:');

                    if(stages.eq(3).data('gameName')){
                        chooseOne('Սկսել նորից', 'Հաջորդ խաղ', function(){ self.play() }, 'sudoku' );
                    }else{
                        playAgainButton(function(){
                            self.play();
                        })
                    }
                }
                    self.endGame();
            });
            bal.on('dragstart', function(e){e.preventDefault()})
        }
        this.play = function(){
            // topTen(2,'point');
            appending();
            self.start = setInterval(addBallons,speedBalloon);
            score.html('<h2>Ձեր հաշիվը՝ ' + self.o + '</h2>');
            $(window).on('resize', setSizeGame);
        };
        this.endGame = function(){
            self.o = 0;
            speed = 10000;
            speedBalloon = 1000;
            level = 1;
            self.balls.forEach(function(v){v.el.stop()});
            self.balls = [];
            clearInterval(self.start);
            game.empty();
            $(window).off('resize', setSizeGame);
        };
        game.on("mousedown", 'div', function(ev){
            $(this).stop();
            $(this).remove();
            self.o++;
            if (this.dataset.value === '1'){
                self.o++;
                var bon = $('<div class="gameBonus">Բոնուս +2</div>');
                bon.css({
                    position: 'absolute',
                    top: ev.pageY - 10 + 'px',
                    left: ev.pageX - 30 + 'px',
                    color: '#fff',
                    width: 'fit-content'
                });
                section[0].appendChild(bon[0]);
                bon.animate({fontSize: '1.2em', color: 'transparent'}, 700, function(){bon.remove()});
            }
            score.html('<h2>Ձեր հաշիվը՝ ' + self.o + '</h2>');
            if(self.o / 20 >= level){
                var newLevel = $('<h2 class="gameLevel">Մակարդակ ' + ++level + ' </h2>');
                newLevel.css({position: 'absolute', top: '10px', left: 0, width: '100%'});
                section[0].appendChild(newLevel[0]);
                newLevel.animate({fontSize: '2em', color: 'transparent'}, 1000, function(){newLevel.remove()});
                speed = (speed > 500) ? speed - 500 : 100;
                if(speedBalloon > 200){
                    speedBalloon -= 200;
                    clearInterval(self.start);
                    self.start = setInterval(addBallons,speedBalloon);
                }
            }
        });
        appending();
        function appending(){
            bigDiv[0].appendChild(title[0]);
            bigDiv[0].appendChild(game[0]);
            bigDiv[0].appendChild(score[0]);
            section[0].appendChild(bigDiv[0]);
            topTen(3,'point');
        }
    }

    window.showAlert = function(val){
        var section = $('<section class="promptContain"></section>');
        var div = $('<div class="prompt"><div>' + val + '</div></div>');
        var answer = $('<div class="answer"></div>');
        var but = $('<button>Ok</button>');
        but.one('click',function(){
            section.remove();
        });
        answer[0].appendChild(but[0]);
        div[0].appendChild(answer[0]);
        section[0].appendChild(div[0]);
        document.body.appendChild(section[0]);
        but.focus();
    };

    window.openNextStage = function(num,name){
        stages.eq(num).data('gameName',name);
        stages.eq(num).next('h3').find('i').remove();
    };

    window.countScore = function(where){
        var watch = $('<h2></h2>');
        var hours = $('<span>00</span>'), h = 0;
        var minutes = $('<span>00</span>'), m = 0;
        var seconds = $('<span>00</span>'), s = 0;
        var start;
        this.go = function(){
           start = setInterval(function(){
                s++;
                seconds.text(addZero(s));
                if(s === 60){
                    s = 0;
                    m++;
                    minutes.text(addZero(m));
                }
                if(m === 60){
                    m = 0;
                    h++;
                    hours.text(addZero(h));
                }
                if(h === 24){
                    h = 0;
                    hours.text(addZero(h));
                }

            },1000);
            watch.empty();
            watch[0].appendChild(hours[0]);
            watch[0].appendChild(document.createTextNode(' : '));
            watch[0].appendChild(minutes[0]);
            watch[0].appendChild(document.createTextNode(' : '));
            watch[0].appendChild(seconds[0]);
            where[0].appendChild(watch[0]);
        };
        this.addClass = function(a){
            watch.addClass(a);
        };
        this.end = function(){
            clearInterval(start);
            return addZero(h) + " : " + addZero(m) + " : " + addZero(s);
        };
        this.restart = function(){
            h = 0; m = 0; s = 0;
            hours.text('00'); minutes.text('00'); seconds.text('00');
        };
        this.getScore = function(){
            return addZero(m) + ':' + addZero(s);
        }
    };

    window.topTen = function(gameId,type){
        var section = $('.game');
        $.ajax({
            url: '../getUserInfo.php',
            method: 'post',
            data:{
                gameId: gameId,
                type: type,
                action: 'topTen'
            },
            dataType: 'json'
        })
            .done(function(props){
                $('.ten').remove();
                $('.seeTopTen').remove();
                var ten,tabTd,tabName,tabPoint;
                var showButton = $('<button class="seeTopTen">Թոփ-տասնյակ</button>');
                if(type === 'time'){
                    ten  = $('<table class="ten"><tr><th>&#8470;</th><th>Խաղացող</th><th>Ժամանակ</th></tr></table>');
                }else{
                    ten  = $('<table class="ten"><tr><th>&#8470;</th><th>Խաղացող</th><th>Միավոր</th></tr></table>');
                }
                for(var i = 0; i < props.length; i++){
                    var tabTr = $('<tr></tr>');
                    if(props[i]['point']){
                        tabTd = $('<td>' + (i+1) + '</td>');
                        tabName = $('<td>' + props[i].name + '</td>');
                        tabPoint = $('<td>' + props[i]['point']+ '</td>');
                    }else{
                        tabTd = $('<td>' + (i+1) + '</td>');
                        tabName = $('<td>' + props[i].name + '</td>');
                        tabPoint = $('<td>' + props[i].time + '</td>');

                    }
                    tabTr[0].appendChild(tabTd[0]);
                    tabTr[0].appendChild(tabName[0]);
                    tabTr[0].appendChild(tabPoint[0]);
                    ten[0].appendChild(tabTr[0]);
                }
                if (screen.width >= 767){
                    section[0].appendChild(ten[0]);
                }else{
                    ten.css({
                        margin: '0 auto',
                        display:'none',
                    });
                    showButton.css({
                       display: 'block',
                       margin: '0 auto'
                    });
                    var bigDiv = $('.game>div')[0];
                    bigDiv.appendChild(showButton[0]);
                    bigDiv.appendChild(ten[0]);
                    showButton.on('click',function(){
                        ten.slideToggle(100);
                    });

                }
            })
    };
    function addZero(a){
        return (a < 10) ? '0' + a : a;
    }
    window.playAgainButton = function (f){
        var but = $('<div class = "again"><span>Նորից խաղալ</span></div>');
        $('.game')[0].appendChild(but[0]);
        $('.again>span').one('click', function(){
            f();
            but.remove();
        });
    };

    window.addNumButtons = function(where, fnTodo, del){
        var numList = $('<div class="numList"></div>');
        for(var i = 1; i < 10; i++){
            var btn = $('<div class="numButton">' + i + '</div>');
            numList[0].appendChild(btn[0]);
            btn.on('click',fnTodo);
        }
        var btn = $('<div class="numButton">0</div>');
        btn.on('click',fnTodo);
        var back = $('<div class="numButton"><i class="fas fa-arrow-left"></i></div>');
        back.on('click',del);
        numList[0].appendChild(btn[0]);
        numList[0].appendChild(back[0]);
        where[0].appendChild(numList[0]);
        numList.css('display', 'none');
        return numList;
    };

    window.removeNumButtons = function(){
        $('.numButton').off('click');
        $('.numList').remove();
    };

    window.chooseOne = function(firstStr, secondStr, firstFn, i){
        var but = $('<div class = "again"><span id="firstBut">' + firstStr + '</span><span id="secondBut">' + secondStr + '</span></div>');

        $('.game')[0].appendChild(but[0]);
        var promise = new Promise(function(resolve, reject){
            but.on('click',function(ev){
                var el = ev.target;
                if(el.id === 'firstBut') resolve(el);
                else if(el.id === 'secondBut') reject(el);
            })

        });
        promise.then(function(){
            but.off('click');
            but.remove();
            but = null;
            stages.off('click',openGame);
            firstFn();
        }  , function(){
            but.off('click');
            but.remove();
            but = null;
            $('.game').fadeOut(1000, function(){$('.game').remove(); openGame(null, i)});
        });
    };

    function showRules(where,str,fn){
        var div = $('<div class="rules"><div class="ruleList">' + str + '</div></div>');
        var btn = $('<div class="start">Սկսել</div>');
        div[0].appendChild(btn[0]);
        where[0].appendChild(div[0]);
        btn.one('click', start);

        function start(){
            div.remove();
            fn();
        }
    }

});



