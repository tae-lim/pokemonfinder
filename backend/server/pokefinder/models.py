from django.db import models
from django.core.exceptions import ValidationError

def default_stats():
    return dict.fromkeys(['hp', 'attack', 'defense', 'sp_attack', 'sp_defense', 'speed', 'happiness'], 0)

# Create your models here.
class Pokemon(models.Model):
    name = models.CharField(max_length=20)
    description=models.TextField(blank=True, null=True)
    height=models.IntegerField()
    weight=models.IntegerField()
    stats=models.JSONField(default=default_stats)
    types=models.JSONField(default=list)
    lat=models.DecimalField(max_digits=10, decimal_places=6)
    long=models.DecimalField(max_digits=10, decimal_places=6)
    images=models.JSONField()
    has_gender_differences=models.BooleanField()
    location_area_encounters=models.CharField(max_length=50, blank=True, null=True)
    moves=models.JSONField()

    def clean(self):
        super().clean()

        # Ensure that types is either a string or an array of strings
        if isinstance(self.types, str):
            self.types = [self.types]
        elif not isinstance(self.types, list):
            raise ValidationError('Types field must be a string or an array of strings')
        else:
            for item in self.types:
                if not isinstance(item, str):
                    raise ValidationError('Types field must be a string or an array of strings')

    def __str__(self):
        return self.name