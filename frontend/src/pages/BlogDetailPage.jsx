import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, Tag, User, MessageCircle, Send } from 'lucide-react'
import api from '../services/api'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState({ author_name: '', author_email: '', content: '' })
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentSent, setCommentSent] = useState(false)

  useEffect(() => {
    loadPost()
  }, [slug])

  const loadPost = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/blog/${slug}/`)
      setPost(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    setCommentLoading(true)
    try {
      await api.post(`/blog/comment/${slug}/`, comment)
      setCommentSent(true)
      setComment({ author_name: '', author_email: '', content: '' })
      loadPost()
    } catch (err) {
      console.error(err)
    } finally {
      setCommentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-800 rounded w-1/3 animate-pulse" />
        <div className="h-64 bg-slate-800 rounded-2xl animate-pulse" />
        <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
        <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">مقاله یافت نشد</p>
        <Link to="/blog" className="text-blue-400 mt-4 inline-block hover:underline">
          بازگشت به وبلاگ
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowRight size={16} />
        بازگشت به وبلاگ
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {post.category_name && (
            <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
              {post.category_name}
            </span>
          )}
          {post.source === 'ai_agent' && (
            <span className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
              ✨ تولید شده توسط AI
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 leading-relaxed">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {post.published_at ? new Date(post.published_at).toLocaleDateString('fa-IR') : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {post.read_time || post.ai_read_time} دقیقه مطالعه
          </span>
          {post.word_count && (
            <span>{post.word_count.toLocaleString('fa-IR')} کلمه</span>
          )}
        </div>
      </div>

      {/* Featured image */}
      {post.featured_image && (
        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <div className="text-slate-300 leading-8 whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-8">
          <Tag size={14} className="text-slate-500" />
          {post.tags.map((tag) => (
            <span key={tag.id} className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Comments */}
      <div className="border-t border-slate-700/50 pt-8 mt-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <MessageCircle size={18} />
          نظرات ({post.comments?.length || 0})
        </h3>

        {/* Comment form */}
        <form onSubmit={handleComment} className="bg-slate-800/30 rounded-xl p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="نام شما"
              value={comment.author_name}
              onChange={(e) => setComment({ ...comment, author_name: e.target.value })}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              required
            />
            <input
              type="email"
              placeholder="ایمیل شما"
              value={comment.author_email}
              onChange={(e) => setComment({ ...comment, author_email: e.target.value })}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              required
            />
          </div>
          <textarea
            placeholder="نظر خود را بنویسید..."
            value={comment.content}
            onChange={(e) => setComment({ ...comment, content: e.target.value })}
            rows={4}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none mb-4"
            required
          />
          <button
            type="submit"
            disabled={commentLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            {commentLoading ? 'در حال ارسال...' : 'ارسال نظر'}
          </button>
          {commentSent && (
            <p className="text-green-400 text-sm mt-2">
              ✅ نظر شما ارسال شد و پس از تایید نمایش داده خواهد شد.
            </p>
          )}
        </form>

        {/* Existing comments */}
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((c) => (
              <div key={c.id} className="bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-slate-500" />
                  <span className="text-sm font-medium text-white">{c.author_name}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(c.created_at).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{c.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-6">
            هنوز نظری ثبت نشده. اولین نفر باشید!
          </p>
        )}
      </div>
    </div>
  )
}
