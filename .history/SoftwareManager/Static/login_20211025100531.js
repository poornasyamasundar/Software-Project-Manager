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
		form.querySelector('submit').onclick = () => {
			window.location = '';
		}
	});
