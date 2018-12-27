$(document).ready(function(){
<<<<<<< HEAD
    let stages = $('.stages img');
    stages.eq(0).data('gameName','puzzle');
=======
    window.stages = $('.stages img');
    stages.eq(0).data('gameName','puzzle');
    stages.eq(1).data('gameName','sudoku');
>>>>>>> master
    stages.one('click',openGame);

    function openGame(e){
        let el = e.target;
        if(!$(this).data('gameName')) return;
<<<<<<< HEAD
=======
        stages.off('click');
>>>>>>> master
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
<<<<<<< HEAD
                // case 'newGame':
            }
        });
        let closeButton = $('#close');
        closeButton.one('click',function  closeGame(ev){
            let div = $('<section class="prompt"><div>Վստահ ես?</div></section>');
            let answer = $('<div class="answer"><button>Ok</button><button>Cancel</button></div>');
=======
                case 'sudoku': sudoku(); break;
            }
        });

        let closeButton = $('#close');
        closeButton.one('click',function  closeGame(ev){
            let div = $('<section class="prompt"><div>Վստահ ես?</div></section>');
            let answer = $(`<div class="answer"><button id='Ok'>Այո</button><button id='Cancel'>Ոչ</button></div>`);
>>>>>>> master
            $(document.body).append(div.append(answer));

            let promise = new Promise(function(resolve, reject){
                div.on('click',function(ev){
                    let el = ev.target;
<<<<<<< HEAD
                    if(el.innerText == 'Ok') resolve(el);
                    else if(el.innerText == 'Cancel')reject(el);
                })
=======
                    if(el.getAttribute('id') == 'Ok') resolve(el);
                    else if(el.getAttribute('id') == 'Cancel')reject(el);
                })

>>>>>>> master
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
<<<<<<< HEAD
=======

>>>>>>> master
                })
            },function(){
                div.remove();
                closeButton.one('click',closeGame);
            });
<<<<<<< HEAD
=======

>>>>>>> master
        });
    }

    function puzzle(){
        let section = $('.game');
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
        section.append(table);
        let pieces = ['1_1.jpg','1-2.jpg','1-3.jpg','1-4.jpg','1-5.jpg','2-1.jpg','2-2.jpg','2-3.jpg','2-4.jpg','2-5.jpg','3-1.jpg','3-2.jpg','3-3.jpg','3-4.jpg','3-5.jpg','4-1.jpg','4-2.jpg','4-3.jpg','4-4.jpg','4-5.jpg'];
        for (var i = 0; i < pieces.length; i++) {
            let piece = $('<div class="piece"></div>');
            $(piece).data('pieceNo',i);
            $(piece).css({
                'height': '100px',
                'width': '100px',
                'top': Math.floor(Math.random()*(parseInt(section.css('height'))-100))+ 'px',
                'left': Math.floor(Math.random()*(parseInt(section.css('width'))-100)) + 'px',
                'background': 'url(images/puzzle/'+pieces[i]+')',
                'transform': 'rotate(' +Math.floor(Math.random()*180) + 'deg)'
            });
            $(piece).data('num',i);
            section.append(piece)
        }
        $('.piece').on('mousedown touchstart',function(e){
<<<<<<< HEAD
=======
            console.log($(this).data('num'));
>>>>>>> master
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
<<<<<<< HEAD
            	thisPiece.removeClass('higher');
=======
                thisPiece.removeClass('higher');
>>>>>>> master
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
                                $(this).css('-webkit-transform','rotate(' + now + 'deg)');
                            },
                            duration: '5s'
                        }, 'linear');
                        if($('#puzzle .piece').length === pieces.length){
                            showAlert('Շնորհավոոոոոոոոոր դուք հաղթահարեցիք առաջին փուլը');
<<<<<<< HEAD
                            openNextStage(1,'newGame')
=======
                            openNextStage(1,'sudoku');
>>>>>>> master
                        }
                        $(this).off('mousedown touchstart');
                    }
                }
                $(document).off('mousemove touchmove');
            });
<<<<<<< HEAD
        })
    }
    function showAlert(val){
=======

        })
    }
    window.showAlert = function(val){
>>>>>>> master
        let div = $('<section class="prompt"><div>' + val + '</div></section>');
        let answer = $('<div class="answer"></div>');
        let but = $('<button>Ok</button>');
        but.one('click',function(){div.remove()});
        $(document.body).append(div.append(answer.append(but)));
    }
    function openNextStage(num,name){
        stages.eq(num).data('gameName',name);
    }
});
<<<<<<< HEAD
=======

>>>>>>> master
