$(function(){
	$('#last-number').change(function(){
		$('.form-control:not(#last-number)').prop('max',this.value)
	});
});

function generateRandomNumber() {    
    first_number = $('#first-number').val();
    last_number = $('#last-number').val();
    guess_number = $('#guess-number').val();
    console.log(guess_number);
    rand_number = Math.floor((Math.random() * (+last_number + 1 - +first_number)) + +first_number);
    if(guess_number == rand_number) {
        extra_word = ' dan tebakan anda benar';
    } else if(guess_number == 0) {
        extra_word = '';
    } else {
        extra_word = ' dan tebakan anda salah'
    }
 
    if (!liff.isInClient()) {
        alert('Guest, nomer random anda ' + rand_number + extra_word);
    } else {
        liff.sendMessages([{
            'type': 'text',
            'text': "Guest, nomer random anda " + rand_number + extra_word
        }]).then(function() {
            alert('Guest, nomer random anda '  + rand_number + extra_word);
        }).catch(function(error) {
            alert('Error');
        });
    }

    return false;
}