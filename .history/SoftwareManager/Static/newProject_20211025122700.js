document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.history.back()
		}
	});

	const form = document.querySelector("#new_project");

	form.addEventListener("submit", function (event) {
		let email_valid = Email_Valid(form.elements['email']);
		let password_valid = Password_Valid(form.elements['password']);
		
		
		form.querySelector('submit').onclick = () => {
			window.location = '';
		}
		
		
	});
