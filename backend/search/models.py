from django.db import models


class SearchCache(models.Model):
    CATEGORIES = {
        'movie_tv': 'Movies and TV Series',
        'game': 'Games',
    }
    query = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    results_ids = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('query', 'category')

    def __str__(self):
        return f"{self.category}: {self.query}"
