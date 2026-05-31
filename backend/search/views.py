import os
from datetime import timedelta

import requests
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from games.models import Game
from games.serializers import GameSerializer
from media.models import MovieSeries
from media.serializers import MovieSeriesSerializer  # We will create this next
from search.models import SearchCache


class MoviesSeriesSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get('q')
        if not query:
            return Response([])

        cache_entry = SearchCache.objects.filter(
            query=query, category='movie_tv').first()

        now = timezone.now()

        if cache_entry and (now - cache_entry.created_at) < timedelta(days=10):
            results = MovieSeries.objects.filter(
                tmdb_id__in=cache_entry.results_ids)
            results_dict = {obj.tmdb_id: obj for obj in results}
            ordered_results = [results_dict[tid]
                               for tid in cache_entry.results_ids if tid in results_dict]
            serializer = MovieSeriesSerializer(ordered_results, many=True)
            return Response(serializer.data)

        api_key = os.environ.get('TMDB_READ_ACCESS_TOKEN')
        url = "https://api.themoviedb.org/3/search/multi"
        params = {
            "query": query,
            "include_adult": "false",
            "language": "en-US",
            "page": 1
        }
        headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException:
            return Response(
                {"error": "Failed to fetch from TMDB"},
                status=500
            )

        tmdb_results = data.get('results', [])
        valid_items = []
        tmdb_ids = []

        for item in tmdb_results:
            media_type = item.get('media_type')
            if media_type in ['movie', 'tv']:
                valid_items.append(item)
                tmdb_ids.append(item.get('id'))

        existing_objs = {
            obj.tmdb_id: obj for obj in MovieSeries.objects.filter(tmdb_id__in=tmdb_ids)}
        to_create = []
        to_update = []
        final_results_dict = {}

        for item in valid_items:
            tmdb_id = item.get('id')
            media_type = item.get('media_type')
            title = item.get('title') or item.get('name')
            release_date = item.get('release_date') or item.get(
                'first_air_date') or ""
            poster_path = item.get('poster_path')

            defaults = {
                'title': title,
                'description': item.get('overview'),
                'poster': f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None,
                'rating': item.get('vote_average'),
                'media_type': media_type,
                'release_year': release_date[:4] if release_date else None,
                'last_fetched': now
            }

            if tmdb_id in existing_objs:
                obj = existing_objs[tmdb_id]
                for key, value in defaults.items():
                    setattr(obj, key, value)
                to_update.append(obj)
                final_results_dict[tmdb_id] = obj
            else:
                new_obj = MovieSeries(tmdb_id=tmdb_id, **defaults)
                to_create.append(new_obj)
                final_results_dict[tmdb_id] = new_obj

        if to_create:
            MovieSeries.objects.bulk_create(to_create)
        if to_update:
            MovieSeries.objects.bulk_update(
                to_update,
                ['title', 'description', 'poster', 'rating',
                 'media_type', 'release_year', 'last_fetched']
            )

        SearchCache.objects.update_or_create(
            query=query,
            category='movie_tv',
            defaults={
                'results_ids': tmdb_ids,
                'created_at': now
            }
        )

        ordered_results = [final_results_dict[tid]
                           for tid in tmdb_ids if tid in final_results_dict]
        serializer = MovieSeriesSerializer(ordered_results, many=True)
        return Response(serializer.data)


class GameSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get('q')
        if not query:
            return Response([])

        cache_entry = SearchCache.objects.filter(
            query=query, category='game').first()

        now = timezone.now()

        if cache_entry and (now - cache_entry.created_at) < timedelta(days=10):
            results = Game.objects.filter(rawg_id__in=cache_entry.results_ids)
            results_dict = {obj.rawg_id: obj for obj in results}
            ordered_results = [results_dict[rid]
                               for rid in cache_entry.results_ids if rid in results_dict]
            serializer = GameSerializer(ordered_results, many=True)
            return Response(serializer.data)

        api_key = os.getenv('RAWG_API_KEY')
        if not api_key:
            return Response({"error": "RAWG API Key missing"}, status=500)

        url = "https://api.rawg.io/api/games"
        params = {
            "key": api_key,
            "search": query,
            "page": 1,
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException:
            return Response(
                {"error": "Failed to fetch from RAWG"},
                status=500
            )

        rawg_results = data.get('results', [])

        rawg_ids = []
        valid_items = []

        for item in rawg_results:
            rawg_ids.append(item.get('id'))
            valid_items.append(item)

        existing_objs = {
            obj.rawg_id: obj for obj in Game.objects.filter(rawg_id__in=rawg_ids)}
        to_create = []
        to_update = []
        final_results_dict = {}

        for item in valid_items:
            rawg_id = item.get('id')
            rating = item.get('metacritic') or 0
            release_date = item.get('released') or ""
            tags = item.get('tags', [])
            eng_tags = [tag for tag in tags if tag.get('language') == 'eng']
            sorted_tags = sorted(eng_tags, key=lambda t: t.get(
                'games_count', 0), reverse=True)
            top_3_tag_names = [tag.get('name') for tag in sorted_tags[:3]]

            defaults = {
                'title': item.get('name'),
                'poster': item.get('background_image'),
                'rating': rating if rating else None,
                'release_year': release_date if release_date else None,
                'tags': top_3_tag_names
            }

            if rawg_id in existing_objs:
                obj = existing_objs[rawg_id]
                for key, value in defaults.items():
                    setattr(obj, key, value)
                to_update.append(obj)
                final_results_dict[rawg_id] = obj
            else:
                new_obj = Game(rawg_id=rawg_id, **defaults)
                to_create.append(new_obj)
                final_results_dict[rawg_id] = new_obj

        if to_create:
            Game.objects.bulk_create(to_create)
        if to_update:
            Game.objects.bulk_update(
                to_update, ['title', 'poster', 'rating', 'release_year', 'tags'])

        SearchCache.objects.update_or_create(
            query=query,
            category='game',
            defaults={
                'results_ids': rawg_ids,
                'created_at': now
            }
        )

        ordered_results = [final_results_dict[rid]
                           for rid in rawg_ids if rid in final_results_dict]

        ordered_results = sorted(
            ordered_results,
            key=lambda x: x.rating if x.rating is not None else 0,
            reverse=True
        )

        serializer = GameSerializer(ordered_results, many=True)
        return Response(serializer.data)
