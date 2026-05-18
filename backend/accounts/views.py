import requests
from django.conf import settings
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseRedirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.serializers import UserMeSerializer


class GoogleCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.GET.get("code")
        if not code:
            return HttpResponseRedirect(settings.FRONTEND_URL)

        token_response = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )

        if token_response.status_code != 200:
            return JsonResponse({
                "error": "Failed to exchange code",
                "details": token_response.json()
            }, status=401)

        token_data = token_response.json()
        id_token_str = token_data.get("id_token")

        try:
            id_info = id_token.verify_oauth2_token(
                id_token_str,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=60,
            )
        except ValueError as e:
            print(f"Google token verification failed: {e}")
            return HttpResponseRedirect(f"{settings.FRONTEND_URL}")

        email = id_info["email"]
        name = id_info.get("name", "")

        # TODO: change based on id_info
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": email, "first_name": name},
        )

        refresh = RefreshToken.for_user(user)

        response = HttpResponseRedirect("http://localhost:3000/")

        is_secure = not settings.DEBUG

        print('refresh', refresh)
        response.set_cookie(
            "access_token",
            str(refresh.access_token),
            httponly=True,
            samesite="Lax",
            secure=is_secure,
            max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(
            ),
            path="/",
        )
        response.set_cookie(
            "refresh_token",
            str(refresh),
            httponly=True,
            samesite="Lax",
            secure=is_secure,
            max_age=int(
                settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            path="/"
        )

        return response


class UserMeView(RetrieveAPIView):
    serializer_class = UserMeSerializer

    def get_object(self):
        return self.request.user


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass

        response = JsonResponse({"message": "Logged out"})
        response.delete_cookie("access_token", path="/", samesite="Lax")
        response.delete_cookie("refresh_token", path="/", samesite="Lax")
        return response
