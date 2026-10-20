from django.conf import settings
from django.db import models
from django.utils import timezone


class Activity(models.Model):
    ACTIVITY_TYPES = (
        ('added', 'Added to Library'),
        ('status_change', 'Status Change'),
    )

    MEDIA_TYPES = (
        ('movie', 'Movie'),
        ('tv', 'TV Series'),
        ('game', 'Game'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='activities',
    )
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES)
    media_item = models.ForeignKey(
        'media.MovieSeries',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='activities',
    )
    game = models.ForeignKey(
        'games.Game',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='activities',
    )
    from_status = models.CharField(max_length=20, null=True, blank=True)
    to_status = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Activities'

    def __str__(self):
        item_title = (
            self.game.title if self.game else
            (self.media_item.title if self.media_item else 'Unknown')
        )
        return f"{self.user} - {self.activity_type} - {item_title}"
