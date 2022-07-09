from requests import get
from subprocess import run

commit_info = get("https://scratch.mit.edu/discuss/post/6444284/source/").json()
run(["git", "commit", "-am", f"{commit_info['commit_message']} - {commit_info['version']}"])