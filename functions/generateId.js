export default function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9); // Tasodifiy ID yaratadi
}