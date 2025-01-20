import Notification from '../models/notification.model.js';

export const getNotifications = async (req, res) => { 
    try {
        const userId = req.user._id;

		const notifications = await Notification.find({ to: userId }).populate({
			path: "from",
			select: "username profileImg",
		});

		await Notification.updateMany({ to: userId }, { read: true });

		res.status(200).json(notifications);

    } catch (error) {
        console.log("Error in getNotifications Controller: ", error.message);
        res.status(500).json("Internal Server error: ", error );
        
    }
}

export const deleteNotifications = async (req, res) => { 
    try {
        const userId = req.user._id;
       // if(!userId) return res.status(400).json({ error: "User not found" });

        await Notification.deleteMany({ to: userId });

        res.status(200).json("Notifications deleted successfully");
        
        
        
    } catch (error) {
        console.log("Error in deleteNotifications Controller: ", error.message);
        res.status(500).json("Internal Server error: ", error );
        
    }
}


export const deleteNotificationById = async (req, res) => {
    try {
        const notificationId = req.params.id;

        if (!notificationId) {
            return res.status(400).json({ error: "Notification ID is required" });
        }

        const deletedNotification = await Notification.findByIdAndDelete(notificationId);

        if (!deletedNotification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted successfully", deletedNotification });
    } catch (error) {
        console.log("Error in deleteNotificationById controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
