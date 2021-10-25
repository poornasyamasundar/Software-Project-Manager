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
		let nameValid = hasValue(form.elements["name"], NAME_REQUIRED);
		let emailValid = validateEmail(form.elements["email"], EMAIL_REQUIRED, EMAIL_INVALID);
		// if valid, submit the form.
		if (nameValid && emailValid) {
			alert("Demo only. No form was posted.");
		}
	});
