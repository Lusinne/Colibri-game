$(document).ready(function(){
    window.stages = $('.stages img');
    stages.eq(0).data('gameName','puzzle');
    // stages.eq(1).data('gameName','sudoku');
    stages.one('click',openGame);

    function openGame(e){
        let el = e.target;
        if(!$(this).data('gameName')) return;
        stages.off('click');
        let section = $('<section class="game"></section>');
        let close = $('<button id="close">X</button>');
        section.append(close);
        $(document.body).append(section);
        section.animate({
            display: 'block',
            width: '+=90%',
            height: '+=90vh',
            top: '4%',
            left: '5%'
        },1000, function(){
            switch($(el).data('gameName')){
                case 'puzzle': puzzle(); break;
                case 'sudoku': sudoku(); break;
            }
        });

        let closeButton = $('#close');
        closeButton.one('click',function  closeGame(ev){
            let div = $('<section class="prompt"><div>Վստահ ես?</div></section>');
            let answer = $('<div class="answer"><button id="Ok">Այո</button><button id="Cancel">Ոչ</button></div>');
            $(document.body).append(div.append(answer));

            let promise = new Promise(function(resolve, reject){
                div.on('click',function(ev){
                    let el = ev.target;
                    if(el.getAttribute('id') == 'Ok') resolve(el);
                    else if(el.getAttribute('id') == 'Cancel')reject(el);
                })

            });

            promise.then(function(){
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
                        // display: 'none',
                    }, 1000 , function(){
                        section.remove();
                        closeButton.off('click');
                        stages.one('click',openGame);
                    })

                })
            },function(){
                div.remove();
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
        let pieces = ['1_1.jpg','1-2.jpg','1-3.jpg','1-4.jpg','1-5.jpg','2-1.jpg','2-2.jpg','2-3.jpg','2-4.jpg','2-5.jpg','3-1.jpg','3-2.jpg','3-3.jpg','3-4.jpg','3-5.jpg','4-1.jpg','4-2.jpg','4-3.jpg','4-4.jpg','4-5.jpg'];
        for (var i = 0; i < pieces.length; i++) {
            let piece = $('<div class="piece"></div>');
            $(piece).data('pieceNo',i);
            $(piece).css({
                'top': (Math.floor(Math.random()*(parseInt(section.css('height'))-100))*90/screen.height)+ '%',
                'left':( Math.floor(Math.random()*(parseInt(section.css('width'))-100))*90/screen.width) + '%',
                'background': 'url(images/puzzle/'+pieces[i]+')',
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
                            showAlert('Շնորհավոոոոոոոոոր դուք հաղթահարեցիք առաջին փուլը <br>' + timer.end());
                            openNextStage(1,'sudoku');
                        }
                        $(this).off('mousedown touchstart');
                    }
                }
                $(document).off('mousemove touchmove');
            });

        })
    }
    window.showAlert = function(val){
        let div = $('<section class="prompt"><div>' + val + '</div></section>');
        let answer = $('<div class="answer"></div>');
        let but = $('<button>Ok</button>');
        but.one('click',function(){div.remove()});
        $(document.body).append(div.append(answer.append(but)));
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

});

