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


	const form = document.querySelector("#signup");

	form.addEventListener("submit", function (event) {
		event.preventDefault();

		var email = form.elements['email'];
		var password = form.elements['password'];

		$.ajax(
			{
				type: "POST",
				url: "isTrueCredentials",
				data: {
					user_name: email,
					user_password: password,
				},
				success: function(data){
					if(data == True){
						window.location = '';
					}
					else{
						alert("Login Credentials wrong! Please try again");
						window.location = '';
					}
				}
			}
		)
		
	});