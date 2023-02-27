# Pokemonfinder

1. Install Frontend Packages
-  Enter /frontend
```
npm install 
```

2. Build Docker Image
- Enter same directory as docker-compose.yml
```
docker-compose build
```

3. Run Django Migrations
- Open a new terminal window
```
docker-compose run backend python manage.py migrate
```

4. Start Container
```
docker-compose up
```
