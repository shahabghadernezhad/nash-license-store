from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Count
from django.utils import timezone

from .models import Post, Category, Tag, Comment
from .serializers import (
    PostListSerializer, PostDetailSerializer,
    CategorySerializer, TagSerializer,
    CommentSerializer, CommentCreateSerializer,
)


class PostListView(generics.ListAPIView):
    """
    Public blog listing — published posts only.
    Supports search, category filter, tag filter.
    """
    serializer_class = PostListSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'excerpt', 'ai_keywords']
    ordering_fields = ['published_at', 'created_at']
    ordering = ['-published_at']

    def get_queryset(self):
        qs = Post.objects.filter(status='published')

        # Category filter
        cat = self.request.query_params.get('category')
        if cat:
            qs = qs.filter(category__slug=cat)

        # Tag filter
        tag = self.request.query_params.get('tag')
        if tag:
            qs = qs.filter(tags__slug=tag)

        # Source filter (ai_agent vs admin)
        source = self.request.query_params.get('source')
        if source:
            qs = qs.filter(source=source)

        return qs.select_related('category').prefetch_related('tags').distinct()


class PostDetailView(generics.RetrieveAPIView):
    """Public blog post detail by slug."""
    serializer_class = PostDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Post.objects.filter(status='published').select_related('category').prefetch_related('tags', 'comments')


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all()


class TagListView(generics.ListAPIView):
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    queryset = Tag.objects.all()


class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentCreateSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        post = Post.objects.get(slug=self.kwargs['slug'])
        serializer.save(post=post)


class BlogStatsView(APIView):
    """Blog statistics for admin dashboard."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = Post.objects.count()
        published = Post.objects.filter(status='published').count()
        ai_generated = Post.objects.filter(source='ai_agent').count()
        admin_written = Post.objects.filter(source='admin').count()
        total_views = 0  # Add if you add view counting later
        categories = Category.objects.annotate(
            post_count=Count('posts')
        ).values('name', 'post_count')

        return Response({
            'total_posts': total,
            'published': published,
            'draft': total - published,
            'ai_generated': ai_generated,
            'admin_written': admin_written,
            'categories': list(categories),
        })
