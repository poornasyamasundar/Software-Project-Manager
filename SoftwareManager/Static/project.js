


//this function is helper function for 
//which sets values for progress bar

function setProgressValues(array)
{
	var lis = document.querySelector("#scrumProgress").querySelectorAll('li');
	lis[0].querySelector('progress').value = array.scrum_timeLeft;
	lis[0].querySelector('progress').max = '172800000';
	lis[0].querySelector('.id').innerHTML = 'Amount of Time spent on current Scrum : '+ Math.round(100*(array.scrum_timeLeft/172800000)) + '%';
	lis[1].querySelector('.value').innerHTML = array.productivity + '  tasks per meet';
	lis[2].querySelector('.value').innerHTML = array.scrum_avgTasks + '  tasks per scrum';
	lis[3].querySelector('.value').innerHTML = array.scrum_avgCards + '  tasks completed vs Tasks Planned';
	var distance = array.scrum_time_gap;
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	//different querys
	lis[4].querySelector('.value').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";


	lis = document.querySelector("#sprintProgress").querySelectorAll('li');
	lis[0].querySelector('progress').value = array.sprint_timeLeft;
	lis[0].querySelector('progress').max = '2592000000';
	lis[0].querySelector('.id').innerHTML = 'Amount of Time spent on current Sprint : ' + Math.round(100*(array.sprint_timeLeft/2592000000)) + '%';
	//sanity check for seeing if it is empty or not
	if( array.sprint_avgCards != NaN )
	{
		lis[1].querySelector('.value').innerHTML = array.sprint_avgCards + '  tasks completed vs Tasks Planned';
	}
	else
	{
		lis[1].querySelector('.value').innerHTML = ' 0 tasks completed vs Tasks Planned';
	}
	//seting values in standard measures
	var distance = array.sprint_time_gap;
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	lis[2].querySelector('.value').innerHTML = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";
}

//function for wait page starting
function startWait()
{
	document.querySelector('#wait').style.display = 'block';
}

//function for wait page ending
function stopWait()
{
	document.querySelector('#wait').style.display = 'none';
}


//for changing the timeline in agile project

function updated_timeline(object, type )
{
	object = JSON.parse(object);
	//checking if we enterd the said function
	console.log('updated timeline is clicked')
	//seeing the values that we got
	console.log(object);
	if( type == 'scrumlist' )
	{
		//working for scrums
		document.querySelector(".containers").querySelector('.title').innerHTML = 'Scrums under '+object.name + "<button id = 'goStart'>Go to Start</button>";
		document.querySelector("#goStart").onclick = function(event)
		{
			event.preventDefault();
			console.log("clicked getAll()");
			getAll();
		}
		console.log("heading = ", document.querySelector(".containers").querySelector('.title').innerHTML);
		console.log(object.endTime);
		getScrums(object.endTime, get_timeline);
	}
	else if( type == 'tasks' )
	{
		//workings for tasks
		document.querySelector(".containers").querySelector(".title").innerHTML = 'Tasks done under '+ "<button id = 'goStart' >Go to Start</button>";
		document.querySelector("#goStart").onclick = function(event)
		{
			event.preventDefault();
			console.log("clicked getAll()");
			getAll();
		}
		getTasks(object.columnsURL, get_timeline);
	}
}

//we need to get objectarray
function get_timeline(Objectarray, type )// clear,onclick
{
	if( type == 'sprintlist' )//different sprints 
	{
		document.querySelector(".containers").querySelector('.title').innerHTML = 'Time Line of All Sprints'+ "<button id = 'goStart'>Go to Start</button>";
	}
	// sometimes I believe compiler ignores all my comments
	document.querySelector("#goStart").onclick = function(event)
		{
			event.preventDefault();
			console.log("clicked getAll()");
			getAll();
		}
	document.getElementsByClassName("myList")[0].innerHTML='';
	var i = 0;
	//loop for adding multiple li elements
	for(i=0;i<Objectarray.length;i++)//object link
	{
		var object=Objectarray[i];
		var node = document.createElement("LI");                 // Create a <li> node
		//setting for ith element in timeline
		node.setAttribute('data-object',JSON.stringify(Objectarray[i]));
		var div	 = document.createElement("div");
		//adding class for styling the elements
		div.classList.add("timeline-content");
		var h3 = document.createElement('h3');
		if( object['createdTime'] != '' )
		{
			//procces to be done when it is empty
			var d = new Date(object['createdTime']);
			var date = d.getDate() + '-' + (d.getMonth()+1) + '-' + d.getFullYear();
		}
		else
		{
			var date = '';
		}
		var text=document.createTextNode(date);

		h3.classList.add("date")
		var p = document.createElement('p');
		var textnode = document.createTextNode(object['name']);
		h3.appendChild(text);
		p.innerHTML = object['name'];            // Append the text to <li>
		//forming propr order for html elements
		div.appendChild(h3);
		div.appendChild(p);
		node.appendChild(div);
		document.getElementsByClassName("myList")[0].appendChild(node);
		if( type == 'sprintlist')
		{
			//what to do when it issprintlist
			node.onclick=function(){updated_timeline(this.getAttribute('data-object'),'scrumlist' );};
		}
		else if( type == 'scrumlist' )
		{
			//what to do when it is sprintlist
			node.onclick=function(){updated_timeline(this.getAttribute('data-object'), 'tasks' );};
		}
	}
	if(  Objectarray.length == 0 )
	{
		document.getElementsByClassName("myList")[0].innerHTML = "Timeline is Empty";
	}
}

// this function needs the end time of the required sprint
// that info is available in the arrays returned by getAll()
// this returns all the scrums that come under a specific scrum
function getScrums(endTime, callback )
{
	//uses git api
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');


	$.ajax(

		{

			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend, 

			//for scucess link
			success: function(response)
			{
				console.log(response)
				list = []
				for(i=0 ; i<response.length ; i++)
				{

					model = response[i].name.slice(0, 5).toLowerCase();
					//console.log(model)
					if(model != 'scrum')
						continue;

					createdTime = response[i].created_at;
					console.log("End time = ", endTime);
					date=new Date(createdTime).getTime();
					date1 = new Date(endTime).getTime();
					console.log('date = ', date, '  date1 = ', date1 );
					if(date < date1 )
						list.push({name: response[i].name, createdTime: createdTime, endTime: new Date(date+172800000), columnsURL: response[i].columns_url,})

				}

				// sometimes I believe compiler ignores all my comments
				console.log( 'list in get scrums = ', list)
				callback(list, 'scrumlist' );
				//return list;
			}
		}

	)
}

// this is a helper function to getTasks()
// we will not call this function explicitly

function getTasksHelper(url, callback)
{
	console.log('url for getTasks Helper = ', url);
	$.ajax(

		{
			type: 'GET',
			url: url,
			beforeSend: beforeSend,
			data:
			{
				archived_state: 'archived',
			},
			success: function(response)
			{
				console.log('getTasks helper', response);
				list = []

				note = '';
				for(i=0 ; i<response.length ; i++)
				{
					note = '';
					note = note + 'creator: ' + response[i].creator['login'] + '<br>Completed at: ' + new Date(response[i].updated_at) + '<br>Task: ';
					for( j = 0 ; j < response[i].note.length ; j++ )
					{
						if( response[i].note[j] === '\n' )
						{
							note = note + '<br>Description: ';
						}
						else
						{
							note = note + response[i].note[j];
						}
					}
					list.push({creator: response[i].creator['login'], name: note, createdTime:'', date: response[i].updated_at})
				}

				console.log(list)
				callback(list, 'tasks');
			}

		}

	)
}

// from the arrays you have, pass columns_url as a parameter to this function

function getTasks(url, callback)
{
	console.log('url for getTasks = ', url);
	$.ajax(

		{

			type: 'GET',
			url: url,
			beforeSend: beforeSend,

			success: function(response)
			{
				console.log("response from getTasks = ", response);
				getTasksHelper(response[0].cards_url, callback);
			}
		}

	)
}

// this function saves all scrums and sprints in 2 arrays
// there will be name, url, columns_url 

function getAll()
{
	username = localStorage.getItem('gitUserName');
	repoName = localStorage.getItem('repoName');
	$.ajax(

		{

			type: 'GET',
			url: 'https://api.github.com/repos/'+username+'/'+repoName+'/projects',
			beforeSend: beforeSend, 

			success: function(response)
			{
				// sometimes I believe compiler ignores all my comments
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
					createdTime = response[i].created_at;
					if(model == 'sprint')
					{
						endTime=new Date(createdTime);
						endTime.setDate(endTime.getDate() + 30);
						endTime = endTime.toISOString(); 
						sprints.push({name: name, url: url, columns_url: columns_url,
							createdTime: createdTime, endTime: endTime
						})

					}
					else
					{	
						endTime=new Date(createdTime);
						endTime.setDate(endTime.getDate() + 2);
						endTime = endTime.toISOString(); 
						scrums.push({name: name, url: url, columns_url: columns_url,
							createdTime: createdTime, endTime: endTime
						}) 
					}

				}
				get_timeline(sprints, 'sprintlist' );
				avgCards(sprints, scrums);
			}
		}

	)

}

// order of collection of Info
// avgCards of sprint, scrum
// productivity
// avgTasks for sprint, scrum
// timeLeft for sprint, scrum

infoArray = []

// time left in the current sprints and scrums
function timeLeft(sprints, scrums)
{
	var time = 0;
	for(i=1 ; i<sprints.length ; i++)
	{
		time = time + new Date(sprints[i].endTime).getTime() - new Date(sprints[i-1].createdTime).getTime();
	}
	if( sprints.length == 0 )
	{
		date1 = 0;
	}
	else
	{
		var date1 = new Date().getTime() - new Date(sprints[sprints.length-1].createdTime).getTime();
	}
	infoArray['sprint_timeLeft'] = date1;
	if( sprints.length > 1 )
	{
		infoArray['sprint_time_gap'] = time/sprints.length-1;
	}
	else
	{
		infoArray['sprint_time_gap'] = 0;
	}
	time = 0;
	for(i=1 ; i<scrums.length ; i++)
	{
		time = time + new Date(scrums[i].endTime).getTime() - new Date(scrums[i-1].createdTime).getTime();
	}
	if( scrums.length != 0 )
	{
		date1 = new Date().getTime() - new Date(scrums[scrums.length-1].createdTime).getTime()
	}
	else
	{
		date1 = 0;
	}

	infoArray['scrum_timeLeft'] = date1;
	if( scrums.length > 1 )
	{
		infoArray['scrum_time_gap'] = time/scrums.length-1;
	}
	else
	{
		infoArray['scrum_time_gap'] = 0;
	}
	console.log("info Array = ", infoArray);
	setProgressValues(infoArray);
}

function avgTasksHelper(list, counter, tasksDone, type, sprints, scrums)
{
	if(counter == list.length)
	{
		//print(tasksDone, list.length)
		// sometimes I believe compiler ignores all my comments
		if(type == 'sprint')
		{
			if( list.length != 0 )
			{
				infoArray['sprint_avgTasks'] = tasksDone / list.length;
			}
			else
			{
				infoArray['sprint_avgTasks'] = 0;
			}

			//console.log('avgTasksCompleted for scrum');
			avgTasksCompleted('scrum', sprints, scrums); 
		}
		else
		{
			if( list.length != 0 )
			{
				infoArray['scrum_avgTasks'] = tasksDone / list.length;
			}
			else
			{
				infoArray['scrum_avgTasks'] = 0;
			}
			//console.log('printing time left for each sprint');
			timeLeft(sprints, scrums);
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
	list = [];
	if(type == 'sprint')
		for(i=0 ; i<scrums.length ; i++)
			list.push(scrums[i].columns_url)
	else
		for(i=0 ; i<sprints.length ; i++)
			list.push(sprints[i].columns_url)

	avgTasksHelper(list, 0, 0, 0, sprints, scrums);	
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
	console.log("Entered productivity helper counter = ", counter);
	if(counter == list.length)
	{
		if( meetings != 0 )
		{
			infoArray['productivity'] = tasksDone / meetings;
		}
		else
		{
			infoArray['productivity'] = 0;
		}
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
					console.log(response)
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
				},
				error: function()
				{
					console.log("Errror");
				},
			}

		)
	}
}

function productivity(sprints, scrums)
{
	//console.log("entered productivity");
	list = [];
	for(i=0 ; i<scrums.length ; i++)
		list.push(scrums[i].columns_url)

	//console.log("list = " , list);
	productivityHelper(list, 0, 0, 0, sprints, scrums);			

}


function avgCardsHelper(avg, type, sprints, scrums, idx)
{
	if(type == 'sprint' && idx == sprints.length)
	{
		if( sprints.length != 0 )
		{
			infoArray['sprint_avgCards'] = avg / sprints.length;
		}
		else
		{
			infoArray['sprint_avgCards'] = 0;
		}
		avgCardsHelper(0, 'scrum', sprints, scrums, 0);

	}
	else if(type == 'scrum' && idx == scrums.length)
	{
		//print(avg, scrums.length)
		if( scrums.length != 0 )
		{
			infoArray['scrum_avgCards'] = avg / scrums.length;
		}
		else
		{
			infoArray['scrum_avgCards'] = 0;
		}
		productivity(sprints, scrums);
	}
	else 
	{

		if(type == 'scrum')
		{
			url = scrums[idx].columns_url;
		}
		else
		{
			url = sprints[idx].columns_url;
		}

		$.ajax(

			{

				type: 'GET',
				url: url,
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
								avgCardsHelper(avg+(done/total), type, sprints, scrums, idx+1);
							}
						}

					)
				}
			}

		)
	}
}

function avgCards(sprints, scrums)
{
	avgCardsHelper(0, 'sprint', sprints, scrums, 0);

}
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
			startWait();
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
	startWait();
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
			stopWait();
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
			stopWait();
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
			stopWait();
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
			startWait();
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Notice"); DisplayNotices();DisplayNoticeNotices(); } );
		});
}

function saveNotice(event)
{
	var c = event.target.parentElement;
	startWait();
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
			stopWait();
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
			startWait();
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
	startWait();
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
			stopWait();
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
				if( date >= string )
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
			startWait();
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
							stopWait();
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
													stopWait();
													alert("Successfully Added");
													document.querySelector('#contributorsbox').querySelector('form').reset();
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

function loadFolder( foldername )
{
	startWait();
	if( foldername != document.querySelector("#backlogsbox").querySelector("#path").getAttribute('data-foldername') )
	{
		var p = document.querySelector("#backlogsbox").querySelector("#path").getAttribute('data-pathname');
		p = JSON.parse(p);
		p.push(foldername);
		document.querySelector("#backlogsbox").querySelector("#path").setAttribute('data-pathname', JSON.stringify(p));
	}
	var p = document.querySelector("#backlogsbox").querySelector("#path").getAttribute('data-pathname');
	p = JSON.parse(p);
	var str = '';
	for( var i = 0 ; i < p.length ; i++ )
	{
		str = str + p[i] + '/';
	}
	document.querySelector("#backlogsbox").querySelector("#path").innerHTML = str;
	document.querySelector("#backlogsbox").querySelector("#path").setAttribute('data-foldername', foldername);

	document.querySelector("#folderback").onclick = function(event){
		if( document.querySelector('#backlogsbox').querySelector("#path").getAttribute('data-foldername') == 'root' )
		{
			return;
		}
		event.preventDefault();
		var p = document.querySelector("#backlogsbox").querySelector("#path").getAttribute('data-pathname');
		p = JSON.parse(p);
		p.pop();
		var prev = p.pop();
		document.querySelector("#backlogsbox").querySelector("#path").setAttribute('data-pathname', JSON.stringify(p));
		loadFolder(prev);
	};
	var str = '';
	getAllCards( JSON.parse(localStorage.getItem('FileInfo')).cardsURL, function(cards)
		{
			var fileInfo = JSON.parse(cards[0].note);
			var folderContents;
			for( var i = 0 ; i < fileInfo.length ;i++ )
			{
				if( fileInfo[i].name == foldername )
				{
					folderContents = fileInfo[i];
				}
			}
			document.querySelector("#backlogsbox").querySelector("#path").setAttribute('data-columnURL',folderContents.columnURL);
			for( var i = 0 ; i < folderContents.folders.length ; i++ )
			{
				str += "<li onclick = \"loadFolder('"+folderContents.folders[i]+"')\" >";
				str += "<p class = 'folder'>"+folderContents.folders[i]+"</p>";
				str += "</li>";
			}
			getAllCards( folderContents.cardsURL, function(list)
				{
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
						str +=			"<button id = 'delete' onclick = \"deleteProductTask(event)\">Delete Task</button>";
						str += 			"<button id = 'edit' onclick = \"editProductTask(event)\">Edit Task</button>";
						if( localStorage.getItem('currentScrum') != 0 )
						{
							str += 			"<button id = 'addToScrum' onclick = \"addToScrum(event)\">Add to Current Scrum</button>";
						}
						if(localStorage.getItem('currentSprint') != 0 )
						{
							str += 			"<button id = 'addToSprint' onclick = \"addToSprint(event)\">Add to Current Sprint</button>";
						}
						str += 		"</div>";
						str +=		"<form class = 'edit' style ='display : none'>";
						str +=			"<h4>Edit Tasks</h4>";
						str += 			"<label for = 'taskname'>TaskTitle</label>";
						str +=			"<input type = 'text' id = 'taskname' name = 'taskname' placeholder = 'Task Name' value = '"+taskname+"'>";
						str +=			"<label for = 'taskDescription'>Description</label>";
						str +=			"<textarea type = 'text' id = 'taskDescription' name = 'taskDescription' placeholder = 'Describe the Task'>"+taskDescription+"</textarea>";
						str +=			"<button id = 'save' type= 'button' onclick = \"saveProductTask(event)\">Save</button>";
						str +=			"<button id = 'cancel' type = 'button' onclick = \"cancelProductTask(event)\">Cancel</button>"
						str +=		"</form>";
						str += 	"</li>";
						console.log(str);
					}
					document.querySelector("#backlogsbox").querySelector("ul").innerHTML = str;
					stopWait();
				});

		});
}

function deleteProductTask(event)
{
	var p = document.querySelector("#backlogsbox").querySelector("#path").getAttribute('data-foldername');
	var c = event.target.parentElement.parentElement;
	handleModal('Delete Task', "This cannot be undone, Are you sure you want to delete the task?" , function()
		{
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Task"); loadFolder(p); } );
		});
}

function editProductTask(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'none'; 
	c.querySelector('form').style.display = 'block';
}

function addToScrum(event)
{
	var c = event.target.parentElement.parentElement.querySelector("form");
	startWait();
	createCard( JSON.parse(localStorage.getItem("CurrentScrumTasksDetails")).columnURL,c.querySelector('#taskname').value+'\n'+c.querySelector('#taskDescription').value,  function(cardObj){
		alert("Task successfully Added to scrum");
		DisplayScrumTasks();
		DisplayNoticeTasks();
	});
}

function addToSprint(event)
{
	var c = event.target.parentElement.parentElement.querySelector("form");
	startWait();
	createCard( JSON.parse(localStorage.getItem("CurrentSprintTasksDetails")).columnURL,c.querySelector('#taskname').value+'\n'+c.querySelector('#taskDescription').value,  function(cardObj){
		alert("Task successfully Added to Sprint");
		DisplaySprintTasks();
	});
}

function saveProductTask(event)
{
	var p = document.querySelector("#backlogsbox").querySelector("#path").getAttribute('data-foldername');
	var c = event.target.parentElement;
	var b;
	editCard( c.parentElement.getAttribute('data-cardurl'), c.querySelector('#taskname').value+'\n'+c.querySelector('#taskDescription').value,false, function(obj){loadFolder(p)});
}

function cancelProductTask(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'block'; 
	c.querySelector('form').style.display = 'none';
}

function InitializeProductBacklogs()
{
	loadFolder( 'root' )
	document.querySelector("#backlogsbox").querySelector('#createTask').querySelector('button').onclick = (event) =>
	{
		event.preventDefault();
		var taskname = document.querySelector("#backlogsbox").querySelector('#createTask').querySelector('#taskname').value;
		var taskDescription = document.querySelector("#backlogsbox").querySelector('#createTask').querySelector('#taskDescription').value;
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
				startWait();
				var con = taskname+"\n"+taskDescription;
				createCard(document.querySelector("#backlogsbox").querySelector("#path").getAttribute('data-columnURL') , con, function(cardObj){
					var p = document.querySelector("#backlogsbox").querySelector("#path").getAttribute('data-foldername');
					loadFolder(p);
					var b = document.querySelector("#createProductTaskButton");
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
					stopWait();
				});
			}
		}
	}
	document.querySelector("#backlogsbox").querySelector('.createfolder').querySelector('button').onclick = (event) =>
	{
		event.preventDefault();
		var taskname = document.querySelector("#backlogsbox").querySelector('.createfolder').querySelector('#taskname').value;
		if( taskname == '' )
		{
			alert("Enter FolderName");
		}
		else
		{
			startWait();
			createColumn(JSON.parse(localStorage.getItem("ProductBacklogs")).projectURL, taskname, function(cardObj){
				getAllCards( JSON.parse(localStorage.getItem('FileInfo')).cardsURL, function(cards)
					{
						var fileInfo = JSON.parse(cards[0].note);
						var folderContents;
						for( var i = 0 ; i < fileInfo.length ;i++ )
						{
							if( fileInfo[i].name == document.querySelector("#backlogsbox").querySelector("#path").getAttribute('data-foldername'))
							{
								fileInfo[i].folders.push(taskname);
								obj3 = {
									name: taskname,
									cardsURL: cardObj.cardsURL,
									columnURL: cardObj.columnURL, 
									folders: [],
								};
								fileInfo.push(obj3);
								editCard( cards[0].url, JSON.stringify(fileInfo), false, function(response){
									var p = document.querySelector("#backlogsbox").querySelector("#path").getAttribute('data-foldername');
									loadFolder(p);
								});
							}
						}
						var b = document.querySelector("#createProductfolderButton");
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
						stopWait();
					});
			});
		}
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
		InitializeProductBacklogs();
		getAll();
		
		handleContributors();
		document.querySelector("#gobackbutton").onclick = function(){
			window.location = "/";
		}
		document.querySelector('#helpbutton').onclick = function(){
			window.location = '/Help';
		}

		if( localStorage.getItem('scrumExpired') == '1' )
		{
			console.log('No scrum Created');
			alert('A 2 day scrum is necessary to follow an agile model, start a scrum');
			document.querySelector('#scrumbox').querySelector('#createscrum').style.display = 'block';	
			document.querySelector('#scrumbox').querySelector('#scrum').style.display = 'none';	
			document.querySelector('#scrumbox').querySelector('#createscrum').onclick = () =>
			{
				console.log("clicked");
				scrumNumber = parseInt(localStorage.getItem('currentScrum'))+1;
				localStorage.setItem('scrumExpired', 0);
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
			DisplaySprintTasks();
			document.querySelector('#sprintbox').querySelector('#sprint').style.display = 'block';	
			document.querySelector('#sprintbox').querySelector('#createsprint').style.display = 'none';
			var x = setInterval(function() {

				var now = new Date().getTime();

				var distance = parseInt(localStorage.getItem('sprintstart')) + 2592000000 - now;

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
					startWait();
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
						DisplayScrumTasks();
					} );
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
				startWait();
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
		//query for button
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
					//if it is empty
					//alert to notify things
					alert("Task Description is empty");
				}
				else
				{
					//if it is not empty
					startWait();
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
			//if it is empty
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
					startWait();
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
						stopWait();
						DisplayNotices();
						DisplayNoticeNotices();
					});
				}
			}
		}
		//query
		var options = document.querySelector('#options').querySelectorAll('button');
		var display = document.querySelector('#display').children;

		//loop for background color
		for(let i = 0 ; i < 8 ; i++ )
		{
			display[i].style.display = 'none';
			options[i].style.backgroundColor = '#dbefdc';
		}
		display[0].style.display = 'block';
		options[0].style.backgroundColor = '#3d8b40';

		//outer loop
		for( let i = 0 ; i < 8 ; i++ )
		{
			options[i].onclick = (e) =>
			{
								//loop for display
				for( let j = 0 ; j < display.length ; j++ )
				{
					display[j].style.display = 'none';
					options[j].style.backgroundColor = '#dbefdc';
				}
				//loop for display
				for( let j = 0 ; j < display.length ; j++ )
				{
					if( e.target == options[j] )
					{
						display[j].style.display = 'block';
						options[j].style.backgroundColor = '#3d8b40';
					}
				}
			}
		}
		document.querySelector('#projectname').innerHTML = localStorage.getItem('Project');
	});
