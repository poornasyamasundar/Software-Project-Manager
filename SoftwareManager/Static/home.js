var slideIndex = 1;
function plusSlides(n) {
	showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}

function showSlides(n) 
{
	var i;
	slides = document.getElementsByClassName("mySlides");
	var dots = document.getElementsByClassName("dot");
	if (n > slides.length) 
	{
		slideIndex = 1;
	}    
	if (n < 1) 
	{
		slideIndex = slides.length;
	}
	for (i = 0; i < slides.length; i++) 
	{
		slides[i].style.display = "none";  
	}
	for (i = 0; i < dots.length; i++) 
	{
		dots[i].className = dots[i].className.replace(" active", "");
	}
	slides[slideIndex-1].style.display = "block";  
	dots[slideIndex-1].className += " active";
}
document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#projectlist').querySelector('ul').querySelector('li').querySelector('.viewbutton').querySelector('button').value = 'Software Developer';
		if( localStorage.getItem('Username') != null )
		{
			document.querySelector('#signin').remove();
		}
		else
		{
			document.querySelector('#signinbutton').onclick = () =>
			{
				window.location = '/login';
			}
		}

		document.querySelector('#newProject').onclick = () =>
		{
			window.location = '/newProject';
		}

		projectlist = document.querySelector('#projectlist').querySelector('ul').querySelectorAll('li')
		for( var i = 0 ; i < projectlist.length ; i++ )
		{
			projectlist[i].querySelector('.viewbutton').querySelector('button').onclick = (e) =>
			{
				localStorage.setItem('Project', e.target.value);
				window.location = '/Project';
			}
		}
		showSlides(slideIndex);
	});
