import {getAllProjects, getAllColumns,getAllCards, editCard, deleteCard, createProject, createColumn, createCard} from './gitHubApi.js'; 
//function to create a new scrum in the current sprint

export function createScrum( name )
{
	console.log("Entered createScrum with name = ", name);
	createProject( name, function(projectObj) {
		createColumn( projectObj.projectURL, 'Tasks', function(tasksObj) {
			createColumn( projectObj.projectURL, 'Meetings', function(MeetsObj) {
				console.log(MeetsObj);
				localStorage.setItem('currentScrum', parseInt(localStorage.getItem('currentScrum'))+1);
				var date = new Date(MeetsObj.createdTime);
				localStorage.setItem('scrumstart', date.getTime() + 172800000);
				modifyProjects(parseInt(localStorage.getItem('currentScrum'))+1, localStorage.getItem('currentSprint'), localStorage.getItem('Project'));
				localStorage.setItem('CurrentScrumTasksDetails', JSON.stringify(tasksObj));
				localStorage.setItem('CurrentScrumMeetsDetails', JSON.stringify(MeetsObj));
				window.location = '';
			} );
		});
	});
}

//function to create a new sprint in the agile project
export function createSprint( name )
{
	createProject( name, function(projectObj) {
		createColumn( projectObj.projectURL, 'Tasks', function(tasksObj) {
			localStorage.setItem('currentSprint', parseInt(localStorage.getItem('currentSprint'))+1);
			var date = new Date(tasksObj.createdTime);
			localStorage.setItem('sprintstart', date.getTime() + 2592000000 );
			modifyProjects(parseInt(localStorage.getItem('currentScrum')), parseInt(localStorage.getItem('currentSprint'))+1, localStorage.getItem('Project'));
			localStorage.setItem('CurrentSprintTasksDetails', JSON.stringify(tasksObj));
			window.location = '';
		});
	});
}

//to edit a task in the scrum
export function editScrumTask(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'none'; 
	c.querySelector('form').style.display = 'block';
}

// to delete a task in the scrum
export function deleteScrumTask(event)
{
	var c = event.target.parentElement.parentElement;
	handleModal('Delete Task', "This cannot be undone, Are you sure you want to delete the task?" , function()
		{
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Task"); DisplayScrumTasks(); } );
		});
}

// saving a scrum task after changes are made or when a new task is created
export function saveScrumTask(event)
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
	editCard( c.parentElement.getAttribute('data-cardurl'), c.querySelector('#taskname').value+'\n'+c.querySelector('#taskDescription').value,b, function(obj){DisplayScrumTasks();});
}

// to cancel a task without saving
export function cancelScrumTask(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'block'; 
	c.querySelector('form').style.display = 'none';
} 

// function which displays all the scrum tasks created by the user

export function DisplayScrumTasks()
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

//function to display all the meeting scheduled for the current scrum

export function DisplayScrumMeets()
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
				var date = new Date(list[j].time);
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
// function to display all the meetings in the current sprint

export function DisplaySprintTasks()
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

export function editScrumMeet(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'none'; 
	c.querySelector('form').style.display = 'block';
}

export function deleteScrumMeet(event)
{
	var c = event.target.parentElement.parentElement;
	handleModal('Delete Meeting', "This cannot be undone, Are you sure you want to delete the Meeting?" , function()
		{
			deleteCard( c.getAttribute('data-cardurl'), function(obj){ console.log("Deleted Meeting"); DisplayScrumMeets(); } );
		});
}

export function saveScrumMeet(event)
{
	var c = event.target.parentElement;
	var meetLink = c.querySelector('#meetinglink').value;
	var meetDate = c.querySelector('#meetingDate').value;
	meetDate = meetDate.substring(0, 4)+meetDate.substring(5, 7)+meetDate.substring(8, 10);
	var meetTime = c.querySelector('#meetingtime').value;
	var meetDescription = c.querySelector('#meetDescription').value;
	var con = meetLink+"\n"+meetDate+"\n"+meetTime+"\n"+meetDescription;
	editCard( c.parentElement.getAttribute('data-cardurl'), con, false, function(obj){DisplayScrumMeets();});
}

export function cancelScrumMeet(event)
{
	var c = event.target.parentElement.parentElement; 
	c.querySelector("div").style.display = 'block'; 
	c.querySelector('form').style.display = 'none';
}
