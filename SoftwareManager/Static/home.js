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
function getAllProjects( callback )
{
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');
	$.ajax(
		{
			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend,
			data:
				{
					state: 'all',
				},
			success: function(response)
			{
				list = [];
				for( i = 0 ; i < response.length ; i++ )
				{
					list.push({ name: response[i].name, projectURL: response[i].url, columnsURL: response[i].columns_url, time: response[i].created_at});
				}
				callback(list);
			}
		}
	)
}
function beforeSend(xhr)
{
	xhr.setRequestHeader("Authorization", "token "+localStorage.getItem('token'));
}

function getAllColumns( url, callback )
{
	$.ajax(
		{
			type: 'GET',
			url: url,
			beforeSend: beforeSend,
			success: function(response)
			{
				list = [];
				for( i = 0 ; i < response.length ; i++ )
				{
					list.push({name:response[i].name, columnURL: response[i].url, cardsURL: response[i].cards_url, time: response[i].created_at});
				}
				console.log(list);
				callback(list);
			}
		}
	)
}

function setSpiral()
{
	getAllProjects(function(list1)
			{
				for( var i = 0 ; i < list1.length ; i++ )
				{
					if( list1[i].name == 'Notices' )
					{
						getAllColumns(list1[i].columnsURL, function(list2)
							{
								for( var j = 0 ; j < list2.length ; j++ )
								{
									if(list2[j].name == 'Notices')
									{
										localStorage.setItem('NoticeDetails', JSON.stringify(list2[j]));
									}
									else if( list2[j].name == 'Meetings')
									{
										localStorage.setItem('MeetingsDetails', JSON.stringify(list2[j]));
									}
								}
								console.log("Hello");
								window.location = "/Spiral";
							});
					}
				}
			});
}
function setValues(selection)
{
	console.log("selection = " , selection);
	if( selection == 0 )
	{
		getAllProjects(function(list1)
			{
				for( var i = 0 ; i < list1.length ; i++ )
				{
					if( list1[i].name == 'Notices' )
					{
						getAllColumns(list1[i].columnsURL, function(list2)
							{
								for( var j = 0 ; j < list2.length ; j++ )
								{
									if(list2[j].name == 'Notices')
									{
										localStorage.setItem('NoticeDetails', JSON.stringify(list2[j]));
										setValues(1);
									}
								}
							});
					}
				}
			});
	}
	else if(selection == 1 )
	{
		b = false;
		if( parseInt(localStorage.getItem('currentScrum')) != 0 )
		{
			getAllProjects(function(list1)
				{
					for( var i = 0 ; i < list1.length ; i++ )
					{
						if(list1[i].name == 'Scrum-'+parseInt(localStorage.getItem('currentScrum')).toString())
						{
							getAllColumns(list1[i].columnsURL, function(list2)
								{
									for( var j = 0 ; j < list2.length ; j++ )
									{
										if(list2[j].name == 'Tasks')
										{
											console.log("tasks found");
											localStorage.setItem('CurrentScrumTasksDetails', JSON.stringify(list2[j]));
											date = new Date(list2[j].time);
											localStorage.setItem('scrumstart', date.getTime());

										}
										if(list2[j].name == 'Meetings')
										{
											console.log("meets found");
											localStorage.setItem('CurrentScrumMeetsDetails', JSON.stringify(list2[j]));
										}
									}
									b = true;
									console.log("after currentScrumMeets details");
									setValues(2);
								});
						}
					}
				});
		}
		else
		{
			setValues(2);
		}
	}
	else if( selection == 2 )
	{
		if( parseInt(localStorage.getItem('currentSprint')) != 0 )
		{
			getAllProjects(function(list1)
				{
					for( var i = 0 ; i < list1.length ; i++ )
					{
						if(list1[i].name == 'Sprint-'+parseInt(localStorage.getItem('currentSprint')).toString())
						{
							getAllColumns(list1[i].columnsURL, function(list2)
								{
									for( var j = 0 ; j < list2.length ; j++ )
									{
										if(list2[j].name == 'Tasks')
										{
											localStorage.setItem('CurrentSprintTasksDetails', JSON.stringify(list2[j]));
											date = new Date(list2[j].time);
											localStorage.setItem('sprintstart', date.getTime());
											window.location = "/Project";
											console.log("Hello");
										}
									}
								});
						}
					}
				});
		}
		else
		{
			console.log("Hello");
			window.location = "/Project";
		}
	}
}

function insertProjects(result)
{
	console.log(result);
	var str = '';
	for( i = 0 ; i < result.length ; i++ )
	{
		var obj = JSON.parse(result[i].description);
		str += "<li class = 'projects'><img src = '/static/projectThemes/img1.png' ><h1>"+result[i].projectName+"</h1>";
		str += "<p class = 'description'>"+obj.des+"</p>";
		str += "<p class = 'viewbutton'><button data-projectName = '"+result[i].projectName+"'>View Project</button></p></li>";
	}
	console.log(str);
	document.querySelector('#projectlist').querySelector('ul').innerHTML = str;
	projectlist = document.querySelector('#projectlist').querySelector('ul').querySelectorAll('li')
	for( var i = 0 ; i < projectlist.length ; i++ )
	{
		projectlist[i].querySelector('.viewbutton').querySelector('button').onclick = (e) =>
		{
			console.log("Clicked");
			localStorage.setItem('Project', e.target.getAttribute('data-projectName'));
			for( i = 0 ; i < result.length ; i++ )
			{
				if( result[i].projectName == e.target.getAttribute("data-projectName"))
				{
					console.log(result);
					if( result[i].model == 'Agile Model' )
					{
						var obj = JSON.parse(result[i].description);
						localStorage.setItem('description', result[i].description);
						localStorage.setItem('currentScrum', result[i].currentScrum);
						localStorage.setItem('currentSprint', result[i].currentSprint);
						localStorage.setItem('createdOn', result[i].createdOn);
						localStorage.setItem('repoName', result[i].repolink);
						localStorage.setItem('contributors', JSON.stringify(obj.contributors));
						localStorage.setItem('model', result[i].model);
						setValues(0);
					}
					else if( result[i].model == 'Spiral Model' )
					{
						var obj = JSON.parse(result[i].description);
						localStorage.setItem('description', result[i].description);
						localStorage.setItem('createdOn', result[i].createdOn);
						localStorage.setItem('repoName', result[i].repolink);
						localStorage.setItem('contributors', JSON.stringify(obj.contributors));
						localStorage.setItem('model', result[i].model);
						setSpiral();
					}
				}
			}
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
		localStorage.removeItem('CurrentScrumMeetsDetails');
		localStorage.removeItem('currentScrum');
		localStorage.removeItem('currentSprint');
		localStorage.removeItem('repoName');
		localStorage.removeItem('createdOn');
		localStorage.removeItem('NoticeDetails');
		localStorage.removeItem('sprintstart');
		localStorage.removeItem('scrumstart');
		localStorage.removeItem('description');
		localStorage.removeItem('Project');
		localStorage.removeItem('CurrentScrumTasksDetails');
		localStorage.removeItem('CurrentSprintTasksDetails');
		localStorage.removeItem('contributors');
		localStorage.removeItem('model');
		localStorage.removeItem('MeetingsDetails');

		if( localStorage.getItem('Username') != null )
		{
			document.querySelector('#signinbutton').innerHTML = 'Sign out';
			document.querySelector('#profilebutton').onclick = () =>
			{
				console.log("Clicked profile");
				window.location = '/Profile';
			}
			document.querySelector('#signinbutton').onclick = () =>
			{
				localStorage.clear();
				window.location = '';
			}
			getProjects();
		}
		else
		{
			document.querySelector('#profilebutton').style.display = 'none';
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
