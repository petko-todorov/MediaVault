from django.urls import path

from games.views import CreateGameView, GameLibraryView, UpdateGameView

urlpatterns = [
    path('games/', GameLibraryView.as_view(), name='games-library'),
    path('add-game/', CreateGameView.as_view(), name='add-game'),
    path('update-game/<int:pk>/', UpdateGameView.as_view(), name='update-game-library'),
]
