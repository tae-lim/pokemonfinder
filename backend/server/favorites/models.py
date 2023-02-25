from django.db import models
from users.models import User
from pokefinder.models import Pokemon

# Create your models here.
class UserPokemonFavorites(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    pokemon_id = models.ForeignKey(Pokemon, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_id', 'pokemon_id',)