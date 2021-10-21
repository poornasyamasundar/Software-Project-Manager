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

	});
