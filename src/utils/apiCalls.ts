import { API_ENDPOINTS } from "@/utils/api";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookies";
import { Event, User } from "./interfaces";
import { arrayBufferToBase64 } from "./data";


export const me = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.ME, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        return error;
    }
}

export const loginAccount = async (username: string, password: string) => {
    try {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        const { messages } = data;
        if (response.ok) {
            setCookie("token", JSON.stringify(data.token), 24);
            return { success: true, message: messages };
        } else {
            return { success: false, message: messages };
        }
    } catch (error) {
        return { success: false, message: "An error occurred, please try again" };
    }
};

export const registerAccount = async (userForm: any) => {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
    });
    if (response) {
        if (response.ok) {
            const data = await response.text();
            return { success: true, message: "Please check your email to verify account!" };
        } else {
            const data = await response.json();
            const { messages } = data
            return { success: false, message: messages };
        }
    }

};

export const getEvents = async (): Promise<Event[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.GET_ALL_EVENTS, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.error("Failed to fetch events");
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

export const createEvent = async (username: string, eventData: any) => {
    try {
        const formattedEventData = {
            eventName: eventData.eventName,
            eventDescription: eventData.eventDescription,
            eventStarts: eventData.eventStarts,
            eventEnds: eventData.eventEnds,
            eventPicture: eventData.eventPicture,
            department: eventData.department,
            eventType: eventData.eventType,
            allowedGender: eventData.allowedGender,
            eventLimit: eventData.eventLimit,
            preRegisteredUsers: eventData.preRegisteredUsers
        };
        const response = await fetch(API_ENDPOINTS.CREATE_EVENT + `?creator=${encodeURIComponent(username)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify(formattedEventData),
        });
        const data = await response.json();
        const { messages } = data;
        if (response.ok) {
            return { success: true, message: "Event Successfully Created", id: data.id };
        } else {
            return { success: false, message: messages };
        }
    } catch (error) {
        return error;
    }
};

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.GET_ALL_USERS, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (!response.ok) {
            console.error("Failed to fetch users");
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const getTopThree = async (): Promise<any[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.GET_TOP_THREE, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (!response.ok) {
            console.error("Failed to fetch top three");
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error("Error fetching top three:", error);
        return [];
    }
};

export const getAttendees = async (): Promise<any[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.GET_ATTENDEES, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch attendees");
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error("Error fetching attendees:", error);
        return [];
    }
};

export const updateEvent = async (eventId: number, eventData: any): Promise<any> => {
    try {
        const formattedEventData: any = {
            eventName: eventData.eventName,
            eventDescription: eventData.eventDescription,
            department: eventData.department,
            eventType: eventData.eventType,
            allowedGender: eventData.allowedGender,
            eventLimit: eventData.eventLimit,
        };
        
        if (eventData.eventStarts) {
            formattedEventData.eventStarts = eventData.eventStarts;
        }
        if (eventData.eventEnds) {
            formattedEventData.eventEnds = eventData.eventEnds;
        }
        const response = await fetch(`${API_ENDPOINTS.UPDATE_EVENT}${eventId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify(formattedEventData),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Failed to update event", data.messages);
            return { success: false, messages: data.messages };
        }
        return { success: true };;
    } catch (error) {
        console.error("Error updating event:", error);
        return { success: false, messages: error };
    }
};

export const deleteEvent = async (eventId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.DELETE_EVENT}${eventId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (!response.ok) {
            console.error("Failed to delete event", response);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error deleting event:", error);
        return false;
    }
};

export const deleteUserByAdmin = async (userId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.DELETE_USER_BY_ADMIN}${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (!response.ok) {
            console.error("Failed to delete user");
        }
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
};

export const deleteUser = async (userId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.DELETE_USER}${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (!response.ok) {
            console.error("Failed to delete user");
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
};

export const updateUser = async (userId: number, updatedUserData: User): Promise<boolean> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.UPDATE_USER}${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: JSON.stringify(updatedUserData),
        });
        if (!response.ok) {
            console.error("Failed to update user");
        }
        return true;
    } catch (error) {
        console.error("Error updating user:", error);
        return false;
    }
};

export const getUserById = async (userId: number): Promise<User | null> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_USER_BY_ID}${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (!response.ok) {
            console.error("Failed to fetch user");
        }
        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

export const updateProfilePicture = async (userId: number, file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append("image", file);
    try {
        const response = await fetch(`${API_ENDPOINTS.UPDATE_PROFILE_PICTURE}${userId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: formData,
        });
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            return result.success;
        } else {
            return true;
        }
    } catch (error) {
        console.error("Failed to update profile picture", error);
        return false;
    }
};

export const updateEventPicture = async (eventId: number, file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append("eventImage", file);
    try {
        const response = await fetch(`${API_ENDPOINTS.UPDATE_EVENT_PICTURE}${eventId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${getCookie("token")}`
            },
            body: formData,
        });
        if (!response.ok) {
            console.error("Failed to update event picture");
        }

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            return result.success;
        } else {
            return true;
        }
    } catch (error) {
        console.error("Failed to update event picture", error);
        return false;
    }
};


export const fetchProfilePicture = async (userid: number): Promise<string> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_PROFILE_PICTURE}${userid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (!response.ok) {
            console.error('Failed to fetch profile picture');
        }
        const arrayBuffer = await response.arrayBuffer();
        const base64String = arrayBufferToBase64(arrayBuffer);
        return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        return "";
    }
};

export const fetchEventPicture = async (eventid: number): Promise<string> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_EVENT_PICTURE}${eventid}`);
        if (!response.ok) {
            console.error('Failed to fetch event picture');
        }
        const arrayBuffer = await response.arrayBuffer();
        const base64String = arrayBufferToBase64(arrayBuffer);
        return `data:image/jpeg;base64,${base64String}`;

    } catch (error) {
        // console.error('Error fetching event picture:', error); 
        return "";
    }
};

export const joinEvent = async (userId: number, eventId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.JOIN_EVENT}${userId}/${eventId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
        }

        return true;
    } catch (error) {
        console.error('Error joining event:', error);
        return false;
    }
};

export const unjoinEvent = async (userId: number, eventId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.UNJOIN_EVENT}${userId}/${eventId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error('Failed to unjoin event');
        }
        return true;
    } catch (error) {
        console.error('Error unjoining event:', error);
        return false;
    }
};

export const getEventsJoinedByUser = async (userId: number): Promise<Event[]> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_EVENTS_JOINED_BY_USER}${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (!response.ok) {
            console.error('Failed to fetch events joined by user');
        }
        const events = await response.json();
        return events;
    } catch (error) {
        console.error('Error fetching events joined by user:', error);
        return [];
    }
};

export const getAllUsersJoinedToEvent = async (eventId: number): Promise<User[]> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_ALL_USERS_JOINED_TO_EVENT}${eventId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch users joined to event');
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching users joined to event:', error);
        return [];
    }
};

export const blockUser = async (userId: number) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.BLOCK_USER}${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`Error blocking user: ${response.statusText}`);
        }
        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Failed to block user:', error);
    }
}

export const unblockUser = async (userId: number) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.UNBLOCK_USER}${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`Error blocking user: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to block user:', error);
    }
}

export const getAllEventsAfterAttendance = async (userId: number) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_ALL_EVENTS_AFTER_ATTENDANCE}${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`Error fetching events after attendance: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to fetch events after attendance:', error);
    }
};

export const getAllUsersAfterAttendance = async (eventId: number) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_ALL_USERS_AFTER_ATTENDANCE}${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`Error fetching users after attendance: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to fetch users after attendance:', error);
    }
};

export const getEventNow = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.EVENT_NOW, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            return
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to fetch current event:', error);
    }
};

export const likeEvent = async (eventId: number, userId: number) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.LIKE_EVENT}${eventId}/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to like event:', error);
    }
};

export const dislikeEvent = async (eventId: number, userId: number) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.DISLIKE_EVENT}${eventId}/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to dislike event:', error);
    }
};

export const getEventById = async (eventId: number): Promise<Event | null> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_EVENT_BY_ID}${eventId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });
        if (!response.ok) {
            console.error(`Failed to fetch event with ID ${eventId}`);
        }
        const data: Event = await response.json();
        return data || null;
    } catch (error) {
        console.error(`Error fetching event with ID ${eventId}:`, error);
        return null;
    }
};

export const sendPasswordResetEmail = async (email: string) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.FORGOT_PASSWORD}?email=${encodeURIComponent(email)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.text()
            return data;
        } else {

            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return 'Failed to send password reset email.';
    }
};


export const verifyToken = async (token: string) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.VERIFY_TOKEN}?token=${encodeURIComponent(token)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error verifying token:', error);
        return { success: false, message: 'Failed to verify token.' };
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.NEW_PASSWORD}?token=${encodeURIComponent(token)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword }),
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error resetting password:', error);
        return { success: false, message: 'Failed to reset password.' };
    }
};

export const verifyPassword = async (userId: number, password: string) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.VERIFY_PASSWORD}${userId}/${encodeURIComponent(password)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`HTTP error status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error verifying password:', error);
        return { success: false, message: 'Failed to verify password.' };
    }
};

export const getEventPopularity = async (eventId: any) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.EVENT_POPULARITY}?eventId=${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching event popularity:', error);
        return { success: false, message: 'Failed to fetch event popularity.' };
    }
};

export const getJoinRate = async (eventId: any) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.JOIN_RATE}?eventId=${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching join rate:', error);
        return { success: false, message: 'Failed to fetch join rate.' };
    }
};

export const getEventTypeDistribution = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.EVENT_DISTRIBUTION, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching event type distribution:', error);
        return { success: false, message: 'Failed to fetch event type distribution.' };
    }
};

export const getEventSchedulingTrends = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.SCHEDULING_TRENDS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching event scheduling trends:', error);
        return { success: false, message: 'Failed to fetch event scheduling trends.' };
    }
};

export const getAverageEventDuration = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.AVERAGE_EVENT_DURATION, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching average event duration:', error);
        return { success: false, message: 'Failed to fetch average event duration.' };
    }
};

export const getDepartmentEngagement = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.DEPARTMENT_ENGAGEMENT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching department engagement:', error);
        return { success: false, message: 'Failed to fetch department engagement.' };
    }
};

export const setUserAsAdmin = async (userId: any) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.SET_ADMIN}${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error setting user as admin:', error);
        return { success: false, message: 'Failed to set user as admin.' };
    }
};

export const setUserAsStudent = async (userId: any) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.SET_STUDENT}${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error setting user as student:', error);
        return { success: false, message: 'Failed to set user as student.' };
    }
};

export const getAttendanceAndTimeout = async (userId: number, eventId: number): Promise<any> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_ATTENDANCE_AND_TIMEOUT}${userId}/${eventId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to fetch attendance and timeout:", errorData.messages);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching attendance and timeout:", error);
        return null;
    }
};

export const addComment = async (comment: any): Promise<any> => {
    try {
        const response = await fetch(API_ENDPOINTS.ADD_COMMENT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`,
            },
            body: JSON.stringify(comment)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to add comment:", errorData.messages);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding comment:", error);
        return null;
    }
};

export const getCommentsByEventId = async (eventId: number): Promise<any> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.GET_COMMENTS}${eventId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getCookie("token")}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to fetch comments:", errorData.messages);
            return null;
        }

        const data = await response.json();
        return data;  
    } catch (error) {
        console.error("Error fetching comments:", error);
        return null;
    }
};