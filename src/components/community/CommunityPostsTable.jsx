import React from "react";
import { FiSearch } from "react-icons/fi";
import IconButton from "../ui/shared/IconButton";
import StatusPill from "../ui/shared/StatusPill";
import SelectField from "../ui/shared/SelectField";
import TablePagination from "../ui/shared/TablePagination";
import LoadingSpinner from "../ui/shared/LoadingSpinner";
import api from "../../utils/api";
import { FiTrash2, FiEye } from "react-icons/fi";

const defaultPosts = [
  {
    id: "P-1042",
    author: "Anna Mitchell",
    preview: "We filled our jar today – Leo drew…",
    status: "active",
    comments: 5,
    likes: 456,
    date: "June 10, 2025",
  },
  {
    id: "P-1043",
    author: "James Carter",
    preview: "I completed my first marathon!",
    status: "flagged",
    comments: 3,
    likes: 789,
    date: "June 11, 2025",
  },
  {
    id: "P-1044",
    author: "Lisa Roy",
    preview: "We hosted a great dinner party…",
    status: "active",
    comments: 2,
    likes: 321,
    date: "June 12, 2025",
  },
  {
    id: "P-1045",
    author: "Tommy Lee",
    preview: "Just started my art class – loving…",
    status: "active",
    comments: 2,
    likes: 198,
    date: "June 13, 2025",
  },
  {
    id: "P-1046",
    author: "Sophia Turner",
    preview: "Finally got a promotion at work…",
    status: "deleted",
    comments: 4,
    likes: 987,
    date: "June 14, 2025",
  },
];

const defaultComments = [
  {
    id: "C-6743",
    author: "Sarah A.",
    text: "That’s adorable! We did ours yest…",
    status: "active",
    date: "June 10, 2025",
  },
  {
    id: "C-6744",
    author: "Michael B.",
    text: "Can’t wait for the weekend! Read…",
    status: "active",
    date: "June 11, 2025",
  },
  {
    id: "C-6745",
    author: "Emma L.",
    text: "So excited to see everyone! Let’s…",
    status: "flagged",
    date: "June 12, 2025",
  },
  {
    id: "C-6746",
    author: "James K.",
    text: "Who’s bringing the snacks? I’ll br…",
    status: "deleted",
    date: "June 13, 2025",
  },
  {
    id: "C-6747",
    author: "Olivia M.",
    text: "I love this time of year! Perfect for…",
    status: "deleted",
    date: "June 14, 2025",
  },
  {
    id: "C-6748",
    author: "David R.",
    text: "Let’s plan something fun! I’m…",
    status: "active",
    date: "June 15, 2025",
  },
];

const statusConfig = {
  active: { label: "Active", variant: "success" },
  flagged: { label: "Flagged", variant: "neutral" },
  hidden: { label: "Flagged", variant: "neutral" },
  archived: { label: "Archived", variant: "neutral" },
  deleted: { label: "Deleted", variant: "danger" },
};

const statusOptions = [
  { value: "all", label: "Status" },
  { value: "active", label: "Active" },
  { value: "hidden", label: "Flagged" },
  { value: "archived", label: "Archived" },
  { value: "deleted", label: "Deleted" },
];

const CommunityPostsTable = ({
  mode = "posts", // "posts" | "comments"
  communityId, // Required for posts mode
  postId, // Required for comments mode
  items, // Optional: pre-provided items (for backward compatibility)
  onStatusClick,
  onDelete,
  onViewPost, // only used for posts mode
}) => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Format author name
  const formatAuthorName = (author) => {
    if (!author) return 'Unknown';
    if (typeof author === 'string') return author;
    if (author.firstName || author.surname) {
      return `${author.firstName || ''} ${author.surname || ''}`.trim() || author.username || 'Unknown';
    }
    return author.username || 'Unknown';
  };

  // Fetch posts
  const fetchPosts = React.useCallback(async () => {
    if (!communityId || mode !== 'posts') return;

    try {
      setIsLoading(true);
      const response = await api.getCommunityPosts(communityId, {
        page: currentPage,
        limit: pageSize,
        status: statusFilter === 'all' ? 'all' : statusFilter,
        search: search.trim() || '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.posts) {
        const mappedPosts = response.posts.map((post) => ({
          id: post._id,
          _id: post._id,
          author: formatAuthorName(post.author),
          preview: post.content ? (post.content.length > 50 ? post.content.substring(0, 50) + '…' : post.content) : '',
          status: post.status || 'active',
          comments: post.actualCommentCount || post.stats?.comments || 0,
          likes: post.stats?.likes || 0,
          date: formatDate(post.createdAt),
          _original: post,
        }));

        setData(mappedPosts);
        setTotalItems(response.total || 0);
        setTotalPages(response.pages || 0);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setData([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [communityId, mode, currentPage, pageSize, statusFilter, search]);

  // Fetch comments
  const fetchComments = React.useCallback(async () => {
    if (!postId || mode !== 'comments') return;

    try {
      setIsLoading(true);
      const response = await api.getPostComments(postId, {
        page: currentPage,
        limit: pageSize,
        status: statusFilter === 'all' ? 'all' : statusFilter,
      });

      if (response.comments) {
        const mappedComments = response.comments.map((comment) => ({
          id: comment._id,
          _id: comment._id,
          author: formatAuthorName(comment.author),
          text: comment.content ? (comment.content.length > 50 ? comment.content.substring(0, 50) + '…' : comment.content) : '',
          status: comment.status || 'active',
          date: formatDate(comment.createdAt),
          _original: comment,
        }));

        // Filter by search term if provided (client-side for comments since API doesn't support search)
        let filtered = mappedComments;
        if (search.trim()) {
          const term = search.toLowerCase();
          filtered = mappedComments.filter((item) =>
            item.id.toLowerCase().includes(term) ||
            item.author.toLowerCase().includes(term) ||
            item.text.toLowerCase().includes(term)
          );
        }

        setData(filtered);
        // Adjust totalItems for client-side filtering
        setTotalItems(search.trim() ? filtered.length : (response.total || 0));
        setTotalPages(search.trim() ? Math.ceil(filtered.length / pageSize) : (response.pages || 0));
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setData([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [postId, mode, currentPage, pageSize, statusFilter, search]);

  // Fetch data based on mode
  React.useEffect(() => {
    if (items) {
      // Use provided items if available
      setData(items);
      setTotalItems(items.length);
      setTotalPages(1);
      setIsLoading(false);
      return;
    }

    if (mode === 'posts' && communityId) {
      fetchPosts();
    } else if (mode === 'comments' && postId) {
      fetchComments();
    }
  }, [mode, communityId, postId, items, fetchPosts, fetchComments]);

  // Debounced search - refetch when search changes (after user stops typing)
  React.useEffect(() => {
    if (items) return; // Skip if using provided items
    
    const timeoutId = setTimeout(() => {
      if (mode === 'posts' && communityId) {
        fetchPosts();
      } else if (mode === 'comments' && postId) {
        fetchComments();
      }
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [search, mode, communityId, postId, fetchPosts, fetchComments]); // Include dependencies

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const renderStatus = (status, row) => {
    const meta = statusConfig[status] ?? {
      label: status || "Unknown",
      variant: "neutral",
    };

    return (
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[11px] font-medium"
        onClick={() => onStatusClick?.(row)}
      >
        <StatusPill variant={meta.variant}>{meta.label}</StatusPill>
      </button>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      {/* Header row */}
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
          {mode === "posts" ? "Posts" : "Comments"}
        </h3>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative w-full sm:max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <FiSearch className="text-sm" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                mode === "posts"
                  ? "Search Replies by user name, community name, or status..."
                  : "Search Replies by user name, community name, or status..."
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300"
            />
          </div>
          <SelectField
            size="xs"
            className="min-w-[120px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead>
              {mode === "posts" ? (
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="py-2 pl-4 pr-4">Post ID</th>
                  <th className="px-4 py-2">Author</th>
                  <th className="px-4 py-2">Post Preview</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Comments</th>
                  <th className="px-4 py-2">Likes</th>
                  <th className="px-4 py-2">Date Posted</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              ) : (
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="py-2 pl-4 pr-4">Comment ID</th>
                  <th className="px-4 py-2">Comment Author</th>
                  <th className="px-4 py-2">Comment Text</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date Posted</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
              {data.map((row, idx) => (
              <tr
                key={row.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
              >
                <td className="py-3 pl-4 pr-4 text-slate-800">{mode === 'posts' ? `P-${row.id.slice(-4)}` : `C-${row.id.slice(-4)}`}</td>
                <td className="px-4 py-3 text-slate-600">
                  {row.author}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {row.preview || row.text}
                </td>
                <td className="px-4 py-3">{renderStatus(row.status, row)}</td>
                {mode === "posts" && (
                  <>
                    <td className="px-4 py-3 text-slate-800">{row.comments || 0}</td>
                    <td className="px-4 py-3 text-slate-800">
                      {(row.likes || 0).toLocaleString()}
                    </td>
                  </>
                )}
                <td className="px-4 py-3 text-slate-800">{row.date}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {mode === "posts" && (
                      <IconButton
                        aria-label="View post"
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewPost?.(row)}
                      >
                        <FiEye />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label={
                        mode === "posts" ? "Delete post" : "Delete comment"
                      }
                      size="sm"
                      variant="ghost-danger"
                      onClick={() => onDelete?.(row)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}

              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={mode === "posts" ? 8 : 6}
                    className="py-6 text-center text-xs text-slate-400"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer pagination */}
      {!isLoading && (
        <TablePagination
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20]}
          currentPage={currentPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default CommunityPostsTable;
