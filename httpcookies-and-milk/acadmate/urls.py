from django.contrib import admin
from django.urls import path
from . import views, google_sync, getTTmeta
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.index , name="index"),
    path('initiate-oauth/', google_sync.initiate_oauth, name='initiate_oauth'),
    path('oauth/callback/', google_sync.oauth_callback, name='oauth_callback'),
    path('sync-calendar/', google_sync.google_sync_handler, name='google_sync_handler'),
    path('sync-progress/', views.get_sync_progress, name='get_sync_progress'),  
    path('signup/', views.handleSignUp, name='signup'),
    path('login/', views.handleLogin, name='login'),
    path('logout/', views.handleLogout, name='logout'),
    path('about/', views.about, name="aboutpage"),
    path('add-to-calender/', getTTmeta.gconnect, name='gconnect'),
    path('attendance/', views.attendance_view, name='attendance_view'),
    path('study-planner/',views.studyplanner,name="studyplanner"),
    path('predict-grade/',views.paper_trend_analysis,name="paper_trend_analysis"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
