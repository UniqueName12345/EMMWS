# (c) Chiroyce 2022

cd $GITHUB_WORKSPACE
git config user.name "GitHub Actions"
git config user.email "actions@example.com"
echo "Committing locally..."
git commit -am "Updated script(s)"
echo "Pushing to GitHub..."
git push
echo "Pushed to GitHub!!"