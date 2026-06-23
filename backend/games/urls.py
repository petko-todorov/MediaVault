from django.urls import path

from games.views import CreateGameView

urlpatterns = [
    path('add-game/', CreateGameView.as_view(), name='add-game'),
]
