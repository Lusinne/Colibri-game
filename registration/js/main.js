$(document).ready(function() {
    let errors = {};
    $('#phone').keydown(function(e){
        var reg = /\d$/;
        if(!reg.test(e.key) || $(this).val().length >8){
            if(e.which !== 8){
                e.preventDefault()
            }
        }
        var valid = ['91','93','94','95','96','97','98','99','41','43','44','55','77'];
        var val = $(this).val();
        if(val.length === 2 && e.which !== 8){
            if(valid.includes(val) ){
                $(this).val(val + ' ');
                $('#phoneError').text('');
            }else{
                e.preventDefault();
                $('#phoneError').text('Հեռախոսահամարի սխալ ձևաչափ');
            }
        }
    });
    let loginTag = $('#login');
    let emailTag = $('#email');
    let err = $('#loginError');
    let emailErr = $('#emailError');
    let emailNorm = $('#emailNorm');
    loginTag.keydown(function(e){
        let reg = /^\w$/;
        err.text('');
        let allow = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'ArrowDown', 'ArrowUp', 'Control'];
        if(!reg.test(e.key) && !allow.includes(e.key)) {
            e.preventDefault();
            err.text('Ոչ թույլատրելի սիմվոլ։ Թույլատրելի սիմվոլների ցանկ՝ a-z A-Z 0-9 _');
        }
    });
    loginTag.change(function(){
        let login = $(this).val().trim();
        if(login.length < 3) {
            err.text('Նվազագույն սիմվոլների քանակը ՝ 3');
            errors.loginCount = true;
            $('#norm').text('');
            return;
        }
        delete errors.loginCount;
        myAjax('checkLogin', '../checkReg.php',{
            login
        })
    });
    emailTag.change(function(){
        let reg = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;
        let email = $(this).val().trim();
        if(!reg.test(email)) {
            $('#norm').text('');
            emailErr.text('Էլ․ հասցեի ոչ թույլատրելի ձևաչափ');
            errors.emailReg = true;
            return;
        }
        delete errors.emailReg;
        myAjax('checkEmail', '../checkReg.php',{
            email
        })
    });
    function myAjax(action, url, data){
        $.ajax({
            url,
            method: 'POST',
            data: {
                action,...data
            }
        }).done((result)=>{
            console.log(action);
            let err = $('#loginError');
            let norm = $('#norm');
            if(action === 'checkLogin'){
                if(+result === 1) {
                    norm.text('');
                    err.text('Այս մուտքանունը ազատ չէ');
                    errors.reservedLogin = true;
                }
                else {
                    err.text('');
                    norm.text('Հասանելի մուտքանուն');
                    delete errors.reservedLogin
                }
            }
            else if(action === 'checkEmail'){
                if(+result === 1){
                    emailNorm.text('');
                    emailErr.text('Այս Էլ․ հասցեն արդեն օգտագործվում է');
                    errors.reservedEmail = true;
                }
                else{
                    delete errors.reservedEmail;
                    emailNorm.text('Ազատ Էլ․ հասցե');
                    emailErr.text('');
                }
            }
        })
    }
    $('#reset').click(function(){
        $('#retype').val('');
    });
    $('#submit').click(function(e){
       if(Object.keys(errors).length) e.preventDefault();
    })
});
