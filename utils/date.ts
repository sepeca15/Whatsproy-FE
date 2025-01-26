import moment from 'moment';

export const removeTimeZone = (dateString: any) => {
    const date = moment(dateString);
    const dateWithoutTimeZone = date.format("YYYY-MM-DD HH:mm:ss");
    return dateWithoutTimeZone;
}