from django.db import models

# Create your models here.
class Pokemon(models.Model):
    name = models.CharField(max_length=120)
    description=models.TextField(blank=True, null=True)

    # @property
    
    def get_region(self):
        return 'Kanto'