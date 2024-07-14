import { formatDate } from '@/utils/data';
import { FilteredEventListProps } from '../../utils/interfaces';

const StudentEventsFilteredList: React.FC<FilteredEventListProps> = ({ events, searchTerm, onEventClick, eventType = 'join' }) => {
    const filteredEvents = events.filter(event =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let noEventMessage = 'There are no upcoming events for your department.';
    if (eventType === 'registered') {
        noEventMessage = 'You have no events joined.';
    } else if (eventType === 'attended') {
        noEventMessage = 'You have not attended any events.';
    }

    return (
        <div className="tablet:flex tablet:justify-center tablet:gap-5 tablet:flex-wrap">
            {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                    <div key={event.id} className="flex items-center border border-gray-200 rounded-md p-4 mt-2 tablet:flex-col tablet:text-center" onClick={() => onEventClick(event)}>
                        <img src={event.eventPicture} alt={event.eventName} className="w-16 h-16 object-cover rounded-md mr-4 tablet:mr-0 tablet:w-72 tablet:h-56 tablet:object-fill" />
                        <div>
                            <p className="font-semibold">{event.eventName}</p>
                            <p className="text-gray-600">{formatDate(event.eventStarts)}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <img src="no-event-image.png" className="mb-4 w-44 h-44" alt="No events" />
                    {searchTerm ? (
                        <p className="text-center">No event found. Please try a different search term.</p>
                    ) : (
                        <p className="text-center">{noEventMessage}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentEventsFilteredList;
