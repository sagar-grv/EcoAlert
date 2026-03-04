import React, { useState, useEffect } from 'react';
import { Send, Loader, MessageCircle } from 'lucide-react';
import { subscribeToComments, addCommentToFirestore } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import { formatTime } from '../utils/helpers';
import { FIREBASE_ENABLED } from '../firebase';
import { useApp } from '../context/AppContext';

const MAX_COMMENT_LENGTH = 280;

export default function CommentSection({ postId }) {
    const { user } = useAuth();
    const { incrementCommentCount } = useApp();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(FIREBASE_ENABLED);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!FIREBASE_ENABLED) {
            // Read from local storage
            const localComments = localStorage.getItem(`ecoalert_comments_${postId}`);
            if (localComments) {
                setComments(JSON.parse(localComments));
            }
            setLoading(false);
            return;
        }
        const unsub = subscribeToComments(postId, (liveComments) => {
            setComments(liveComments);
            setLoading(false);
        });
        return unsub;
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        try {
            const commentObj = {
                text: newComment.trim(),
                authorId: user.uid || user.id,
                authorName: user.name || user.displayName || 'Anonymous',
                authorAvatar: user.avatar || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid || user.id}`
            };

            if (FIREBASE_ENABLED) {
                await addCommentToFirestore(postId, commentObj);
            } else {
                const newCommentData = {
                    ...commentObj,
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString()
                };
                const updatedComments = [...comments, newCommentData];
                setComments(updatedComments);
                localStorage.setItem(`ecoalert_comments_${postId}`, JSON.stringify(updatedComments));

                // Increment comment count locally
                if (incrementCommentCount) {
                    incrementCommentCount(postId);
                }
            }
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment: ", error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatTimestamp = (ts) => {
        if (!ts) return 'just now';
        // if it's firestore timestamp
        if (ts.toDate) return formatTime(ts.toDate().toISOString());
        // if string
        return formatTime(ts);
    };

    if (loading) {
        return (
            <div className="comments-loading">
                <Loader size={18} className="spin" />
                <span style={{ marginLeft: 8 }}>Loading comments...</span>
            </div>
        );
    }

    return (
        <div className="comment-section">
            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="no-comments" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '1.5rem 0' }}>
                        <MessageCircle size={24} style={{ opacity: 0.3 }} />
                        <span>No comments yet. Be the first!</span>
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <img src={comment.authorAvatar} alt={comment.authorName} className="comment-avatar" />
                            <div className="comment-content">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.authorName}</span>
                                    <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
                                </div>
                                <div className="comment-text">{comment.text}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {user ? (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <img
                        src={user.avatar || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                        alt="You"
                        className="comment-avatar small"
                    />
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => { if (e.target.value.length <= MAX_COMMENT_LENGTH) setNewComment(e.target.value); }}
                        disabled={submitting}
                        maxLength={MAX_COMMENT_LENGTH}
                    />
                    {newComment.length > 0 && (
                        <span style={{ fontSize: '0.72rem', color: newComment.length > 250 ? 'var(--red)' : 'var(--text-sub)', minWidth: 28, textAlign: 'right' }}>
                            {MAX_COMMENT_LENGTH - newComment.length}
                        </span>
                    )}
                    <button type="submit" disabled={!newComment.trim() || submitting} className="comment-submit-btn">
                        <Send size={16} />
                    </button>
                </form>
            ) : (
                <div className="comment-login-prompt">
                    Log in to join the conversation.
                </div>
            )}
        </div>
    );
}
