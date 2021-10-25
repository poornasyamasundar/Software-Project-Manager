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



	// function showMessage(input, message, type) {
	// 	const msg = input.parentNode.querySelector("small");
	// 	msg.innerText = message;
	// 	input.className = type ? "login success" : "login error";
	// 	return type;
	// }
	
	// function showError(input, message) {
	// 	return showMessage(input, message, false);
	// }
	
	// function showSuccess(input) {
	// 	return showMessage(input, "", true);
	// }
	
	// function hasValue(input, message) {
	// 	if (input.value.trim() === "") {
	// 		return showError(input, message);
	// 	}
	// 	return showSuccess(input);
	// }


	// const form = document.querySelector("#signup");


	// const PASSWORD_REQUIRED = "Please enter your password";
	// const EMAIL_REQUIRED = "Please enter your email";
	// form.addEventListener("submit", function (event) {
	// 	event.preventDefault();
	
	// 	let emailValid = validateEmail(form.elements["email"], EMAIL_REQUIRED, EMAIL_INVALID);
	// 	let passwordValid = hasValue(form.elements["password"], PASSWORD_REQUIRED);

	// 	if (passwordValid && emailValid) {
	// 		alert("Demo only. No form was posted.");
	// 	}
	// });
