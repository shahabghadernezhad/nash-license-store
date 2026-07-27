from rest_framework import serializers
from .models import Post, Category, Tag, Comment


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'post_count']

    def get_post_count(self, obj):
        return obj.posts.filter(status='published').count()


class PostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for blog listing."""
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    tags = TagSerializer(many=True, read_only=True)
    read_time = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'category', 'category_name', 'tags',
            'source', 'ai_read_time', 'published_at', 'created_at',
        ]


class PostDetailSerializer(serializers.ModelSerializer):
    """Full serializer for blog post detail."""
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    tags = TagSerializer(many=True, read_only=True)
    read_time = serializers.IntegerField(read_only=True)
    word_count = serializers.IntegerField(read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image',
            'category', 'category_name', 'tags',
            'meta_title', 'meta_description',
            'source', 'ai_topic', 'ai_keywords', 'ai_read_time',
            'published_at', 'created_at', 'updated_at',
            'read_time', 'word_count', 'comments',
        ]

    def get_comments(self, obj):
        return CommentSerializer(
            obj.comments.filter(is_approved=True), many=True
        ).data


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author_name', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['author_name', 'author_email', 'content']
