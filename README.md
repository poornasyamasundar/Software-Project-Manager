# Software-Project-Manager
A Web-Application to teach and facilitate Project Management in different Software Development Methods.

Link for release 1 video: https://drive.google.com/file/d/1doXLv-yUhDnG7ILbo9JTJ0oiNn7F51Ha/view?usp=sharing

Ideas.txt:</br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ideas.txt contains our vision towards the web application, any feature we wish to add is first proposed through this file and then after a meeting we would decide whether or not to include the feature.

Resources folder:</br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Resource folder contains the css-html code snippets of different website features to reuse in the website.

Tasks.txt:</br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tasks.txt contains the list of tasks that need to be done( unlike ideas these are formal and implementation specific ). This is list is updated daily to include all the tasks need to be done accordingly the team members pick the task and complete within the end of the day.

SoftwareManager:</br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SoftwareManager folder is the django project that can be run to launch the website locally. To run the website install python, and then django( pip install django ). and then install mysqlclient(pip install mysqlclient). To run the django project run, go to the folder SoftwareManager and run the below command ( python manage.py runserver ).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The folders in the SoftwareManager are as below:
Databases: Contains all the database accessing functions.
Static: contains all the javascript, css and images.
Templates: contains all the html pages for the website.
Feedback, homepage, login, register, agile, newProject: these are django apps for the 6 html pages in the website.
