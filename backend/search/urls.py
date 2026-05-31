from django.urls import path

from search.views import MoviesSeriesSearchView, GameSearchView

urlpatterns = [
    path('search-movies-series/', MoviesSeriesSearchView.as_view(), name='search-movies'),
    path('search-games/', GameSearchView.as_view(), name='search-games'),
]
