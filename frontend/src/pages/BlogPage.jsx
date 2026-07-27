import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Tag, Search, Sparkles } from 'lucide-react'
import api from '../services/api'

function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
        {/* Featured image */}
        {post.featured_image ? (
          <div className="h-48 overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-blue-600/20 via-slate-800 to-purple-600/20 flex items-center justify-center">
            <Sparkles size={48} className="text-blue-400/30" />
          </div>
        )}

        <div className="p-5">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-3">
            {post.category_name && (
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20">
                {post.category_name}
              </span>
            )}
            {post.source === 'ai_agent' && (
              <span className="text-xs bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/20 flex items-center gap-1">
                <Sparkles size={10} /> AI
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-slate-400 line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {post.published_at ? new Date(post.published_at).toLocaleDateString('fa-IR') : ''}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.ai_read_time || 5} دقیقه
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag size={12} />
                {post.tags[0]?.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchData()
  }, [selectedCategory])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedCategory) params.category = selectedCategory
      if (search) params.search = search

      const [postsRes, catsRes] = await Promise.allSettled([
        api.get('/blog/', { params }),
        api.get('/blog/categories/'),
      ])

      if (postsRes.status === 'fulfilled') {
        setPosts(postsRes.value.data.results || postsRes.value.data || [])
      }
      if (catsRes.status === 'fulfilled') {
        setCategories(catsRes.value.data.results || catsRes.value.data || [])
      }
    } catch (err) {
      console.error('Blog fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchData()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-blue-400" />
          وبلاگ امنیتی
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          آخرین اخبار و مقالات تخصصی امنیت و دوربین مداربسته
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در مقالات..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pr-10 pl-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </form>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50"
        >
          <option value="">همه دسته‌ها</option>
          {categories.map((cat) => (
            <option key={cat.slug || cat.id} value={cat.slug || cat.name}>
              {cat.name} ({cat.post_count || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-800/30 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <Sparkles size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">هنوز مقاله‌ای منتشر نشده</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
