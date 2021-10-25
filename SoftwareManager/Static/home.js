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

function insertProjects(result)
{
	console.log(result);
	var str = '';
	for( i = 0 ; i < result.length ; i++ )
	{
		str += "<li class = 'projects'><img src = '/static/projectThemes/img1.png' ><h1>"+result[i].projectName+"</h1>";
		str += "<p class = 'description'>"+result[i].description+"</p>";
		str += "<p class = 'viewbutton'><button value = "+result[i].projectName+">View Project</button></p></li>";
	}
	console.log(str);
	document.querySelector('#projectlist').querySelector('ul').innerHTML = str;
	projectlist = document.querySelector('#projectlist').querySelector('ul').querySelectorAll('li')
	for( var i = 0 ; i < projectlist.length ; i++ )
	{
		projectlist[i].querySelector('.viewbutton').querySelector('button').onclick = (e) =>
		{
			localStorage.setItem('Project', e.target.value);
			for( i = 0 ; i < result.length ; i++ )
			{
				if( result[i].projectName == e.target.value)
				{
					localStorage.setItem('description', result[i].description);
					localStorage.setItem('currentScrum', result[i].currentScrum);
					localStorage.setItem('currentSprint', result[i].currentSprint);
					localStorage.setItem('createdOn', result[i].createdOn);
				}
			}
			window.location = '/Project';
		}
	}
}

function getProjects()
{
	$.ajax(
		{
			type: "POST",
			url: 'getProjectsPy',
			data:{
				username: localStorage.getItem('Username'),
				mode: 0,
			},
			success: function(data)
			{
				result = JSON.parse(data);
				console.log(result);
				insertProjects(result);
			}
		}
	)
}

function loadComments()
{
	$.ajax(
		{
			type: 'POST',
			url: 'to_getCommentsPy',
			data:
			{
				number: 5,
			},
			success: function(data)
			{
				result = JSON.parse(data);
				console.log(result);
				var str = '';
				for( i = 0 ; i < result.length ; i++ )
				{
					str += "<li><div><h6>";
					str += result[i].createdBy+" " + result[i].createdOn + "</h6>";
					str += "<h6>Rating: "+result[i].rating+"</h6>";
					str += "<p>"+result[i].feedback+"</p></div></li>";
				}
				document.querySelector('#comments').querySelector('ul').innerHTML = str;
			}
		}
	)
}

document.addEventListener('DOMContentLoaded', function() 
	{
		if( localStorage.getItem('Username') != null )
		{
			document.querySelector('#signin').remove();
			getProjects();
		}
		else
		{
			document.querySelector('#signinbutton').onclick = () =>
			{
				window.location = '/login';
			}
		}
		loadComments();

		document.querySelector('#newProject').onclick = () =>
		{
			window.location = '/newProject';
		}

		document.querySelector('.fab-options').querySelector('li').onclick = () =>
		{
			window.location = '/Feedback';
		}

		showSlides(slideIndex);
	});
