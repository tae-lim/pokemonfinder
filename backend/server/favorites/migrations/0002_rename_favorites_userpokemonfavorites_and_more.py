# Generated by Django 4.0.10 on 2023-02-25 11:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_user_password'),
        ('pokefinder', '0005_alter_pokemon_location_area_encounters'),
        ('favorites', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Favorites',
            new_name='UserPokemonFavorites',
        ),
        migrations.AlterField(
            model_name='userpokemonfavorites',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user'),
        ),
    ]
