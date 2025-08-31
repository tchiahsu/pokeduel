const API_URL_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  
// Handles deleting a room
export const handleDeleteRoom = async (roomID: string | undefined) => {
    try {
        console.log(roomID)
        if (!roomID) return;
        const response = await fetch(`${API_URL_BASE}/${roomID}`, {
        method: "DELETE",
        });
        if (!response.ok) {
        const data = await response.json();
        console.log("Server responded with error:", data.message);
        }
    } catch (error) {
        console.error("Error deleting room");
    }
};