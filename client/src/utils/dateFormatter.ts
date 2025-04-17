import moment from "moment";

const formatDate = (date: string): string => {
    return moment(date).format("DD/MM/YYYY");
}

export {
    formatDate
}