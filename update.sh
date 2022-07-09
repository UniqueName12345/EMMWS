# (c) Chiroyce 2022
# 9gr was here

# TODO: Implement this using actions

python3 ./fetch.py

cd $GITHUB_WORKSPACE
git config user.name "mybearworld[bot]"
git config user.email "mybearworld[bot]@users.noreply.github.com"

echo "Committing..."
python3 ./commit.py

echo "Pushing to GitHub..."
git push
echo "Pushed to GitHub!!"
