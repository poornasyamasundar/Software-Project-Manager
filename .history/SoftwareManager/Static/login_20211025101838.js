document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.history.back()
		}
		document.querySelector('.reghere').onclick = () =>
		{
			window.location = '/register';
		}
	});


	function Email_Valid(input){
		
	}

	function Password_Valid(input){

	}
	const form = document.querySelector("#signup");

	form.addEventListener("submit", function (event) {
		let email_valid = Email_Valid(form.elements['email']);
		let password_valid = Password_Valid(form.elements['password']);
		if(email_valid && password_valid){
			form.querySelector('submit').onclick = () => {
				window.location = '';
			}
		}
		
	});
