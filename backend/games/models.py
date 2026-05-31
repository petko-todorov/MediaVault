from django.db import models
from django.conf import settings

class Game(models.Model):
    rawg_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    poster = models.URLField(null=True, blank=True)
    rating = models.FloatField(null=True, blank=True)
    release_year = models.CharField(max_length=10, null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)
    last_fetched = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class UserGameLibrary(models.Model):
    STATUS_CHOICES = {
        'playing': 'Playing',
        'completed': 'Completed',
        'planned': 'Planned',
        'dropped': 'Dropped'
    }
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='game_library')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='user_libraries')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='playing')
    personal_rating = models.IntegerField(null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'game')
