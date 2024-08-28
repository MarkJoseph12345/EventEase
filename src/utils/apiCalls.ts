import { API_ENDPOINTS } from "@/utils/api";
import { getCookie, setCookie } from "@/utils/cookies";
import { Event, User } from "./interfaces";
import { arrayBufferToBase64 } from "./data";

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

        if (response.ok) {
            const tokenData = {
                id: data.user.id,
                username: data.user.username,
                role: data.user.role,
                department: data.user.department
            };

            setCookie("token", JSON.stringify(tokenData), 1);
            return { success: true };
        } else {
            return { success: false, message: data.message || "Invalid username or password" };
        }
    } catch (error) {
        return { success: false, message: "An error occurred, please try again" };
    }
};


export const registerAccount = async (userForm: any) => {
    try {
        const response = await fetch(API_ENDPOINTS.REGISTER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userForm),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: "Sign up successful!" };
        } else {
            return { success: false, message: data.message || "Sign up failed" };
            
        }
    } catch (error) {
        return { success: false, message: "An error occurred. Please try again." };
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
            throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};




export const createEvent = async (eventData: any) => {
    try {
        const formattedEventData = {
            eventName: eventData.eventName,
            eventDescription: eventData.eventDescription,
            eventStarts: eventData.eventStarts,
            eventEnds: eventData.eventEnds,
            eventPicture: eventData.eventPicture.split(',')[1],
            department: eventData.department,
            eventType: eventData.eventType,
            allowedGender: eventData.allowedGender,
            eventLimit: eventData.eventLimit
        };
        const response = await fetch(API_ENDPOINTS.CREATE_EVENT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedEventData),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(response.status)
            return { success: true, message: "Event creation successful!", id:data.id };
        } else {
            return { success: false, message: data.message || "Failed to create event" };
        }
    } catch (error) {
        console.log(error)
        return { success: false, message: "An error occurred, please try again" };
    }
};

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.GET_ALL_USERS, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
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
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch top three");
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
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch attendees");
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
        const formattedEventData = {
            eventName: eventData.eventName,
            eventDescription: eventData.eventDescription,
            eventStarts: eventData.eventStarts,
            eventEnds: eventData.eventEnds,
            department: eventData.department,
            eventType: eventData.eventType.join(', ')
        };
        const response = await fetch(`${API_ENDPOINTS.UPDATE_EVENT}${eventId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedEventData),
        });

        if (!response.ok) {
            throw new Error("Failed to update event");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating event:", error);
        return null;
    }
};

export const deleteEvent = async (eventId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.DELETE_EVENT}${eventId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete event");
        }

        return true;
    } catch (error) {
        console.error("Error deleting event:", error);
        return false;
    }
};

export const deleteUser = async (userId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.DELETE_USER}${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete user");
        }

        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
};

export const updateUser = async (userId: number, updatedUserData: User): Promise<boolean> => {
    console.log(JSON.stringify(updatedUserData, null, 2))
    try {
        const response = await fetch(`${API_ENDPOINTS.UPDATE_USER}${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUserData),
        });

        if (!response.ok) {
            throw new Error("Failed to update user");
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
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
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
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to update profile picture");
        }

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
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to update event picture");
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
        const response = await fetch(`${API_ENDPOINTS.GET_PROFILE_PICTURE}${userid}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch profile picture');
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
            throw new Error('Failed to fetch profile picture');
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const base64String = arrayBufferToBase64(arrayBuffer);
        return `data:image/jpeg;base64,${base64String}`;
        
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        return "";
    }
};

export const joinEvent = async (userId: number, eventId: number): Promise<boolean> => {
    try {

        
        const response = await fetch(`${API_ENDPOINTS.JOIN_EVENT}${userId}/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to join event');
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
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to unjoin event');
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
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch events joined by user');
        }

        const events = await response.json();
        return events;
    } catch (error) {
        console.error('Error fetching events joined by user:', error);
        return [];
    }
};
