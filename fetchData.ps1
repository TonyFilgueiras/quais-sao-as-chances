cd C:\Users\Administrator\Desktop\quais-sao-as-chances

git pull

cd backend

pip install -r requirements.txt
python get_info.py

cd ../

npm install
npm run deploy

git add .
git commit -m "data update"
git push
