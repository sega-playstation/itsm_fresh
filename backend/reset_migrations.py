import os
import shutil
import subprocess

def delete_migrations():
    # Delete existing migration folders for each app
    for app in os.listdir():
        if os.path.isdir(app) and os.path.exists(os.path.join(app, "migrations")):
            print(f"Deleting migrations for {app}")
            shutil.rmtree(os.path.join(app, "migrations"))

def run_makemigrations(apps):
    # Run makemigrations for each app
    for app in apps:
        print(f"Running makemigrations for {app}")
        subprocess.run(["python3", "manage.py", "makemigrations", app])

def run_migrate():
    # Run migrate
    print("Running migrate")
    subprocess.run(["python3", "manage.py", "migrate"])

if __name__ == "__main__":
    # Array of app names
    APPS = ["users", "assets", "incidents", "problems", "priority", "changes", "comments", "slas", "imports"]

    delete_migrations()
    run_makemigrations(APPS)
    run_migrate()
