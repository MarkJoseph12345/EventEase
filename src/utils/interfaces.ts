export interface User {
    id?: number;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    idNumber?: string;
    department?: string;
    profilePicture?: Blob;
    role?: string;
    gender?: string;
    blocked? : boolean;
    hasAttended?: boolean;
    profilePictureName?: string;
    uuid?: string;
    newPassword?: string;
}

export interface Event {
    id?: number;
    eventName: string;
    eventDescription: string;
    eventStarts: Date | null;
    eventEnds: Date | null;
    likes?: number;
    dislikes?: number;
    usersLiked?: string[];
    usersDisliked?: string[];
    eventPicture?: string;
    department: string[]; 
    eventType: string;
    allowedGender?: string;
    eventLimit?: number;
    preRegisteredUsers?: string[];
    createdBy?: string;
}

export interface EventDetailModal {
    event: Event;
    onClose: () => void;
    onJoinUnjoin?: (eventId: number) => void;
}


export interface FilteredEventListProps {
    events: Event[];
    searchTerm: string;
    onEventClick: (event: Event) => void;
    eventType?: 'registered' | 'attended' | 'join';
}