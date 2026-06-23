from django.urls import path

from media.views import CreateMediaView

urlpatterns = [
    # path('user-library/', getuserlibrary, name='user-library'),
    path('add-media/', CreateMediaView.as_view(), name='add-media'),
]
