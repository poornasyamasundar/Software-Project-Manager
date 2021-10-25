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


	// function Email_Valid(input){

	// }

	// function Password_Valid(input){

	// }
	const form = document.querySelector("#signup");

	form.addEventListener("submit", function (event) {
		event.preventDefault();

		let email = form.elements['email'];
		let password = form.elements['password'];

		$.ajax(
			{
				type: "POST",
				url: "isTrueCredentials",
				data: {
					user_name: email,
					user_password: password,
				},
				success: function(data){
					//console.log(data);
					window.location = '';
				}
			}
		)

		// e.Validate();
		// 		window.location = '';

		
		
		// if(email_valid && password_valid){
		// 	form.querySelector('submit').onclick = (e) => {
		// 		e.Validate();
		// 		window.location = '';
		// 	}
		// }
		
	});
