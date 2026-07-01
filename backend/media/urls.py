from django.urls import path

from media.views import CreateMediaView, MediaLibraryView

urlpatterns = [
    path('media/', MediaLibraryView.as_view(), name='media-library'),
    path('add-media/', CreateMediaView.as_view(), name='add-media'),
]
