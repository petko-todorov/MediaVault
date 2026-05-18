from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import UserMeView, GoogleCallbackView, LogoutView

urlpatterns = [
    path("auth/", include([
        path("google/callback/", GoogleCallbackView.as_view()),
        path("refresh/", TokenRefreshView.as_view()),
        path("logout/", LogoutView.as_view()),
        path('me/', UserMeView.as_view(), name='profile'),
    ]))
]
