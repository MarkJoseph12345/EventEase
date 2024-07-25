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
}

export interface Event {
    id?: number;
    eventName: string;
    eventDescription: string;
    eventStarts: Date | null;
    eventEnds: Date | null;
    likes?: number;
    dislikes?: number;
    usersLiked?: Set<string>;
    usersDisliked?: Set<string>;
    eventPicture?: string;
    department: string[]; 
    eventType: string[];
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
