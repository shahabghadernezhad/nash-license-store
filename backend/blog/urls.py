from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListView.as_view(), name='blog-list'),
    path('categories/', views.CategoryListView.as_view(), name='blog-categories'),
    path('tags/', views.TagListView.as_view(), name='blog-tags'),
    path('stats/', views.BlogStatsView.as_view(), name='blog-stats'),
    path('comment/<slug:slug>/', views.CommentCreateView.as_view(), name='blog-comment'),
    path('<slug:slug>/', views.PostDetailView.as_view(), name='blog-detail'),
]
