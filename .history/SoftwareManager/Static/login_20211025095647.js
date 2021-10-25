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
		// stop form submission
		event.preventDefault();
	
		// validate the form
		let emailValid = validateEmail(form.elements["email"], EMAIL_REQUIRED, EMAIL_INVALID);
		let passwordValid = hasValue(form.elements["password"], PASSWORD_REQUIRED);
		// if valid, submit the form.
		if (nameValid && emailValid) {
			alert("Demo only. No form was posted.");
		}
	});
