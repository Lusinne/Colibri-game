(function(){
    window.Questions = function(){
        this.section = $('.game');
        this.bigDiv = $('<div id="miniSection"></div>');
        this.points = $('<h2 id="points">Ձեր հաշիվը՝ 0</h2>');
        this.title = $('<h2>Level 3: Number Game</h2>');
        this.big = $('<div id="big"></div>');
        this.questions = $('<div id="questions"></div>');
        this.input = $('<input id="input" type="text" placeholder="Նշեք ճիշտ պատասխանը">');
        this.section.append(this.bigDiv.append(this.title,this.big.append(this.questions, this.input),this.points));
        let self = this;
        this.numList = addNumButtons(self.bigDiv,function(){
            self.input[0].value += this.innerText;
            checkInput();
        }, function(){
            self.input[0].value = self.input.val().slice(0,-1);
        });

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
            else this.numList.css('display', 'flex');

            bindEvents();
        };

        this.endGame = function(){
            removeEvents();
            // removeNumButtons();
            clearInterval(self.int);
            let a = $('.a');
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
                self.numList.css('display', 'none');
            });
            self.input.on('blur', function(){
                self.numList.css('display', 'flex');
            })
        }
        function removeEvents(){
            self.input.off('keydown', checkNum);
            self.input.off('keyup', checkInput);
        }

        function checkNum(ev){
            let code;
            if (ev.keyCode) code = ev.keyCode; else if (ev.which) code = ev.which;
            if(code>=96 && code<=105)code-=48;
            if((code < 48 || code > 57) && code !== 8){ev.stopImmediatePropagation(); ev.preventDefault(); }
        }
        function checkInput(){
            let val = self.input.val();
            let alast = $('.a:last');
            if(val && val === alast.text()){
                alast.remove();
                self.count++;
                self.points.html('Ձեր հաշիվը՝ ' + self.count);
                if(self.count % 10 === 0){
                    clearInterval(self.int);
                    self.randomMultiple *= 10;
                    self.t -= 50;
                    self.count++;
                    self.int = setInterval(create, self.t, self.randomMultiple)
                }
                self.input.val('');
            }
        }

        function create(randomMultiple){
            let div = $('<div class="a" style="position:relative;">' + Math.floor(Math.random() * randomMultiple) + '</div>');
            div.animate({
                paddingTop: '+=15px',
                paddingBottom: '+=15px',
                paddingLeft: '+=25px',
                paddingRight: '+=25px',
                fontSize: '+=1em',
                borderWidth: '+=1px'
            },1500,function () {
                div.animate({
                    top: '+=90vh'
                }, 25000, 'linear');
            });

            self.questions.prepend(div);

            self.set.push(setInterval(function(){
                let divs = $('.a:last');
                if(divs.position() && (divs.position().top + parseInt(divs.css('height'))*1.3)  >= self.input.position().top){
                    self.endGame();

                    if(self.count >= 2){
                        openNextStage(2,'ballons');
                        showAlert('Շնորհավորում ենք, Դուք հաղթահարեցիք երկրորդ փուլը: <br> Դուք հավաքել եք ' + self.count + ' միավոր');
                        chooseOne('Սկսել նորից', 'Հաջորդ խաղ', function(){ self.play() }, 'ballons' );
                    }else{
                        showAlert('Ձեզ պակասում է '+ (40 - self.count) +' միավոր հաջորդ փուլ անցնելու համար: Փորձեք նորից:');
                        self.questions.html('');

                        playAgainButton(function(){
                            self.play();
                        })
                    }
                }
            },150))

        }
    };

})();