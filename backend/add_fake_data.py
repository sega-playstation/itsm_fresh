import os
import subprocess
import django

# Set the DJANGO_SETTINGS_MODULE environment variable to your Django project's settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def load_data(file_path):
    # Assemble the command to load data using the manage.py loaddata command
    command = f"python3 manage.py loaddata {file_path}"
    
    # Run the command in the shell to load data from the specified file
    subprocess.run(command, shell=True)

def main():
    # Find all files in the current directory that start with 'seed_' and end with '.json'
    seed_files = [file for file in os.listdir() if file.startswith('seed_') and file.endswith('.json')]

    # Check if there are no seed files found
    if not seed_files:
        print("No seed files found.")
        return

    # Iterate over each seed file and load data
    for seed_file in seed_files:
        print(f"Loading data from {seed_file}...")
        load_data(seed_file)
    
    # Print a message indicating the completion of the seeding process
    print("Done with seeding.")

# Execute the main function when the script is run
if __name__ == "__main__":
    main()
