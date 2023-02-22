from django.db import models

# Create your models here.
class Pokemon(models.Model):
    name = models.CharField(max_length=20)
    description=models.TextField(blank=True, null=True)
    hp=models.IntegerField()
    attack=models.IntegerField()
    defense=models.IntegerField()
    sp_attack=models.IntegerField()
    sp_defense=models.IntegerField()
    speed=models.IntegerField()
    height=models.IntegerField()
    weight=models.IntegerField()
    image=models.TextField(blank=True, null=True)
    sprite=models.TextField(blank=True, null=True)