from django.core.management.base import BaseCommand
from activities.models import Activity
from games.models import UserGameLibrary
from media.models import UserMediaLibrary


class Command(BaseCommand):
    help = 'Backfill initial added activities for existing media and games in library'

    def handle(self, *args, **options):
        media_count = 0
        game_count = 0

        for user_media in UserMediaLibrary.objects.select_related('media_item', 'user').all():
            existing = Activity.objects.filter(
                user=user_media.user,
                activity_type='added',
                media_item=user_media.media_item,
            ).exists()
            if not existing:
                activity = Activity.objects.create(
                    user=user_media.user,
                    activity_type='added',
                    media_type=user_media.media_item.media_type,
                    media_item=user_media.media_item,
                    to_status=user_media.status,
                )
                Activity.objects.filter(id=activity.id).update(created_at=user_media.added_at)
                media_count += 1

        for user_game in UserGameLibrary.objects.select_related('game', 'user').all():
            existing = Activity.objects.filter(
                user=user_game.user,
                activity_type='added',
                game=user_game.game,
            ).exists()
            if not existing:
                activity = Activity.objects.create(
                    user=user_game.user,
                    activity_type='added',
                    media_type='game',
                    game=user_game.game,
                    to_status=user_game.status,
                )
                Activity.objects.filter(id=activity.id).update(created_at=user_game.added_at)
                game_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully backfilled {media_count} media activities and {game_count} game activities.'
            )
        )
