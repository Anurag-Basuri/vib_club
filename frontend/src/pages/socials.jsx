import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Filter,
  ChevronUp,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Trash2,
  X,
  Upload,
  Video as VideoIcon,
  Search,
} from 'lucide-react';

// Mock data for posts
const generateMockPosts = (page = 1, limit = 10) => {
  const posts = [];
  const startId = (page - 1) * limit + 1;

  for (let i = 0; i < limit; i++) {
    const postId = startId + i;
    const mediaCount = Math.floor(Math.random() * 6); // 0-5 media files
    const media = [];

    for (let j = 0; j < mediaCount; j++) {
      const isVideo = Math.random() > 0.7;
      media.push({
        id: `media_${postId}_${j}`,
        type: isVideo ? 'video' : 'image',
        url: isVideo
          ? `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`
          : `https://picsum.photos/800/600?random=${postId + j}`,
        thumbnail: isVideo ? `https://picsum.photos/800/600?random=${postId + j + 100}` : null
      });
    }

    posts.push({
      id: postId,
      user: {
        id: `user_${postId % 8 + 1}`,
        name: ['Alex Johnson', 'Sarah Chen', 'Michael Rodriguez', 'Emma Thompson', 'David Kim', 'Lisa Wang', 'James Brown', 'Maya Patel'][postId % 8],
        avatar: `https://i.pravatar.cc/150?img=${postId % 70 + 1}`,
        role: Math.random() > 0.7 ? 'admin' : 'member',
        verified: Math.random() > 0.5
      },
      content: [
        "Just finished an amazing workshop on sustainable technology! The future is looking bright 🌱✨",
        "Exciting updates from our latest project milestone. Team collaboration at its finest! 🚀",
        "Beautiful sunset from today's outdoor team building event. Nothing beats nature! 🌅",
        "New innovations in AI are reshaping how we work. Thrilled to be part of this journey! 🤖",
        "Community event was a huge success! Thank you to everyone who participated 🎉",
        "Behind the scenes of our latest product development. Innovation never stops! ⚡",
        "Celebrating our team's achievements this quarter. Proud of everyone's hard work! 🏆",
        "Knowledge sharing session was incredibly insightful. Learning never stops! 📚"
      ][postId % 8],
      media,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last week
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      type: media.length > 0 ? (media.some(m => m.type === 'video') ? 'video' : 'photo') : 'text'
    });
  }

  return posts;
};

const PostCard = ({ post, currentUser, onDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [videoStates, setVideoStates] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});

  const videoRefs = useRef({});

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const toggleVideo = (mediaId) => {
    const video = videoRefs.current[mediaId];
    if (!video) return;

    const currentState = videoStates[mediaId] || { playing: false, muted: true };

    if (currentState.playing) {
      video.pause();
    } else {
      video.play();
    }

    setVideoStates(prev => ({
      ...prev,
      [mediaId]: { ...currentState, playing: !currentState.playing }
    }));
  };

  const toggleMute = (mediaId) => {
    const video = videoRefs.current[mediaId];
    if (!video) return;

    const currentState = videoStates[mediaId] || { playing: false, muted: true };
    video.muted = !currentState.muted;

    setVideoStates(prev => ({
      ...prev,
      [mediaId]: { ...currentState, muted: !currentState.muted }
    }));
  };

  const canDelete = currentUser.role === 'admin' || currentUser.id === post.user.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
    >
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={post.user.avatar}
                alt={post.user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 transition-all duration-300"
              />
              {post.user.verified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                  {post.user.name}
                </h3>
                {post.user.role === 'admin' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full"
                  >
                    Admin
                  </motion.span>
                )}
              </div>
              <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
            </div>
          </div>

          {canDelete && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </motion.button>

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                  >
                    <button
                      onClick={() => {
                        onDelete(post.id);
                        setShowOptions(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Post</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-800 leading-relaxed"
        >
          {post.content}
        </motion.p>
      </div>

      {/* Media Grid */}
      {post.media.length > 0 && (
        <div className="mb-4">
          {post.media.length === 1 ? (
            <div className="px-6">
              <div className="rounded-xl overflow-hidden">
                {post.media[0].type === 'image' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden"
                  >
                    <img
                      src={post.media[0].url}
                      alt="Post media"
                      className="w-full h-96 object-cover transition-transform duration-700 hover:scale-105"
                      onLoad={() => setImageLoaded(prev => ({ ...prev, [post.media[0].id]: true }))}
                    />
                    {!imageLoaded[post.media[0].id] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                    )}
                  </motion.div>
                ) : (
                  <div className="relative">
                    <video
                      ref={el => videoRefs.current[post.media[0].id] = el}
                      src={post.media[0].url}
                      poster={post.media[0].thumbnail}
                      className="w-full h-96 object-cover"
                      muted
                      loop
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleVideo(post.media[0].id)}
                          className="p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
                        >
                          {videoStates[post.media[0].id]?.playing ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white ml-1" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleMute(post.media[0].id)}
                          className="p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
                        >
                          {videoStates[post.media[0].id]?.muted !== false ? (
                            <VolumeX className="w-6 h-6 text-white" />
                          ) : (
                            <Volume2 className="w-6 h-6 text-white" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="px-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className={`grid gap-2 rounded-xl overflow-hidden ${
                  post.media.length === 2 ? 'grid-cols-2' :
                  post.media.length === 3 ? 'grid-cols-3' :
                  post.media.length === 4 ? 'grid-cols-2 grid-rows-2' :
                  'grid-cols-2 grid-rows-3'
                }`}
              >
                {post.media.slice(0, 4).map((media, index) => (
                  <motion.div
                    key={media.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative overflow-hidden ${
                      post.media.length === 5 && index === 0 ? 'row-span-2' : ''
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt="Post media"
                        className="w-full h-full object-cover min-h-[150px] transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="relative">
                        <video
                          ref={el => videoRefs.current[media.id] = el}
                          src={media.url}
                          poster={media.thumbnail}
                          className="w-full h-full object-cover min-h-[150px]"
                          muted
                          loop
                        />
                        <button
                          onClick={() => toggleVideo(media.id)}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
                          >
                            {videoStates[media.id]?.playing ? (
                              <Pause className="w-5 h-5 text-white" />
                            ) : (
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            )}
                          </motion.div>
                        </button>
                      </div>
                    )}
                    {post.media.length > 4 && index === 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"
                      >
                        <span className="text-white font-semibold text-lg">
                          +{post.media.length - 4}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 transition-all duration-300 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
              <span className="text-sm font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (selectedFiles.length + files.length > 5) {
      alert('Maximum 5 files allowed');
      return;
    }

    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && selectedFiles.length === 0) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit({
      content,
      media: selectedFiles
    });

    setContent('');
    setSelectedFiles([]);
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    selectedFiles.forEach(file => URL.revokeObjectURL(file.url));
    setSelectedFiles([]);
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Post</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />

          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt="Selected"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <VideoIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedFiles.length >= 5}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                <span>Add Media ({selectedFiles.length}/5)</span>
              </motion.button>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={(!content.trim() && selectedFiles.length === 0) || isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <span>Post</span>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const FilterBar = ({ filters, activeFilter, setActiveFilter, searchQuery, setSearchQuery }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <div className="flex items-center gap-2">
      <Filter className="w-5 h-5 text-blue-500" />
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            activeFilter === filter
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
              : 'bg-white/60 text-gray-700 hover:bg-blue-100'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search posts or users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 rounded-full border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
      />
    </div>
  </div>
);

const SocialsFeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock current user
  const currentUser = {
    id: 'user_1',
    name: 'Current User',
    role: 'admin', // Change to 'member' to see limited permissions
    avatar: 'https://i.pravatar.cc/150?img=1',
  };

  const filters = ['All', 'Photos', 'Videos', 'Admin Posts'];

  useEffect(() => {
    loadPosts(1, true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadPosts = (page, reset = false) => {
    setLoading(true);
    setTimeout(() => {
      const newPosts = generateMockPosts(page, 6);
      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
      setCurrentPage(page);
      setLoading(false);
    }, 800);
  };

  const handleCreatePost = (postData) => {
    const newPost = {
      id: Date.now(),
      user: currentUser,
      content: postData.content,
      media: postData.media.map((file) => ({
        id: file.id,
        type: file.type,
        url: file.url,
      })),
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      type:
        postData.media.length > 0
          ? postData.media.some((m) => m.type === 'video')
            ? 'video'
            : 'photo'
          : 'text',
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    switch (activeFilter) {
      case 'Photos':
        return post.type === 'photo';
      case 'Videos':
        return post.type === 'video';
      case 'Admin Posts':
        return post.user.role === 'admin';
      default:
        return true;
    }
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canCreatePost = currentUser.role === 'admin' || currentUser.role === 'member';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Community Feed
              </h1>
              <p className="text-gray-600 mt-1">Stay connected with your community</p>
            </motion.div>
            {canCreatePost && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                <Plus className="w-5 h-5" />
                <span>Create Post</span>
              </motion.button>
            )}
          </div>
          <FilterBar
            filters={filters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <AnimatePresence>
          {filteredPosts.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center text-gray-500 py-20"
            >
              No posts found.
            </motion.div>
          )}
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onDelete={handleDeletePost}
            />
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && posts.length > 0 && (
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => loadPosts(currentPage + 1)}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              Load More
            </motion.button>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-lg hover:scale-110 transition-transform"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default SocialsFeedPage;