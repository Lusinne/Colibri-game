$(document).ready(function(){
    $('#one').click(function(e){
        let section = $('<section id="firstGame"></section>');
        let close = $('<button id="close">X</button>')
        section.append(close);
        $(document.body).append(section);
        section.animate({
            width: '+=90%',
            height: '+=90vh',
            display: 'block',
            top: '3vh',
            left: '5%'
        },1000);

        $('#close').on('click',function(ev){
            if(!confirm('Vstah es?')) return;
            this.remove()
            section && section.animate({
                width: '-=80%',
                height: '-=80vh',
                top: '50%',
                left: '50%'
            },1000,()=>{
                section.animate({
                    top: '0',
                    left: '100%',
                    width: '-=10%',
                    height: '-=10vh',
                    display: 'none',
                }, 1000 , ()=>{
                    section.remove();
                    $('#close').off('click')
                    
                })

            })
        })
    })
})

