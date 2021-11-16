function print(tasksDone, typeCount)
{
	console.log(tasksDone, typeCount);
	console.log(tasksDone/typeCount);
	return tasksDone/typeCount;
}

function avgTasksHelper(list, counter, tasksDone, type, sprints, scrums)
{
	if(counter == list.length)
	{
		print(tasksDone, list.length)
		if(type == 'sprint')
		{
			console.log('avgTasksCompleted for scrum');
			avgTasksCompleted('scrum', sprints, scrums); 
		}
		else
		{
			console.log('printing time left for each sprint');
			timeLeftHelper('sprint', sprints, scrums, 0);
		}
	}
	else 
	{
		$.ajax(

			{

				type: 'GET',
				url: list[counter],
				beforeSend: beforeSend, 

				success: function(response)
				{
					//console.log(response)
					$.ajax(

						{

							type: 'GET',
							url: response[0].cards_url,
							beforeSend: beforeSend, 
							data:
							{
								archived_state: 'archived',
							},
							success: function(response)
							{
								avgTasksHelper(list, counter+1, tasksDone+response.length, type, sprints, scrums)
							}
						}

					)
				}
			}

		)
	}
}

function avgTasksCompleted(type, sprints, scrums)
{
	username = 'poornasyamasundar';
	repoName = 'git_demo';

	$.ajax(

		{

			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend, 

			success: function(response)
			{
				list = []
				for(i=0 ; i<response.length ; i++)
				{

					model = response[i].name.slice(0, type.length).toLowerCase();
					//console.log(model)
					if(model != type)
						continue;

					list.push(response[i].columns_url); 

				}

				avgTasksHelper(list, 0, 0, type, sprints, scrums);
			}
		}

	)
}



function productivityHelper2(list, url, counter, tasksDone, meetings)
{

	$.ajax(

		{

			type: 'GET',
			url: url,
			beforeSend: beforeSend, 

			success: function(response)
			{

				productivityHelper(list, counter+1, tasksDone, meetings+response.length, sprints, scrums)
			}
		}

	)

}

function productivityHelper(list, counter, tasksDone, meetings, sprints, scrums)
{
	if(counter == list.length)
	{
		print(tasksDone, meetings)
		console.log('avgTasksCompleted for sprint');
		avgTasksCompleted('sprint', sprints, scrums);
	}
	else 
	{
		$.ajax(

			{

				type: 'GET',
				url: list[counter],
				beforeSend: beforeSend, 

				success: function(response)
				{
					//console.log(response)
					$.ajax(

						{

							type: 'GET',
							url: response[0].cards_url,
							beforeSend: beforeSend, 
							data:
							{
								archived_state: 'archived',
							},
							success: function(response_)
							{

								productivityHelper2(list, response[1].cards_url, counter, tasksDone+response_.length, meetings, sprints, scrums)
							}
						}

					)
				}
			}

		)
	}
}

function productivity(sprints, scrums)
{
	username = 'poornasyamasundar';
	repoName = 'git_demo';

	$.ajax(

		{

			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend, 

			success: function(response)
			{
				list = []
				for(i=0 ; i<response.length ; i++)
				{

					model = response[i].name.slice(0, 5).toLowerCase();
					//console.log(model)
					if(model != 'scrum')
						continue;

					list.push(response[i].columns_url); 

				}

				productivityHelper(list, 0, 0, 0, sprints, scrums);
			}
		}

	)
}

function avgCardsHelper(list, counter, avg, type, sprints, scrums)
{
	if(counter == list.length)
	{
		print(avg, list.length)
		if(type == 'sprint')
		{
			console.log('avgCards for scrums');
			avgCards('scrum', sprints, scrums);
		}
		else if(type == 'scrum')
		{
			console.log("productivity");
			productivity(sprints, scrums);
		}
	}
	else 
	{
		$.ajax(

			{

				type: 'GET',
				url: list[counter],
				beforeSend: beforeSend, 

				success: function(response)
				{
					//console.log(response)
					$.ajax(

						{

							type: 'GET',
							url: response[0].cards_url,
							beforeSend: beforeSend, 
							data:
							{
								archived_state: 'all',
							},
							success: function(response)
							{
								done=0;
								for(i=0 ; i<response.length ; i++)
								{
									if(response[i].archived)
										done++;
								}
								total = response.length;
								if(done==0)
									total++;
								avgCardsHelper(list, counter+1, avg+(done/total), type, sprints, scrums)
							}
						}

					)
				}
			}

		)
	}
}

function avgCards(type, sprint, scrums)
{
	username = 'poornasyamasundar';
	repoName = 'git_demo';

	$.ajax(

		{

			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend, 

			success: function(response)
			{
				//console.log(response.length)
				list = []
				for(i=0 ; i<response.length ; i++)
				{

					model = response[i].name.slice(0, type.length).toLowerCase();
					//console.log(model)
					if(model != type)
						continue;

					list.push(response[i].columns_url); 

				}
				avgCardsHelper(list, 0, 0, type, sprints, scrums);
			}
		}

	)
}

function timeLeftHelper(type, sprints, scrums, idx)
{
	if(type == 'sprint')
	{
		if(idx == sprints.length)
		{
			console.log('printing time left for each scrum');
			timeLeftHelper('scrum', sprints, scrums, 0);
		}
		else
		{
			timeLeft(sprints[idx].url, "", 'sprint');
			timeLeftHelper('sprint', sprints, scrums, idx+1); 
		}
	}
	else
	{
		if(idx == scrums.length)
		{
			return;
		}
		else
		{
			timeLeft(scrums[idx].url, "", 'scrum');
			timeLeftHelper('scrum', sprints, scrums, idx+1); 
		}
	}
}

function timeLeft(url, callback, type)
{
	username = 'poornasyamasundar';
	repoName = 'git_demo';

	$.ajax(

		{

			type: 'GET',
			url: url,
			beforeSend: beforeSend, 

			success: function(response)
			{
				createdTime = response.created_at;
				console.log(response.name)

				if(type == 'sprint')
				{
					endTime=new Date(createdTime);
					endTime.setDate(endTime.getDate()+ 30);
				}
				else if(type == 'scrum')
				{
					endTime=new Date(createdTime);
					endTime.setDate(endTime.getDate()+ 2);
				}
				endTime = endTime.toISOString();
				console.log(createdTime, endTime)
			}
		}
	)
}


function sprintsInfo(sprints, scrums)
{
	username = 'poornasyamasundar';
	repoName = 'git_demo';

	$.ajax(

		{

			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend, 

			success: function(response)
			{
				//console.log(response)
				list = []
				for(i=0 ; i<response.length ; i++)
				{

					model = response[i].name.slice(0, 6).toLowerCase();
					//console.log(model)
					if(model != 'sprint')
						continue;

					createdTime = response[i].created_at;
					endTime=new Date(createdTime);
					endTime.setDate(endTime.getDate()+ 30);
					endTime = endTime.toISOString();

					list.push({name: response[i].name, createdTime: createdTime, endTime: endTime})

				}
				console.log("All sprints are = ");
				console.log(list)
				//return list;
				console.log('printing all tasks done for each scrum')
				scrumTasksDoneHelper(sprints, scrums, 0);
			}
		}

	)
}



function scrumTasksDone(sprints, scrums, url, idx)
{


	$.ajax(

		{
			type: 'GET',
			url: url,
			beforeSend: beforeSend,
			data: {
				archived_state: 'archived'
			},

			success: function(response)
			{
				//console.log(response);
				list = []

				for(i=0 ; i<response.length ; i++)
				{
					list.push({creater: response[i].creator['login'], name: response[i].note, created_at: response[i].created_at, closed_at: response[i].updated_at})
				}

				console.log(list)
				scrumTasksDoneHelper(sprints, scrums, idx+1);
			}

		}

	)
}

function scrumTasksDoneHelper(sprints, scrums, idx)
{

	if(idx == scrums.length)
	{
		console.log('avgCards for sprint');
		avgCards('sprint', sprints, scrums);

		return;
	}
	else 
	{
		console.log(scrums[idx].name);
		url = scrums[idx].columns_url; 

		$.ajax(

			{
				type: 'GET',
				url: url,
				beforeSend: beforeSend,

				success: function(response)
				{
					// getting the cards and picking the cards_url for tasks.
					//console.log(response);

					//console.log(list)
					scrumTasksDone(sprints, scrums, response[0].cards_url, idx);
				}

			}

		)
	}

}


function getScrums(endTime, callback, sprints, idx, scrums)
{
	username = 'poornasyamasundar';
	repoName = 'git_demo';

	$.ajax(

		{

			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend, 

			success: function(response)
			{
				//console.log(response)
				list = []
				for(i=0 ; i<response.length ; i++)
				{

					model = response[i].name.slice(0, 5).toLowerCase();
					//console.log(model)
					if(model != 'scrum')
						continue;

					createdTime = response[i].created_at;
					scrum_endTime=new Date(createdTime);
					scrum_endTime.setDate(scrum_endTime.getDate()+ 2);
					scrum_endTime = scrum_endTime.toISOString();

					//endTime = endTime.toISOString()
					//console.log(createdTime, endTime) 
					if(createdTime <= endTime)
						list.push({name: response[i].name, createdTime: createdTime, endTime: scrum_endTime})

				}
				console.log("Scrums under this sprint");
				console.log(list)
				callback(sprints, idx, scrums);
			}
		}

	)
}

function specificScrums(sprints, idx, scrums)
{
	if(idx == sprints.length)
	{
		console.log("Sprints completed");
		sprintsInfo(sprints, scrums)
		return;
	}

	url = sprints[idx].url;

	username = 'poornasyamasundar';
	repoName = 'git_demo';

	$.ajax(

		{

			type: 'GET',
			url: url,
			beforeSend: beforeSend, 

			success: function(response)
			{
				//console.log(response)

				createdTime = response.created_at;
				endTime=new Date(createdTime);
				endTime.setDate(endTime.getDate()+ 30);

				console.log("current sprint = ", sprints[idx].name);
				getScrums(endTime.toISOString(), specificScrums, sprints, idx+1, scrums)
			}
		}

	)
}

// collecting all scrums, sprints
// collecting scrums under each sprint
// getting sprints info
// under each scrum, getting all the tasks done
// printing avgCards for sprint
// printing avgCards for scrum
// productivity
// avgTasksCompleted for sprint
// avgTasksCompleted for scrum
// timeLeft for each sprint
// timeLeft for each scrum 

function getAll()
{
	username = 'poornasyamasundar';
	repoName = 'git_demo';
	$.ajax(
		{
			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend,
			success: function(response)
			{
				//console.log(response)
				sprints = []
				scrums = []
				for(i=0 ; i<response.length ; i++)
				{
					model = response[i].name.slice(0, 6).toLowerCase();
					model_ = response[i].name.slice(0, 5).toLowerCase();
					if(model != 'sprint' && model_ != 'scrum')
						continue;
					name = response[i].name;
					url = response[i].url;
					columns_url = response[i].columns_url;
					if(model == 'sprint')
						sprints.push({name: name, url: url, columns_url: columns_url})
					else scrums.push({name: name, url: url, columns_url: columns_url}) 
				}
				console.log("Sprints[] = ", sprints);
				console.log("Scrums[] = ", scrums);
				specificScrums(sprints, 0, scrums);
			}
		}
	)
}
//import {printf} from './sample.js';
//import {getAllProjects, getAllColumns,getAllCards, editCard, deleteCard, createProject, createColumn, createCard} from './gitHubApi.js'; 
//import {createScrum, createSprint, DisplayScrumTasks, DisplayScrumMeets, DisplaySprintTasks, editScrumMeet, deleteScrumMeet, saveScrumMeet, cancelScrumMeet, deleteScrumTask, saveScrumTask, cancelScrumTask} from './ScrumSprint.js'; 
/*function meetingFunction(table_name, type_, id, createdBy, meetingLink, createdOn, meetingDate, meetingTime, purpose)
{
	$.ajax(
		{
			type: "POST",
			url: "meetingFunctionPy",
			data: {
				table_name: table_name,
				type_: type_,
				id: id,
				createdBy: createdBy,
				meetingLink: meetingLink,
				createdOn: createdOn,
				meetingDate: meetingDate, 
				meetingTime: meetingTime,
				purpose: purpose,
			},
			success: function(data){
				console.log(data);
				reloadScrumMeetings();
				reloadNoticeMeets()
				document.querySelector('#createmeet').reset();
			}
		}
	)
}
function taskFunction(table_name, type_, id, createdBy, taskHeading, taskDetails, createdOn, completed, deadline)
{
	$.ajax(
		{
			type: "POST",
			url: "taskFunctionPy",
			data: {
				table_name: table_name,
				type_: type_,
				id: id, createdBy: createdBy, taskHeading: taskHeading, taskDetails: taskDetails,
				createdOn: createdOn,
				completed: completed,
				deadline: deadline
			},
			success: function(data){
				reloadNoticeTasks();
				reloadScrumTasks();
				reloadSprintTasks();
				document.querySelector('#createTask').querySelector('#taskname').value = '';
				document.querySelector('#createTask').querySelector('#taskDescription').value = '';
				document.querySelector('#sprintbox').querySelector('#createTask').querySelector('#taskname').value = '';
				document.querySelector('#sprintbox').querySelector('#createTask').querySelector('#taskDescription').value = '';
			}
		}
	)
}
function backlogFunction(table_name, mode, id, createdBy, dateposted, foldername, par, taskDetails, taskHeading, type )
{
	$.ajax(
		{
			type: 'POST',
			url: 'backlogFunctionPy',
			data:{
				table_name: table_name,
				mode: mode,
				id: id, 
				createdBy: createdBy,
				dateposted: dateposted,
				foldername: foldername,
				par: par,
				taskDetails: taskDetails,
				taskHeading: taskHeading,
				type: type,
			},
			success: function(data){
				reloadBacklogs(par);
				document.querySelector('.createBacklog').reset();
				document.querySelector('.createfolder').reset();
			}
		}
	)
}

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
		scrumboxTasks[i].querySelector('div').querySelector('#delete').onclick = (e) =>
		{
			var j = 0;
			for( j = 0 ; j < scrumboxTasks.length ; j++ )
			{
				if( scrumboxTasks[j].querySelector('div').querySelector('#delete') == e.target )
				{
					e.preventDefault();
					taskFunction(localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'tasks', 3, scrumboxTasks[j].id, localStorage.getItem('Username'), '', '','', 0, 0);
				}
			}
		}
		scrumboxTasks[i].querySelector('form').querySelector('#save').onclick = (e) =>
		{
			e.preventDefault();
			var j = 0;
			for( j = 0 ; j < scrumboxTasks.length ; j++ )
			{
				if( scrumboxTasks[j].querySelector('form').querySelector('#save') == e.target )
				{
					var b;
					if( scrumboxTasks[j].querySelector('#taskcompleted').checked == true )
					{
						b = 1;
					}
					else
					{
						b = 0;
					}
					taskFunction(localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'tasks', 2, scrumboxTasks[j].id, localStorage.getItem('Username'), scrumboxTasks[j].querySelector('#taskname').value, scrumboxTasks[j].querySelector('#taskDescription').value,'', b, 0);
				}
			}
		}
		scrumboxTasks[i].querySelector('form').querySelector('#cancel').onclick = (e) =>
		{
			e.preventDefault();
			var j = 0;
			for( j = 0 ; j < scrumboxTasks.length ; j++ )
			{
				if( scrumboxTasks[j].querySelector('form').querySelector('#cancel') == e.target )
				{
					scrumboxTasks[j].querySelector('form').reset();
					scrumboxTasks[j].querySelector('form').style.display = 'none';
					scrumboxTasks[j].querySelector('div').style.display = 'block';
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
		scrumboxmeets[i].querySelector('div').querySelector('#delete').onclick = (e) =>
		{
			var j = 0;
			for( j = 0 ; j < scrumboxmeets.length ; j++ )
			{
				if( scrumboxmeets[j].querySelector('div').querySelector('#delete') == e.target )
				{
					e.preventDefault();
					meetingFunction(localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'meets', 3, scrumboxmeets[j].id, '','', '', '', '','');
				}
			}
		}
		scrumboxmeets[i].querySelector('form').querySelector('#save').onclick = (e) =>
		{
			e.preventDefault();
			var j = 0;
			for( j = 0 ; j < scrumboxmeets.length ; j++ )
			{
				if( scrumboxmeets[j].querySelector('form').querySelector('#save') == e.target )
				{
					date = scrumboxmeets[j].querySelector('#meetingdate').value;
					date = date.substring(0, 4)+date.substring(5, 7)+date.substring(8, 10);
					meetingFunction(localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'meets', 2, scrumboxmeets[j].id, localStorage.getItem('Username'), scrumboxmeets[j].querySelector('#meetinglink').value, '', date, scrumboxmeets[j].querySelector('#meetingtime').value, scrumboxmeets[j].querySelector('#meetpurpose').value );
				}
			}
		}
		scrumboxmeets[i].querySelector('form').querySelector('#cancel').onclick = (e) =>
		{
			e.preventDefault();
			var j = 0;
			for( j = 0 ; j < scrumboxmeets.length ; j++ )
			{
				if( scrumboxmeets[j].querySelector('form').querySelector('#cancel') == e.target )
				{
					scrumboxmeets[j].querySelector('form').reset();
					scrumboxmeets[j].querySelector('form').style.display = 'none';
					scrumboxmeets[j].querySelector('div').style.display = 'block';
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
		sprintboxTasks[i].querySelector('div').querySelector('#delete').onclick = (e) =>
		{
			var j = 0;
			for( j = 0 ; j < sprintboxTasks.length ; j++ )
			{
				if( sprintboxTasks[j].querySelector('div').querySelector('#delete') == e.target )
				{
					e.preventDefault();
					taskFunction(localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'sprint', 3, sprintboxTasks[j].id, localStorage.getItem('Username'), '', '','', 0, 0);
				}
			}
		}
		sprintboxTasks[i].querySelector('form').querySelector('#save').onclick = (e) =>
		{
			e.preventDefault();
			var j = 0;
			for( j = 0 ; j < sprintboxTasks.length ; j++ )
			{
				if( sprintboxTasks[j].querySelector('form').querySelector('#save') == e.target )
				{
					var b;
					if( sprintboxTasks[j].querySelector('#taskcompleted').checked == true )
					{
						b = 1;
					}
					else
					{
						b = 0;
					}
					taskFunction(localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'sprint', 2, sprintboxTasks[j].id, localStorage.getItem('Username'), sprintboxTasks[j].querySelector('#taskname').value, sprintboxTasks[j].querySelector('#taskDescription').value,'', b, 0);
				}
			}
		}
		sprintboxTasks[i].querySelector('form').querySelector('#cancel').onclick = (e) =>
		{
			e.preventDefault();
			var j = 0;
			for( j = 0 ; j < sprintboxTasks.length ; j++ )
			{
				if( sprintboxTasks[j].querySelector('form').querySelector('#cancel') == e.target )
				{
					sprintboxTasks[j].querySelector('form').reset();
					sprintboxTasks[j].querySelector('form').style.display = 'none';
					sprintboxTasks[j].querySelector('div').style.display = 'block';
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
			tasks[i].querySelector('div').querySelector('#delete').onclick = (e) =>
			{
				var j = 0;
				for( j = 0 ; j < tasks.length ; j++ )
				{
					if( tasks[j].querySelector('div') != null )
					{
						if( tasks[j].querySelector('div').querySelector('#delete') == e.target )
						{
							e.preventDefault();
							backlogFunction('backlog', 1, tasks[j].id, '', 0, '', tasks[j].value, '', '', 3);
						}
					}
				}
			}
			tasks[i].querySelector('form').querySelector('#save').onclick = (e) =>
			{
				e.preventDefault();
				var j = 0;
				for( j = 0 ; j < tasks.length ; j++ )
				{
					if( tasks[j].querySelector('div') != null )
					{
						if( tasks[j].querySelector('form').querySelector('#save') == e.target )
						{
							backlogFunction('backlog', 1, tasks[j].id, localStorage.getItem('Username'), '',tasks[j].id, tasks[j].querySelector('#taskDescription'), tasks[j].querySelector('#taskname'), 2); 
						}
					}
				}
			}
			tasks[i].querySelector('form').querySelector('#cancel').onclick = (e) =>
			{
				e.preventDefault();
				var j = 0;
				for( j = 0 ; j < tasks.length ; j++ )
				{
					if( tasks[j].querySelector('div') != null )
					{
						if( tasks[j].querySelector('form').querySelector('#cancel') == e.target )
						{
							tasks[j].querySelector('form').reset();
							tasks[j].querySelector('form').style.display = 'none';
							tasks[j].querySelector('div').style.display = 'block';
						}
					}
				}
			}
		}
		else
		{
			tasks[i].querySelector('p').onclick = (e) =>
			{
				e.preventDefault();
				reloadBacklogs(document.querySelector('#backlogsbox').querySelector('p').innerHTML.substring(6) + '/' + e.target.innerHTML);
			}
		}
	}
}
*/
function handleMeetsNoticeViewing()
{
	var meets = document.querySelector('#upcomingmeets').querySelector('ul').querySelectorAll('li');
	var i;

	console.log(meets);
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
}

function handleTasksNoticeViewing()
{
	var i;
	var tasks = document.querySelector('#duetasks').querySelector('ul').querySelectorAll('li');
	console.log(tasks);

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
}

function handleNoticeViewing()
{
	var i;
	var tasks = document.querySelector('#latestcommits').querySelector('ul').querySelectorAll('li');
	console.log(tasks);

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
}

/*
function DisplayingMeetings(Objectarray)
{
	var str="";
	for( i = 0 ; i < Objectarray.length ; i++)
	{
		str+="<li><div><button class = 'mhead'>";
		date = Objectarray[i].meetingDate.toString();
		str+="Meeting on "+Objectarray[i].meetingTime+' '+date.substring(0, 4)+'-'+ date.substring(4, 6) + '-'+date.substring(6, 8)+"</button>";
		str+="<div><h5>";
		str+="Created on: "+Objectarray[i].createdOn;
		str+="</h5><h5>Created by: "+Objectarray[i].createdBy;
		str+="</h5>Link: <a href = ";
		str+=Objectarray[i].meetingLink+">";
		str+=Objectarray[i].meetingLink;
		str+="</a><br>";
		str+="Description: "+Objectarray[i].purpose;
		str+="</div></div></li>";
	}
	console.log(str);
	return str;
}

function DisplayingTasks(Objectarray)
{
	console.log(Objectarray);
	var str="";
	for( var i = 0 ; i <  Objectarray.length ; i++ )
	{
		str+="<li><div><button class = 'thead'>";
		str+=" "+Objectarray[i].taskHeading;
		str+="</button><div><h5>";
		str+="Created on "+Objectarray[i].createdOn+" ";
		str+="</h5><h5>Created By "+Objectarray[i].createdBy+" ";
		str+="</h5>";
		str+=Objectarray[i].taskDetails;
		str+="</div></div></li>";
	}
	console.log(str);
	return str;
}
function DisplayingTasksEdit(Objectarray)
{
	var str="";
	var i=1;
	for( j = 0 ; j < Objectarray.length ; j++ )
	{
		str+="<li id = '"+Objectarray[j].id+"'><div><h5>";
		str+=Objectarray[j].taskHeading+"</h5><h6>Status: ";
		if(Objectarray[j].completed=='1')
			str+="Done";
		else
			str+="Pending";
		str+="</h6><h6>Created by: "+Objectarray[j].createdBy+"</h6><h6>Created on: "+Objectarray[j].createdOn+"</h6>";
		str+="<p>Description:"+Objectarray[j].taskDetails+"</p>";
		str+="<button id = 'delete'>Delete Task</button><button id = 'edit'>Edit Task</button></div>";
		str+="<form class = 'edit' style ='display : none'><h4>Edit Tasks</h4><label for = 'taskname'>";
		str+="TaskTitle</label><input type = 'text' id = 'taskname' name = 'taskname' placeholder = 'Task Name' value = '"+Objectarray[j].taskHeading+"'>";
		str+="<label for = 'taskcompleted'>Task Completed or Not</label>";
		str+="<input type = 'checkbox' id = 'taskcompleted' ";
		if( Objectarray[j].completed == '1' )
		{
			str+="checked";
		}
		str+="><label for = 'taskDescription'>Description</label>";
		str+="<textarea type = 'text' id = 'taskDescription' name = 'taskDescription' placeholder = 'Describe the Task'>"+Objectarray[j].taskDetails+"</textarea>";
		str+="<button id = 'save' type= 'button'>Save</button><button id = 'cancel' type = 'button'>Cancel</button>"
		str+="</form></li>";
		i++;
	}
	console.log(str);
	return str;
}
function DisplayingMeetingsEdit(Objectarray)
{
	var str="";
	for(i = 0 ; i < Objectarray.length ; i++ )
	{
		str+="<li id = "+Objectarray[i].id+"><div><h5>";
		date = Objectarray[i].meetingDate.toString();
		str+="Meeting on "+Objectarray[i].meetingTime+' '+date.substring(0, 4)+'-'+ date.substring(4, 6) + '-'+date.substring(6, 8)+"</h5>";
		str+="<h5>Created on: "+Objectarray[i].createdOn;
		str+="</h5><h5>Created by: "+Objectarray[i].createdBy;
		str+="</h5>Link: <a href = ";
		str+=Objectarray[i].meetingLink+">";
		str+=Objectarray[i].meetingLink;
		str+="</a><br>";
		str+="Description: "+Objectarray[i].purpose;
		str+="<br><button id = 'delete'>Delete Meet</button><button id = 'edit'>Edit Meet</button></div>";
		str+="<form class = 'edit'>";
		str+=	"<h4>Edit Meeting</h4>";
		str+=	"<label for = 'meetingtopic'>Time</label>";
		str+=	"<input type = 'text' id = 'meetingtime' name = 'meetingtime' placeholder = 'Meeting Time' value = '"+Objectarray[i].meetingTime+"'>";
		str+=	"<label for = 'meetingdate'>Date</label>";
		str+= 	"<input type = 'text' id = 'meetingdate' name = 'meetingdate' placeholder = 'Meeting Date' value = '"+date.substring(0, 4)+'-'+ date.substring(4, 6) + '-'+date.substring(6, 8)+"'>";
		str+= 	"<label for = 'meetinglink'>Link</label>";
		str+= 	"<input type = 'text' id = 'meetinglink' name = 'meetinglink' placeholde = 'Link for the Meeting' value = '"+Objectarray[i].meetingLink+"'>";
		str+=	"<label for = 'meetpurpose'>Purpose</label>"
		str+= 	"<textarea type = 'text' id = 'meetpurpose' name = 'meetpurpose' placeholder = 'Describe the Purpose'>"+Objectarray[i].purpose+"</textarea>";
		str+=	"<button id = 'save' type= 'button'>Save</button><button id = 'cancel' type = 'button'>Cancel</button>"
		str+="</form></li>";
	}
	return str;
}

function Display_ProductBacklogs( Objectarray )
{
	var str = '';
	for( i = 0 ; i < Objectarray.length ; i++ )
	{
		if( Objectarray[i].type == '0' )
		{
			str += "<li id = "+Objectarray[i].id+ " value = "+Objectarray[i].parent+">";
			str += "<p class = 'folder'>"+Objectarray[i].foldername+"</p>";
			str += "</li>";
		}
		else
		{
			str+="<li id = '"+Objectarray[i].id+"' value = "+Objectarray[i].parent+"><div><h5>";
			str+=Objectarray[i].taskHeading+"</h5>";
			str+="<h6>Created by: "+Objectarray[i].createdBy+"</h6>";
			str+="<p>Description:"+Objectarray[i].taskDetails+"</p>";
			str+="<button id = 'delete'>Delete Task</button><button id = 'edit'>Edit Task</button></div>";
			str+="<form class = 'edit' style ='display : none'><h4>Edit Tasks</h4><label for = 'taskname'>";
			str+="TaskTitle</label><input type = 'text' id = 'taskname' name = 'taskname' placeholder = 'Task Name' value = '"+Objectarray[i].taskHeading+"'>";
			str+="<label for = 'taskDescription'>Description</label>";
			str+="<textarea type = 'text' id = 'taskDescription' name = 'taskDescription' placeholder = 'Describe the Task'>"+Objectarray[i].taskDetails+"</textarea>";
			str+="<button id = 'save' type= 'button'>Save</button><button id = 'cancel' type = 'button'>Cancel</button>"
			str+="</form></li>";
		}
	}
	return str;
}

function to_getTasks(n, table_name, number, type_)
{
	var result;
	$.ajax(
		{
			type: "POST",
			url: "to_getTasksPy",
			data: {
				table_name: table_name,
				number: number,
				type_: type_,
			},
			success: function(data){
				result = JSON.parse(data);
				console.log(result);
				if( n == 0 )
				{
					document.querySelector('#duetasks').querySelector('ul').innerHTML = DisplayingTasks(result);
					handleTasksNoticeViewing();
				}
				else if( n == 1 )
				{
					document.querySelector('#pretasks').innerHTML = DisplayingTasksEdit(result);
					handleScrumTasksAndMeets();
				}
				else if( n == 2 )
				{
					document.querySelector('#sprintTasks').innerHTML = DisplayingTasksEdit(result);
					handleSprintTasks();
				}
			}
		}
	)
}

function to_getMeets(n, table_name, number)
{
	var result;
	$.ajax(
		{
			type: "POST",
			url: "to_getMeetsPy",
			data: {
				table_name: table_name,
				number: number,
			},
			success: function(data){
				result = JSON.parse(data);
				console.log(result);
				if( n == 0 )
				{
					document.querySelector('#upcomingmeets').querySelector('ul').innerHTML = DisplayingMeetings(result);
					handleMeetsNoticeViewing();
				}
				else if( n == 1 )
				{
					document.querySelector('#premeets').innerHTML = DisplayingMeetingsEdit(result);
					handleScrumTasksAndMeets();
				}
			}
		}
	)
}

function to_getBacklogs(table_name, foldername)
{
	$.ajax(
		{
			type: 'POST',
			url: 'to_getBacklogsPy',
			data:
			{
				foldername: foldername,
				table_name: table_name,
			},
			success: function(data)
			{
				result = JSON.parse(data);
				console.log(result);
				console.log(Display_ProductBacklogs( result ));
				document.querySelector('#backlogsbox').querySelector('ul').innerHTML = Display_ProductBacklogs( result );
				handleBacklogTasks()
			}
		}
	)
}

function reloadBacklogs(foldername)
{
	document.querySelector('#backlogsbox').querySelector('p').innerHTML = 'Path :'+foldername;
	document.querySelector('#backlogsbox').querySelector('ul').innerHTML = '';
	to_getBacklogs('backlog', foldername);
	document.querySelector('.createBacklog').parent = foldername;
}

function reloadNoticeTasks()
{
	document.querySelector('#duetasks').querySelector('ul').innerHTML = '';
	to_getTasks(0,localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'tasks', 5, 1);
}

function reloadNoticeMeets()
{
	document.querySelector('#upcomingmeets').querySelector('ul').innerHTML = '';
	to_getMeets(0, localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'meets', 5);
}

function reloadScrumTasks()
{
	document.querySelector('#pretasks').innerHTML = '';
	to_getTasks(1,localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'tasks', -1, 0);
}

function reloadScrumMeetings()
{
	document.querySelector('#premeets').innerHTML = '';
	to_getMeets(1, localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'meets', 5);
}

function reloadSprintTasks()
{
	document.querySelector('#sprintTasks').innerHTML = '';
	to_getTasks(2,localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'sprint', -1, 0);
}*/

function modifyProjects(scrum, sprint, project)
{
	$.ajax(
		{
			type: "POST",
			url: 'getProjectsPy',
			data:{
				username: localStorage.getItem('Username'),
				currentScrum: scrum,
				currentSprint: sprint,
				projectName: project,
				description: '',
				mode: 1,
			},
			success: function(data)
			{
			}
		}
	)
}
function loadOverviewBox()
{
	var tas = document.querySelector('#overviewbox').querySelector('ul').querySelectorAll('li');
	tas[0].innerHTML = "<p class = 'id'>Name of the Project: </p><p class = 'value'>"+localStorage.getItem('Project')+"</p>";
	tas[1].innerHTML = "<p class = 'id'>GitHub UserName: </p><p class = 'value'>"+localStorage.getItem('gitUserName')+"</p>";
	tas[2].innerHTML = "<p class = 'id'>Repo Name: </p><p class = 'value'>"+localStorage.getItem('repoName')+"</p>";
	tas[3].innerHTML = "<p class = 'id'>RepositoryLink: </p><p class = 'value'><a href = 'https://github.com/"+localStorage.getItem('gitUserName')+"/"+localStorage.getItem('repoName')+"' target = '_blank' >"+"https://github.com/"+localStorage.getItem('gitUserName')+"/"+localStorage.getItem('repoName')+"</a></p>";
	tas[4].innerHTML = "<p class = 'id'>Model: </p><p class = 'value'>"+localStorage.getItem('model')+"</p>";
	tas[5].innerHTML = "<p class = 'id'>Created By: </p><p class = 'value'>"+localStorage.getItem('Username')+"</p>";
	tas[6].innerHTML = "<p class = 'id'>Created On: </p><p class = 'value'>"+localStorage.getItem('createdOn')+"</p>";
	tas[7].innerHTML = "<p class = 'id'>Description: </p><p class = 'value'>"+JSON.parse(localStorage.getItem('description')).des+"</p>";
	tas[8].innerHTML = "<p class = 'id'>Current Sprint: </p><p class = 'value'>"+localStorage.getItem('currentSprint')+"</p>";
	tas[9].innerHTML = "<p class = 'id'>Current Scrum: </p><p class = 'value'>"+localStorage.getItem('currentScrum')+"</p>";
}
function beforeSend(xhr)
{
	xhr.setRequestHeader("Authorization", "token "+localStorage.getItem('token'));
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
					list.push({ name: response[i].name, projectURL: response[i].url, columnsURL: response[i].columns_url});
				}
				console.log(response);
				console.log(list);
				callback(list);
			}
		}
	)
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
					list.push({name:response[i].name, columnURL: response[i].url, cardsURL: response[i].cards_url});
				}
				callback(list);
			}
		}
	)
}

function getCommits(callback)
{
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');
	$.ajax(

		{
			type: "GET",
			url: "https://api.github.com/repos/"+username +'/'+ repoName+'/commits',
			beforeSend: beforeSend, 
			data:
			{
				per_page: 10,
			},
			success: function(response)
			{
				list = []
				for(i=0 ; i<response.length ; i++)
				{
					obj = {author: response[i].commit.author.name, message: response[i].commit.message, date: response[i].commit.author.date}
					list.push(obj)
				}
				console.log(list)
				callback(list);
			}
		}

	)	
}

function getAllCards( url , callback )
{
	$.ajax(
		{
			type: 'GET',
			url: url,
			cache: false,
			beforeSend: beforeSend,
			data:{
				archived_state: 'all',
			},
			success: function(response)
			{
				var list = [];
				for( let i = 0 ; i < response.length ; i++ )
				{
					list.push({note: response[i].note, url: response[i].url, time: response[i].updated_at, creator: response[i].creator['login'], archived: response[i].archived});
				}
				callback(list);
			}
		}
	)
}

function editCard( url , note, archived, callback )
{
	console.log("entered editcard");
	$.ajax(
		{
			type: 'PATCH',
			url: url,
			beforeSend: beforeSend,
			data: JSON.stringify(
			{
				note: note,
				archived: archived,
			}),
			success: function(response)
			{
				console.log("Edited");
				console.log(response);
				callback(response);
			}
		}
		)
}

function deleteCard( url, callback )
{
	$.ajax(
		{
			type:'DELETE',
			url: url,
			beforeSend: beforeSend,
			success: function(response)
			{
				callback(response);
			}
		})
}

function createProject( name, callback )
{
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');
	console.log("gitUsername = ", username);
	console.log("repoName = ", repoName);
	$.ajax(
		{
			type: 'POST',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend, 
			data:
			JSON.stringify({
				name: name,
			}),
			success: function(response)
			{
				console.log("Created Project = ", name, " Successfully");
				console.log(response);
				obj = { name: response.name, columnsURL: response.columns_url, projectURL: response.url };
				callback(obj);
			}
		})
}

function createColumn( projectURL, name, callback )
{
	$.ajax(
		{
			type:'POST',
			url: projectURL+'/columns',
			beforeSend: beforeSend,
			data: JSON.stringify({
				name: name,
			}),
			success: function(response)
			{
				console.log("CreatedColumns = ",name, "  successfully");
				console.log(response);
				obj = { name: response.name, cardsURL: response.cards_url, columnURL: response.url , createdTime: response.created_at }
				callback(obj);
			}
		})
}

function createCard( columnURL, content, callback )
{
	$.ajax(
		{
			type:'POST',
			url: columnURL + '/cards',
			beforeSend: beforeSend,
			data: JSON.stringify({
				note: content,
			}),
			success: function(response)
			{
				console.log("Created a card");
				console.log(response)
				obj = {note: response.note, url: response.url, time: response.updated_at, creator: response.creator['login']};
				callback(obj);
			}
		})
}

function createScrum( name )
{
	console.log("Entered createScrum with name = ", name);
	createProject( name, function(projectObj) {
		createColumn( projectObj.projectURL, 'Tasks', function(tasksObj) {
			createColumn( projectObj.projectURL, 'Meetings', function(MeetsObj) {
				console.log(MeetsObj);
				localStorage.setItem('currentScrum', parseInt(localStorage.getItem('currentScrum'))+1);
				date = new Date(MeetsObj.createdTime);
				localStorage.setItem('scrumstart', date.getTime() + 172800000);
				modifyProjects(parseInt(localStorage.getItem('currentScrum'))+1, localStorage.getItem('currentSprint'), localStorage.getItem('Project'));
				localStorage.setItem('CurrentScrumTasksDetails', JSON.stringify(tasksObj));
				localStorage.setItem('CurrentScrumMeetsDetails', JSON.stringify(MeetsObj));
				window.location = '';
			} );
		});
	});
}

function createSprint( name )
{
	createProject( name, function(projectObj) {
		createColumn( projectObj.projectURL, 'Tasks', function(tasksObj) {
			localStorage.setItem('currentSprint', parseInt(localStorage.getItem('currentSprint'))+1);
			date = new Date(tasksObj.createdTime);
			localStorage.setItem('sprintstart', date.getTime() + 2592000000 );
			modifyProjects(parseInt(localStorage.getItem('currentScrum')), parseInt(localStorage.getItem('currentSprint'))+1, localStorage.getItem('Project'));
			localStorage.setItem('CurrentSprintTasksDetails', JSON.stringify(tasksObj));
			window.location = '';
		});
	});
}

function editScrumTask(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'none'; 
	c.querySelector('form').style.display = 'block';
}

function deleteScrumTask(event)
{
	var c = event.target.parentElement.parentElement;
	handleModal('Delete Task', "This cannot be undone, Are you sure you want to delete the task?" , function()
		{
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Task"); DisplayScrumTasks(); DisplaySprintTasks(); } );
		});
}

function saveScrumTask(event)
{
	var c = event.target.parentElement;
	var b;
	if( c.querySelector('#taskcompleted').checked == true )
	{
		b = true;
	}
	else
	{
		b = false;
	}
	editCard( c.parentElement.getAttribute('data-cardurl'), c.querySelector('#taskname').value+'\n'+c.querySelector('#taskDescription').value,b, function(obj){DisplayScrumTasks();DisplaySprintTasks();});
}


function cancelScrumTask(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'block'; 
	c.querySelector('form').style.display = 'none';
} 

function DisplayScrumTasks()
{
	getAllCards( JSON.parse(localStorage.getItem("CurrentScrumTasksDetails")).cardsURL, function(list)
		{
			document.querySelector('#pretasks').innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let taskname = '';
				let taskDescription = '';
				let k = 0;
				for( let i = 0 ; i <  list[j].note.length ; i++ )
				{
					if(list[j].note[i] == '\n')
					{
						k = 1;
					}
					else if( k == 0 )
					{
						taskname += list[j].note[i];
					}
					else if( k == 1 )
					{
						taskDescription += list[j].note[i];
					}
				}
				str +=	"<li data-cardurl = '"+list[j].url+"'>";
				str +=		"<div>";
				str +=			"<h5>" +taskname+"</h5>";
				str +=			"<h5>Status: ";
				if( list[j].archived == true )
					str += "Done";
				else
					str += "Pending";
				str +=			"</h5>";
				str +=			"<h5>Description:\n"+taskDescription+"</h5>";
				str +=			"<h6>Created by: "+list[j].creator+"</h6>";
				var date = new Date(list[j].time);
				str +=			"<h6>Last Modified: "+date+"</h6>";
				str +=			"<button id = 'delete' onclick = \"deleteScrumTask(event)\">Delete Task</button>";
				str += 			"<button id = 'edit' onclick = \"editScrumTask(event)\">Edit Task</button>";
				str += 		"</div>";
				str +=		"<form class = 'edit' style ='display : none'>";
				str +=			"<h4>Edit Tasks</h4>";
				str += 			"<label for = 'taskname'>TaskTitle</label>";
				str +=			"<input type = 'text' id = 'taskname' name = 'taskname' placeholder = 'Task Name' value = '"+taskname+"'>";
				str +=			"<label for = 'taskcompleted'>Task Completed or Not</label>";
				str +=			"<input type = 'checkbox' id = 'taskcompleted' ";
				if( list[j].archived == true )
				{
					str+="checked";
				}
				str +=			"><label for = 'taskDescription'>Description</label>";
				str +=			"<textarea type = 'text' id = 'taskDescription' name = 'taskDescription' placeholder = 'Describe the Task'>"+taskDescription+"</textarea>";
				str +=			"<button id = 'save' type= 'button' onclick = \"saveScrumTask(event)\">Save</button>";
				str +=			"<button id = 'cancel' type = 'button' onclick = \"cancelScrumTask(event)\">Cancel</button>"
				str +=		"</form>";
				str += 	"</li>";
			}
			document.querySelector('#pretasks').innerHTML = str;
		});
}

function DisplaySprintTasks()
{
	getAllCards( JSON.parse(localStorage.getItem("CurrentSprintTasksDetails")).cardsURL, function(list)
		{
			document.querySelector('#sprintTasks').innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let taskname = '';
				let taskDescription = '';
				let k = 0;
				for( let i = 0 ; i <  list[j].note.length ; i++ )
				{
					if(list[j].note[i] == '\n')
					{
						k = 1;
					}
					else if( k == 0 )
					{
						taskname += list[j].note[i];
					}
					else if( k == 1 )
					{
						taskDescription += list[j].note[i];
					}
				}
				str +=	"<li data-cardurl = '"+list[j].url+"'>";
				str +=		"<div>";
				str +=			"<h5>" +taskname+"</h5>";
				str +=			"<h5>Status: ";
				if( list[j].archived == true )
					str += "Done";
				else
					str += "Pending";
				str +=			"</h5>";
				str +=			"<h5>Description:\n"+taskDescription+"</h5>";
				str +=			"<h6>Created by: "+list[j].creator+"</h6>";
				var date = new Date(list[j].time);
				str +=			"<h6>Last Modified: "+date+"</h6>";
				str +=			"<button id = 'delete' onclick = \"deleteScrumTask(event)\">Delete Task</button>";
				str += 			"<button id = 'edit' onclick = \"editScrumTask(event)\">Edit Task</button>";
				str += 		"</div>";
				str +=		"<form class = 'edit' style ='display : none'>";
				str +=			"<h4>Edit Tasks</h4>";
				str += 			"<label for = 'taskname'>TaskTitle</label>";
				str +=			"<input type = 'text' id = 'taskname' name = 'taskname' placeholder = 'Task Name' value = '"+taskname+"'>";
				str +=			"<label for = 'taskcompleted'>Task Completed or Not</label>";
				str +=			"<input type = 'checkbox' id = 'taskcompleted' ";
				if( list[j].archived == true )
				{
					str+="checked";
				}
				str +=			"><label for = 'taskDescription'>Description</label>";
				str +=			"<textarea type = 'text' id = 'taskDescription' name = 'taskDescription' placeholder = 'Describe the Task'>"+taskDescription+"</textarea>";
				str +=			"<button id = 'save' type= 'button' onclick = \"saveScrumTask(event)\">Save</button>";
				str +=			"<button id = 'cancel' type = 'button' onclick = \"cancelScrumTask(event)\">Cancel</button>"
				str +=		"</form>";
				str += 	"</li>";
			}
			document.querySelector('#sprintTasks').innerHTML = str;
		});
}

function DisplayNotices()
{
	getAllCards( JSON.parse(localStorage.getItem("NoticeDetails")).cardsURL, function(list)
		{
			document.querySelector('#noticelist').innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let taskname = '';
				let taskDescription = '';
				let k = 0;
				for( let i = 0 ; i <  list[j].note.length ; i++ )
				{
					if(list[j].note[i] == '\n')
					{
						k = 1;
					}
					else if( k == 0 )
					{
						taskname += list[j].note[i];
					}
					else if( k == 1 )
					{
						taskDescription += list[j].note[i];
					}
				}
				str +=	"<li data-cardurl = '"+list[j].url+"'>";
				str +=		"<div>";
				str +=			"<h5>" +taskname+"</h5>";
				str +=			"<h5>Description:\n"+taskDescription+"</h5>";
				str +=			"<h6>Created by: "+list[j].creator+"</h6>";
				var date = new Date(list[j].time);
				str +=			"<h6>Last Modified: "+date+"</h6>";
				str +=			"<button id = 'delete' onclick = \"deleteNotice(event)\">Delete Notice</button>";
				str += 			"<button id = 'edit' onclick = \"editNotice(event)\">Edit Notice</button>";
				str += 		"</div>";
				str +=		"<form class = 'edit' style ='display : none'>";
				str +=			"<h4>Edit Notice</h4>";
				str += 			"<label for = 'taskname'>TaskTitle</label>";
				str +=			"<input type = 'text' id = 'taskname' name = 'taskname' placeholder = 'Notice Name' value = '"+taskname+"'>";
				str +=			"<label for = 'taskDescription'>Description</label>";
				str +=			"<textarea type = 'text' id = 'taskDescription' name = 'taskDescription' placeholder = 'Describe the Notice'>"+taskDescription+"</textarea>";
				str +=			"<button id = 'save' type= 'button' onclick = \"saveNotice(event)\">Save</button>";
				str +=			"<button id = 'cancel' type = 'button' onclick = \"cancelNotice(event)\">Cancel</button>"
				str +=		"</form>";
				str += 	"</li>";
			}
			document.querySelector('#noticelist').innerHTML = str;
		});
}

function editNotice(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'none'; 
	c.querySelector('form').style.display = 'block';
}

function deleteNotice(event)
{
	var c = event.target.parentElement.parentElement;
	handleModal('Delete Notice', "This cannot be undone, Are you sure you want to delete the Notice?" , function()
		{
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Notice"); DisplayNotices();DisplayNoticeNotices(); } );
		});
}

function saveNotice(event)
{
	var c = event.target.parentElement;
	editCard( c.parentElement.getAttribute('data-cardurl'), c.querySelector('#taskname').value+'\n'+c.querySelector('#taskDescription').value,false, function(obj){DisplayNotices();DisplayNoticeNotices();});
}

function cancelNotice(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'block'; 
	c.querySelector('form').style.display = 'none';
}

function DisplayScrumMeets()
{
	getAllCards( JSON.parse(localStorage.getItem("CurrentScrumMeetsDetails")).cardsURL, function(list)
		{
			document.querySelector("#premeets").innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let meetLink = '';
				let meetDate = '';
				let meetTime = '';
				let meetDescription = '';
				let k = 0;
				for( let i = 0 ; i < list[j].note.length ; i++ )
				{
					if( list[j].note[i] == '\n')
					{
						k++;
					}
					else if( k == 0 )
					{
						meetLink += list[j].note[i];
					}
					else if( k == 1 )
					{
						meetDate += list[j].note[i];
					}
					else if( k == 2 )
					{
						meetTime += list[j].note[i];
					}
					else if( k == 3 )
					{
						meetDescription += list[j].note[i];
					}
				}
				let editmeet = meetDate.substring(0,4)+"-"+meetDate.substring(4,6)+"-"+meetDate.substring(6,8);
				meetDate = meetDate.substring(6, 8)+"/"+meetDate.substring(4, 6)+"/"+meetDate.substring(0, 4);
				str +=	"<li data-cardurl = '"+list[j].url+"'>";
				str +=		"<div>";
				str +=			"<h5>Meeting Link: <a href = \""+meetLink+"\" target = '_blank'>"+meetLink+"</a></h5>";
				str +=			"<h5>Meeting Date: "+meetDate+"</h6>";
				str +=			"<h5>Meeting Time: "+meetTime+"</h6>";
				str +=			"<h5>Description:\n"+meetDescription+"</h5>";
				str +=			"<h6>Created by: "+list[j].creator+"</h6>";
				date = new Date(list[j].time);
				str +=			"<h6>Last Modified: "+date+"</h6>";
				str +=			"<button id = 'delete' onclick = \"deleteScrumMeet(event)\">Delete Meet</button>";
				str += 			"<button id = 'edit' onclick = \"editScrumMeet(event)\">Edit Meet</button>";
				str += 		"</div>";
				str +=		"<form class = 'edit' style ='display : none'>";
				str +=			"<h4>Edit Meeting</h4>";
				str += 			"<label for = 'meetingtime'>Time</label>";
				str +=			"<input type = 'time' id = 'meetingtime' name = 'meetingtime' placeholder = 'Time of the Meeting' value = '"+meetTime+"'>";
				str +=			"<label for = 'meetingDate'>Date</label>";
				str +=			"<input type = 'date' id = 'meetingDate' name = 'meetingDate' value = '"+editmeet+"'>";
				str +=			"<label for = 'meetinglink'>Link</label>";
				str += 			"<input type = 'text' id = meetinglink name = 'meetinglink' placeholder = 'Link to the Meeting' value = '"+meetLink+"'>";
				str += 			"<label for= 'meetDescription'>Purpose</label>";
				str +=			"<textarea type = 'text' id = 'meetDescription' name = 'meetDescription' placeholder = 'Describe the Purpose'>"+meetDescription+"</textarea>";
				str +=			"<button id = 'save' type= 'button' onclick = \"saveScrumMeet(event)\">Save</button>";
				str +=			"<button id = 'cancel' type = 'button'onclick = \"cancelScrumMeet(event)\">Cancel</button>"
				str +=		"</form>";
				str += 	"</li>";
			}
			document.querySelector('#premeets').innerHTML = str;
		});
}

function editScrumMeet(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'none'; 
	c.querySelector('form').style.display = 'block';
}

function deleteScrumMeet(event)
{
	var c = event.target.parentElement.parentElement;
	handleModal('Delete Meeting', "This cannot be undone, Are you sure you want to delete the Meeting?" , function()
		{
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Meeting"); DisplayScrumMeets(); DisplayNoticeMeets();} );
		});
}

function saveScrumMeet(event)
{
	var c = event.target.parentElement;
	meetLink = c.querySelector('#meetinglink').value;
	meetDate = c.querySelector('#meetingDate').value;
	meetDate = meetDate.substring(0, 4)+meetDate.substring(5, 7)+meetDate.substring(8, 10);
	meetTime = c.querySelector('#meetingtime').value;
	meetDescription = c.querySelector('#meetDescription').value;
	con = meetLink+"\n"+meetDate+"\n"+meetTime+"\n"+meetDescription;
	editCard( c.parentElement.getAttribute('data-cardurl'), con, false, function(obj){DisplayScrumMeets();DisplayNoticeMeets();});
}

function cancelScrumMeet(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'block'; 
	c.querySelector('form').style.display = 'none';
}

function DisplayNoticeTasks()
{
	getAllCards( JSON.parse(localStorage.getItem("CurrentScrumTasksDetails")).cardsURL, function(list)
		{
			document.querySelector("#duetasks").querySelector("ul").innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let taskname = '';
				let taskDescription = '';
				let k = 0;
				for( let i = 0 ; i <  list[j].note.length ; i++ )
				{
					if(list[j].note[i] == '\n')
					{
						k = 1;
					}
					else if( k == 0 )
					{
						taskname += list[j].note[i];
					}
					else if( k == 1 )
					{
						taskDescription += list[j].note[i];
					}
				}
				if( list[j].archived == false )
				{
					str +=	"<li>";
					str +=		"<div>";
					str += 			"<button class = 'thead'> ";
					str += 				taskname;
					str +=			"</button>";
					str += 			"<div>";
					str +=				taskDescription;
					str +=			"</div>";
					str +=		"</div>";
					str +=	"</li>";
				}
			}
			document.querySelector("#duetasks").querySelector("ul").innerHTML = str;
			handleTasksNoticeViewing()
		});
}

function DisplayNoticeNotices()
{
	getAllCards( JSON.parse(localStorage.getItem("NoticeDetails")).cardsURL, function(list)
		{
			document.querySelector("#board").querySelector("#notices").querySelector("ul").innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let taskname = '';
				let taskDescription = '';
				let k = 0;
				for( let i = 0 ; i <  list[j].note.length ; i++ )
				{
					if(list[j].note[i] == '\n')
					{
						k = 1;
					}
					else if( k == 0 )
					{
						taskname += list[j].note[i];
					}
					else if( k == 1 )
					{
						taskDescription += list[j].note[i];
					}
				}
				str +=	"<li>";
				str +=		"<div>";
				str +=			"<h5>"+taskname+"</h5>";
				str +=			"<p>"+taskDescription+"</p>";
				str +=		"</div>";
				str +=	"</li>";

			}
			document.querySelector("#board").querySelector("#notices").querySelector("ul").innerHTML = str;
		});
}

function DisplayCommits()
{
	getCommits(function(list){
		document.querySelector("#latestcommits").querySelector("ul").innerHTML = '';
		var str = '';
		for( let i = 0 ; i < list.length ; i++ )
		{
			str += "<li>";
			str += 		"<div>";
			str +=			"<button class = 'nhead'>";
			str += 				list[i].message;
			str +=			"</button>";
			str += 			"<div>";
			str +=				"author: "+list[i].author;
			date = new Date(list[i].date);
			str += 				"<br>Commited on: "+date;
			str +=			"</div>";
			str +=		"</div>";
			str += "</li>";
		}
		document.querySelector("#latestcommits").querySelector("ul").innerHTML = str;
		handleNoticeViewing();
	});
}

function DisplayNoticeMeets()
{
	getAllCards( JSON.parse(localStorage.getItem("CurrentScrumMeetsDetails")).cardsURL, function(list)
		{
			document.querySelector("#upcomingmeets").querySelector("ul").innerHTML = '';
			var str = '';
			for( let j = 0 ; j < list.length ; j++ )
			{
				let meetLink = '';
				let meetDate = '';
				let meetTime = '';
				let meetDescription = '';
				let k = 0;
				for( let i = 0 ; i < list[j].note.length ; i++ )
				{
					if( list[j].note[i] == '\n')
					{
						k++;
					}
					else if( k == 0 )
					{
						meetLink += list[j].note[i];
					}
					else if( k == 1 )
					{
						meetDate += list[j].note[i];
					}
					else if( k == 2 )
					{
						meetTime += list[j].note[i];
					}
					else if( k == 3 )
					{
						meetDescription += list[j].note[i];
					}
				}
				var date = new Date();
				var string = date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString();
				string = parseInt(string);
				date = parseInt(meetDate);
				if( date > string )
				{
					meetDate = meetDate.substring(6, 8)+"/"+meetDate.substring(4, 6)+"/"+meetDate.substring(0, 4);
					str += "<li><div><button class = 'mhead'>";
					str += "Meeting on: "+meetTime+", "+meetDate+"</button>";
					str += "<div>";
					str+="<h5>Link: <a href = ";
					str+=meetLink+" target = '_blank'>";
					str+=meetLink;
					str+="</a><br>";
					str+="Description: "+meetDescription;
					str+="</h5></div></div></li>";
				}
			}
			document.querySelector("#upcomingmeets").querySelector("ul").innerHTML = str;
			handleMeetsNoticeViewing();
		});
}

function handleContributors()
{
	var list = JSON.parse(localStorage.getItem('contributors'));
	var str = '';
	for( var i = 0 ; i < list.length ; i++ )
	{
		str += "<li>"+list[i]+"</li>";
	}
	document.querySelector("#contributorsbox").querySelector('ul').innerHTML = str;
	document.querySelector('#contributorsbox').querySelector('form').querySelector('button').onclick = function(event)
	{
		event.preventDefault();
		username = document.querySelector('#contributorsbox').querySelector('form').querySelector('#taskname').value;
		var b = false;
		console.log(list[0]);
		console.log(username);
		for( var j = 0 ; j < list.length ; j++ )
		{
			if( list[j] == username )
			{
				b = true;
			}
		}
		if( username == '' )
		{
			alert("Enter Username");
		}
		else if( b == true )
		{
			alert("User already exists");
		}
		else
		{
			$.ajax(
				{
					type: "POST",
					url: "isTrueCredentials",
					data: {
						username: username,
						password: '',
					},
					success: function(data)
					{
						console.log(data);
						if(data != 'y')
						{
							alert("No user with the given username");
						}
						else
						{
							var obj = JSON.parse(localStorage.getItem('description'));
							obj.contributors.push(username);
							localStorage.setItem('description', JSON.stringify(obj));
							localStorage.setItem('contributors', JSON.stringify(obj.contributors));
							$.ajax(
								{
									type: "POST",
									url: 'getProjectsPy',
									data:{
										username: localStorage.getItem('Username'),
										currentScrum: 0,
										currentSprint: 0,
										projectName: localStorage.getItem('Project'),
										description: localStorage.getItem('description'),
										mode: 2,
									},
									success: function(data)
									{
										console.log("successfull modified");
										$.ajax(
											{

												type: "POST",
												url: "insertProject",
												data: {
													model: localStorage.getItem('model'),
													projectName: localStorage.getItem('Project'),
													table_name: username+'projects',
													createdBy:localStorage.getItem('Username'),
													createdOn: localStorage.getItem('createdOn'), 
													repolink: localStorage.getItem('repoName'),
													description: localStorage.getItem('description'),
												},
												success: function(data)
												{
													alert("Successfully Added");
													handleContributors();
												}
											}
										)
									}
								}
							)
						}
					}
				}
			)
		}
	}

}

function handleModal( heading, content, callback )
{
	x = document.querySelector("#modal");
	x.querySelector("h1").innerHTML = heading;
	x.querySelector("p").innerHTML = content;
	x.style.display = 'block';
	window.onclick = function(event)
	{
		if( event.target == x )
		{
			x.style.display = 'none';
			console.log("false");
			return false;
		}
	}
	x.querySelector("#yes").onclick = function()
	{
		x.style.display = 'none';
		callback();
		console.log("true");
		return true;
	}
	x.querySelector("#no").onclick = function()
	{
		x.style.display = 'none';
		console.log("false");
		return false;
	}
}

function setValues()
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
									localStorage.setItem('NoticeDetails', list2[j].cardsURL);
								}
							}
						});
				}
				if( parseInt(localStorage.getItem('currentScrum')) != 0 )
				{
					if(list1[i].name == 'Scrum-'+parseInt(localStorage.getItem('currentScrum')).toString())
					{
						getAllColumns(list1[i].columnURL, function(list2)
							{
								for( var j = 0 ; j < list2.length ; j++ )
								{
									if(list2[j].name == 'Tasks')
									{
										localStorage.setItem('CurrentScrumTasksDetails', JSON.stringify(list2[j].cardsURL));

									}
									if(list2[j].name == 'Meetings')
									{
										localStorage.setItem('CurrentScrumMeetsDetails', JSON.stringify(list2[j].cardsURL));
									}
								}
							});
					}
				}
				if( parseInt(localStorage.getItem('currentSprint')) != 0 )
				{
					if(list1[i].name == 'Sprint-'+parseInt(localStorage.getItem('currentSprint')).toString())
					{
						getAllColumns(list1[i].columnURL, function(list2)
							{
								for( var j = 0 ; j < list2.length ; j++ )
								{
									if(list2[j].name == 'Tasks')
									{
										localStorage.setItem('CurrentSprintTasksDetails', JSON.stringify(list2[j].cardsURL));
									}
								}
							});
					}
				}
			}
		});
}

document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector("title").innerHTML = localStorage.getItem("Project");
		loadOverviewBox();
		DisplayCommits();
		DisplayNotices();
		DisplayNoticeNotices();
		handleContributors();
		document.querySelector("#gobackbutton").onclick = function(){
			window.location = "http://127.0.0.1:8000/";
		}

		if( localStorage.getItem('currentScrum') == 0 )
		{
			console.log('No scrum Created');
			alert('A 2 day scrum is necessary to follow an agile model, start a scrum');
			document.querySelector('#scrumbox').querySelector('#createscrum').style.display = 'block';	
			document.querySelector('#scrumbox').querySelector('#scrum').style.display = 'none';	
			document.querySelector('#scrumbox').querySelector('#createscrum').onclick = () =>
			{
				console.log("clicked");
				scrumNumber = parseInt(localStorage.getItem('currentScrum'))+1;
				createScrum( 'Scrum-'+scrumNumber );
			}
		}
		else
		{
			DisplayScrumTasks();
			DisplayScrumMeets();
			DisplayNoticeTasks();
			DisplayNoticeMeets();
			document.querySelector('#scrumbox').querySelector('#scrum').style.display = 'block';	
			document.querySelector('#scrumbox').querySelector('#createscrum').style.display = 'none';
			var x = setInterval(function() {

				var now = new Date().getTime();

				var distance = parseInt(localStorage.getItem('scrumstart')) + 172800000 - now;

				var days = Math.floor(distance / (1000 * 60 * 60 * 24));
				var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((distance % (1000 * 60)) / 1000);

				document.querySelector('#scrumbox').querySelector('#scrum').querySelector('h3').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";

			}, 1000);	
		}
		if( localStorage.getItem('currentSprint') == 0 )
		{
			console.log('empty sprint');
			alert('A 30 day sprint is necessary to follow an agile model, start a sprint');
			document.querySelector('#sprintbox').querySelector('#createsprint').style.display = 'block';	
			document.querySelector('#sprintbox').querySelector('#sprint').style.display = 'none';	
			document.querySelector('#sprintbox').querySelector('#createsprint').onclick = () =>
			{
				sprintNumber = parseInt(localStorage.getItem('currentSprint'))+1;
				createSprint( 'Sprint-'+sprintNumber );
			}
		}
		else
		{
			//DisplaySprintTasks();
			document.querySelector('#sprintbox').querySelector('#sprint').style.display = 'block';	
			document.querySelector('#sprintbox').querySelector('#createsprint').style.display = 'none';
			var x = setInterval(function() {

				var now = new Date().getTime();

				var distance = parseInt(localStorage.getItem('sprintstart')) + 2592000000- now;

				var days = Math.floor(distance / (1000 * 60 * 60 * 24));
				var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((distance % (1000 * 60)) / 1000);

				document.querySelector('#sprintbox').querySelector('#sprint').querySelector('h3').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";

			}, 1000);	
		}

		var create = document.querySelectorAll('.create');
		for( let i = 0 ; i < create.length ; i++ )
		{
			create[i].onclick = function()
			{
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
			}
		}

		document.querySelector('#createTask').querySelector('button').onclick = (event) =>
		{
			event.preventDefault();
			var taskname = document.querySelector('#createTask').querySelector('#taskname').value;
			var taskDescription = document.querySelector('#createTask').querySelector('#taskDescription').value;
			if( taskname == '' )
			{
				alert("Task name is empty");
			}
			else
			{
				if( taskDescription == '' )
				{
					alert("Task Description is empty");
				}
				else
				{
					var con = taskname+"\n"+taskDescription;
					createCard( JSON.parse(localStorage.getItem("CurrentScrumTasksDetails")).columnURL, con, function(cardObj){
						console.log("before display scrum tasks");
						var b = document.querySelector("#createScrumTaskButton");
						console.log(b);
						b.classList.toggle('createactive');
						var content = b.nextElementSibling;
						content.reset();
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
						DisplayScrumTasks();} );
				}
			}
		}
		document.querySelector('#createmeet').querySelector('button').onclick = (event) =>
		{
			event.preventDefault();
			var meetLink = document.querySelector('#createmeet').querySelector('#meetinglink').value;
			var meetDate = document.querySelector('#createmeet').querySelector('#meetingDate').value;
			var meetDate = meetDate.substring(0, 4)+meetDate.substring(5, 7)+meetDate.substring(8, 10);
			var meetTime = document.querySelector('#createmeet').querySelector('#meetingtime').value;
			var meetDescription = document.querySelector('#createmeet').querySelector('#meetDescription').value;
			if( meetLink == '' )
			{
				alert("Meeting link is empty");
			}
			else if( meetDate == '' )
			{
				alert("Meeting date is empty");
			}
			else if( meetTime == '' )
			{
				alert("Meeting Time is empty");
			}
			else if( meetDescription == '' )
			{
				alert("Meeting Description is empty");
			}
			else
			{
				var con = meetLink+"\n"+meetDate+"\n"+meetTime+"\n"+meetDescription;
				console.log(con);
				createCard( JSON.parse(localStorage.getItem("CurrentScrumMeetsDetails")).columnURL, con, function(cardObj){
					var b = document.querySelector("#createScrumMeetButton");
					console.log(b);
					b.classList.toggle('createactive');
					var content = b.nextElementSibling;
					content.reset();
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
					DisplayScrumMeets();} );
			}
		}
		document.querySelector("#sprintbox").querySelector('#createTask').querySelector('button').onclick = (event) =>
		{
			event.preventDefault();
			var taskname = document.querySelector("#sprintbox").querySelector('#createTask').querySelector('#taskname').value;
			var taskDescription = document.querySelector("#sprintbox").querySelector('#createTask').querySelector('#taskDescription').value;
			if( taskname == '' )
			{
				alert("Task name is empty");
			}
			else
			{
				if( taskDescription == '' )
				{
					alert("Task Description is empty");
				}
				else
				{
					var con = taskname+"\n"+taskDescription;
					createCard( JSON.parse(localStorage.getItem("CurrentSprintTasksDetails")).columnURL, con, function(cardObj){
						var b = document.querySelector("#createSprintTaskButton");
						console.log(b);
						b.classList.toggle('createactive');
						var content = b.nextElementSibling;
						content.reset();
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
						DisplayScrumTasks();
						DisplaySprintTasks();} );
				}
			}
		}
		document.querySelector('#createNotice').querySelector('button').onclick = (event) =>
		{
			event.preventDefault();
			var taskname = document.querySelector('#createNotice').querySelector('#taskname').value;
			var taskDescription = document.querySelector('#createNotice').querySelector('#taskDescription').value;
			if( taskname == '' )
			{
				alert("Notice name is empty");
			}
			else
			{
				if( taskDescription == '' )
				{
					alert("Notice Description is empty");
				}
				else
				{
					var con = taskname+"\n"+taskDescription;
					createCard( JSON.parse(localStorage.getItem("NoticeDetails")).columnURL, con, function(cardObj){
						var b = document.querySelector("#createNoticeButton");
						console.log(b);
						b.classList.toggle('createactive');
						var content = b.nextElementSibling;
						content.reset();
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
					DisplayNotices();
					DisplayNoticeNotices();
				}
			}
		}
		/*
		document.querySelector('#sprintbox').querySelector('#createTask').querySelector('button').onclick = (e) =>
		{
			e.preventDefault();
			taskFunction(localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'sprint', 1, 1, localStorage.getItem('Username'), document.querySelector('#sprintbox').querySelector('#createTask').querySelector('#taskname').value, document.querySelector('#sprintbox').querySelector('#createTask').querySelector('#taskDescription').value,'', 0, 0);
		}*/

		/*document.querySelector('#createmeet').querySelector('button').onclick = (e) =>
		{
			e.preventDefault();
			date = document.querySelector('#createmeet').querySelector('#meetingDate').value;
			date = date.substring(0, 4)+date.substring(5, 7)+date.substring(8, 10);
			meetingFunction(localStorage.getItem('Username')+localStorage.getItem('Project')+localStorage.getItem('currentScrum')+'meets', 1, 1, localStorage.getItem('Username'), document.querySelector('#createmeet').querySelector('#meetinglink').value, '', date, document.querySelector('#createmeet').querySelector('#meetingtime').value, document.querySelector('#createmeet').querySelector('#meetDescription').value );
		}*/

		var options = document.querySelector('#options').querySelectorAll('button');
		var display = document.querySelector('#display').children;

		for(let i = 0 ; i < 6 ; i++ )
		{
			display[i].style.display = 'none';
		}
		display[0].style.display = 'block';

		for( let i = 0 ; i < 6 ; i++ )
		{
			options[i].onclick = (e) =>
			{
				for( let j = 0 ; j < display.length ; j++ )
				{
					display[j].style.display = 'none';
				}
				for( let j = 0 ; j < display.length ; j++ )
				{
					if( e.target == options[j] )
					{
						display[j].style.display = 'block';
					}
				}
			}
		}
		//reloadNoticeTasks();
		//reloadNoticeMeets();
		//reloadScrumTasks();
		//reloadScrumMeetings()
		//reloadSprintTasks();
		document.querySelector('#projectname').innerHTML = localStorage.getItem('Project');
	});
