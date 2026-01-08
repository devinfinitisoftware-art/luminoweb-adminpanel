import React from "react";
import Modal from "../ui/shared/Modal";
import CommunityPostsTable from "./CommunityPostsTable";
import ModerationQueueTable from "./ModerationQueueTable";
import Button from "../ui/shared/Button";
import ModerationActionModal from "./ModerationActionModal";
import api from "../../utils/api";
import ConfirmDialog from "../ui/shared/ConfirmDialog";

const CommunityDetailsDrawer = ({ open, community, onClose }) => {
  const [postCommentsOpen, setPostCommentsOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState(null);
  const [moderationModal, setModerationModal] = React.useState({
    open: false,
    type: null,
    target: null,
  });
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [postsTableKey, setPostsTableKey] = React.useState(0);
  const [commentsTableKey, setCommentsTableKey] = React.useState(0);

  if (!open || !community) return null;

  const communityId = community.id || community._id;

  // Force refresh posts table
  const refreshPostsTable = () => {
    setPostsTableKey(prev => prev + 1);
  };

  // Force refresh comments table
  const refreshCommentsTable = () => {
    setCommentsTableKey(prev => prev + 1);
  };

  const openCommentsForPost = (post) => {
    setSelectedPost(post);
    setPostCommentsOpen(true);
  };

  const closeComments = () => {
    setSelectedPost(null);
    setPostCommentsOpen(false);
  };

  const showModerationModal = (type, target) => {
    setModerationModal({ open: true, type, target });
  };

  const closeModerationModal = () =>
    setModerationModal({ open: false, type: null, target: null });

  const confirmModeration = async () => {
    if (!moderationModal.target || !moderationModal.type) return;

    try {
      const { type, target } = moderationModal;
      let action = '';
      
      // Map modal action types to API actions
      if (type === 'delete_post') {
        action = 'delete';
      } else if (type === 'activate_post' || type === 'restore_post') {
        action = 'restore';
      } else if (type === 'flag_post') {
        action = 'hide'; // Use hide as flag alternative
      } else if (type === 'delete_comment') {
        await api.manageComment(target.id || target._id, 'delete');
        closeModerationModal();
        refreshCommentsTable();
        return;
      } else if (type === 'activate_comment') {
        await api.manageComment(target.id || target._id, 'restore');
        closeModerationModal();
        refreshCommentsTable();
        return;
      }

      if (action && target.id) {
        await api.managePost(communityId, target.id, action);
        refreshPostsTable();
      }
      
      closeModerationModal();
    } catch (err) {
      console.error('Error performing moderation action:', err);
      alert(err.message || 'Failed to perform action. Please try again.');
    }
  };

  const handlePostStatusClick = (post) => {
    const type =
      post.status === "deleted" || post.status === "archived"
        ? "activate_post"
        : post.status === "flagged" || post.status === "hidden"
        ? "activate_post"
        : "flag_post";
    showModerationModal(type, post);
  };

  const handlePostDelete = (post) => setDeleteTarget(post);

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    
    try {
      setIsDeleting(true);
      await api.managePost(communityId, deleteTarget.id || deleteTarget._id, 'delete');
      setDeleteTarget(null);
      refreshPostsTable(); // Refresh posts table
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err.message || 'Failed to delete post. Please try again.');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCommentDelete = (comment) => {
    setDeleteTarget(comment);
  };

  const handleConfirmCommentDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    
    try {
      setIsDeleting(true);
      await api.manageComment(deleteTarget.id || deleteTarget._id, 'delete');
      setDeleteTarget(null);
      refreshCommentsTable(); // Refresh comments table
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.message || 'Failed to delete comment. Please try again.');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReportStatusClick = (report) => {
    const type =
      report.status === "resolved" ? "delete_report" : "resolve_report";
    showModerationModal(type, report);
  };

  const handleReportDelete = (report) =>
    showModerationModal("delete_report", report);

  const handleCommentModeration = (comment, type) => {
    if (type === 'delete_comment') {
      handleCommentDelete(comment);
    } else {
      showModerationModal(type, comment);
    }
  };

  // Render as centered modal instead of right-side drawer
  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-3 sm:px-4" onClick={onClose}>
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl bg-white p-5 sm:p-6 shadow-md" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Community &gt; View Community
              </div>
              <h2 className="mt-1 text-sm font-semibold text-slate-900">
                {community.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
            >
              ✕
            </button>
          </div>

          {/* Posts table */}
          <CommunityPostsTable
            key={postsTableKey}
            mode="posts"
            communityId={communityId}
            onStatusClick={handlePostStatusClick}
            onDelete={handlePostDelete}
            onViewPost={openCommentsForPost}
          />

          {/* Reports overview */}
          <ModerationQueueTable
            communityId={communityId}
            onStatusClick={handleReportStatusClick}
            onDelete={handleReportDelete}
          />

          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              className="rounded-xl bg-emerald-400 px-6 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-500"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </div>

      {/* View Post (comments list) */}
      <Modal open={postCommentsOpen} onClose={closeComments}>
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl bg-white p-5 shadow-xl sm:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500">
                Community &gt; View Community &gt; View Post
              </div>
              <h2 className="mt-1 text-sm font-semibold text-slate-900">
                View Post
              </h2>
            </div>
            <button
              onClick={closeComments}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
            >
              ✕
            </button>
          </div>

          <CommunityPostsTable
            key={commentsTableKey}
            mode="comments"
            postId={selectedPost?.id || selectedPost?._id}
            onStatusClick={(comment) =>
              handleCommentModeration(
                comment,
                comment.status === "deleted" || comment.status === "archived"
                  ? "activate_comment"
                  : "delete_comment"
              )
            }
            onDelete={(comment) =>
              handleCommentModeration(comment, "delete_comment")
            }
          />

          <div className="mt-4 flex justify-end">
            <Button
              variant="primary"
              className="rounded-xl bg-emerald-400 px-6 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-500"
              onClick={closeComments}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      <ModerationActionModal
        open={moderationModal.open}
        actionType={moderationModal.type}
        onConfirm={confirmModeration}
        onCancel={closeModerationModal}
      />

      {/* Delete confirmation dialogs */}
      <ConfirmDialog
        open={!!deleteTarget && !postCommentsOpen}
        title="Delete this post?"
        description="This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "DELETE POST"}
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        disabled={isDeleting}
      />

      <ConfirmDialog
        open={!!deleteTarget && postCommentsOpen}
        title="Delete this comment?"
        description="This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "DELETE COMMENT"}
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmCommentDelete}
        onCancel={() => setDeleteTarget(null)}
        disabled={isDeleting}
      />
    </>
  );
};

export default CommunityDetailsDrawer;
