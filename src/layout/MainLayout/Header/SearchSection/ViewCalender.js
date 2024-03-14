// import { MyCalendar } from "./MyCalender";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from "moment";
import { useParams } from "react-router-dom";

const ViewCalender = () => {
    const { userId } = useParams(); // Assuming userId is part of the route parameters

    return (
        <div style={{ height: '90vh', marginTop: '20px' }}>
            {/* <MyCalendar userId={userId} /> */}
        </div>
    );
}

export default ViewCalender;
