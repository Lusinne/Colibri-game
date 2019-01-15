$(document).ready(function(){
    $(window).on('keydown', function(ev){
        // (ev.which === 123 || (ev.ctrlKey && (ev.which === 85 || ev.which === 83 || ev.which === 73 && ev.shiftKey))) && ev.preventDefault();
    });
    $(window).on('contextmenu', function(ev){
        ev.preventDefault();
    });

    window.stages = $('.stages img');
    stages.eq(0).data('gameName','puzzle');
    stages.eq(1).data('gameName','sudoku');
    stages.eq(2).data('gameName','numberGame');
    stages.eq(3).data('gameName','ballons');
    stages.one('click',openGame);

    function openGame(e){
        let el = e.target;
        if(!$(this).data('gameName')) return;
        stages.off('click');
        let section = $('<section class="game"></section>');
        let close = $('<button id="close">X</button>');
        let game;
        section.append(close);
        $(document.body).append(section);
        section.animate({
            display: 'block',
            width: '+=90%',
            height: '+=90vh',
            top: '4%',
            left: '5%'
        },1000, function(){
            let rules;
            switch($(el).data('gameName')){
                case 'puzzle':
                    rules = 'puzzle';
                    showRules(section, rules, puzzle);
                    break;
                case 'sudoku':
                    rules = 'sudku';
                    showRules(section, rules, sudoku);
                    break;
                case 'ballons':
                    rules = 'ballons';
                    showRules(section, rules, function(){game = new Ballons();});
                    break;
                case 'numberGame':
                    rules = 'numberGame';
                    showRules(section, rules, questions);
                    break;
            }
        });

        let closeButton = $('#close');
        closeButton.one('click',function  closeGame(ev){
            let full = $('<section class="promptContain"></section>');
            let div = $('<div class="prompt"><div>Անջատե՞լ խաղը:</div></div>');
            let answer = $('<div class="answer"><button id="Ok">Այո</button><button id="Cancel">Ոչ</button></div>');
            $(document.body).append(full.append(div.append(answer)));
            $('#Ok').focus();
            $(document).on('keyup', 'button', function(ev){
                ev.which === 37 && $('#Ok').focus(); 
                ev.which === 39 && $('#Cancel').focus(); 
            });

            let promise = new Promise(function(resolve, reject){
                div.on('click',function(ev){
                    let el = ev.target;
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
                section && section.animate({
                    width: '-=80%',
                    height: '-=80vh',
                    top: '50%',
                    left: '50%'
                },1000,function(){
                    section.animate({
                        top: '0',
                        left: '100%',
                        width: '-=10%',
                        height: '-=10vh',
                    }, 1000 , function(){
                        section.remove();
                        full.remove();
                        closeButton.off('click');
                        stages.one('click',openGame);
                        $(document).off('keyup', 'button');

                    })

                })
            },function(){
                full.remove();
                closeButton.one('click',closeGame);
            });

        });
    }

    function puzzle(){
        let section = $('.game');
        let bigDiv = $('<div></div>');
        let title = $('<h2>Level 1: Puzzle</h2>');
        let table = $('<table cellspacing="5" id="puzzle"></table>');
        let count = 0;
        for (let i = 0; i < 4; i++) {
            let tr = $('<tr></tr>');
            for (let j = 0; j < 5; j++) {
                let td = $('<td></td>');
                $(td).data('num',count);
                count++;
                tr.append(td);
            }
            table.append(tr)
        }
        section.append(bigDiv.append(title,table));
        let timer = new countScore(bigDiv);
        timer.go();
        let puzzle1 = [
            ['puzzle/1-1.jpg','puzzle/1-2.jpg','puzzle/1-3.jpg','puzzle/1-4.jpg','puzzle/1-5.jpg','puzzle/2-1.jpg','puzzle/2-2.jpg','puzzle/2-3.jpg','puzzle/2-4.jpg','puzzle/2-5.jpg','puzzle/3-1.jpg','puzzle/3-2.jpg','puzzle/3-3.jpg','puzzle/3-4.jpg','puzzle/3-5.jpg','puzzle/4-1.jpg','puzzle/4-2.jpg','puzzle/4-3.jpg','puzzle/4-4.jpg','puzzle/4-5.jpg'],
            ['puzzle1/1-1.jpg','puzzle1/1-2.jpg','puzzle1/1-3.jpg','puzzle1/1-4.jpg','puzzle1/1-5.jpg','puzzle1/2-1.jpg','puzzle1/2-2.jpg','puzzle1/2-3.jpg','puzzle1/2-4.jpg','puzzle1/2-5.jpg','puzzle1/3-1.jpg','puzzle1/3-2.jpg','puzzle1/3-3.jpg','puzzle1/3-4.jpg','puzzle1/3-5.jpg','puzzle1/4-1.jpg','puzzle1/4-2.jpg','puzzle1/4-3.jpg','puzzle1/4-4.jpg','puzzle1/4-5.jpg'],
            ['puzzle2/1.jpg','puzzle2/2.jpg','puzzle2/3.jpg','puzzle2/4.jpg','puzzle2/5.jpg','puzzle2/6.jpg','puzzle2/7.jpg','puzzle2/8.jpg','puzzle2/9.jpg','puzzle2/10.jpg','puzzle2/11.jpg','puzzle2/12.jpg','puzzle2/13.jpg','puzzle2/14.jpg','puzzle2/15.jpg','puzzle2/16.jpg','puzzle2/17.jpg','puzzle2/18.jpg','puzzle2/19.jpg','puzzle2/20.jpg'],
            ['puzzle3/1.jpg','puzzle3/2.jpg','puzzle3/3.jpg','puzzle3/4.jpg','puzzle3/5.jpg','puzzle3/6.jpg','puzzle3/7.jpg','puzzle3/8.jpg','puzzle3/9.jpg','puzzle3/10.jpg','puzzle3/11.jpg','puzzle3/12.jpg','puzzle3/13.jpg','puzzle3/14.jpg','puzzle3/15.jpg','puzzle3/16.jpg','puzzle3/17.jpg','puzzle3/18.jpg','puzzle3/19.jpg','puzzle3/20.jpg'],
            ['puzzle4/1.jpg','puzzle4/2.jpg','puzzle4/3.jpg','puzzle4/4.jpg','puzzle4/5.jpg','puzzle4/6.jpg','puzzle4/7.jpg','puzzle4/8.jpg','puzzle4/9.jpg','puzzle4/10.jpg','puzzle4/11.jpg','puzzle4/12.jpg','puzzle4/13.jpg','puzzle4/14.jpg','puzzle4/15.jpg','puzzle4/16.jpg','puzzle4/17.jpg','puzzle4/18.jpg','puzzle4/19.jpg','puzzle4/20.jpg'],
            ['puzzle5/1.jpg','puzzle5/2.jpg','puzzle5/3.jpg','puzzle5/4.jpg','puzzle5/5.jpg','puzzle5/6.jpg','puzzle5/7.jpg','puzzle5/8.jpg','puzzle5/9.jpg','puzzle5/10.jpg','puzzle5/11.jpg','puzzle5/12.jpg','puzzle5/13.jpg','puzzle5/14.jpg','puzzle5/15.jpg','puzzle5/16.jpg','puzzle5/17.jpg','puzzle5/18.jpg','puzzle5/19.jpg','puzzle5/20.jpg']
        ];
        let pieces = puzzle1[Math.floor(Math.random()*puzzle1.length)];
        for (var i = 0; i < pieces.length; i++) {
            let piece = $('<div class="piece"></div>');
            $(piece).data('pieceNo',i);
            $(piece).css({
                'top': (Math.floor(Math.random()*(parseInt(section.css('height'))-100))*90/screen.height)+ '%',
                'left':( Math.floor(Math.random()*(parseInt(section.css('width'))-100))*90/screen.width) + '%',
                'background': 'url(images/'+pieces[i]+')',
                'background-size': 'cover',
                'transform': 'rotate(' +Math.floor(Math.random()*180) + 'deg)'
            });
            $(piece).data('num',i);
            section.append(piece)
        }

        $('.piece').on('mousedown touchstart',function(e){
            console.log($(this).data('num'));
            let top = e.pageY - parseInt($(this).css('top')) || e.touches[0].clientY - parseInt($(this).css('top'));
            let thisPiece = $(this);
            thisPiece.addClass('higher');
            let left = e.pageX - parseInt($(this).css('left')) || e.touches[0].clientX - parseInt($(this).css('left'));
            $(document).on('mousemove touchmove',function(ev){
                let t = ev.pageY || ev.touches[0].clientY;
                let l = ev.pageX || ev.touches[0].clientX;
                thisPiece.css('top',t - top + 'px');
                thisPiece.css('left',l - left + 'px');
            });
            $(this).one('mouseup touchend',function(el){
                thisPiece.removeClass('higher');
                let td = $('td');
                let cx = el.pageX || el.changedTouches[0].clientX;
                let cy = el.pageY || el.changedTouches[0].clientY;
                for (let i = 0; i < td.length; i++){
                    if(td.eq(i).data('num') === $(this).data('num') && (cy < td.eq(i).offset().top + parseInt(td.eq(i).css('height')) && (cy > td.eq(i).offset().top)) && (cx < td.eq(i).offset().left + parseInt(td.eq(i).css('width')) && (cx > td.eq(i).offset().left))){

                        $(this).css({
                            'top': 0,
                            'left': 0
                        });
                        td.eq(i).append($(this));
                        $(this).animate({  textIndent: 0}, {
                            step: function(now, fx) {
                                $(this).css('transform','rotate(' + now + 'deg)');
                            },
                            duration: '5s'
                        }, 'linear');
                        if($('#puzzle .piece').length === pieces.length){
                            showAlert('Շնորհավորում ենք, դուք հաղթահարեցիք առաջին փուլը: <br>' + timer.end());
                            openNextStage(1,'sudoku');
                        }
                        $(this).off('mousedown touchstart');
                    }
                }
                $(document).off('mousemove touchmove');
            });
        });
    }

    function Ballons(){
        let section = $('.game');
        let bigDiv = $('<div id="ballonBox"></div>');
        let game = $('<div id="ballonGame"></div>');
        let score = $('<div><h2>Ձեր հաշիվը՝ 0</h2></div>');
        let title = $('<h2>Level 4: Ballons</h2>');
        this.o = 0;
        this.balls = [];
        let speed = 10000;
        let speedBalloon = 1000;
        let level = 1;
        let balloon=['blue-balloon.png','green-Balloon.gif','red-balloon.png','fish.png'];
        let l = balloon.length;
        let self = this;
        this.start = setInterval(addBallons,speedBalloon);
        function addBallons(){
            self.balls.push(new CreateBall());
        }
        function CreateBall(){
            let i = Math.floor(Math.random() * l);
            this.el = $('<div><img src="images/ballon_game/'+ balloon[i] + '"></div>');
            let bal = this.el;
            if(i === l - 1){
                bal.attr('data-value', 1);
                bal.bonus = true;
            }
            game.append(bal);
            let left = (Math.random()) * 90;
            let top = (Math.random()) * 50;
            bal.css({'left' : left + '%', 'top' : 100 - top + '%'});
            bal.animate({top: '-=' + (100 - top) + '%', height: '50px', width: '50px'
            }, speed, function(){
                if(bal.bonus){
                    bal.remove();
                    return;
                }
                playAgainButton(function(){
                    section.append(bigDiv.append(title,game,score));
                    self.start = setInterval(addBallons,speedBalloon);
                    score.html('<h2>Ձեր հաշիվը՝ ' + self.o + '</h2>');
                });
                if(self.o >= 100){
                    showAlert('Խաղն ավարտվեց: Դուք հավաքել եք ' + self.o + ' միավոր');
                }else if($('.game').length){
                    showAlert('Ձեզ պակասում է ' + (100 - self.o) + ' միավոր հաջորդ փուլ անցնելու համար: Փորձեք նորից:');
                }
                self.endGame();
            });
            bal.on('dragstart', function(e){e.preventDefault()})
        }
        this.endGame = function(){
            self.o = 0;
            speed = 10000;
            speedBalloon = 1000;
            level = 1;
            self.balls.forEach(function(v){v.el.stop()});
            self.balls = [];
            clearInterval(self.start);
            game.empty();
        };
        game.on("mousedown", 'div', function(ev){
            $(this).stop();
            $(this).remove();
            self.o++;
            if (this.dataset.value === '1'){
                self.o++;
                let bon = $('<span>Բոնուս +2</span>');
                bon.css({
                    position: 'absolute',
                    top: ev.pageY - 10 + 'px',
                    left: ev.pageX - 30 + 'px',
                    color: '#fff'
                });
                section.append(bon);
                bon.animate({fontSize: '1.5em', color: 'transparent'}, 1000, function(){bon.remove()});
            }
            score.html('<h2>Ձեր հաշիվը՝ ' + self.o + '</h2>');
            if(self.o / 20 >= level){
                let newLevel = $('<h2>Մակարդակ ' + ++level + ' </h2>');
                newLevel.css({position: 'absolute', top: '10px'});
                section.append(newLevel);
                newLevel.animate({fontSize: '3em', color: 'transparent'}, 1000, function(){newLevel.remove()});
                if(speedBalloon > 300){
                    speedBalloon -= 100;
                    clearInterval(self.start);
                    self.start = setInterval(addBallons,speedBalloon);
                }
            }
        });
        section.append(bigDiv.append(title,game,score));
    }

    window.showAlert = function(val){
        let section = $('<section class="promptContain"></section>');
        let div = $('<div class="prompt"><div>' + val + '</div></div>');
        let answer = $('<div class="answer"></div>');
        let but = $('<button>Ok</button>');
        but.one('click',function(){section.remove()});

        $(document.body).append(section.append(div.append(answer.append(but))));
        but.focus();
    };
    function openNextStage(num,name){
        stages.eq(num).data('gameName',name);
    }

    window.countScore = function(where){
        let watch = $('<h2></h2>');
        let hours = $('<span>00</span>'), h = 0;
        let minutes = $('<span>00</span>'), m = 0;
        let seconds = $('<span>00</span>'), s = 0;
        let start;
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
            watch.append(hours, ' : ', minutes, ' : ', seconds);
            $(where).append(watch);
        };
        this.end = function(){
            clearInterval(start);
            return addZero(h) + " : " + addZero(m) + " : " + addZero(s);
        }
    };
    function addZero(a){
        return (a < 10) ? '0' + a : a;
    }
    function playAgainButton(f){
        let but = $('<div class = "again">Նորից խաղալ</div>');
        $('section.game').append(but);
        but.one('click', function(){
            f();
            but.remove();
        });
    }
    function showRules(where,str,fn){
        let div = $('<div class="rules"><div class="ruleList">' + str + '</div></div>');
        let btn = $('<div class="start">Սկսել</div>');
        where.append(div.append(btn));
        btn.one('click', function(){
            div.remove();
            fn();
        })
    }
});



