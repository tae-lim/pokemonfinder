# Pokemonfinder

1. Create .env files
```
path: pokemonfinder/backend/.env
WEATHER_API_KEY="API_KEY"
SECRET_KEY="API_KEY"

path: pokemonfinder/frontend/.env
REACT_APP_GOOGLE_MAPS_API_KEY="API_KEY"

```

2. Install Frontend Packages
```
path: pokemonfinder/frontend
npm install 
```

2. Build Docker Image

```
path: pokemonfinder/
docker-compose build
```

3. Run Django Migrations
- Open a new terminal window
```
path: pokemonfinder/
docker-compose run backend python manage.py migrate
```

4. Start Container
```
path: pokemonfinder/
docker-compose up
```
