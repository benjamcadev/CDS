echo "Switching to branch main"
git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server..."

scp -r -P 63778  dist/* root@186.64.113.208:/var/www/186.64.113.208/

echo "Done!"

