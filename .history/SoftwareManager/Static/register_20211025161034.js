document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.history.back()
		}
	});

	const form = document.querySelector("#register");

	form.addEventListener("submit", function (event) {
		event.preventDefault();

		var email = form.elements['email'];
		var password = form.elements['password'];
		var retypepassword = form.elements['retype-password'];
		if(password == retypepassword){
			$.ajax(
				{
					type: "POST",
					url: "insertUser",
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
		}
		else{
			alert("Password do not match! Please try again");
			window.location = '';
		}
		
	});