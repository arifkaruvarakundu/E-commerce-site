Steps:
Step 1:
Activate the virtual environment
$env/Scripts/activate

step 2:
Install all dependencies using requirements.txt
$pip install -r requirements.txt

step 3:
Backend django runserver
$python manage.py runserver

step 4:

Also run celery in another terminal by using the below command:
$celery -A AguaIndia.celery worker --pool=solo -l info

step 5:
Run the Frontend by navigating to the directory vite-project

install all packages

Run the frontend using the following command

$npm run dev


