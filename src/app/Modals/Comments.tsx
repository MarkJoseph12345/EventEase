"use client"
import { addComment, fetchProfilePicture, getCommentsByEventId, getUserById, me } from "@/utils/apiCalls";
import { EventDetailModal, User } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";


const Comments = ({ event, onClose }: EventDetailModal) => {
    const [comments, setComments] = useState<any[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await me();
                setUser(userData);
            } catch (error) {

            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            const commentsData = await getCommentsByEventId(event.id!);
            const commentsWithUserDetails = await Promise.all(
                commentsData.map(async (comment: any) => {
                    let userName = "Anonymous";
                    let userProfilePic = "/defaultpic.png";
                    if (comment.userId) {
                        const user = await getUserById(comment.userId);
                        const url = await fetchProfilePicture(comment.userId);
                        userName = user ? user.firstName! + " " + user.lastName! : "Unknown User";
                        userProfilePic = url;
                    }

                    return {
                        ...comment,
                        userName,
                        userProfilePic
                    };
                })
            );
            setComments(commentsWithUserDetails);
            setLoading(false);
        };

        fetchComments();
    }, [event.id])

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (commentText.trim() === "") {
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true)
        const comment = {
            comment: commentText,
            eventId: event.id,
            userId: user!.id,
        };

        const newComment = await addComment(comment);

        if (newComment) {
            let userName = "Anonymous";
            let userProfilePic = "/defaultpic.png";
            if (user!.id) {
                const userDetails = await getUserById(user!.id);
                const profilePicUrl = await fetchProfilePicture(user!.id);
                userName = userDetails ? userDetails.firstName + " " + userDetails.lastName : "Unknown User";
                userProfilePic = profilePicUrl;
            }

            const updatedComment = {
                ...newComment,
                userName,
                userProfilePic
            };

            setComments((prevComments) => [...prevComments, updatedComment]);
            setCommentText("");
        }
        setIsSubmitting(false); 
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="border-2 border-black mb-5 max-w-[50rem] mx-auto bg-white w-10/12 flex flex-col">
                <div className="flex bg-black">
                    <h3 className="text-xl font-bold text-customYellow flex-1 ml-1">Comments</h3>
                    <p className="sticky top-0 text-end text-customYellow font-bold text-2xl z-10 cursor-pointer mr-1" onClick={onClose}>✖</p>
                </div>

                <div className="bg-white overflow-y-auto p-4" style={{ maxHeight: user && user!.role === "STUDENT" ? 'calc(80vh - 250px)' : 'calc(80vh - 150px)' }}>
                    {comments.length === 0 ? (
                        <div className="text-center text-customYellow font-semibold">
                            {loading ? 'Fetching Comments' : 'No comments from users yet.'}
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex items-start mb-1 p-2 border-b border-customYellow">
                                <img
                                    src={comment.userProfilePic}
                                    alt={comment.userName}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div>
                                    <h4 className="text-lg font-semibold">{comment.userName}</h4>
                                    <p className="text-sm">{comment.comment}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {user && user!.role === "STUDENT" && (
                    <div className="p-4 mt-4 bg-white flex items-center space-x-2">
                        <div className="relative w-full">
                            <textarea
                                className="w-full p-2 pl-4 pr-12 border border-customYellow rounded-md text-customYellow resize-none"
                                rows={1}
                                value={commentText}
                                onChange={handleCommentChange}
                                placeholder="Write your comment here..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleCommentSubmit();
                                    }
                                }}
                            />
                            <button
                                className="absolute right-2 top-2 text-customYellow hover:text-yellow-500"
                                onClick={handleCommentSubmit}
                                disabled={isSubmitting}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-customYellow hover:text-yellow-500"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
export default Comments;