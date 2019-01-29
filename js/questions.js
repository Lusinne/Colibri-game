(function(){
    window.Questions = function(){
        var self = this;
        this.section = $('.game');
        this.bigDiv = $('<div id="miniSection"></div>');
        this.points = $('<h2 id="points">Ձեր հաշիվը՝ 0</h2>');
        this.title = $('<h2>Level 2: Number Game</h2>');
        this.big = $('<div id="big"></div>');
        this.questions = $('<div id="questions"></div>');
        this.input = $('<input id="input" type="text" placeholder="Նշեք ճիշտ պատասխանը">');
        this.bigDiv[0].appendChild(this.title[0]);
        this.big[0].appendChild(this.questions[0]);
        this.big[0].appendChild(this.input[0]);
        this.bigDiv[0].appendChild(this.big[0]);
        this.bigDiv[0].appendChild(this.points[0]);
        this.section[0].appendChild(this.bigDiv[0]);
        this.numList = addNumButtons(self.bigDiv,function(){
            self.input[0].value += this.innerText;
            checkInput();
        }, function(){
            self.input[0].value = self.input.val().slice(0,-1);
        });
        setSize();
        this.play = function(){
            this.count = 0;
            this.randomMultiple = 100;
            this.t = 1500;
            this.set = [];
            this.points.html('Ձեր հաշիվը՝ 0');
            this.int = setInterval(create, self.t, self.randomMultiple);
            this.input.prop('disabled', false);
            this.input.val('');

            if(window.orientation === undefined) self.input[0].focus();
            else this.numList.addClass('flex');

            bindEvents();

        };

        this.endGame = function(){
            removeEvents();
            // removeNumButtons();
            clearInterval(self.int);
            var a = $('.a');
            a.stop(true,false);
            a.remove();
            self.input.prop('disabled', true);
            self.set.forEach(function(v){
                clearInterval(v);
            });
            self.set = [];
            this.numList.css('display', 'none')
        };

        this.play();

        function bindEvents(){
            self.input.on('keydown', checkNum);
            self.input.on('keyup', checkInput);
            self.input.on('focus', function(){
                self.numList.removeClass('flex');
            });
            self.input.on('blur', function(){
                self.numList.addClass('flex');
            });
            $(window).on('resize',setSize);

        }
        function setSize(){
            self.questions.css({height: parseInt(self.big.css('height')) - 40 + 'px'});
        }
        function removeEvents(){
            self.input.off('keydown', checkNum);
            self.input.off('keyup', checkInput);
            $(window).off('resize',setSize);
        }
        function checkNum(ev){
            var code;
            if (ev.keyCode) code = ev.keyCode; else if (ev.which) code = ev.which;
            if(code>=96 && code<=105)code-=48;
            if((code < 48 || code > 57) && code !== 8){ev.stopImmediatePropagation(); ev.preventDefault(); }
        }
        function checkInput(){
            var val =  self.input[0].value|| self.input.val();
            var alast = $('.a:last');
            if(val && val === alast.text()){
                alast.remove();
                self.count++;
                if(self.count % 10 === 0){
                    clearInterval(self.int);
                    self.randomMultiple *= 10;
                    self.t -= 50;
                    self.count++;
                    self.int = setInterval(create, self.t, self.randomMultiple)
                }
                self.points.html('Ձեր հաշիվը՝ ' + self.count);
                self.input.val('');
            }
        }

        function create(randomMultiple){
            var div = $('<div class="a" style="position:relative;">' + Math.ceil(Math.random() * randomMultiple) + '</div>');
            div.animate({
                paddingTop: '+=15px',
                paddingBottom: '+=15px',
                paddingLeft: '+=25px',
                paddingRight: '+=25px',
                fontSize: '+=1.3em',
                width: '196px',
            },1500,function () {
                div.animate({
                    top: '+=90%'
                }, 25000, 'linear');
            });

            self.questions[0].insertBefore(div[0],self.questions[0].children[0]);

            self.set.push(setInterval(function(){
                var divs = $('.a:last');
                if(divs.position() && (divs.position().top + parseInt(divs.css('height'))*1.3)  >= self.input.position().top){
                    self.endGame();

                    if(self.count >= 3){
                        // $.ajax({
                        //     url: 'file.php',
                        //     method: 'post',
                        //     data:{
                        //         gameId: 2,
                        //         action: 'points',
                        //         addProgress: self.count
                        //     },
                        //     dataType: 'json'
                        // })
                        //     .done(function(req){
                        //         openNextStage(2,'ballons');
                        //         showAlert('Շնորհավորում ենք, Դուք հաղթահարեցիք երկրորդ փուլը: <br> Դուք հավաքել եք ' + self.count + ' միավոր');
                        //         chooseOne('Սկսել նորից', 'Հաջորդ խաղ', function(){ self.play() }, 'ballons' );
                        //     });

                        openNextStage(2,'ballons');
                        showAlert('Շնորհավորում ենք, Դուք հաղթահարեցիք երկրորդ փուլը: <br> Դուք հավաքել եք ' + self.count + ' միավոր');
                        chooseOne('Սկսել նորից', 'Հաջորդ խաղ', function(){ self.play() }, 'ballons' );
                    }else{
                        showAlert('Ձեզ պակասում է '+ (40 - self.count) +' միավոր հաջորդ փուլ անցնելու համար: Փորձեք նորից:');
                        self.questions.html('');
                        if(stages.eq(2).data('gameName')){
                            chooseOne('Սկսել նորից', 'Հաջորդ խաղ', function(){ self.play() }, 'ballons' );
                        }else{
                            playAgainButton(function(){
                                self.play();
                            })
                        }
                    }
                }
            },800))

        }
    };

})();