function handleScrumTasksAndMeets()
{
	scrumboxTasks = document.querySelector('#pretasks').querySelectorAll('li');
	for( i = 0 ; i < scrumboxTasks.length ; i++ )
	{
		scrumboxTasks[i].querySelector('form').style.display = 'none';
	}
	for( i = 0 ; i < scrumboxTasks.length ; i++ )
	{
		scrumboxTasks[i].querySelector('div').querySelector('#edit').onclick = (e) =>
		{
			var j = 0;
			for( j = 0 ; j < scrumboxTasks.length ; j++ )
			{
				if( scrumboxTasks[j].querySelector('div').querySelector('#edit') == e.target )
				{
					scrumboxTasks[j].querySelector('form').style.display = 'block';
					scrumboxTasks[j].querySelector('div').style.display = 'none';
				}
			}
		}
	}

	scrumboxmeets = document.querySelector('#premeets').querySelectorAll('li');
	for( i = 0 ; i < scrumboxmeets.length ; i++ )
	{
		scrumboxmeets[i].querySelector('form').style.display = 'none';
	}
	for( i = 0 ; i < scrumboxmeets.length ; i++ )
	{
		scrumboxmeets[i].querySelector('div').querySelector('#edit').onclick = (e) =>
		{
			var j = 0;
			for( j = 0 ; j < scrumboxmeets.length ; j++ )
			{
				if( scrumboxmeets[j].querySelector('div').querySelector('#edit') == e.target )
				{
					scrumboxmeets[j].querySelector('form').style.display = 'block';
					scrumboxmeets[j].querySelector('div').style.display = 'none';
				}
			}
		}
	}
}

function handleSprintTasks()
{
	sprintboxTasks = document.querySelector('#sprintTasks').querySelectorAll('li');
	for( i = 0 ; i < sprintboxTasks.length ; i++ )
	{
		sprintboxTasks[i].querySelector('form').style.display = 'none';
	}
	for( i = 0 ; i < sprintboxTasks.length ; i++ )
	{
		sprintboxTasks[i].querySelector('div').querySelector('#edit').onclick = (e) =>
		{
			var j = 0;
			for( j = 0 ; j < sprintboxTasks.length ; j++ )
			{
				if( sprintboxTasks[j].querySelector('div').querySelector('#edit') == e.target )
				{
					sprintboxTasks[j].querySelector('form').style.display = 'block';
					sprintboxTasks[j].querySelector('div').style.display = 'none';
				}
			}
		}
	}
}
function handleBacklogTasks()
{
	tasks = document.querySelector('#backlogsbox').querySelector('ul').querySelectorAll('li');
	for( i = 0 ; i < tasks.length ; i++ )
	{
		if( tasks[i].querySelector('form') != null )
		{
			tasks[i].querySelector('form').style.display = 'none';
		}
	}
	for( i = 0 ; i < tasks.length ; i++ )
	{
		if( tasks[i].querySelector('div') != null )
		{
			tasks[i].querySelector('div').querySelector('#edit').onclick = (e) =>
			{
				var j = 0;
				for( j = 0 ; j < tasks.length ; j++ )
				{
					if( tasks[j].querySelector('div') != null )
					{
						if( tasks[j].querySelector('div').querySelector('#edit') == e.target )
						{
							tasks[j].querySelector('form').style.display = 'block';
							tasks[j].querySelector('div').style.display = 'none';
						}
					}
				}
			}
		}
	}
}
function to_getTasks(table_name, number, type_)
{
	//	console.log($('input[name=csrfmiddlewaretoken').val());
	var result;
	$.ajax(
		{
			type: "POST",
			url: "to_getTasksPy",
			data: {
				table_name: table_name,
				number: number,
				type_: 0,
				//csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken').val(),
				//csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken').val()
			},
			success: function(data){
				//console.log(data);
				result = JSON.parse(data);
				console.log(result);
			}
		}
	)
}

function reloadNoticeTasks()
{
	document.querySelector('#duetasks').querySelector('ul').innerHTML = '';
	let result;
	to_getTasks('tasks', 5, 0);
	/*
	to_getTasks('tasks', 5, 0).then( function(value) {
		console.log(value)});
		*/
}

document.addEventListener('DOMContentLoaded', function() 
	{
		var meets = document.querySelector('#upcomingmeets').querySelector('ul').querySelectorAll('li');
		var i;

		for( i = 0 ; i < meets.length ; i++ )
		{
			meets[i].querySelector('div').querySelector('button').addEventListener('click', function() {
				this.classList.toggle('mactive');
				var content = this.nextElementSibling;
				if( content.style.maxHeight )
				{
					content.style.maxHeight = null;
				}
				else
				{
					content.style.maxHeight = content.scrollHeight + 'px';
				}
			});
		}
		var tasks = document.querySelector('#duetasks').querySelector('ul').querySelectorAll('li');

		for( i = 0 ; i < tasks.length ; i++ )
		{
			tasks[i].querySelector('div').querySelector('button').addEventListener('click', function() {
				this.classList.toggle('tactive');
				var content = this.nextElementSibling;
				if( content.style.maxHeight )
				{
					content.style.maxHeight = null;
				}
				else
				{
					content.style.maxHeight = content.scrollHeight + 'px';
				}
			});
		}
		create = document.querySelectorAll('.create');
		for( i = 0 ; i < create.length ; i++ )
		{
			create[i].addEventListener('click', function() {
				this.classList.toggle('createactive');
				var content = this.nextElementSibling;
				if( content.style.maxHeight )
				{
					content.style.maxHeight = null;
					content.style.padding = '0px';
				}
				else
				{
					content.style.maxHeight = content.scrollHeight + 'px';
					content.style.padding = '5px';
				}
			});
		}
		options = document.querySelector('#options').querySelectorAll('button');
		display = document.querySelector('#display').children;

		for( i = 0 ; i < 7 ; i++ )
		{
			display[i].style.display = 'none';
		}
		display[0].style.display = 'block';

		for( i = 0 ; i < 7 ; i++ )
		{
			options[i].onclick = (e) =>
			{
				for( j = 0 ; j < display.length ; j++ )
				{
					display[j].style.display = 'none';
				}
				for( j = 0 ; j < display.length ; j++ )
				{
					if( e.target == options[j] )
					{
						display[j].style.display = 'block';
					}
				}
			}
		}
		handleScrumTasksAndMeets();
		handleSprintTasks();
		handleBacklogTasks();
		reloadNoticeTasks();
		document.querySelector('#gobackbutton').onclick = () =>
		{
			window.location = '/';
		}
		document.querySelector('#projectname').innerHTML = localStorage.getItem('Project');
	});
