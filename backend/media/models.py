from django.utils import timezone
from django.db import models
from django.conf import settings

class MovieSeries(models.Model):
    TYPES = {
        'movie': 'Movie',
        'tv': 'TV Series',
    }
    tmdb_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    poster = models.URLField(null=True, blank=True)
    rating = models.FloatField(null=True, blank=True)
    media_type = models.CharField(max_length=10, choices=TYPES)
    release_year = models.CharField(max_length=10, null=True, blank=True)
    last_fetched = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title}"

class UserMediaLibrary(models.Model):
    STATUS_CHOICES = {
        'watching': 'Watching',
        'completed': 'Completed',
        'planned': 'Planned',
        'dropped': 'Dropped'
    }
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='media_library')
    media_item = models.ForeignKey(MovieSeries, on_delete=models.CASCADE, related_name='user_libraries')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='watching')
    personal_rating = models.IntegerField(null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'media_item')
