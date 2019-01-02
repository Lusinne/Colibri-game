(function(){
    window.questions = function(){
        let section = $('.game');
        let bigDiv = $('<div id="miniSection"></div>');
        let points = $('<div id="points">Ձեր հաշիվը՝</div>');
        let title = $('<h2>Level 3: Number Game</h2>');
        let big = $('<div id="big"><div id="questions"></div><input id="input" type="text" autofocus placeholder="Նշեք ճիշտ պատասխանը"></div>')
        section.append(bigDiv.append(title,big,points));
        let count = 0;
        let randomMultiple = 100;
        let t = 1500;
        let set = [];
        let int = setInterval(create, t,randomMultiple);
        $('input').on('keyup',function(){
            if($(this).val() == $('.a:last').text()){
                $('.a:last').remove();
                count++;
                points.html('Ձեր հաշիվը՝ ' + count)
                if(count % 10 === 0){
                    count += 5;
                    clearInterval(int);
                    randomMultiple *= 10;
                    console.log(randomMultiple)
                    int = setInterval(create,t-100,randomMultiple)
                }
                $(this).val('');
            }
        })


        function create(randomMultiple){
            let div = $('<div class="a" style="position:relative;">'+Math.floor(Math.random()*randomMultiple)+'</div>');
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
                },25000,'linear');
            });


            $('#questions').prepend(div);

            set.push(setInterval(function(){
                let divs = $('.a:last');
                if(divs.position() && (divs.position().top + parseInt(divs.css('height'))*1.3)  >= $('input').position().top){
                    clearInterval(int)
                    $('.a').stop(true,false)
                    $('input').prop('disabled', true);
                    set.forEach((v)=>{
                        clearInterval(v);
                    })
                    if(count >= 40){
                        showAlert('Շնորհավորում ենք, Դուք հաղթահարեցիք երրորդ փուլը: <br> Դուք հավաքել եք '+count+' միավոր');
                        stages.eq(3).data('gameName','ballons');
                    }else{
                        showAlert('Ձեզ պակասում է \'+ 40 - count +\' միավոր հաջորդ փուլ անցնելու համար: Փորձեք նորից:');
                    }
                }
            },150))

        }
    }
})();